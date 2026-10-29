"""Exercise the real video component using temporary, visibly synthetic test footage.

Needs Python Playwright, Chromium, FFmpeg and the app's installed dependencies.
Starts/stops a separate dev server; never adds the fixture to the site or export.
"""
import json
import os
from pathlib import Path
import signal
import subprocess
import tempfile
import time
from urllib.request import urlopen
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'test-results' / 'video'
OUT.mkdir(parents=True, exist_ok=True)
BASE = 'http://localhost:3001'
results = []


def progress(page, amount):
    page.evaluate('''p => {
      const root = document.querySelector('.ritual');
      const distance = innerHeight * (innerWidth < 768 ? 1.65 : 2.2);
      scrollTo({top: root.getBoundingClientRect().top + scrollY + distance * p, behavior: 'instant'});
    }''', amount)
    page.wait_for_timeout(1400)


with tempfile.TemporaryDirectory(prefix='citrus-video-test-') as directory:
    fixture = Path(directory) / 'synthetic-test-only.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i',
                    'testsrc2=size=320x180:rate=24:duration=5', '-c:v', 'libx264',
                    '-preset', 'ultrafast', '-crf', '32', '-g', '4', '-keyint_min', '4',
                    '-sc_threshold', '0', '-an', '-movflags', '+faststart', str(fixture)], check=True)
    env = dict(os.environ, NEXT_PUBLIC_POUR_VIDEO_1080='/__test_clip_1080.mp4',
               NEXT_PUBLIC_POUR_VIDEO_720='/__test_clip_720.mp4', NEXT_TELEMETRY_DISABLED='1')
    env.pop('NEXT_PUBLIC_BASE_PATH', None)
    env.pop('STATIC_EXPORT', None)
    with (OUT / 'server.log').open('w') as log:
        server = subprocess.Popen(['npm', 'run', 'dev', '--', '--port', '3001'],
                                  cwd=ROOT, env=env, stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
        try:
            deadline = time.monotonic() + 90
            while True:
                try:
                    with urlopen(BASE, timeout=2) as response:
                        assert response.status == 200
                    break
                except Exception:
                    if server.poll() is not None or time.monotonic() > deadline:
                        raise RuntimeError('Video test server failed; inspect test-results/video/server.log')
                    time.sleep(.5)

            with sync_playwright() as p:
                browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
                for width, save_data, expected in [(1440, False, '1080'), (390, False, '720'), (1440, True, '720')]:
                    context = browser.new_context(viewport={'width': width, 'height': 960})
                    page = context.new_page()
                    requests, errors = [], []
                    page.on('pageerror', lambda error: errors.append(str(error)))
                    page.route('**/__test_clip_*.mp4', lambda route: (
                        requests.append(route.request.url),
                        route.fulfill(path=str(fixture), content_type='video/mp4')))
                    page.add_init_script('''
                      window.__mediaAudit = {playCalls: 0, overlappingSeeks: 0, seeks: 0};
                      const play = HTMLMediaElement.prototype.play;
                      HTMLMediaElement.prototype.play = function(...args) {
                        window.__mediaAudit.playCalls++; return play.apply(this, args);
                      };
                      const descriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime');
                      Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
                        ...descriptor, set(value) {
                          window.__mediaAudit.seeks++;
                          if (this.seeking) window.__mediaAudit.overlappingSeeks++;
                          descriptor.set.call(this, value);
                        }
                      });
                    ''')
                    if save_data:
                        page.add_init_script("Object.defineProperty(navigator, 'connection', {value: {saveData: true}})")
                    page.goto(BASE, wait_until='networkidle')
                    try:
                        page.wait_for_selector('.ritual[data-motion-ready="true"][data-video-ready="true"]')
                    except Exception:
                        print({'requests': requests, 'errors': errors, 'state': page.locator('.ritual-video').evaluate('v => ({src: v.src, readyState: v.readyState, networkState: v.networkState, error: v.error && {code: v.error.code, message: v.error.message}, root: v.closest(".ritual").dataset})')}, flush=True)
                        raise
                    # React Strict Mode deliberately mounts/cleans up twice in development.
                    assert requests and all(f'_{expected}.mp4' in url for url in requests), requests
                    video = page.locator('.ritual-video')
                    assert video.evaluate('v => v.src.startsWith("blob:") && v.paused && !v.loop && !v.controls')
                    progress(page, 0)
                    page.mouse.move(width / 2, 450)
                    distance = 960 * (1.65 if width < 768 else 2.2)
                    page.mouse.wheel(0, round(distance * .45))
                    page.wait_for_timeout(1500)
                    state = video.evaluate('v => ({time: v.currentTime, duration: v.duration, paused: v.paused})')
                    assert abs(state['time'] - .45 * (state['duration'] - 1 / 48)) < .04, state
                    assert state['paused']
                    progress(page, 1)
                    state = video.evaluate('v => ({time: v.currentTime, duration: v.duration, paused: v.paused})')
                    assert abs(state['time'] - (state['duration'] - 1 / 48)) < .025, state
                    assert state['time'] < state['duration']
                    assert video.evaluate('v => getComputedStyle(v).opacity === "1" && getComputedStyle(v).visibility === "visible"')
                    progress(page, 0)
                    assert video.evaluate('v => v.currentTime < .025 && v.paused')
                    audit = page.evaluate('window.__mediaAudit')
                    assert audit['playCalls'] == 0 and audit['overlappingSeeks'] == 0 and audit['seeks'] > 10, audit
                    page.wait_for_timeout(250)
                    assert page.evaluate('window.__mediaAudit.seeks') == audit['seeks'], 'Idle video keeps seeking'
                    page.emulate_media(reduced_motion='reduce')
                    page.wait_for_timeout(250)
                    assert video.get_attribute('src') is None
                    assert page.locator('.ritual').get_attribute('data-video-ready') is None
                    page.emulate_media(reduced_motion='no-preference')
                    page.wait_for_selector('.ritual[data-video-ready="true"]')
                    assert not errors, errors
                    results.append({'width': width, 'save_data': save_data, 'source': expected,
                                    'wheel_scrubbing': 'pass', 'reverse_and_end_guard': 'pass',
                                    'never_played_or_overlapping_seeks': 'pass', 'reduced_motion_cleanup': 'pass',
                                    'test_media': 'synthetic FFmpeg fixture, never shipped'})
                    context.close()

                page = browser.new_page(reduced_motion='reduce')
                requested = []
                page.on('request', lambda request: requested.append(request.url) if '__test_clip_' in request.url else None)
                page.goto(BASE, wait_until='networkidle')
                assert not requested
                page.close()
                page = browser.new_page()
                page.route('**/__test_clip_*.mp4', lambda route: route.fulfill(status=404, body='Missing test clip'))
                page.goto(BASE, wait_until='networkidle')
                page.wait_for_selector('.ritual[data-motion-ready="true"]')
                progress(page, .5)
                assert page.locator('.ritual').get_attribute('data-video-ready') is None
                assert page.locator('.ritual-video').evaluate('v => getComputedStyle(v).visibility') == 'hidden'
                assert page.locator('.ritual-shot img').is_visible()
                results.append({'initial_reduced_motion': 'no video request', 'missing_video': 'photographic fallback retained'})
                browser.close()
        finally:
            os.killpg(server.pid, signal.SIGTERM)
            server.wait(timeout=15)

(OUT / 'results.json').write_text(json.dumps(results, indent=2))
print(json.dumps(results, indent=2))

"""Run against `npm run start`: python tests/browser.py. Uses system Chromium."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path('test-results')
OUT.mkdir(exist_ok=True)
results = []
BASE_URL = os.environ.get('BASE_URL', 'http://127.0.0.1:3000').rstrip('/') + '/'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True,
        args=['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    for width in [375, 390, 768, 1024, 1440]:
        page = browser.new_page(viewport={'width': width, 'height': 900}, device_scale_factor=1)
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        responses = []
        page.on('response', lambda response: responses.append((response.status, response.url)) if response.status >= 400 else None)
        page.goto(BASE_URL, wait_until='networkidle')
        page.evaluate('document.fonts.ready')
        assert page.title() == 'CITRUS 01 — A bright idea. In a can.'
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Overflow at {width}'
        assert page.locator('h1').is_visible()
        assert page.locator('.hero-photo img').evaluate('(img)=>img.complete && img.naturalWidth > 0'), 'Hero image did not load'
        page.screenshot(path=str(OUT / f'hero-{width}.png'))
        section = page.locator('#experience')
        section.scroll_into_view_if_needed()
        page.wait_for_selector('.scene canvas', timeout=30000)
        page.wait_for_function("!document.querySelector('#pour-progress').disabled")
        def seek(progress):
            page.evaluate('''p => {
                const s=document.querySelector('#experience');
                scrollTo({top:s.getBoundingClientRect().top+scrollY+p*(s.offsetHeight-innerHeight),behavior:'instant'});
            }''', progress)
            page.wait_for_timeout(350)
        seek(.10)
        start = page.locator('.scene canvas').screenshot()
        assert float(page.locator('.scene').get_attribute('data-fill')) == 0
        seek(.7)
        filling = page.locator('.scene canvas').screenshot()
        assert page.locator('.scene').get_attribute('data-pouring') == 'true'
        assert .1 < float(page.locator('.scene').get_attribute('data-fill')) < .95
        assert start != filling, 'WebGL pixels did not change while pouring'
        page.screenshot(path=str(OUT / f'pour-{width}.png'))
        seek(.99)
        assert float(page.locator('.scene').get_attribute('data-fill')) == 1
        assert page.locator('.scene').get_attribute('data-pouring') == 'false'
        seek(.10)
        assert float(page.locator('.scene').get_attribute('data-fill')) == 0, 'Reverse scrub did not empty glass'
        reverse = page.locator('.scene canvas').screenshot()
        assert reverse == start, 'Reverse scrub did not return to the same rendered pose'
        slider = page.locator('#pour-progress')
        slider.focus()
        slider.press('End')
        page.wait_for_timeout(200)
        assert float(page.locator('.scene').get_attribute('data-fill')) == 1
        slider.press('Home')
        page.wait_for_timeout(200)
        assert float(page.locator('.scene').get_attribute('data-fill')) == 0
        page.locator('a[href="#contact"]').first.click()
        page.wait_for_timeout(500)
        page.get_by_role('button', name='Preview enquiry').click()
        assert not page.locator('#name').evaluate('(el)=>el.validity.valid')
        page.locator('#name').fill('Alex Taylor')
        page.locator('#email').fill('not-an-email')
        assert not page.locator('#email').evaluate('(el)=>el.validity.valid')
        page.locator('#email').fill('alex@example.com')
        page.locator('#message').fill('A bright new concept collaboration.')
        page.get_by_role('button', name='Preview enquiry').click()
        assert 'Nothing was sent' in page.get_by_role('status').inner_text()
        page.screenshot(path=str(OUT / f'contact-{width}.png'))
        assert not errors, errors
        assert not responses, responses
        results.append({'width': width, 'overflow': False, 'pour': 'forward + reverse pixel match', 'keyboard': 'pass', 'form': 'pass', 'runtime_errors': errors})
        page.close()
    page = browser.new_page(viewport={'width': 390, 'height': 844}, reduced_motion='reduce')
    page.goto(BASE_URL, wait_until='networkidle')
    page.locator('#experience').scroll_into_view_if_needed()
    page.wait_for_selector('.experience.reduced')
    page.wait_for_function("document.querySelector('.scene').dataset.fill === '1.000'")
    assert page.locator('.experience-sticky').evaluate("el=>getComputedStyle(el).position") == 'relative'
    page.locator('#pour-progress').focus()
    page.locator('#pour-progress').press('Home')
    assert float(page.locator('.scene').get_attribute('data-fill')) == 0
    page.emulate_media(reduced_motion='no-preference')
    page.wait_for_function("!document.querySelector('.experience').classList.contains('reduced')")
    results.append({'reduced_motion': 'no pin, no scroll animation, manual keyboard exploration, preference change supported'})
    page.close()
    # The approved still remains useful when WebGL is unavailable.
    page = browser.new_page(viewport={'width': 390, 'height': 844})
    page.add_init_script("const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,...args){return t.startsWith('webgl')?null:original.call(this,t,...args)}")
    page.goto(BASE_URL, wait_until='networkidle')
    page.locator('#experience').scroll_into_view_if_needed()
    page.get_by_text('3D isn’t available on this device.', exact=False).wait_for()
    assert page.locator('#pour-progress').is_disabled()
    results.append({'webgl_unavailable': 'honest still fallback, disabled 3D control'})
    browser.close()

(OUT / 'results.json').write_text(json.dumps(results, indent=2))
print(json.dumps(results, indent=2))

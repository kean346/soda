"""Real-browser regression checks; run with a local server and Python Playwright."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get('BASE_URL', 'http://127.0.0.1:3000').rstrip('/') + '/'
OUT = Path(os.environ.get('SCREENSHOT_DIR', 'test-results/rebuild-final'))
OUT.mkdir(parents=True, exist_ok=True)
MOTION_ONLY = os.environ.get('MOTION_ONLY') == '1'
results = []


def settle(page):
    page.wait_for_timeout(850)


def go_to(page, selector):
    page.evaluate('''s => {
        const node = document.querySelector(s);
        window.scrollTo({top: node.getBoundingClientRect().top + scrollY, behavior: 'instant'});
    }''', selector)
    settle(page)


def pose(page):
    return page.locator('.can-rig').evaluate("el => getComputedStyle(el).transform")


def fill_fraction(page):
    """Read the visible fill boundary, rather than treating any transform as a fill."""
    return page.locator('.liquid-fill').evaluate(r'''el => {
        const clip = getComputedStyle(el).clipPath;
        const match = /^inset\(([\d.]+)%/.exec(clip);
        if (!match) throw new Error(`Expected a measurable liquid clip boundary, got ${clip}`);
        return 1 - Number(match[1]) / 100;
    }''')


def stream_geometry(page):
    """Measure the rendered SVG endpoints in the same screen space as its objects."""
    return page.locator('.pour-stream-path').evaluate('''path => {
        const point = at => {
            const local = path.getPointAtLength(at);
            const screen = new DOMPoint(local.x, local.y).matrixTransform(path.getScreenCTM());
            return {x: screen.x, y: screen.y};
        };
        const centre = selector => {
            const rect = document.querySelector(selector).getBoundingClientRect();
            return {x: rect.x + rect.width / 2, y: rect.y + rect.height / 2};
        };
        const start = point(0), end = point(path.getTotalLength());
        const mouth = centre('.can-mouth'), lip = centre('.glass-lip');
        const stream = getComputedStyle(path.closest('.pour-stream'));
        const style = getComputedStyle(path);
        return {
            sourceGap: Math.hypot(start.x - mouth.x, start.y - mouth.y),
            landingGap: Math.hypot(end.x - lip.x, end.y - lip.y),
            drop: end.y - start.y,
            opacity: Number(stream.opacity), visibility: stream.visibility,
            strokeWidth: Number.parseFloat(style.strokeWidth),
            dashOffset: Number.parseFloat(style.strokeDashoffset),
            length: path.getTotalLength()
        };
    }''')


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    for width, height in [(1440, 1000), (1024, 900), (768, 1024), (390, 844), (360, 740)]:
        context = browser.new_context(viewport={'width': width, 'height': height}, device_scale_factor=1)
        page = context.new_page()
        errors, failures, posts = [], [], []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('response', lambda r: failures.append(f'{r.status} {r.url}') if r.status >= 400 else None)
        page.on('request', lambda r: posts.append(r.url) if r.method == 'POST' else None)
        page.goto(BASE, wait_until='networkidle')
        page.wait_for_selector('.ritual[data-motion-ready="true"]')
        page.wait_for_timeout(1700)
        assert page.title() == 'CITRUS 01 — A little liquid sunshine.'
        assert page.locator('h1').is_visible()
        assert page.locator('input[type="range"], canvas').count() == 0
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'{width}: horizontal overflow'
        heading = page.locator('h1').bounding_box()
        assert heading['x'] >= 0 and heading['x'] + heading['width'] <= width + 1
        assert page.locator('.hero-media img').evaluate('img => img.complete && img.naturalWidth > 0')
        page.screenshot(path=str(OUT / f'hero-{width}.png'))

        # Ordinary wheel input must control both the actual CSS image transform and timeline.
        go_to(page, '.ritual')
        page.mouse.move(width / 2, height / 2)
        initial_pose = pose(page)
        initial_tab = page.locator('.can-tab').evaluate('el => getComputedStyle(el).transform')
        initial_fill = fill_fraction(page)
        distance = height * (4.8 if width < 768 else 5.5)
        page.mouse.wheel(0, round(distance * .55))
        settle(page)
        forward = float(page.locator('.ritual').get_attribute('data-visual-progress'))
        assert .50 < forward < .60, f'Wheel did not advance timeline: {forward}'
        assert pose(page) != initial_pose, 'Image did not actually move'
        angle = page.locator('.can-rig').evaluate('''el => {
            const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform);
            return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
        }''')
        assert 90 < angle < 140, f'{width}: can opening has not tipped below its base: {angle} degrees'
        assert page.locator('.ritual-stage').evaluate('el => getComputedStyle(el).position') == 'fixed'
        assert page.locator('.ritual-step--pour').evaluate('el => Number(getComputedStyle(el).opacity)') > .9
        assert page.locator('.can-tab').evaluate('el => getComputedStyle(el).transform') != initial_tab, 'The tab never opened'
        geometry = stream_geometry(page)
        assert geometry['sourceGap'] < 2, f'{width}: stream misses the can opening: {geometry}'
        assert geometry['landingGap'] < 2, f'{width}: stream misses the glass: {geometry}'
        assert geometry['opacity'] > .9 and geometry['visibility'] == 'visible', f'Stream is hidden: {geometry}'
        assert geometry['strokeWidth'] >= 4, f'{width}: stream is too thin to see: {geometry}'
        assert geometry['drop'] > 12 and geometry['length'] > 12, f'{width}: stream does not fall into the glass: {geometry}'
        assert abs(geometry['dashOffset']) < .01, f'Stream path is still masked: {geometry}'
        assert fill_fraction(page) > initial_fill + .05, 'The liquid did not visibly rise'
        page.screenshot(path=str(OUT / f'ritual-middle-{width}.png'))
        page.mouse.wheel(0, -round(distance * .55))
        settle(page)
        backward = float(page.locator('.ritual').get_attribute('data-visual-progress'))
        assert backward < .01, f'Wheel did not reverse timeline: {backward}'
        assert pose(page) == initial_pose, 'Reverse scroll did not restore the same camera pose'
        assert abs(fill_fraction(page) - initial_fill) < .005, 'Reverse scroll did not empty the glass'
        page.screenshot(path=str(OUT / f'ritual-start-{width}.png'))

        # The fill must continue rising while pouring, and reverse to the same level.
        page.mouse.wheel(0, round(distance * .47))
        settle(page)
        early_fill = fill_fraction(page)
        fill_step = .27 if MOTION_ONLY else .23
        page.mouse.wheel(0, round(distance * fill_step))
        settle(page)
        later_fill = fill_fraction(page)
        assert later_fill > early_fill + .25, f'{width}: glass is not filling: {early_fill} -> {later_fill}'
        page.screenshot(path=str(OUT / f'ritual-filling-{width}.png'))
        page.mouse.wheel(0, -round(distance * fill_step))
        settle(page)
        assert abs(fill_fraction(page) - early_fill) < .005, 'Liquid level does not reverse with scroll'
        page.mouse.wheel(0, -round(distance * .47))
        settle(page)

        # Keyboard page scrolling is an independent way to progress; no scene controls exist.
        page.keyboard.press('PageDown')
        settle(page)
        assert float(page.locator('.ritual').get_attribute('data-visual-progress')) > .1
        go_to(page, '.ritual')
        page.mouse.wheel(0, round(distance * .96))
        settle(page)
        assert float(page.locator('.ritual').get_attribute('data-visual-progress')) > .93
        assert page.locator('.ritual-step--finish').evaluate('el => Number(getComputedStyle(el).opacity)') > .9
        assert fill_fraction(page) > .85, 'The final glass is not filled'
        assert page.locator('.ritual-chapter').inner_text() == '04 / Enjoy'
        page.screenshot(path=str(OUT / f'ritual-end-{width}.png'))
        page.mouse.wheel(0, height + round(distance * .2))
        settle(page)
        assert page.locator('.ritual-stage').evaluate('el => getComputedStyle(el).position') != 'fixed', 'Pin did not release'

        if MOTION_ONLY:
            assert not errors, errors
            assert not failures, failures
            results.append({'width': width, 'height': height, 'can_pour_angle': round(angle, 2),
                            'wheel_forward_reverse': 'pass', 'stream_geometry': 'within 2px; visible and falls downward',
                            'visible_fill_forward_reverse': 'pass', 'pin_release': 'pass', 'runtime_errors': errors})
            context.close()
            continue

        # Inspect the complete page and all lazy-loaded images, not just the hero.
        for selector in ['.product', '.sensory', '.lifestyle', '.contact', '.site-footer']:
            go_to(page, selector)
            for image in page.locator(f'{selector} img').all():
                image.wait_for(state='visible')
                page.wait_for_function('(img) => img.complete && img.naturalWidth > 0', arg=image.element_handle())
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            page.locator(selector).screenshot(path=str(OUT / f'{selector[1:]}-{width}.png'))

        # Demo validation focuses the first invalid field and never makes a submission.
        go_to(page, '.contact')
        button = page.get_by_role('button', name='Preview your note')
        button.click()
        assert page.locator('#name').evaluate('el => document.activeElement === el')
        assert page.locator('#name-error').is_visible()
        page.locator('#name').fill('Alex Taylor')
        page.locator('#email').fill('invalid-email')
        page.locator('#message').fill('A bright new creative collaboration.')
        button.click()
        assert page.locator('#email-error').is_visible()
        page.locator('#email').fill('alex@example.com')
        button.click()
        assert 'Nothing was sent' in page.get_by_role('status').inner_text()
        assert not posts, posts
        assert not errors, errors
        assert not failures, failures
        results.append({'width': width, 'height': height, 'wheel_forward_reverse': 'pass', 'stream_geometry': 'can opening to glass lip, within 2px', 'visible_fill_forward_reverse': 'pass', 'tab_opening': 'pass', 'keyboard': 'pass', 'pin_release': 'pass', 'form': 'pass', 'image_loads': 'pass', 'overflow': False, 'runtime_errors': errors})
        context.close()

    if MOTION_ONLY:
        browser.close()
        (OUT / 'results.json').write_text(json.dumps(results, indent=2))
        print(json.dumps(results, indent=2))
        raise SystemExit(0)

    # Native touch scrolling, rather than programmatically setting animation progress.
    context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
    page = context.new_page()
    page.goto(BASE, wait_until='networkidle')
    page.wait_for_selector('.ritual[data-motion-ready="true"]')
    go_to(page, '.ritual')
    session = context.new_cdp_session(page)
    session.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': 195, 'y': 650}]})
    for y in range(620, 150, -30):
        session.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': 195, 'y': y}]})
        page.wait_for_timeout(25)
    session.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
    settle(page)
    assert float(page.locator('.ritual').get_attribute('data-visual-progress')) > .1
    results.append({'native_touch_scroll': 'advances the timeline'})

    # Resize tears down the prior pin and creates exactly one correct pin.
    page.set_viewport_size({'width': 1024, 'height': 900})
    settle(page)
    assert page.locator('.pin-spacer').count() == 1
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    context.close()

    page = browser.new_page(viewport={'width': 390, 'height': 844}, reduced_motion='reduce')
    page.goto(BASE, wait_until='networkidle')
    go_to(page, '.ritual')
    assert page.locator('.pin-spacer').count() == 0
    assert page.locator('.ritual-stage').evaluate('el => getComputedStyle(el).position') == 'relative'
    assert page.locator('.can-rig').evaluate('el => getComputedStyle(el).transform') == 'none'
    page.screenshot(path=str(OUT / 'reduced-motion.png'))
    page.emulate_media(reduced_motion='no-preference')
    page.wait_for_selector('.ritual[data-motion-ready="true"]')
    assert page.locator('.pin-spacer').count() == 1
    page.emulate_media(reduced_motion='reduce')
    settle(page)
    assert page.locator('.pin-spacer').count() == 0
    results.append({'reduced_motion': 'static scene, no pin, preference changes cleanly rebuild motion'})
    page.close()

    page = browser.new_page(viewport={'width': 390, 'height': 844}, java_script_enabled=False)
    page.goto(BASE, wait_until='networkidle')
    assert page.locator('h1').is_visible()
    assert page.locator('main section').count() == 6
    assert page.locator('.pin-spacer').count() == 0
    assert page.get_by_role('button', name='Preview your note').is_disabled()
    go_to(page, '.contact')
    # Playwright's text engine excludes noscript; inspect its rendered paragraph directly.
    assert page.locator('noscript .form-disclosure').is_visible()
    assert 'Enable JavaScript' in page.locator('noscript .form-disclosure').inner_text()
    results.append({'no_javascript': 'all content present; demo cannot submit personal details'})
    page.close()
    browser.close()

(OUT / 'results.json').write_text(json.dumps(results, indent=2))
print(json.dumps(results, indent=2))

from pathlib import Path
from bs4 import BeautifulSoup
import json

root = Path('/tmp/biblia-dom-qa')
reports = []
for html_path in sorted(root.glob('*.html')):
    soup = BeautifulSoup(html_path.read_text(errors='ignore'), 'html.parser')
    images = soup.find_all('img')
    buttons = soup.find_all('button')
    controls = soup.find_all(['input', 'textarea', 'select'])
    image_gaps = [str(image)[:260] for image in images if not (image.get('alt') or '').strip()]
    button_gaps = []
    for button in buttons:
        name = ' '.join(button.get_text(' ', strip=True).split()) or button.get('aria-label') or button.get('title')
        if not name:
            button_gaps.append(str(button)[:260])
    control_gaps = []
    for control in controls:
        labelled = bool((control.get('aria-label') or control.get('aria-labelledby') or '').strip())
        if not labelled and control.get('id'):
            labelled = soup.find('label', attrs={'for': control.get('id')}) is not None
        if not labelled:
            parent_label = control.find_parent('label')
            labelled = parent_label is not None
        if not labelled:
            control_gaps.append(str(control)[:260])
    body_text = soup.get_text(' ', strip=True)
    reports.append({
        'route': html_path.stem,
        'images': len(images),
        'buttons': len(buttons),
        'controls': len(controls),
        'imageGaps': len(image_gaps),
        'buttonNameGaps': len(button_gaps),
        'controlNameGaps': len(control_gaps),
        'errorBoundary': 'Algo deu errado' in body_text or 'ErrorBoundary' in body_text,
        'loadingState': 'Preparando o atlas' in body_text,
        'imageSamples': image_gaps[:5],
        'buttonSamples': button_gaps[:5],
        'controlSamples': control_gaps[:5],
    })

result = {
    'routes': reports,
    'routeCount': len(reports),
    'errorRoutes': [report['route'] for report in reports if report['errorBoundary']],
    'routesWithLoadingState': [report['route'] for report in reports if report['loadingState']],
    'status': 'APROVADA' if all(report['imageGaps'] == 0 and report['buttonNameGaps'] == 0 and report['controlNameGaps'] == 0 and not report['errorBoundary'] for report in reports) else 'REVISAR',
}
Path('audit/dom-accessibility-final.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(result, ensure_ascii=False, indent=2))

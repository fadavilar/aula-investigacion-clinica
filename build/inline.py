#!/usr/bin/env python3
"""Genera dist/aula.html: un solo archivo con CSS, datos y JS en línea."""
import pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text(encoding='utf8')
css = (root / 'css/styles.css').read_text(encoding='utf8')
data = (root / 'data/contenidos.js').read_text(encoding='utf8')
js = (root / 'js/app.js').read_text(encoding='utf8')
html = html.replace('<link rel="stylesheet" href="css/styles.css">', '<style>\n' + css + '\n</style>')
html = html.replace('<script src="data/contenidos.js"></script>', '<script>\n' + data + '\n</script>')
html = html.replace('<script src="js/app.js"></script>', '<script>\n' + js + '\n</script>')
out = root / 'dist'
out.mkdir(exist_ok=True)
(out / 'aula.html').write_text(html, encoding='utf8')
print('dist/aula.html', len(html), 'bytes')

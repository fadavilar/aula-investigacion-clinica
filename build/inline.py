#!/usr/bin/env python3
"""Genera dist/aula.html: un solo archivo con CSS, datos y JS en línea (para correo o aula virtual)."""
import pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text(encoding='utf8')


def css(m):
    return '<style>\n' + (root / m.group(1)).read_text(encoding='utf8') + '\n</style>'


def js(m):
    return '<script>\n' + (root / m.group(1)).read_text(encoding='utf8') + '\n</script>'


html, n_css = re.subn(r'<link rel="stylesheet" href="([^"?]+)(?:\?v=\d+)?">', css, html)
html, n_js = re.subn(r'<script src="([^"?]+)(?:\?v=\d+)?"></script>', js, html)
out = root / 'dist'
out.mkdir(exist_ok=True)
(out / 'aula.html').write_text(html, encoding='utf8', newline='\n')
print('dist/aula.html', len(html), 'bytes;', n_css, 'hojas de estilo y', n_js, 'scripts en línea')

# Aula de investigación clínica: guía para Claude Code

App estática en español, sin dependencias, construida con el motor de la skill `explorador-interactivo`. El material didáctico vive en `data/contenidos.js`; portada, glosario y referencias en `js/contenido.js`; secciones y gráficos en `js/app.js`. `js/motor.js`, `css/style.css` y `css/motor.css` vienen de la skill y no se editan: la paleta y los estilos propios van en `css/aula.css`.

## Reglas
- Las calculadoras de muestreo reproducen el libro `Muestreo.xlsx` del autor. Si cambias una fórmula, compara los seis resultados con los valores de ejemplo del Excel (CAFI 369,97; CAIN 384,15; NUFI 383,85; NUIN 384,15; COCA 19,38; CONU 58,27) con `window.AULA.calcular` en la consola.
- Verifica en 1360 y 375 px, en claro y oscuro y con los cuatro tamaños de letra: sin desborde horizontal y texto de los gráficos de 12 px o más.
- Cada cambio publicado sube `?v=N` en todos los enlaces de `index.html`.
- No nombres ninguna institución en el código, los textos ni los commits: el material debe poder reutilizarse en cualquier curso.
- No pongas datos de estudiantes, listas ni notas en el repositorio.
- Las preguntas de `practica` son públicas, con su respuesta. Las preguntas de examen nunca van en este repositorio.
- Enlaces solo verificados; no inventes DOI ni URL. Si un enlace no abre, avísalo.
- Al cambiar contenido: sube `meta.version` y `meta.actualizado`, ejecuta `python3 build/inline.py` y confirma que `dist/aula.html` abre sin errores en la consola.
- Escribe en español de Colombia, con signos de interrogación de apertura y cierre.

## Comandos
- Vista previa local: `python -m http.server` en la carpeta del repo y abrir `http://localhost:8000` (abrir el archivo directamente también funciona).
- Archivo único: `python3 build/inline.py`.

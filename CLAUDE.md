# Aula de investigación clínica: guía para Claude Code

App estática en español, sin dependencias. El contenido vive en `data/contenidos.js`; la lógica en `js/app.js`.

## Reglas
- No nombres ninguna institución en el código, los textos ni los commits: el material debe poder reutilizarse en cualquier curso.
- No pongas datos de estudiantes, listas ni notas en el repositorio.
- Las preguntas de `practica` son públicas, con su respuesta. Las preguntas de examen nunca van en este repositorio.
- Enlaces solo verificados; no inventes DOI ni URL. Si un enlace no abre, avísalo.
- Al cambiar contenido: sube `meta.version` y `meta.actualizado`, ejecuta `python3 build/inline.py` y confirma que `dist/aula.html` abre sin errores en la consola.
- Escribe en español de Colombia, con signos de interrogación de apertura y cierre.

## Comandos
- Vista previa local: abrir `index.html` en el navegador.
- Archivo único: `python3 build/inline.py`.

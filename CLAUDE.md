# Aula de investigación clínica: guía para Claude Code

App estática en español, sin dependencias, construida con el motor de la skill `explorador-interactivo`. El material didáctico vive en `data/contenidos.js`; el banco de evaluación, los artículos y las rúbricas en `data/evaluacion.js`; portada, glosario y referencias en `js/contenido.js`; secciones y gráficos en `js/app.js`; evaluación, formularios y consolidador en `js/formularios.js`. `js/motor.js`, `css/style.css` y `css/motor.css` vienen de la skill y no se editan: la paleta y los estilos propios van en `css/aula.css`.

## Reglas
- Las calculadoras de muestreo reproducen el libro `Muestreo.xlsx` del autor. Si cambias una fórmula, compara los seis resultados con los valores de ejemplo del Excel (CAFI 369,97; CAIN 384,15; NUFI 383,85; NUIN 384,15; COCA 19,38; CONU 58,27) con `window.AULA.calcular` en la consola.
- Verifica en 1360 y 375 px, en claro y oscuro y con los cuatro tamaños de letra: sin desborde horizontal y texto de los gráficos de 12 px o más.
- Cada cambio publicado sube `?v=N` en todos los enlaces de `index.html`.
- No nombres ninguna institución en el código, los textos ni los commits: el material debe poder reutilizarse en cualquier curso.
- No pongas datos de estudiantes, listas ni notas en el repositorio. Los nombres solo existen en el navegador de cada estudiante, en los archivos que descarga y en el consolidador del docente; nada se envía a un servidor. Para los grupos escribe «primer año (R1)» o «segundo año (R2)»: el control de privacidad del repositorio (`grep` de términos institucionales) debe salir vacío.
- Las preguntas de `practica` y de `data/evaluacion.js` son públicas, con su respuesta. El taller de la rúbrica se toma de estas preguntas (intentos ilimitados, cuenta la mejor nota); cualquier pregunta de examen nunca va en este repositorio.
- Cada pregunta del banco lleva su resultado de aprendizaje (`ra`, definido en `EVAL.ras`) y sus rutas (`rutas: 'R1 R2'`). Una pregunta compartida se cuenta en el resultado equivalente del otro año según `EQUIV` en `js/formularios.js`.
- Las preguntas de los artículos solo afirman lo que dice el resumen en PubMed; si agregas un artículo, verifica PMID, DOI y cita con PubMed o Crossref.
- Cada pregunta tiene un alcance (`C` sesión conjunta, `R1`, `R2`): en `practicaMeta`, en el campo `rutas` del banco, en `alcance` de cada artículo (con `raC` para la sesión conjunta) y en el arreglo `conjunta`.
- El correo de las entregas (`evaluacion.correoDocente`) solo se publica con la autorización explícita del docente; mientras sea `null`, el estudiante escribe el destinatario. El docente autorizó (2026-11-27) su correo institucional: es la única excepción a la regla de no nombrar instituciones, así que el control de privacidad excluye esa línea: `grep -rniE "<términos>" . --exclude-dir=.git | grep -v "correoDocente"`.
- La nota mínima (`evaluacion.notaMinima` en `data/contenidos.js`) queda en `null` hasta que el docente la confirme con el reglamento de posgrado; no afirmes 3,0 ni 3,5 en ningún texto.
- Prueba de la calculadora de la nota: 4,0 / 3,5 / 4,5 / 4,0 da 3,9; todo en 5,0 da 5,0; todo en 0 da 0,0 (`window.AULA.notaDefinitiva`).
- Enlaces solo verificados; no inventes DOI ni URL. Si un enlace no abre, avísalo.
- Al cambiar contenido: sube `meta.version` y `meta.actualizado`, ejecuta `python3 build/inline.py` y confirma que `dist/aula.html` abre sin errores en la consola.
- Escribe en español de Colombia, con signos de interrogación de apertura y cierre.

## Comandos
- Vista previa local: `python -m http.server` en la carpeta del repo y abrir `http://localhost:8000` (abrir el archivo directamente también funciona).
- Archivo único: `python3 build/inline.py`.

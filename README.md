# Aula de investigación clínica

Documento web para estudiantes y docentes que va de la pregunta clínica al artículo publicable, preparado para primer año (R1: Metodología de la Investigación I y Lectura crítica) y segundo año (R2: Proyecto de investigación I y II). Abre con un resumen y un relato por pasos (el gráfico cambia al desplazarse) y sigue con cinco partes:

0. **Tres alcances del curso**, cada uno con su alcance, sus preguntas y sus entregas:
   - **Sesión conjunta (R1 y R2)**: objetivos, contenidos de la presentación de la primera sesión y bloques; preguntas propias; entregas de diagnóstico, ficha 1, árbol y Mendeley, coevaluación y tarea (pregunta PICO).
   - **Ruta R1 (primer año)**: sesiones del 4 y el 11 de diciembre; preguntas de Metodología I y Lectura crítica; entregas de ficha 2, pregunta con título y objetivos, y base de datos con histograma.
   - **Ruta R2 (segundo año)**: Proyecto I y II en síntesis; preguntas del protocolo y del avance; entregas de ficha 2 (igual que primer año), pregunta con título y objetivos, y entregables del proyecto como soporte. La nota de este ejercicio condensado se registra por duplicado para Proyecto de investigación I y II.
   - **Rúbrica y notas**: cuatro evidencias, calendario, calculadora de la nota y consolidador del docente.
1. **Planear el estudio**: constructor de la pregunta (PICO, frecuencia o PCC) con título y objetivos, árbol de decisión dibujado (empieza por el tipo de documento y llega a 13 diseños, entre ellos revisiones de alcance y narrativas, guías y evaluaciones económicas), lectura crítica asistida por IA con generador de instrucciones y verificación de retractaciones, las seis calculadoras de tamaño de muestra del libro `Muestreo.xlsx`, tipos de variable con estadística descriptiva en Excel, y la lista del protocolo con la categoría de riesgo de la Resolución 8430 de 1993.
2. **Leer y evaluar**: efecto (RR, OR, NNT), pronóstico (HR y curvas de supervivencia), pruebas diagnósticas (tabla de 2 × 2, razones de verosimilitud y probabilidad postest), metanálisis (forest plot con efecto fijo y aleatorio, I²), guías (AGREE II) y costo-efectividad (RCEI), cinco artículos reales de PubMed con preguntas de lectura crítica y preguntas de práctica.
3. **Sintetizar y publicar**: revisión sistemática con apoyo de IA, avance de resultados con plantilla de diccionario de variables, Mendeley, MyBib, identificadores (PMID, DOI o enlace), estilo Vancouver frente a APA y listas de verificación de Word, Excel y PowerPoint.
4. **Recursos**: mapas mentales, glosario con fuente en cada término y referencias verificadas.

## Evaluación y evidencias

- **Preguntas con intentos ilimitados** (`data/evaluacion.js`), una evaluación por alcance: sesión conjunta (15 preguntas por intento de un banco de 47, con cinco resultados de aprendizaje propios), R1 (15 de 24) y R2 (12 de 19). Cada intento reparte las preguntas entre los resultados de aprendizaje y baraja las opciones; guarda el historial y la mejor nota en el navegador del estudiante. Es un banco público y formativo: cuenta la mejor nota, y la idea es revisar por qué falló una respuesta y corregirla. Las preguntas de examen no van en este repositorio.
- **Envío por correo**: cada entrega descarga su archivo `.json` y abre el programa de correo del estudiante con asunto, resumen y código de verificación; el estudiante adjunta el archivo y lo envía. El correo es el soporte de entrega y de calificación. El destinatario está en `evaluacion.correoDocente` de `data/contenidos.js`; si vale `null`, el estudiante escribe la dirección que le indique el docente.
- **Artículos de PubMed**: DAPA-HF (ensayo aleatorizado), el metanálisis de EMPEROR-Reduced y DAPA-HF, un caso y control anidado sobre fluoroquinolonas, un estudio diagnóstico de troponina 0/1 hora y la cohorte PURE. Sus preguntas se apoyan solo en lo que dice su resumen.
- **Formularios con descarga**: diagnóstico (sin nota), fichas de lectura crítica 1 y 2, práctica con árbol y Mendeley (con nota sugerida), coevaluación de plenaria y entregables de segundo año. Cada uno descarga un archivo `.json` con un código de verificación.
- **Consolidador (docente)**: carga los archivos adjuntos de los correos, propone para el taller el promedio de las mejores notas de la sesión conjunta y del año de cada estudiante (puedes escribir otra nota encima), sugiere la práctica y la participación (promedio de las coevaluaciones recibidas, que se ajusta con el registro de intervenciones de cada sesión), permite calificar cada ficha con su rúbrica y descarga la tabla de notas en CSV para Excel. Todo ocurre en el navegador: nada se envía a un servidor. El código de verificación delata cambios casuales en un archivo, pero no es una firma segura.
- **Nota mínima de aprobación**: está en `evaluacion.notaMinima` de `data/contenidos.js` y vale `null` hasta confirmarla con el reglamento de posgrado. Mientras sea `null`, la app no dice aprobado ni reprobado. Para fijarla, escribe el número (por ejemplo, `3.5`), sube `?v=N` en `index.html` y publica.

Admite enlaces directos: `#arbol` abre el árbol de decisión, `#ia` la lectura crítica asistida por IA, y `#<id>` cualquier sección o subsección.

Tiene índice lateral, buscador (`/`), modo claro y oscuro, cuatro tamaños de letra, versión para celular y exportación a PDF. No tiene dependencias ni paso de compilación: abre `index.html` en el navegador o publícalo con GitHub Pages.

## Cómo actualizar el contenido

El material didáctico está en `data/contenidos.js`; los textos de portada, el glosario y las referencias, en `js/contenido.js`. No hace falta tocar el código para cambiarlos.

| Bloque de `data/contenidos.js` | Qué controla |
|---|---|
| `contenidos` | Tabla de temas, competencias y fuentes |
| `disenos` | Guía de reporte, herramienta y preguntas clave por diseño |
| `arbol` | Árbol de decisión: preguntas (con rótulo corto `c` para el diagrama) y hojas que apuntan a un diseño por su nombre |
| `muestreo` | Las seis calculadoras del libro `Muestreo.xlsx` (hojas CAFI, CAIN, NUFI, NUIN, COCA y CONU), sus valores de ejemplo y los enlaces al Excel, al video y al mapa mental |
| `practica` | Preguntas de práctica con respuesta y explicación (públicas; las de examen no van aquí) |
| `fases` | Las diez fases de una revisión sistemática con IA |
| `mejoresPracticas` | Lista de buenas prácticas |
| `herramientasClaude` | Skills, conectores y entornos que se necesitan |
| `recursos` | Mapas mentales y herramientas |
| `lecturaIA` | Pasos, reglas, verificación de retractaciones y conversor a Markdown de la lectura crítica asistida por IA |
| `ofimatica`, `vancouver` | Listas de verificación y ejemplos; `vancouver` incluye estilos, identificadores y pasos de MyBib |
| `evaluacion` | Rúbrica de cuatro evidencias, calendario, nota mínima (`null` por confirmar) y ejemplo de cálculo |
| `rutas` | Sesión conjunta, ruta de primer año y ruta de segundo año, bloque por bloque |
| `protocolo`, `avance` | Listas de verificación de Proyecto I y Proyecto II |
| `riesgo8430` | Categorías de riesgo del artículo 11 de la Resolución 8430 de 1993 |

En `data/evaluacion.js` están los resultados de aprendizaje (`ras`), los artículos de PubMed con sus preguntas, el banco general, el diagnóstico y las rúbricas de fichas, coevaluación y Mendeley.

Las fórmulas de muestreo están en `calcular()` de `js/app.js` y reproducen las del Excel: con los valores de ejemplo, los seis resultados coinciden con el libro con una diferencia menor de 10⁻⁷. `NORMINV` se calcula con el algoritmo de Acklam.

Al actualizar, cambia `meta.version` y `meta.actualizado`, sube `?v=N` en `index.html` y comprueba que los enlaces sigan vivos.

## Estructura

```
index.html           página única
css/style.css        sistema de diseño base (de la skill explorador-interactivo; no se edita)
css/motor.css        gráficos, relato, acordeón y fichas (de la skill; no se edita)
css/aula.css         paleta del aula y estilos propios
js/motor.js          motor del documento (de la skill; no se edita)
js/contenido.js      portada, glosario, referencias y panel de fuentes
js/app.js            secciones, gráficos, árbol, calculadoras, rutas y relato
js/formularios.js    evaluación con intentos ilimitados, artículos, formularios y consolidador
data/contenidos.js   material didáctico editable
data/evaluacion.js   banco de evaluación, artículos de PubMed, diagnóstico y rúbricas
docs/                guías en Markdown (revisión con IA, skills y plugins)
build/inline.py      genera dist/aula.html, un solo archivo autocontenido
```

## Publicar

- GitHub Pages: en Settings, Pages, elige la rama `main` y la carpeta raíz.
- Archivo único: `python3 build/inline.py` crea `dist/aula.html` para compartirlo por correo o subirlo a un aula virtual.

## Aviso

El contenido es material didáctico en construcción. Verifica las guías y los enlaces vigentes antes de citarlos. Las calculadoras apoyan el aprendizaje y no sustituyen la asesoría estadística ni la revisión de un comité de ética; el tamaño de muestra se redondea al entero superior y el IC 95 % del efecto usa el método logarítmico.

## Licencia

© 2026 Fabian Antonio Dávila Ramírez.

- **Código** (`index.html`, `css/`, `js/`, `build/`): licencia MIT. Texto completo en [`LICENSE`](LICENSE).
- **Contenido** (`data/contenidos.js`, `docs/` y los textos didácticos de la aplicación): licencia Creative Commons Atribución 4.0 Internacional (CC BY 4.0). Texto completo en [`LICENSE-CONTENT`](LICENSE-CONTENT).

Puedes copiar, adaptar y redistribuir el material, incluso con fines comerciales, siempre que cites al autor, enlaces la licencia e indiques si hiciste cambios.

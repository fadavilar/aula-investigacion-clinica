# Aula de investigación clínica

Documento web para estudiantes y docentes que va de la pregunta clínica al artículo publicable. Abre con un resumen y un relato por pasos (el gráfico cambia al desplazarse) y sigue con cuatro partes:

1. **Planear el estudio**: temas y competencias, árbol de decisión dibujado para clasificar el diseño (con su guía de reporte y su herramienta de evaluación) y las seis calculadoras de tamaño de muestra del libro `Muestreo.xlsx`, con la fórmula paso a paso y una curva que muestra cómo cambia la muestra.
2. **Leer y evaluar**: práctica de preguntas de selección múltiple y calculadora de efecto (riesgos, RR, OR, reducción absoluta, NNT) con gráfico de intervalos.
3. **Sintetizar y publicar**: las diez fases de una revisión sistemática con apoyo de IA, buenas prácticas, generador de la declaración de uso de IA, Mendeley, estilo Vancouver y listas de verificación de Word, Excel y PowerPoint.
4. **Recursos**: mapas mentales, glosario con fuente en cada término y referencias verificadas.

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
| `ofimatica`, `vancouver` | Listas de verificación y ejemplos |

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
js/app.js            secciones, gráficos, árbol, calculadoras y relato
data/contenidos.js   material didáctico editable
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

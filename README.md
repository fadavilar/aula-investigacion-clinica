# Aula de investigación clínica

Aplicación web estática para estudiantes y docentes: lectura crítica por diseño de estudio con árbol de decisión, práctica de preguntas de selección múltiple, calculadora de efecto (RR, OR, NNT), un capítulo de revisiones sistemáticas con apoyo de inteligencia artificial, gestores de referencias (Mendeley, MyBib), estilo Vancouver y listas de verificación ofimática.

No tiene dependencias ni paso de compilación: abre `index.html` en el navegador o publícala con GitHub Pages.

## Cómo actualizar el contenido

Todo el contenido está en `data/contenidos.js`. Edita ese archivo y no necesitas tocar el código.

| Bloque | Qué controla |
|---|---|
| `contenidos` | Tabla de temas, competencias y fuentes |
| `disenos` | Selector de diseño: guía de reporte, herramienta y preguntas clave |
| `arbol` | Árbol de decisión: preguntas y hojas que apuntan a un diseño por su nombre |
| `practica` | Preguntas de práctica con respuesta y explicación (públicas; las de examen no van aquí) |
| `fases` | Las diez fases de una revisión sistemática con IA |
| `mejoresPracticas` | Lista de buenas prácticas |
| `herramientasClaude` | Skills, conectores y entornos que se necesitan |
| `recursos` | Mapas mentales y herramientas |
| `ofimatica`, `vancouver` | Listas de verificación y ejemplos |

Al actualizar, cambia `meta.version` y `meta.actualizado`, y comprueba que los enlaces sigan vivos.

## Estructura

```
index.html          página única
css/styles.css      estilos
js/app.js           lógica (filtro, selector, calculadora, fases, generador de declaración)
data/contenidos.js  contenido editable
docs/               guías en Markdown (revisión con IA, skills y plugins)
build/inline.py     genera dist/aula.html, un solo archivo autocontenido
```

## Publicar

- GitHub Pages: en Settings, Pages, elige la rama `main` y la carpeta raíz.
- Archivo único: `python3 build/inline.py` crea `dist/aula.html` para compartirlo por correo o subirlo a un aula virtual.

## Aviso

El contenido es material didáctico en construcción. Verifica las guías y los enlaces vigentes antes de citarlos. La calculadora usa el método logarítmico para el IC 95 % y no sustituye un análisis estadístico completo.

## Licencia

Pendiente de definir por el autor (por ejemplo, MIT para el código y CC BY 4.0 para el contenido).

# Revisiones sistemáticas con apoyo de IA: buenas prácticas

Principio: la IA acelera tareas, pero las decisiones y la responsabilidad son del equipo revisor. La declaración conjunta de Cochrane, Campbell, JBI y CEE (2025) pide supervisión humana, informar con transparencia cualquier uso de IA que haga o sugiera juicios, y que quienes sintetizan evidencia asuman la responsabilidad de su revisión.

Fuente: Position statement on AI use in evidence synthesis across Cochrane, the Campbell Collaboration, JBI, and the Collaboration for Environmental Evidence 2025. https://pmc.ncbi.nlm.nih.gov/articles/PMC12594113/

## Diez fases

1. Pregunta y protocolo. La IA ayuda a refinar la pregunta; el equipo fija los criterios y registra el protocolo antes de buscar.
2. Estrategia de búsqueda. La IA propone términos y sintaxis; una persona experta la valida y se registra fecha y conteo por base (PRISMA-S).
3. Búsqueda y exportación. Se automatiza solo donde la plataforma lo permite. LILACS/BVS y Embase se consultan a mano con la ecuación adaptada.
4. Deduplicación. Un script detecta duplicados; una persona revisa los dudosos y fija un orden de atribución.
5. Cribado. La IA prioriza o actúa como segundo revisor solo tras validarla en una muestra; la decisión final es humana.
6. Texto completo y extracción. La IA prellena citando la frase de origen; cada cifra se verifica contra el artículo.
7. Riesgo de sesgo. La IA sugiere; el equipo juzga con la herramienta del diseño.
8. Síntesis y metanálisis. Scripts versionados (PyMARE para pares, netmeta para redes), validados contra metafor. No aplica a revisiones de alcance.
9. Certeza de la evidencia. Borrador de la tabla; el equipo califica con GRADE.
10. Redacción y reporte. Se verifican todas las referencias (DOI o URL), se genera el diagrama PRISMA con conteos reales y se declara el uso de IA.

## Reglas que conviene no negociar

- Los conteos PRISMA son reales, nunca estimados.
- El diagrama PRISMA 2020 se genera con el paquete PRISMA2020 y se cita: Haddaway NR, Page MJ, Pritchard CC, McGuinness LA. Campbell Syst Rev. 2022;18:e1230. doi:10.1002/cl2.1230
- Toda referencia se comprueba; los modelos de lenguaje pueden inventar citas que parecen reales.
- Todo dato extraído por IA queda marcado como pendiente hasta que una persona lo confirme.
- Hay una aprobación humana entre fases: protocolo, datos, análisis.
- El metanálisis solo se hace con estudios comparables y un desenlace común.
- Los documentos revisados conservan el control de cambios con autoría humana.

## Reporte del uso de IA

Registra herramienta, versión, fecha, fase, propósito y método de verificación. La app incluye un generador de declaración. PRISMA-trAIce (JMIR AI 2025;4:e80247) es una propuesta de lista de verificación; el comité ejecutivo de PRISMA publicó reparos sobre su uso del nombre PRISMA, así que se cita como propuesta y no como extensión oficial.

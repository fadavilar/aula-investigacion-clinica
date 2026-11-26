# Qué necesitas en Claude para ejecutar el flujo

## Skills
- `revision-sistematica`: guía el flujo completo. Entradas: pregunta PICO o PCC. Pasos: ecuaciones por base, ejecución documentada, deduplicación con orden de atribución, diagrama PRISMA con conteos reales, extracción, calidad con listas EQUATOR e informe en Word. Puntos de aprobación humana entre fases. Debe detectar cuándo procede un metanálisis y activar la skill siguiente.
- `metaanalisis`: metanálisis por pares con PyMARE y en red con netmeta. Se valida contra metafor y netmeta con conjuntos públicos. Entrega scripts, forest plot y tablas.
- `docx`, `xlsx`, `pptx`, `pdf`: skills de documentos de Claude para el informe, las hojas de extracción, la presentación y la lectura de PDF.

## Conectores (MCP)
PubMed, Consensus, Scholar Gateway, ClinicalTrials.gov, bioRxiv, Google Drive y Claude Docs. Los resultados de búsqueda semántica se verifican siempre con la fuente original.

## Entorno de ejecución
- Python: pandas, PyMARE.
- R: metafor, netmeta, PRISMA2020.

## Fuera de Claude
- Cribado por pares: Rayyan o Covidence.
- LILACS/BVS y Embase: búsqueda manual con la ecuación adaptada.
- Mendeley o Zotero para la biblioteca y las citas en Word.

Las skills `revision-sistematica` y `metaanalisis` son del autor y no se incluyen en este repositorio; este documento describe lo que deben hacer para que otra persona pueda reproducirlas o reemplazarlas por equivalentes.

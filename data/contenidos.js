/* Contenidos de la aula. Edita este archivo para actualizar la app: no hay que tocar el código. */
window.APP = {
  meta: {
    titulo: 'Aula de investigación clínica',
    subtitulo: 'Lectura crítica, revisiones sistemáticas con apoyo de IA, gestores de referencias y normas ofimáticas',
    version: '0.2.0',
    actualizado: '2026-11-26',
    autor: 'Fabian A. Dávila Ramírez'
  },

  /* Cada tema: competencia que desarrolla y fuentes. Verifica los enlaces al actualizar. */
  contenidos: [
    { tema: 'Pregunta de investigación: PICO y PCC', competencia: 'Formular preguntas estructuradas y elegir el esquema según el tipo de pregunta.', fuentes: [
      { t: 'Mapa: El artículo de revisión', u: 'https://xmind.app/mindmap/el-art%C3%ADculo-de-revisi%C3%B3n/HkGMhD/?from=gallery' },
      { t: 'Cochrane Handbook v6.5', u: 'https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current' },
      { t: 'JBI, herramientas', u: 'https://jbi.global/critical-appraisal-tools' } ] },
    { tema: 'Diseños de estudio y tipos de publicación', competencia: 'Identificar el diseño por lo que hicieron los investigadores y no por cómo lo nombra el título.', fuentes: [
      { t: 'Mapa: Research method vs publication types', u: 'https://xmind.app/mindmap/research-method-vs-publication-types/rzCuWJ/?from=gallery' },
      { t: 'Red EQUATOR', u: 'https://www.equator-network.org' } ] },
    { tema: 'Muestreo y tamaño de muestra', competencia: 'Distinguir el muestreo probabilístico del no probabilístico y elegir el cálculo según el objetivo.', fuentes: [
      { t: 'Mapa: Muestreo', u: 'https://xmind.app/mindmap/muestreo/zGNKSL/?from=gallery' } ] },
    { tema: 'Epidemiología: definiciones y medidas', competencia: 'Calcular e interpretar incidencia, prevalencia y tasa de ataque, y distinguir brote, epidemia y pandemia.', fuentes: [
      { t: 'Mapa: Epidemic definitions & measures', u: 'https://xmind.app/mindmap/epidemic-definitions-&-measures/7yZBsX/?from=gallery' } ] },
    { tema: 'Lectura crítica según el diseño', competencia: 'Aplicar RoB 2, ROBINS-I, ROBINS-E, Newcastle-Ottawa, listas JBI, QUADAS-2 y AMSTAR 2 con juicios justificados por el texto.', fuentes: [
      { t: 'riskofbias.info', u: 'https://www.riskofbias.info' },
      { t: 'JBI', u: 'https://jbi.global/critical-appraisal-tools' },
      { t: 'CASP', u: 'https://casp-uk.net' },
      { t: 'Newcastle-Ottawa', u: 'https://www.ohri.ca/programs/clinical_epidemiology/oxford.asp' } ] },
    { tema: 'Guías de reporte', competencia: 'Elegir y usar CONSORT 2025, STROBE, CARE, PROCESS, TREND, STARD 2015 y PRISMA 2020 como lista de verificación.', fuentes: [
      { t: 'Red EQUATOR', u: 'https://www.equator-network.org' },
      { t: 'CONSORT 2025 (BMJ 2025;389:e081123)', u: 'https://pubmed.ncbi.nlm.nih.gov/40228833/' } ] },
    { tema: 'Interpretación de resultados', competencia: 'Leer RR, OR, HR, intervalos de confianza, reducción absoluta del riesgo y NNT, y separar significancia estadística de relevancia clínica.', fuentes: [
      { t: 'Cochrane Handbook, cap. 6 y 10', u: 'https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current' } ] },
    { tema: 'Estrategias de búsqueda', competencia: 'Construir ecuaciones con vocabulario controlado y operadores booleanos, y documentarlas para que otra persona las repita.', fuentes: [
      { t: 'Mapa: Search strategies for systematic review', u: 'https://xmind.app/mindmap/search-strategies-for-systematic-review/67g2TW/?from=gallery' },
      { t: 'PubMed', u: 'https://pubmed.ncbi.nlm.nih.gov' } ] },
    { tema: 'Revisión sistemática y metanálisis', competencia: 'Planear una revisión con protocolo, flujo PRISMA 2020 con conteos reales y síntesis cuantitativa cuando los estudios son comparables.', fuentes: [
      { t: 'Mapa: Systematic review and meta-analysis', u: 'https://xmind.app/mindmap/systematic-review-and-meta-analysis/MtpEBb/?from=gallery' },
      { t: 'Cochrane Handbook v6.5', u: 'https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current' } ] },
    { tema: 'Revisiones de alcance', competencia: 'Reconocer cuándo una revisión de alcance (PCC) es más adecuada que una sistemática y por qué no lleva metanálisis.', fuentes: [
      { t: 'JBI', u: 'https://jbi.global/critical-appraisal-tools' } ] },
    { tema: 'Certeza de la evidencia (GRADE) y CAT', competencia: 'Calificar la certeza de la evidencia y resumirla en un tema críticamente apreciado (CAT) de una a dos páginas.', fuentes: [
      { t: 'Cochrane Handbook, cap. 14', u: 'https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current' } ] },
    { tema: 'Evaluaciones económicas y acceso a medicamentos', competencia: 'Distinguir costo-efectividad, costo-utilidad, costo-beneficio e impacto presupuestal, y leer un manual metodológico.', fuentes: [
      { t: 'Mapa: Evaluaciones económicas en salud y acceso a medicamentos', u: 'https://xmind.app/mindmap/evaluaciones-econ%C3%B3micas-en-salud-y-acceso-a-medicamentos/rCCPXw/?from=gallery' } ] },
    { tema: 'Mapa del recorrido del paciente (patient journey)', competencia: 'Describir determinantes, sentimientos y actores a lo largo de la atención de un paciente.', fuentes: [
      { t: 'Mapa: Marco de referencia Patient Journey Map', u: 'https://xmind.app/mindmap/marco-de-referencia-patient-journey-map/qTwUvX/?from=gallery' } ] },
    { tema: 'Inteligencia artificial en la síntesis de evidencia', competencia: 'Usar IA con supervisión humana, declarar su uso y no delegarle juicios que le corresponden al equipo revisor.', fuentes: [
      { t: 'Declaración conjunta Cochrane, Campbell, JBI y CEE 2025', u: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12594113/' },
      { t: 'Cochrane: estándares para el uso responsable de IA', u: 'https://www.cochrane.org/about-us/news/setting-standards-responsible-ai-use-evidence-synthesis' },
      { t: 'PRISMA-trAIce (propuesta, JMIR AI 2025)', u: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12694947/' } ] },
    { tema: 'Gestores de referencias y estilo Vancouver', competencia: 'Mantener una biblioteca ordenada, citar desde Word con Mendeley Cite y producir una bibliografía Vancouver sin errores.', fuentes: [
      { t: 'Mendeley Reference Manager (Windows)', u: 'https://www.mendeley.com/download-reference-manager/windows' },
      { t: 'MyBib (extensión de Chrome)', u: 'https://chromewebstore.google.com/detail/mybib-free-citation-gener/phidhnmbkbkbkbknhldmpmnacgicphkf' },
      { t: 'Recomendaciones del ICMJE', u: 'https://www.icmje.org/recommendations/' },
      { t: 'Citing Medicine (NLM)', u: 'https://www.ncbi.nlm.nih.gov/books/NBK7256/' } ] },
    { tema: 'Normas ofimáticas en artículos y tesis', competencia: 'Dar formato profesional a un manuscrito en Word, ordenar datos en Excel y presentar resultados en PowerPoint.', fuentes: [
      { t: 'Recomendaciones del ICMJE', u: 'https://www.icmje.org/recommendations/' },
      { t: 'Soporte de Microsoft', u: 'https://support.microsoft.com' } ] },
    { tema: 'Redacción científica y ética de la publicación', competencia: 'Estructurar un manuscrito (IMRAD), respetar criterios de autoría y declarar el uso de IA.', fuentes: [
      { t: 'Recomendaciones del ICMJE', u: 'https://www.icmje.org/recommendations/' } ] }
  ],

  /* Selector de diseño del capítulo de lectura crítica. */
  disenos: [
    { nombre: 'Reporte de caso', guia: 'CARE', guiaUrl: 'https://www.equator-network.org', herramienta: 'Lista de JBI para reportes de caso', herrUrl: 'https://jbi.global/critical-appraisal-tools',
      preguntas: ['¿Se describe con claridad la historia clínica y la cronología?', '¿Se describen la intervención y los resultados?', '¿Se extraen lecciones aplicables?'] },
    { nombre: 'Serie de casos', guia: 'PROCESS (series quirúrgicas)', guiaUrl: 'https://www.equator-network.org', herramienta: 'Lista de JBI para series de casos', herrUrl: 'https://jbi.global/critical-appraisal-tools',
      preguntas: ['¿Se incluyeron los casos de forma consecutiva?', '¿Los criterios de inclusión son claros?', '¿La condición se midió de forma válida?'] },
    { nombre: 'Casos y controles', guia: 'STROBE', guiaUrl: 'https://www.equator-network.org', herramienta: 'Lista de JBI o Newcastle-Ottawa', herrUrl: 'https://www.ohri.ca/programs/clinical_epidemiology/oxford.asp',
      preguntas: ['¿Los controles vienen de la misma población que los casos?', '¿La exposición se midió igual en ambos grupos?', '¿Qué sesgo de recuerdo es posible?'] },
    { nombre: 'Cohorte', guia: 'STROBE', guiaUrl: 'https://www.equator-network.org', herramienta: 'ROBINS-E o Newcastle-Ottawa', herrUrl: 'https://www.riskofbias.info',
      preguntas: ['¿Qué variables confusoras midieron y cuáles faltan?', '¿Cuántos pacientes se perdieron en el seguimiento?', '¿El seguimiento fue suficiente para el desenlace?'] },
    { nombre: 'Cuasiexperimental', guia: 'TREND', guiaUrl: 'https://www.equator-network.org', herramienta: 'ROBINS-I', herrUrl: 'https://www.riskofbias.info',
      preguntas: ['¿Cómo se asignó la intervención si no hubo aleatorización?', '¿Los grupos eran comparables al inicio?', '¿Hay un grupo de comparación?'] },
    { nombre: 'Ensayo clínico aleatorizado', guia: 'CONSORT 2025', guiaUrl: 'https://pubmed.ncbi.nlm.nih.gov/40228833/', herramienta: 'RoB 2', herrUrl: 'https://www.riskofbias.info',
      preguntas: ['¿Se generó y se ocultó bien la secuencia de aleatorización?', '¿Hubo desviaciones de la intervención asignada?', '¿Faltan datos del desenlace?', '¿Quien midió sabía el grupo?', '¿Se reportó lo que prometía el protocolo?'] },
    { nombre: 'Estudio transversal analítico', guia: 'STROBE', guiaUrl: 'https://www.equator-network.org', herramienta: 'Lista de JBI para estudios transversales analíticos', herrUrl: 'https://jbi.global/critical-appraisal-tools',
      preguntas: ['¿Se definieron con claridad los criterios de inclusión y el entorno?', '¿La exposición y el desenlace se midieron de forma válida y fiable?', '¿Se identificaron y manejaron los factores de confusión?'] },
    { nombre: 'Prueba diagnóstica', guia: 'STARD 2015', guiaUrl: 'https://www.equator-network.org', herramienta: 'QUADAS-2', herrUrl: 'https://www.bristol.ac.uk/population-health-sciences/projects/quadas/quadas-2/',
      preguntas: ['¿El espectro de pacientes es el de la práctica real?', '¿El estándar de referencia es adecuado?', '¿Se aplicó a todos los pacientes?'] },
    { nombre: 'Revisión sistemática o metanálisis', guia: 'PRISMA 2020', guiaUrl: 'https://www.equator-network.org', herramienta: 'AMSTAR 2', herrUrl: 'https://amstar.ca',
      preguntas: ['¿Hubo protocolo previo?', '¿La búsqueda fue exhaustiva y reproducible?', '¿Se evaluó el riesgo de sesgo de los estudios incluidos?', '¿Se explica la heterogeneidad?'] }
  ],

  /* Árbol de decisión: cada nodo es una pregunta o una hoja que apunta a un diseño por su nombre. */
  arbol: {
    inicio: 'q1',
    nodos: {
      q1: { p: '¿El estudio mide qué tan bien una prueba detecta una enfermedad, comparándola con un estándar de referencia?',
            o: [{ t: 'Sí', a: 'Prueba diagnóstica' }, { t: 'No', a: 'q2' }] },
      q2: { p: '¿Reúne e integra los resultados de varios estudios con una búsqueda sistemática?',
            o: [{ t: 'Sí', a: 'Revisión sistemática o metanálisis' }, { t: 'No', a: 'q3' }] },
      q3: { p: '¿Los investigadores asignaron la intervención a los participantes?',
            o: [{ t: 'Sí', a: 'q3a' }, { t: 'No, solo observaron', a: 'q4' }] },
      q3a: { p: '¿La asignación fue al azar?',
             o: [{ t: 'Sí, al azar', a: 'Ensayo clínico aleatorizado' }, { t: 'No, sin azar', a: 'Cuasiexperimental' }] },
      q4: { p: '¿Compara grupos de participantes?',
            o: [{ t: 'Sí', a: 'q4a' }, { t: 'No, describe casos', a: 'q5' }] },
      q4a: { p: '¿Cómo se formaron los grupos y cuándo se midió?',
             o: [{ t: 'Se parte de quienes tienen el desenlace y de quienes no, y se mira atrás la exposición', a: 'Casos y controles' },
                 { t: 'Se parte de la exposición y se sigue a los participantes hasta el desenlace', a: 'Cohorte' },
                 { t: 'Exposición y desenlace se miden en el mismo momento', a: 'Estudio transversal analítico' }] },
      q5: { p: '¿Cuántos pacientes describe?',
            o: [{ t: 'Uno', a: 'Reporte de caso' }, { t: 'Varios', a: 'Serie de casos' }] }
    }
  },

  /* Preguntas de práctica (se pueden publicar con su respuesta). Las del examen no van en este archivo. */
  practica: [
    { q: 'Se asignan al azar 200 pacientes con insuficiencia cardíaca a dos esquemas de diurético y se miden las hospitalizaciones. ¿Qué guía de reporte y qué herramienta de evaluación corresponden?',
      o: ['CONSORT 2025 y RoB 2', 'STROBE y Newcastle-Ottawa', 'STARD 2015 y QUADAS-2', 'PRISMA 2020 y AMSTAR 2'], r: 0,
      e: 'Es un ensayo aleatorizado: se reporta con CONSORT y se evalúa el riesgo de sesgo con RoB 2.' },
    { q: 'Se sigue durante 10 años a 1.500 fumadores y 1.500 no fumadores para comparar la incidencia de EPOC. ¿Qué diseño es?',
      o: ['Casos y controles', 'Cohorte', 'Transversal', 'Ensayo clínico'], r: 1,
      e: 'Se parte de la exposición y se sigue a los participantes hasta el desenlace: es una cohorte.' },
    { q: 'Se compara a 80 pacientes con cáncer de páncreas con 160 pacientes sin él y se pregunta por una exposición previa. ¿Qué diseño es?',
      o: ['Cohorte', 'Serie de casos', 'Casos y controles', 'Cuasiexperimental'], r: 2,
      e: 'Se parte del desenlace (con y sin cáncer) y se mira hacia atrás la exposición: casos y controles.' },
    { q: '¿Qué dice una guía de reporte como STROBE o CONSORT?',
      o: ['Qué información debe contener el artículo', 'Cuánto confiar en el resultado', 'Qué prueba estadística usar', 'Si el estudio se debe publicar'], r: 0,
      e: 'La guía de reporte dice qué debe contar el artículo; la herramienta de evaluación crítica dice cuánto confiar en lo que cuenta.' },
    { q: 'Un estudio compara una troponina de alta sensibilidad con la coronariografía como estándar de referencia. ¿Qué herramienta de evaluación crítica se usa?',
      o: ['RoB 2', 'ROBINS-E', 'QUADAS-2', 'AMSTAR 2'], r: 2,
      e: 'Los estudios de validación de pruebas diagnósticas se evalúan con QUADAS-2 y se reportan con STARD 2015.' },
    { q: 'Un ensayo reporta un RR de 0,80 con IC 95 % de 0,60 a 1,05. ¿Cómo se interpreta?',
      o: ['El tratamiento reduce el riesgo de forma significativa', 'El intervalo incluye 1, así que no se demuestra diferencia', 'El tratamiento aumenta el riesgo', 'El resultado es válido porque el RR es menor de 1'], r: 1,
      e: 'Un intervalo que incluye 1 es compatible con ausencia de efecto, aunque el valor puntual sea menor de 1.' },
    { q: 'El riesgo del evento es 20 % en el grupo control y 15 % en el tratado. ¿Cuál es el NNT?',
      o: ['5', '10', '20', '25'], r: 2,
      e: 'La reducción absoluta es 5 puntos (0,05); el NNT es 1 / 0,05 = 20.' },
    { q: 'En un ensayo, 18 % de los pacientes del grupo tratado y 6 % del control no tienen dato del desenlace. ¿Qué dominio de RoB 2 se afecta?',
      o: ['Proceso de aleatorización', 'Desviaciones de la intervención', 'Datos faltantes del desenlace', 'Selección del resultado reportado'], r: 2,
      e: 'Las pérdidas altas y desiguales amenazan el dominio de datos faltantes del desenlace.' },
    { q: 'Los investigadores asignan la intervención según la sala del hospital, sin azar. ¿Qué diseño es y qué herramienta se usa?',
      o: ['Cohorte; ROBINS-E', 'Cuasiexperimental; ROBINS-I', 'Ensayo aleatorizado; RoB 2', 'Serie de casos; lista de JBI'], r: 1,
      e: 'Hay asignación por los investigadores pero sin azar: cuasiexperimental, con TREND y ROBINS-I.' },
    { q: 'Una revisión sistemática con metanálisis se reporta con PRISMA 2020. ¿Qué herramienta evalúa su calidad metodológica?',
      o: ['AMSTAR 2', 'QUADAS-2', 'RoB 2', 'Newcastle-Ottawa'], r: 0,
      e: 'AMSTAR 2 evalúa la calidad de las revisiones sistemáticas; PRISMA dice cómo reportarlas.' },
    { q: 'En GRADE, ¿qué puede disminuir la certeza de la evidencia de un conjunto de ensayos?',
      o: ['Solo el tamaño de la muestra', 'Riesgo de sesgo, inconsistencia, imprecisión, evidencia indirecta o sesgo de publicación', 'Que el estudio sea reciente', 'Que el IC 95 % sea estrecho'], r: 1,
      e: 'Los cinco motivos para bajar la certeza son esos; un IC estrecho no la baja.' },
    { q: '¿Desde dónde se instala Mendeley Cite para Word?',
      o: ['Desde Mendeley Reference Manager: Tools, Install Mendeley Cite for Microsoft Word', 'Desde el menú Revisar de Word', 'Desde PubMed', 'No se instala: Word lo trae'], r: 0,
      e: 'Se instala desde Reference Manager, con Word cerrado, y usa la biblioteca en la nube.' }
  ],

  /* Fases de una revisión sistemática con apoyo de IA. */
  fases: [
    { n: 1, nombre: 'Pregunta y protocolo', ia: 'Ayuda a refinar la pregunta PICO o PCC y a proponer sinónimos.', humano: 'Define los criterios de elegibilidad y registra el protocolo antes de buscar.', entregable: 'Protocolo registrado', riesgo: 'Cambiar la pregunta después de ver los resultados.' },
    { n: 2, nombre: 'Estrategia de búsqueda', ia: 'Propone términos controlados y la sintaxis por base de datos.', humano: 'Valida la ecuación con una persona experta en búsqueda y con artículos que ya se conocen; registra fecha y conteo por base (PRISMA-S).', entregable: 'Ecuación por base', riesgo: 'Ecuaciones que no se pueden repetir.' },
    { n: 3, nombre: 'Búsqueda y exportación', ia: 'Automatiza la exportación en bases que lo permiten, como PubMed.', humano: 'Guarda la ecuación exacta y el conteo real. Las plataformas que sancionan las búsquedas automatizadas, como LILACS/BVS, se consultan a mano.', entregable: 'Archivos exportados y conteos', riesgo: 'Conteos estimados en vez de reales.' },
    { n: 4, nombre: 'Deduplicación', ia: 'Un script detecta duplicados probables.', humano: 'Revisa los casos dudosos y fija un orden de atribución por base.', entregable: 'Lista única de registros', riesgo: 'Perder registros únicos por coincidencias falsas.' },
    { n: 5, nombre: 'Cribado de títulos y resúmenes', ia: 'Prioriza registros o actúa como segundo revisor, solo después de validarla en una muestra.', humano: 'Toma la decisión final de inclusión y resuelve discrepancias.', entregable: 'Decisiones registradas', riesgo: 'Delegar la inclusión a un modelo sin medir su desempeño.' },
    { n: 6, nombre: 'Texto completo y extracción', ia: 'Prellena la tabla de extracción citando la frase de origen.', humano: 'Verifica cada cifra contra el artículo; todo dato extraído por IA queda marcado hasta que alguien lo confirme.', entregable: 'Tabla de extracción verificada', riesgo: 'Cifras inventadas o mal copiadas.' },
    { n: 7, nombre: 'Riesgo de sesgo y calidad', ia: 'Sugiere un juicio y la frase que lo respalda.', humano: 'Emite el juicio final con la herramienta del diseño (RoB 2, ROBINS-I, Newcastle-Ottawa, listas de reporte EQUATOR).', entregable: 'Evaluación por estudio', riesgo: 'Juicios sin evidencia textual.' },
    { n: 8, nombre: 'Síntesis y metanálisis', ia: 'Ejecuta scripts versionados (PyMARE para comparaciones por pares, netmeta para redes).', humano: 'Elige el modelo, revisa la heterogeneidad y valida el código contra software de referencia como metafor. No aplica a revisiones de alcance.', entregable: 'Forest plot y tablas', riesgo: 'Combinar estudios que no son comparables.' },
    { n: 9, nombre: 'Certeza de la evidencia', ia: 'Redacta un borrador de la tabla de resumen de hallazgos.', humano: 'Califica la certeza con GRADE y justifica cada rebaja o aumento.', entregable: 'Tabla GRADE', riesgo: 'Certeza alta sin justificación.' },
    { n: 10, nombre: 'Redacción y reporte', ia: 'Propone borradores y ajusta el estilo.', humano: 'Verifica que cada referencia exista (DOI o URL), genera el diagrama PRISMA con conteos reales y declara el uso de IA.', entregable: 'Manuscrito y declaración de IA', riesgo: 'Referencias inexistentes generadas por el modelo.' }
  ],

  mejoresPracticas: [
    'Formula la pregunta (PICO o PCC) y registra el protocolo antes de buscar.',
    'Documenta cada ecuación con base de datos, fecha y conteo real; nunca estimes un conteo.',
    'Genera el diagrama PRISMA 2020 con el paquete PRISMA2020 (Haddaway et al., Campbell Syst Rev 2022;18:e1230) y cítalo al pie de la figura.',
    'Verifica cada referencia con su DOI o URL; un modelo de lenguaje puede inventar citas que parecen reales.',
    'Pon una aprobación humana entre fases: primero el protocolo, luego los datos, al final el análisis.',
    'Marca como pendiente todo dato que extrajo una IA y verifícalo contra el artículo antes de usarlo.',
    'Haz metanálisis solo con estudios comparables y un desenlace común; no lo hagas en una revisión de alcance.',
    'Valida el código estadístico contra un software de referencia y guarda las versiones de los scripts.',
    'Conserva el control de cambios y los comentarios con autoría humana en los documentos revisados.',
    'Registra cada uso de IA: herramienta, versión, fecha, paso y cómo se verificó el resultado.'
  ],

  /* Qué necesitas en Claude para ejecutar el flujo. */
  herramientasClaude: [
    { tipo: 'Skill', nombre: 'revision-sistematica', paraQue: 'Guía el flujo PICO o PCC, ecuaciones por base, conteos PRISMA, extracción, calidad e informe en Word.', nota: 'Skill propia del autor; el repo documenta su especificación en docs/skills-y-plugins.md.' },
    { tipo: 'Skill', nombre: 'metaanalisis', paraQue: 'Metanálisis por pares (PyMARE) y en red (netmeta) con scripts validados.', nota: 'Skill propia; se activa cuando los estudios son comparables.' },
    { tipo: 'Skill', nombre: 'docx', paraQue: 'Leer y editar Word, con control de cambios y comentarios.', nota: 'Skill de documentos de Claude.' },
    { tipo: 'Skill', nombre: 'xlsx', paraQue: 'Hojas de extracción y de cribado con fórmulas.', nota: 'Skill de hojas de cálculo de Claude.' },
    { tipo: 'Skill', nombre: 'pptx y pdf', paraQue: 'Presentaciones de sustentación y lectura de PDF de texto completo.', nota: 'Skills de Claude.' },
    { tipo: 'Conector', nombre: 'PubMed', paraQue: 'Buscar, leer metadatos y texto completo abierto.', nota: 'Conector MCP.' },
    { tipo: 'Conector', nombre: 'Consensus y Scholar Gateway', paraQue: 'Búsqueda semántica complementaria; sus resultados se verifican con la fuente.', nota: 'Conectores MCP.' },
    { tipo: 'Conector', nombre: 'ClinicalTrials.gov y bioRxiv', paraQue: 'Registros de ensayos y preprints para sesgo de publicación y literatura gris.', nota: 'Conectores MCP.' },
    { tipo: 'Conector', nombre: 'Google Drive y Claude Docs', paraQue: 'Guardar protocolos, tablas e informes donde el equipo los revise.', nota: 'Conectores MCP.' },
    { tipo: 'Entorno', nombre: 'Python con pandas y PyMARE', paraQue: 'Deduplicación, tablas y metanálisis por pares.', nota: 'Claude Code o el entorno de ejecución de código.' },
    { tipo: 'Entorno', nombre: 'R con metafor, netmeta y PRISMA2020', paraQue: 'Validación, metanálisis en red y diagrama PRISMA.', nota: 'Claude Code o el entorno de ejecución de código.' },
    { tipo: 'Fuera de Claude', nombre: 'Rayyan o Covidence', paraQue: 'Cribado por pares de revisores humanos.', nota: 'Herramientas externas.' },
    { tipo: 'Fuera de Claude', nombre: 'LILACS/BVS y Embase', paraQue: 'Búsquedas manuales con la ecuación adaptada.', nota: 'Acceso y licencia propios; no automatizar.' },
    { tipo: 'Fuera de Claude', nombre: 'Mendeley o Zotero', paraQue: 'Biblioteca y citas en Word.', nota: 'Gestor de referencias.' }
  ],

  recursos: [
    { t: 'El artículo de revisión', d: 'PICO, criterios, fuentes y estructura del reporte.', u: 'https://xmind.app/mindmap/el-art%C3%ADculo-de-revisi%C3%B3n/HkGMhD/?from=gallery' },
    { t: 'Research method vs publication types', d: 'Métodos de investigación frente a tipos de publicación.', u: 'https://xmind.app/mindmap/research-method-vs-publication-types/rzCuWJ/?from=gallery' },
    { t: 'Muestreo', d: 'Probabilístico y no probabilístico.', u: 'https://xmind.app/mindmap/muestreo/zGNKSL/?from=gallery' },
    { t: 'Systematic review and meta-analysis', d: 'Bases de datos, registros de protocolos y formación.', u: 'https://xmind.app/mindmap/systematic-review-and-meta-analysis/MtpEBb/?from=gallery' },
    { t: 'Search strategies for systematic review', d: 'Vocabulario controlado, literatura gris y documentación.', u: 'https://xmind.app/mindmap/search-strategies-for-systematic-review/67g2TW/?from=gallery' },
    { t: 'Evaluaciones económicas y acceso a medicamentos', d: 'Costo-efectividad, impacto presupuestal y manuales.', u: 'https://xmind.app/mindmap/evaluaciones-econ%C3%B3micas-en-salud-y-acceso-a-medicamentos/rCCPXw/?from=gallery' },
    { t: 'Epidemic definitions & measures', d: 'Incidencia, prevalencia, tasa de ataque.', u: 'https://xmind.app/mindmap/epidemic-definitions-&-measures/7yZBsX/?from=gallery' },
    { t: 'Marco de referencia Patient Journey Map', d: 'Determinantes, sentimientos y actores.', u: 'https://xmind.app/mindmap/marco-de-referencia-patient-journey-map/qTwUvX/?from=gallery' },
    { t: 'Mendeley Reference Manager (Windows)', d: 'Descarga oficial del gestor de referencias.', u: 'https://www.mendeley.com/download-reference-manager/windows' },
    { t: 'MyBib', d: 'Extensión de Chrome para generar citas desde una página web.', u: 'https://chromewebstore.google.com/detail/mybib-free-citation-gener/phidhnmbkbkbkbknhldmpmnacgicphkf' }
  ],

  ofimatica: {
    Word: ['Usa estilos de título (Título 1, Título 2) para la jerarquía, no negritas manuales.', 'Genera la tabla de contenido de forma automática.', 'Numera tablas y figuras con Insertar título para que las referencias cruzadas se actualicen.', 'Inserta las citas con Mendeley Cite; no las escribas a mano.', 'Usa el control de cambios cuando otra persona revise el documento.', 'Aplica las márgenes, la fuente y el interlineado de la norma de la revista o de la institución.'],
    Excel: ['Una fila por observación y una columna por variable, con encabezados sin celdas combinadas.', 'Conserva una hoja de datos crudos que no se modifica y trabaja los cálculos en otra.', 'Agrega una hoja de diccionario con el significado, la unidad y los valores de cada variable.', 'Usa validación de datos para evitar entradas fuera de rango.', 'Resume con tablas dinámicas y fórmulas en vez de cálculos a mano.'],
    PowerPoint: ['Una idea por diapositiva y un título que diga la conclusión.', 'Texto legible desde el fondo de la sala.', 'Cada figura o tabla lleva su fuente.', 'Cierra con las referencias en el mismo estilo del manuscrito.']
  },

  vancouver: {
    reglas: ['En el texto, un número entre paréntesis o en superíndice, en orden de primera mención.', 'En la lista, las referencias se ordenan por ese número.', 'Las revistas se abrevian según la Biblioteca Nacional de Medicina de EE. UU.'],
    ejemplo: 'Hopewell S, Chan AW, Collins GS, et al. CONSORT 2025 statement: updated guideline for reporting randomised trials. BMJ. 2025;389:e081123. doi:10.1136/bmj-2024-081123',
    errores: ['Referencias sin DOI o sin año.', 'Autores duplicados con nombres distintos.', 'Títulos en mayúsculas sostenidas.', 'Estilo equivocado (por ejemplo APA en vez de Vancouver).', 'Citas escritas a mano y no insertadas con el complemento.', 'Referencias en la lista que nadie cita en el texto.']
  }
};

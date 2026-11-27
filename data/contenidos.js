/* Contenidos de la aula. Edita este archivo para actualizar la app: no hay que tocar el código. */
window.APP = {
  meta: {
    titulo: 'Aula de investigación clínica',
    subtitulo: 'Lectura crítica, revisiones sistemáticas con apoyo de IA, gestores de referencias y normas ofimáticas',
    version: '0.4.0',
    actualizado: '2026-11-27',
    autor: 'Fabian Antonio Dávila Ramírez'
  },

  /* Evaluación del proceso (rúbrica aprobada). notaMinima queda en null hasta confirmarla con el reglamento de posgrado:
     mientras sea null, la calculadora no dice aprobado ni reprobado. Para fijarla, escribe el número, por ejemplo 3.5. */
  evaluacion: {
    escala: { min: 0.0, max: 5.0, decimales: 1 },
    notaMinima: null,
    criterios: [
      { id: 'taller', nombre: 'Taller de preguntas de selección múltiple (20 preguntas)', peso: 0.40,
        evalua: 'Precisión conceptual, justificación de las respuestas y capacidad de identificar el diseño del estudio y la guía de reporte correspondiente.' },
      { id: 'fichas', nombre: 'Fichas de lectura crítica 1 y 2', peso: 0.30, nombreR2: 'Entregables del proyecto: síntesis de Proyecto I y avance de Proyecto II',
        evalua: 'Identificación de la pregunta de investigación, el diseño, la calidad metodológica y la aplicabilidad clínica (15 % cada ficha).',
        evaluaR2: 'Propuesta adaptada para segundo año, por confirmar: reemplaza las fichas por los entregables del proyecto.' },
      { id: 'practica', nombre: 'Práctica con árbol de decisión y biblioteca en Mendeley', peso: 0.15,
        evalua: 'Uso correcto del árbol para clasificar diseños y organización de referencias en Mendeley.' },
      { id: 'particip', nombre: 'Participación y coevaluación en plenarias', peso: 0.15,
        evalua: 'Intervención argumentada y retroalimentación constructiva a los compañeros.' }
    ],
    calendario: [
      { fecha: '2026-11-27', texto: 'Viernes 27 de noviembre de 2026', que: 'Sesión conjunta de primer y segundo año: árbol de decisión, ficha 1 en grupos y Mendeley', evidencia: 'Práctica, ficha 1 y participación' },
      { fecha: '2026-12-04', texto: 'Viernes 4 de diciembre de 2026', que: 'Sesión por grupo (primer y segundo año por separado)', evidencia: 'Ficha 2 y práctica' },
      { fecha: '2026-12-11', texto: 'Viernes 11 de diciembre de 2026', que: 'Sesión por grupo y cierre de la práctica', evidencia: 'Ficha 2, Mendeley y participación' },
      { fecha: null, texto: 'Por acordar con el grupo', que: 'Taller de 20 preguntas de selección múltiple', evidencia: 'Taller (40 %)' },
      { fecha: '2027-01-31', texto: '31 de enero de 2027', que: 'Plazo para reportar las notas', evidencia: 'Nota definitiva' }
    ],
    ejemplo: { taller: 4.0, ficha1: 3.5, ficha2: 3.5, practica: 4.5, particip: 4.0 }
  },

  /* Rutas de trabajo por año. seccion: id de la sección del aula que apoya cada bloque. */
  rutas: {
    tarea: 'Para el 4 de diciembre: una pregunta clínica propia en formato PICO y diez referencias importadas a la carpeta Lectura_Apellido en Mendeley.',
    conjunta: { titulo: 'Sesión conjunta de primer y segundo año', fecha: 'Viernes 27 de noviembre de 2026, 3:00 p. m.', duracion: 180,
      objetivos: ['Entender cómo se evalúa el proceso: cuatro evidencias, pesos y calendario.', 'Dado un diseño de estudio, nombrar su guía de reporte y su herramienta de evaluación crítica.', 'Aplicar la herramienta a un artículo real con una ficha de lectura crítica.', 'Dejar Mendeley funcionando y conectado a Word.'],
      sesiones: [ { fecha: 'Viernes 27 de noviembre de 2026', bloques: [
        { min: '0–10', bloque: 'Apertura', actividad: 'Presentación, ruta del día y cómo se organiza el proceso', entregable: 'Ninguno' },
        { min: '10–30', bloque: 'Rúbrica', actividad: 'Las cuatro evidencias, el cálculo de la nota con un ejemplo y el calendario', entregable: 'Preguntas aclaradas', seccion: 'evaluacion' },
        { min: '30–40', bloque: 'Diagnóstico', actividad: 'Cinco preguntas de selección múltiple, sin nota', entregable: 'Autoevaluación', seccion: 'practica' },
        { min: '40–60', bloque: 'Pregunta y mapa de diseños', actividad: 'PICO y PCC; método frente a tipo de publicación; diseño, guía y herramienta', entregable: 'Ninguno', seccion: 'pregunta' },
        { min: '60–75', bloque: 'Cómo leer los números', actividad: 'RR, OR, HR, IC 95 %, reducción absoluta y NNT con un ejemplo', entregable: 'Cálculo del ejemplo', seccion: 'efecto' },
        { min: '75–95', bloque: 'Árbol de decisión', actividad: 'Clasificar un estudio; RoB 2, cohortes y sesgos como lectura de apoyo', entregable: 'Clasificación de un artículo', seccion: 'diseno' },
        { min: '95–100', bloque: 'Descanso', descanso: true },
        { min: '100–135', bloque: 'Práctica en grupos mixtos', actividad: 'Buscar en PubMed, descargar el PDF y llenar la ficha 1', entregable: 'Ficha 1', seccion: 'diseno' },
        { min: '135–155', bloque: 'Plenaria', actividad: 'Dos grupos presentan y los demás califican de 1,0 a 5,0 en claridad, justificación y aplicabilidad', entregable: 'Coevaluación' },
        { min: '155–175', bloque: 'Mendeley', actividad: 'Cuenta, Mendeley Reference Manager, Mendeley Cite en Word, carpeta Lectura_Apellido y estilo Vancouver', entregable: 'Cita de prueba', seccion: 'citas' },
        { min: '175–180', bloque: 'Cierre', actividad: 'Ruta de cada grupo, tarea para el 4 de diciembre y fecha del taller de preguntas', entregable: 'Fecha acordada' } ] } ] },
    r1: { titulo: 'Primer año (R1): Metodología de la Investigación I y Lectura crítica',
      componentes: ['Metodología de la Investigación I', 'Lectura crítica de artículos científicos'],
      resumen: 'La síntesis conserva los ejes temáticos de los dos cursos y baja la profundidad de cada uno: pregunta, objetivos y marco teórico; variables, muestra y estadística en Excel; pronóstico, pruebas diagnósticas, revisiones sistemáticas, metanálisis y guías de práctica clínica.',
      sesiones: [
        { fecha: 'Viernes 4 de diciembre de 2026', bloques: [
          { min: '0–60', bloque: 'Pregunta, título y objetivos', eje: 'Metodología, eje 1', actividad: 'Taller: de la pregunta PICO al título, objetivos con verbo en infinitivo y esquema del marco teórico', entregable: 'Pregunta, título y objetivos', seccion: 'pregunta' },
          { min: '60–90', bloque: 'Estudio de pronóstico', eje: 'Lectura crítica, eje 1', actividad: 'Lectura guiada de un artículo de pronóstico: cohorte, HR y curva de supervivencia', entregable: 'Notas de lectura', seccion: 'pronostico' },
          { min: '90–100', bloque: 'Descanso', descanso: true },
          { min: '100–140', bloque: 'Pruebas diagnósticas', eje: 'Lectura crítica, eje 2', actividad: 'STARD 2015 y QUADAS-2; sensibilidad, especificidad y razones de verosimilitud', entregable: 'Ficha 2 (borrador)', seccion: 'diagnostica' },
          { min: '140–180', bloque: 'Revisión sistemática', eje: 'Lectura crítica, ejes 2 y 3', actividad: 'PRISMA 2020 y AMSTAR 2; leer el flujo y la tabla de riesgo de sesgo', entregable: 'Notas de lectura', seccion: 'revision' } ] },
        { fecha: 'Viernes 11 de diciembre de 2026', bloques: [
          { min: '0–45', bloque: 'Metanálisis', eje: 'Lectura crítica, eje 3', actividad: 'Leer un forest plot: efecto combinado, I² y sesgo de publicación', entregable: 'Interpretación de un forest plot', seccion: 'metanalisis' },
          { min: '45–75', bloque: 'Guías de práctica clínica y costo-efectividad', eje: 'Lectura crítica, eje 4', actividad: 'Lectura guiada de una guía; modelo de guías del Sistema General de Seguridad Social en Salud', entregable: 'Notas de lectura', seccion: 'guias' },
          { min: '75–85', bloque: 'Descanso', descanso: true },
          { min: '85–160', bloque: 'Variables, muestra y datos', eje: 'Metodología, ejes 3 y 4', actividad: 'Variables y escalas, población y muestra, formato de recolección y cronograma; base de datos y estadística descriptiva con histograma en Excel', entregable: 'Base de datos con un histograma', seccion: 'variables' },
          { min: '160–180', bloque: 'Probabilidad y prueba diagnóstica', eje: 'Metodología, eje 4', actividad: 'Probabilidad pretest y postest con un caso clínico', entregable: 'Ficha 2 entregada', seccion: 'diagnostica' } ] }
      ],
      independiente: 'Hasta el 31 de enero de 2027: ficha 2 terminada (una prueba diagnóstica o una revisión sistemática), práctica del árbol, biblioteca de Mendeley y repaso con las preguntas de práctica del aula.' },
    r2: { titulo: 'Segundo año (R2): Proyecto de investigación I y II',
      componentes: ['Proyecto de investigación I', 'Proyecto de investigación II'],
      resumen: 'Proyecto I: título, planteamiento del problema y pregunta; justificación y objetivos; marco teórico y metodología. Proyecto II: desarrollo del proyecto, recopilación de la información y avance de resultados. La sesión conjunta (PICO, tipos de estudio, árbol de decisión, lectura crítica y Mendeley) es la base del marco teórico y de la metodología.',
      sesiones: [
        { fecha: 'Viernes 4 de diciembre de 2026: Proyecto I en síntesis', bloques: [
          { min: '0–40', bloque: 'Título, problema y pregunta', actividad: 'Del tema clínico a la pregunta PICO; delimitar el problema', entregable: 'Problema y pregunta (una página)', seccion: 'pregunta' },
          { min: '40–80', bloque: 'Justificación y objetivos', actividad: 'Magnitud, vacío de conocimiento y utilidad; objetivo general y específicos', entregable: 'Justificación y objetivos', seccion: 'protocolo' },
          { min: '80–90', bloque: 'Descanso', descanso: true },
          { min: '90–130', bloque: 'Marco teórico', actividad: 'Estrategia de búsqueda, selección de artículos y citas con Mendeley en estilo Vancouver', entregable: 'Marco teórico con diez referencias', seccion: 'citas' },
          { min: '130–180', bloque: 'Metodología', actividad: 'Diseño con el árbol de decisión; variables, población y muestra, instrumento, análisis y consideraciones éticas', entregable: 'Esquema metodológico', seccion: 'protocolo' } ] },
        { fecha: 'Viernes 11 de diciembre de 2026: Proyecto II en síntesis', bloques: [
          { min: '0–60', bloque: 'Recopilación de la información', actividad: 'Instrumento y diccionario de variables; base de datos en Excel; control de calidad de los datos', entregable: 'Base de datos con diccionario', seccion: 'avance' },
          { min: '60–120', bloque: 'Avance de resultados', actividad: 'Tablas descriptivas y gráficos; lectura crítica de los propios resultados con la guía de reporte que corresponde', entregable: 'Tabla y gráfico de avance', seccion: 'avance' },
          { min: '120–130', bloque: 'Descanso', descanso: true },
          { min: '130–180', bloque: 'Presentación de avances', actividad: 'Cada estudiante presenta su avance; coevaluación en claridad, justificación y aplicabilidad', entregable: 'Presentación y coevaluación' } ] }
      ],
      independiente: 'Hasta el 31 de enero de 2027: síntesis de Proyecto I y avance de Proyecto II, práctica del árbol y biblioteca de Mendeley.',
      nota: 'Por confirmar: si segundo año se califica por Proyecto de investigación I y II o por Metodología I y Lectura crítica como primer año. Mientras tanto, la rúbrica conserva los pesos y reemplaza las fichas por los entregables del proyecto.' }
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
    { nombre: 'Prueba diagnóstica', guia: 'STARD 2015', guiaUrl: 'https://www.equator-network.org', herramienta: 'QUADAS-2', herrUrl: 'https://www.bristol.ac.uk/population-health-sciences/projects/quadas/',
      preguntas: ['¿El espectro de pacientes es el de la práctica real?', '¿El estándar de referencia es adecuado?', '¿Se aplicó a todos los pacientes?'] },
    { nombre: 'Revisión sistemática o metanálisis', guia: 'PRISMA 2020', guiaUrl: 'https://www.equator-network.org', herramienta: 'AMSTAR 2', herrUrl: 'https://amstar.ca',
      preguntas: ['¿Hubo protocolo previo?', '¿La búsqueda fue exhaustiva y reproducible?', '¿Se evaluó el riesgo de sesgo de los estudios incluidos?', '¿Se explica la heterogeneidad?'] }
  ],

  /* Árbol de decisión: cada nodo es una pregunta o una hoja que apunta a un diseño por su nombre. */
  arbol: {
    inicio: 'q1',
    nodos: {
      /* c: rótulo corto para el diagrama del árbol */
      q1: { c: '¿Valida una prueba?', p: '¿El estudio mide qué tan bien una prueba detecta una enfermedad, comparándola con un estándar de referencia?',
            o: [{ t: 'Sí', a: 'Prueba diagnóstica' }, { t: 'No', a: 'q2' }] },
      q2: { c: '¿Reúne varios estudios?', p: '¿Reúne e integra los resultados de varios estudios con una búsqueda sistemática?',
            o: [{ t: 'Sí', a: 'Revisión sistemática o metanálisis' }, { t: 'No', a: 'q3' }] },
      q3: { c: '¿Asignaron la intervención?', p: '¿Los investigadores asignaron la intervención a los participantes?',
            o: [{ t: 'Sí', a: 'q3a' }, { t: 'No, solo observaron', a: 'q4' }] },
      q3a: { c: '¿Al azar?', p: '¿La asignación fue al azar?',
             o: [{ t: 'Sí, al azar', a: 'Ensayo clínico aleatorizado' }, { t: 'No, sin azar', a: 'Cuasiexperimental' }] },
      q4: { c: '¿Compara grupos?', p: '¿Compara grupos de participantes?',
            o: [{ t: 'Sí', a: 'q4a' }, { t: 'No, describe casos', a: 'q5' }] },
      q4a: { c: '¿Cómo se formaron?', p: '¿Cómo se formaron los grupos y cuándo se midió?',
             o: [{ t: 'Se parte de quienes tienen el desenlace y de quienes no, y se mira atrás la exposición', c: 'Desde el desenlace', a: 'Casos y controles' },
                 { t: 'Se parte de la exposición y se sigue a los participantes hasta el desenlace', c: 'Desde la exposición', a: 'Cohorte' },
                 { t: 'Exposición y desenlace se miden en el mismo momento', c: 'Al mismo tiempo', a: 'Estudio transversal analítico' }] },
      q5: { c: '¿Cuántos pacientes?', p: '¿Cuántos pacientes describe?',
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

  /* Tamaño de muestra: las seis hojas del libro Muestreo.xlsx del autor (CAFI, CAIN, NUFI, NUIN, COCA, CONU),
     con sus fórmulas y sus valores de ejemplo. Las fórmulas se reproducen en js/app.js y se comprueban contra el Excel. */
  muestreo: {
    excel: 'https://docs.google.com/spreadsheets/d/1FjVKZDhr-GG2F2hjnFx0iw-6b7HbKPUk/edit?usp=sharing',
    video: 'https://youtu.be/zJSNGKfw71E',
    videoTitulo: 'Tamaño de muestra - Probabilístico',
    mapa: 'https://xmind.app/mindmap/muestreo/zGNKSL/?from=gallery',
    objetivos: [
      { id: 'frecuencia', t: 'Estimar una frecuencia', d: 'Qué proporción de la población tiene una condición (prevalencia, cobertura, uso).' },
      { id: 'promedio', t: 'Estimar un promedio', d: 'Cuál es el valor medio de una medida continua (presión, glucemia, días de estancia).' },
      { id: 'dosFrecuencias', t: 'Comparar dos frecuencias', d: 'Si una proporción difiere entre dos grupos.' },
      { id: 'dosPromedios', t: 'Comparar dos promedios', d: 'Si un valor medio difiere entre dos grupos.' }
    ],
    /* p: parámetros que escribe quien calcula. v: valor de ejemplo del Excel. */
    calculadoras: [
      { hoja: 'CAFI', objetivo: 'frecuencia', marco: true, t: 'Tamaño de la muestra para la estimación de frecuencias (marco muestral conocido)',
        p: [ { k: 'N', s: 'N', l: 'Marco muestral (tamaño de la población)', v: 10000, min: 50, max: 1000000, step: 1, tipo: 'entero' },
             { k: 'alfa', s: 'α', l: 'Alfa (máximo error tipo I)', v: 0.05, min: 0.01, max: 0.10, step: 0.01, tipo: 'pct' },
             { k: 'p', s: 'p', l: 'Prevalencia esperada', v: 0.5, min: 0.01, max: 0.99, step: 0.01, tipo: 'prop' },
             { k: 'd', s: 'd', l: 'Precisión (error absoluto aceptado)', v: 0.05, min: 0.01, max: 0.20, step: 0.005, tipo: 'prop' } ] },
      { hoja: 'CAIN', objetivo: 'frecuencia', marco: false, t: 'Tamaño de la muestra para la estimación de frecuencias (marco muestral desconocido)',
        p: [ { k: 'alfa', s: 'α', l: 'Alfa (máximo error tipo I)', v: 0.05, min: 0.01, max: 0.10, step: 0.01, tipo: 'pct' },
             { k: 'p', s: 'p', l: 'Prevalencia esperada', v: 0.5, min: 0.01, max: 0.99, step: 0.01, tipo: 'prop' },
             { k: 'd', s: 'd', l: 'Precisión (error absoluto aceptado)', v: 0.05, min: 0.01, max: 0.20, step: 0.005, tipo: 'prop' } ] },
      { hoja: 'NUFI', objetivo: 'promedio', marco: true, t: 'Tamaño de la muestra para la estimación de promedios (marco muestral conocido)',
        p: [ { k: 'N', s: 'N', l: 'Marco muestral (tamaño de la población)', v: 500000, min: 50, max: 1000000, step: 1, tipo: 'entero' },
             { k: 'alfa', s: 'α', l: 'Alfa (máximo error tipo I)', v: 0.05, min: 0.01, max: 0.10, step: 0.01, tipo: 'pct' },
             { k: 's', s: 's', l: 'Desviación estándar esperada', v: 1.1, min: 0.01, max: 1000, step: 0.01, tipo: 'dec' },
             { k: 'd', s: 'd', l: 'Precisión (en las unidades de la medida)', v: 0.11, min: 0.001, max: 1000, step: 0.01, tipo: 'dec' } ] },
      { hoja: 'NUIN', objetivo: 'promedio', marco: false, t: 'Tamaño de la muestra para la estimación de promedios (marco muestral desconocido)',
        p: [ { k: 'alfa', s: 'α', l: 'Alfa (máximo error tipo I)', v: 0.05, min: 0.01, max: 0.10, step: 0.01, tipo: 'pct' },
             { k: 's', s: 's', l: 'Desviación estándar esperada', v: 2.6, min: 0.01, max: 1000, step: 0.01, tipo: 'dec' },
             { k: 'd', s: 'd', l: 'Precisión (en las unidades de la medida)', v: 0.26, min: 0.001, max: 1000, step: 0.01, tipo: 'dec' } ] },
      { hoja: 'COCA', objetivo: 'dosFrecuencias', t: 'Tamaño de la muestra para comparar frecuencias en dos grupos',
        p: [ { k: 'alfa', s: 'α', l: 'Alfa (máximo error tipo I)', v: 0.05, min: 0.01, max: 0.10, step: 0.01, tipo: 'pct' },
             { k: 'beta', s: 'β', l: 'Beta (máximo error tipo II)', v: 0.20, min: 0.05, max: 0.50, step: 0.01, tipo: 'pct' },
             { k: 'p1', s: 'p₁', l: 'Prevalencia en el primer grupo', v: 0.5, min: 0.01, max: 0.99, step: 0.01, tipo: 'prop' },
             { k: 'p2', s: 'p₂', l: 'Prevalencia en el segundo grupo', v: 0.1, min: 0.01, max: 0.99, step: 0.01, tipo: 'prop' } ] },
      { hoja: 'CONU', objetivo: 'dosPromedios', t: 'Tamaño de la muestra para comparar promedios en dos grupos',
        p: [ { k: 'alfa', s: 'α', l: 'Alfa (máximo error tipo I)', v: 0.05, min: 0.01, max: 0.10, step: 0.01, tipo: 'pct' },
             { k: 'beta', s: 'β', l: 'Beta (máximo error tipo II)', v: 0.20, min: 0.05, max: 0.50, step: 0.01, tipo: 'pct' },
             { k: 'v1', s: 's₁²', l: 'Varianza del grupo 1', v: 23.2, min: 0.01, max: 100000, step: 0.1, tipo: 'dec' },
             { k: 'v2', s: 's₂²', l: 'Varianza del grupo 2', v: 23.2, min: 0.01, max: 100000, step: 0.1, tipo: 'dec' },
             { k: 'dif', s: 'x̄₁ − x̄₂', l: 'Diferencia propuesta entre los promedios', v: 2.5, min: 0.001, max: 100000, step: 0.1, tipo: 'dec' } ] }
    ]
  },

  /* Segundo año. Listas de verificación del protocolo (Proyecto I) y del avance de resultados (Proyecto II):
     síntesis docente del autor a partir de los contenidos programáticos; seccion enlaza la herramienta del aula. */
  protocolo: [
    { g: 'Título', items: [ { t: 'Es breve y nombra la población, la intervención o exposición y el desenlace; si cabe, también el diseño.', seccion: 'pregunta' } ] },
    { g: 'Planteamiento del problema y pregunta', items: [
      { t: 'Muestra la magnitud del problema con datos y su fuente.' },
      { t: 'Explica qué se sabe y qué falta por saber: el vacío de conocimiento.' },
      { t: 'Termina en una pregunta de investigación en formato PICO (o de frecuencia, o PCC).', seccion: 'pregunta' } ] },
    { g: 'Justificación', items: [
      { t: 'Dice por qué importa responder la pregunta: magnitud, vacío y utilidad para los pacientes o el servicio.' },
      { t: 'Muestra que el estudio es viable con el tiempo, los pacientes y los recursos disponibles.' } ] },
    { g: 'Objetivos', items: [
      { t: 'El objetivo general responde la pregunta y empieza con un verbo en infinitivo que se pueda verificar.', seccion: 'pregunta' },
      { t: 'Los objetivos específicos son pocos, son pasos para lograr el general y cada uno tiene su análisis en la metodología.' } ] },
    { g: 'Marco teórico', items: [
      { t: 'La búsqueda está documentada: bases de datos, ecuación, fecha y número de resultados.' },
      { t: 'Los estudios clave se leyeron críticamente con la herramienta de su diseño.', seccion: 'diseno' },
      { t: 'Las citas están en estilo Vancouver, insertadas con Mendeley Cite.', seccion: 'citas' } ] },
    { g: 'Metodología', items: [
      { t: 'El tipo de estudio se eligió con el árbol de decisión y se justifica.', seccion: 'diseno' },
      { t: 'La población, los criterios de inclusión y de exclusión, el lugar y el periodo están definidos.' },
      { t: 'El tamaño de la muestra se calculó con la fórmula del objetivo y se explica el muestreo.', seccion: 'muestra' },
      { t: 'Cada variable tiene definición, tipo, escala y valores posibles (diccionario de variables).', seccion: 'variables' },
      { t: 'El formato o instrumento de recolección está diseñado y se probó.' },
      { t: 'El plan de análisis dice qué estadística describe cada variable y qué medida responde cada objetivo.', seccion: 'efecto' },
      { t: 'Hay un cronograma con las fases del estudio.' } ] },
    { g: 'Consideraciones éticas', items: [
      { t: 'El riesgo de la investigación está clasificado según el artículo 11 de la Resolución 8430 de 1993.' },
      { t: 'Si aplica, el consentimiento informado tiene lo que pide el artículo 15 de la Resolución 8430 de 1993.' },
      { t: 'Se protege la privacidad de los participantes (artículo 8 de la Resolución 8430 de 1993) y se prevé el aval del comité de ética.' } ] },
    { g: 'Guía para el protocolo', items: [
      { t: 'Si es un ensayo clínico, el protocolo sigue SPIRIT 2025; en otros diseños, la guía de reporte del diseño sirve de lista de lo que habrá que informar.' } ] }
  ],
  avance: [
    { g: 'Recolección de la información', items: [
      { t: 'El instrumento se probó en unos pocos casos antes de empezar y se ajustó.' },
      { t: 'Se registra cuántos participantes van frente a los planeados y en qué fechas.' } ] },
    { g: 'Base de datos', items: [
      { t: 'Una fila por participante y una columna por variable, con encabezados sin celdas combinadas.' },
      { t: 'Cada participante se identifica con un código, nunca con su nombre ni su documento (artículo 8 de la Resolución 8430 de 1993).' },
      { t: 'La hoja de datos crudos no se modifica; los cálculos van en otra hoja.' },
      { t: 'El diccionario de variables está al día.', seccion: 'variables' } ] },
    { g: 'Control de calidad', items: [
      { t: 'Se buscaron valores fuera de rango, datos faltantes por variable y registros duplicados.' },
      { t: 'Cada corrección queda anotada: qué se cambió, por qué y con qué fuente.' } ] },
    { g: 'Avance de resultados', items: [
      { t: 'El flujo de participantes dice cuántos fueron elegibles, incluidos, excluidos (con el motivo) y perdidos.' },
      { t: 'La tabla 1 describe la población con la estadística que corresponde a cada tipo de variable.', seccion: 'variables' },
      { t: 'El resultado principal se presenta con su medida y su intervalo de confianza del 95 %.', seccion: 'efecto' },
      { t: 'Cada gráfico tiene título, ejes con unidades, fuente y una frase que dice qué muestra.' } ] },
    { g: 'Informe de avance', items: [
      { t: 'Compara lo logrado con el cronograma y explica los problemas y los ajustes.' },
      { t: 'Revisa los resultados contra la guía de reporte del diseño (STROBE, CONSORT 2025 u otra).', seccion: 'diseno' },
      { t: 'Termina con los próximos pasos y las fechas.' } ] }
  ],
  /* Resolución 8430 de 1993, artículo 11: categorías de riesgo (resumen del texto oficial) */
  riesgo8430: [
    { id: 'sin', t: 'Investigación sin riesgo', d: 'Estudios con técnicas y métodos de investigación documental retrospectivos y aquellos en los que no se interviene ni se modifican intencionalmente variables biológicas, fisiológicas, psicológicas o sociales de los participantes.', ej: 'Revisión de historias clínicas, entrevistas o cuestionarios en los que no se identifica a la persona ni se tratan aspectos sensitivos de su conducta.' },
    { id: 'minimo', t: 'Investigación con riesgo mínimo', d: 'Estudios prospectivos que registran datos con procedimientos comunes de diagnóstico o tratamiento rutinario.', ej: 'Pesar al participante, electrocardiograma, extracción de sangre por punción venosa en adultos en buen estado de salud dentro de los límites de la norma, medicamentos de uso común con las indicaciones y dosis establecidas.' },
    { id: 'mayor', t: 'Investigación con riesgo mayor que el mínimo', d: 'Estudios en los que las probabilidades de afectar al participante son significativas.', ej: 'Estudios radiológicos y con microondas, estudios con los medicamentos y modalidades de los títulos III y IV de la resolución, ensayos con nuevos dispositivos.' }
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

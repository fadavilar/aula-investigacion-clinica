/* Contenido editorial del documento (portada, glosario, referencias y fuentes). El material didáctico está en data/contenidos.js.
   Nada se inventa: cada término lleva su fuente y cada referencia se verificó contra su DOI o su sitio oficial. */
(function(){
const A = window.APP;
const HANDBOOK = "https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current";
const EXCEL = A.muestreo.excel;
window.CONTENIDO = {
  meta: {
    etiqueta: "Material didáctico",
    titulo: "De la pregunta clínica al artículo publicable",
    lede: "Un recorrido para estudiantes y docentes: formular la pregunta, reconocer el diseño, calcular el tamaño de la muestra, leer críticamente, interpretar los números, hacer una revisión sistemática con apoyo de inteligencia artificial y entregar un manuscrito bien citado.",
    corte: "Versión " + A.meta.version + " · actualizado el 26 de noviembre de 2026",
    autor: A.meta.autor,
    autorCred: "",
    institucion: "",
    version: "",
    orcid: "https://orcid.org/0000-0002-1678-7288"
  },
  aviso: "Material en construcción. Verifica las guías y los enlaces vigentes antes de citarlos. Las calculadoras apoyan el aprendizaje y no sustituyen la asesoría estadística ni el criterio de tu comité de ética.",
  descargo: "Material didáctico de libre uso. Las calculadoras reproducen fórmulas de uso docente y no sustituyen un análisis estadístico completo ni la revisión de un comité de ética.",
  equipoTitulo: "Autor",
  equipo: [ { nombre: A.meta.autor, rol: "elaboración y contenido" } ],
  stats: [
    { value: String(A.contenidos.length), label: "temas con su competencia", detail: "Cada tema enlaza sus fuentes y mapas mentales" },
    { value: String(A.disenos.length), label: "diseños de estudio", detail: "Con su guía de reporte y su herramienta de evaluación" },
    { value: String(A.muestreo.calculadoras.length), label: "calculadoras de tamaño de muestra", detail: "Las seis hojas del Excel de muestreo, paso a paso" },
    { value: String(A.practica.length), label: "preguntas de práctica", detail: "Con respuesta y explicación" }
  ],
  /* t término · re expresión que se subraya en el texto · p en pocas palabras · d definición · fuente y url */
  glosario: [
    { id: "pico", t: "PICO", re: "\\bPICO\\b", p: "Población, intervención, comparador y desenlace.", d: "Esquema para formular preguntas de efectividad: quiénes, qué se hace, frente a qué y qué se mide.", fuente: "Cochrane Handbook, cap. 2 y 3", url: HANDBOOK },
    { id: "pcc", t: "PCC", re: "\\bPCC\\b", p: "Población, concepto y contexto.", d: "Esquema de las revisiones de alcance, que mapean la evidencia sobre un concepto en lugar de estimar un efecto.", fuente: "JBI", url: "https://jbi.global/critical-appraisal-tools" },
    { id: "marco", t: "Marco muestral", re: "marco muestral", p: "La lista o el conteo de la población de donde sale la muestra.", d: "Si se conoce su tamaño (N), la fórmula lo usa y la muestra necesaria es algo menor; si no se conoce, se usa la fórmula para población infinita.", fuente: "Hoja de cálculo Muestreo.xlsx del autor", url: EXCEL },
    { id: "alfa", t: "Alfa (error tipo I)", re: "\\balfa\\b|error tipo I\\b", p: "La probabilidad aceptada de ver una diferencia que no existe.", d: "Suele fijarse en 5 %. Con alfa de 5 % y dos colas, el nivel de confianza es 95 % y el valor Z es 1,96.", fuente: "Hoja de cálculo Muestreo.xlsx del autor", url: EXCEL },
    { id: "beta", t: "Beta y poder estadístico", re: "\\bbeta\\b|poder estadístico", p: "Beta es la probabilidad de no ver una diferencia que sí existe; el poder es 1 − beta.", d: "Suele fijarse beta en 20 %, es decir, un poder de 80 %. Solo entra en las fórmulas que comparan dos grupos.", fuente: "Hoja de cálculo Muestreo.xlsx del autor", url: EXCEL },
    { id: "precision", t: "Precisión (d)", re: "\\bprecisión\\b", p: "Cuánto puede alejarse la estimación del valor real.", d: "Es la mitad del ancho del intervalo de confianza que se acepta. Pedir más precisión (d más pequeño) aumenta mucho la muestra: n crece con 1/d².", fuente: "Hoja de cálculo Muestreo.xlsx del autor", url: EXCEL },
    { id: "z", t: "Valor Z", re: "valor Z\\b|valor tipificado", p: "El número de desviaciones estándar de la normal que corresponde a una probabilidad.", d: "En el Excel se obtiene con NORMINV(1 − α/2; 0; 1) para la confianza y NORMINV(1 − β; 0; 1) para el poder.", fuente: "Hoja de cálculo Muestreo.xlsx del autor", url: EXCEL },
    { id: "prevalencia", t: "Prevalencia esperada (p)", re: "prevalencia esperada", p: "La proporción que se espera encontrar, tomada de estudios previos o de una prueba piloto.", d: "Si no se conoce, se usa p = 0,5, que da la muestra más grande posible para una misma precisión.", fuente: "Hoja de cálculo Muestreo.xlsx del autor", url: EXCEL },
    { id: "rr", t: "Riesgo relativo (RR)", re: "\\bRR\\b|riesgo relativo", p: "El riesgo en el grupo tratado dividido por el riesgo en el control.", d: "Un RR de 1 indica que no hay diferencia; menor de 1, menos eventos con el tratamiento.", fuente: "Cochrane Handbook, cap. 6", url: HANDBOOK },
    { id: "or", t: "Razón de odds (OR)", re: "\\bOR\\b|razón de odds", p: "Los odds del evento en un grupo divididos por los del otro.", d: "Se acerca al RR cuando el evento es poco frecuente; se aleja cuando es común.", fuente: "Cochrane Handbook, cap. 6", url: HANDBOOK },
    { id: "rar", t: "Reducción absoluta del riesgo", re: "reducción absoluta", p: "La resta de los riesgos: control menos tratado.", d: "Dice cuántos eventos se evitan por cada 100 pacientes tratados; su inverso es el NNT.", fuente: "Cochrane Handbook, cap. 6", url: HANDBOOK },
    { id: "nnt", t: "NNT", re: "\\bNNT\\b", p: "Número de pacientes que hay que tratar para evitar un evento.", d: "Es 1 dividido por la reducción absoluta del riesgo. Si el tratamiento aumenta el riesgo se habla de NNH (número para dañar).", fuente: "Cochrane Handbook, cap. 15", url: HANDBOOK },
    { id: "ic", t: "Intervalo de confianza del 95 %", re: "intervalo de confianza|IC 95", p: "El rango de valores compatibles con los datos.", d: "Si el intervalo de un RR o un OR incluye 1, el estudio no demuestra diferencia, aunque el valor puntual sea distinto de 1.", fuente: "Cochrane Handbook, cap. 15", url: HANDBOOK },
    { id: "guia", t: "Guía de reporte", re: "guías? de reporte", p: "La lista de lo que debe contar un artículo según su diseño.", d: "CONSORT, STROBE, STARD, PRISMA y las demás guías de la red EQUATOR. Dicen qué informar, no cuánto confiar en el resultado.", fuente: "Red EQUATOR", url: "https://www.equator-network.org" },
    { id: "sesgo", t: "Riesgo de sesgo", re: "riesgo de sesgo", p: "La posibilidad de que el diseño o la ejecución distorsionen el resultado.", d: "Se evalúa con herramientas según el diseño: RoB 2 para ensayos, ROBINS-I y ROBINS-E para estudios no aleatorizados, QUADAS-2 para pruebas diagnósticas.", fuente: "riskofbias.info", url: "https://www.riskofbias.info" },
    { id: "rob2", t: "RoB 2", re: "\\bRoB 2\\b", p: "Herramienta de riesgo de sesgo para ensayos aleatorizados.", d: "Juzga cinco dominios: aleatorización, desviaciones de la intervención, datos faltantes, medición del desenlace y selección del resultado reportado.", fuente: "riskofbias.info", url: "https://www.riskofbias.info" },
    { id: "quadas", t: "QUADAS-2", re: "\\bQUADAS-2\\b", p: "Herramienta para evaluar estudios de exactitud diagnóstica.", d: "Revisa la selección de pacientes, la prueba índice, el estándar de referencia y el flujo y los tiempos.", fuente: "Whiting et al., 2011", url: "https://doi.org/10.7326/0003-4819-155-8-201110180-00009" },
    { id: "amstar", t: "AMSTAR 2", re: "\\bAMSTAR 2\\b", p: "Herramienta para evaluar la calidad de una revisión sistemática.", d: "Revisa, entre otros puntos, el protocolo previo, la búsqueda, la evaluación del riesgo de sesgo y el manejo de la heterogeneidad.", fuente: "amstar.ca", url: "https://amstar.ca" },
    { id: "grade", t: "GRADE", re: "\\bGRADE\\b", p: "Sistema para calificar la certeza de un conjunto de evidencia.", d: "Baja la certeza por riesgo de sesgo, inconsistencia, imprecisión, evidencia indirecta o sesgo de publicación.", fuente: "Cochrane Handbook, cap. 14", url: HANDBOOK },
    { id: "prisma", t: "PRISMA 2020", re: "\\bPRISMA 2020\\b", p: "Guía de reporte de las revisiones sistemáticas.", d: "Incluye el diagrama de flujo, que debe llevar los conteos reales de cada etapa.", fuente: "Red EQUATOR", url: "https://www.equator-network.org" },
    { id: "vancouver", t: "Estilo Vancouver", re: "\\bVancouver\\b", p: "Estilo de citas numérico usado en las revistas biomédicas.", d: "Las referencias se numeran por orden de primera mención en el texto y se listan en ese orden.", fuente: "Citing Medicine (NLM)", url: "https://www.ncbi.nlm.nih.gov/books/NBK7256/" }
  ],
  /* Fuentes que se enlazan solas donde se nombran en el texto, con ficha al pasar el cursor.
     re: cómo aparece en el texto · t: nombre · d: qué es · cita: referencia verificada (Crossref o sitio oficial) · url: destino */
  enlaces: [
    { id: "excel", re: "Muestreo\\.xlsx|(?:libro de )?Excel de muestreo", t: "Muestreo.xlsx", d: "Libro de Excel del autor con las seis hojas de tamaño de muestra que reproduce esta aula.", cita: "Dávila Ramírez FA. Muestreo [hoja de cálculo]. Google Drive.", url: EXCEL },
    { id: "handbook", re: "Cochrane Handbook", t: "Cochrane Handbook", d: "Manual de referencia para revisiones sistemáticas de intervenciones.", cita: "Higgins JPT, Thomas J, Chandler J, et al., editores. Cochrane Handbook for Systematic Reviews of Interventions, versión 6.5. Cochrane; 2024.", url: HANDBOOK },
    { id: "declaracion", re: "declaración conjunta de Cochrane, Campbell, JBI y CEE(?: \\(2025\\))?", t: "Declaración conjunta sobre IA (2025)", d: "Posición de Cochrane, Campbell, JBI y CEE sobre el uso de inteligencia artificial en la síntesis de evidencia.", cita: "Flemyng E, Noel-Storr A, Macura B, et al. JBI Evid Synth. 2025;23(11):2162-6.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12594113/" },
    { id: "consort", re: "\\bCONSORT(?: 2025)?\\b", t: "CONSORT 2025", d: "Guía de reporte de los ensayos clínicos aleatorizados.", cita: "Hopewell S, Chan AW, Collins GS, et al. BMJ. 2025;389:e081123.", url: "https://doi.org/10.1136/bmj-2024-081123" },
    { id: "strobe", re: "\\bSTROBE\\b", t: "STROBE", d: "Guía de reporte de los estudios observacionales: cohortes, casos y controles y transversales.", cita: "Ficha en la red EQUATOR.", url: "https://www.equator-network.org/reporting-guidelines/strobe/" },
    { id: "care", re: "\\bCARE\\b", t: "CARE", d: "Guía de reporte de los reportes de caso.", cita: "Gagnier JJ, Kienle G, Altman DG, et al. J Clin Epidemiol. 2014;67(1):46-51.", url: "https://www.equator-network.org/reporting-guidelines/care/" },
    { id: "process", re: "\\bPROCESS\\b", t: "PROCESS", d: "Guía de reporte de las series de casos quirúrgicas.", cita: "Ficha en la red EQUATOR.", url: "https://www.equator-network.org/reporting-guidelines/process/" },
    { id: "trend", re: "\\bTREND\\b", t: "TREND", d: "Guía de reporte de las evaluaciones no aleatorizadas de intervenciones.", cita: "Des Jarlais DC, Lyles C, Crepaz N, et al. Am J Public Health. 2004;94(3):361-6.", url: "https://www.equator-network.org/reporting-guidelines/improving-the-reporting-quality-of-nonrandomized-evaluations-of-behavioral-and-public-health-interventions-the-trend-statement/" },
    { id: "stard", re: "\\bSTARD(?: 2015)?\\b", t: "STARD 2015", d: "Guía de reporte de los estudios de exactitud diagnóstica.", cita: "Bossuyt PM, Reitsma JB, Bruns DE, et al. BMJ. 2015;351:h5527.", url: "https://www.equator-network.org/reporting-guidelines/stard/" },
    { id: "prismaS", re: "\\bPRISMA-S\\b", t: "PRISMA-S", d: "Extensión de PRISMA para reportar las búsquedas de literatura.", cita: "Rethlefsen ML, Kirtley S, Waffenschmidt S, et al. Syst Rev. 2021;10(1):39.", url: "https://doi.org/10.1186/s13643-020-01542-z" },
    { id: "traice", re: "PRISMA-trAIce", t: "PRISMA-trAIce", d: "Propuesta de lista para reportar el uso de IA en revisiones; no es una extensión oficial de PRISMA.", cita: "Holst D, Moenck K, Koch J, et al. JMIR AI. 2025;4:e80247.", url: "https://doi.org/10.2196/80247" },
    { id: "prismaPkg", re: "\\bPRISMA2020\\b", t: "Paquete PRISMA2020", d: "Paquete de R y aplicación Shiny para dibujar el diagrama de flujo PRISMA 2020.", cita: "Haddaway NR, Page MJ, Pritchard CC, McGuinness LA. Campbell Syst Rev. 2022;18(2):e1230.", url: "https://doi.org/10.1002/cl2.1230" },
    { id: "prisma", re: "\\bPRISMA(?: 2020)?\\b(?![-\\w])", t: "PRISMA 2020", d: "Guía de reporte de las revisiones sistemáticas, con su diagrama de flujo.", cita: "Page MJ, McKenzie JE, Bossuyt PM, et al. BMJ. 2021;372:n71.", url: "https://www.prisma-statement.org/" },
    { id: "rob2", re: "\\bRoB 2\\b", t: "RoB 2", d: "Herramienta de riesgo de sesgo para ensayos aleatorizados.", cita: "Sterne JAC, Savović J, Page MJ, et al. BMJ. 2019;366:l4898.", url: "https://www.riskofbias.info/welcome/rob-2-0-tool" },
    { id: "robinsI", re: "\\bROBINS-I\\b", t: "ROBINS-I", d: "Herramienta de riesgo de sesgo para estudios no aleatorizados de intervenciones.", cita: "Sterne JA, Hernán MA, Reeves BC, et al. BMJ. 2016;355:i4919.", url: "https://www.riskofbias.info/welcome/robins-i-v2" },
    { id: "robinsE", re: "\\bROBINS-E\\b", t: "ROBINS-E", d: "Herramienta de riesgo de sesgo para estudios observacionales de exposiciones.", cita: "Página oficial en riskofbias.info.", url: "https://www.riskofbias.info/welcome/robins-e-tool" },
    { id: "nos", re: "Newcastle-Ottawa", t: "Escala Newcastle-Ottawa", d: "Escala para valorar la calidad de estudios de cohortes y de casos y controles.", cita: "Página oficial del Ottawa Hospital Research Institute.", url: "https://www.ohri.ca/programs/clinical_epidemiology/oxford.asp" },
    { id: "quadas", re: "\\bQUADAS-2\\b", t: "QUADAS-2", d: "Herramienta para evaluar estudios de exactitud diagnóstica.", cita: "Whiting PF, Rutjes AWS, Westwood ME, et al. Ann Intern Med. 2011;155(8):529-36.", url: "https://www.bristol.ac.uk/population-health-sciences/projects/quadas/" },
    { id: "amstar", re: "\\bAMSTAR 2\\b", t: "AMSTAR 2", d: "Herramienta para evaluar la calidad de las revisiones sistemáticas.", cita: "Shea BJ, Reeves BC, Wells G, et al. BMJ. 2017;358:j4008.", url: "https://doi.org/10.1136/bmj.j4008" },
    { id: "grade", re: "\\bGRADE\\b", t: "GRADE", d: "Sistema para calificar la certeza de la evidencia y la fuerza de las recomendaciones.", cita: "GRADE Working Group.", url: "https://www.gradeworkinggroup.org/" },
    { id: "jbi", re: "\\bJBI\\b", t: "JBI", d: "Herramientas de evaluación crítica por diseño y manual de revisiones de alcance.", cita: "JBI Critical Appraisal Tools.", url: "https://jbi.global/critical-appraisal-tools" },
    { id: "casp", re: "\\bCASP\\b", t: "CASP", d: "Listas de verificación para la lectura crítica.", cita: "Critical Appraisal Skills Programme.", url: "https://casp-uk.net" },
    { id: "equator", re: "red EQUATOR|\\bEQUATOR\\b", t: "Red EQUATOR", d: "Biblioteca de guías de reporte de la investigación en salud.", cita: "EQUATOR Network.", url: "https://www.equator-network.org" },
    { id: "icmje", re: "\\bICMJE\\b", t: "Recomendaciones del ICMJE", d: "Normas de los editores de revistas médicas sobre autoría, reporte y publicación.", cita: "International Committee of Medical Journal Editors.", url: "https://www.icmje.org/recommendations/" },
    { id: "nlm", re: "Biblioteca Nacional de Medicina de EE\\. UU\\.|Citing Medicine", t: "Citing Medicine (NLM)", d: "Guía de estilo de la Biblioteca Nacional de Medicina de EE. UU., base del estilo Vancouver.", cita: "Patrias K. Citing Medicine. 2.ª ed. Bethesda (MD): National Library of Medicine (US); 2007.", url: "https://www.ncbi.nlm.nih.gov/books/NBK7256/" },
    { id: "pubmed", re: "\\bPubMed\\b", t: "PubMed", d: "Base de datos de literatura biomédica de la NLM.", cita: "pubmed.ncbi.nlm.nih.gov", url: "https://pubmed.ncbi.nlm.nih.gov" },
    { id: "lilacs", re: "LILACS(?:/BVS)?", t: "LILACS", d: "Literatura científica y técnica de América Latina y el Caribe (BVS).", cita: "lilacs.bvsalud.org", url: "https://lilacs.bvsalud.org/" },
    { id: "embase", re: "\\bEmbase\\b", t: "Embase", d: "Base de datos biomédica de Elsevier; requiere suscripción.", cita: "embase.com", url: "https://www.embase.com/" },
    { id: "ctgov", re: "ClinicalTrials\\.gov", t: "ClinicalTrials.gov", d: "Registro de ensayos clínicos de la NLM.", cita: "clinicaltrials.gov", url: "https://clinicaltrials.gov/" },
    { id: "biorxiv", re: "\\bbioRxiv\\b", t: "bioRxiv", d: "Servidor de preprints de ciencias de la vida; sus artículos no han pasado revisión por pares.", cita: "biorxiv.org", url: "https://www.biorxiv.org/" },
    { id: "consensus", re: "\\bConsensus\\b", t: "Consensus", d: "Buscador semántico de artículos científicos.", cita: "consensus.app", url: "https://consensus.app/" },
    { id: "mendeley", re: "Mendeley(?: Reference Manager| Cite)?", t: "Mendeley", d: "Gestor de referencias; Mendeley Cite inserta las citas en Word.", cita: "mendeley.com", url: "https://www.mendeley.com/download-reference-manager/windows" },
    { id: "mybib", re: "\\bMyBib\\b", t: "MyBib", d: "Extensión de Chrome para generar citas desde una página web.", cita: "Chrome Web Store.", url: "https://chromewebstore.google.com/detail/mybib-free-citation-gener/phidhnmbkbkbkbknhldmpmnacgicphkf" },
    { id: "zotero", re: "\\bZotero\\b", t: "Zotero", d: "Gestor de referencias libre.", cita: "zotero.org", url: "https://www.zotero.org/" },
    { id: "rayyan", re: "\\bRayyan\\b", t: "Rayyan", d: "Plataforma para el cribado de estudios entre varios revisores.", cita: "rayyan.ai", url: "https://www.rayyan.ai/" },
    { id: "covidence", re: "\\bCovidence\\b", t: "Covidence", d: "Plataforma para cribado, extracción y evaluación en revisiones sistemáticas.", cita: "covidence.org", url: "https://www.covidence.org/" },
    { id: "pymare", re: "\\bPyMARE\\b", t: "PyMARE", d: "Biblioteca de Python para metanálisis.", cita: "Documentación oficial.", url: "https://pymare.readthedocs.io/" },
    { id: "metafor", re: "\\bmetafor\\b", t: "metafor", d: "Paquete de R para metanálisis.", cita: "metafor-project.org", url: "https://www.metafor-project.org/" },
    { id: "netmeta", re: "\\bnetmeta\\b", t: "netmeta", d: "Paquete de R para metanálisis en red.", cita: "CRAN.", url: "https://cran.r-project.org/package=netmeta" },
    { id: "pandas", re: "\\bpandas\\b", t: "pandas", d: "Biblioteca de Python para tablas de datos.", cita: "pandas.pydata.org", url: "https://pandas.pydata.org/" }
  ],
  /* Normas que se enlazan solas en el texto (texto oficial verificado) */
  normas: [ { re: "Resolución 8430 de 1993", url: "https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/RESOLUCION-8430-DE-1993.PDF" } ],
  referencias: [
    { c: "Hopewell S, Chan AW, Collins GS, Hróbjartsson A, et al. CONSORT 2025 statement: updated guideline for reporting randomised trials. BMJ. 2025;389:e081123.", url: "https://doi.org/10.1136/bmj-2024-081123" },
    { c: "Whiting PF, Rutjes AWS, Westwood ME, Mallett S, et al. QUADAS-2: a revised tool for the quality assessment of diagnostic accuracy studies. Ann Intern Med. 2011;155(8):529-36.", url: "https://doi.org/10.7326/0003-4819-155-8-201110180-00009" },
    { c: "Haddaway NR, Page MJ, Pritchard CC, McGuinness LA. PRISMA2020: an R package and Shiny app for producing PRISMA 2020-compliant flow diagrams, with interactivity for optimised digital transparency and Open Synthesis. Campbell Syst Rev. 2022;18(2):e1230.", url: "https://doi.org/10.1002/cl2.1230" },
    { c: "Flemyng E, Noel-Storr A, Macura B, Gartlehner G, Thomas J, Meerpohl JJ, et al. Position statement on artificial intelligence (AI) use in evidence synthesis across Cochrane, the Campbell Collaboration, JBI, and the Collaboration for Environmental Evidence 2025. JBI Evid Synth. 2025;23(11):2162-6.", url: "https://doi.org/10.11124/JBIES-25-00480" },
    { c: "Holst D, Moenck K, Koch J, Schmedemann O, Schüppstuhl T. Transparent reporting of AI in systematic literature reviews: development of the PRISMA-trAIce checklist. JMIR AI. 2025;4:e80247.", url: "https://doi.org/10.2196/80247" },
    { c: "Higgins JPT, Thomas J, Chandler J, Cumpston M, Li T, Page MJ, et al., editores. Cochrane Handbook for Systematic Reviews of Interventions, versión 6.5. Cochrane; 2024.", url: HANDBOOK },
    { c: "International Committee of Medical Journal Editors. Recommendations for the conduct, reporting, editing, and publication of scholarly work in medical journals.", url: "https://www.icmje.org/recommendations/" },
    { c: "Patrias K. Citing Medicine: the NLM style guide for authors, editors, and publishers. 2.ª ed. Bethesda (MD): National Library of Medicine (US); 2007.", url: "https://www.ncbi.nlm.nih.gov/books/NBK7256/" }
  ],
  fuentes: [
    { grupo: "Material del autor", items: [
      { label: "Hoja de cálculo Muestreo.xlsx", url: EXCEL },
      { label: "Video: " + A.muestreo.videoTitulo, url: A.muestreo.video },
      { label: "Mapa mental: Muestreo", url: A.muestreo.mapa }
    ] },
    { grupo: "Guías y herramientas", items: [
      { label: "Red EQUATOR", url: "https://www.equator-network.org" },
      { label: "riskofbias.info (RoB 2, ROBINS-I, ROBINS-E)", url: "https://www.riskofbias.info" },
      { label: "JBI, herramientas de evaluación crítica", url: "https://jbi.global/critical-appraisal-tools" },
      { label: "QUADAS (Universidad de Bristol)", url: "https://www.bristol.ac.uk/population-health-sciences/projects/quadas/" },
      { label: "AMSTAR", url: "https://amstar.ca" },
      { label: "Newcastle-Ottawa", url: "https://www.ohri.ca/programs/clinical_epidemiology/oxford.asp" },
      { label: "Cochrane Handbook", url: HANDBOOK }
    ] },
    { grupo: "Publicación y referencias", items: [
      { label: "Recomendaciones del ICMJE", url: "https://www.icmje.org/recommendations/" },
      { label: "Citing Medicine (NLM)", url: "https://www.ncbi.nlm.nih.gov/books/NBK7256/" },
      { label: "Mendeley Reference Manager", url: "https://www.mendeley.com/download-reference-manager/windows" }
    ] }
  ],
  licencia: { nombre: "CC BY 4.0", url: "https://creativecommons.org/licenses/by/4.0/deed.es", texto: "Contenido bajo Creative Commons Atribución 4.0; código bajo licencia MIT." }
};
})();

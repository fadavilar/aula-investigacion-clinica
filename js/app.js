/* Aula de investigación clínica: secciones, gráficos y herramientas. El motor (window.Motor) hace el resto:
   portada, acordeón, índice, buscador, tema, tamaño del texto, glosario, referencias y exportación. */
(function(){
"use strict";
const M = window.Motor, { el, esc, fmt, svgEl, VW, MOB, bindTip } = M, A = window.APP, C = window.CONTENIDO;
const $ = id=> document.getElementById("body-" + id);
const NS = M.SVGNS;

/* ------------------------------------------------------------ utilidades SVG */
function sv(tag, attrs, parent){ const n = document.createElementNS(NS, tag); Object.keys(attrs||{}).forEach(k=> n.setAttribute(k, attrs[k])); if(parent) parent.appendChild(n); return n; }
function tx(parent, x, y, text, cls, anchor){ const t = sv("text", { x:x, y:y, class:cls || "ax-t", "text-anchor":anchor || "start" }, parent); t.textContent = text; return t; }
function txs(parent, x, y, arr, cls, anchor, lh){ arr.forEach((s,i)=> tx(parent, x, y + i*lh, s, cls, anchor)); }
function activable(node, label, act){
  node.setAttribute("tabindex","0"); node.setAttribute("role","button"); node.setAttribute("aria-label", label);
  if(act){ node.addEventListener("click", act); node.addEventListener("keydown", e=>{ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); act(); } }); }
}
const store = { get(k){ try{ return JSON.parse(localStorage.getItem(k) || "null"); }catch(e){ return null; } }, set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} } };
const pct = (x, d)=> fmt(x*100, d === undefined ? 1 : d) + " %";
const sinTildes = s=> String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");

/* Diseños con un código propio para la selección compartida entre el árbol, el selector y el relato */
const DIS = A.disenos.map((d,i)=> Object.assign({ cod:"d"+i }, d));
const disPor = nombre=> DIS.find(d=> d.nombre === nombre);
const disCod = cod=> DIS.find(d=> d.cod === cod);

/* ------------------------------------------------------------ partes y secciones (toda sección analítica es una pregunta) */
const PARTES = [
  { id:"C", k:"Para empezar", t:"Tu curso", d:"La ruta de primer y segundo año, cómo se evalúa y qué vas a aprender." },
  { id:"I", k:"Primera parte", t:"Planear el estudio", d:"Pregunta, diseño, tamaño de muestra, variables y protocolo." },
  { id:"II", k:"Segunda parte", t:"Leer y evaluar", d:"Efecto, pronóstico, pruebas diagnósticas, metanálisis y guías." },
  { id:"III", k:"Tercera parte", t:"Sintetizar y publicar", d:"Revisión sistemática con IA, avance de resultados, citas y formato." },
  { id:"IV", k:"Cuarta parte", t:"Recursos", d:"Mapas mentales, glosario y referencias." }
];
const SECCIONES = [
  { id:"resumen", part:null, toc:"Resumen", title:"Resumen", sub:"Para qué sirve el aula y cómo recorrerla", open:true, subs:[{id:"resumen-relato",label:"El recorrido, paso a paso"},{id:"resumen-preguntas",label:"Las preguntas del aula"}] },
  { id:"rutas", part:"C", toc:"¿Qué te corresponde este año?", title:"¿Qué te corresponde en primer y segundo año?", sub:"Sesión conjunta, ruta R1 y ruta R2, bloque por bloque", open:false },
  { id:"evaluacion", part:"C", toc:"¿Cómo se evalúa?", title:"¿Cómo se evalúa y cuándo?", sub:"Cuatro evidencias, calendario y calculadora de la nota", open:false, subs:[{id:"evaluacion-criterios",label:"Las cuatro evidencias"},{id:"evaluacion-calendario",label:"Calendario"},{id:"evaluacion-calculadora",label:"Calculadora de la nota"}] },
  { id:"temas", part:"C", toc:"¿Qué vas a aprender?", title:"¿Qué vas a aprender en esta aula?", sub:"Temas, competencias y fuentes", open:false },
  { id:"pregunta", part:"I", toc:"¿Cómo se formula la pregunta?", title:"¿Cómo se convierte una duda clínica en pregunta, título y objetivos?", sub:"Constructor de la pregunta PICO, de frecuencia o PCC", open:false },
  { id:"diseno", part:"I", toc:"¿Qué diseño tiene el estudio?", title:"¿Qué diseño tiene el estudio que lees?", sub:"Árbol de decisión, guía de reporte y herramienta de evaluación", open:false, subs:[{id:"diseno-arbol",label:"Árbol de decisión"},{id:"diseno-selector",label:"Guía y herramienta por diseño"},{id:"diseno-ficha",label:"Ficha de lectura crítica"}] },
  { id:"muestra", part:"I", toc:"¿Cuántos participantes?", title:"¿Cuántos participantes necesitas?", sub:"Las seis calculadoras de tamaño de muestra del Excel, paso a paso", open:false, subs:[{id:"muestra-calculadora",label:"Calculadora"},{id:"muestra-formula",label:"La fórmula, paso a paso"},{id:"muestra-curva",label:"¿Cómo cambia la muestra?"}] },
  { id:"variables", part:"I", toc:"¿Qué variables mides?", title:"¿Qué variables vas a medir y cómo se describen?", sub:"Tipo de variable, escala y estadística descriptiva en Excel", open:false, subs:[{id:"variables-tipo",label:"Tipo de variable"},{id:"variables-excel",label:"Estadística descriptiva en Excel"}] },
  { id:"protocolo", part:"I", toc:"¿Qué debe tener tu protocolo?", title:"¿Qué debe tener tu protocolo de investigación?", sub:"Lista de Proyecto I y categoría de riesgo ético", open:false, subs:[{id:"protocolo-riesgo",label:"Categoría de riesgo"}] },
  { id:"efecto", part:"II", toc:"¿Qué tan grande es el efecto?", title:"¿Qué tan grande y qué tan preciso es el efecto?", sub:"Riesgos, RR, OR, reducción absoluta y NNT", open:false },
  { id:"pronostico", part:"II", toc:"¿Cómo se lee un pronóstico?", title:"¿Cómo se lee un estudio de pronóstico?", sub:"Cohorte, hazard ratio y curvas de supervivencia", open:false, subs:[{id:"pronostico-lectura",label:"Cinco preguntas de lectura"}] },
  { id:"diagnostica", part:"II", toc:"¿Qué tan buena es la prueba?", title:"¿Qué tan buena es una prueba diagnóstica?", sub:"Sensibilidad, especificidad, razones de verosimilitud y probabilidad postest", open:false },
  { id:"metanalisis", part:"II", toc:"¿Cómo se lee un metanálisis?", title:"¿Cómo se lee un metanálisis?", sub:"Forest plot, efecto combinado y heterogeneidad", open:false },
  { id:"guias", part:"II", toc:"¿Cuánto confiar en una guía?", title:"¿Cuánto confiar en una guía de práctica clínica y en un estudio económico?", sub:"AGREE II y razón de costo-efectividad incremental", open:false, subs:[{id:"guias-agree",label:"AGREE II"},{id:"guias-rcei",label:"Costo-efectividad"}] },
  { id:"practica", part:"II", toc:"¿Reconoces el diseño?", title:"¿Reconoces el diseño, la herramienta y la medida?", sub:"Preguntas de práctica con retroalimentación", open:false },
  { id:"revision", part:"III", toc:"¿Cómo se hace una revisión con IA?", title:"¿Cómo se hace una revisión sistemática con apoyo de IA?", sub:"Diez fases, buenas prácticas y declaración de uso", open:false, subs:[{id:"revision-fases",label:"Las diez fases"},{id:"revision-practicas",label:"Buenas prácticas"},{id:"revision-declaracion",label:"Declaración de uso de IA"},{id:"revision-claude",label:"Qué necesitas en Claude"}] },
  { id:"avance", part:"III", toc:"¿Cómo presentas el avance?", title:"¿Cómo se recogen los datos y se presenta el avance de resultados?", sub:"Lista de Proyecto II y plantilla del diccionario de variables", open:false, subs:[{id:"avance-diccionario",label:"Diccionario de variables"}] },
  { id:"citas", part:"III", toc:"¿Cómo se citan las referencias?", title:"¿Cómo se citan las referencias?", sub:"Mendeley y estilo Vancouver", open:false },
  { id:"formato", part:"III", toc:"¿Cómo se presenta el manuscrito?", title:"¿Cómo se presenta el manuscrito?", sub:"Listas de verificación para Word, Excel y PowerPoint", open:false },
  { id:"recursos", part:"IV", toc:"¿Dónde profundizar?", title:"¿Dónde profundizar?", sub:"Mapas mentales y herramientas", open:false },
  { id:"glosario", part:"IV", toc:"Glosario", title:"Glosario", sub:"Términos del aula, con su fuente", open:false },
  { id:"referencias", part:"IV", toc:"Referencias", title:"Referencias", sub:"Con enlace verificable", open:false }
];
const IDEAS = {
  rutas:"Primer año condensa Metodología I y Lectura crítica; segundo año, Proyecto de investigación I y II. Cada bloque enlaza la sección del aula que lo apoya.",
  evaluacion:"La nota definitiva suma cuatro evidencias con pesos de 40, 30, 15 y 15 % y se expresa con un entero y un decimal.",
  pregunta:"Una buena pregunta ya contiene el título, el objetivo general y el diseño probable del estudio.",
  variables:"El tipo de variable decide cómo se resume: frecuencias para categorías; media o mediana para números, según la forma de la distribución.",
  protocolo:"Un protocolo coherente encadena la pregunta, los objetivos, el diseño, la muestra, las variables, el análisis y la ética.",
  avance:"Un buen avance muestra cuántos participantes van, qué tan limpios están los datos y una primera tabla con su medida principal.",
  pronostico:"El hazard ratio compara el riesgo instantáneo del evento entre grupos, pero la decisión clínica también necesita el riesgo absoluto en el tiempo.",
  diagnostica:"La sensibilidad y la especificidad describen la prueba; las razones de verosimilitud cambian la probabilidad de enfermedad de tu paciente.",
  metanalisis:"El efecto combinado vale tanto como la comparabilidad de los estudios: antes del rombo, mira la heterogeneidad.",
  guias:"Una guía se evalúa por cómo se hizo, dominio por dominio; un estudio económico, por su razón incremental y su incertidumbre.",
  temas:"El aula recorre el ciclo de un estudio, de la pregunta a la publicación, con una competencia concreta por tema.",
  diseno:"El diseño se identifica por lo que hicieron los investigadores, no por cómo lo nombra el título.",
  muestra:"La muestra depende de la confianza, la precisión y la variabilidad esperadas: pedir el doble de precisión casi cuadruplica el número de participantes.",
  practica:"Clasificar bien el diseño es el primer paso para elegir la guía de reporte y la herramienta de evaluación correctas.",
  efecto:"Un resultado se lee con su tamaño, absoluto y relativo, y con su intervalo de confianza.",
  revision:"La IA acelera tareas; las decisiones y la responsabilidad son del equipo revisor.",
  citas:"Las citas se insertan con un gestor de referencias y cada una se verifica con su DOI o su URL.",
  formato:"Un manuscrito bien presentado usa estilos, numeración automática y datos ordenados.",
  recursos:"Cada mapa mental resume un tema del aula y sirve para repasarlo antes de clase."
};

/* ============================================================ TAMAÑO DE MUESTRA (fórmulas del Excel Muestreo.xlsx) */
/* Inversa de la normal estándar (algoritmo de Acklam, error relativo < 1,2e-9): equivale a NORMINV(p; 0; 1) del Excel. */
function normInv(p){
  const a=[-3.969683028665376e+01,2.209460984245205e+02,-2.759285104469687e+02,1.383577518672690e+02,-3.066479806614716e+01,2.506628277459239e+00];
  const b=[-5.447609879822406e+01,1.615858368580409e+02,-1.556989798598866e+02,6.680131188771972e+01,-1.328068155288572e+01];
  const c=[-7.784894002430293e-03,-3.223964580411365e-01,-2.400758277161838e+00,-2.549732539343734e+00,4.374664141464968e+00,2.938163982698783e+00];
  const d=[7.784695709041462e-03,3.224671290700398e-01,2.445134137142996e+00,3.754408661907416e+00];
  const pl = 0.02425; let q, r;
  if(p < pl){ q = Math.sqrt(-2*Math.log(p)); return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
  if(p > 1-pl){ q = Math.sqrt(-2*Math.log(1-p)); return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
  q = p - 0.5; r = q*q;
  return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
}
const MU = A.muestreo, HOJA = {}; MU.calculadoras.forEach(h=> HOJA[h.hoja] = h);
const f2 = x=> fmt(x, 2), f4 = x=> fmt(x, 4);
const fN = x=> Number(x).toLocaleString("es-CO", { maximumFractionDigits: Math.abs(x) >= 100 ? 0 : Math.abs(x) >= 10 ? 1 : Math.abs(x) >= 1 ? 2 : 3 });
/* Devuelve n (sin redondear), las filas intermedias del Excel y la fórmula general y con números */
function calcular(hoja, v){
  const z = normInv(1 - v.alfa/2), pasos = [ { s:"1 − α/2", l:"Nivel de confianza a dos colas", t:pct(1 - v.alfa/2) }, { s:"Z₁₋α/₂", l:"Valor Z de la confianza: NORMINV(1 − α/2; 0; 1)", t:f4(z) } ];
  const Z2 = "Z₁₋α/₂²";
  let n, gen, sus;
  if(hoja === "CAFI" || hoja === "CAIN"){
    const q = 1 - v.p; pasos.push({ s:"q", l:"Complemento de p: 1 − p", t:f2(q) });
    if(hoja === "CAFI"){
      n = (v.N*z*z*v.p*q)/((v.d*v.d)*(v.N-1) + z*z*v.p*q);
      gen = ["N · " + Z2 + " · p · q", "d² · (N − 1) + " + Z2 + " · p · q"];
      sus = [fmt(v.N) + " · " + f4(z) + "² · " + f2(v.p) + " · " + f2(q), fmt(v.d,3) + "² · " + fmt(v.N - 1) + " + " + f4(z) + "² · " + f2(v.p) + " · " + f2(q)];
    } else {
      n = (z*z*v.p*q)/(v.d*v.d);
      gen = [Z2 + " · p · q", "d²"]; sus = [f4(z) + "² · " + f2(v.p) + " · " + f2(q), fmt(v.d,3) + "²"];
    }
  } else if(hoja === "NUFI" || hoja === "NUIN"){
    const s2 = v.s*v.s; pasos.push({ s:"s²", l:"Varianza: s · s", t:fN(s2) });
    if(hoja === "NUFI"){
      n = (v.N*z*z*s2)/((v.d*v.d)*(v.N-1) + z*z*s2);
      gen = ["N · " + Z2 + " · s²", "d² · (N − 1) + " + Z2 + " · s²"];
      sus = [fmt(v.N) + " · " + f4(z) + "² · " + fN(s2), fN(v.d) + "² · " + fmt(v.N - 1) + " + " + f4(z) + "² · " + fN(s2)];
    } else {
      n = (z*z*s2)/(v.d*v.d);
      gen = [Z2 + " · s²", "d²"]; sus = [f4(z) + "² · " + fN(s2), fN(v.d) + "²"];
    }
  } else {
    const zb = normInv(1 - v.beta);
    pasos.push({ s:"1 − β", l:"Poder estadístico", t:pct(1 - v.beta) }, { s:"Z₁₋β", l:"Valor Z del poder: NORMINV(1 − β; 0; 1)", t:f4(zb) });
    if(hoja === "COCA"){
      const pm = (v.p1 + v.p2)/2; pasos.push({ s:"p̄", l:"Promedio de las prevalencias: (p₁ + p₂) / 2", t:f2(pm) });
      n = Math.pow(z*Math.sqrt(2*pm*(1-pm)) + zb*Math.sqrt(v.p1*(1-v.p1) + v.p2*(1-v.p2)), 2)/Math.pow(v.p1 - v.p2, 2);
      gen = ["[ Z₁₋α/₂ · √(2 · p̄ · (1 − p̄)) + Z₁₋β · √(p₁(1 − p₁) + p₂(1 − p₂)) ]²", "(p₁ − p₂)²"];
      sus = ["[ " + f4(z) + " · √(2 · " + f2(pm) + " · " + f2(1-pm) + ") + " + f4(zb) + " · √(" + f2(v.p1) + " · " + f2(1-v.p1) + " + " + f2(v.p2) + " · " + f2(1-v.p2) + ") ]²", "(" + f2(v.p1) + " − " + f2(v.p2) + ")²"];
    } else {
      n = (z + zb)*(z + zb)*(v.v1 + v.v2)/(v.dif*v.dif);
      gen = ["(Z₁₋α/₂ + Z₁₋β)² · (s₁² + s₂²)", "(x̄₁ − x̄₂)²"];
      sus = ["(" + f4(z) + " + " + f4(zb) + ")² · (" + fN(v.v1) + " + " + fN(v.v2) + ")", fN(v.dif) + "²"];
    }
  }
  return { n:n, pasos:pasos, gen:gen, sus:sus, grupos:/^CO/.test(hoja) };
}
const nEnt = n=> Math.ceil(n - 1e-9);
const nDe = (hoja, v)=> calcular(hoja, v).n;

/* Estado de las calculadoras: se conserva cuando el documento se redibuja al cruzar el ancho del celular */
const MS = { obj:"frecuencia", marco:true, vals:{} };
MU.calculadoras.forEach(h=>{ MS.vals[h.hoja] = {}; h.p.forEach(p=> MS.vals[h.hoja][p.k] = p.v); });
const hojaActual = ()=> MU.calculadoras.find(h=> h.objetivo === MS.obj && (h.marco === undefined || h.marco === MS.marco));
const esComparacion = h=> h.objetivo.indexOf("dos") === 0;

/* Eje de la curva: qué parámetro se mueve y cómo se rotula */
const pp = x=> fmt(x*100, Math.abs(x*100 - Math.round(x*100)) > 1e-6 ? 1 : 0);
function ejeCurva(h){
  if(h.objetivo === "frecuencia") return { k:"d", t:"Precisión (puntos porcentuales)", lab:x=> pp(x) + " pp", largo:x=> "una precisión de ±" + pp(x) + " puntos porcentuales" };
  if(h.objetivo === "promedio") return { k:"d", t:"Precisión (unidades de la medida)", lab:x=> fN(x), largo:x=> "una precisión de ±" + fN(x) + " unidades" };
  if(h.objetivo === "dosFrecuencias") return { k:"dp", t:"Diferencia entre las prevalencias (puntos porcentuales)", lab:x=> pp(x) + " pp", largo:x=> "una diferencia de " + pp(x) + " puntos porcentuales" };
  return { k:"dif", t:"Diferencia entre los promedios (unidades)", lab:x=> fN(x), largo:x=> "una diferencia de " + fN(x) + " unidades" };
}
/* n en función de x, conservando el resto de los valores */
function nEnX(h, v, x){
  const w = Object.assign({}, v);
  if(h.objetivo === "dosFrecuencias"){ const sg = v.p1 >= v.p2 ? -1 : 1; w.p2 = v.p1 + sg*x; } else w[ejeCurva(h).k] = x;
  return nDe(h.hoja, w);
}
function xActual(h, v){ return h.objetivo === "dosFrecuencias" ? Math.abs(v.p1 - v.p2) : v[ejeCurva(h).k]; }
function rangoX(h, v){
  const x = xActual(h, v); let x1 = x*2.5;
  if(h.objetivo === "frecuencia") x1 = Math.min(x1, 0.5);
  if(h.objetivo === "dosFrecuencias"){ const lim = v.p1 >= v.p2 ? v.p1 - 0.005 : 0.995 - v.p1; x1 = Math.min(x1, lim); }
  return [x*0.5, Math.max(x1, x*1.05)];
}

/* Curva: n según la precisión o la diferencia, con el punto actual y, si se conoce N, la referencia sin N */
function curvaSVG(h, v, story){
  const W = story ? VW(560, 340) : VW(780, 344), H = story ? VW(330, 300) : VW(330, 290);
  const L = VW(66, 52), R = VW(22, 14), T = 44, B = VW(58, 56), E = ejeCurva(h);
  const [x0, x1] = rangoX(h, v), xc = xActual(h, v), K = 60;
  const pts = [], ref = [], sinN = h.marco === true ? (h.hoja === "CAFI" ? "CAIN" : "NUIN") : null;
  for(let i=0;i<=K;i++){ const x = x0 + (x1 - x0)*i/K; pts.push([x, nEnX(h, v, x)]); if(sinN) ref.push([x, nEnX(HOJA[sinN], v, x)]); }
  const ymax = M.niceMax(Math.max(...pts.map(p=> p[1]), ...ref.map(p=> p[1])));
  const sx = x=> L + (W - L - R)*(x - x0)/(x1 - x0), sy = y=> T + (H - T - B)*(1 - y/ymax);
  const s = svgEl(W, H, "curva-svg" + (story ? " story-svg" : ""), "Tamaño de la muestra según " + E.t.toLowerCase());
  M.ticks(ymax).forEach(t=>{ sv("line",{x1:L, x2:W-R, y1:sy(t), y2:sy(t), class:"grid-l"}, s); tx(s, L-8, sy(t)+4, fmt(t), "ax-s", "end"); });
  const nx = MOB() ? 3 : 5;
  for(let i=0;i<=nx;i++){ const x = x0 + (x1-x0)*i/nx; tx(s, sx(x), H-B+20, E.lab(x), "ax-s", i === nx ? "end" : i === 0 && MOB() ? "start" : "middle"); }
  tx(s, (L + W - R)/2, H - 10, E.t, "ax-s ax-b", "middle");
  tx(s, 4, 16, esComparacion(h) ? "n por grupo" : "n (participantes)", "ax-s ax-b", "start");
  sv("line",{x1:L, x2:W-R, y1:sy(0), y2:sy(0), class:"axis-l"}, s);
  const path = a=> a.map((p,i)=> (i ? "L" : "M") + sx(p[0]).toFixed(1) + " " + sy(p[1]).toFixed(1)).join(" ");
  if(sinN){ sv("path",{d:path(ref), class:"curva-ref"}, s); const q = ref[Math.round(K*0.55)]; tx(s, sx(q[0]), sy(q[1]) - 10, "Si no se conociera N", "ax-s ax-muted", "start"); }
  sv("path",{d:path(pts), class:"curva-l"}, s);
  const marcas = MOB() ? 6 : 8;
  for(let i=0;i<=marcas;i++){
    const x = x0 + (x1-x0)*i/marcas, n = nEnX(h, v, x), g = sv("g",{class:"curva-pt"}, s);
    sv("circle",{cx:sx(x), cy:sy(n), r:6}, g);
    activable(g, E.lab(x) + ": n = " + fmt(nEnt(n)));
    bindTip(g, ()=> "<h5>" + esc(E.lab(x)) + "</h5><p>n = <strong>" + fmt(nEnt(n)) + "</strong>" + (esComparacion(h) ? " por grupo" : "") + "</p>" + (sinN ? "<p>Sin conocer N: " + fmt(nEnt(nEnX(HOJA[sinN], v, x))) + "</p>" : ""));
  }
  const nc = nDe(h.hoja, v), cx = sx(xc), cy = sy(nc);
  sv("line",{x1:cx, x2:cx, y1:cy, y2:sy(0), class:"curva-guia"}, s);
  sv("circle",{cx:cx, cy:cy, r:8, class:"curva-cur"}, s);
  const izq = cx > W*0.6;
  tx(s, cx + (izq ? -14 : 14), cy - 12, "n = " + fmt(nEnt(nc)), "ax-t ax-b curva-lab", izq ? "end" : "start");
  return s;
}
function lecturaCurva(h, v){
  const E = ejeCurva(h), x = xActual(h, v), n = nEnt(nDe(h.hoja, v));
  if(!esComparacion(h)){
    const nMas = nEnt(nEnX(h, v, x*1.5)), nMenos = nEnt(nEnX(h, v, x*0.5)), r = nMenos/n;
    let t = "Con " + E.largo(x) + " necesitas <strong>" + fmt(n) + "</strong> participantes. Si aceptas " + E.largo(x*1.5) + ", bastan " + fmt(nMas) + "; si exiges " + E.largo(x*0.5) + ", necesitas " + fmt(nMenos) + ": " + fmt(r, 1) + " veces más.";
    if(h.marco === true){ const ninf = nEnt(nDe(h.hoja === "CAFI" ? "CAIN" : "NUIN", v)), ah = 1 - n/ninf; t += " Como conoces el tamaño de la población (N = " + fmt(v.N) + "), la muestra es " + (ah >= 0.005 ? fmt(ah*100, 1) + " % menor que" : "prácticamente igual a") + " la que pedirías si no lo conocieras (" + fmt(ninf) + ")."; }
    return t + " La curva cae rápido al principio: la precisión es lo que más encarece un estudio.";
  }
  const nMitad = nEnt(nEnX(h, v, x*0.5));
  return "Para detectar " + E.largo(x) + " con un poder de " + pct(1 - v.beta, 0) + " necesitas <strong>" + fmt(n) + " por grupo</strong> (" + fmt(2*n) + " en total). Si la diferencia real fuera la mitad, necesitarías " + fmt(nMitad) + " por grupo, unas " + fmt(nMitad/n, 1) + " veces más. Las diferencias pequeñas exigen muestras grandes.";
}

/* Campo numérico (con deslizador cuando el rango es acotado). Los porcentajes se escriben en %. */
function campo(h, par, onChange){
  const enPct = par.tipo === "pct" || par.tipo === "prop", k = enPct ? 100 : 1, id = "m-" + h.hoja + "-" + par.k;
  const red = x=> Math.round(x*1e6)/1e6, val = ()=> MS.vals[h.hoja][par.k];
  const inp = el("input",{ type:"number", id:id, inputmode:"decimal", min:red(par.min*k), max:red(par.max*k), step:red(par.step*k), value:red(val()*k) });
  const rng = enPct ? el("input",{ type:"range", min:red(par.min*k), max:red(par.max*k), step:red(par.step*k), value:red(val()*k), "aria-label":par.l + " (deslizador)" }) : null;
  const err = el("span",{class:"m-err", role:"status"});
  const usar = (txt, origen)=>{
    const x = parseFloat(String(txt).replace(",", "."));
    if(!isFinite(x) || x < par.min*k - 1e-9 || x > par.max*k + 1e-9){ err.textContent = "Escribe un valor entre " + fmt(par.min*k, par.tipo === "dec" ? 3 : enPct && par.min*k % 1 ? 1 : 0) + " y " + fmt(par.max*k, 0) + (enPct ? " %" : "") + "."; inp.setAttribute("aria-invalid","true"); return; }
    err.textContent = ""; inp.removeAttribute("aria-invalid");
    MS.vals[h.hoja][par.k] = par.tipo === "entero" ? Math.round(x) : x/k;
    if(origen !== inp) inp.value = red(x);
    if(rng && origen !== rng) rng.value = red(x);
    onChange();
  };
  inp.addEventListener("input", ()=> usar(inp.value, inp));
  if(rng) rng.addEventListener("input", ()=> usar(rng.value, rng));
  return el("div",{class:"m-field"},[
    el("label",{for:id},[ el("span",{class:"m-sym"},[par.s]), " " + par.l ]),
    el("div",{class:"m-ctrl"},[ rng, el("span",{class:"m-num"},[ inp, enPct ? el("span",{class:"m-unit"},["%"]) : null ]) ]),
    err
  ]);
}
/* Notación con subíndices y superíndices reales (el texto viene de calcular(), no del usuario, y se escapa igual) */
function mathHTML(s){
  return esc(s).replace(/Z₁₋α\/₂/g, "<i>Z</i><sub>1−α/2</sub>").replace(/Z₁₋β/g, "<i>Z</i><sub>1−β</sub>")
    .replace(/x̄₁/g, "<i>x̄</i><sub>1</sub>").replace(/x̄₂/g, "<i>x̄</i><sub>2</sub>")
    .replace(/([spd])₁/g, "<i>$1</i><sub>1</sub>").replace(/([spd])₂/g, "<i>$1</i><sub>2</sub>")
    .replace(/²/g, "<sup>2</sup>").replace(/(^|[^\w>])([Npqds])(?![\w̄])(?![^<]*>)/g, "$1<i>$2</i>");
}
function fraccion(num, den){ return el("div",{class:"fx", role:"math", "aria-label":"n igual a " + num + " dividido por " + den},[ el("span",{class:"fx-lhs"},["n ="]), el("span",{class:"frac"},[ el("span",{class:"fx-num", html:mathHTML(num)}), el("span",{class:"fx-den", html:mathHTML(den)}) ]) ]); }

function muestra(){
  const b = $("muestra");
  b.appendChild(el("p",null,["Estas calculadoras reproducen las seis hojas del libro de Excel de muestreo, con las mismas fórmulas y los mismos valores de ejemplo, para que no tengas que abrir el archivo. Elige qué quieres hacer, escribe tus valores y mira cómo se arma el resultado."]));
  b.appendChild(el("p",{class:"link-row"},[
    el("a",{href:MU.excel, target:"_blank", rel:"noopener", class:"btn"},["Abrir el Excel original"]), " ",
    el("a",{href:MU.video, target:"_blank", rel:"noopener", class:"btn"},["Video: " + MU.videoTitulo]), " ",
    el("a",{href:MU.mapa, target:"_blank", rel:"noopener", class:"btn"},["Mapa mental de muestreo"])
  ]));
  M.sub(b, "muestra-calculadora", "Calculadora", "Tres pasos: qué quieres hacer, si conoces el tamaño de la población y tus valores.");
  const objRow = el("div",{class:"m-step"},[ el("p",{class:"m-step-k"},["1. ¿Qué quieres hacer?"]), M.chips(MU.objetivos.map(o=> ({ id:o.id, label:o.t })), MS.obj, id=>{ MS.obj = id; arma(); }, "Objetivo del cálculo") ]);
  const objDesc = el("p",{class:"muted m-desc"}), marcoBox = el("div",{class:"m-step"});
  const grid = el("div",{class:"m-grid"}), inputs = el("div",{class:"m-inputs"}), out = el("div",{class:"m-out", "aria-live":"polite"});
  grid.appendChild(inputs); grid.appendChild(out);
  b.appendChild(objRow); b.appendChild(objDesc); b.appendChild(marcoBox); b.appendChild(grid);
  M.sub(b, "muestra-formula", "La fórmula, paso a paso", "Las mismas filas que el Excel: los valores que escribes, los intermedios y la fórmula con tus números.");
  const fx = el("div",{class:"m-formula"}); b.appendChild(fx);
  M.sub(b, "muestra-curva", "¿Cómo cambia la muestra?", "La curva muestra el tamaño de la muestra al mover el parámetro que más pesa; el punto grande es tu cálculo.");
  const how = el("div"), box = el("div",{class:"chart-box curva-box"}), lec = M.reading();
  b.appendChild(how); b.appendChild(box); b.appendChild(lec);
  b.appendChild(M.sourceLine("Fuente: libro Muestreo.xlsx del autor (hojas CAFI, CAIN, NUFI, NUIN, COCA y CONU). El resultado se redondea al entero superior, como es convención al calcular tamaños de muestra."));

  function actualiza(){
    const h = hojaActual(), v = MS.vals[h.hoja], r = calcular(h.hoja, v);
    out.innerHTML = "";
    if(!isFinite(r.n) || r.n <= 0){ out.appendChild(el("p",{class:"m-err"},["Con estos valores no se puede calcular: revisa que la precisión o la diferencia no sean cero."])); fx.innerHTML = ""; box.innerHTML = ""; M.setReading(lec, "Ajusta los valores para ver la curva."); return; }
    const n = nEnt(r.n);
    out.appendChild(el("div",{class:"m-res"},[
      el("span",{class:"m-res-k"},[r.grupos ? "Tamaño de cada grupo" : "Tamaño de la muestra"]),
      el("strong",{class:"m-res-n"},["n = " + fmt(n)]),
      el("span",{class:"m-res-d"},[ r.grupos ? "participantes por grupo; " + fmt(2*n) + " en total." : "participantes." ]),
      el("span",{class:"m-res-d muted"},["Valor exacto: " + fmt(r.n, 2) + ", redondeado hacia arriba. Hoja " + h.hoja + " del Excel."])
    ]));
    fx.innerHTML = "";
    fx.appendChild(el("p",{class:"m-formula-k"},["Hoja " + h.hoja + ": " + h.t.charAt(0).toLowerCase() + h.t.slice(1) + "."]));
    fx.appendChild(fraccion(r.gen[0], r.gen[1]));
    const fila = p=> [p.s, p.l, p.tipo === "pct" ? pct(v[p.k], 0) : p.tipo === "prop" ? pct(v[p.k], 1) + " (" + fmt(v[p.k], 3) + ")" : p.tipo === "entero" ? fmt(v[p.k]) : fN(v[p.k])];
    fx.appendChild(M.tabla(["Símbolo","Qué es","Valor"], h.p.map(fila).concat(r.pasos.map(p=> [p.s, p.l, p.t])), "m-tab"));
    fx.appendChild(el("p",{class:"m-formula-k"},["Con tus números:"]));
    fx.appendChild(fraccion(r.sus[0], r.sus[1]));
    fx.appendChild(el("p",{class:"m-formula-res"},["n = " + fmt(r.n, 2) + " → " + fmt(n) + (r.grupos ? " por grupo" : "")]));
    box.innerHTML = ""; box.appendChild(curvaSVG(h, v));
    M.setReading(lec, lecturaCurva(h, v));
  }
  function arma(){
    const O = MU.objetivos.find(o=> o.id === MS.obj); objDesc.textContent = O.d;
    marcoBox.innerHTML = "";
    if(!esComparacion({ objetivo:MS.obj })){
      marcoBox.appendChild(el("p",{class:"m-step-k"},["2. ¿Conoces el tamaño de la población (marco muestral)?"]));
      marcoBox.appendChild(M.chips([{id:"si", label:"Sí, lo conozco"},{id:"no", label:"No, o es muy grande"}], MS.marco ? "si" : "no", id=>{ MS.marco = id === "si"; arma(); }, "Marco muestral"));
    } else marcoBox.appendChild(el("p",{class:"m-step-k"},["2. Son dos grupos: la fórmula incluye el poder estadístico (1 − β)."]));
    const h = hojaActual();
    inputs.innerHTML = "";
    inputs.appendChild(el("p",{class:"m-step-k"},["3. Tus valores (ejemplo de la hoja " + h.hoja + ")"]));
    h.p.forEach(p=> inputs.appendChild(campo(h, p, actualiza)));
    const reset = el("button",{type:"button", class:"btn"},["Volver a los valores del Excel"]);
    reset.addEventListener("click", ()=>{ h.p.forEach(p=> MS.vals[h.hoja][p.k] = p.v); arma(); });
    inputs.appendChild(reset);
    how.innerHTML = ""; how.appendChild(M.howTo("el eje horizontal es " + ejeCurva(h).t.toLowerCase() + " y el vertical, el número de participantes" + (esComparacion(h) ? " por grupo" : "") + ". Pasa el cursor o toca los puntos para ver cada valor."));
    actualiza();
  }
  arma();
}

/* ============================================================ ÁRBOL DE DECISIÓN */
const AR = A.arbol.nodos;
const cortoOp = o=> o.c || (/^Sí/.test(o.t) ? "Sí" : /^No/.test(o.t) ? "No" : o.t);
/* Distribución en escalera: la respuesta «No» que lleva a otra pregunta baja por la misma columna;
   las demás respuestas salen a la derecha. Así el árbol cabe en tres columnas legibles. */
function layoutArbol(){
  const P = {}, E = [];
  (function lay(id, col, fila){
    P[id] = { col:col, fila:fila };
    let r = fila;
    const abajo = o=> AR[o.a] && /^No/.test(o.t);
    AR[id].o.filter(o=> !abajo(o)).forEach(o=>{
      if(AR[o.a]){ E.push({ de:id, a:o.a, t:cortoOp(o), dir:"der" }); r = lay(o.a, col + 1, r); }
      else { const k = "hoja:" + o.a; P[k] = { col:col + 1, fila:r, hoja:true, nombre:o.a }; E.push({ de:id, a:k, t:cortoOp(o), dir:"der" }); r++; }
    });
    r = Math.max(r, fila + 1);
    AR[id].o.filter(abajo).forEach(o=>{ E.push({ de:id, a:o.a, t:cortoOp(o), dir:"abajo" }); r = lay(o.a, col, r); });
    return Math.max(r, fila + 1);
  })(A.arbol.inicio, 0, 0);
  return { P:P, E:E, filas:Math.max(...Object.values(P).map(p=> p.fila)) + 1, cols:Math.max(...Object.values(P).map(p=> p.col)) + 1 };
}
/* ruta: ids de las preguntas recorridas; fin: nombre del diseño al que se llegó */
function arbolSVG(ruta, fin){
  const { P, E, filas, cols } = layoutArbol();
  const bw = 184, gap = 150, fila = 64, bh = 46, W = 16 + cols*bw + (cols - 1)*gap, H = filas*fila + 10;
  const X = p=> 8 + p.col*(bw + gap), Y = p=> 6 + p.fila*fila;
  const s = svgEl(W, H, "tree-svg", "Árbol de decisión para clasificar el diseño del estudio");
  const enRuta = new Set(ruta || []), llegada = fin ? "hoja:" + fin : null, activo = (ruta && ruta.length) || fin;
  E.forEach(e=>{
    const a = P[e.de], c = P[e.a], on = enRuta.has(e.de) && (enRuta.has(e.a) || e.a === llegada), cls = "tree-e" + (on ? " on" : activo ? " dim" : "");
    if(e.dir === "abajo"){
      const x = X(a) + 26, y1 = Y(a) + bh, y2 = Y(c);
      sv("path",{ d:"M" + x + " " + y1 + " V" + y2, class:cls }, s);
      tx(s, x + 8, (y1 + y2)/2 + 5, e.t, "tree-et" + (on ? " on" : ""), "start");
    } else {
      const x1 = X(a) + bw, y1 = Y(a) + bh/2, x2 = X(c), y2 = Y(c) + bh/2, xm = x1 + 14;
      sv("path",{ d:"M" + x1 + " " + y1 + " H" + xm + " V" + y2 + " H" + x2, class:cls }, s);
      const ls = e.t.length > 15 ? M.wrapText(e.t, 12).slice(0,2) : [e.t];
      txs(s, xm + 8, y2 - 7 - (ls.length - 1)*14, ls, "tree-et" + (on ? " on" : ""), "start", 14);
    }
  });
  Object.keys(P).forEach(k=>{
    const p = P[k], g = sv("g",{ class:"tree-n" + (p.hoja ? " hoja" : "") + ((p.hoja ? k === llegada : enRuta.has(k)) ? " on" : activo ? " dim" : "") }, s);
    sv("rect",{ x:X(p), y:Y(p), width:bw, height:bh, rx:p.hoja ? 23 : 8 }, g);
    const lab = p.hoja ? p.nombre : AR[k].c, ls = M.wrapText(lab, 22).slice(0,2);
    txs(g, X(p) + bw/2, Y(p) + (ls.length > 1 ? 19 : 28), ls, "tree-t", "middle", 16);
    if(p.hoja){ const d = disPor(p.nombre); g.setAttribute("data-cod", d.cod); activable(g, d.nombre + ": " + d.guia + " y " + d.herramienta, ()=> M.select(d.cod));
      bindTip(g, ()=> "<h5>" + esc(d.nombre) + "</h5><p>Guía de reporte: <strong>" + esc(d.guia) + "</strong></p><p>Herramienta: <strong>" + esc(d.herramienta) + "</strong></p>"); }
    else { activable(g, AR[k].p); bindTip(g, ()=> "<h5>" + esc(AR[k].c) + "</h5><p>" + esc(AR[k].p) + "</p>"); }
  });
  const marca = cod=> s.querySelectorAll("[data-cod]").forEach(n=> n.classList.toggle("sel", n.getAttribute("data-cod") === cod));
  marca(M.STATE.sel); M.onSelect(marca);
  return s;
}
function fichaDiseno(d){
  return el("div",{class:"grid2"},[
    el("article",{class:"card"},[ el("h4",null,["Guía de reporte"]), el("p",null,[ el("strong",null,[d.guia]) ]), el("p",null,[ el("a",{href:d.guiaUrl, target:"_blank", rel:"noopener"},["Abrir la guía"]) ]),
      el("h4",null,["Herramienta de evaluación crítica"]), el("p",null,[ el("strong",null,[d.herramienta]) ]), el("p",null,[ el("a",{href:d.herrUrl, target:"_blank", rel:"noopener"},["Abrir la herramienta"]) ]) ]),
    el("article",{class:"card"},[ el("h4",null,["Preguntas clave"]), el("ul",null, d.preguntas.map(p=> el("li",null,[p]))) ])
  ]);
}
const AST = { ruta:[], resp:[], fin:null };
function diseno(){
  const b = $("diseno");
  b.appendChild(el("p",null,["Cada diseño tiene su guía de reporte y su herramienta de evaluación. La guía dice qué debe contar el artículo; la herramienta dice cuánto confiar en lo que cuenta."]));
  M.sub(b, "diseno-arbol", "Árbol de decisión: clasifica tu estudio", "Responde sobre el artículo que tienes delante. El diagrama marca tu camino y al final verás su diseño, su guía y su herramienta.");
  const box = el("div",{class:"tree-q", "aria-live":"polite"}), dia = el("div",{class:"diagram-wrap tree-wrap"});
  b.appendChild(box);
  b.appendChild(M.howTo("cada recuadro es una pregunta y cada óvalo, un diseño. Las líneas marcadas son tus respuestas; toca un óvalo para ver su guía y su herramienta."));
  b.appendChild(dia);
  const pinta = ()=>{ dia.innerHTML = ""; dia.appendChild(arbolSVG(AST.ruta, AST.fin)); };
  const botones = ()=>{
    if(!AST.resp.length) return;
    const at = el("button",{type:"button", class:"btn"},["Volver atrás"]), re = el("button",{type:"button", class:"btn"},[AST.fin ? "Clasificar otro estudio" : "Empezar de nuevo"]);
    at.addEventListener("click", ()=>{ AST.resp.pop(); const prev = AST.ruta.pop(); AST.fin = null; pregunta(prev || A.arbol.inicio); });
    re.addEventListener("click", ()=>{ AST.ruta = []; AST.resp = []; AST.fin = null; pregunta(A.arbol.inicio); });
    box.appendChild(el("div",{class:"tools-row"},[at, re]));
  };
  const pregunta = id=>{
    const n = AR[id];
    box.innerHTML = "";
    if(AST.resp.length) box.appendChild(el("p",{class:"trail"},["Tus respuestas: " + AST.resp.join(" → ")]));
    box.appendChild(el("p",{class:"q"},[n.p]));
    const ops = el("div",{class:"opts"});
    n.o.forEach(o=>{ const bt = el("button",{type:"button", class:"opt"},[o.t]); bt.addEventListener("click", ()=> responde(id, o)); ops.appendChild(bt); });
    box.appendChild(ops); botones(); pinta();
  };
  const responde = (id, o)=>{
    AST.ruta.push(id); AST.resp.push(o.t);
    if(AR[o.a]) return pregunta(o.a);
    AST.fin = o.a; const d = disPor(o.a);
    box.innerHTML = "";
    box.appendChild(el("p",{class:"trail"},["Tus respuestas: " + AST.resp.join(" → ")]));
    box.appendChild(el("p",{class:"q"},["Tu estudio es: " + d.nombre]));
    box.appendChild(fichaDiseno(d));
    box.appendChild(el("p",{class:"muted small"},["Si el artículo se declara de un diseño distinto del que muestra el árbol (por ejemplo, un estudio observacional llamado ensayo), la clasificación correcta es la que describe su método."]));
    botones(); pinta(); M.select(d.cod);
  };
  /* reanuda donde iba si el documento se redibuja al cambiar de ancho */
  if(AST.fin){ const ult = AST.ruta.pop(); AST.resp.pop(); responde(ult, AR[ult].o.find(o=> o.a === AST.fin)); }
  else if(AST.ruta.length){ const ult = AST.ruta[AST.ruta.length-1]; pregunta(AR[ult].o.find(o=> o.t === AST.resp[AST.resp.length-1]).a); }
  else pregunta(A.arbol.inicio);

  M.sub(b, "diseno-selector", "Guía y herramienta por diseño", "O elige el diseño directamente; también cambia al tocar un óvalo del árbol.");
  const sel = el("select",{id:"sel-diseno"}, DIS.map(d=> el("option",{value:d.cod},[d.nombre])));
  const out = el("div");
  b.appendChild(el("label",{class:"field"},[ el("span",null,["Diseño del estudio"]), sel ])); b.appendChild(out);
  const muestraDis = cod=>{ const d = disCod(cod) || DIS[0]; sel.value = d.cod; out.innerHTML = ""; out.appendChild(fichaDiseno(d)); };
  sel.addEventListener("change", ()=> M.select(sel.value));
  muestraDis(M.STATE.sel); M.onSelect(muestraDis);

  M.sub(b, "diseno-ficha", "Ficha de lectura crítica en cinco pasos");
  b.appendChild(el("ol",{class:"steps"},[
    el("li",null,[ el("strong",null,["Pregunta. "]), "¿Cuál es la población, la intervención o exposición, el comparador y el desenlace?" ]),
    el("li",null,[ el("strong",null,["Diseño. "]), "¿Qué diseño es y qué guía de reporte le corresponde?" ]),
    el("li",null,[ el("strong",null,["Validez interna. "]), "¿Qué sesgos podrían explicar el resultado?" ]),
    el("li",null,[ el("strong",null,["Resultados. "]), "¿Qué tan grande y qué tan preciso es el efecto?" ]),
    el("li",null,[ el("strong",null,["Aplicabilidad. "]), "¿Mi paciente se parece a los del estudio y el beneficio supera el daño?" ])
  ]));
}

/* ============================================================ PRÁCTICA */
const QZ = { i:0, puntos:0 };
function practica(){
  const b = $("practica");
  b.appendChild(el("p",null,[A.practica.length + " preguntas de práctica con retroalimentación. No son las del examen: sirven para entrenar el criterio."]));
  const qz = el("div",{class:"quiz", "aria-live":"polite"}); b.appendChild(qz);
  const pinta = ()=>{
    qz.innerHTML = "";
    if(QZ.i >= A.practica.length){
      qz.appendChild(el("p",{class:"q"},["Terminaste: " + QZ.puntos + " de " + A.practica.length + " respuestas correctas."]));
      qz.appendChild(el("p",null,["Repasa las explicaciones de las que fallaste y vuelve a intentarlo."]));
      const r = el("button",{type:"button", class:"btn btn-primary"},["Repetir la práctica"]); r.addEventListener("click", ()=>{ QZ.i = 0; QZ.puntos = 0; pinta(); });
      qz.appendChild(el("div",{class:"tools-row"},[r])); return;
    }
    const q = A.practica[QZ.i];
    qz.appendChild(el("div",{class:"qz-bar", role:"progressbar", "aria-label":"Avance de la práctica", "aria-valuemin":"0", "aria-valuemax":String(A.practica.length), "aria-valuenow":String(QZ.i)},[ el("span",{style:"width:" + (100*QZ.i/A.practica.length) + "%"}) ]));
    qz.appendChild(el("p",{class:"trail"},["Pregunta " + (QZ.i + 1) + " de " + A.practica.length + " · aciertos: " + QZ.puntos]));
    qz.appendChild(el("p",{class:"q"},[q.q]));
    const ops = el("div",{class:"opts"}), fb = el("div");
    q.o.forEach((t,k)=>{ const bt = el("button",{type:"button", class:"opt"},[t]); bt.addEventListener("click", ()=>{
      if(bt.disabled) return; if(k === q.r) QZ.puntos++;
      ops.querySelectorAll(".opt").forEach((x,j)=>{ x.disabled = true; if(j === q.r) x.classList.add("ok"); else if(j === k) x.classList.add("bad"); });
      fb.appendChild(el("p",{class:"fb " + (k === q.r ? "fb-ok" : "fb-bad")},[ el("strong",null,[k === q.r ? "Correcto. " : "No es esa. "]), q.e ]));
      const sg = el("button",{type:"button", class:"btn btn-primary"},[QZ.i + 1 < A.practica.length ? "Siguiente pregunta" : "Ver resultado"]);
      sg.addEventListener("click", ()=>{ QZ.i++; pinta(); }); fb.appendChild(el("div",{class:"tools-row"},[sg])); sg.focus();
    }); ops.appendChild(bt); });
    qz.appendChild(ops); qz.appendChild(fb);
  };
  pinta();
}

/* ============================================================ EFECTO */
const EF = { a:15, n1:100, c:20, n2:100 };
function efectoCalc(v){
  const ok0 = v.n1 > 0 && v.n2 > 0 && v.a >= 0 && v.c >= 0 && v.a <= v.n1 && v.c <= v.n2 && [v.a, v.c, v.n1, v.n2].every(Number.isInteger);
  if(!ok0) return null;
  const r1 = v.a/v.n1, r0 = v.c/v.n2, rar = r0 - r1, ok = v.a > 0 && v.c > 0 && v.a < v.n1 && v.c < v.n2, z = 1.96;
  const rr = r1/r0, or = (v.a/(v.n1-v.a))/(v.c/(v.n2-v.c));
  const se1 = Math.sqrt(1/v.a - 1/v.n1 + 1/v.c - 1/v.n2), se2 = Math.sqrt(1/v.a + 1/(v.n1-v.a) + 1/v.c + 1/(v.n2-v.c));
  return { r1, r0, rar, ok, rr, or, rrLo:Math.exp(Math.log(rr) - z*se1), rrHi:Math.exp(Math.log(rr) + z*se1), orLo:Math.exp(Math.log(or) - z*se2), orHi:Math.exp(Math.log(or) + z*se2), nnt: rar === 0 ? Infinity : 1/Math.abs(rar) };
}
function efectoSVG(r, story){
  const W = story ? VW(560, 340) : VW(780, 344), L = VW(110, 84), R = VW(30, 18);
  const H = story ? VW(330, 330) : VW(300, 310), s = svgEl(W, H, "efecto-svg" + (story ? " story-svg" : ""), "Riesgos por grupo y medidas de efecto con su intervalo de confianza");
  const rmax = M.niceMax(Math.max(r.r1, r.r0)*100), bx = x=> L + (W - L - R - 64)*x/rmax;
  tx(s, 0, 18, "Riesgo del evento", "ax-t ax-b");
  [["Tratados", r.r1, "ef-bar-t"], ["Control", r.r0, "ef-bar-c"]].forEach((d,i)=>{
    const y = 34 + i*36, g = sv("g",{class:"ef-row"}, s);
    tx(g, L - 10, y + 17, d[0], "ax-t", "end");
    sv("rect",{x:L, y:y, width:Math.max(1, bx(d[1]*100) - L), height:24, rx:3, class:d[2]}, g);
    tx(g, bx(d[1]*100) + 8, y + 17, pct(d[1]), "ax-t ax-b");
    activable(g, d[0] + ": " + pct(d[1])); bindTip(g, ()=> "<h5>" + d[0] + "</h5><p>Riesgo: <strong>" + pct(d[1]) + "</strong></p>");
  });
  const y0 = 140, lo = Math.min(0.25, r.ok ? Math.min(r.rrLo, r.orLo)*0.8 : 0.25), hi = Math.max(4, r.ok ? Math.max(r.rrHi, r.orHi)*1.25 : 4);
  const lx = x=> L + (W - L - R)*(Math.log(x) - Math.log(lo))/(Math.log(hi) - Math.log(lo));
  tx(s, 0, y0 - 8, "Efecto relativo (escala logarítmica)", "ax-t ax-b");
  const ty = H - 40;
  [0.1, 0.25, 0.5, 1, 2, 4, 10, 20].filter(t=> t >= lo && t <= hi).forEach(t=>{ sv("line",{x1:lx(t), x2:lx(t), y1:y0 + 6, y2:ty, class:t === 1 ? "ef-uno" : "grid-l"}, s); tx(s, lx(t), ty + 18, fmt(t, t < 1 ? 2 : 0), "ax-s", "middle"); });
  tx(s, lx(1), ty + 34, "1 = sin diferencia", "ax-s ax-muted", "middle");
  if(r.ok) [["RR", r.rr, r.rrLo, r.rrHi], ["OR", r.or, r.orLo, r.orHi]].forEach((d,i)=>{
    const y = y0 + 34 + i*40, g = sv("g",{class:"ef-ci"}, s);
    tx(g, L - 10, y + 5, d[0], "ax-t ax-b", "end");
    sv("line",{x1:lx(d[2]), x2:lx(d[3]), y1:y, y2:y, class:"ef-ci-l"}, g);
    sv("rect",{x:lx(d[1]) - 7, y:y - 7, width:14, height:14, class:"ef-ci-p"}, g);
    activable(g, d[0] + " " + fmt(d[1], 2) + ", intervalo de " + fmt(d[2], 2) + " a " + fmt(d[3], 2));
    bindTip(g, ()=> "<h5>" + d[0] + "</h5><p><strong>" + fmt(d[1], 2) + "</strong>, IC 95 %: " + fmt(d[2], 2) + " a " + fmt(d[3], 2) + "</p><p>" + (d[2] <= 1 && d[3] >= 1 ? "El intervalo incluye 1." : "El intervalo no incluye 1.") + "</p>");
  });
  else tx(s, L, y0 + 50, "Necesita eventos en ambos grupos para el intervalo.", "ax-s ax-muted");
  return s;
}
function lecturaEfecto(r){
  if(!r) return "Revisa los datos: los eventos deben ser enteros y no pueden superar el total del grupo.";
  const nnt = r.nnt === Infinity ? null : Math.ceil(r.nnt - 1e-9);
  const t = "El riesgo es " + pct(r.r1) + " en los tratados y " + pct(r.r0) + " en el control: una " + (r.rar >= 0 ? "reducción" : "diferencia en contra") + " absoluta de " + fmt(Math.abs(r.rar)*100, 1) + " puntos" + (nnt ? " (" + (r.rar >= 0 ? "NNT" : "NNH") + " = " + fmt(nnt) + ")" : "") + ". ";
  if(!r.ok) return t + "Con cero eventos, o con todos los pacientes con evento, el intervalo no se calcula con este método.";
  const cruza = r.rrLo <= 1 && r.rrHi >= 1;
  return t + "El RR es <strong>" + fmt(r.rr, 2) + "</strong> (IC 95 %: " + fmt(r.rrLo, 2) + " a " + fmt(r.rrHi, 2) + "). " + (cruza ? "El intervalo incluye 1: el estudio no demuestra diferencia, aunque el valor puntual sea " + fmt(r.rr, 2) + "." : "El intervalo no incluye 1: la diferencia es estadísticamente significativa.") + " Pregúntate también si la magnitud importa clínicamente.";
}
function efecto(){
  const b = $("efecto");
  b.appendChild(el("p",null,["Escribe los eventos y los totales de cada grupo. Los intervalos de confianza del 95 % usan el método logarítmico."]));
  const f = (id, l, k)=>{ const i = el("input",{type:"number", id:id, min:"0", step:"1", value:String(EF[k]), inputmode:"numeric"}); i.addEventListener("input", ()=>{ EF[k] = Number(i.value); calc(); }); return el("label",null,[l, i]); };
  b.appendChild(el("div",{class:"calc"},[
    el("fieldset",null,[ el("legend",null,["Grupo tratado"]), f("ef-a","Eventos","a"), f("ef-n1","Total","n1") ]),
    el("fieldset",null,[ el("legend",null,["Grupo control"]), f("ef-c","Eventos","c"), f("ef-n2","Total","n2") ])
  ]));
  const kp = el("div",{class:"kpis", "aria-live":"polite"}), box = el("div",{class:"chart-box"}), lec = M.reading();
  b.appendChild(kp); b.appendChild(M.howTo("arriba, el riesgo de cada grupo (barras desde cero); abajo, el RR y el OR con su intervalo. Si la línea del intervalo cruza el 1, no hay diferencia demostrada.")); b.appendChild(box); b.appendChild(lec);
  b.appendChild(M.sourceLine("Cálculo propio a partir de la tabla de 2 × 2 que escribes. Definiciones: Cochrane Handbook, capítulos 6 y 15."));
  function calc(){
    const r = efectoCalc(EF); kp.innerHTML = ""; box.innerHTML = "";
    if(r){
      const k = (t, v, s)=> kp.appendChild(el("div",{class:"kpi"},[ el("small",null,[t]), el("strong",null,[v]), el("span",null,[s||""]) ]));
      k("Riesgo tratados", pct(r.r1)); k("Riesgo control", pct(r.r0)); k("Reducción absoluta", fmt(r.rar*100, 1) + " pts");
      k("RR", r.ok ? fmt(r.rr, 2) : "—", r.ok ? "IC 95 %: " + fmt(r.rrLo, 2) + " a " + fmt(r.rrHi, 2) : "Necesita eventos en ambos grupos");
      k("OR", r.ok ? fmt(r.or, 2) : "—", r.ok ? "IC 95 %: " + fmt(r.orLo, 2) + " a " + fmt(r.orHi, 2) : "");
      k(r.rar >= 0 ? "NNT" : "NNH", r.nnt === Infinity ? "—" : fmt(Math.ceil(r.nnt - 1e-9)), "Pacientes a tratar");
      box.appendChild(efectoSVG(r));
    }
    M.setReading(lec, lecturaEfecto(r));
  }
  calc();
}

/* ============================================================ REVISIÓN CON IA */
const RV = { fase:0 };
function fasesSVG(story, onPick){
  const n = A.fases.length, W = story ? VW(560, 340) : VW(840, 344), L = VW(92, 74), R = 6;
  const H = story ? VW(220, 200) : VW(262, 200), cw = (W - L - R)/n, yIA = 48, yEq = 118;
  const s = svgEl(W, H, "fases-svg" + (story ? " story-svg" : ""), "Las diez fases de una revisión sistemática con apoyo de IA");
  txs(s, L - 14, yIA - 4, ["La IA", "propone"], "ax-t ax-b fa-ia-t", "end", 17);
  txs(s, L - 14, yEq - 4, ["El equipo", "decide"], "ax-t ax-b fa-eq-t", "end", 17);
  sv("line",{x1:L, x2:W-R, y1:yIA, y2:yIA, class:"fa-lane"}, s); sv("line",{x1:L, x2:W-R, y1:yEq, y2:yEq, class:"fa-lane"}, s);
  const r = Math.min(14, cw/2 - 2);
  A.fases.forEach((f,i)=>{
    const cx = L + cw*(i + 0.5), g = sv("g",{class:"fa-col" + (!story && i === RV.fase ? " on" : "")}, s);
    sv("rect",{x:cx - cw/2 + 1, y:yIA - 26, width:cw - 2, height:(yEq - yIA) + 52, rx:8, class:"fa-hit"}, g);
    sv("line",{x1:cx, x2:cx, y1:yIA, y2:yEq, class:"fa-link"}, g);
    sv("circle",{cx:cx, cy:yIA, r:r, class:"fa-ia"}, g); sv("circle",{cx:cx, cy:yEq, r:r, class:"fa-eq"}, g);
    tx(g, cx, yIA + 5, String(f.n), "fa-num", "middle"); tx(g, cx, yEq + 5, String(f.n), "fa-num", "middle");
    if(!MOB() && !story) txs(g, cx, yEq + 40, M.wrapText(f.nombre, 10), "fa-name", "middle", 15);
    activable(g, "Fase " + f.n + ": " + f.nombre, onPick ? ()=> onPick(i) : null);
    bindTip(g, ()=> "<h5>" + f.n + ". " + esc(f.nombre) + "</h5><p><strong>IA:</strong> " + esc(f.ia) + "</p><p><strong>Equipo:</strong> " + esc(f.humano) + "</p>");
  });
  if(MOB() || story) txs(s, L, H - 34, MOB() ? ["Toca cada fase para ver", "su detalle."] : ["Pasa el cursor o toca cada fase para ver su detalle."], "ax-s ax-muted", "start", 16);
  return s;
}
function revision(){
  const b = $("revision");
  b.appendChild(el("p",null,["La IA acelera tareas, pero las decisiones y la responsabilidad son del equipo revisor. Estas son las diez fases, qué hace cada parte y qué se entrega."]));
  M.sub(b, "revision-fases", "Las diez fases", "Toca una fase para ver qué puede hacer la IA, qué hace el equipo, qué se entrega y qué riesgo vigilar.");
  const box = el("div",{class:"diagram-wrap fases-wrap"}), card = el("div",{class:"fase-card", "aria-live":"polite"});
  b.appendChild(M.howTo("cada columna es una fase; arriba lo que propone la IA y abajo lo que decide el equipo.")); b.appendChild(box); b.appendChild(card);
  const pick = i=>{ RV.fase = i; box.innerHTML = ""; box.appendChild(fasesSVG(false, pick)); const f = A.fases[i];
    card.innerHTML = "";
    card.appendChild(el("h4",null,["Fase " + f.n + ". " + f.nombre]));
    card.appendChild(el("div",{class:"grid2"},[
      el("article",{class:"card fa-card-ia"},[ el("h5",null,["Qué puede hacer la IA"]), el("p",null,[f.ia]) ]),
      el("article",{class:"card fa-card-eq"},[ el("h5",null,["Qué hace el equipo"]), el("p",null,[f.humano]) ]),
      el("article",{class:"card"},[ el("h5",null,["Entregable"]), el("p",null,[f.entregable]) ]),
      el("article",{class:"card fa-card-r"},[ el("h5",null,["Riesgo a vigilar"]), el("p",null,[f.riesgo]) ])
    ]));
    const nav = el("div",{class:"tools-row"});
    if(i > 0){ const p = el("button",{type:"button", class:"btn"},["← Fase " + i]); p.addEventListener("click", ()=> pick(i-1)); nav.appendChild(p); }
    if(i < A.fases.length - 1){ const nx = el("button",{type:"button", class:"btn btn-primary"},["Fase " + (i+2) + " →"]); nx.addEventListener("click", ()=> pick(i+1)); nav.appendChild(nx); }
    card.appendChild(nav);
  };
  pick(RV.fase);

  M.sub(b, "revision-practicas", "Buenas prácticas");
  b.appendChild(el("ul",{class:"bp"}, A.mejoresPracticas.map(t=> el("li",null,[t]))));

  M.sub(b, "revision-declaracion", "Generador de declaración de uso de IA", "Completa los campos y copia el texto para la sección de métodos. Es una plantilla: revísala con tu equipo y con las normas de la revista.");
  const campos = [["d_herr","Herramienta y versión","Ej.: nombre del modelo y versión"],["d_fecha","Fecha de uso",""],["d_fase","Fase de la revisión",""],["d_prop","Para qué se usó","Ej.: proponer sinónimos para la ecuación"],["d_ver","Cómo se verificó","Ej.: dos revisores contrastaron con los artículos"],["d_resp","Responsables","Ej.: autoras y autores del equipo"]];
  const form = el("div",{class:"decl"}), outD = el("pre",{class:"out", tabindex:"0"});
  campos.forEach(c=>{
    const inp = c[0] === "d_fase" ? el("select",{id:c[0]}, A.fases.map(f=> el("option",null,[f.nombre]))) : el("input",{id:c[0], type:c[0] === "d_fecha" ? "date" : "text", placeholder:c[2]});
    inp.addEventListener("input", decl); inp.addEventListener("change", decl); form.appendChild(el("label",null,[c[1], inp]));
  });
  b.appendChild(form); b.appendChild(outD);
  const copiar = el("button",{type:"button", class:"btn btn-primary"},["Copiar texto"]), msg = el("span",{class:"muted small", role:"status"});
  b.appendChild(el("div",{class:"tools-row"},[copiar, msg]));
  function decl(){
    const v = (id, alt)=> (form.querySelector("#" + id).value || "").trim() || alt;
    outD.textContent = "Declaración de uso de inteligencia artificial. Se utilizó " + v("d_herr","[herramienta y versión]") + " (fecha de uso: " + v("d_fecha","[fecha]") + ") en la fase de " + v("d_fase","[fase]") + " para " + v("d_prop","[propósito]") + ". Los resultados se verificaron así: " + v("d_ver","[método de verificación]") + ". La responsabilidad de las decisiones y del contenido final es de " + v("d_resp","[responsables]") + ", y la IA no reemplazó el juicio del equipo.";
  }
  decl();
  copiar.addEventListener("click", ()=>{ const t = outD.textContent, ok = ()=>{ msg.textContent = "Texto copiado."; setTimeout(()=> msg.textContent = "", 2500); };
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, ()=> msg.textContent = "Selecciona el texto y cópialo con Ctrl+C."); else msg.textContent = "Selecciona el texto y cópialo con Ctrl+C."; });

  M.sub(b, "revision-claude", "Qué necesitas en Claude");
  b.appendChild(M.tabla(["Nombre","Tipo","Para qué","Nota"], A.herramientasClaude.map(h=> [h.nombre, h.tipo, h.paraQue, h.nota])));
  b.appendChild(el("p",{class:"muted small"},["Sobre el reporte: la declaración conjunta de Cochrane, Campbell, JBI y CEE (2025) pide supervisión humana e informar con transparencia cualquier uso de IA que sugiera juicios. PRISMA-trAIce es una propuesta de lista de verificación y no una extensión oficial de PRISMA."]));
}

/* ============================================================ CITAS, FORMATO, TEMAS Y RECURSOS */
function citas(){
  const b = $("citas");
  b.appendChild(el("div",{class:"grid2"},[
    el("article",{class:"card"},[ el("h4",null,["Mendeley en cinco pasos"]), el("ol",{class:"steps small"},[
      el("li",null,["Crea tu cuenta y descarga ", el("a",{href:"https://www.mendeley.com/download-reference-manager/windows", target:"_blank", rel:"noopener"},["Mendeley Reference Manager"]), "."]),
      el("li",null,["Instálalo y, en el menú Tools, elige Install Mendeley Cite for Microsoft Word."]),
      el("li",null,["Importa el artículo con su DOI, su PDF o el Web Importer."]),
      el("li",null,["Crea una carpeta por trabajo."]),
      el("li",null,["En Word, abre Referencias, Mendeley Cite, inserta la cita y elige el estilo Vancouver."]) ]),
      el("p",{class:"muted small"},["Para páginas web sin DOI puedes usar ", el("a",{href:"https://chromewebstore.google.com/detail/mybib-free-citation-gener/phidhnmbkbkbkbknhldmpmnacgicphkf", target:"_blank", rel:"noopener"},["MyBib"]), "; revisa autor, fecha y URL antes de aceptar la cita."]) ]),
    el("article",{class:"card"},[ el("h4",null,["Estilo Vancouver"]), el("ul",null, A.vancouver.reglas.map(t=> el("li",null,[t]))),
      el("p",{class:"ex"},[A.vancouver.ejemplo]), el("h5",null,["Errores frecuentes"]), el("ul",null, A.vancouver.errores.map(t=> el("li",null,[t]))) ])
  ]));
}
function formato(){
  const b = $("formato"), KEY = "aula-ofimatica-v1", saved = store.get(KEY) || {};
  let total = 0; Object.keys(A.ofimatica).forEach(k=> total += A.ofimatica[k].length);
  const prog = el("p",{class:"progress", "aria-live":"polite"}), bar = el("div",{class:"qz-bar"},[ el("span") ]);
  const upd = ()=>{ const n = Object.keys(saved).filter(k=> saved[k]).length; prog.textContent = "Tu avance: " + n + " de " + total + " puntos cumplidos."; bar.firstChild.style.width = (100*n/total) + "%"; };
  b.appendChild(el("p",null,["Marca lo que ya cumples en tu manuscrito; el progreso queda guardado solo en este navegador."]));
  b.appendChild(prog); b.appendChild(bar);
  const grid = el("div",{class:"grid3"});
  Object.keys(A.ofimatica).forEach(k=> grid.appendChild(el("article",{class:"card ofi"},[ el("h4",null,[k]) ].concat(A.ofimatica[k].map((t,i)=>{
    const id = k + "-" + i, cb = el("input",{type:"checkbox"}); cb.checked = !!saved[id];
    cb.addEventListener("change", ()=>{ saved[id] = cb.checked; store.set(KEY, saved); upd(); });
    return el("label",{class:"chk"},[cb, el("span",null,[t])]);
  })))));
  b.appendChild(grid); upd();
}
function temas(){
  const b = $("temas");
  b.appendChild(el("p",null,["Cada tema indica la competencia que desarrolla y sus fuentes. Filtra por palabra clave."]));
  const inp = el("input",{type:"search", id:"filtro-temas", placeholder:"Filtrar: PRISMA, Mendeley, GRADE…"}), host = el("div");
  b.appendChild(el("label",{class:"field", for:"filtro-temas"},[ el("span",null,["Filtrar temas"]), inp ])); b.appendChild(host);
  const pinta = ()=>{
    const q = sinTildes(inp.value);
    const filas = A.contenidos.filter(c=> sinTildes(c.tema + " " + c.competencia + " " + c.fuentes.map(f=> f.t).join(" ")).indexOf(q) !== -1)
      .map(c=> [c.tema, c.competencia, el("ul",{class:"src-list"}, c.fuentes.map(f=> el("li",null,[ el("a",{href:f.u, target:"_blank", rel:"noopener"},[f.t]) ])))]);
    host.innerHTML = "";
    host.appendChild(filas.length ? M.tabla(["Tema","Competencia a desarrollar","Fuentes"], filas, "temas-tab") : el("p",{class:"muted"},["Sin resultados para ese filtro."]));
  };
  inp.addEventListener("input", pinta); pinta();
}
function recursos(){
  const b = $("recursos");
  b.appendChild(el("div",{class:"grid3"}, A.recursos.map(r=> el("article",{class:"card rec"},[ el("h4",null,[ el("a",{href:r.u, target:"_blank", rel:"noopener"},[r.t]) ]), el("p",null,[r.d]) ]))));
}

/* ============================================================ RUTA R1 Y R2: PREGUNTA, TÍTULO Y OBJETIVOS */
const PQ_KEY = "aula-ic-pregunta";
const PQ = (function(){ try{ return JSON.parse(localStorage.getItem(PQ_KEY) || "null") || { tipo:"efecto", v:{} }; }catch(e){ return { tipo:"efecto", v:{} }; } })();
const guardaPQ = ()=>{ try{ localStorage.setItem(PQ_KEY, JSON.stringify(PQ)); }catch(e){} };
const TIPOS_PQ = {
  efecto: { label:"Efecto de una intervención (PICO)", campos:[ ["P","Población","adultos con insuficiencia cardíaca"], ["I","Intervención o exposición","un iSGLT2"], ["C","Comparador","placebo"], ["O","Desenlace","la hospitalización por insuficiencia cardíaca"] ],
    arma: v=> ({ pregunta:"En " + v.P + ", ¿" + v.I + ", comparado con " + v.C + ", modifica " + v.O + "?",
      titulo:"Efecto de " + v.I + " frente a " + v.C + " sobre " + v.O + " en " + v.P,
      general:"Comparar " + v.O + " en " + v.P + " tratados con " + v.I + " frente a " + v.C + ".",
      especificos:["Describir las características clínicas y sociodemográficas de " + v.P + " incluidos en el estudio.", "Estimar la frecuencia de " + v.O + " en cada grupo.", "Estimar el efecto de " + v.I + " sobre " + v.O + " con su intervalo de confianza del 95 %."],
      diseno:"Si los investigadores pueden asignar la intervención al azar, el diseño es un ensayo clínico aleatorizado (CONSORT 2025 y RoB 2). Si solo se observa quién la recibe, es una cohorte (STROBE).", seccion:"diseno" }) },
  frecuencia: { label:"Frecuencia de una condición", campos:[ ["X","Condición","la enfermedad renal crónica"], ["P","Población","adultos con diabetes tipo 2"], ["L","Lugar","la consulta externa de medicina interna"], ["T","Periodo","2025"] ],
    arma: v=> ({ pregunta:"¿Cuál es la prevalencia de " + v.X + " en " + v.P + " de " + v.L + " durante " + v.T + "?",
      titulo:"Prevalencia de " + v.X + " en " + v.P + " de " + v.L + ", " + v.T,
      general:"Estimar la prevalencia de " + v.X + " en " + v.P + " de " + v.L + " durante " + v.T + ".",
      especificos:["Describir las características clínicas y sociodemográficas de " + v.P + ".", "Estimar la prevalencia de " + v.X + " por sexo y grupo de edad.", "Explorar los factores asociados con " + v.X + "."],
      diseno:"Es un estudio transversal (STROBE). El tamaño de la muestra se calcula con la calculadora de estimación de frecuencias.", seccion:"muestra" }) },
  alcance: { label:"Revisión de alcance (PCC)", campos:[ ["P","Población","adultos mayores hospitalizados"], ["K","Concepto","las intervenciones para reducir la polifarmacia"], ["X","Contexto","los servicios de medicina interna"] ],
    arma: v=> ({ pregunta:"¿Qué evidencia existe sobre " + v.K + " en " + v.P + " en " + v.X + "?",
      titulo:v.K.charAt(0).toUpperCase() + v.K.slice(1) + " en " + v.P + " en " + v.X + ": revisión de alcance",
      general:"Mapear la evidencia disponible sobre " + v.K + " en " + v.P + " en " + v.X + ".",
      especificos:["Identificar los tipos de estudio que abordan " + v.K + ".", "Describir las características de " + v.P + " incluidos en esos estudios.", "Identificar los vacíos de conocimiento que orienten investigaciones futuras."],
      diseno:"Es una revisión de alcance con el esquema PCC de JBI; no lleva metanálisis.", seccion:"revision" }) }
};
function pregunta(){
  const b = $("pregunta");
  b.appendChild(el("p",null,["Escribe los elementos de tu pregunta y el aula arma la pregunta, un título y los objetivos. Es una plantilla para empezar: ajusta la redacción con tu tutor. Lo que escribes queda guardado solo en este navegador, así que sirve para la tarea del 4 de diciembre."]));
  b.appendChild(M.chips(Object.keys(TIPOS_PQ).map(k=> ({ id:k, label:TIPOS_PQ[k].label })), PQ.tipo, id=>{ PQ.tipo = id; guardaPQ(); arma(); }, "Tipo de pregunta"));
  const form = el("div",{class:"pq-form"}), out = el("div",{class:"pq-out", "aria-live":"polite"});
  b.appendChild(form); b.appendChild(out);
  b.appendChild(el("p",{class:"muted small"},["Los objetivos empiezan con un verbo en infinitivo que se pueda verificar: describir, estimar, comparar, determinar o evaluar. Evita «conocer» o «entender», que no se pueden medir. Plantilla del autor del aula."]));
  function arma(){
    const T = TIPOS_PQ[PQ.tipo]; form.innerHTML = "";
    T.campos.forEach(c=>{ const id = "pq-" + PQ.tipo + "-" + c[0], i = el("input",{type:"text", id:id, placeholder:"Ej.: " + c[2], value:(PQ.v[PQ.tipo + c[0]] || "")});
      i.addEventListener("input", ()=>{ PQ.v[PQ.tipo + c[0]] = i.value; guardaPQ(); resultado(); });
      form.appendChild(el("label",{for:id},[ el("span",{class:"m-sym"},[c[0]]), " " + c[1], i ])); });
    resultado();
  }
  function resultado(){
    const T = TIPOS_PQ[PQ.tipo], v = {}, faltan = [];
    T.campos.forEach(c=>{ const t = (PQ.v[PQ.tipo + c[0]] || "").trim(); if(!t) faltan.push(c[1].toLowerCase()); v[c[0]] = t || c[2]; });
    const r = T.arma(v); out.innerHTML = "";
    if(faltan.length) out.appendChild(el("p",{class:"muted"},[(faltan.length === T.campos.length ? "Así queda con el ejemplo. " : "Falta: " + faltan.join(", ") + ". Mientras tanto se usa el ejemplo. ")]));
    const bloque = (k, t)=> out.appendChild(el("div",{class:"pq-b"},[ el("span",{class:"pq-k"},[k]), el("p",null,[t]) ]));
    bloque("Pregunta", r.pregunta); bloque("Título", r.titulo); bloque("Objetivo general", r.general);
    out.appendChild(el("div",{class:"pq-b"},[ el("span",{class:"pq-k"},["Objetivos específicos"]), el("ol",null, r.especificos.map(e=> el("li",null,[e]))) ]));
    const ir = el("button",{type:"button", class:"btn btn-sm"},["Ir a la sección"]); ir.addEventListener("click", ()=> irA(r.seccion));
    out.appendChild(el("div",{class:"pq-b"},[ el("span",{class:"pq-k"},["Diseño probable"]), el("p",null,[r.diseno + " "]), ir ]));
    const copiar = el("button",{type:"button", class:"btn btn-primary"},["Copiar todo"]), msg = el("span",{class:"muted small", role:"status"});
    copiar.addEventListener("click", ()=>{ const t = "Pregunta: " + r.pregunta + "\nTítulo: " + r.titulo + "\nObjetivo general: " + r.general + "\nObjetivos específicos:\n" + r.especificos.map((e,i)=> (i+1) + ". " + e).join("\n");
      if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(()=> msg.textContent = "Copiado.", ()=> msg.textContent = "Selecciona el texto y cópialo con Ctrl+C."); else msg.textContent = "Selecciona el texto y cópialo con Ctrl+C."; });
    out.appendChild(el("div",{class:"tools-row"},[copiar, msg]));
  }
  arma();
}

/* ============================================================ RUTA R1: VARIABLES Y ESTADÍSTICA DESCRIPTIVA EN EXCEL */
const TIPO_VAR = {
  continua: { t:"Cuantitativa continua", escala:"De intervalo o de razón", ej:"Hemoglobina (g/dL), presión arterial sistólica, creatinina sérica.", describe:"Media y desviación estándar si la distribución es simétrica; mediana y rango intercuartílico si es asimétrica.", grafico:"Histograma o diagrama de caja.", excel:"=PROMEDIO(A2:A101), =DESVEST.M(A2:A101), =MEDIANA(A2:A101), =CUARTIL.INC(A2:A101;1) y =CUARTIL.INC(A2:A101;3)" },
  discreta: { t:"Cuantitativa discreta", escala:"De razón", ej:"Número de hospitalizaciones en el año, número de fármacos que recibe.", describe:"Mediana y rango intercuartílico; media y desviación estándar si hay muchos valores posibles y la distribución es simétrica.", grafico:"Barras (pocos valores) o histograma (muchos valores).", excel:"=MEDIANA(A2:A101), =CUARTIL.INC(A2:A101;1), =CONTAR.SI(A2:A101;0)" },
  ordinal: { t:"Cualitativa ordinal", escala:"Ordinal", ej:"Clase funcional NYHA I a IV, estadio de la enfermedad renal crónica.", describe:"Frecuencias y porcentajes de cada categoría, en su orden; puede agregarse la mediana.", grafico:"Barras con las categorías en su orden natural.", excel:"=CONTAR.SI(A2:A101;\"III\") y su porcentaje: =CONTAR.SI(A2:A101;\"III\")/CONTARA(A2:A101)" },
  dicotomica: { t:"Cualitativa nominal dicotómica", escala:"Nominal", ej:"Diabetes (sí o no), muerte a 30 días, sexo.", describe:"Frecuencia y porcentaje; si interesa la proporción, con su intervalo de confianza.", grafico:"Barras (o el porcentaje escrito, si es un solo dato).", excel:"=CONTAR.SI(A2:A101;\"Sí\")/CONTARA(A2:A101)" },
  nominal: { t:"Cualitativa nominal", escala:"Nominal", ej:"Grupo sanguíneo, régimen de afiliación, servicio de ingreso.", describe:"Frecuencias y porcentajes de cada categoría.", grafico:"Barras ordenadas de mayor a menor; evita el gráfico de pastel cuando hay muchas categorías.", excel:"=CONTAR.SI(A2:A101;\"O+\") o una tabla dinámica" }
};
const ARBOL_VAR = {
  q1: { p:"¿Los valores son números que resultan de contar o de medir?", o:[["Sí","q2"],["No, son categorías","q3"]] },
  q2: { p:"¿Puede tomar valores intermedios, con decimales?", o:[["Sí","continua"],["No, solo enteros","discreta"]] },
  q3: { p:"¿Las categorías tienen un orden natural?", o:[["Sí","ordinal"],["No","q4"]] },
  q4: { p:"¿Tiene solo dos categorías?", o:[["Sí","dicotomica"],["No, tres o más","nominal"]] }
};
const VA = { nodo:"q1", ruta:[], datos:"34\n41\n45\n47\n52\n53\n55\n58\n59\n61\n62\n63\n65\n66\n68\n70\n72\n75\n79\n88", nombre:"Edad", unidad:"años" };
function cuartilInc(s, p){ const h = (s.length - 1)*p, lo = Math.floor(h); return lo + 1 < s.length ? s[lo] + (h - lo)*(s[lo + 1] - s[lo]) : s[lo]; }
function descriptiva(xs){
  const s = xs.slice().sort((a,b)=> a - b), n = s.length, media = s.reduce((a,b)=> a + b, 0)/n;
  const de = n > 1 ? Math.sqrt(s.reduce((a,x)=> a + (x - media)*(x - media), 0)/(n - 1)) : 0;
  return { n, media, de, mediana:cuartilInc(s, 0.5), q1:cuartilInc(s, 0.25), q3:cuartilInc(s, 0.75), min:s[0], max:s[n-1], s };
}
function leeNumeros(t){ return String(t).split(/[\s;]+/).map(x=> x.trim()).filter(Boolean).map(x=> Number(x.replace(",", "."))); }
function histogramaSVG(d, nombre, unidad){
  const W = VW(780, 344), H = VW(300, 280), L = VW(52, 40), R = 14, T = 30, B = 56;
  const k = Math.max(1, Math.ceil(Math.log2(d.n) + 1)), ancho = (d.max - d.min)/k || 1, cuentas = new Array(k).fill(0);
  d.s.forEach(x=>{ let i = Math.floor((x - d.min)/ancho); if(i >= k) i = k - 1; cuentas[i]++; });
  const ymax = M.niceMax(Math.max(...cuentas)), sx = x=> L + (W - L - R)*(x - d.min)/(ancho*k), sy = y=> T + (H - T - B)*(1 - y/ymax);
  const s = svgEl(W, H, "hist-svg", "Histograma de " + nombre);
  M.ticks(ymax).forEach(t=>{ sv("line",{x1:L, x2:W-R, y1:sy(t), y2:sy(t), class:"grid-l"}, s); tx(s, L - 8, sy(t) + 4, fmt(t), "ax-s", "end"); });
  cuentas.forEach((c,i)=>{ const a = d.min + i*ancho, b2 = a + ancho, g = sv("g",{class:"hist-b"}, s);
    sv("rect",{x:sx(a) + 1, y:sy(c), width:Math.max(1, sx(b2) - sx(a) - 2), height:sy(0) - sy(c)}, g);
    const lab = fN(a) + " a " + fN(b2) + (i === k - 1 ? " (incluido)" : "");
    activable(g, lab + ": " + c + " datos"); bindTip(g, ()=> "<h5>" + esc(lab) + " " + esc(unidad) + "</h5><p><strong>" + c + "</strong> de " + d.n + " datos (" + pct(c/d.n) + ")</p>"); });
  for(let i=0;i<=k;i+= (MOB() && k > 5 ? 2 : 1)) tx(s, sx(d.min + i*ancho), H - B + 18, fN(d.min + i*ancho), "ax-s", "middle");
  tx(s, (L + W - R)/2, H - 10, nombre + (unidad ? " (" + unidad + ")" : ""), "ax-s ax-b", "middle");
  tx(s, 4, 16, "Número de datos", "ax-s ax-b");
  sv("line",{x1:L, x2:W-R, y1:sy(0), y2:sy(0), class:"axis-l"}, s);
  [["Media", d.media, "hist-media", -1], ["Mediana", d.mediana, "hist-mediana", 1]].forEach(m=>{
    const x = sx(m[1]); sv("line",{x1:x, x2:x, y1:T - 4, y2:sy(0), class:m[2]}, s);
    tx(s, x + 5*m[3], T + (m[3] < 0 ? 4 : 18), m[0] + " " + fN(m[1]), "ax-s ax-b " + m[2] + "-t", m[3] < 0 ? "end" : "start"); });
  return s;
}
function variables(){
  const b = $("variables");
  b.appendChild(el("p",null,["Una variable es una característica que cambia de un participante a otro. Su tipo decide cómo se resume y cómo se grafica. Clasifica la tuya con tres preguntas y después calcula su estadística descriptiva con las mismas fórmulas de Excel."]));
  M.sub(b, "variables-tipo", "¿Qué tipo de variable es?");
  const box = el("div",{class:"tree-q", "aria-live":"polite"}); b.appendChild(box);
  const pinta = ()=>{
    box.innerHTML = "";
    if(VA.ruta.length) box.appendChild(el("p",{class:"trail"},["Tus respuestas: " + VA.ruta.map(r=> r[1]).join(" → ")]));
    const R = TIPO_VAR[VA.nodo];
    if(R){
      box.appendChild(el("p",{class:"q"},["Es una variable " + R.t.toLowerCase() + "."]));
      box.appendChild(M.tabla(["Aspecto","Qué hacer"], [["Escala de medición", R.escala], ["Ejemplos", R.ej], ["Cómo se describe", R.describe], ["Gráfico", R.grafico], ["En Excel", R.excel]], "var-tab"));
    } else {
      const n = ARBOL_VAR[VA.nodo]; box.appendChild(el("p",{class:"q"},[n.p]));
      const ops = el("div",{class:"opts"});
      n.o.forEach(o=>{ const bt = el("button",{type:"button", class:"opt"},[o[0]]); bt.addEventListener("click", ()=>{ VA.ruta.push([VA.nodo, o[0]]); VA.nodo = o[1]; pinta(); }); ops.appendChild(bt); });
      box.appendChild(ops);
    }
    if(VA.ruta.length){ const at = el("button",{type:"button", class:"btn"},["Volver atrás"]), re = el("button",{type:"button", class:"btn"},["Clasificar otra variable"]);
      at.addEventListener("click", ()=>{ VA.nodo = VA.ruta.pop()[0]; pinta(); }); re.addEventListener("click", ()=>{ VA.nodo = "q1"; VA.ruta = []; pinta(); });
      box.appendChild(el("div",{class:"tools-row"},[at, re])); }
  };
  pinta();
  b.appendChild(el("p",{class:"muted small"},["Síntesis docente del autor del aula. Los nombres de las funciones son los de Excel en español; ver las funciones de Excel por categoría en el soporte de Microsoft."]));

  M.sub(b, "variables-excel", "Estadística descriptiva, como en Excel", "Pega una columna de números (desde Excel, uno por fila) y obtén el resumen, la fórmula de Excel de cada medida y el histograma.");
  const f = el("div",{class:"desc-form"});
  const nom = el("input",{type:"text", id:"va-nombre", value:VA.nombre}), uni = el("input",{type:"text", id:"va-unidad", value:VA.unidad});
  const ta = el("textarea",{id:"va-datos", rows:"6", spellcheck:"false"}); ta.value = VA.datos;
  f.appendChild(el("label",{for:"va-nombre"},["Nombre de la variable", nom])); f.appendChild(el("label",{for:"va-unidad"},["Unidad", uni]));
  f.appendChild(el("label",{for:"va-datos", class:"desc-datos"},["Datos (separados por salto de línea, espacio o punto y coma; decimales con coma o punto)", ta]));
  b.appendChild(f);
  b.appendChild(el("p",{class:"muted small"},["Los datos que trae son de ejemplo, inventados para practicar: la edad de 20 pacientes."]));
  const res = el("div",{"aria-live":"polite"}), how = M.howTo("cada barra cuenta cuántos datos caen en el intervalo; la línea discontinua marca la media y la continua, la mediana. Los intervalos siguen la regla de Sturges."), box2 = el("div",{class:"chart-box"}), lec = M.reading();
  b.appendChild(res); b.appendChild(how); b.appendChild(box2); b.appendChild(lec);
  b.appendChild(M.sourceLine("Cálculo propio con las mismas definiciones de Excel: DESVEST.M divide por n − 1 y CUARTIL.INC interpola entre los datos ordenados."));
  const calc = ()=>{
    VA.nombre = nom.value.trim() || "Variable"; VA.unidad = uni.value.trim(); VA.datos = ta.value;
    const xs = leeNumeros(ta.value), malos = xs.filter(x=> !isFinite(x)).length;
    res.innerHTML = ""; box2.innerHTML = "";
    if(malos){ res.appendChild(el("p",{class:"m-err"},[malos + " valor(es) no son números. Revisa que no haya texto ni celdas con símbolos."])); M.setReading(lec, "Corrige los datos para ver el resumen."); return; }
    if(xs.length < 3){ res.appendChild(el("p",{class:"m-err"},["Escribe al menos tres datos."])); M.setReading(lec, "Faltan datos."); return; }
    const d = descriptiva(xs), r = "A2:A" + (d.n + 1), u = VA.unidad ? " " + VA.unidad : "";
    res.appendChild(M.tabla(["Medida","Valor","Fórmula en Excel (datos en " + r + ")"], [
      ["Número de datos (n)", fmt(d.n), "=CONTAR(" + r + ")"], ["Media", fN(d.media) + u, "=PROMEDIO(" + r + ")"], ["Desviación estándar", fN(d.de) + u, "=DESVEST.M(" + r + ")"],
      ["Mediana", fN(d.mediana) + u, "=MEDIANA(" + r + ")"], ["Primer cuartil (Q1)", fN(d.q1) + u, "=CUARTIL.INC(" + r + ";1)"], ["Tercer cuartil (Q3)", fN(d.q3) + u, "=CUARTIL.INC(" + r + ";3)"],
      ["Rango intercuartílico", fN(d.q3 - d.q1) + u, "=CUARTIL.INC(" + r + ";3)-CUARTIL.INC(" + r + ";1)"], ["Mínimo y máximo", fN(d.min) + " y " + fN(d.max) + u, "=MIN(" + r + ") y =MAX(" + r + ")"] ], "desc-tab"));
    box2.appendChild(histogramaSVG(d, VA.nombre, VA.unidad));
    const asim = d.de > 0 ? 3*(d.media - d.mediana)/d.de : 0;
    const guia = asim > 0.5 ? "La media supera claramente a la mediana: hay asimetría hacia los valores altos, así que conviene reportar mediana y rango intercuartílico." : asim < -0.5 ? "La media queda claramente por debajo de la mediana: hay asimetría hacia los valores bajos, así que conviene reportar mediana y rango intercuartílico." : "La media y la mediana están cerca: la distribución es aproximadamente simétrica y puedes reportar media y desviación estándar.";
    M.setReading(lec, "<strong>" + esc(VA.nombre) + "</strong>: mediana " + fN(d.mediana) + u + " (RIC " + fN(d.q1) + " a " + fN(d.q3) + ") y media " + fN(d.media) + u + " (DE " + fN(d.de) + "), con " + fmt(d.n) + " datos. " + guia + " Es una orientación: revisa también la forma del histograma.");
  };
  [nom, uni, ta].forEach(i=> i.addEventListener("input", calc)); calc();
}

/* ============================================================ RUTA R1: PRONÓSTICO */
const PR = { hr:0.7, s12:0.7 };
function supervivenciaSVG(){
  const W = VW(780, 344), H = VW(320, 290), L = VW(56, 44), R = VW(30, 16), T = 24, B = 54, meses = 24;
  const lam = -Math.log(PR.s12)/12, S0 = t=> Math.exp(-lam*t), S1 = t=> Math.pow(S0(t), PR.hr);
  const sx = t=> L + (W - L - R)*t/meses, sy = p=> T + (H - T - B)*(1 - p);
  const s = svgEl(W, H, "surv-svg", "Curvas de supervivencia ilustrativas con el hazard ratio elegido");
  [0, 0.25, 0.5, 0.75, 1].forEach(p=>{ sv("line",{x1:L, x2:W-R, y1:sy(p), y2:sy(p), class:"grid-l"}, s); tx(s, L - 8, sy(p) + 4, fmt(p*100, 0) + " %", "ax-s", "end"); });
  [0, 6, 12, 18, 24].forEach(t=> tx(s, sx(t), H - B + 18, String(t), "ax-s", "middle"));
  tx(s, (L + W - R)/2, H - 10, "Meses de seguimiento", "ax-s ax-b", "middle"); tx(s, 4, 14, "Sin el evento", "ax-s ax-b");
  const path = f=>{ let d = ""; for(let i=0;i<=48;i++){ const t = meses*i/48; d += (i ? "L" : "M") + sx(t).toFixed(1) + " " + sy(f(t)).toFixed(1); } return d; };
  sv("path",{d:path(S0), class:"surv-0"}, s); sv("path",{d:path(S1), class:"surv-1"}, s);
  [[S0, "Sin el factor", "surv-0-t"], [S1, "Con el factor (HR " + fmt(PR.hr, 2) + ")", "surv-1-t"]].forEach((c,i)=>{ const y = sy(c[0](meses)); tx(s, W - R - 4, y + (c[0](meses) >= (i ? S0 : S1)(meses) ? -8 : 16), c[1], "ax-s ax-b " + c[2], "end"); });
  [12, 24].forEach(t=>{ [S0, S1].forEach((f,i)=>{ const g = sv("g",{class:"surv-pt"}, s); sv("circle",{cx:sx(t), cy:sy(f(t)), r:6, class:i ? "surv-1-p" : "surv-0-p"}, g);
    const txt = (i ? "Con el factor" : "Sin el factor") + " a los " + t + " meses: " + pct(f(t));
    activable(g, txt); bindTip(g, ()=> "<h5>" + t + " meses</h5><p>" + esc(txt) + "</p>"); }); });
  return s;
}
function pronostico(){
  const b = $("pronostico");
  b.appendChild(el("p",null,["Un estudio de pronóstico sigue a una cohorte desde un punto común (el diagnóstico, el ingreso o el inicio de un tratamiento) para estimar qué tan probable es un desenlace y qué factores lo modifican. Su medida típica es el hazard ratio (HR): compara el riesgo instantáneo del evento entre quienes tienen el factor y quienes no, en cualquier momento del seguimiento."]));
  const f = el("div",{class:"nota-form"});
  const mk = (id, l, min, max, step, k)=>{ const r = el("input",{type:"range", id:id, min:min, max:max, step:step, value:String(PR[k])}), o = el("output",{for:id, class:"m-unit"},[k === "hr" ? fmt(PR[k], 2) : pct(PR[k], 0)]);
    r.addEventListener("input", ()=>{ PR[k] = Number(r.value); o.textContent = k === "hr" ? fmt(PR[k], 2) : pct(PR[k], 0); pinta(); }); f.appendChild(el("label",{for:id},[l, el("span",{class:"m-ctrl"},[r, o])])); };
  mk("pr-hr", "Hazard ratio del factor", 0.3, 3, 0.05, "hr"); mk("pr-s12", "Supervivencia sin el factor a los 12 meses", 0.3, 0.95, 0.05, "s12");
  b.appendChild(f);
  const box = el("div",{class:"chart-box"}), lec = M.reading();
  b.appendChild(M.howTo("cada curva es la proporción que sigue sin el evento a lo largo del tiempo. Mueve el HR y mira cómo se separan; toca los puntos para ver los porcentajes a los 12 y 24 meses.")); b.appendChild(box); b.appendChild(lec);
  b.appendChild(M.sourceLine("Curvas ilustrativas, no de un estudio real: suponen un riesgo constante en el tiempo y riesgos proporcionales (la curva con el factor es la otra elevada al HR). En un artículo se leen las curvas de Kaplan-Meier."));
  function pinta(){
    box.innerHTML = ""; box.appendChild(supervivenciaSVG());
    const lam = -Math.log(PR.s12)/12, s0 = t=> Math.exp(-lam*t), s1 = t=> Math.pow(s0(t), PR.hr), dif = Math.abs(1 - PR.hr);
    M.setReading(lec, "Con un HR de <strong>" + fmt(PR.hr, 2) + "</strong>, en cualquier momento del seguimiento el riesgo instantáneo del evento es " + (PR.hr < 1 ? fmt(dif*100, 0) + " % menor" : PR.hr > 1 ? fmt(dif*100, 0) + " % mayor" : "igual") + " con el factor. A los 12 meses siguen sin el evento " + pct(s0(12)) + " sin el factor y " + pct(s1(12)) + " con él; a los 24 meses, " + pct(s0(24)) + " y " + pct(s1(24)) + ". El HR no es una diferencia de porcentajes: para el paciente importa también el riesgo absoluto en el tiempo que interesa.");
  }
  pinta();
  M.sub(b, "pronostico-lectura", "Cinco preguntas para leer un estudio de pronóstico");
  b.appendChild(el("ol",{class:"steps"},[
    el("li",null,[ el("strong",null,["Cohorte. "]), "¿Los pacientes representan a los que verás y entraron en un momento parecido de la enfermedad?" ]),
    el("li",null,[ el("strong",null,["Seguimiento. "]), "¿Fue suficientemente largo y completo? ¿Cuántos se perdieron y por qué?" ]),
    el("li",null,[ el("strong",null,["Desenlace. "]), "¿Se definió con criterios objetivos y se midió sin conocer el factor pronóstico?" ]),
    el("li",null,[ el("strong",null,["Confusión. "]), "¿Ajustaron por los factores que podrían explicar la asociación?" ]),
    el("li",null,[ el("strong",null,["Precisión. "]), "¿Qué tan estrecho es el intervalo de confianza del HR y cuántos eventos hubo?" ])
  ]));
  b.appendChild(el("p",null,["Para evaluar el riesgo de sesgo de un estudio de factores pronósticos existe QUIPS, con seis dominios: participación en el estudio, pérdidas en el seguimiento, medición del factor pronóstico, medición del desenlace, confusión, y análisis estadístico y reporte. Se reporta con STROBE, porque es una cohorte."]));
}

/* ============================================================ RUTA R1: PRUEBAS DIAGNÓSTICAS */
const DX = { vp:90, fp:30, fn:10, vn:170, pre:0.2 };
function dxCalc(v){
  const enf = v.vp + v.fn, sanos = v.fp + v.vn, n = enf + sanos;
  if([v.vp, v.fp, v.fn, v.vn].some(x=> !Number.isInteger(x) || x < 0) || !enf || !sanos) return null;
  const se = v.vp/enf, es = v.vn/sanos, lrp = es < 1 ? se/(1 - es) : Infinity, lrn = es > 0 ? (1 - se)/es : Infinity;
  const odds = v.pre/(1 - v.pre), post = lr=> lr === Infinity ? 1 : (odds*lr)/(1 + odds*lr);
  return { se, es, vpp: (v.vp + v.fp) ? v.vp/(v.vp + v.fp) : NaN, vpn: (v.fn + v.vn) ? v.vn/(v.fn + v.vn) : NaN, lrp, lrn, prev: enf/n, n, postPos:post(lrp), postNeg:post(lrn) };
}
function probSVG(r){
  const W = VW(780, 344), H = VW(170, 200), L = 16, R = 16, sx = p=> L + (W - L - R)*p, y = VW(84, 100);
  const s = svgEl(W, H, "prob-svg", "Probabilidad antes y después de la prueba");
  sv("line",{x1:sx(0), x2:sx(1), y1:y, y2:y, class:"prob-eje"}, s);
  [0, 0.25, 0.5, 0.75, 1].forEach(p=>{ sv("line",{x1:sx(p), x2:sx(p), y1:y - 6, y2:y + 6, class:"axis-l"}, s); tx(s, sx(p), y + 26, fmt(p*100, 0) + " %", "ax-s", "middle"); });
  const marca = (p, cls, lab, arriba)=>{ const g = sv("g",{class:"prob-m " + cls}, s); sv("circle",{cx:sx(p), cy:y, r:VW(10, 9)}, g);
    tx(g, Math.min(Math.max(sx(p), 60), W - 60), arriba ? y - 22 : y + 50, lab + ": " + pct(p), "ax-s ax-b", "middle");
    activable(g, lab + " " + pct(p)); bindTip(g, ()=> "<h5>" + esc(lab) + "</h5><p><strong>" + pct(p) + "</strong></p>"); };
  sv("line",{x1:sx(DX.pre), x2:sx(r.postPos), y1:y - 2, y2:y - 2, class:"prob-flecha pos"}, s); sv("line",{x1:sx(DX.pre), x2:sx(r.postNeg), y1:y + 2, y2:y + 2, class:"prob-flecha neg"}, s);
  marca(r.postNeg, "neg", "Si la prueba es negativa", false); marca(r.postPos, "pos", "Si es positiva", true); marca(DX.pre, "pre", "Antes de la prueba", r.postPos - DX.pre < 0.18 ? false : true);
  return s;
}
function diagnostica(){
  const b = $("diagnostica");
  b.appendChild(el("p",null,["La exactitud de una prueba se resume en una tabla de 2 × 2 que la compara con el estándar de referencia. La sensibilidad y la especificidad describen la prueba; los valores predictivos dependen además de cuántos enfermos hay. Las razones de verosimilitud (LR) llevan la probabilidad que tenías antes de la prueba (pretest) a la probabilidad después (postest). Se reporta con STARD 2015 y se evalúa con QUADAS-2."]));
  const t = el("table",{class:"cmp-table dx-tab"}), inp = (k, l)=>{ const i = el("input",{type:"number", min:"0", step:"1", value:String(DX[k]), "aria-label":l, id:"dx-" + k}); i.addEventListener("input", ()=>{ DX[k] = Number(i.value); calc(); }); return i; };
  t.appendChild(el("thead",null,[ el("tr",null,[ el("th",{scope:"col"},[""]), el("th",{scope:"col"},["Con la enfermedad (estándar)"]), el("th",{scope:"col"},["Sin la enfermedad"]) ]) ]));
  t.appendChild(el("tbody",null,[
    el("tr",null,[ el("th",{scope:"row"},["Prueba positiva"]), el("td",null,[inp("vp","Verdaderos positivos"), el("span",{class:"dx-k"},["Verdaderos positivos"])]), el("td",null,[inp("fp","Falsos positivos"), el("span",{class:"dx-k"},["Falsos positivos"])]) ]),
    el("tr",null,[ el("th",{scope:"row"},["Prueba negativa"]), el("td",null,[inp("fn","Falsos negativos"), el("span",{class:"dx-k"},["Falsos negativos"])]), el("td",null,[inp("vn","Verdaderos negativos"), el("span",{class:"dx-k"},["Verdaderos negativos"])]) ]) ]));
  b.appendChild(el("div",{class:"table-wrap"},[t]));
  b.appendChild(el("p",{class:"muted small"},["Los números de partida son de ejemplo, inventados para practicar."]));
  const pr = el("input",{type:"range", id:"dx-pre", min:"0.01", max:"0.99", step:"0.01", value:String(DX.pre)}), po = el("output",{for:"dx-pre", class:"m-unit"},[pct(DX.pre, 0)]);
  const usaPrev = el("button",{type:"button", class:"btn btn-sm"},["Usar la prevalencia de la tabla"]);
  pr.addEventListener("input", ()=>{ DX.pre = Number(pr.value); po.textContent = pct(DX.pre, 0); calc(); });
  usaPrev.addEventListener("click", ()=>{ const r = dxCalc(DX); if(r){ DX.pre = Math.min(0.99, Math.max(0.01, Math.round(r.prev*100)/100)); pr.value = String(DX.pre); po.textContent = pct(DX.pre, 0); calc(); } });
  b.appendChild(el("label",{for:"dx-pre", class:"field dx-pre"},["Probabilidad pretest: qué tan probable te parece la enfermedad en tu paciente antes de la prueba", el("span",{class:"m-ctrl"},[pr, po]), usaPrev]));
  const kp = el("div",{class:"kpis", "aria-live":"polite"}), box = el("div",{class:"chart-box"}), lec = M.reading();
  b.appendChild(kp); b.appendChild(M.howTo("el punto del centro es tu probabilidad antes de la prueba; las flechas muestran a dónde llega si la prueba sale positiva o negativa.")); b.appendChild(box); b.appendChild(lec);
  b.appendChild(M.sourceLine("Cálculo propio: odds postest = odds pretest × LR. Definiciones según Deeks y Altman (BMJ 2004) y el manual Cochrane de revisiones de exactitud diagnóstica."));
  function calc(){
    const r = dxCalc(DX); kp.innerHTML = ""; box.innerHTML = "";
    if(!r){ M.setReading(lec, "Revisa la tabla: deben ser números enteros, con al menos un enfermo y un sano."); return; }
    const k = (t2, v, s2)=> kp.appendChild(el("div",{class:"kpi"},[ el("small",null,[t2]), el("strong",null,[v]), el("span",null,[s2||""]) ]));
    const lr = x=> x === Infinity ? "∞" : fmt(x, 2);
    k("Sensibilidad", pct(r.se), "VP ÷ enfermos"); k("Especificidad", pct(r.es), "VN ÷ sanos"); k("LR positiva", lr(r.lrp), "Sensibilidad ÷ (1 − especificidad)"); k("LR negativa", lr(r.lrn), "(1 − sensibilidad) ÷ especificidad");
    k("Valor predictivo positivo", isFinite(r.vpp) ? pct(r.vpp) : "—", "Con la prevalencia de la tabla: " + pct(r.prev)); k("Valor predictivo negativo", isFinite(r.vpn) ? pct(r.vpn) : "—", "Con la prevalencia de la tabla");
    box.appendChild(probSVG(r));
    const fuerza = r.lrp >= 10 ? "una LR positiva de 10 o más, que suele cambiar mucho la probabilidad" : r.lrp >= 5 ? "una LR positiva moderada" : "una LR positiva baja: la prueba positiva mueve poco la probabilidad";
    M.setReading(lec, "Si antes de la prueba la probabilidad es <strong>" + pct(DX.pre) + "</strong>, un resultado positivo la lleva a <strong>" + pct(r.postPos) + "</strong> y uno negativo a <strong>" + pct(r.postNeg) + "</strong>. La prueba tiene " + fuerza + ". Los valores predictivos de la tabla (" + (isFinite(r.vpp) ? pct(r.vpp) : "—") + " y " + (isFinite(r.vpn) ? pct(r.vpn) : "—") + ") solo valen para una prevalencia de " + pct(r.prev) + "; con otra probabilidad pretest, usa las LR.");
  }
  calc();
}

/* ============================================================ RUTA R1: METANÁLISIS */
const MA = { modelo:"fijo", filas:[ ["Estudio A",12,100,24,100], ["Estudio B",30,250,45,250], ["Estudio C",9,80,8,80], ["Estudio D",25,300,50,300], ["Estudio E",22,120,15,120] ] };
function metaCalc(filas, modelo){
  const est = filas.map(f=>{ let [n, a, n1, c, n2] = f; if([a,n1,c,n2].some(x=> !Number.isInteger(x) || x < 0) || a > n1 || c > n2 || !n1 || !n2) return null;
    let A = a, B = n1 - a, Cc = c, D = n2 - c; if(!A || !Cc || !B || !D){ A += 0.5; B += 0.5; Cc += 0.5; D += 0.5; }
    const y = Math.log((A/(A + B))/(Cc/(Cc + D))), v = 1/A - 1/(A + B) + 1/Cc - 1/(Cc + D); return { n, y, v, se:Math.sqrt(v) }; });
  if(est.some(e=> !e) || est.length < 2) return null;
  const w = est.map(e=> 1/e.v), sw = w.reduce((a,b)=> a + b, 0), yf = est.reduce((a,e,i)=> a + w[i]*e.y, 0)/sw;
  const Q = est.reduce((a,e,i)=> a + w[i]*(e.y - yf)*(e.y - yf), 0), df = est.length - 1, I2 = Q > 0 ? Math.max(0, (Q - df)/Q) : 0;
  const tau2 = Math.max(0, (Q - df)/(sw - w.reduce((a,x)=> a + x*x, 0)/sw));
  const wr = est.map(e=> 1/(e.v + (modelo === "aleatorio" ? tau2 : 0))), swr = wr.reduce((a,b)=> a + b, 0), y = est.reduce((a,e,i)=> a + wr[i]*e.y, 0)/swr, se = Math.sqrt(1/swr);
  return { est:est.map((e,i)=> Object.assign(e, { peso:wr[i]/swr })), y, se, Q, df, I2, tau2, rr:Math.exp(y), lo:Math.exp(y - 1.96*se), hi:Math.exp(y + 1.96*se) };
}
function forestSVG(r){
  const mob = MOB(), W = VW(820, 344), fila = VW(34, 40), lab = VW(150, 92), der = VW(210, 0), T = 34, n = r.est.length, H = T + (n + 1)*fila + 70;
  const all = r.est.flatMap(e=> [Math.exp(e.y - 1.96*e.se), Math.exp(e.y + 1.96*e.se)]).concat([r.lo, r.hi]);
  const lo = Math.min(0.2, Math.min(...all)*0.9), hi = Math.max(2, Math.max(...all)*1.1), x0 = lab, x1 = W - der - 10;
  const lx = x=> x0 + (x1 - x0)*(Math.log(Math.min(hi, Math.max(lo, x))) - Math.log(lo))/(Math.log(hi) - Math.log(lo));
  const s = svgEl(W, H, "forest-svg", "Forest plot del metanálisis");
  tx(s, 0, 18, "Estudio", "ax-s ax-b"); if(!mob) tx(s, W, 18, "RR (IC 95 %) · peso", "ax-s ax-b", "end");
  const ty = T + (n + 1)*fila + 6;
  [0.25, 0.5, 1, 2, 4].filter(t=> t >= lo && t <= hi).forEach(t=>{ sv("line",{x1:lx(t), x2:lx(t), y1:T - 6, y2:ty, class:t === 1 ? "ef-uno" : "grid-l"}, s); tx(s, lx(t), ty + 18, fmt(t, t < 1 ? 2 : 0), "ax-s", "middle"); });
  tx(s, lx(1) - 8, ty + 38, mob ? "← Intervención" : "← Favorece la intervención", "ax-s ax-muted", "end"); tx(s, lx(1) + 8, ty + 38, mob ? "Control →" : "Favorece el control →", "ax-s ax-muted", "start");
  const maxP = Math.max(...r.est.map(e=> e.peso));
  r.est.forEach((e,i)=>{ const y = T + i*fila + fila/2, g = sv("g",{class:"fo-row"}, s), l = Math.exp(e.y - 1.96*e.se), h = Math.exp(e.y + 1.96*e.se), lado = 6 + 14*Math.sqrt(e.peso/maxP);
    tx(g, 0, y + 5, e.n, "ax-t"); sv("line",{x1:lx(l), x2:lx(h), y1:y, y2:y, class:"ef-ci-l"}, g); sv("rect",{x:lx(Math.exp(e.y)) - lado/2, y:y - lado/2, width:lado, height:lado, class:"fo-sq"}, g);
    const txt = fmt(Math.exp(e.y), 2) + " (" + fmt(l, 2) + " a " + fmt(h, 2) + ") · " + fmt(e.peso*100, 1) + " %";
    if(!mob) tx(g, W, y + 5, txt, "ax-s", "end");
    activable(g, e.n + ": RR " + txt); bindTip(g, ()=> "<h5>" + esc(e.n) + "</h5><p>RR <strong>" + fmt(Math.exp(e.y), 2) + "</strong>, IC 95 %: " + fmt(l, 2) + " a " + fmt(h, 2) + "</p><p>Peso en el combinado: " + fmt(e.peso*100, 1) + " %</p>"); });
  const yd = T + n*fila + fila/2, g = sv("g",{class:"fo-comb"}, s);
  sv("polygon",{points:[lx(r.lo) + "," + yd, lx(r.rr) + "," + (yd - 9), lx(r.hi) + "," + yd, lx(r.rr) + "," + (yd + 9)].join(" "), class:"fo-diam"}, g);
  tx(g, 0, yd + 5, "Combinado", "ax-t ax-b"); if(!mob) tx(g, W, yd + 5, fmt(r.rr, 2) + " (" + fmt(r.lo, 2) + " a " + fmt(r.hi, 2) + ")", "ax-s ax-b", "end");
  activable(g, "Combinado: RR " + fmt(r.rr, 2)); bindTip(g, ()=> "<h5>Efecto combinado</h5><p>RR <strong>" + fmt(r.rr, 2) + "</strong>, IC 95 %: " + fmt(r.lo, 2) + " a " + fmt(r.hi, 2) + "</p><p>I² = " + fmt(r.I2*100, 0) + " %</p>");
  return s;
}
function metanalisis(){
  const b = $("metanalisis");
  b.appendChild(el("p",null,["Un metanálisis combina los resultados de varios estudios comparables en un solo efecto, dando más peso a los más precisos. El forest plot muestra cada estudio (un cuadrado, más grande cuanto más pesa, con su intervalo) y el efecto combinado (el rombo). La heterogeneidad (I²) dice qué parte de la variación entre estudios no se explica por el azar."]));
  b.appendChild(M.chips([{id:"fijo", label:"Efecto fijo (inverso de la varianza)"},{id:"aleatorio", label:"Efectos aleatorios (DerSimonian-Laird)"}], MA.modelo, id=>{ MA.modelo = id; calc(); }, "Modelo"));
  const tabla = el("div"), add = el("button",{type:"button", class:"btn"},["Agregar estudio"]), reset = el("button",{type:"button", class:"btn"},["Volver al ejemplo"]);
  b.appendChild(tabla); b.appendChild(el("div",{class:"tools-row"},[add, reset]));
  b.appendChild(el("p",{class:"muted small"},["Los cinco estudios de partida son ficticios, para practicar. El desenlace se supone indeseable (un RR menor de 1 favorece la intervención)."]));
  const how = M.howTo("cada fila es un estudio; si su línea cruza el 1, ese estudio solo no demuestra diferencia. El rombo es el efecto combinado y su ancho, el intervalo."), box = el("div",{class:"chart-box"}), lec = M.reading();
  b.appendChild(how); b.appendChild(box); b.appendChild(lec);
  b.appendChild(M.sourceLine("Cálculo propio sobre el logaritmo del RR, con corrección de 0,5 si una celda vale cero. Métodos: DerSimonian y Laird (1986); I² según Higgins y colaboradores (2003); interpretación según el Cochrane Handbook, capítulo 10."));
  const ejemplo = MA.filas.map(f=> f.slice());
  function pintaTabla(){
    tabla.innerHTML = "";
    const t = el("table",{class:"cmp-table ma-tab"}), tb = el("tbody");
    t.appendChild(el("thead",null,[ el("tr",null, ["Estudio","Eventos intervención","Total intervención","Eventos control","Total control",""].map(x=> el("th",{scope:"col"},[x]))) ]));
    MA.filas.forEach((f,i)=>{ const tr = el("tr");
      f.forEach((v,j)=>{ const inp = el("input",{type:j ? "number" : "text", min:"0", step:"1", value:String(v), "aria-label":["Estudio","Eventos intervención","Total intervención","Eventos control","Total control"][j] + " " + (i + 1)});
        inp.addEventListener("input", ()=>{ MA.filas[i][j] = j ? Number(inp.value) : inp.value; calc(); }); tr.appendChild(el("td",{"data-label":["Estudio","Eventos I","Total I","Eventos C","Total C"][j]},[inp])); });
      const del = el("button",{type:"button", class:"btn btn-sm", "aria-label":"Quitar " + f[0]},["Quitar"]); del.addEventListener("click", ()=>{ MA.filas.splice(i, 1); pintaTabla(); calc(); });
      tr.appendChild(el("td",null,[MA.filas.length > 2 ? del : null])); tb.appendChild(tr); });
    t.appendChild(tb); tabla.appendChild(el("div",{class:"table-wrap"},[t]));
  }
  add.addEventListener("click", ()=>{ MA.filas.push(["Estudio " + String.fromCharCode(65 + MA.filas.length % 26), 10, 100, 12, 100]); pintaTabla(); calc(); });
  reset.addEventListener("click", ()=>{ MA.filas = ejemplo.map(f=> f.slice()); pintaTabla(); calc(); });
  function calc(){
    const r = metaCalc(MA.filas, MA.modelo); box.innerHTML = "";
    if(!r){ M.setReading(lec, "Revisa la tabla: al menos dos estudios, con números enteros y eventos que no superen el total."); return; }
    box.appendChild(forestSVG(r));
    const i2 = r.I2*100, het = i2 < 30 ? "baja (de 0 a 40 % podría no ser importante)" : i2 < 50 ? "moderada" : i2 < 75 ? "sustancial" : "considerable";
    const cruza = r.lo <= 1 && r.hi >= 1;
    M.setReading(lec, "El RR combinado es <strong>" + fmt(r.rr, 2) + "</strong> (IC 95 %: " + fmt(r.lo, 2) + " a " + fmt(r.hi, 2) + ") con el modelo de " + (MA.modelo === "aleatorio" ? "efectos aleatorios" : "efecto fijo") + ". " + (cruza ? "El intervalo incluye 1: el conjunto no demuestra diferencia." : "El intervalo no incluye 1: el conjunto muestra una diferencia estadísticamente significativa.") + " La heterogeneidad es " + het + ": I² = " + fmt(i2, 0) + " % (Q = " + fmt(r.Q, 2) + " con " + r.df + " grados de libertad" + (MA.modelo === "aleatorio" ? "; τ² = " + fmt(r.tau2, 3) : "") + "). Con pocos estudios, I² es impreciso; y el sesgo de publicación se explora con un gráfico de embudo, útil desde unos diez estudios.");
  }
  pintaTabla(); calc();
}

/* ============================================================ RUTA R1: GUÍAS DE PRÁCTICA CLÍNICA Y COSTO-EFECTIVIDAD */
const AGREE = [ ["Alcance y objetivo", 3], ["Participación de los implicados", 3], ["Rigor en la elaboración", 8], ["Claridad de la presentación", 3], ["Aplicabilidad", 4], ["Independencia editorial", 2] ];
const AG = { evaluadores:2, prom:AGREE.map(()=> 4) };
const CE = { cn:"12.000.000", cc:"8.000.000", en:"6,2", ec:"5,8", umbral:"" };
function agreeSVG(sc){
  const W = VW(780, 344), fila = VW(36, 52), L = VW(230, 8), R = 60, H = 20 + AGREE.length*fila + 30, s = svgEl(W, H, "agree-svg", "Puntaje escalado de cada dominio de AGREE II");
  const sx = p=> L + (W - L - R)*p;
  [0, 0.25, 0.5, 0.75, 1].forEach(p=>{ sv("line",{x1:sx(p), x2:sx(p), y1:10, y2:H - 28, class:"grid-l"}, s); tx(s, sx(p), H - 10, fmt(p*100, 0) + " %", "ax-s", "middle"); });
  AGREE.forEach((d,i)=>{ const y = 14 + i*fila, g = sv("g",{class:"ag-row"}, s), p = sc[i];
    if(MOB()){ tx(g, L, y + 14, (i + 1) + ". " + d[0], "ax-s ax-b"); sv("rect",{x:L, y:y + 22, width:Math.max(2, sx(p) - L), height:18, rx:3, class:"ag-bar"}, g); tx(g, sx(p) + 6, y + 36, fmt(p*100, 0) + " %", "ax-s ax-b"); }
    else { tx(g, L - 10, y + 18, (i + 1) + ". " + d[0], "ax-s", "end"); sv("rect",{x:L, y:y + 4, width:Math.max(2, sx(p) - L), height:fila - 12, rx:3, class:"ag-bar"}, g); tx(g, sx(p) + 6, y + 18, fmt(p*100, 0) + " %", "ax-s ax-b"); }
    activable(g, d[0] + ": " + fmt(p*100, 0) + " %"); bindTip(g, ()=> "<h5>Dominio " + (i + 1) + ". " + esc(d[0]) + "</h5><p>" + d[1] + " ítems · puntaje escalado <strong>" + fmt(p*100, 1) + " %</strong></p>"); });
  return s;
}
function planoSVG(dc, de, umbral){
  const W = VW(520, 344), H = VW(360, 330), cx = W/2, cy = H/2, m = 30, s = svgEl(W, H, "plano-svg", "Plano de costo-efectividad");
  sv("line",{x1:m, x2:W - m, y1:cy, y2:cy, class:"axis-l"}, s); sv("line",{x1:cx, x2:cx, y1:m, y2:H - m, class:"axis-l"}, s);
  tx(s, W - m, cy - 8, "Más efectiva →", "ax-s", "end"); tx(s, m, cy + 18, "← Menos efectiva", "ax-s"); tx(s, cx + 8, m + 4, "Más costosa", "ax-s"); tx(s, cx + 8, H - m, "Menos costosa", "ax-s");
  tx(s, W - m, m + 4, "Más efectiva y más costosa", "ax-s ax-muted", "end"); tx(s, W - m, H - m - 18, "Dominante", "ax-s ax-b pl-dom", "end"); tx(s, m, m + 4, "Dominada", "ax-s ax-b pl-domd");
  const kx = (W/2 - m - 20)/Math.max(Math.abs(de), 1e-9), ky = (H/2 - m - 20)/Math.max(Math.abs(dc), 1e-9);
  if(umbral > 0){ /* recta costo = umbral × efecto, desde el origen hasta el borde del cuadrante superior derecho */
    let X = (W/2 - m)/kx, y2 = cy - umbral*X*ky; if(y2 < m){ X = (cy - m)/(umbral*ky); y2 = m; }
    const x2 = cx + X*kx; sv("line",{x1:cx, y1:cy, x2:x2, y2:y2, class:"pl-umbral"}, s); tx(s, x2 - 4, y2 + 16, "Umbral", "ax-s", "end"); }
  const px = cx + de*kx, py = cy - dc*ky, g = sv("g",{class:"pl-pt"}, s); sv("circle",{cx:px, cy:py, r:9}, g);
  activable(g, "Nueva frente al comparador"); bindTip(g, ()=> "<h5>Nueva frente al comparador</h5><p>Δ costo: " + fmt(dc) + "</p><p>Δ efecto: " + fmt(de, 2) + " AVAC</p>");
  return s;
}
function guias(){
  const b = $("guias");
  b.appendChild(el("p",null,["Una guía de práctica clínica convierte la evidencia en recomendaciones. Antes de seguirla, conviene evaluar cómo se hizo: el instrumento internacional es AGREE II. En Colombia, las guías del Ministerio de Salud se elaboran con un manual metodológico que incluye la evaluación económica; las guías publicadas están en el portal de guías de práctica clínica del Ministerio y los manuales metodológicos en el IETS."]));
  M.sub(b, "guias-agree", "AGREE II: puntaje de cada dominio", "23 ítems en seis dominios; cada ítem se califica de 1 (muy en desacuerdo) a 7 (muy de acuerdo). Se recomienda que evalúen al menos dos personas, idealmente cuatro.");
  b.appendChild(M.chips([1,2,3,4].map(n=> ({ id:String(n), label:n + (n === 1 ? " evaluador" : " evaluadores") })), String(AG.evaluadores), id=>{ AG.evaluadores = Number(id); calcAg(); }, "Número de evaluadores"));
  const f = el("div",{class:"ag-form"});
  AGREE.forEach((d,i)=>{ const id = "ag-" + i, r = el("input",{type:"range", id:id, min:"1", max:"7", step:"0.25", value:String(AG.prom[i])}), o = el("output",{for:id, class:"m-unit"},[fmt(AG.prom[i], 2)]);
    r.addEventListener("input", ()=>{ AG.prom[i] = Number(r.value); o.textContent = fmt(AG.prom[i], 2); calcAg(); });
    f.appendChild(el("label",{for:id},[(i + 1) + ". " + d[0] + " (" + d[1] + " ítems): promedio de los ítems", el("span",{class:"m-ctrl"},[r, o])])); });
  b.appendChild(f);
  const agBox = el("div",{class:"chart-box"}), agTab = el("div"), agLec = M.reading();
  b.appendChild(M.howTo("cada barra es el puntaje escalado de un dominio, de 0 a 100 %. Los dominios se interpretan por separado: no se suman en un puntaje total.")); b.appendChild(agBox); b.appendChild(agTab); b.appendChild(agLec);
  b.appendChild(M.sourceLine("Puntaje escalado = (obtenido − mínimo posible) ÷ (máximo posible − mínimo posible), según el manual de AGREE II. Valores de partida neutros: muévelos con tu evaluación."));
  function calcAg(){
    const e = AG.evaluadores, sc = AGREE.map((d,i)=>{ const min = 1*d[1]*e, max = 7*d[1]*e, ob = AG.prom[i]*d[1]*e; return (ob - min)/(max - min); });
    agBox.innerHTML = ""; agBox.appendChild(agreeSVG(sc));
    agTab.innerHTML = ""; agTab.appendChild(M.tabla(["Dominio","Obtenido","Mínimo","Máximo","Escalado"], AGREE.map((d,i)=> [(i + 1) + ". " + d[0], fmt(AG.prom[i]*d[1]*e, 1), fmt(d[1]*e), fmt(7*d[1]*e), fmt(sc[i]*100, 1) + " %"]), "ag-tab"));
    const iMax = sc.indexOf(Math.max(...sc)), iMin = sc.indexOf(Math.min(...sc));
    const primera = Math.abs(sc[iMax] - sc[iMin]) < 1e-9 ? "Todos los dominios tienen el mismo puntaje (" + fmt(sc[iMax]*100, 0) + " %): mueve los deslizadores con tu evaluación." : "El dominio más fuerte es <strong>" + AGREE[iMax][0].toLowerCase() + "</strong> (" + fmt(sc[iMax]*100, 0) + " %) y el más débil, <strong>" + AGREE[iMin][0].toLowerCase() + "</strong> (" + fmt(sc[iMin]*100, 0) + " %).";
    M.setReading(agLec, primera + " AGREE II no fija un umbral universal de calidad: cada grupo lo acuerda; por ejemplo, exigir más de 70 % en rigor en la elaboración. Con " + e + (e === 1 ? " evaluador" : " evaluadores") + (e < 2 ? ", el manual recomienda sumar al menos otra persona." : "."));
  }
  calcAg();

  M.sub(b, "guias-rcei", "Costo-efectividad: la razón incremental", "La razón de costo-efectividad incremental (RCEI) divide la diferencia de costos por la diferencia de efectos entre dos alternativas.");
  const cf = el("div",{class:"nota-form"});
  [["cn","Costo de la alternativa nueva (pesos)"],["cc","Costo del comparador (pesos)"],["en","Efecto de la nueva (AVAC)"],["ec","Efecto del comparador (AVAC)"],["umbral","Umbral de disposición a pagar por AVAC (opcional)"]].forEach(c=>{
    const i = el("input",{type:"text", inputmode:"decimal", id:"ce-" + c[0], value:CE[c[0]]}); i.addEventListener("input", ()=>{ CE[c[0]] = i.value; calcCe(); }); cf.appendChild(el("label",{for:"ce-" + c[0]},[c[1], i])); });
  b.appendChild(cf);
  b.appendChild(el("p",{class:"muted small"},["Los valores de partida son ficticios. AVAC: año de vida ajustado por calidad. El aula no propone un umbral: escríbelo si tu análisis usa uno."]));
  const ceOut = el("div",{class:"ce-grid"}), ceLec = M.reading();
  b.appendChild(ceOut); b.appendChild(ceLec);
  b.appendChild(M.sourceLine("RCEI = (costo nueva − costo comparador) ÷ (efecto nueva − efecto comparador). Los estudios económicos se reportan con CHEERS 2022."));
  /* pesos: el punto separa miles; AVAC: la coma o el punto separan decimales */
  const pesos = x=>{ const t = String(x).replace(/[\s$.]/g, "").replace(",", "."); return t === "" ? NaN : Number(t); };
  const decimal = x=>{ const t = String(x).replace(/\s/g, "").replace(",", "."); return t === "" ? NaN : Number(t); };
  function calcCe(){
    const cn = pesos(CE.cn), cc = pesos(CE.cc), en = decimal(CE.en), ec = decimal(CE.ec), um = pesos(CE.umbral);
    ceOut.innerHTML = "";
    if([cn, cc, en, ec].some(x=> !isFinite(x))){ M.setReading(ceLec, "Escribe los cuatro valores de costo y efecto."); return; }
    const dc = cn - cc, de = en - ec, rcei = de !== 0 ? dc/de : Infinity;
    const box = el("div",{class:"chart-box"}); box.appendChild(planoSVG(dc, de, isFinite(um) ? um : 0)); ceOut.appendChild(box);
    const k = el("div",{class:"kpis ce-kpis"}); [["Δ costo", fmt(dc) + " pesos"],["Δ efecto", fmt(de, 2) + " AVAC"],["RCEI", isFinite(rcei) ? fmt(rcei) + " pesos por AVAC" : "No se calcula (Δ efecto = 0)"]].forEach(x=> k.appendChild(el("div",{class:"kpi"},[ el("small",null,[x[0]]), el("strong",null,[x[1]]) ]))); ceOut.appendChild(k);
    let t;
    if(de > 0 && dc <= 0) t = "La alternativa nueva es <strong>dominante</strong>: más efectiva y no más costosa.";
    else if(de < 0 && dc >= 0) t = "La alternativa nueva está <strong>dominada</strong>: menos efectiva y no más barata.";
    else if(de > 0) t = "La nueva es más efectiva y más costosa: cada AVAC adicional cuesta <strong>" + fmt(rcei) + " pesos</strong>. " + (isFinite(um) ? (rcei <= um ? "Queda por debajo del umbral que escribiste, así que sería costo-efectiva con ese criterio." : "Supera el umbral que escribiste, así que no sería costo-efectiva con ese criterio.") : "Para decidir hace falta un umbral de disposición a pagar.");
    else if(de < 0) t = "La nueva es menos efectiva y más barata: se ahorran " + fmt(Math.abs(rcei)) + " pesos por cada AVAC que se pierde; la decisión depende del umbral y de la ética de renunciar a salud.";
    else t = "No hay diferencia de efecto: la comparación se reduce a los costos.";
    M.setReading(ceLec, t + " Lee también el análisis de sensibilidad: una RCEI sin incertidumbre dice poco.");
  }
  calcCe();
}

/* ============================================================ RUTA R2: PROTOCOLO Y AVANCE DE RESULTADOS */
/* Lista de verificación con avance guardado en el navegador. El texto va fuera de <label> para que sus enlaces no marquen la casilla. */
function listaVerificacion(b, clave, grupos){
  const saved = store.get(clave) || {}, total = grupos.reduce((a,g)=> a + g.items.length, 0);
  const prog = el("p",{class:"progress", "aria-live":"polite"}), bar = el("div",{class:"qz-bar"},[ el("span") ]);
  const upd = ()=>{ const n = Object.keys(saved).filter(k=> saved[k]).length; prog.textContent = "Tu avance: " + n + " de " + total + " puntos cumplidos."; bar.firstChild.style.width = (100*n/total) + "%"; };
  b.appendChild(prog); b.appendChild(bar);
  const grid = el("div",{class:"lv-grid"});
  grupos.forEach((g,gi)=>{
    const ul = el("ul",{class:"lv"});
    g.items.forEach((it,ii)=>{
      const id = clave + "-" + gi + "-" + ii, cb = el("input",{type:"checkbox", id:id, "aria-labelledby":id + "-t"}); cb.checked = !!saved[id];
      cb.addEventListener("change", ()=>{ saved[id] = cb.checked; store.set(clave, saved); upd(); });
      const ir = it.seccion && M.SEC[it.seccion] ? el("button",{type:"button", class:"btn btn-sm lv-ir"},["Herramienta: " + (M.SEC[it.seccion].toc || M.SEC[it.seccion].title)]) : null;
      if(ir) ir.addEventListener("click", ()=> irA(it.seccion));
      ul.appendChild(el("li",{class:"lv-i"},[cb, el("span",{id:id + "-t", class:"lv-t"},[it.t]), ir]));
    });
    grid.appendChild(el("article",{class:"card lv-card"},[ el("h4",null,[g.g]), ul ]));
  });
  b.appendChild(grid); upd();
}
const RG = { id:null };
function protocolo(){
  const b = $("protocolo");
  b.appendChild(el("p",null,["Un protocolo responde, antes de empezar, qué se va a estudiar, por qué, cómo y con qué cuidado ético. Esta lista sigue los elementos de Proyecto de investigación I: título, problema y pregunta, justificación, objetivos, marco teórico y metodología, más las consideraciones éticas. Marca lo que tu protocolo ya cumple; el avance queda guardado en este navegador."]));
  listaVerificacion(b, "aula-ic-protocolo", A.protocolo);
  b.appendChild(el("p",{class:"muted small"},["Síntesis docente del autor del aula a partir de los contenidos programáticos de Proyecto de investigación I."]));
  M.sub(b, "protocolo-riesgo", "¿En qué categoría de riesgo queda tu estudio?", "La Resolución 8430 de 1993 clasifica las investigaciones en salud en tres categorías (artículo 11). Elige la que describe tu estudio y confírmala con el comité de ética.");
  const out = el("div",{"aria-live":"polite"});
  b.appendChild(M.chips(A.riesgo8430.map(r=> ({ id:r.id, label:r.t })), RG.id, id=>{ RG.id = id; pinta(); }, "Categoría de riesgo"));
  b.appendChild(out);
  function pinta(){
    out.innerHTML = "";
    const r = A.riesgo8430.find(x=> x.id === RG.id);
    if(!r){ out.appendChild(el("p",{class:"muted"},["Elige una categoría para ver su definición y ejemplos."])); return; }
    out.appendChild(el("div",{class:"card riesgo-card riesgo-" + r.id},[ el("h4",null,[r.t]), el("p",null,[r.d]), el("p",{class:"muted"},[ el("strong",null,["Ejemplos de la norma: "]), r.ej ]),
      el("p",{class:"small"},["Resumen del artículo 11 de la Resolución 8430 de 1993. El texto completo manda."]) ]));
  }
  pinta();
}
function avance(){
  const b = $("avance");
  b.appendChild(el("p",null,["En Proyecto de investigación II el protocolo se vuelve datos: se recoge la información, se organiza la base, se controla su calidad y se presenta un primer avance de resultados. Esta lista sigue esos pasos."]));
  listaVerificacion(b, "aula-ic-avance", A.avance);
  b.appendChild(el("p",{class:"muted small"},["Síntesis docente del autor del aula a partir de los contenidos programáticos de Proyecto de investigación II."]));
  M.sub(b, "avance-diccionario", "Plantilla del diccionario de variables", "Descárgala, ábrela en Excel y llena una fila por variable de tu estudio. Las filas que trae son ejemplos para borrar.");
  const cab = ["Variable","Definición","Tipo","Escala","Unidad o categorías","Valores permitidos","Fuente del dato"];
  const filas = [
    ["codigo","Código del participante (nunca el nombre ni el documento)","Identificador","Nominal","Texto","P001 a P999","Asignado por el equipo"],
    ["edad","Edad cumplida al ingreso","Cuantitativa discreta","Razón","Años","18 a 110","Historia clínica"],
    ["nyha","Clase funcional de la NYHA al ingreso","Cualitativa ordinal","Ordinal","I, II, III, IV","I a IV","Historia clínica"],
    ["hb","Hemoglobina al ingreso","Cuantitativa continua","Razón","g/dL","3,0 a 22,0","Laboratorio"],
    ["muerte30","Muerte por cualquier causa a 30 días","Cualitativa nominal dicotómica","Nominal","Sí, No","Sí o No","Seguimiento"] ];
  b.appendChild(M.tabla(cab, filas, "dic-tab"));
  const dl = el("button",{type:"button", class:"btn btn-primary"},["Descargar la plantilla (CSV)"]);
  dl.addEventListener("click", ()=> M.downloadCSV("diccionario_de_variables.csv", cab, filas));
  b.appendChild(el("div",{class:"tools-row"},[dl]));
}

/* ============================================================ TU CURSO: RUTAS Y EVALUACIÓN */
const ANIO_KEY = "aula-ic-anio";
const anioGuardado = ()=>{ try{ return localStorage.getItem(ANIO_KEY) || "conjunta"; }catch(e){ return "conjunta"; } };
const guardaAnio = v=>{ try{ localStorage.setItem(ANIO_KEY, v); }catch(e){} };
const irA = id=>{ M.openSection(id); M.scrollSoon("sec-" + id); };
/* Pestañas accesibles: role="tablist", flechas, Inicio y Fin; tabindex móvil */
function pestanas(opciones, activa, alElegir, rotulo){
  const lista = el("div",{class:"tabs", role:"tablist", "aria-label":rotulo});
  const botones = opciones.map(o=>{
    const b = el("button",{type:"button", role:"tab", class:"tab", id:"tab-" + o.id, "aria-selected":String(o.id === activa), tabindex:o.id === activa ? "0" : "-1", "aria-controls":"panel-tab-" + o.id},[o.label]);
    b.addEventListener("click", ()=> elegir(o.id, true)); lista.appendChild(b); return b;
  });
  function elegir(id, foco){
    botones.forEach((b,i)=>{ const on = opciones[i].id === id; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; if(on && foco) b.focus(); });
    alElegir(id);
  }
  lista.addEventListener("keydown", e=>{
    const i = botones.indexOf(document.activeElement); if(i < 0) return;
    let j = null;
    if(e.key === "ArrowRight") j = (i + 1) % botones.length; else if(e.key === "ArrowLeft") j = (i - 1 + botones.length) % botones.length;
    else if(e.key === "Home") j = 0; else if(e.key === "End") j = botones.length - 1;
    if(j !== null){ e.preventDefault(); elegir(opciones[j].id, true); }
  });
  return { nodo:lista, elegir:elegir };
}
function tablaBloques(bloques){
  const t = el("table",{class:"cmp-table bloques-tab"}), tb = el("tbody");
  t.appendChild(el("thead",null,[ el("tr",null, ["Minutos","Bloque","Actividad","Entregable","En el aula"].map(x=> el("th",{scope:"col"},[x]))) ]));
  bloques.forEach(b=>{
    const apoyo = b.seccion && M.SEC[b.seccion] ? el("button",{type:"button", class:"btn btn-sm"},[M.SEC[b.seccion].toc || M.SEC[b.seccion].title]) : null;
    if(apoyo) apoyo.addEventListener("click", ()=> irA(b.seccion));
    tb.appendChild(el("tr",{class:b.descanso ? "descanso" : null},[
      el("td",{"data-label":"Minutos", class:"min"},[b.min]),
      el("th",{scope:"row", "data-label":"Bloque"},[b.bloque, b.eje ? el("span",{class:"eje"},[b.eje]) : null]),
      el("td",{"data-label":"Actividad"},[b.descanso ? "Pausa" : b.actividad || ""]),
      el("td",{"data-label":"Entregable"},[b.descanso ? "" : b.entregable || ""]),
      el("td",{"data-label":"En el aula"},[apoyo])
    ]));
  });
  t.appendChild(tb);
  return el("div",{class:"table-wrap"},[t]);
}
function rutas(){
  const b = $("rutas"), R = A.rutas;
  b.appendChild(el("p",null,["Elige tu grupo. Cada sesión aparece bloque por bloque, con su entregable y la sección del aula que te sirve para prepararlo. La elección queda guardada en este navegador."]));
  const panel = el("div",{class:"ruta-panel", role:"tabpanel", tabindex:"0"});
  const pinta = id=>{
    guardaAnio(id); panel.id = "panel-tab-" + id; panel.setAttribute("aria-labelledby", "tab-" + id); panel.innerHTML = "";
    const r = R[id];
    panel.appendChild(el("h4",{class:"ruta-t"},[r.titulo]));
    if(r.fecha) panel.appendChild(el("p",{class:"muted"},[r.fecha + " · " + r.duracion + " minutos"]));
    if(r.componentes) panel.appendChild(el("p",{class:"tag-row"}, r.componentes.map(c=> el("span",{class:"tag-pill"},[c]))));
    if(r.resumen) panel.appendChild(el("p",null,[r.resumen]));
    if(r.objetivos) panel.appendChild(el("ol",{class:"steps"}, r.objetivos.map(o=> el("li",null,[o]))));
    r.sesiones.forEach(s=>{ panel.appendChild(el("h5",{class:"ruta-fecha"},[s.fecha])); panel.appendChild(tablaBloques(s.bloques)); });
    if(r.independiente) panel.appendChild(el("p",{class:"callout"},[ el("strong",null,["Trabajo independiente. "]), r.independiente ]));
    if(r.nota) panel.appendChild(el("p",{class:"callout callout-warn"},[r.nota]));
    panel.appendChild(el("p",{class:"callout"},[ el("strong",null,["Tarea para todos. "]), R.tarea ]));
  };
  const tabs = pestanas([{id:"conjunta", label:"Sesión conjunta"},{id:"r1", label:"Primer año (R1)"},{id:"r2", label:"Segundo año (R2)"}], anioGuardado(), pinta, "Ruta por grupo");
  b.appendChild(tabs.nodo); b.appendChild(panel); pinta(anioGuardado());
}
const redondea1 = x=> Math.round((x + 1e-9)*10)/10;
function notaDefinitiva(v){ /* v: { taller, ficha1, ficha2, practica, particip } en la escala de 0 a 5 */
  const W = {}; A.evaluacion.criterios.forEach(c=> W[c.id] = c.peso);
  const fichas = (v.ficha1 + v.ficha2)/2, aportes = { taller:W.taller*v.taller, fichas:W.fichas*fichas, practica:W.practica*v.practica, particip:W.particip*v.particip };
  const total = aportes.taller + aportes.fichas + aportes.practica + aportes.particip;
  return { fichas, aportes, total, nota:redondea1(total) };
}
const EV = { anio:"r1", vals:{} };
function evaluacion(){
  const b = $("evaluacion"), E = A.evaluacion;
  b.appendChild(el("p",null,["La escala va de " + fmt(E.escala.min, 1) + " a " + fmt(E.escala.max, 1) + " y toda nota se expresa con un entero y un decimal. Los pesos son los mismos para primer y segundo año; en segundo año cambia qué se entrega en la segunda evidencia."]));
  const anioRow = M.chips([{id:"r1", label:"Primer año (R1)"},{id:"r2", label:"Segundo año (R2)"}], EV.anio, id=>{ EV.anio = id; pintaCriterios(); armaCalc(); }, "Año");
  b.appendChild(anioRow);
  M.sub(b, "evaluacion-criterios", "Las cuatro evidencias");
  const crit = el("div"), barra = el("div",{class:"chart-box"});
  b.appendChild(barra); b.appendChild(crit);
  function pesosSVG(){
    const W = VW(760, 340), H = VW(70, 120), s = svgEl(W, H, "pesos-svg", "Peso de cada evidencia en la nota");
    let x = 0; const cls = ["pe-0","pe-1","pe-2","pe-3"];
    E.criterios.forEach((c,i)=>{
      const w = W*c.peso, g = sv("g",{class:"pe " + cls[i]}, s), nombre = EV.anio === "r2" && c.nombreR2 ? c.nombreR2 : c.nombre;
      sv("rect",{x:x + 1, y:6, width:w - 2, height:VW(40, 46), rx:6}, g);
      tx(g, x + w/2, VW(32, 35), fmt(c.peso*100, 0) + " %", "pe-t", "middle");
      if(MOB()) txs(g, x + 6, 72, M.wrapText(nombre.split(" (")[0].split(":")[0], 9).slice(0,3), "ax-s", "start", 15);
      activable(g, nombre + ": " + fmt(c.peso*100, 0) + " %"); bindTip(g, ()=> "<h5>" + esc(nombre) + "</h5><p>Peso: <strong>" + fmt(c.peso*100, 0) + " %</strong></p><p>" + esc(EV.anio === "r2" && c.evaluaR2 ? c.evaluaR2 : c.evalua) + "</p>");
      x += w;
    });
    return s;
  }
  function pintaCriterios(){
    barra.innerHTML = ""; barra.appendChild(pesosSVG());
    crit.innerHTML = "";
    crit.appendChild(M.tabla(["Evidencia","Peso","Qué se evalúa"], E.criterios.map(c=> [EV.anio === "r2" && c.nombreR2 ? c.nombreR2 : c.nombre, fmt(c.peso*100, 0) + " %", EV.anio === "r2" && c.evaluaR2 ? c.evaluaR2 : c.evalua])));
    if(EV.anio === "r2") crit.appendChild(el("p",{class:"callout callout-warn"},[A.rutas.r2.nota]));
  }
  M.sub(b, "evaluacion-calendario", "Calendario");
  const hoy = new Date().toISOString().slice(0,10), prox = E.calendario.find(c=> c.fecha && c.fecha >= hoy);
  b.appendChild(el("ol",{class:"cal"}, E.calendario.map(c=> el("li",{class:"cal-i" + (c.fecha && c.fecha < hoy ? " pasado" : "") + (c === prox ? " proximo" : "")},[
    el("span",{class:"cal-f"},[c.texto, c.fecha === hoy ? el("span",{class:"cal-hoy"},["Hoy"]) : c === prox ? el("span",{class:"cal-hoy"},["Lo siguiente"]) : null]),
    el("span",{class:"cal-q"},[c.que]), el("span",{class:"cal-e muted"},["Evidencia: " + c.evidencia]) ]))));
  M.sub(b, "evaluacion-calculadora", "Calculadora de la nota", "Escribe tus notas de 0,0 a 5,0. La segunda evidencia es el promedio de sus dos partes.");
  const form = el("div",{class:"nota-form"}), out = el("div",{class:"nota-out", "aria-live":"polite"});
  const botones = el("div",{class:"tools-row"}), ej = el("button",{type:"button", class:"btn"},["Usar el ejemplo"]), lim = el("button",{type:"button", class:"btn"},["Borrar"]);
  botones.appendChild(ej); botones.appendChild(lim);
  b.appendChild(form); b.appendChild(botones); b.appendChild(out);
  b.appendChild(el("p",{class:"muted small"},["El ejemplo usa notas inventadas, solo para mostrar la cuenta."]));
  const campos = ()=> [
    { k:"taller", l:"Taller de preguntas (40 %)" },
    { k:"ficha1", l: EV.anio === "r2" ? "Síntesis de Proyecto I (15 %)" : "Ficha de lectura crítica 1 (15 %)" },
    { k:"ficha2", l: EV.anio === "r2" ? "Avance de Proyecto II (15 %)" : "Ficha de lectura crítica 2 (15 %)" },
    { k:"practica", l:"Práctica con árbol y Mendeley (15 %)" },
    { k:"particip", l:"Participación y coevaluación (15 %)" } ];
  function armaCalc(){
    form.innerHTML = "";
    campos().forEach(c=>{
      const i = el("input",{type:"text", inputmode:"decimal", id:"nota-" + c.k, placeholder:"0,0 a 5,0", value: EV.vals[c.k] !== undefined ? String(EV.vals[c.k]).replace(".", ",") : ""});
      i.addEventListener("input", ()=>{ const t = i.value.trim(); if(t === "") delete EV.vals[c.k]; else EV.vals[c.k] = t; calcula(); });
      form.appendChild(el("label",{for:"nota-" + c.k},[c.l, i]));
    });
    calcula();
  }
  function calcula(){
    out.innerHTML = "";
    const cs = campos(), vals = {}, malos = [], vacios = [];
    cs.forEach(c=>{ const t = EV.vals[c.k]; if(t === undefined || String(t).trim() === ""){ vacios.push(c.l); return; }
      const x = parseFloat(String(t).replace(",", ".")); if(!isFinite(x) || x < E.escala.min || x > E.escala.max) malos.push(c.l); else vals[c.k] = x;
      const inp = form.querySelector("#nota-" + c.k); if(inp){ if(!isFinite(x) || x < E.escala.min || x > E.escala.max) inp.setAttribute("aria-invalid","true"); else inp.removeAttribute("aria-invalid"); } });
    if(malos.length){ out.appendChild(el("p",{class:"m-err"},["Revisa: " + malos.join("; ") + ". Cada nota va de 0,0 a 5,0."])); return; }
    if(vacios.length){ out.appendChild(el("p",{class:"muted"},["Faltan " + vacios.length + " de 5 notas para calcular: " + vacios.join("; ") + "."])); return; }
    const r = notaDefinitiva(vals);
    const filas = [
      [cs[0].l.replace(/ \(.*/,""), fmt(vals.taller, 1), "40 %", fmt(r.aportes.taller, 3)],
      [(EV.anio === "r2" ? "Entregables del proyecto" : "Fichas 1 y 2") + " (promedio)", fmt(r.fichas, 2), "30 %", fmt(r.aportes.fichas, 3)],
      [cs[3].l.replace(/ \(.*/,""), fmt(vals.practica, 1), "15 %", fmt(r.aportes.practica, 3)],
      [cs[4].l.replace(/ \(.*/,""), fmt(vals.particip, 1), "15 %", fmt(r.aportes.particip, 3)] ];
    out.appendChild(M.tabla(["Evidencia","Nota","Peso","Aporte"], filas, "nota-tab"));
    out.appendChild(el("div",{class:"m-res nota-res"},[ el("span",{class:"m-res-k"},["Nota definitiva"]), el("strong",{class:"m-res-n"},[fmt(r.nota, 1)]),
      el("span",{class:"m-res-d"},["Suma exacta: " + fmt(r.total, 3) + ", redondeada a una décima."]),
      el("span",{class:"m-res-d muted"},[E.notaMinima === null ? "La nota mínima de aprobación se confirma con el reglamento de posgrado." : (r.nota >= E.notaMinima ? "Alcanza" : "No alcanza") + " la nota mínima de aprobación (" + fmt(E.notaMinima, 1) + ")."]) ]));
  }
  ej.addEventListener("click", ()=>{ Object.keys(E.ejemplo).forEach(k=> EV.vals[k] = E.ejemplo[k]); armaCalc(); });
  lim.addEventListener("click", ()=>{ EV.vals = {}; armaCalc(); });
  pintaCriterios(); armaCalc();
}

/* ============================================================ RESUMEN Y RELATO */
function picoSVG(){
  const mob = MOB(), W = VW(560, 340), H = VW(300, 420), s = svgEl(W, H, "pico-svg story-svg", "Esquemas PICO y PCC");
  const cols = [ { t:"Pregunta de efecto: PICO", f:[["P","Población"],["I","Intervención"],["C","Comparador"],["O","Desenlace"]], cl:"pi" },
                 { t:"Revisión de alcance: PCC", f:[["P","Población"],["C","Concepto"],["C","Contexto"]], cl:"pc" } ];
  const cw = mob ? W : (W - 24)/2;
  cols.forEach((c,j)=>{
    const x0 = mob ? 0 : j*(cw + 24), y0 = mob ? j*230 : 0, bh = mob ? 38 : 52, gap = mob ? 8 : 12;
    tx(s, x0, y0 + 18, c.t, "ax-t ax-b");
    c.f.forEach((f,i)=>{ const y = y0 + 32 + i*(bh + gap), g = sv("g",{class:"pico-b " + c.cl}, s);
      sv("rect",{x:x0, y:y, width:cw, height:bh, rx:8}, g);
      tx(g, x0 + 16, y + bh/2 + 9, f[0], "pico-l"); tx(g, x0 + 54, y + bh/2 + 6, f[1], "ax-t"); });
  });
  return s;
}
function familiasSVG(){
  const fam = [ { t:"Prueba diagnóstica", d:["Prueba diagnóstica"] }, { t:"Síntesis de estudios", d:["Revisión sistemática o metanálisis"] },
    { t:"Experimentales: los investigadores asignan", d:["Ensayo clínico aleatorizado","Cuasiexperimental"] },
    { t:"Observacionales analíticos: comparan grupos", d:["Casos y controles","Cohorte","Estudio transversal analítico"] },
    { t:"Descriptivos: describen casos", d:["Reporte de caso","Serie de casos"] } ];
  const W = VW(560, 340), fila = 32, H = 10 + fam.reduce((a,f)=> a + 24 + f.d.length*fila + 6, 0), s = svgEl(W, H, "fam-svg story-svg", "Los nueve diseños agrupados por familia");
  let y = 4;
  fam.forEach((f,j)=>{
    tx(s, 0, y + 16, f.t, "ax-s ax-b fam-k fam-" + j); y += 24;
    f.d.forEach(nm=>{ const d = disPor(nm), g = sv("g",{class:"fam-d fam-" + j, "data-cod":d.cod}, s);
      sv("rect",{x:12, y:y, width:W - 12, height:fila - 6, rx:13}, g); tx(g, 28, y + 18, d.nombre, "ax-t");
      activable(g, d.nombre); bindTip(g, ()=> "<h5>" + esc(d.nombre) + "</h5><p>" + esc(d.guia) + " · " + esc(d.herramienta) + "</p>"); y += fila; });
    y += 6;
  });
  return s;
}
function matrizSVG(){
  const W = VW(560, 340), mob = MOB(), fila = mob ? 46 : 34, H = 30 + DIS.length*fila, s = svgEl(W, H, "mat-svg story-svg", "Guía de reporte y herramienta por diseño");
  const c2 = W*0.44, c3 = W*0.70;
  if(!mob){ tx(s, 8, 18, "Diseño", "ax-s ax-b"); tx(s, c2, 18, "Guía de reporte", "ax-s ax-b"); tx(s, c3, 18, "Herramienta", "ax-s ax-b"); }
  else tx(s, 8, 18, "Diseño · guía · herramienta", "ax-s ax-b");
  DIS.forEach((d,i)=>{ const y = 28 + i*fila, g = sv("g",{class:"mat-r", "data-cod":d.cod}, s);
    sv("rect",{x:0, y:y, width:W, height:fila - 4, rx:6, class:"mat-bg"}, g);
    const herr = d.herramienta.replace(/^Lista de JBI.*/, "Lista de JBI"), guia = d.guia.replace(" (series quirúrgicas)","");
    if(!mob){ tx(g, 8, y + 20, d.nombre.replace("Revisión sistemática o metanálisis","Revisión sistemática").replace("Estudio transversal analítico","Transversal analítico"), "ax-s"); tx(g, c2, y + 20, guia, "ax-s ax-b mat-g"); tx(g, c3, y + 20, herr, "ax-s mat-h"); }
    else { tx(g, 8, y + 17, d.nombre, "ax-s ax-b"); tx(g, 8, y + 35, guia + " · " + herr, "ax-s mat-h"); }
    activable(g, d.nombre + ": " + d.guia + "; " + d.herramienta); bindTip(g, ()=> "<h5>" + esc(d.nombre) + "</h5><p>Guía: " + esc(d.guia) + "</p><p>Herramienta: " + esc(d.herramienta) + "</p>"); });
  return s;
}
function vancouverSVG(){
  const partes = [ ["Autores","Hopewell S, Chan AW, Collins GS, et al."], ["Título","CONSORT 2025 statement: updated guideline for reporting randomised trials."], ["Revista abreviada","BMJ."], ["Año; volumen: identificador","2025;389:e081123."], ["DOI","doi:10.1136/bmj-2024-081123"] ];
  const mob = MOB(), W = VW(560, 340);
  const bloques = partes.map(p=> ({ k:p[0], ls:M.wrapText(p[1], mob ? 32 : 54) })), H = bloques.reduce((a,b)=> a + 36 + b.ls.length*18, 0);
  const s = svgEl(W, H, "van-svg story-svg", "Partes de una referencia en estilo Vancouver");
  let y = 2;
  bloques.forEach((p,i)=>{ const g = sv("g",{class:"van-p van-" + i}, s), h = 30 + p.ls.length*18;
    sv("rect",{x:0, y:y, width:6, height:h - 8, rx:3}, g);
    tx(g, 18, y + 15, p.k, "ax-s ax-b van-k"); txs(g, 18, y + 35, p.ls, "ax-t", "start", 18); y += h + 6; });
  return s;
}
function resumen(){
  const b = $("resumen");
  b.appendChild(el("p",null,["Este documento acompaña un curso de investigación clínica. Reúne en un solo lugar lo que se necesita para pasar de una pregunta clínica a un artículo: herramientas para practicar, calculadoras que muestran sus fórmulas y enlaces a las guías originales."]));
  b.appendChild(el("p",null,["Está organizado en cuatro partes. La primera ayuda a planear el estudio; la segunda, a leer y evaluar artículos; la tercera, a sintetizar evidencia y publicar; la cuarta reúne mapas mentales, glosario y referencias. Cada sección abre con su idea clave en una frase y termina con la pregunta siguiente."]));
  const r = efectoCalc({ a:15, n1:100, c:20, n2:100 }), v0 = MS.vals.CAIN, n0 = nEnt(nDe("CAIN", v0)), nMitad = nEnt(nEnX(HOJA.CAIN, v0, v0.d/2));
  M.sub(b, "resumen-relato", "El recorrido, paso a paso", MOB() ? "Cada paso trae su gráfico; tócalo para ver el detalle." : "Desplázate: el gráfico de la derecha cambia con cada paso.");
  M.story(b, [
    { t:"Todo empieza con una pregunta bien formulada", d:"Una pregunta de efecto se arma con PICO: población, intervención, comparador y desenlace. Una revisión de alcance usa PCC: población, concepto y contexto.", cap:"Dos esquemas para dos tipos de pregunta", draw:picoSVG, note:"Fuentes: Cochrane Handbook y JBI.", sec:"temas" },
    { t:"El método define el diseño, no el título", d:"El aula distingue nueve diseños según quién asignó la intervención, si hubo azar y cómo se formaron los grupos. El árbol de decisión llega a cada uno con una a cinco preguntas.", cap:"Los nueve diseños del árbol, por familia", draw:familiasSVG, note:"Agrupación según las ramas del árbol de decisión del aula.", sec:"diseno" },
    { t:"Cuántos participantes: la precisión manda", d:"Para estimar una prevalencia de 50 % con ±5 puntos y 95 % de confianza se necesitan " + fmt(n0) + " personas; con ±2,5 puntos, " + fmt(nMitad) + ". Pedir el doble de precisión casi cuadruplica la muestra.", cap:"Tamaño de la muestra según la precisión (marco desconocido)", draw:()=> curvaSVG(HOJA.CAIN, v0, true), note:"Hoja CAIN del Excel de muestreo; n redondeado al entero superior.", sec:"muestra" },
    { t:"Cada diseño tiene su guía de reporte y su herramienta", d:"La guía dice qué debe contar el artículo; la herramienta, cuánto confiar en lo que cuenta. Un ensayo aleatorizado se reporta con CONSORT 2025 y se evalúa con RoB 2.", cap:"Guía de reporte y herramienta de evaluación por diseño", draw:matrizSVG, note:"Fuentes: red EQUATOR, riskofbias.info, JBI y QUADAS.", sec:"diseno" },
    { t:"Un efecto se lee con su tamaño y su precisión", d:"Con 15 de 100 eventos en el grupo tratado y 20 de 100 en el control, el RR es " + fmt(r.rr, 2) + ", pero su IC 95 % va de " + fmt(r.rrLo, 2) + " a " + fmt(r.rrHi, 2) + " e incluye 1: el estudio no demuestra diferencia. La reducción absoluta es de " + fmt(r.rar*100, 0) + " puntos y el NNT, " + fmt(Math.ceil(r.nnt - 1e-9)) + ".", cap:"Riesgos por grupo y efecto relativo con su intervalo", draw:()=> efectoSVG(r, true), note:"Ejemplo de la calculadora de efecto; IC por el método logarítmico.", sec:"efecto" },
    { t:"En una revisión con IA, la IA propone y el equipo decide", d:"Diez fases, del protocolo al reporte. En cada una la IA puede acelerar una tarea, y una persona verifica y toma la decisión final.", cap:"Las diez fases de una revisión sistemática con apoyo de IA", draw:()=> fasesSVG(true), note:"Basado en la declaración conjunta de Cochrane, Campbell, JBI y CEE (2025).", sec:"revision" },
    { t:"Publicar: citar bien y dar formato", d:"En Vancouver, cada referencia lleva autores, título, revista abreviada, año, volumen y páginas o identificador, y DOI. Mendeley Cite las inserta desde Word y evita errores de numeración.", cap:"Las partes de una referencia en estilo Vancouver", draw:vancouverSVG, note:"Ejemplo: CONSORT 2025 (BMJ 2025;389:e081123).", sec:"citas" }
  ]);
  M.sub(b, "resumen-preguntas", "Las preguntas del aula", "Cada pregunta abre su sección.");
  M.recorrido(b);
}

/* ============================================================ ENLACES A LAS FUENTES CON FICHA AL PASAR EL CURSOR */
/* Cada guía, herramienta, base de datos o documento nombrado en el texto se vuelve un enlace a su fuente (una vez por párrafo)
   y muestra una ficha con qué es y su cita. El registro está en CONTENIDO.enlaces. */
const FUENTE = {}, FRE = (C.enlaces || []).map(f=>{ FUENTE[f.id] = f; return { id:f.id, re:new RegExp(f.re) }; });
const NO_ENLAZAR = "a, button, .term, svg, input, select, option, textarea, label, .glossary, .ref-list, .sources-panel, .chart-tip, .src-tip, h1, h2, h3, h4, figcaption, .search-panel, pre";
function enlazar(root){
  if(!root || !FRE.length) return;
  const SEL = "p, li, td, dd, tbody th";
  const bloques = root.matches && root.matches(SEL) ? [root] : root.querySelectorAll(SEL);
  bloques.forEach(b=>{
    if(b.closest(NO_ENLAZAR)) return;
    const usados = new Set(), walker = document.createTreeWalker(b, NodeFilter.SHOW_TEXT, { acceptNode: t=> t.parentNode.closest(NO_ENLAZAR) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const textos = []; while(walker.nextNode()) textos.push(walker.currentNode);
    textos.forEach(tn=>{
      let node = tn, guard = 0;
      while(node && guard++ < 12){
        let mejor = null;
        FRE.forEach(f=>{ if(usados.has(f.id)) return; const m = f.re.exec(node.nodeValue); if(m && (!mejor || m.index < mejor.m.index || (m.index === mejor.m.index && m[0].length > mejor.m[0].length))) mejor = { m:m, id:f.id }; });
        if(!mejor) break;
        const f = FUENTE[mejor.id], antes = node.splitText(mejor.m.index), resto = antes.splitText(mejor.m[0].length);
        const a = el("a",{ href:f.url, target:"_blank", rel:"noopener", class:"src-link", "data-src":f.id, "aria-label":antes.nodeValue + " (abre " + f.t + " en una pestaña nueva)" },[antes.nodeValue]);
        antes.parentNode.replaceChild(a, antes); usados.add(mejor.id); node = resto;
      }
    });
  });
}
const srcTip = el("div",{ class:"src-tip", role:"tooltip", hidden:"" }); document.body.appendChild(srcTip);
function fichaFuente(a){
  const f = FUENTE[a.dataset.src]; if(!f) return;
  let host = ""; try{ host = new URL(f.url).hostname.replace(/^www\./, ""); }catch(e){}
  srcTip.innerHTML = "<strong>" + esc(f.t) + "</strong><p>" + esc(f.d) + "</p>" + (f.cita ? "<p class='src-cita'>" + esc(f.cita) + "</p>" : "") + "<p class='src-host'>Abre " + esc(host) + " ↗</p>";
  srcTip.hidden = false;
  const r = a.getBoundingClientRect(), w = Math.min(340, innerWidth - 24); srcTip.style.width = w + "px";
  const left = Math.max(12, Math.min(innerWidth - w - 12, r.left + r.width/2 - w/2));
  const h = srcTip.offsetHeight, arriba = r.top - h - 10 > 70;
  srcTip.style.left = left + "px"; srcTip.style.top = (arriba ? r.top - h - 10 : r.bottom + 10) + "px";
}
const ocultaFicha = ()=>{ srcTip.hidden = true; };
document.addEventListener("mouseover", e=>{ const a = e.target.closest && e.target.closest("a.src-link"); if(a) fichaFuente(a); });
document.addEventListener("mouseout", e=>{ if(e.target.closest && e.target.closest("a.src-link")) ocultaFicha(); });
document.addEventListener("focusin", e=>{ const a = e.target.closest && e.target.closest("a.src-link"); if(a) fichaFuente(a); else ocultaFicha(); });
document.addEventListener("keydown", e=>{ if(e.key === "Escape") ocultaFicha(); });
window.addEventListener("scroll", ocultaFicha, { passive:true });
/* Lo que se redibuja al interactuar (lecturas, fichas de diseño, fases, retroalimentación) también se enlaza */
let pendientes = new Set(), programado = false;
new MutationObserver(ms=>{
  ms.forEach(m=> m.addedNodes.forEach(n=>{ if(n.nodeType === 1 && !n.matches("a.src-link")) pendientes.add(n); else if(n.nodeType === 3 && n.parentElement) pendientes.add(n.parentElement.closest("p, li, td, dd, th") || n.parentElement); }));
  if(!programado && pendientes.size){ programado = true; requestAnimationFrame(()=>{ const l = [...pendientes]; pendientes = new Set(); programado = false; l.forEach(n=>{ if(n.isConnected) enlazar(n); }); }); }
}).observe(document.getElementById("main"), { childList:true, subtree:true });
/* El panel de fuentes reúne también las guías, herramientas y bases enlazadas en el texto */
if(C.enlaces && C.fuentes){ const ya = new Set(); C.fuentes.forEach(g=> g.items.forEach(i=> ya.add(i.url)));
  const extra = C.enlaces.filter(f=> !ya.has(f.url)).map(f=> ({ label:f.t, url:f.url }));
  if(extra.length) C.fuentes.push({ grupo:"Guías, herramientas, bases de datos y programas citados", items:extra }); }

M.iniciar({
  contenido: C, secciones: SECCIONES, partes: PARTES, ideas: IDEAS,
  entidad: { nombre:"diseño", inicial:null, valida: cod=> !!disCod(cod) },
  render(){ resumen(); rutas(); evaluacion(); temas(); pregunta(); diseno(); muestra(); variables(); protocolo(); practica(); efecto(); pronostico(); diagnostica(); metanalisis(); guias(); revision(); avance(); citas(); formato(); recursos(); enlazar(document.getElementById("accordion")); },
  indice(){
    return DIS.map(d=> ({ type:"Diseño", label:d.nombre, detail:d.guia + " · " + d.herramienta, sec:"diseno", anchor:"diseno-selector", cod:d.cod }))
      .concat(MU.calculadoras.map(h=> ({ type:"Tamaño de muestra", label:h.t, detail:"Hoja " + h.hoja + " del Excel", sec:"muestra", anchor:"muestra-calculadora" })))
      .concat(A.fases.map(f=> ({ type:"Fase de la revisión", label:f.n + ". " + f.nombre, detail:f.entregable, sec:"revision", anchor:"revision-fases" })))
      .concat(A.contenidos.map(c=> ({ type:"Tema", label:c.tema, detail:c.competencia, sec:"temas", anchor:"sec-temas" })));
  }
});
window.AULA = { normInv, calcular, efectoCalc, notaDefinitiva, descriptiva, dxCalc, metaCalc };
})();

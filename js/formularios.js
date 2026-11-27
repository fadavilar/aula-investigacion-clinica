/* Evaluación formativa, artículos de PubMed, formularios de evidencias con descarga y consolidador de notas del docente.
   Todo ocurre en el navegador: nada se envía a ningún servidor. Los archivos que se descargan los entrega cada estudiante a su docente. */
(function(){
"use strict";
const M = window.Motor, { el, esc, fmt, svgEl, VW, MOB, bindTip } = M, A = window.APP, E = window.EVAL;
const NS = M.SVGNS;
const sv = (tag, attrs, parent)=>{ const n = document.createElementNS(NS, tag); Object.keys(attrs||{}).forEach(k=> n.setAttribute(k, attrs[k])); if(parent) parent.appendChild(n); return n; };
const tx = (p, x, y, t, cls, anchor)=>{ const n = sv("text",{x, y, class:cls || "ax-t", "text-anchor":anchor || "start"}, p); n.textContent = t; return n; };
const store = { get(k){ try{ return JSON.parse(localStorage.getItem(k) || "null"); }catch(e){ return null; } }, set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }, del(k){ try{ localStorage.removeItem(k); }catch(e){} } };
const r1 = x=> Math.round((x + 1e-9)*10)/10;
const irA = id=>{ M.openSection(id); M.scrollSoon("sec-" + id); };
const sinTildes = s=> String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/\s+/g," ").trim();
const DIS = A.disenos;
const disPor = n=> DIS.find(d=> d.nombre === n);
const hoyTexto = ()=> new Date().toLocaleString("es-CO", { dateStyle:"long", timeStyle:"short" });
const VERSION = A.meta.version;

/* ------------------------------------------------------------ preguntas: banco unificado con identificador estable */
const PREGUNTAS = [].concat(
  A.practica.map((p,i)=> Object.assign({ id:"P" + (i + 1), ra:(E.practicaRA[i] || ["LC1"])[0], rutas:(E.practicaRA[i] || ["","R1"])[1] }, p)),
  E.banco.map((p,i)=> Object.assign({ id:"B" + (i + 1) }, p)),
  E.articulos.flatMap(a=> a.preguntas.map((p,i)=> Object.assign({ id:a.id + "-" + (i + 1), rutas:"R1", art:a.id }, p)))
);
const poolDe = ruta=> PREGUNTAS.filter(p=> String(p.rutas).split(" ").includes(ruta));
/* Una pregunta compartida entre años se cuenta en el resultado de aprendizaje equivalente del curso de cada año */
const EQUIV = { R2:{ MI1:"P1b", MI2:"P1c", MI3:"P2b", LC1:"P1c", LC2:"P1c", LC3:"P1c" }, R1:{ P1a:"MI1", P1b:"MI1", P1c:"MI3", P2a:"MI3", P2b:"MI3" } };
const raDe = (p, ruta)=> (E.ras[p.ra] && E.ras[p.ra].ruta === ruta) ? p.ra : (EQUIV[ruta][p.ra] || p.ra);
const barajar = a=>{ const b = a.slice(); for(let i=b.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
/* Sorteo estratificado: reparte las preguntas entre los resultados de aprendizaje de la ruta */
function sortear(ruta, n){
  const porRA = {}; barajar(poolDe(ruta)).forEach(p=>{ const r = raDe(p, ruta); (porRA[r] = porRA[r] || []).push(p); });
  const ras = barajar(Object.keys(porRA)), out = [];
  while(out.length < n && ras.some(r=> porRA[r].length)) ras.forEach(r=>{ if(out.length < n && porRA[r].length) out.push(porRA[r].shift()); });
  return out.map(p=>{ const orden = barajar(p.o.map((_,i)=> i)); return { p, orden, ra:raDe(p, ruta) }; });
}

/* ------------------------------------------------------------ identidad, descarga y verificación */
const ID_KEY = "aula-ic-identidad";
function identidad(onCambio){
  const v = store.get(ID_KEY) || { nombre:"", codigo:"", grupo:"R1" };
  const nombre = el("input",{type:"text", id:"id-nombre-" + Math.random().toString(36).slice(2,7), value:v.nombre, autocomplete:"name", placeholder:"Nombres y apellidos"});
  const codigo = el("input",{type:"text", value:v.codigo, placeholder:"Opcional"});
  const grupo = el("select",null,[ el("option",{value:"R1"},["Primer año (R1)"]), el("option",{value:"R2"},["Segundo año (R2)"]) ]); grupo.value = v.grupo;
  const guarda = ()=>{ const x = { nombre:nombre.value.trim(), codigo:codigo.value.trim(), grupo:grupo.value }; store.set(ID_KEY, x); if(onCambio) onCambio(x); };
  [nombre, codigo].forEach(i=> i.addEventListener("input", guarda)); grupo.addEventListener("change", guarda);
  const box = el("fieldset",{class:"id-box"},[ el("legend",null,["Tus datos (quedan en este navegador y en el archivo que descargas)"]),
    el("label",null,["Nombre completo", nombre]), el("label",null,["Código del estudiante", codigo]), el("label",null,["Grupo", grupo]) ]);
  return { nodo:box, valor:()=> ({ nombre:nombre.value.trim(), codigo:codigo.value.trim(), grupo:grupo.value }) };
}
/* Código de verificación (FNV-1a): delata cambios casuales en el archivo; no es una firma segura */
function huella(obj){ const s = JSON.stringify(obj) + "|aula-ic"; let h = 0x811c9dc5; for(let i=0;i<s.length;i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ("0000000" + h.toString(16)).slice(-8); }
function empaqueta(tipo, est, datos){ const base = { app:"aula-ic", version:VERSION, tipo, fecha:new Date().toISOString(), estudiante:est, datos }; return Object.assign(base, { verificacion:huella(base) }); }
function verifica(obj){ const c = Object.assign({}, obj); const v = c.verificacion; delete c.verificacion; return v === huella(c); }
function descargar(obj, nombre){
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type:"application/json" });
  const a = el("a",{ href:URL.createObjectURL(blob), download:nombre }); document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 400);
}
const archivo = (tipo, est)=> "aula_" + tipo + "_" + (sinTildes(est.nombre).replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"") || "sin_nombre") + "_" + new Date().toISOString().slice(0,10) + ".json";
const faltaNombre = est=> !est.nombre || est.nombre.length < 5;

/* ------------------------------------------------------------ gráfico de aciertos por resultado de aprendizaje */
function raSVG(porRA){
  const ids = Object.keys(porRA), W = VW(780, 344), fila = VW(34, 54), L = VW(300, 8), R = 70, H = 14 + ids.length*fila + 26;
  const s = svgEl(W, H, "ra-svg", "Aciertos por resultado de aprendizaje"), sx = p=> L + (W - L - R)*p;
  [0, 0.5, 1].forEach(p=>{ sv("line",{x1:sx(p), x2:sx(p), y1:6, y2:H - 22, class:"grid-l"}, s); tx(s, sx(p), H - 6, fmt(p*100, 0) + " %", "ax-s", "middle"); });
  ids.forEach((id,i)=>{ const v = porRA[id], p = v.n ? v.ok/v.n : 0, y = 10 + i*fila, g = sv("g",{class:"ra-row"}, s), t = E.ras[id] ? E.ras[id].t : id;
    if(MOB()){ tx(g, L, y + 14, M.wrapText(t, 40)[0], "ax-s ax-b"); sv("rect",{x:L, y:y + 22, width:Math.max(2, sx(p) - L), height:18, rx:3, class:"ra-bar" + (p < 0.6 ? " bajo" : "")}, g); tx(g, sx(p) + 6, y + 36, v.ok + "/" + v.n, "ax-s ax-b"); }
    else { tx(g, L - 10, y + 19, M.wrapText(t, 44)[0], "ax-s", "end"); sv("rect",{x:L, y:y + 5, width:Math.max(2, sx(p) - L), height:fila - 12, rx:3, class:"ra-bar" + (p < 0.6 ? " bajo" : "")}, g); tx(g, sx(p) + 6, y + 19, v.ok + "/" + v.n, "ax-s ax-b"); }
    g.setAttribute("tabindex","0"); g.setAttribute("role","img"); g.setAttribute("aria-label", t + ": " + v.ok + " de " + v.n);
    bindTip(g, ()=> "<h5>" + esc((E.ras[id] || {}).curso || "") + "</h5><p>" + esc(t) + "</p><p><strong>" + v.ok + " de " + v.n + "</strong> correctas</p>"); });
  return s;
}

/* ============================================================ EVALUACIÓN CON INTENTOS ILIMITADOS */
const EVA = { ruta:null, intento:null };
const HIST_KEY = r=> "aula-ic-eval-" + r;
function evaluar(b){
  b.appendChild(el("p",null,["Cada intento sortea preguntas nuevas del banco, repartidas entre los resultados de aprendizaje de tu año, y las presenta en otro orden. Puedes repetir cuantas veces quieras: queda registrado cada intento y tu mejor nota. Al terminar, descarga el archivo de resultados y entrégalo a tu docente."]));
  const idf = identidad(v=>{ if(!EVA.intento){ EVA.ruta = v.grupo; } });
  b.appendChild(idf.nodo);
  const tam = { R1:20, R2:15 };
  const info = el("div",{class:"eva-info"}), zona = el("div",{class:"eva-zona", "aria-live":"polite"}), res = el("div",{"aria-live":"polite"});
  const nuevo = el("button",{type:"button", class:"btn btn-primary"},["Empezar un intento"]), bajar = el("button",{type:"button", class:"btn"},["Descargar mis resultados"]), borrar = el("button",{type:"button", class:"btn"},["Borrar mi historial en este navegador"]);
  b.appendChild(info); b.appendChild(el("div",{class:"tools-row"},[nuevo, bajar, borrar])); b.appendChild(zona); b.appendChild(res);
  function historial(r){ return store.get(HIST_KEY(r)) || []; }
  function pintaInfo(){
    const r = idf.valor().grupo, h = historial(r), mejor = h.length ? Math.max(...h.map(x=> x.nota)) : null, pool = poolDe(r);
    const ras = [...new Set(pool.map(p=> p.ra))];
    info.innerHTML = "";
    info.appendChild(el("p",null,["Banco de " + (r === "R1" ? "primer" : "segundo") + " año: " + pool.length + " preguntas en " + ras.length + " resultados de aprendizaje; cada intento tiene " + Math.min(tam[r], pool.length) + ". Intentos hechos: " + h.length + (mejor !== null ? "; mejor nota: " + fmt(mejor, 1) : "") + "."]));
  }
  function empezar(){
    const est = idf.valor(); EVA.ruta = est.grupo;
    EVA.intento = { items:sortear(est.grupo, tam[est.grupo]), resp:{} };
    res.innerHTML = ""; zona.innerHTML = "";
    EVA.intento.items.forEach((it,i)=>{
      const f = el("fieldset",{class:"eva-q"},[ el("legend",null,[(i + 1) + ". " + it.p.q]) ]);
      it.orden.forEach((oi,k)=>{ const id = "eva-" + i + "-" + k, inp = el("input",{type:"radio", name:"eva-" + i, id:id, value:String(oi)});
        inp.addEventListener("change", ()=>{ EVA.intento.resp[i] = oi; cuenta.textContent = Object.keys(EVA.intento.resp).length + " de " + EVA.intento.items.length + " respondidas"; });
        f.appendChild(el("label",{for:id, class:"eva-op"},[inp, el("span",null,[it.p.o[oi]])])); });
      zona.appendChild(f);
    });
    const cuenta = el("span",{class:"muted"},["0 de " + EVA.intento.items.length + " respondidas"]), cal = el("button",{type:"button", class:"btn btn-primary"},["Calificar el intento"]);
    cal.addEventListener("click", calificar); zona.appendChild(el("div",{class:"tools-row eva-fin"},[cal, cuenta]));
    zona.scrollIntoView({ behavior:"smooth", block:"start" });
  }
  function calificar(){
    const it = EVA.intento; if(!it) return;
    const n = it.items.length, faltan = n - Object.keys(it.resp).length;
    if(faltan && !confirm("Faltan " + faltan + " preguntas. Las que no respondas cuentan como incorrectas. ¿Calificar de todos modos?")) return;
    let ok = 0; const porRA = {}, detalle = [];
    it.items.forEach((x,i)=>{ const bien = it.resp[i] === x.p.r; if(bien) ok++; (porRA[x.ra] = porRA[x.ra] || { ok:0, n:0 }).n++; if(bien) porRA[x.ra].ok++;
      detalle.push({ id:x.p.id, ra:x.ra, elegida:it.resp[i] === undefined ? null : it.resp[i], correcta:x.p.r, bien });
      const f = zona.querySelectorAll(".eva-q")[i]; f.classList.add(bien ? "ok" : "bad");
      f.querySelectorAll("input").forEach(inp=> inp.disabled = true);
      f.appendChild(el("p",{class:"fb " + (bien ? "fb-ok" : "fb-bad")},[ el("strong",null,[bien ? "Correcto. " : "Respuesta correcta: " + x.p.o[x.p.r] + ". "]), x.p.e ])); });
    const nota = r1(5*ok/n), reg = { fecha:new Date().toISOString(), ruta:EVA.ruta, aciertos:ok, n, nota, porRA, detalle };
    const h = historial(EVA.ruta); h.push(reg); store.set(HIST_KEY(EVA.ruta), h);
    EVA.intento = null; zona.querySelector(".eva-fin").remove();
    res.innerHTML = "";
    res.appendChild(el("div",{class:"m-res nota-res"},[ el("span",{class:"m-res-k"},["Resultado del intento " + h.length]), el("strong",{class:"m-res-n"},[fmt(nota, 1)]),
      el("span",{class:"m-res-d"},[ok + " de " + n + " correctas. Mejor nota hasta ahora: " + fmt(Math.max(...h.map(x=> x.nota)), 1) + "."]) ]));
    const box = el("div",{class:"chart-box"}); box.appendChild(raSVG(porRA)); res.appendChild(M.howTo("cada barra es un resultado de aprendizaje; las barras en terracota están por debajo de 60 % y señalan qué repasar."));
    res.appendChild(box);
    const debil = Object.keys(porRA).filter(k=> porRA[k].ok/porRA[k].n < 0.6).map(k=> E.ras[k].t.toLowerCase());
    res.appendChild(el("p",{class:"reading-like"},[debil.length ? "Repasa: " + debil.join("; ") + ". Las explicaciones están debajo de cada pregunta." : "Superaste 60 % en todos los resultados de aprendizaje de este intento."]));
    pintaInfo(); res.scrollIntoView({ behavior:"smooth", block:"start" });
  }
  nuevo.addEventListener("click", empezar);
  bajar.addEventListener("click", ()=>{ const est = idf.valor(); if(faltaNombre(est)){ alert("Escribe tu nombre completo antes de descargar."); return; }
    const h = historial(est.grupo); if(!h.length){ alert("Aún no tienes intentos en " + est.grupo + "."); return; }
    descargar(empaqueta("evaluacion", est, { ruta:est.grupo, intentos:h.length, mejor:Math.max(...h.map(x=> x.nota)), ultima:h[h.length-1].nota, historial:h }), archivo("evaluacion", est)); });
  borrar.addEventListener("click", ()=>{ const r = idf.valor().grupo; if(confirm("Se borrarán tus " + historial(r).length + " intentos de " + r + " en este navegador. Descarga antes tus resultados si los necesitas. ¿Continuar?")){ store.del(HIST_KEY(r)); pintaInfo(); } });
  idf.nodo.addEventListener("change", pintaInfo); idf.nodo.addEventListener("input", pintaInfo);
  pintaInfo();
}

/* ============================================================ ARTÍCULOS DE PUBMED PARA LA LECTURA CRÍTICA */
function articulos(b){
  b.appendChild(el("p",null,["Cinco artículos reales de medicina interna, uno por diseño, elegidos en PubMed. Cada uno trae un resumen en español, sus enlaces y preguntas de lectura crítica ajustadas a lo que dice. Léelo en la fuente, responde y después llena tu ficha con él."]));
  const grid = el("div",{class:"art-grid"});
  E.articulos.forEach(a=>{
    const d = disPor(a.diseno), quiz = el("div",{class:"art-quiz", hidden:""});
    const enl = el("p",{class:"link-row"},[
      el("a",{href:"https://pubmed.ncbi.nlm.nih.gov/" + a.pmid + "/", target:"_blank", rel:"noopener", class:"btn btn-sm"},["PubMed"]),
      el("a",{href:"https://doi.org/" + a.doi, target:"_blank", rel:"noopener", class:"btn btn-sm"},["DOI"]),
      a.pmc ? el("a",{href:"https://pmc.ncbi.nlm.nih.gov/articles/" + a.pmc + "/", target:"_blank", rel:"noopener", class:"btn btn-sm"},["Texto completo gratuito (PMC)"]) : null ]);
    const prac = el("button",{type:"button", class:"btn btn-primary"},["Responder " + a.preguntas.length + " preguntas"]), ficha = el("button",{type:"button", class:"btn"},["Llenar mi ficha con este artículo"]);
    prac.addEventListener("click", ()=>{ quiz.hidden = !quiz.hidden; if(!quiz.hidden && !quiz.firstChild) armaQuiz(quiz, a); });
    ficha.addEventListener("click", ()=>{ FORM.tab = "ficha"; FORM.articulo = a.id; irA("formularios"); if(FORM.repinta) FORM.repinta(); });
    grid.appendChild(el("article",{class:"card art-card"},[
      el("span",{class:"tag-pill"},[a.diseno]), el("h4",null,[a.corto]), el("p",{class:"art-cita"},[a.cita]),
      el("p",null,[a.resumen]), el("p",{class:"muted small"},["Resumen del autor del aula a partir del resumen publicado en PubMed. Guía de reporte: " + d.guia + ". Herramienta: " + d.herramienta + "."]),
      enl, el("div",{class:"tools-row"},[prac, ficha]), quiz ]));
  });
  b.appendChild(grid);
}
function armaQuiz(box, a){
  a.preguntas.forEach((q,i)=>{
    const f = el("div",{class:"eva-q"},[ el("p",{class:"q"},[(i + 1) + ". " + q.q]) ]), ops = el("div",{class:"opts"}), fb = el("div");
    q.o.forEach((t,k)=>{ const bt = el("button",{type:"button", class:"opt"},[t]); bt.addEventListener("click", ()=>{
      if(bt.disabled) return; ops.querySelectorAll(".opt").forEach((x,j)=>{ x.disabled = true; if(j === q.r) x.classList.add("ok"); else if(j === k) x.classList.add("bad"); });
      fb.appendChild(el("p",{class:"fb " + (k === q.r ? "fb-ok" : "fb-bad")},[ el("strong",null,[k === q.r ? "Correcto. " : "No es esa. "]), q.e ])); }); ops.appendChild(bt); });
    f.appendChild(ops); f.appendChild(fb); box.appendChild(f);
  });
}

/* ============================================================ FORMULARIOS DE EVIDENCIAS */
const FORM = { tab:"diagnostico", articulo:"dapahf", repinta:null };
const FICHA_KEY = "aula-ic-ficha", PRAC_KEY = "aula-ic-practica", COE_KEY = "aula-ic-coevaluacion";
function formularios(b){
  b.appendChild(el("p",null,["Cada formulario genera un archivo que entregas a tu docente (por correo o por la plataforma). Con esos archivos el docente calcula las notas en el consolidador. Lo que escribes se guarda como borrador en este navegador."]));
  const idf = identidad(); b.appendChild(idf.nodo);
  const panel = el("div",{class:"ruta-panel", role:"tabpanel", tabindex:"0"});
  const opciones = [{id:"diagnostico", label:"Diagnóstico"},{id:"ficha", label:"Ficha de lectura crítica"},{id:"practica", label:"Árbol y Mendeley"},{id:"coevaluacion", label:"Coevaluación"},{id:"proyecto", label:"Entregables de segundo año"}];
  const lista = el("div",{class:"tabs", role:"tablist", "aria-label":"Formularios"});
  const botones = opciones.map(o=>{ const bt = el("button",{type:"button", role:"tab", class:"tab", id:"ftab-" + o.id, "aria-controls":"fpanel"},[o.label]); bt.addEventListener("click", ()=>{ FORM.tab = o.id; pinta(true); }); lista.appendChild(bt); return bt; });
  lista.addEventListener("keydown", e=>{ const i = botones.indexOf(document.activeElement); if(i < 0) return; let j = null;
    if(e.key === "ArrowRight") j = (i + 1) % botones.length; else if(e.key === "ArrowLeft") j = (i - 1 + botones.length) % botones.length; else if(e.key === "Home") j = 0; else if(e.key === "End") j = botones.length - 1;
    if(j !== null){ e.preventDefault(); FORM.tab = opciones[j].id; pinta(true); } });
  panel.id = "fpanel"; b.appendChild(lista); b.appendChild(panel);
  function pinta(foco){
    botones.forEach((bt,i)=>{ const on = opciones[i].id === FORM.tab; bt.setAttribute("aria-selected", String(on)); bt.tabIndex = on ? 0 : -1; if(on && foco) bt.focus(); });
    panel.setAttribute("aria-labelledby", "ftab-" + FORM.tab); panel.innerHTML = "";
    ({ diagnostico:fDiagnostico, ficha:fFicha, practica:fPractica, coevaluacion:fCoevaluacion, proyecto:fProyecto })[FORM.tab](panel, idf);
  }
  FORM.repinta = ()=> pinta(false);
  pinta(false);
}
function botonDescarga(texto, fn){ const bt = el("button",{type:"button", class:"btn btn-primary"},[texto]); bt.addEventListener("click", fn); return bt; }
function campoTexto(l, valor, onInput, area, ph){ const i = area ? el("textarea",{rows:"3", placeholder:ph || ""}) : el("input",{type:"text", placeholder:ph || ""}); i.value = valor || ""; i.addEventListener("input", ()=> onInput(i.value)); return el("label",{class:area ? "fx-area" : null},[l, i]); }
function fDiagnostico(p, idf){
  p.appendChild(el("p",null,["Cinco preguntas para saber dónde estás. No tienen nota: sirven para orientar el trabajo del grupo."]));
  const resp = {}, zona = el("div");
  E.diagnostico.forEach((q,i)=>{ const f = el("fieldset",{class:"eva-q"},[ el("legend",null,[(i + 1) + ". " + q.q]) ]);
    q.o.forEach((t,k)=>{ const id = "dg-" + i + "-" + k, inp = el("input",{type:"radio", name:"dg-" + i, id:id}); inp.addEventListener("change", ()=> resp[i] = k); f.appendChild(el("label",{for:id, class:"eva-op"},[inp, el("span",null,[t])])); });
    zona.appendChild(f); });
  p.appendChild(zona);
  const out = el("div",{"aria-live":"polite"});
  const ver = el("button",{type:"button", class:"btn"},["Ver mis resultados"]);
  ver.addEventListener("click", ()=>{ let ok = 0; zona.querySelectorAll(".eva-q").forEach((f,i)=>{ const q = E.diagnostico[i], bien = resp[i] === q.r; if(bien) ok++; f.querySelectorAll(".fb").forEach(x=> x.remove()); f.appendChild(el("p",{class:"fb " + (bien ? "fb-ok" : "fb-bad")},[ el("strong",null,[bien ? "Correcto. " : "Respuesta: " + q.o[q.r] + ". "]), q.e ])); });
    out.innerHTML = ""; out.appendChild(el("p",{class:"callout"},[ok + " de 5 correctas. " + (ok <= 2 ? "Si fallaste tres o más, repasa el mapa de diseños antes del trabajo en grupo." : "Buen punto de partida.")])); });
  const dl = botonDescarga("Descargar el diagnóstico", ()=>{ const est = idf.valor(); if(faltaNombre(est)) return alert("Escribe tu nombre completo antes de descargar.");
    const ok = E.diagnostico.filter((q,i)=> resp[i] === q.r).length; descargar(empaqueta("diagnostico", est, { respuestas:E.diagnostico.map((q,i)=> resp[i] === undefined ? null : resp[i]), aciertos:ok, n:5 }), archivo("diagnostico", est)); });
  p.appendChild(el("div",{class:"tools-row"},[ver, dl])); p.appendChild(out);
}
function fFicha(p, idf){
  const F = store.get(FICHA_KEY) || {}; if(!F.numero) F.numero = "1"; if(!F.articulo) F.articulo = FORM.articulo || "dapahf";
  if(FORM.articulo && FORM.articulo !== F.articulo){ F.articulo = FORM.articulo; const a = E.articulos.find(x=> x.id === F.articulo); if(a) F.diseno = a.diseno; }
  const guarda = ()=> store.set(FICHA_KEY, F);
  p.appendChild(el("p",null,["La ficha sigue los cinco pasos de la lectura crítica. Trabájala con tu grupo y que cada integrante descargue su archivo, o descárgala una vez con los nombres de todos."]));
  const g1 = el("div",{class:"nota-form"});
  const num = el("select",null,[ el("option",{value:"1"},["Ficha 1"]), el("option",{value:"2"},["Ficha 2"]) ]); num.value = F.numero; num.addEventListener("change", ()=>{ F.numero = num.value; guarda(); });
  const art = el("select",null, E.articulos.map(a=> el("option",{value:a.id},[a.corto])).concat([ el("option",{value:"otro"},["Otro artículo"]) ])); art.value = F.articulo;
  art.addEventListener("change", ()=>{ F.articulo = art.value; FORM.articulo = art.value; const a = E.articulos.find(x=> x.id === art.value); if(a){ F.diseno = a.diseno; } guarda(); FORM.repinta(); });
  g1.appendChild(el("label",null,["Ficha", num])); g1.appendChild(el("label",null,["Artículo", art]));
  g1.appendChild(campoTexto("Integrantes del grupo (separados por coma)", F.integrantes, v=>{ F.integrantes = v; guarda(); }));
  p.appendChild(g1);
  if(F.articulo === "otro"){ const g = el("div",{class:"nota-form"}); g.appendChild(campoTexto("Cita en Vancouver", F.cita, v=>{ F.cita = v; guarda(); }, true)); g.appendChild(campoTexto("DOI o enlace", F.doi, v=>{ F.doi = v; guarda(); })); p.appendChild(g); }
  else { const a = E.articulos.find(x=> x.id === F.articulo); p.appendChild(el("p",{class:"art-cita"},[a.cita + " "])); }
  p.appendChild(el("h5",null,["1. Pregunta (PICO)"]));
  const g2 = el("div",{class:"nota-form"}); [["P","Población"],["I","Intervención o exposición"],["C","Comparador"],["O","Desenlace"]].forEach(c=> g2.appendChild(campoTexto(c[0] + ": " + c[1], F["pico" + c[0]], v=>{ F["pico" + c[0]] = v; guarda(); }))); p.appendChild(g2);
  p.appendChild(el("h5",null,["2. Diseño, guía y herramienta"]));
  const dis = el("select",null,[ el("option",{value:""},["Elige el diseño"]) ].concat(DIS.map(d=> el("option",{value:d.nombre},[d.nombre])))); dis.value = F.diseno || "";
  const gh = el("p",{class:"muted"});
  const pintaGH = ()=>{ const d = disPor(dis.value); gh.textContent = d ? "Guía de reporte: " + d.guia + ". Herramienta de evaluación: " + d.herramienta + "." : "Usa el árbol de decisión si dudas."; };
  dis.addEventListener("change", ()=>{ F.diseno = dis.value; guarda(); pintaGH(); FORM.repinta(); });
  p.appendChild(el("label",{class:"field"},["Diseño del estudio", dis])); p.appendChild(gh); pintaGH();
  p.appendChild(el("h5",null,["3. Validez interna"]));
  const esECA = F.diseno === "Ensayo clínico aleatorizado";
  const dominios = esECA ? ["Proceso de aleatorización","Desviaciones de la intervención","Datos faltantes del desenlace","Medición del desenlace","Selección del resultado reportado"] : ["Sesgo de selección","Sesgo de información","Confusión"];
  const juicios = esECA ? ["Bajo riesgo","Algunas dudas","Alto riesgo"] : ["Bajo","Moderado","Alto","No se puede juzgar"];
  p.appendChild(el("p",{class:"muted small"},[esECA ? "Dominios de RoB 2: juzga cada uno y apóyalo en algo que diga el artículo." : "Juzga las tres familias de sesgo y apoya cada juicio en el texto; usa también la herramienta del diseño."]));
  F.sesgos = F.sesgos || {};
  dominios.forEach(dm=>{ const s = F.sesgos[dm] || {}; const sel = el("select",null,[ el("option",{value:""},["Juicio"]) ].concat(juicios.map(j=> el("option",{value:j},[j])))); sel.value = s.j || "";
    sel.addEventListener("change", ()=>{ F.sesgos[dm] = Object.assign(F.sesgos[dm] || {}, { j:sel.value }); guarda(); });
    const just = el("input",{type:"text", placeholder:"Qué dice el artículo que lo respalda"}); just.value = s.t || ""; just.addEventListener("input", ()=>{ F.sesgos[dm] = Object.assign(F.sesgos[dm] || {}, { t:just.value }); guarda(); });
    p.appendChild(el("div",{class:"sesgo-row"},[ el("strong",null,[dm]), sel, just ])); });
  p.appendChild(el("h5",null,["4. Resultados"]));
  const g4 = el("div",{class:"nota-form"});
  g4.appendChild(campoTexto("Medida principal (RR, HR, OR, sensibilidad…)", F.medida, v=>{ F.medida = v; guarda(); }));
  g4.appendChild(campoTexto("Valor e IC 95 %", F.valor, v=>{ F.valor = v; guarda(); }));
  g4.appendChild(campoTexto("¿Qué significa en palabras?", F.interpreta, v=>{ F.interpreta = v; guarda(); }, true)); p.appendChild(g4);
  p.appendChild(el("h5",null,["5. Aplicabilidad"]));
  const g5 = el("div",{class:"nota-form"});
  g5.appendChild(campoTexto("¿Tu paciente se parece a los del estudio?", F.aplica, v=>{ F.aplica = v; guarda(); }, true));
  g5.appendChild(campoTexto("Conclusión: ¿qué harías con un paciente concreto y por qué?", F.conclusion, v=>{ F.conclusion = v; guarda(); }, true)); p.appendChild(g5);
  const estado = el("p",{class:"muted", "aria-live":"polite"});
  const campos = ()=> ["picoP","picoI","picoC","picoO","diseno","medida","valor","interpreta","aplica","conclusion"];
  const pintaEstado = ()=>{ const llenos = campos().filter(k=> (F[k] || "").trim()).length + dominios.filter(dm=> F.sesgos[dm] && F.sesgos[dm].j && (F.sesgos[dm].t || "").trim()).length, tot = campos().length + dominios.length; estado.textContent = "Completo: " + llenos + " de " + tot + " campos."; };
  p.addEventListener("input", pintaEstado); p.addEventListener("change", pintaEstado); pintaEstado();
  const dl = botonDescarga("Descargar la ficha", ()=>{ const est = idf.valor(); if(faltaNombre(est)) return alert("Escribe tu nombre completo antes de descargar.");
    const a = E.articulos.find(x=> x.id === F.articulo); const d = disPor(F.diseno);
    descargar(empaqueta("ficha", est, Object.assign({}, F, { articuloCita: a ? a.cita : F.cita, articuloDoi: a ? a.doi : F.doi, guia: d ? d.guia : "", herramienta: d ? d.herramienta : "", dominios })), archivo("ficha" + F.numero, est)); });
  const limpia = el("button",{type:"button", class:"btn"},["Empezar una ficha nueva"]); limpia.addEventListener("click", ()=>{ if(confirm("Se borrará el borrador de la ficha en este navegador. ¿Continuar?")){ store.del(FICHA_KEY); FORM.repinta(); } });
  p.appendChild(estado); p.appendChild(el("div",{class:"tools-row"},[dl, limpia]));
}
function fPractica(p, idf){
  const P = store.get(PRAC_KEY) || { articulo:"lee", checks:[] }; const guarda = ()=> store.set(PRAC_KEY, P);
  p.appendChild(el("p",null,["Clasifica un artículo con el árbol de decisión y deja lista tu biblioteca de Mendeley. El formulario sugiere una nota con lo que registras; el docente la verifica."]));
  const g = el("div",{class:"nota-form"});
  const art = el("select",null, E.articulos.map(a=> el("option",{value:a.id},[a.corto]))); art.value = P.articulo; art.addEventListener("change", ()=>{ P.articulo = art.value; guarda(); calc(); });
  const mk = (k, l, opts)=>{ const s = el("select",null,[ el("option",{value:""},["Elige"]) ].concat(opts.map(o=> el("option",{value:o},[o])))); s.value = P[k] || ""; s.addEventListener("change", ()=>{ P[k] = s.value; guarda(); calc(); }); g.appendChild(el("label",null,[l, s])); };
  g.appendChild(el("label",null,["Artículo", art]));
  mk("diseno", "Diseño que te dio el árbol", DIS.map(d=> d.nombre)); mk("guia", "Guía de reporte", [...new Set(DIS.map(d=> d.guia))]); mk("herramienta", "Herramienta de evaluación", [...new Set(DIS.map(d=> d.herramienta))]);
  p.appendChild(g);
  const ir = el("button",{type:"button", class:"btn btn-sm"},["Abrir el árbol de decisión"]); ir.addEventListener("click", ()=> irA("diseno")); p.appendChild(ir);
  p.appendChild(el("h5",null,["Mendeley"]));
  const ul = el("ul",{class:"lv"});
  E.mendeley.forEach((t,i)=>{ const cb = el("input",{type:"checkbox", id:"md-" + i}); cb.checked = !!P.checks[i]; cb.addEventListener("change", ()=>{ P.checks[i] = cb.checked; guarda(); calc(); }); ul.appendChild(el("li",{class:"lv-i"},[cb, el("label",{for:"md-" + i},[t])])); });
  p.appendChild(ul);
  const g2 = el("div",{class:"nota-form"});
  const nref = el("input",{type:"number", min:"0", step:"1", value:String(P.nref || "")}); nref.addEventListener("input", ()=>{ P.nref = Number(nref.value); guarda(); calc(); });
  g2.appendChild(el("label",null,["Número de referencias en tu carpeta Lectura_Apellido", nref]));
  g2.appendChild(campoTexto("Pega la bibliografía de prueba que generó Word", P.biblio, v=>{ P.biblio = v; guarda(); }, true));
  p.appendChild(g2);
  const out = el("div",{class:"callout", "aria-live":"polite"});
  p.appendChild(out);
  function sugerida(){ const a = E.articulos.find(x=> x.id === P.articulo), d = disPor(a.diseno);
    const arbol = [P.diseno === d.nombre, P.guia === d.guia, P.herramienta === d.herramienta].filter(Boolean).length/3*5;
    const checks = P.checks.filter(Boolean).length, refsOk = (P.nref || 0) >= 10;
    const mend = (checks - (P.checks[3] && !refsOk ? 1 : 0))/E.mendeley.length*5;
    return { arbol:r1(arbol), mend:r1(Math.max(0, mend)), nota:r1((arbol + Math.max(0, mend))/2), correcto:d }; }
  function calc(){ const s = sugerida(); out.innerHTML = ""; out.appendChild(el("p",null,[ el("strong",null,["Nota sugerida: " + fmt(s.nota, 1) + ". "]), "Árbol: " + fmt(s.arbol, 1) + " (diseño, guía y herramienta). Mendeley: " + fmt(s.mend, 1) + (P.checks[3] && (P.nref || 0) < 10 ? " (marcaste diez referencias, pero escribiste menos)." : ".") ])); }
  calc();
  p.appendChild(el("div",{class:"tools-row"},[ botonDescarga("Descargar la práctica", ()=>{ const est = idf.valor(); if(faltaNombre(est)) return alert("Escribe tu nombre completo antes de descargar.");
    const s = sugerida(); descargar(empaqueta("practica", est, Object.assign({}, P, { sugerida:s.nota, arbol:s.arbol, mendeley:s.mend, disenoCorrecto:s.correcto.nombre })), archivo("practica", est)); }) ]));
}
function fCoevaluacion(p, idf){
  const C = store.get(COE_KEY) || { filas:[] }; const guarda = ()=> store.set(COE_KEY, C);
  p.appendChild(el("p",null,["Califica de 1,0 a 5,0 a cada grupo que presenta en la plenaria. Puedes agregar varios grupos y descargar todo en un solo archivo."]));
  const g = el("div",{class:"nota-form"}), v = { grupo:"", integrantes:"", comentario:"" };
  g.appendChild(campoTexto("Grupo que presenta", "", x=> v.grupo = x, false, "Ej.: Grupo 2"));
  g.appendChild(campoTexto("Integrantes del grupo que presenta (separados por coma)", "", x=> v.integrantes = x));
  E.coevaluacion.forEach(c=>{ const i = el("input",{type:"text", inputmode:"decimal", placeholder:"1,0 a 5,0", id:"coe-" + c.id}); i.addEventListener("input", ()=> v[c.id] = i.value); g.appendChild(el("label",{for:"coe-" + c.id},[c.t + ": " + c.d, i])); });
  g.appendChild(campoTexto("Comentario constructivo", "", x=> v.comentario = x, true));
  p.appendChild(g);
  const tabla = el("div"), msg = el("p",{class:"m-err", role:"status"});
  const add = el("button",{type:"button", class:"btn"},["Agregar esta evaluación"]);
  add.addEventListener("click", ()=>{ const notas = E.coevaluacion.map(c=> parseFloat(String(v[c.id] || "").replace(",", ".")));
    if(!v.grupo.trim() || notas.some(x=> !isFinite(x) || x < 1 || x > 5)){ msg.textContent = "Escribe el grupo y las tres notas entre 1,0 y 5,0."; return; }
    msg.textContent = ""; const fila = { grupo:v.grupo.trim(), integrantes:v.integrantes.trim(), comentario:v.comentario.trim(), promedio:r1(notas.reduce((a,b)=> a + b, 0)/notas.length) };
    E.coevaluacion.forEach((c,i)=> fila[c.id] = notas[i]); C.filas.push(fila); guarda(); FORM.repinta(); });
  p.appendChild(el("div",{class:"tools-row"},[add])); p.appendChild(msg);
  if(C.filas.length){ tabla.appendChild(M.tabla(["Grupo","Claridad","Justificación","Aplicabilidad","Promedio"], C.filas.map(f=> [f.grupo, fmt(f.claridad, 1), fmt(f.justificacion, 1), fmt(f.aplicabilidad, 1), fmt(f.promedio, 1)]))); p.appendChild(tabla); }
  const limpia = el("button",{type:"button", class:"btn"},["Borrar las evaluaciones"]); limpia.addEventListener("click", ()=>{ if(confirm("¿Borrar las evaluaciones de este navegador?")){ store.del(COE_KEY); FORM.repinta(); } });
  p.appendChild(el("div",{class:"tools-row"},[ botonDescarga("Descargar la coevaluación", ()=>{ const est = idf.valor(); if(faltaNombre(est)) return alert("Escribe tu nombre completo antes de descargar."); if(!C.filas.length) return alert("Agrega al menos una evaluación.");
    descargar(empaqueta("coevaluacion", est, { filas:C.filas }), archivo("coevaluacion", est)); }), limpia ]));
}
function fProyecto(p, idf){
  const K = "aula-ic-proyecto", P = store.get(K) || {}; const guarda = ()=> store.set(K, P);
  p.appendChild(el("p",null,["Para segundo año. Registra el enlace a tus documentos y descarga junto con el avance de tus listas del protocolo y del avance de resultados (las que marcaste en esas secciones)."]));
  const g = el("div",{class:"nota-form"});
  g.appendChild(campoTexto("Título de tu proyecto", P.titulo, v=>{ P.titulo = v; guarda(); }));
  g.appendChild(campoTexto("Enlace a la síntesis de Proyecto I (Drive u otro)", P.enlace1, v=>{ P.enlace1 = v; guarda(); }));
  g.appendChild(campoTexto("Enlace al avance de Proyecto II", P.enlace2, v=>{ P.enlace2 = v; guarda(); }));
  p.appendChild(g);
  const conteo = (clave, grupos)=>{ const s = store.get(clave) || {}, tot = grupos.reduce((a,x)=> a + x.items.length, 0); return { hechos:Object.keys(s).filter(k=> s[k]).length, total:tot }; };
  const c1 = conteo("aula-ic-protocolo", A.protocolo), c2 = conteo("aula-ic-avance", A.avance);
  p.appendChild(el("p",{class:"callout"},["Lista del protocolo: " + c1.hechos + " de " + c1.total + ". Lista del avance: " + c2.hechos + " de " + c2.total + "."]));
  const ir1 = el("button",{type:"button", class:"btn btn-sm"},["Ir a la lista del protocolo"]), ir2 = el("button",{type:"button", class:"btn btn-sm"},["Ir a la lista del avance"]);
  ir1.addEventListener("click", ()=> irA("protocolo")); ir2.addEventListener("click", ()=> irA("avance"));
  p.appendChild(el("div",{class:"tools-row"},[ir1, ir2, botonDescarga("Descargar mis entregables", ()=>{ const est = idf.valor(); if(faltaNombre(est)) return alert("Escribe tu nombre completo antes de descargar.");
    descargar(empaqueta("proyecto", est, Object.assign({}, P, { protocolo:c1, avance:c2, marcas:{ protocolo:store.get("aula-ic-protocolo") || {}, avance:store.get("aula-ic-avance") || {} } })), archivo("proyecto", est)); }) ]));
}

/* ============================================================ CONSOLIDADOR DE NOTAS (DOCENTE) */
const DOC_KEY = "aula-ic-docente";
function docente(b){
  b.appendChild(el("p",null,["Para el docente. Carga los archivos que te entregaron los estudiantes (puedes elegir muchos a la vez). El consolidador los agrupa por estudiante, propone para el taller la mejor nota de la evaluación con intentos ilimitados (si aplicas el taller de 20 preguntas, escribe esa nota encima), sugiere la de la práctica y la de participación (promedio de las coevaluaciones recibidas) y te deja calificar cada ficha con la rúbrica. Todo queda en este navegador; nada se envía."]));
  const D = store.get(DOC_KEY) || { est:{}, archivos:[] }; const guarda = ()=> store.set(DOC_KEY, D);
  const inp = el("input",{type:"file", accept:".json,application/json", multiple:"", id:"doc-archivos"});
  b.appendChild(el("label",{class:"field", for:"doc-archivos"},["Archivos de los estudiantes (.json)", inp]));
  const avisos = el("div",{"aria-live":"polite"}), tabla = el("div"), detalle = el("div",{class:"doc-detalle"});
  const exp = el("button",{type:"button", class:"btn btn-primary"},["Descargar las notas (CSV para Excel)"]), resp = el("button",{type:"button", class:"btn"},["Descargar respaldo"]), borra = el("button",{type:"button", class:"btn"},["Borrar todo"]);
  b.appendChild(avisos); b.appendChild(el("div",{class:"tools-row"},[exp, resp, borra])); b.appendChild(tabla); b.appendChild(detalle);
  const clave = e=> sinTildes(e.nombre) + "|" + sinTildes(e.codigo);
  const fila = e=>{ const k = clave(e); D.est[k] = D.est[k] || { nombre:e.nombre, codigo:e.codigo || "", grupo:e.grupo || "R1", notas:{}, fichas:{}, practica:null, coevRecibidas:[] }; return D.est[k]; };
  inp.addEventListener("change", async ()=>{
    const msgs = [];
    for(const f of inp.files){
      try{
        const o = JSON.parse(await f.text());
        if(o.app === "aula-ic-docente" && o.datos){ Object.assign(D, { est:o.datos.est || {}, archivos:o.datos.archivos || [], coev:o.datos.coev || [] }); msgs.push(f.name + ": respaldo restaurado."); continue; }
        if(o.app !== "aula-ic"){ msgs.push(f.name + ": no es un archivo del aula."); continue; }
        if(D.archivos.some(a=> a.verificacion === o.verificacion && a.tipo === o.tipo && a.fecha === o.fecha)){ msgs.push(f.name + ": ya estaba cargado."); continue; }
        const ok = verifica(o); D.archivos.push({ nombre:f.name, tipo:o.tipo, fecha:o.fecha, verificacion:o.verificacion, integro:ok, estudiante:o.estudiante });
        if(!ok) msgs.push(f.name + ": el código de verificación no coincide; el archivo pudo modificarse.");
        const s = fila(o.estudiante), d = o.datos;
        if(o.tipo === "evaluacion") s.notas.taller = Math.max(s.notas.taller || 0, d.mejor), s.evaluacion = { intentos:d.intentos, mejor:d.mejor };
        else if(o.tipo === "ficha") s.fichas[d.numero || "1"] = { datos:d, rubrica:(s.fichas[d.numero || "1"] || {}).rubrica || null };
        else if(o.tipo === "practica"){ s.practica = d; if(s.notas.practica === undefined) s.notas.practica = d.sugerida; }
        else if(o.tipo === "proyecto") s.proyecto = d;
        else if(o.tipo === "coevaluacion") d.filas.forEach(r=> (D.coev = D.coev || []).push(Object.assign({ evaluador:o.estudiante.nombre }, r)));
        else if(o.tipo === "diagnostico") s.diagnostico = { aciertos:d.aciertos, n:d.n };
        msgs.push(f.name + ": cargado (" + o.tipo + ").");
      }catch(e){ msgs.push(f.name + ": no se pudo leer (" + e.message + ")."); }
    }
    inp.value = ""; asignaCoev(); guarda(); avisos.innerHTML = ""; avisos.appendChild(el("ul",{class:"doc-avisos"}, msgs.map(m=> el("li",null,[m])))); pinta();
  });
  function asignaCoev(){ /* participación sugerida: promedio de las coevaluaciones en que el estudiante figura como integrante del grupo que presenta */
    Object.values(D.est).forEach(s=>{ const n = sinTildes(s.nombre), recibidas = (D.coev || []).filter(r=> r.integrantes.split(/[,;]/).map(sinTildes).some(x=> x && (x === n || n.includes(x) || x.includes(n))));
      s.coevRecibidas = recibidas.map(r=> r.promedio); if(recibidas.length && s.notas.particip === undefined) s.notas.particip = r1(recibidas.reduce((a,r)=> a + r.promedio, 0)/recibidas.length); });
  }
  const valor = x=> x === undefined || x === null || x === "" ? null : Number(x);
  function definitiva(s){ const v = { taller:valor(s.notas.taller), ficha1:valor(s.notas.ficha1), ficha2:valor(s.notas.ficha2), practica:valor(s.notas.practica), particip:valor(s.notas.particip) };
    return Object.values(v).some(x=> x === null || !isFinite(x)) ? null : window.AULA.notaDefinitiva(v).nota; }
  function pinta(){
    tabla.innerHTML = ""; const ests = Object.values(D.est).sort((a,b)=> a.nombre.localeCompare(b.nombre, "es"));
    if(!ests.length){ tabla.appendChild(el("p",{class:"muted"},["Aún no hay archivos cargados."])); return; }
    const t = el("table",{class:"cmp-table doc-tab"}), tb = el("tbody");
    t.appendChild(el("thead",null,[ el("tr",null, ["Estudiante","Grupo","Taller (40 %)","Ficha 1 o síntesis (15 %)","Ficha 2 o avance (15 %)","Práctica (15 %)","Participación (15 %)","Definitiva",""].map(x=> el("th",{scope:"col"},[x]))) ]));
    ests.forEach(s=>{
      const celda = (k, sug)=>{ const i = el("input",{type:"text", inputmode:"decimal", value:s.notas[k] === undefined ? "" : String(s.notas[k]).replace(".", ","), "aria-label":k + " de " + s.nombre, placeholder:sug || "—"});
        i.addEventListener("change", ()=>{ const x = i.value.trim() === "" ? undefined : parseFloat(i.value.replace(",", ".")); if(x !== undefined && (!isFinite(x) || x < 0 || x > 5)){ i.setAttribute("aria-invalid","true"); return; } i.removeAttribute("aria-invalid"); if(x === undefined) delete s.notas[k]; else s.notas[k] = x; guarda(); pinta(); });
        return el("td",null,[i]); };
      const ver = el("button",{type:"button", class:"btn btn-sm"},["Ver y calificar"]); ver.addEventListener("click", ()=> muestra(s));
      const def = definitiva(s);
      tb.appendChild(el("tr",null,[ el("th",{scope:"row"},[s.nombre, s.codigo ? el("span",{class:"eje"},[s.codigo]) : null]), el("td",null,[s.grupo]),
        celda("taller", s.evaluacion ? "mejor de " + s.evaluacion.intentos : ""), celda("ficha1"), celda("ficha2"), celda("practica"), celda("particip", s.coevRecibidas.length ? s.coevRecibidas.length + " coev." : ""),
        el("td",{class:"doc-def"},[def === null ? "Faltan notas" : fmt(def, 1)]), el("td",null,[ver]) ]));
    });
    t.appendChild(tb); tabla.appendChild(el("div",{class:"table-wrap"},[t]));
    const noInt = D.archivos.filter(a=> !a.integro).length;
    tabla.appendChild(el("p",{class:"muted small"},[D.archivos.length + " archivos cargados" + (noInt ? "; " + noInt + " con código de verificación que no coincide" : "") + ". El código delata cambios casuales en un archivo, pero no es una firma segura: ante una duda, pide al estudiante que repita la evidencia. " + (A.evaluacion.notaMinima === null ? "La nota mínima de aprobación se confirma con el reglamento de posgrado." : "")]));
  }
  function muestra(s){
    detalle.innerHTML = "";
    detalle.appendChild(el("h4",null,[s.nombre + " · " + s.grupo]));
    if(s.diagnostico) detalle.appendChild(el("p",null,["Diagnóstico: " + s.diagnostico.aciertos + " de " + s.diagnostico.n + " (sin nota)."]));
    if(s.evaluacion) detalle.appendChild(el("p",null,["Evaluación: " + s.evaluacion.intentos + " intentos; mejor nota " + fmt(s.evaluacion.mejor, 1) + "."]));
    ["1","2"].forEach(n=>{ const fi = s.fichas[n]; if(!fi) return; const d = fi.datos;
      const box = el("article",{class:"card"},[ el("h5",null,["Ficha " + n + ": " + (d.articuloCita || "")]),
        el("p",null,["PICO: P " + (d.picoP || "—") + "; I " + (d.picoI || "—") + "; C " + (d.picoC || "—") + "; O " + (d.picoO || "—") + "."]),
        el("p",null,["Diseño: " + (d.diseno || "—") + " (" + (d.guia || "") + "; " + (d.herramienta || "") + ")."]),
        el("ul",null, (d.dominios || []).map(dm=> el("li",null,[dm + ": " + ((d.sesgos || {})[dm] || {}).j + " — " + (((d.sesgos || {})[dm] || {}).t || "sin justificación")]))),
        el("p",null,["Resultado: " + (d.medida || "—") + " " + (d.valor || "") + ". " + (d.interpreta || "")]),
        el("p",null,["Aplicabilidad: " + (d.aplica || "—") + " Conclusión: " + (d.conclusion || "—")]),
        el("p",{class:"muted small"},["Integrantes: " + (d.integrantes || "—")]) ]);
      const rg = el("div",{class:"nota-form"}), rub = fi.rubrica || {};
      E.rubricaFicha.forEach(c=>{ const i = el("input",{type:"text", inputmode:"decimal", value:rub[c.id] === undefined ? "" : String(rub[c.id]).replace(".", ","), placeholder:"0,0 a 5,0"});
        i.addEventListener("change", ()=>{ const x = parseFloat(i.value.replace(",", ".")); if(!isFinite(x) || x < 0 || x > 5){ i.setAttribute("aria-invalid","true"); return; } i.removeAttribute("aria-invalid"); fi.rubrica = Object.assign(fi.rubrica || {}, { [c.id]:x });
          const vals = E.rubricaFicha.map(cc=> fi.rubrica[cc.id]).filter(v=> isFinite(v)); if(vals.length === E.rubricaFicha.length){ s.notas["ficha" + n] = r1(vals.reduce((a,b)=> a + b, 0)/vals.length); } guarda(); pinta(); });
        rg.appendChild(el("label",null,[c.t + ": " + c.d, i])); });
      box.appendChild(el("p",{class:"muted"},["Rúbrica (la nota de la ficha es el promedio de los cuatro criterios):"])); box.appendChild(rg); detalle.appendChild(box); });
    if(s.practica){ const d = s.practica; detalle.appendChild(el("article",{class:"card"},[ el("h5",null,["Práctica con árbol y Mendeley"]), el("p",null,["Artículo: " + (E.articulos.find(a=> a.id === d.articulo) || {}).corto + ". Clasificó: " + (d.diseno || "—") + " (correcto: " + d.disenoCorrecto + ")."]),
      el("p",null,["Mendeley: " + (d.checks || []).filter(Boolean).length + " de " + E.mendeley.length + " pasos; " + (d.nref || 0) + " referencias. Nota sugerida " + fmt(d.sugerida, 1) + "."]), d.biblio ? el("pre",{class:"out"},[d.biblio]) : null ])); }
    if(s.proyecto){ const d = s.proyecto; detalle.appendChild(el("article",{class:"card"},[ el("h5",null,["Entregables de segundo año: " + (d.titulo || "")]),
      el("p",null,["Protocolo: " + d.protocolo.hechos + " de " + d.protocolo.total + ". Avance: " + d.avance.hechos + " de " + d.avance.total + "."]),
      d.enlace1 ? el("p",null,[ el("a",{href:d.enlace1, target:"_blank", rel:"noopener noreferrer"},["Síntesis de Proyecto I"]) ]) : null, d.enlace2 ? el("p",null,[ el("a",{href:d.enlace2, target:"_blank", rel:"noopener noreferrer"},["Avance de Proyecto II"]) ]) : null,
      el("p",{class:"muted small"},["En segundo año, escribe la nota de la síntesis en la columna «Ficha 1 o síntesis» y la del avance en «Ficha 2 o avance»."]) ])); }
    detalle.scrollIntoView({ behavior:"smooth", block:"start" });
  }
  exp.addEventListener("click", ()=>{ const ests = Object.values(D.est); if(!ests.length) return alert("No hay notas para descargar.");
    M.downloadCSV("notas_lectura_critica_" + new Date().toISOString().slice(0,10) + ".csv", ["Estudiante","Código","Grupo","Taller","Ficha 1 o síntesis","Ficha 2 o avance","Práctica","Participación","Nota definitiva"],
      ests.map(s=>{ const d = definitiva(s); return [s.nombre, s.codigo, s.grupo, s.notas.taller, s.notas.ficha1, s.notas.ficha2, s.notas.practica, s.notas.particip, d === null ? "" : d].map(v=> v === undefined ? "" : v); })); });
  resp.addEventListener("click", ()=> descargar({ app:"aula-ic-docente", fecha:new Date().toISOString(), datos:D }, "respaldo_consolidador_" + new Date().toISOString().slice(0,10) + ".json"));
  borra.addEventListener("click", ()=>{ if(confirm("Se borrarán todos los archivos cargados y las notas de este navegador. Descarga antes un respaldo si lo necesitas. ¿Continuar?")){ store.del(DOC_KEY); D.est = {}; D.archivos = []; D.coev = []; detalle.innerHTML = ""; avisos.innerHTML = ""; pinta(); } });
  pinta();
}

window.AULA_FORM = { evaluar, articulos, formularios, docente, PREGUNTAS, sortear, huella, verifica, empaqueta, raDe };
})();

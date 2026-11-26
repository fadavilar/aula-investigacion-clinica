/* Motor del explorador académico (sin dependencias). No se edita por proyecto: se usa como window.Motor.
   Extraído de AutismoColombia (https://github.com/fadavilar/AutismoColombia, CC0 1.0).
   Documentación: references/arquitectura-js.md, graficos-legibles.md y dinamica-sistemas.md de la skill. */
(function(){
"use strict";
const SVGNS = "http://www.w3.org/2000/svg";

/* ================================================================ utilidades */
function el(tag, attrs, children){
  const node = document.createElement(tag);
  if(attrs){ Object.keys(attrs).forEach(k=>{
    if(attrs[k] === null || attrs[k] === undefined || attrs[k] === false) return;
    if(k === "class") node.setAttribute("class", attrs[k]);
    else if(k === "html") node.innerHTML = attrs[k];
    else if(k.startsWith("on") && typeof attrs[k] === "function") node.addEventListener(k.slice(2), attrs[k]);
    else node.setAttribute(k, attrs[k]);
  }); }
  (children||[]).forEach(c=>{ if(c !== null && c !== undefined && c !== false) node.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c); });
  return node;
}
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function fmt(n, dec){
  if(n === null || n === undefined || isNaN(n)) return "n.d.";
  const d = dec === undefined ? 0 : dec;
  return Number(n).toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/^-/, "−");
}
/* Los gráficos se dibujan a la medida de la pantalla: VW(escritorio, móvil) elige dimensiones. */
const MOB = ()=> window.innerWidth <= 640;
const VW = (d, m)=> MOB() ? m : d;
function compact(v){ return v >= 1e6 ? fmt(v/1e6,1) + " M" : v >= 1e4 ? fmt(v/1e3,0) + " mil" : fmt(v); }
function svgEl(w, h, cls, label){
  const s = document.createElementNS(SVGNS, "svg");
  s.setAttribute("viewBox", "0 0 " + w + " " + h);
  s.setAttribute("class", "chart-svg " + (cls||"") + (w >= 600 && !/map-svg|size-legend|story-svg/.test(cls||"") ? " wide-svg" : ""));
  s.setAttribute("role", "img");
  if(label) s.setAttribute("aria-label", label);
  return s;
}
function niceStep(raw){
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
}
function niceMax(v){
  if(v <= 0) return 1;
  const st = niceStep(v / 5);
  return Math.ceil(v / st - 1e-9) * st;
}
function ticks(max){
  const st = niceStep(max / 5);
  const out = []; for(let t=0; t <= max + st*1e-6; t += st) out.push(+t.toFixed(6)); return out;
}
function sourceLine(text){ return el("p",{class:"chart-source"},[text]); }
function callout(text, kind){ return el("div",{class:"callout " + (kind||"")},[text]); }
function confidenceTag(level){
  const L = { verificado:"Verificado en fuente pública", "nota-autor":"Lectura del equipo", pendiente:"Pendiente de verificación", preliminar:"Resultado preliminar" };
  return el("span",{class:"confidence-tag confidence-"+level, title:"Procedencia del dato: "+(L[level]||level)},[L[level]||level]);
}
function scrollSoon(id){
  // La sección se abre con una transición de altura; mientras dura, la página aún no tiene su
  // altura final y el desplazamiento se queda corto (caía en el encabezado). Al navegar a un
  // elemento concreto se despliega su sección sin animación y luego se desplaza.
  const t = document.getElementById(id), it = t && t.closest(".acc-item");
  if(it){ it.classList.add("instant"); void it.offsetHeight; }
  scrollToId(id);
  window.setTimeout(()=>{ if(it) it.classList.remove("instant"); scrollToId(id); }, 350);
}
function scrollToId(id){
  const t = document.getElementById(id); if(!t) return;
  const y = t.getBoundingClientRect().top + window.scrollY - 86;
  window.scrollTo({ top: y, behavior: "smooth" });
}
function downloadCSV(filename, header, rows){
  const lines = [header.join(";")].concat(rows.map(r=> r.map(v=>{
    if(v === null || v === undefined) return "";
    const s = typeof v === "number" ? String(v).replace(".", ",") : String(v);
    return /[;"\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
  }).join(";")));
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = el("a",{ href: URL.createObjectURL(blob), download: filename });
  document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 400);
}
function lowFirst(t){ return t.charAt(0).toLowerCase() + t.slice(1); }
function wrapText(t, n){ const words = t.split(" "), out = []; let cur = ""; words.forEach(w=>{ if((cur + " " + w).trim().length > n && cur){ out.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }); if(cur) out.push(cur); return out.slice(0,4); }

/* ================================================================ fichas: recuadro con cursor, ficha fija al tocar, resaltado conjunto */
const tip = el("div",{ class:"chart-tip", role:"tooltip", hidden:"" });
document.body.appendChild(tip);
let lastPointer = "mouse";
document.addEventListener("pointerdown", e=>{ lastPointer = e.pointerType || "mouse"; if(!tip.hidden && tip.classList.contains("sheet") && !tip.contains(e.target) && !(e.target.closest && e.target.closest("[data-tip]"))) closeTip(); }, true);
const useSheet = ()=> lastPointer === "touch" || MOB();
function showTip(html, evt, anchor){
  if(tip.classList.contains("sheet")) return;
  tip.innerHTML = html; tip.hidden = false;
  let x, y;
  if(evt && evt.clientX !== undefined && evt.type !== "focus"){ x = evt.clientX; y = evt.clientY; }
  else if(anchor){ const r = anchor.getBoundingClientRect(); x = r.left + r.width/2; y = r.top; }
  else return;
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  let left = x + 16, top = y - th - 14;
  if(left + tw > window.innerWidth - 8) left = x - tw - 16;
  if(left < 8) left = 8;
  if(top < 8) top = Math.min(y + 20, window.innerHeight - th - 8);
  tip.style.left = left + "px"; tip.style.top = top + "px";
}
/* En pantallas táctiles la ficha se fija abajo y no se cierra al desplazarse ni al redibujar el gráfico. */
function pinTip(html){
  tip.classList.add("sheet"); tip.style.left = ""; tip.style.top = "";
  tip.innerHTML = html; tip.hidden = false;
  const b = el("button",{type:"button", class:"tip-close", "aria-label":"Cerrar la ficha"},["×"]);
  b.addEventListener("click", closeTip); tip.appendChild(b);
}
function closeTip(){ tip.classList.remove("sheet"); tip.hidden = true; }
function hideTip(){ if(!tip.classList.contains("sheet")) tip.hidden = true; }
function bindTip(node, htmlFn){
  node.setAttribute("data-tip","1");
  node.addEventListener("mousemove", e=>{ if(lastPointer !== "touch" && !MOB()) showTip(htmlFn(), e); });
  node.addEventListener("mouseleave", hideTip);
  node.addEventListener("focus", e=>{ if(node.matches(":focus-visible") && lastPointer !== "touch" && !MOB()) showTip(htmlFn(), e, node); });
  node.addEventListener("blur", hideTip);
  node.addEventListener("click", e=>{ if(useSheet()) setTimeout(()=> pinTip(htmlFn()), 0); else setTimeout(()=> showTip(htmlFn(), e), 0); });
}
window.addEventListener("scroll", hideTip, { passive:true });
/* Resaltado conjunto: al pasar por una entidad (data-cod) se destaca en todos los gráficos visibles. */
let hovCod = null;
function hoverCod(cod){
  if(cod === hovCod) return;
  if(hovCod) document.querySelectorAll('.hov').forEach(n=> n.classList.remove("hov"));
  hovCod = cod;
  if(cod) document.querySelectorAll('[data-cod="'+cod+'"]').forEach(n=> n.classList.add("hov"));
}
document.addEventListener("mouseover", e=>{ const t = e.target.closest && e.target.closest("[data-cod]"); hoverCod(t ? t.getAttribute("data-cod") : null); });


/* ================================================================ selección compartida entre gráficos */
const STATE = { sel:null, listeners:[] };
function onSelect(f){ STATE.listeners.push(f); }
function select(cod){ if(CFG.entidad && CFG.entidad.valida && !CFG.entidad.valida(cod)) return; STATE.sel = cod; STATE.listeners.forEach(f=> f(cod)); }

/* ================================================================ tema y tamaño del texto (clave de almacenamiento: <html data-app>) */
const APPKEY = document.documentElement.getAttribute("data-app") || "explorador";
const THEME_KEY = APPKEY + "_theme";
function applyTheme(mode){
  if(mode === "light" || mode === "dark") document.documentElement.setAttribute("data-theme", mode);
  else document.documentElement.removeAttribute("data-theme");
}
function currentTheme(){
  const a = document.documentElement.getAttribute("data-theme");
  if(a) return a;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
try{ applyTheme(localStorage.getItem(THEME_KEY)); }catch(e){}
const TEXT_KEY = APPKEY + "_text", TEXT_SIZES = [ { k:"0", l:"Normal", p:"100 %" }, { k:"1", l:"Grande", p:"115 %" }, { k:"2", l:"Muy grande", p:"130 %" }, { k:"3", l:"Máximo", p:"150 %" } ];
function applyTextSize(k){ if(!TEXT_SIZES.some(t=> t.k === k)) k = "0"; document.documentElement.setAttribute("data-text", k); try{ localStorage.setItem(TEXT_KEY, k); }catch(e){} document.querySelectorAll(".ts-opt").forEach(b=> b.setAttribute("aria-pressed", b.dataset.k === k ? "true" : "false")); }
try{ const k0 = localStorage.getItem(TEXT_KEY); if(k0) document.documentElement.setAttribute("data-text", k0); }catch(e){}
function stepTextSize(d){ const cur = +(document.documentElement.getAttribute("data-text") || 0); applyTextSize(String(Math.max(0, Math.min(3, cur + d)))); }
function toggleTheme(){
  const next = currentTheme() === "dark" ? "light" : "dark";
  applyTheme(next); try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
}


/* ================================================================ acordeón por partes */
function buildAccordion(){
  const root = document.getElementById("accordion");
  let acc = root, curPart;
  SECTIONS.forEach(s=>{
    if(s.part && s.part !== curPart){
      curPart = s.part; const P = PARTS.find(x=> x.id === s.part);
      root.appendChild(el("div",{class:"part-head part-"+P.id, id:"parte-"+P.id},[ el("span",{class:"part-k"},[P.k]), el("h2",null,[P.t]), el("p",null,[P.d]) ]));
      acc = el("div",{class:"part-group part-"+P.id}); root.appendChild(acc);
    }
    const header = el("button",{ class:"acc-header", type:"button", "aria-expanded": s.open ? "true":"false", "aria-controls":"panel-"+s.id },[
      el("span",{class:"num"},[s.num]),
      el("span",{class:"titles"},[ el("h3",null,[s.title]), el("span",{class:"sub"},[s.sub]) ]),
      el("span",{class:"chev", html:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>'})
    ]);
    const item = el("div",{ class:"acc-item" + (s.open ? " open":""), id:"sec-"+s.id },[
      header,
      el("div",{class:"acc-panel", id:"panel-"+s.id, role:"region"},[ el("div",null,[ el("div",{class:"acc-body", id:"body-"+s.id}) ]) ])
    ]);
    header.addEventListener("click", ()=> toggleSection(item, header));
    acc.appendChild(item);
  });
}
function toggleSection(item, header, force){
  const open = typeof force === "boolean" ? force : !item.classList.contains("open");
  item.classList.toggle("open", open);
  header.setAttribute("aria-expanded", open ? "true":"false");
  if(open) item.dispatchEvent(new CustomEvent("opened"));
}
function openSection(id){
  const item = document.getElementById("sec-"+id); if(!item) return;
  toggleSection(item, item.querySelector(".acc-header"), true);
}
function setAll(open){ document.querySelectorAll(".acc-item").forEach(i=> toggleSection(i, i.querySelector(".acc-header"), open)); }
function sub(body, id, title, subtitle){
  body.appendChild(el("h3",{id:id, class:"subsection-title"},[title]));
  if(subtitle) body.appendChild(el("p",{class:"subsection-subtitle"},[subtitle]));
}
function chips(options, active, onPick, label){
  const row = el("div",{class:"filter-row", role:"group", "aria-label": label||"Opciones"});
  options.forEach(o=>{
    const b = el("button",{ class:"filter-chip" + (o.id === active ? " active":""), type:"button", "aria-pressed": o.id === active ? "true":"false", "data-id": o.id },[o.label]);
    b.addEventListener("click", ()=>{
      row.querySelectorAll(".filter-chip").forEach(x=>{ x.classList.remove("active"); x.setAttribute("aria-pressed","false"); });
      b.classList.add("active"); b.setAttribute("aria-pressed","true");
      onPick(o.id);
    });
    row.appendChild(b);
  });
  return row;
}

/* ================================================================ estadística básica y lecturas */
function median(a){ const s = a.slice().sort((x,y)=>x-y), n = s.length; return n ? (n%2 ? s[(n-1)/2] : (s[n/2-1]+s[n/2])/2) : NaN; }
function ranks(a){
  const idx = a.map((v,i)=>[v,i]).sort((x,y)=> x[0]-y[0]); const r = new Array(a.length); let i = 0;
  while(i < idx.length){ let j = i; while(j+1 < idx.length && idx[j+1][0] === idx[i][0]) j++; const avg = (i+j)/2 + 1; for(let k=i;k<=j;k++) r[idx[k][1]] = avg; i = j+1; }
  return r;
}
function pearson(x, y){
  const n = x.length, mx = x.reduce((a,b)=>a+b,0)/n, my = y.reduce((a,b)=>a+b,0)/n; let sxy=0, sxx=0, syy=0;
  for(let i=0;i<n;i++){ sxy += (x[i]-mx)*(y[i]-my); sxx += (x[i]-mx)*(x[i]-mx); syy += (y[i]-my)*(y[i]-my); }
  return sxx && syy ? sxy/Math.sqrt(sxx*syy) : NaN;
}
function spearman(x, y){ return pearson(ranks(x), ranks(y)); }
function strength(r){ const a = Math.abs(r); return a >= 0.6 ? "fuerte" : a >= 0.4 ? "moderada" : a >= 0.2 ? "débil" : "prácticamente nula"; }
function joinNames(arr){ if(arr.length <= 1) return arr.join(""); return arr.slice(0,-1).join(", ") + " y " + arr[arr.length-1]; }
function reading(){ return el("div",{class:"reading", "aria-live":"polite"}); }
function setReading(node, html){
  // una idea por párrafo: la primera frase es la conclusión y las demás se agrupan de a dos
  const fr = html.replace(/([.?!])\s+(?=[A-ZÁÉÍÓÚÑ¿«])/g, "$1\u0001").split("\u0001"), rest = [];
  for(let i=1;i<fr.length;i+=2) rest.push(fr.slice(i,i+2).join(" "));
  node.innerHTML = '<span class="reading-k">Lectura del gráfico</span><p class="lead">' + fr[0] + '</p>' + (rest.length ? '<div class="reading-body' + (rest.length < 2 ? ' one' : '') + '">' + rest.map(x=> "<p>" + x + "</p>").join("") + "</div>" : "");
}
function howTo(text){ return el("p",{class:"howto"},[ el("strong",null,["¿Cómo leerlo? "]), text.charAt(0).toUpperCase() + text.slice(1) ]); }
function legend(items){ return el("div",{class:"legend"}, items.map(i=> el("span",{class:"legend-item"},[ el("span",{class:"legend-sw " + i[0]}), i[1] ]))); }
function quantileBreaks(vals, k){
  const v = vals.filter(x=> x !== null && !isNaN(x)).sort((a,b)=>a-b); const out = [];
  for(let i=1;i<k;i++) out.push(v[Math.min(v.length-1, Math.floor(i*v.length/k))]);
  return out;
}
function classOf(v, br){ if(v === null || v === undefined) return -1; let c = 0; while(c < br.length && v >= br[c]) c++; return c; }
function pathCenter(path){ const n = path.match(/-?\d+(\.\d+)?/g).map(Number); let x = 0, y = 0, k = 0; for(let i=0;i+1<n.length;i+=2){ x += n[i]; y += n[i+1]; k++; } return [x/k, y/k]; }
function niceRef(v){ const p = Math.pow(10, Math.floor(Math.log10(v))); const m = v/p; return (m>=5?5:m>=2?2:1)*p; }

/* ================================================================ herramientas de cada gráfico y ampliación */
function zoomDialog(){
  let dlg = document.getElementById("zoom-dlg"); if(dlg) return dlg;
  dlg = el("dialog",{id:"zoom-dlg", class:"zoom-dlg", "aria-label":"Gráfico ampliado"});
  const close = el("button",{type:"button", class:"btn zoom-close"},["Cerrar"]);
  dlg.appendChild(el("div",{class:"zoom-head"},[ el("strong",{id:"zoom-title"},[""]), close ]));
  dlg.appendChild(el("div",{class:"zoom-body", id:"zoom-body"}));
  close.addEventListener("click", ()=> dlg.close());
  dlg.addEventListener("click", e=>{ if(e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", ()=>{ if(dlg._home){ dlg._home.after(dlg._box); dlg._home.remove(); dlg._home = null; } closeTip(); document.body.appendChild(tip); if(dlg._btn) dlg._btn.focus(); });
  document.body.appendChild(dlg); return dlg;
}
function titleFor(node){
  let n = node;
  while(n && !(n.classList && n.classList.contains("acc-body"))){
    let p = n.previousElementSibling;
    while(p){ if(p.matches && p.matches(".subsection-title, h4.chart-title")) return p.textContent; p = p.previousElementSibling; }
    n = n.parentElement;
  }
  const it = node.closest(".acc-item"); return it ? it.querySelector("h3").textContent : "Gráfico";
}
function addChartTools(){
  document.querySelectorAll("#accordion .chart-box, #accordion .diagram-wrap").forEach(box=>{
    if(!box.querySelector("svg.chart-svg")) return;
    const dept = !!box.querySelector("[data-cod]"), any = !!box.querySelector("[data-tip]");
    const ent = (CFG.entidad && CFG.entidad.nombre) || "elemento", hint = !any ? "" : MOB() ? (dept ? "Toca un " + ent + " para ver sus datos" : "Toca un elemento para ver sus datos") : (dept ? "Pasa el cursor para ver los datos; haz clic para seleccionar el " + ent + " en todos los gráficos" : "Pasa el cursor por cada elemento para ver sus datos");
    const b = el("button",{type:"button", class:"btn zoom-btn"},["Ampliar"]);
    const wrap = el("div",{class:"chart-wrap"}), tools = el("div",{class:"chart-tools"},[ el("span",{class:"chart-hint"},[hint]), b ]);
    box.replaceWith(wrap); wrap.appendChild(tools); wrap.appendChild(box);
    b.addEventListener("click", ()=>{
      const dlg = zoomDialog(); dlg._box = box; dlg._btn = b; dlg._home = document.createComment("gráfico");
      const ph = el("span",{hidden:""}); box.before(ph); dlg._home = ph;
      document.getElementById("zoom-title").textContent = titleFor(wrap);
      const zb = document.getElementById("zoom-body"); zb.innerHTML = ""; zb.appendChild(box);
      dlg.appendChild(tip); closeTip(); dlg.showModal();
    });
  });
}

/* ================================================================ relato por pasos (scrollytelling) */
/* pasos: [{ t, d, sec, cap, draw:()=>svg, legend:()=>nodo, note, pal }] */
function story(body, pasos){
  const host = body.closest(".acc-item"); if(host) host.classList.add("story-host");
  const wrap = el("div",{class:"story"}), gr = el("div",{class:"story-graphic", role:"group", "aria-label":"Gráfico del paso activo"}), box = el("div",{class:"story-steps"});
  const frames = pasos.map((f,i)=>{ const fig = el("figure",{class:"story-frame" + (f.pal ? " pal-" + f.pal : "") + (i===0?" on":"")},[ el("figcaption",{class:"story-cap"},[f.cap]) ]); fig.appendChild(f.draw()); if(f.legend) fig.appendChild(f.legend()); fig.appendChild(el("p",{class:"story-note"},[f.note||""])); gr.appendChild(fig); return fig; });
  const steps = pasos.map((st,i)=>{
    const b = st.sec ? el("button",{type:"button", class:"finding-link"},["Ver el análisis completo"]) : null;
    if(b) b.addEventListener("click", ()=>{ openSection(st.sec); scrollSoon("sec-"+st.sec); });
    const sec = el("section",{class:"story-step" + (i===0?" on":""), "data-i":String(i), "aria-label":"Paso " + (i+1) + " de " + pasos.length},[ el("div",{class:"story-card"},[ el("span",{class:"story-n"},["Paso " + (i+1) + " de " + pasos.length]), el("h4",null,[st.t]), el("p",null,[st.d]), b ]) ]);
    box.appendChild(sec); return sec;
  });
  if(MOB()){ // en el celular cada paso lleva su gráfico debajo del texto, para poder tocarlo
    wrap.classList.add("story-stack");
    steps.forEach((st,i)=>{ frames[i].classList.add("on"); st.classList.add("on"); st.appendChild(frames[i]); });
    wrap.appendChild(box); body.appendChild(wrap); return;
  }
  wrap.appendChild(gr); wrap.appendChild(box); body.appendChild(wrap);
  const setActive = i=>{ frames.forEach((f,j)=> f.classList.toggle("on", j===i)); steps.forEach((s,j)=> s.classList.toggle("on", j===i)); };
  if("IntersectionObserver" in window){ const io = new IntersectionObserver(es=> es.forEach(e=>{ if(e.isIntersecting) setActive(+e.target.dataset.i); }), { rootMargin:"-50% 0px -40% 0px" }); steps.forEach(st=> io.observe(st)); }
  steps.forEach(st=> st.addEventListener("focusin", ()=> setActive(+st.dataset.i)));
}

/* ================================================================ dinámica de sistemas */
function sdForm(e, w, h){
  const F = { s: x=> 1/(1+Math.exp(-11*(x-.5))), sat: x=> (1-Math.exp(-3.4*x))/(1-Math.exp(-3.4)), cong: x=> (1/(1.06-x)-1/1.06)/(1/.06-1/1.06), dec: x=> 1-Math.exp(-3.4*x), umb: x=> 1/(1+Math.exp(-26*(x-.58))), esc: x=> Math.min(1, Math.floor(x*4.2)/4), min: x=> Math.min(1, x/.55), prop: x=> x }[e.f];
  let d = ""; const p = 6;
  for(let i=0;i<=60;i++){ const x = i/60; let y = F(x); if(e.f === "dec") y = 1 - y; else if(e.s === "−") y = e.mx ? F(1-x) : 1 - y; d += (i ? "L" : "M") + (p + x*(w-2*p)).toFixed(1) + "," + (h - p - y*(h-2*p)).toFixed(1); }
  const s = document.createElementNS(SVGNS,"svg"); s.setAttribute("viewBox","0 0 "+w+" "+h); s.setAttribute("width",w); s.setAttribute("height",h); s.setAttribute("class","sd-spark"); s.setAttribute("aria-hidden","true");
  s.innerHTML = '<path d="M'+p+',2 V'+(h-p)+' H'+(w-2)+'" class="sd-spark-ax"/><path d="'+d+'" class="sd-spark-ln"/>';
  return s;
}
/* G: modelo con la forma de js/dinamica.js (ver references/dinamica-sistemas.md) */
function sdDiagram(body, G){
  const N = {}; G.nodos.forEach(n=> N[n.id] = n);
  const CEN = G.nodos.find(n=> n.k === "centro"), W = G.ancho || 1420, H = G.alto || 1000, CH = 9.4, Y0 = CEN.y;
  // aristas de flujo (tuberías) tratadas también como relaciones del bucle
  const PIPES = G.tuberias || [];
  const isLoopEdge = (b, de, a)=> b.v.some((v,i)=> v === de && b.v[(i+1)%b.v.length] === a);
  let loop = null, mode = "todo";
  body.appendChild(howTo("los rectángulos son niveles: se llenan y se vacían. Las válvulas son flujos. Las flechas curvas son influencias: «+» significa que las dos variables cambian en el mismo sentido y «−», en sentido contrario. Las dos rayas sobre una flecha indican una demora. R es un bucle de refuerzo (se amplifica) y B, uno de balance (se frena o se regula). ▲ marca un facilitador y ▼ una barrera."));
  const loopRow = el("div",{class:"filter-row sd-loops", role:"group", "aria-label":"Recorrer un bucle"});
  const mkChip = (id, label, cls)=>{ const b = el("button",{type:"button", class:"filter-chip " + (cls||"") + (id === null ? " active" : ""), "aria-pressed": id === null ? "true":"false", "data-loop": id || ""},[label]); b.addEventListener("click", ()=> setLoop(id)); loopRow.appendChild(b); return b; };
  mkChip(null, "Todo el sistema"); G.bucles.forEach(b=> mkChip(b.id, b.id + " · " + b.t, "sd-chip-" + b.tipo));
  body.appendChild(loopRow);
  body.appendChild(chips([{id:"todo",label:"Facilitadores y barreras"},{id:"f",label:"▲ Solo facilitadores"},{id:"b",label:"▼ Solo barreras"},{id:"no",label:"Ocultar ambos"}], mode, id=>{ mode = id; paint(); }, "Mostrar facilitadores y barreras"));
  const s = svgEl(W, H, "sd-svg story-svg", G.titulo || "Diagrama de dinámica de sistemas");
  let defs = "<defs>";
  [["p","sd-mp"],["n","sd-mn"],["f","sd-mf"],["b","sd-mb"],["k","sd-mk"]].forEach(m=>{ defs += '<marker id="sd-'+m[0]+'" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="'+(m[0]==="k"?5:8)+'" markerHeight="'+(m[0]==="k"?5:8)+'" orient="auto" markerUnits="'+(m[0]==="k"?"strokeWidth":"userSpaceOnUse")+'"><path d="M0,0 L10,5 L0,10 z" class="'+m[1]+'"/></marker>'; });
  s.innerHTML = defs.replace(/markerWidth="8" markerHeight="8"/g,'markerWidth="15" markerHeight="15"') + "</defs>";
  const mk = (cls, html)=>{ const g = document.createElementNS(SVGNS,"g"); g.setAttribute("class",cls); g.innerHTML = html; s.appendChild(g); return g; };
  const dims = n=>{ if(n.k === "flujo") return { hw:26, hh:26 }; if(n.h) return { hw:n.w/2, hh:n.h/2 }; n.L = wrapText(n.t, Math.floor((n.w-12)/CH)); return { hw:n.w/2, hh:(n.L.length*22+18)/2 }; };
  G.nodos.forEach(n=>{ n.D = dims(n); });
  const clip = (n, px, py, gap)=>{ const dx = px-n.x, dy = py-n.y, hw = n.D.hw + gap, hh = n.D.hh + gap, t = Math.min(hw/Math.max(1e-6,Math.abs(dx)), hh/Math.max(1e-6,Math.abs(dy))); return [n.x+dx*Math.min(t,1), n.y+dy*Math.min(t,1)]; };
  const curve = (a, b, bend, g1, g2)=>{ const mx = (a.x+b.x)/2, my = (a.y+b.y)/2, L = Math.hypot(b.x-a.x,b.y-a.y), cx = mx - (b.y-a.y)/L*bend*2, cy = my + (b.x-a.x)/L*bend*2, p = clip(a,cx,cy,g1), q = clip(b,cx,cy,g2); return { p:p, q:q, c:[cx,cy], at:t=>[(1-t)*(1-t)*p[0]+2*t*(1-t)*cx+t*t*q[0],(1-t)*(1-t)*p[1]+2*t*(1-t)*cy+t*t*q[1]], tan:t=>{ const x = 2*(1-t)*(cx-p[0])+2*t*(q[0]-cx), y = 2*(1-t)*(cy-p[1])+2*t*(q[1]-cy), l = Math.hypot(x,y)||1; return [x/l,y/l]; }, d:"M"+p[0].toFixed(1)+","+p[1].toFixed(1)+" Q"+cx.toFixed(1)+","+cy.toFixed(1)+" "+q[0].toFixed(1)+","+q[1].toFixed(1) }; };
  // tuberías: cada tramo une niveles y flujos en el orden de G.tuberias ["nivel","flujo"], ["flujo","nivel"]…
  const pipeEls = [];
  PIPES.forEach(p=>{ const A = N[p[0]], B = N[p[1]], last = B.k !== "flujo", x1 = A.k === "flujo" ? A.x : A.x + A.D.hw, x2 = B.k === "flujo" ? B.x : B.x - B.D.hw;
    const g = mk("sd-pipe",'<line x1="'+x1+'" x2="'+x2+'" y1="'+Y0+'" y2="'+Y0+'" class="sd-pipe-o"/><line x1="'+x1+'" x2="'+(x2-(last?6:0))+'" y1="'+Y0+'" y2="'+Y0+'" class="sd-pipe-i"/>' + (last ? '<path d="M'+(x2-15)+','+(Y0-14)+' L'+(x2-1)+','+Y0+' L'+(x2-15)+','+(Y0+14)+' z" class="sd-mk"/>' : ''));
    pipeEls.push({ g:g, de:p[0], a:p[1] }); });
  const detail = el("div",{class:"reading sd-detail", "aria-live":"polite"});
  const evTag = (o)=> "<span class='sd-ev ev-"+o.ev+"'>"+G.evid[o.ev]+"</span>" + (o.ref ? " <span class='muted small'>"+esc(G.refs[o.ref].t)+"</span>" : "");
  // influencias
  const edgeEls = G.aristas.map(e=>{
    const K = curve(N[e.de], N[e.a], e.b, 4, 10), sg = K.at(.84), tn = K.tan(.84), side = e.b >= 0 ? 1 : -1, m = K.at(.46), tm = K.tan(.46);
    const ox = sg[0] - tn[1]*18*-side*-1, oy = sg[1] + tn[0]*18*-side*-1;
    let h = '<path d="'+K.d+'" class="sd-hit"/><path d="'+K.d+'" class="sd-line" marker-end="url(#sd-'+(e.s === "+" ? "p" : "n")+')"/>';
    if(e.dm) h += [-5,5].map(o=> '<line x1="'+(m[0]+tm[0]*o-tm[1]*12)+'" y1="'+(m[1]+tm[1]*o+tm[0]*12)+'" x2="'+(m[0]+tm[0]*o+tm[1]*12)+'" y2="'+(m[1]+tm[1]*o-tm[0]*12)+'" class="sd-delay"/>').join("");
    h += '<circle cx="'+ox+'" cy="'+oy+'" r="12" class="sd-sign-bg"/><text x="'+ox+'" y="'+(oy+7)+'" text-anchor="middle" class="sd-sign">'+e.s+'</text>';
    const g = mk("sd-edge " + (e.s === "+" ? "pos" : "neg"), h); g.setAttribute("tabindex","0"); g.setAttribute("role","img"); g.setAttribute("aria-label", N[e.de].t + " a " + N[e.a].t + ", signo " + (e.s === "+" ? "positivo" : "negativo"));
    bindTip(g, ()=> "<h5>"+esc(N[e.de].t)+" → "+esc(N[e.a].t)+" ("+e.s+")</h5><p>"+esc(e.d)+"</p><p class='tip-ind'><b>"+G.formas[e.f].t+".</b> "+G.formas[e.f].d+(e.dm ? " Tiene una demora importante." : "")+"</p><p>"+evTag(e)+"</p>");
    return { g:g, e:e };
  });
  // facilitadores y barreras
  const facEls = G.factores.map(f=>{
    const w = f.t.length*8.2 + 34, n = { x:f.x, y:f.y, D:{ hw:w/2, hh:17 } }, K = curve(n, N[f.a], 10, 2, 8);
    const g = mk("sd-fac sd-fac-"+f.k,'<path d="'+K.d+'" class="sd-fline" marker-end="url(#sd-'+f.k+')"/><rect x="'+(f.x-w/2)+'" y="'+(f.y-17)+'" width="'+w+'" height="34" rx="17"/><text x="'+f.x+'" y="'+(f.y+6)+'" text-anchor="middle">'+(f.k==="f" ? "▲ " : "▼ ")+esc(f.t)+'</text>');
    g.setAttribute("tabindex","0"); g.setAttribute("role","button");
    const html = ()=> "<h5>"+(f.k==="f" ? "Facilitador: " : "Barrera: ")+esc(f.t)+"</h5><p>"+esc(f.d)+"</p><p class='tip-ind'>Actúa sobre: <b>"+esc(N[f.a].t)+"</b></p><p>"+evTag(f)+"</p>";
    bindTip(g, html);
    const pick = ()=>{ detail.innerHTML = '<span class="reading-k">'+(f.k==="f" ? "Facilitador" : "Barrera")+'</span><p class="lead">'+esc(f.t)+'</p><p>'+esc(f.d)+'</p><p>Actúa sobre: <strong>'+esc(N[f.a].t)+'</strong>. Participa así en: '+esc(G.bucles.filter(b=> b.v.includes(f.a)).map(b=> b.id + " " + b.t).join("; "))+'.</p><p>'+evTag(f)+(f.ref ? " · <a href='"+G.refs[f.ref].u+"' target='_blank' rel='noopener'>Ver la fuente</a>" : "")+'</p>'; };
    g.addEventListener("click", pick); g.addEventListener("keydown", e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); pick(); } });
    return { g:g, f:f };
  });
  // niveles, flujos y variables
  const nodeEls = G.nodos.map(n=>{
    let h = "";
    if(n.k === "flujo"){
      const L = wrapText(n.t, 16);
      h = '<circle cx="'+n.x+'" cy="'+n.y+'" r="27" class="sd-valve-bg"/><path d="M'+(n.x-17)+','+(n.y-14)+' L'+(n.x+17)+','+(n.y+14)+' V'+(n.y-14)+' L'+(n.x-17)+','+(n.y+14)+' z" class="sd-valve"/>' + L.map((t,i)=> '<text x="'+n.x+'" y="'+(n.up ? n.y-36-(L.length-1-i)*20 : n.y+50+i*20)+'" text-anchor="middle" class="sd-flow-t">'+esc(t)+'</text>').join("");
    } else {
      const L = n.L || wrapText(n.t, n.k === "centro" ? 19 : 17), fs = n.k === "centro" ? 27 : 22;
      h = '<rect x="'+(n.x-n.D.hw)+'" y="'+(n.y-n.D.hh)+'" width="'+(2*n.D.hw)+'" height="'+(2*n.D.hh)+'" rx="'+(n.k === "var" || n.k === "clave" ? 12 : 5)+'"/>' + L.map((t,i)=> '<text x="'+n.x+'" y="'+(n.y - (L.length-1)*fs/2 + i*fs + (n.k === "centro" ? -2 : 6))+'" text-anchor="middle">'+esc(t)+'</text>').join("") + (n.k === "centro" ? '<text x="'+n.x+'" y="'+(n.y+46)+'" text-anchor="middle" class="sd-sub">'+esc(n.sub||"")+'</text>' : "");
    }
    const g = mk("sd-node sd-"+n.k, h); g.setAttribute("tabindex","0"); g.setAttribute("role","button"); g.setAttribute("aria-label", n.t);
    bindTip(g, ()=> "<h5>"+esc(n.t)+"</h5><p>"+esc(n.d)+"</p><p>"+evTag(n)+"</p>");
    const pick = ()=>{
      const inn = G.aristas.filter(e=> e.a === n.id), out = G.aristas.filter(e=> e.de === n.id), fb = G.factores.filter(f=> f.a === n.id), bl = G.bucles.filter(b=> b.v.includes(n.id));
      const li = a=> "<ul class='sd-list'>" + a.join("") + "</ul>";
      detail.innerHTML = '<span class="reading-k">'+({ nivel:"Nivel", centro:"Nivel central", flujo:"Flujo", var:"Variable", clave:"Variable clave" }[n.k])+'</span><p class="lead">'+esc(n.t)+'</p><p>'+esc(n.d)+'</p>' +
        (inn.length ? "<p><strong>Lo afectan</strong></p>" + li(inn.map(e=> "<li>"+esc(N[e.de].t)+" ("+e.s+"): "+esc(e.d)+"</li>")) : "") + (out.length ? "<p><strong>Afecta a</strong></p>" + li(out.map(e=> "<li>"+esc(N[e.a].t)+" ("+e.s+"): "+esc(e.d)+"</li>")) : "") +
        (fb.length ? "<p><strong>Facilitadores y barreras</strong></p>" + li(fb.map(f=> "<li>"+(f.k==="f"?"▲ ":"▼ ")+esc(f.t)+"</li>")) : "") + "<p>Bucles: " + esc(bl.map(b=> b.id + " " + b.t).join("; ")) + ".</p><p>" + evTag(n) + "</p>";
      if(n.sec){ const b = el("button",{class:"finding-link", type:"button"},["Ver los datos de este factor"]); b.addEventListener("click", ()=>{ openSection(n.sec); scrollSoon("sec-"+n.sec); }); detail.appendChild(b); }
      decorate(detail);
      nodeEls.forEach(x=> x.g.classList.toggle("on", x.n === n));
    };
    g.addEventListener("click", pick); g.addEventListener("keydown", e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); pick(); } });
    return { g:g, n:n };
  });
  // insignias de bucle
  const badgeEls = G.bucles.map(b=>{
    const L = wrapText(b.t, 15);
    const g = mk("sd-badge sd-badge-"+b.tipo,'<circle cx="'+b.x+'" cy="'+b.y+'" r="25"/><path d="M'+(b.x-19)+','+(b.y-25)+' a31,31 0 1 1 -10,16" class="sd-turn" marker-end="url(#sd-'+(b.tipo==="R"?"p":"n")+')"/><text x="'+b.x+'" y="'+(b.y+7)+'" text-anchor="middle" class="sd-bid">'+b.id+'</text>' + L.map((t,i)=> '<text x="'+b.x+'" y="'+(b.y+53+i*18)+'" text-anchor="middle" class="sd-bt">'+esc(t)+'</text>').join(""));
    g.setAttribute("tabindex","0"); g.setAttribute("role","button"); g.setAttribute("aria-label","Bucle " + b.id + ", " + b.t);
    bindTip(g, ()=> "<h5>"+b.id+" · "+esc(b.t)+"</h5><p>"+(b.tipo==="R" ? "Bucle de refuerzo: el cambio se amplifica." : "Bucle de balance: el cambio se frena o se regula.")+"</p><p>"+esc(b.d)+"</p><p class='muted'>Clic para recorrerlo</p>");
    g.addEventListener("click", ()=> setLoop(b.id)); g.addEventListener("keydown", e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); setLoop(b.id); } });
    return { g:g, b:b };
  });
  function paint(){
    const b = loop ? G.bucles.find(x=> x.id === loop) : null;
    s.classList.toggle("has-loop", !!b);
    edgeEls.forEach(x=>{ const on = b && isLoopEdge(b, x.e.de, x.e.a); x.g.classList.toggle("on", !!on); x.g.classList.toggle("dim", !!b && !on); });
    pipeEls.forEach(x=>{ const on = b && isLoopEdge(b, x.de, x.a); x.g.classList.toggle("on", !!on); x.g.classList.toggle("dim", !!b && !on); });
    nodeEls.forEach(x=> x.g.classList.toggle("dim", !!b && !b.v.includes(x.n.id)));
    badgeEls.forEach(x=> x.g.classList.toggle("dim", !!b && x.b !== b));
    facEls.forEach(x=>{ const show = mode === "todo" || mode === x.f.k; x.g.style.display = show ? "" : "none"; x.g.classList.toggle("dim", !!b && !b.v.includes(x.f.a)); });
  }
  function setLoop(id){
    loop = id === loop ? null : id;
    loopRow.querySelectorAll(".filter-chip").forEach(c=>{ const on = (c.dataset.loop || null) === loop; c.classList.toggle("active", on); c.setAttribute("aria-pressed", on ? "true" : "false"); });
    nodeEls.forEach(x=> x.g.classList.remove("on"));
    paint();
    if(!loop){ detail.innerHTML = '<span class="reading-k">Lectura del diagrama</span><p class="lead">' + G.lectura[0] + '</p><div class="reading-body">' + G.lectura.slice(1).map(p=> "<p>"+p+"</p>").join("") + "</div>"; return; }
    const b = G.bucles.find(x=> x.id === loop);
    detail.innerHTML = "";
    detail.appendChild(el("span",{class:"reading-k"},["Bucle " + b.id + " · " + (b.tipo === "R" ? "de refuerzo: el cambio se amplifica" : "de balance: el cambio se frena o se regula")]));
    detail.appendChild(el("p",{class:"lead"},[b.t + ". " + b.d]));
    const ol = el("ol",{class:"sd-steps"});
    b.v.forEach((v,i)=>{
      const nx = b.v[(i+1)%b.v.length], e = G.aristas.find(x=> x.de === v && x.a === nx), sp = e ? sdForm(e, 72, 42) : null;
      ol.appendChild(el("li",null,[ el("div",{class:"sd-step-v"},[N[v].t]), el("div",{class:"sd-step-e"},[ sp || el("span",{class:"sd-flowmark"},["flujo"]), el("span",null,[ el("strong",null,[(e ? e.s : "+") + " "]), e ? e.d : (N[v].k === "nivel" ? "De este nivel sale el flujo siguiente." : "El flujo llena el nivel siguiente.") , e ? el("em",{class:"muted"},[" " + G.formas[e.f].t + (e.dm ? ", con demora" : "") + ". " + G.evid[e.ev] + "."]) : null ]) ]) ]));
    });
    detail.appendChild(ol);
    detail.appendChild(el("p",{class:"sd-back"},["↺ Y vuelve a empezar en «" + N[b.v[0]].t + "»."]));
    const fs = G.factores.filter(f=> b.v.includes(f.a)), col = (k,t)=> el("p",null,[ el("strong",null,[t + ": "]), fs.filter(f=> f.k === k).map(f=> lowFirst(f.t)).join("; ") || "ninguno en el modelo", "." ]);
    detail.appendChild(col("f","▲ Facilitadores que actúan aquí")); detail.appendChild(col("b","▼ Barreras que actúan aquí"));
    detail.appendChild(el("p",{class:"sd-lever"},[ el("strong",null,["¿Dónde se puede actuar? "]), b.p ]));
    decorate(detail);
  }
  body.appendChild(el("div",{class:"diagram-wrap sd-wrap"},[s]));
  body.appendChild(legend([["sd-l-stock","Nivel"],["sd-l-flow","Flujo (válvula)"],["sd-l-pos","Mismo sentido (+)"],["sd-l-neg","Sentido contrario (−)"],["sd-l-delay","Demora (‖)"],["sd-l-f","Facilitador (▲)"],["sd-l-b","Barrera (▼)"]]));
  body.appendChild(detail);
  loop = "x"; setLoop(null);
  const lt = el("button",{class:"btn a11y-list-toggle", type:"button", "aria-expanded":"false"},["Ver las relaciones como lista"]), lst = el("ul",{class:"a11y-list"}); lst.hidden = true;
  G.aristas.forEach(e=> lst.appendChild(el("li",null,[ el("div",{class:"a11y-title"},[N[e.de].t + " → " + N[e.a].t + " (" + e.s + ")" + (e.dm ? " · con demora" : "")]), el("div",{class:"a11y-meta"},[e.d + " " + G.formas[e.f].t + ". " + G.evid[e.ev] + "."]) ])));
  lt.addEventListener("click", ()=>{ lst.hidden = !lst.hidden; lt.setAttribute("aria-expanded", lst.hidden?"false":"true"); lt.textContent = lst.hidden ? "Ver las relaciones como lista" : "Ocultar la lista"; });
  body.appendChild(lt); body.appendChild(lst);
  // para la simulación: llena cada nivel (0 a 1) y escribe su valor
  return { svg:s, valor:(id, frac, txt)=>{
    const x = nodeEls.find(q=> q.n.id === id); if(!x || (x.n.k !== "nivel" && x.n.k !== "centro")) return;
    const n = x.n, w = 2*n.D.hw, h = 2*n.D.hh, f = Math.max(0, Math.min(1, frac)), r0 = x.g.querySelector("rect");
    let b = x.g.querySelector(".sd-fill"), t = x.g.querySelector(".sd-val");
    if(frac === null){ if(b){ b.remove(); if(n.k === "centro" && t){ t.textContent = t.dataset.ini || ""; t.classList.remove("sd-val"); } else if(t) t.remove(); } return; }
    if(!b){ b = document.createElementNS(SVGNS,"rect"); b.setAttribute("class","sd-fill"); r0.after(b); t = x.g.querySelector(".sd-sub") || document.createElementNS(SVGNS,"text"); if(t.dataset.ini === undefined) t.dataset.ini = t.textContent; t.setAttribute("class", (n.k === "centro" ? "sd-sub " : "") + "sd-val"); t.setAttribute("x", n.x); t.setAttribute("text-anchor","middle"); t.setAttribute("y", n.k === "centro" ? n.y+46 : n.y+n.D.hh+20); x.g.appendChild(t); }
    b.setAttribute("x", n.x-n.D.hw+3); b.setAttribute("width", w-6); b.setAttribute("y", n.y+n.D.hh-3-(h-6)*f); b.setAttribute("height", (h-6)*f); t.textContent = txt;
  } };
}
/* Listas de facilitadores y barreras, y tarjetas con la forma de cada relación */
function sdFactores(body, G){
  const two = el("div",{class:"sd-fb"});
  [["f","Facilitadores"],["b","Barreras"]].forEach(k=>{
    const ul = el("ul");
    G.factores.filter(f=> f.k === k[0]).forEach(f=>{ const tgt = G.nodos.find(n=> n.id === f.a), rf = f.ref ? G.refs[f.ref] : null;
      ul.appendChild(el("li",null,[ el("strong",null,[f.t]), el("span",{class:"sd-on"},["Actúa sobre: " + lowFirst(tgt.t)]), el("p",null,[f.d]), el("span",{class:"sd-ev ev-"+f.ev},[G.evid[f.ev]]), rf ? el("a",{href:rf.u, target:"_blank", rel:"noopener", class:"small"},[rf.t]) : null ])); });
    two.appendChild(el("div",{class:"sd-col sd-col-"+k[0]},[ el("h4",null,[(k[0]==="f" ? "▲ " : "▼ ") + k[1]]), ul ]));
  });
  body.appendChild(two);
}
function sdFormas(body, G){
  const fg = el("div",{class:"sd-forms"}), nm = id=> G.nodos.find(n=> n.id === id).t;
  Object.keys(G.formas).forEach(k=>{ const ex = G.aristas.filter(e=> e.f === k); if(!ex.length) return; const e0 = ex.find(e=> e.s === "+") || ex[0];
    fg.appendChild(el("article",{class:"sd-form"},[ sdForm(e0, 120, 70), el("div",null,[ el("h4",null,[G.formas[k].t]), el("p",null,[G.formas[k].d]), el("p",{class:"muted small"},["Ejemplo: " + lowFirst(nm(e0.de)) + " → " + lowFirst(nm(e0.a)) + "."]) ]) ])); });
  body.appendChild(fg);
}

/* ================================================================ portada, resumen estructurado, navegación y pie */
function renderHero(){
  const m = C.meta, $ = id=> document.getElementById(id);
  $("hero-framework").textContent = m.etiqueta || ""; $("hero-title").textContent = m.titulo; $("hero-lede").textContent = m.lede || ""; $("hero-period").textContent = m.corte || ""; $("wip-text").textContent = C.aviso || "";
  if(PARTS.length){ const strip = el("ol",{class:"thread", "aria-label":"Recorrido del documento"});
    PARTS.forEach(P=>{ const first = SECTIONS.find(x=> x.part === P.id); if(!first) return; const b = el("button",{type:"button", class:"thread-step part-"+P.id},[ el("span",{class:"thread-k"},[P.k]), el("strong",null,[P.t]), el("span",{class:"thread-d"},[P.d]) ]); b.addEventListener("click", ()=>{ openSection(first.id); scrollSoon("parte-"+P.id); }); strip.appendChild(el("li",null,[b])); });
    $("hero-lede").after(strip); }
  const top = el("div",{class:"hero-top"}), left = el("div",{class:"hero-left"}), right = el("div",{class:"hero-right"}), h1 = $("hero-title");
  h1.before(top); left.appendChild(h1); left.appendChild($("hero-lede"));
  const wip = document.querySelector(".wip-banner"); if(C.aviso) right.appendChild(wip); else wip.remove();
  $("byline").innerHTML = (C.equipoTitulo ? "<strong>" + esc(C.equipoTitulo) + "</strong>" : "") + "<ul class='byline-list'>" + (C.equipo||[]).map(p=> "<li>" + esc(p.nombre) + "<span class='role'>" + esc(p.rol) + "</span></li>").join("") + "</ul><span class='byline-inst'>" + esc(m.institucion||"") + (m.version ? " · " + esc(m.version) : "") + "</span>";
  right.appendChild($("byline")); top.appendChild(left); top.appendChild(right);
  (C.stats||[]).forEach(s=> $("stat-grid").appendChild(el("div",{class:"stat-card"},[ el("div",{class:"value"},[s.value]), el("div",{class:"label"},[s.label]), el("div",{class:"detail"},[s.detail]) ])));
}
/* Resumen: introducción, métodos, resultados y conclusiones. R.resultados: [{ t, d, sec }] */
function resumen(body, R, extraMetodos){
  const block = (id, title, kids)=> body.appendChild(el("section",{class:"abs-block", id:id, "aria-labelledby":id+"-t"},[ el("h3",{class:"abs-title", id:id+"-t"},[title]), el("div",{class:"abs-body"}, kids) ]));
  block("resumen-introduccion","Introducción", R.introduccion.map(p=> el("p",null,[p])));
  block("resumen-metodos","Métodos", R.metodos.map(p=>{ const k = p.indexOf(":"); return k > 0 && k < 40 ? el("p",null,[ el("strong",null,[p.slice(0,k+1)]), p.slice(k+1) ]) : el("p",null,[p]); }).concat(extraMetodos||[]));
  const ol = el("ol",{class:"abs-results"});
  R.resultados.forEach(h=>{ const b = h.sec ? el("button",{class:"finding-link", type:"button", "aria-label":"Ver el análisis de " + h.t},["Ver el análisis"]) : null; if(b) b.addEventListener("click", ()=>{ openSection(h.sec); scrollSoon("sec-"+h.sec); }); ol.appendChild(el("li",null,[ el("strong",null,[h.t + ". "]), h.d + " ", b ])); });
  block("resumen-resultados","Resultados",[ol]);
  block("resumen-conclusiones","Conclusiones",[ el("ul",{class:"abs-concl"}, R.conclusiones.map(c=> el("li",null,[c]))) ]);
}
/* Índice de preguntas agrupado por partes */
function recorrido(body){
  PARTS.forEach(P=>{ body.appendChild(el("h4",{class:"q-part part-"+P.id},[P.k + ": " + P.t])); const ql = el("ol",{class:"question-list part-"+P.id});
    SECTIONS.filter(s=> s.part === P.id).forEach(s=>{ const b = el("button",{type:"button", class:"q-link"},[ el("span",{class:"q-num"},[s.num]), s.title ]); b.addEventListener("click", ()=>{ openSection(s.id); scrollSoon("sec-"+s.id); }); ql.appendChild(el("li",null,[b, el("span",{class:"q-sub"},[s.sub])])); });
    body.appendChild(ql); });
}
/* Tabla comparativa: cab = encabezados; filas = [[rótulo, celda, celda…]] */
function tabla(cab, filas, cls){
  const t = el("table",{class:"cmp-table " + (cls||"")}), tb = el("tbody");
  t.appendChild(el("thead",null,[ el("tr",null, cab.map(x=> el("th",{scope:"col"},[x]))) ]));
  filas.forEach(f=> tb.appendChild(el("tr",null, f.map((c,i)=> el(i ? "td" : "th", i ? null : {scope:"row"}, [c]))))); t.appendChild(tb);
  return el("div",{class:"table-wrap"},[t]);
}
function renderFooter(){
  const m = C.meta, $ = id=> document.getElementById(id), L = C.licencia;
  $("year").textContent = String(new Date().getFullYear()); $("footer-disclaimer").textContent = C.descargo || C.aviso || "";
  $("footer-author").innerHTML = (C.equipo && C.equipo.length ? "Equipo: " + C.equipo.map(p=> "<strong>" + esc(p.nombre) + "</strong> (" + esc(p.rol) + ")").join(", ") + ". " : "") + "Elaboración: " + esc(m.autor) + (m.autorCred ? ", " + esc(lowFirst(m.autorCred)) : "") + (m.orcid ? " (<a href='" + m.orcid + "' target='_blank' rel='noopener'>ORCID</a>)" : "") + ".";
  const cc = $("cc-badge"); cc.href = L.url; cc.textContent = L.nombre; $("footer-license-text").textContent = L.texto || "";
}
function renderGlosario(){
  const body = document.getElementById("body-glosario");
  body.appendChild(el("p",null,["Definiciones de los términos que aparecen en el documento. En el texto, los términos subrayados con puntos muestran esta definición al pasar el cursor o el foco del teclado."]));
  const dl = el("dl",{class:"glossary"});
  C.glosario.slice().sort((a,b)=> a.t.localeCompare(b.t,"es")).forEach(g=>{
    dl.appendChild(el("dt",{id:"glos-"+g.id},[g.t]));
    dl.appendChild(el("dd",null,[ g.p ? el("strong",{class:"g-plain no-term"},["En pocas palabras: " + g.p + " "]) : null, g.d, el("span",{class:"g-ref"},[ "Referencia: ", g.url ? el("a",{href:g.url, target:"_blank", rel:"noopener"},[g.fuente]) : g.fuente ]) ]));
  });
  body.appendChild(dl);
}
function renderReferencias(){
  const body = document.getElementById("body-referencias");
  body.appendChild(el("p",null,["Literatura y normas citadas (formato Vancouver). Cada enlace lleva al DOI o al sitio oficial."]));
  const ol = el("ol",{class:"ref-list"});
  C.referencias.forEach(r=> ol.appendChild(el("li",null,[ r.c + " ", el("a",{href:r.url, target:"_blank", rel:"noopener"},[r.url.replace(/^https?:\/\//,"")]) ])));
  body.appendChild(ol);
}
let GLOS = {}, TERM_RE = [], NORM_RE = [];
function decorate(root){
  const nodes = root.querySelectorAll("p, li, dd, blockquote, .finding-card p, .reading p");
  nodes.forEach(n=>{
    if(n.closest(".glossary, .ref-list, .chart-tip, svg, .stat-card, .legend, .search-panel, .sources-panel") || n.dataset.dec) return;
    n.dataset.dec = "1";
    const scope = n.closest(".reading") || n.closest(".acc-body") || root;
    const used = scope.__terms || (scope.__terms = new Set());
    const walker = document.createTreeWalker(n, NodeFilter.SHOW_TEXT, { acceptNode: t=> t.parentNode.closest("a, button, .term, code, strong.no-term") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const texts = []; while(walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(tn=>{
      let node = tn;
      let guard = 0;
      while(node && guard++ < 12){
        const txt = node.nodeValue; let best = null;
        NORM_RE.forEach(nr=>{ const m = nr.re.exec(txt); if(m && (!best || m.index < best.m.index)) best = { m:m, kind:"norm", url:nr.url }; });
        TERM_RE.forEach(tr=>{ if(used.has(tr.id)) return; const m = tr.re.exec(txt); if(m && (!best || m.index < best.m.index)) best = { m:m, kind:"term", id:tr.id }; });
        if(!best) break;
        const after = node.splitText(best.m.index); const rest = after.splitText(best.m[0].length);
        let w;
        if(best.kind === "norm") w = el("a",{ href:best.url, target:"_blank", rel:"noopener", class:"norm-link", title:"Abrir el texto de la norma" },[after.nodeValue]);
        else { used.add(best.id); w = el("span",{ class:"term", tabindex:"0", "data-term":best.id, role:"button", "aria-label": after.nodeValue + ": ver definición" },[after.nodeValue]); }
        after.parentNode.replaceChild(w, after);
        node = rest;
      }
    });
  });
}
function initTerms(){
  const html = id=>{ const g = GLOS[id]; return "<h5>"+esc(g.t)+"</h5><p>"+esc(g.p || g.d)+"</p>"+(g.url?"<p class='muted'>Referencia: "+esc(g.fuente)+"</p>":"")+"<p class='muted'>Clic: ver en el glosario</p>"; };
  document.addEventListener("mouseover", e=>{ const t = e.target.closest && e.target.closest(".term"); if(t) showTip(html(t.dataset.term), e); });
  document.addEventListener("mousemove", e=>{ const t = e.target.closest && e.target.closest(".term"); if(t) showTip(html(t.dataset.term), e); });
  document.addEventListener("mouseout", e=>{ if(e.target.closest && e.target.closest(".term")) hideTip(); });
  document.addEventListener("focusin", e=>{ const t = e.target.closest && e.target.closest(".term"); if(t) showTip(html(t.dataset.term), e, t); });
  document.addEventListener("focusout", e=>{ if(e.target.closest && e.target.closest(".term")) hideTip(); });
  const go = t=>{ hideTip(); openSection("glosario"); const id = "glos-"+t.dataset.term; scrollSoon(id); const d = document.getElementById(id); if(d){ d.classList.add("flash"); setTimeout(()=> d.classList.remove("flash"), 2200); } };
  document.addEventListener("click", e=>{ const t = e.target.closest && e.target.closest(".term"); if(t) go(t); });
  document.addEventListener("keydown", e=>{ const t = e.target.closest && e.target.closest(".term"); if(t && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); go(t); } });
  // las lecturas se regeneran al filtrar: se decoran de nuevo
  const mo = new MutationObserver(muts=> muts.forEach(m=> m.target.closest && m.target.closest(".reading") && decorate(m.target.closest(".reading"))));
  readingObserver = mo; observeReadings();
}
let readingObserver = null;
function observeReadings(){ if(readingObserver) document.querySelectorAll(".reading").forEach(r=> readingObserver.observe(r, { childList:true })); }
function addSectionNav(){
  SECTIONS.forEach((s,i)=>{
    const body = document.getElementById("body-"+s.id); if(!body) return;
    if(CLAVES[s.id]) body.insertBefore(el("p",{class:"key-idea"},[ el("strong",null,["En una frase. "]), CLAVES[s.id] ]), body.firstChild);
    const prev = SECTIONS[i-1], next = SECTIONS[i+1];
    const nav = el("nav",{class:"sec-nav", "aria-label":"Navegación entre preguntas"});
    const mk = (t, kind)=>{
      const b = el("button",{type:"button", class:"sec-nav-btn " + kind},[ el("span",{class:"sec-nav-k"},[kind === "prev" ? "Pregunta anterior" : (t.part !== s.part && t.part ? "Siguiente parte · " + PARTS.find(x=>x.id===t.part).t : "Siguiente pregunta")]), el("span",{class:"sec-nav-t"},[t.num + ". " + t.title]) ]);
      b.addEventListener("click", ()=>{ const cur = document.getElementById("sec-"+s.id); toggleSection(cur, cur.querySelector(".acc-header"), false); openSection(t.id); scrollSoon("sec-"+t.id); });
      return b;
    };
    nav.appendChild(prev ? mk(prev, "prev") : el("span"));
    if(next) nav.appendChild(mk(next, "next"));
    body.appendChild(nav);
  });
}
function renderTOC(){
  const toc = document.getElementById("toc");
  let curPart;
  SECTIONS.forEach(s=>{
    if(s.part && s.part !== curPart){ curPart = s.part; const P = PARTS.find(x=> x.id === s.part); toc.appendChild(el("div",{class:"toc-part part-"+P.id},[ el("span",null,[P.k]), " ", P.t ])); }
    const a = el("a",{ href:"#sec-"+s.id, class:"toc-link", "data-target":s.id },[ el("span",{class:"toc-num"},[s.num]), s.toc || s.title ]);
    a.addEventListener("click", e=>{ e.preventDefault(); openSection(s.id); scrollToId("sec-"+s.id); closeSidebar(); });
    toc.appendChild(a);
    (s.subs||[]).forEach(su=>{
      const b = el("a",{ href:"#"+su.id, class:"toc-link sub", "data-target":s.id, "data-sub":su.id },[su.label]);
      b.addEventListener("click", e=>{ e.preventDefault(); openSection(s.id); scrollSoon(su.id); closeSidebar(); });
      toc.appendChild(b);
    });
  });
  document.getElementById("section-count-hint").textContent = SECTIONS.length + " secciones · pulsa / para buscar";
}
function initScrollspy(){
  const bc = document.getElementById("breadcrumb");
  function update(){
    let cur = null;
    SECTIONS.forEach(s=>{ const n = document.getElementById("sec-"+s.id); if(n && n.getBoundingClientRect().top < 140) cur = s; });
    let curSub = null;
    if(cur && document.getElementById("sec-"+cur.id).classList.contains("open")){
      (cur.subs||[]).forEach(su=>{ const n = document.getElementById(su.id); if(n && n.getBoundingClientRect().top < 160) curSub = su; });
    }
    document.querySelectorAll(".toc-link").forEach(a=>{
      const isSub = a.hasAttribute("data-sub");
      a.classList.toggle("active", !!cur && (isSub ? curSub && a.getAttribute("data-sub")===curSub.id : a.getAttribute("data-target")===cur.id && !curSub));
    });
    bc.innerHTML = "";
    if(cur){
      bc.appendChild(el("div",{class:"container"},[ el("a",{href:"#main"},["Inicio"]), el("span",{class:"sep"},[" / "]), el("span",{class: curSub?null:"current"},[cur.toc || cur.title]),
        curSub ? el("span",{class:"sep"},[" / "]) : null, curSub ? el("span",{class:"current"},[curSub.label]) : null ]));
    }
  }
  window.addEventListener("scroll", ()=> requestAnimationFrame(update), { passive:true });
  update();
}

/* ================================================================ buscador, paneles y atajos */
function buildSearchIndex(){
  const idx = [];
  SECTIONS.forEach(s=>{ idx.push({ type:"Pregunta", label:s.title, detail:s.sub, sec:s.id, anchor:"sec-"+s.id }); (s.subs||[]).forEach(u=> idx.push({ type:"Subsección", label:u.label, detail:s.title, sec:s.id, anchor:u.id })); });
  (C.glosario||[]).forEach(x=> idx.push({ type:"Glosario", label:x.t, detail:x.d, sec:"glosario", anchor:"glos-"+x.id }));
  (C.referencias||[]).forEach(x=> idx.push({ type:"Referencia", label:x.c.slice(0,80) + (x.c.length>80?"…":""), detail:x.url, sec:"referencias", anchor:"sec-referencias" }));
  return idx.concat(CFG.indice ? CFG.indice() : []);
}
function norm(s){ return String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase(); }
function initSearch(){
  const IDX = buildSearchIndex();
  const panel = document.getElementById("search-panel"), input = document.getElementById("search-input"), list = document.getElementById("search-results");
  let results = [], active = -1;
  function open(){ panel.hidden = false; input.value = ""; render(); setTimeout(()=> input.focus(), 10); }
  function close(){ panel.hidden = true; }
  function render(){
    const q = norm(input.value.trim());
    list.innerHTML = "";
    if(!q){ results = []; input.setAttribute("aria-expanded","false"); return; }
    const terms = q.split(/\s+/);
    results = IDX.filter(r=>{ const t = norm(r.label + " " + r.detail + " " + r.type); return terms.every(x=> t.includes(x)); }).slice(0,14);
    active = results.length ? 0 : -1;
    input.setAttribute("aria-expanded", results.length ? "true":"false");
    if(!results.length){ list.appendChild(el("li",{class:"search-empty"},["Sin resultados para «" + input.value + "»"])); return; }
    results.forEach((r,i)=>{
      const li = el("li",{class:"search-result" + (i===active?" active":""), role:"option", id:"sr-"+i, "aria-selected": i===active?"true":"false"},[
        el("span",{class:"sr-type"},[r.type]), el("div",{class:"sr-label"},[r.label]), el("div",{class:"sr-detail"},[r.detail])
      ]);
      li.addEventListener("click", ()=> go(r));
      list.appendChild(li);
    });
  }
  function go(r){
    close();
    if(r.cod) select(r.cod);
    openSection(r.sec);
    scrollSoon(r.anchor);
  }
  function move(d){
    if(!results.length) return;
    active = (active + d + results.length) % results.length;
    list.querySelectorAll(".search-result").forEach((li,i)=>{ li.classList.toggle("active", i===active); li.setAttribute("aria-selected", i===active?"true":"false"); });
    const a = list.querySelector(".search-result.active"); if(a) a.scrollIntoView({ block:"nearest" });
  }
  input.addEventListener("input", render);
  input.addEventListener("keydown", e=>{
    if(e.key === "ArrowDown"){ e.preventDefault(); move(1); }
    else if(e.key === "ArrowUp"){ e.preventDefault(); move(-1); }
    else if(e.key === "Enter" && active >= 0){ e.preventDefault(); go(results[active]); }
    else if(e.key === "Escape"){ close(); }
  });
  document.getElementById("search-trigger").addEventListener("click", open);
  document.getElementById("search-close").addEventListener("click", close);
  panel.addEventListener("click", e=>{ if(e.target === panel) close(); });
  return { open, close, isOpen: ()=> !panel.hidden };
}
function closeSidebar(){
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebar-scrim").hidden = true;
  document.getElementById("toc-toggle").setAttribute("aria-expanded","false");
}
function initMobileSidebar(){
  const btn = document.getElementById("toc-toggle"), sb = document.getElementById("sidebar"), scrim = document.getElementById("sidebar-scrim");
  btn.addEventListener("click", ()=>{ const o = !sb.classList.contains("open"); sb.classList.toggle("open", o); scrim.hidden = !o; btn.setAttribute("aria-expanded", o?"true":"false"); });
  scrim.addEventListener("click", closeSidebar);
}
function renderSources(){
  const b = document.getElementById("sources-panel-body");
  C.fuentes.forEach(g=>{
    if(!g.items.length) return;
    b.appendChild(el("div",{class:"sources-panel-group"},[ el("h3",null,[g.grupo]),
      el("ul",{class:"sources-panel-list"}, g.items.map(i=> el("li",null,[ el("a",{href:i.url, target:"_blank", rel:"noopener"},[i.label]) ]))) ]));
  });
  const btn = document.getElementById("sources-panel-btn"), panel = document.getElementById("sources-panel");
  function show(){ panel.hidden = false; closeSidebar(); scrollSoon("sources-panel"); }
  btn.addEventListener("click", show);
  document.querySelectorAll(".js-open-sources").forEach(x=> x.addEventListener("click", e=>{ e.preventDefault(); show(); }));
}
function initShortcuts(search){
  const help = document.getElementById("shortcuts-panel");
  function toggleHelp(force){ help.hidden = typeof force === "boolean" ? !force : !help.hidden; }
  document.getElementById("help-toggle").addEventListener("click", ()=> toggleHelp());
  document.getElementById("shortcuts-close").addEventListener("click", ()=> toggleHelp(false));
  help.addEventListener("click", e=>{ if(e.target === help) toggleHelp(false); });
  document.addEventListener("keydown", e=>{
    const tag = (e.target.tagName||"").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || tag === "select";
    if(e.key === "Escape"){
      const tsm = document.getElementById("text-size-menu");
      if(tsm && !tsm.hidden){ tsm.hidden = true; document.getElementById("text-size-btn").setAttribute("aria-expanded","false"); document.getElementById("text-size-btn").focus(); }
      else if(search.isOpen()) search.close(); else if(!help.hidden) toggleHelp(false); else closeSidebar();
      closeTip(); return;
    }
    if(typing) return;
    if(e.key === "+" || e.key === "="){ e.preventDefault(); stepTextSize(1); return; }
    if(e.key === "-" || e.key === "_"){ e.preventDefault(); stepTextSize(-1); return; }
    if(e.key === "/"){ e.preventDefault(); search.open(); }
    else if(e.key === "?"){ e.preventDefault(); toggleHelp(); }
  });
}
function initFocusMode(){
  const btn = document.getElementById("focus-toggle");
  btn.addEventListener("click", ()=>{ const on = !document.body.classList.contains("focus-mode"); document.body.classList.toggle("focus-mode", on); btn.setAttribute("aria-pressed", on?"true":"false"); });
}
function initTextSize(){
  const btn = document.getElementById("text-size-btn"), menu = document.getElementById("text-size-menu");
  if(!btn || !menu) return;
  TEXT_SIZES.forEach(t=>{
    const b = el("button",{type:"button", class:"ts-opt", "data-k":t.k, "aria-pressed":"false"},[ el("span",null,[t.l]), el("span",{class:"ts-p"},[t.p]) ]);
    b.addEventListener("click", ()=>{ applyTextSize(t.k); });
    menu.appendChild(b);
  });
  applyTextSize(document.documentElement.getAttribute("data-text") || "0");
  btn.addEventListener("click", ()=>{ const open = menu.hidden; menu.hidden = !open; btn.setAttribute("aria-expanded", open ? "true" : "false"); if(open){ const cur = menu.querySelector('[aria-pressed="true"]'); if(cur) cur.focus(); } });
  document.addEventListener("click", e=>{ if(!menu.hidden && !e.target.closest("#text-size")){ menu.hidden = true; btn.setAttribute("aria-expanded","false"); } });
}
function initScrollTop(){
  const b = document.getElementById("scroll-top");
  window.addEventListener("scroll", ()=>{ b.hidden = window.scrollY < 600; }, { passive:true });
  b.addEventListener("click", ()=> window.scrollTo({ top:0, behavior:"smooth" }));
}

/* ================================================================ arranque */
let CFG = {}, C = {}, SECTIONS = [], PARTS = [], CLAVES = {}; const SEC = {};
function renderSections(){
  buildAccordion(); CFG.render();
  if(document.getElementById("body-glosario")) renderGlosario();
  if(document.getElementById("body-referencias")) renderReferencias();
  addSectionNav(); addChartTools(); renderTOC(); decorate(document.getElementById("accordion")); observeReadings();
}
let wasMob = null;
function watchBreakpoint(){
  wasMob = MOB(); let t = null;
  window.addEventListener("resize", ()=>{ clearTimeout(t); t = setTimeout(()=>{
    if(MOB() === wasMob) return; wasMob = MOB();
    const open = [...document.querySelectorAll(".acc-item.open")].map(x=> x.id.slice(4)), cur = [...document.querySelectorAll(".acc-item")].find(x=> x.getBoundingClientRect().bottom > 120);
    const dlg = document.getElementById("zoom-dlg"); if(dlg && dlg.open) dlg.close();
    closeTip(); STATE.listeners = []; document.getElementById("accordion").innerHTML = ""; document.getElementById("toc").innerHTML = "";
    renderSections();
    document.querySelectorAll(".acc-item").forEach(i=> toggleSection(i, i.querySelector(".acc-header"), open.includes(i.id.slice(4))));
    if(cur && window.scrollY > 600) scrollSoon(cur.id);
  }, 180); });
}

/* Motor.iniciar({ contenido, secciones, partes, ideas, entidad:{nombre, inicial, valida}, render, indice }) */
function iniciar(cfg){
  CFG = cfg; C = cfg.contenido; SECTIONS = cfg.secciones; PARTS = cfg.partes || []; CLAVES = cfg.ideas || {};
  SECTIONS.forEach((s,i)=>{ s.num = String(i+1).padStart(2,"0"); SEC[s.id] = s; });
  STATE.sel = cfg.entidad ? cfg.entidad.inicial : null;
  (C.glosario||[]).forEach(g=> GLOS[g.id] = g); TERM_RE = (C.glosario||[]).map(g=> ({ id:g.id, re:new RegExp(g.re, "i") })); NORM_RE = (C.normas||[]).map(n=> ({ url:n.url, re:new RegExp(n.re) }));
  const go = ()=>{
    renderHero(); renderSections(); if(C.fuentes) renderSources(); renderFooter(); decorate(document.querySelector(".hero")); initTerms();
    document.querySelectorAll(".js-export-pdf").forEach(b=> b.addEventListener("click", ()=> window.print()));
    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    document.getElementById("expand-all").addEventListener("click", ()=> setAll(true)); document.getElementById("collapse-all").addEventListener("click", ()=> setAll(false));
    initMobileSidebar(); initShortcuts(initSearch()); initFocusMode(); initTextSize(); initScrollTop(); initScrollspy(); watchBreakpoint();
  };
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
}

window.Motor = { SVGNS, el, esc, fmt, compact, svgEl, MOB, VW, niceStep, niceMax, ticks, sourceLine, callout, confidenceTag, scrollSoon, downloadCSV, lowFirst, wrapText, bindTip, closeTip, onSelect, select, STATE, openSection, sub, chips, median, ranks, pearson, spearman, strength, joinNames, reading, setReading, howTo, legend, quantileBreaks, classOf, pathCenter, niceRef, story, sdDiagram, sdForm, sdFactores, sdFormas, resumen, recorrido, tabla, decorate, SEC, iniciar };
})();

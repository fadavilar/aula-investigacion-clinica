(function () {
  'use strict';
  var A = window.APP;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function link(o) { return '<a href="' + esc(o.u) + '" rel="noopener">' + esc(o.t) + '</a>'; }
  var store = { get: function (k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  /* Cabecera y pie */
  $('#subtitulo').textContent = A.meta.subtitulo;
  $('#pie').textContent = A.meta.titulo + ' · versión ' + A.meta.version + ' · actualizado ' + A.meta.actualizado + ' · ' + A.meta.autor;

  /* Contenidos */
  function renderTabla(q) {
    q = (q || '').toLowerCase();
    var rows = A.contenidos.filter(function (c) {
      var hay = (c.tema + ' ' + c.competencia + ' ' + c.fuentes.map(function (f) { return f.t; }).join(' ')).toLowerCase();
      return hay.indexOf(q) !== -1;
    }).map(function (c) {
      return '<tr><td><b>' + esc(c.tema) + '</b></td><td>' + esc(c.competencia) + '</td><td><ul>' +
        c.fuentes.map(function (f) { return '<li>' + link(f) + '</li>'; }).join('') + '</ul></td></tr>';
    });
    $('#tabla tbody').innerHTML = rows.join('') || '<tr><td colspan="3">Sin resultados para ese filtro.</td></tr>';
  }
  renderTabla('');
  $('#filtro').addEventListener('input', function (e) { renderTabla(e.target.value); });

  /* Lectura crítica */
  var sel = $('#diseno');
  sel.innerHTML = A.disenos.map(function (d, i) { return '<option value="' + i + '">' + esc(d.nombre) + '</option>'; }).join('');
  function renderDiseno() {
    var d = A.disenos[+sel.value];
    $('#disenoOut').innerHTML =
      '<article class="card"><h4>Guía de reporte</h4><p><b>' + esc(d.guia) + '</b></p><p><a href="' + esc(d.guiaUrl) + '" rel="noopener">Abrir la guía</a></p>' +
      '<h4>Herramienta de evaluación crítica</h4><p><b>' + esc(d.herramienta) + '</b></p><p><a href="' + esc(d.herrUrl) + '" rel="noopener">Abrir la herramienta</a></p></article>' +
      '<article class="card"><h4>Preguntas clave</h4><ul>' + d.preguntas.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></article>';
  }
  sel.addEventListener('change', renderDiseno); renderDiseno();


  /* Árbol de decisión */
  var arb = $('#arbol'), trail = [];
  function dis(nombre) { return A.disenos.filter(function (d) { return d.nombre === nombre; })[0]; }
  function renderArbol(id) {
    var n = A.arbol.nodos[id];
    var ruta = trail.length ? '<p class="trail">Tus respuestas: ' + trail.map(function (t) { return esc(t); }).join(' → ') + '</p>' : '';
    arb.innerHTML = ruta + '<p class="q">' + esc(n.p) + '</p><div class="opts">' + n.o.map(function (o, i) {
      return '<button type="button" class="opt" data-i="' + i + '">' + esc(o.t) + '</button>'; }).join('') + '</div>' +
      (trail.length ? '<div class="tools-row"><button type="button" class="btn small alt2" id="arbAtras">Volver atrás</button> <button type="button" class="btn small alt2" id="arbReiniciar">Empezar de nuevo</button></div>' : '');
    arb.dataset.node = id;
  }
  function resultadoArbol(d) {
    arb.innerHTML = '<p class="trail">Tus respuestas: ' + trail.map(function (t) { return esc(t); }).join(' → ') + '</p>' +
      '<p class="q">Tu estudio es: ' + esc(d.nombre) + '</p><div class="grid2">' +
      '<article class="card"><h4>Guía de reporte</h4><p><b>' + esc(d.guia) + '</b></p><p><a href="' + esc(d.guiaUrl) + '" rel="noopener">Abrir la guía</a></p>' +
      '<h4>Herramienta de evaluación crítica</h4><p><b>' + esc(d.herramienta) + '</b></p><p><a href="' + esc(d.herrUrl) + '" rel="noopener">Abrir la herramienta</a></p></article>' +
      '<article class="card"><h4>Preguntas clave</h4><ul>' + d.preguntas.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></article></div>' +
      '<p class="note">Si el artículo se declara de un diseño distinto del que muestra el árbol (por ejemplo, un estudio observacional llamado ensayo), la clasificación correcta es la que describe su método.</p>' +
      '<div class="tools-row"><button type="button" class="btn small alt2" id="arbAtras">Volver atrás</button> <button type="button" class="btn small alt2" id="arbReiniciar">Clasificar otro estudio</button></div>';
  }
  var history = [];
  arb.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.id === 'arbReiniciar') { trail = []; history = []; renderArbol(A.arbol.inicio); return; }
    if (b.id === 'arbAtras') { var prev = history.pop(); trail.pop(); renderArbol(prev || A.arbol.inicio); return; }
    if (!b.classList.contains('opt')) return;
    var id = arb.dataset.node, o = A.arbol.nodos[id].o[+b.dataset.i];
    trail.push(o.t); history.push(id);
    if (A.arbol.nodos[o.a]) renderArbol(o.a); else { var d = dis(o.a); if (d) resultadoArbol(d); }
  });
  renderArbol(A.arbol.inicio);

  /* Práctica de selección múltiple */
  var qz = $('#quiz'), qi = 0, puntos = 0, contestada = false;
  function renderQuiz() {
    if (qi >= A.practica.length) {
      qz.innerHTML = '<p class="q">Terminaste: ' + puntos + ' de ' + A.practica.length + ' respuestas correctas.</p><p>Repasa las explicaciones de las que fallaste y vuelve a intentarlo.</p><div class="tools-row"><button type="button" class="btn small alt2" id="qzReiniciar">Repetir la práctica</button></div>';
      return;
    }
    var q = A.practica[qi]; contestada = false;
    qz.innerHTML = '<p class="trail">Pregunta ' + (qi + 1) + ' de ' + A.practica.length + ' · aciertos: ' + puntos + '</p><p class="q">' + esc(q.q) + '</p><div class="opts">' +
      q.o.map(function (t, i) { return '<button type="button" class="opt" data-i="' + i + '">' + esc(t) + '</button>'; }).join('') + '</div><div id="qzFb"></div>';
  }
  qz.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.id === 'qzReiniciar') { qi = 0; puntos = 0; renderQuiz(); return; }
    if (b.id === 'qzSig') { qi++; renderQuiz(); return; }
    if (!b.classList.contains('opt') || contestada) return;
    contestada = true;
    var q = A.practica[qi], i = +b.dataset.i;
    if (i === q.r) puntos++;
    [].forEach.call(qz.querySelectorAll('.opt'), function (x, k) { x.disabled = true; if (k === q.r) x.classList.add('ok'); else if (k === i) x.classList.add('bad'); });
    $('#qzFb').innerHTML = '<p class="fb"><b>' + (i === q.r ? 'Correcto. ' : 'No es esa. ') + '</b>' + esc(q.e) + '</p><div class="tools-row"><button type="button" class="btn small alt2" id="qzSig">' + (qi + 1 < A.practica.length ? 'Siguiente pregunta' : 'Ver resultado') + '</button></div>';
  });
  renderQuiz();

  /* Calculadora */
  function f(x, d) { return isFinite(x) ? x.toFixed(d == null ? 2 : d).replace('.', ',') : '—'; }
  function calcular() {
    var a = +$('#a').value, n1 = +$('#n1').value, c = +$('#c').value, n2 = +$('#n2').value, out = $('#calcOut'), msg = $('#calcMsg');
    if (!(n1 > 0 && n2 > 0) || a < 0 || c < 0 || a > n1 || c > n2 || a % 1 || c % 1 || n1 % 1 || n2 % 1) {
      out.innerHTML = ''; msg.textContent = 'Revisa los datos: los eventos deben ser enteros y no pueden superar el total del grupo.'; return;
    }
    var r1 = a / n1, r0 = c / n2, rar = r0 - r1, rr = r1 / r0, or = (a / (n1 - a)) / (c / (n2 - c));
    var ok = a > 0 && c > 0 && a < n1 && c < n2;
    var z = 1.96, seRR = Math.sqrt(1 / a - 1 / n1 + 1 / c - 1 / n2), seOR = Math.sqrt(1 / a + 1 / (n1 - a) + 1 / c + 1 / (n2 - c));
    var rrLo = Math.exp(Math.log(rr) - z * seRR), rrHi = Math.exp(Math.log(rr) + z * seRR);
    var orLo = Math.exp(Math.log(or) - z * seOR), orHi = Math.exp(Math.log(or) + z * seOR);
    var nnt = rar === 0 ? Infinity : 1 / Math.abs(rar);
    function k(t, v, s) { return '<div class="kpi"><small>' + t + '</small><b>' + v + '</b><span>' + (s || '') + '</span></div>'; }
    out.innerHTML = k('Riesgo tratados', f(r1 * 100, 1) + ' %') + k('Riesgo control', f(r0 * 100, 1) + ' %') +
      k('Reducción absoluta', f(rar * 100, 1) + ' pts') +
      k('RR', ok ? f(rr) : '—', ok ? 'IC 95 %: ' + f(rrLo) + ' a ' + f(rrHi) : 'Necesita eventos en ambos grupos') +
      k('OR', ok ? f(or) : '—', ok ? 'IC 95 %: ' + f(orLo) + ' a ' + f(orHi) : '') +
      k(rar >= 0 ? 'NNT' : 'NNH', nnt === Infinity ? '—' : String(Math.ceil(nnt - 1e-9)), 'Pacientes a tratar');
    if (!ok) { msg.textContent = 'Con cero eventos o con todos los pacientes con evento, el intervalo no se calcula con este método.'; return; }
    var cruza = rrLo <= 1 && rrHi >= 1;
    msg.textContent = (cruza ? 'El intervalo del RR incluye 1: el estudio no demuestra diferencia, aunque el valor puntual sea ' + f(rr) + '. ' : 'El intervalo del RR no incluye 1: la diferencia es estadísticamente significativa. ') +
      'Pregúntate también si la magnitud importa clínicamente.';
  }
  ['a', 'n1', 'c', 'n2'].forEach(function (id) { $('#' + id).addEventListener('input', calcular); });
  calcular();

  /* Fases de la revisión */
  var stepper = $('#stepper');
  stepper.innerHTML = A.fases.map(function (p, i) {
    return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + p.n + '. ' + esc(p.nombre) + '</button>';
  }).join('');
  function renderFase(i) {
    var p = A.fases[i];
    [].forEach.call(stepper.children, function (b, j) { b.setAttribute('aria-selected', j === i); });
    $('#fase').innerHTML = '<h4 class="title">' + p.n + '. ' + esc(p.nombre) + '</h4>' +
      '<div class="card"><h4>Qué puede hacer la IA</h4><p>' + esc(p.ia) + '</p></div>' +
      '<div class="card"><h4>Qué hace el equipo</h4><p>' + esc(p.humano) + '</p></div>' +
      '<div class="card"><h4>Entregable</h4><p>' + esc(p.entregable) + '</p></div>' +
      '<div class="card"><h4>Riesgo a vigilar</h4><p>' + esc(p.riesgo) + '</p></div>';
  }
  stepper.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) renderFase(+b.dataset.i); });
  renderFase(0);
  $('#bp').innerHTML = A.mejoresPracticas.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');

  /* Declaración de uso de IA */
  $('#d_fase').innerHTML = A.fases.map(function (p) { return '<option>' + esc(p.nombre) + '</option>'; }).join('');
  function declaracion() {
    var v = function (id, alt) { return ($('#' + id).value || '').trim() || alt; };
    $('#declOut').textContent =
      'Declaración de uso de inteligencia artificial. Se utilizó ' + v('d_herr', '[herramienta y versión]') +
      ' (fecha de uso: ' + v('d_fecha', '[fecha]') + ') en la fase de ' + v('d_fase', '[fase]') +
      ' para ' + v('d_prop', '[propósito]') + '. Los resultados se verificaron así: ' + v('d_ver', '[método de verificación]') +
      '. La responsabilidad de las decisiones y del contenido final es de ' + v('d_resp', '[responsables]') +
      ', y la IA no reemplazó el juicio del equipo.';
  }
  ['d_herr', 'd_fecha', 'd_fase', 'd_prop', 'd_ver', 'd_resp'].forEach(function (id) { $('#' + id).addEventListener('input', declaracion); });
  declaracion();
  $('#copiar').addEventListener('click', function () {
    var t = $('#declOut').textContent, m = $('#copiado');
    function ok() { m.textContent = 'Texto copiado.'; setTimeout(function () { m.textContent = ''; }, 2500); }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).then(ok, function () { m.textContent = 'Selecciona el texto y cópialo con Ctrl+C.'; }); }
    else { m.textContent = 'Selecciona el texto y cópialo con Ctrl+C.'; }
  });

  /* Herramientas en Claude */
  $('#tools tbody').innerHTML = A.herramientasClaude.map(function (h) {
    return '<tr><td>' + esc(h.tipo) + '</td><td><b>' + esc(h.nombre) + '</b></td><td>' + esc(h.paraQue) + '</td><td>' + esc(h.nota) + '</td></tr>';
  }).join('');

  /* Vancouver */
  $('#vReglas').innerHTML = A.vancouver.reglas.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
  $('#vEjemplo').textContent = A.vancouver.ejemplo;
  $('#vErrores').innerHTML = A.vancouver.errores.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');

  /* Listas de verificación con progreso */
  var KEY = 'aula-ofimatica-v1', saved = store.get(KEY) || {};
  var total = 0;
  $('#ofi').innerHTML = Object.keys(A.ofimatica).map(function (k) {
    return '<article class="card ofi"><h3>' + esc(k) + '</h3>' + A.ofimatica[k].map(function (t, i) {
      var id = k + '-' + i; total++;
      return '<label class="chk"><input type="checkbox" data-id="' + id + '"' + (saved[id] ? ' checked' : '') + '><span>' + esc(t) + '</span></label>';
    }).join('') + '</article>';
  }).join('');
  function progreso() {
    var n = Object.keys(saved).filter(function (k) { return saved[k]; }).length;
    $('#progreso').textContent = 'Tu avance en las listas de verificación: ' + n + ' de ' + total + '.';
  }
  $('#ofi').addEventListener('change', function (e) { if (e.target.dataset.id) { saved[e.target.dataset.id] = e.target.checked; store.set(KEY, saved); progreso(); } });
  progreso();

  /* Recursos */
  $('#rec').innerHTML = A.recursos.map(function (r) {
    return '<article class="card rec"><h3 style="margin-top:0">' + link({ t: r.t, u: r.u }) + '</h3><p>' + esc(r.d) + '</p></article>';
  }).join('');
})();

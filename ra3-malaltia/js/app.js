/* Lògica de la interfície · El cas del taulell (RA3 La malaltia) · versió 2 */
"use strict";
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const SPEAK_ICON = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

/* ================================================== Preferències */
const PREF_KEY = "ra3-malaltia-prefs";
const prefs = Object.assign({size:"m", contrast:"normal", font:"atkinson", motion:"on", d3:"on", sound:"off", lang:"ca"}, (() => { try { return JSON.parse(localStorage.getItem(PREF_KEY)) || {}; } catch(e){ return {}; } })());
function applyPrefs(){
  const r = document.documentElement;
  r.dataset.size = prefs.size; r.dataset.font = prefs.font; r.dataset.motion = prefs.motion; r.lang = LANG();
  if (prefs.contrast === "high") r.dataset.contrast = "high"; else delete r.dataset.contrast;
  try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch(e) {}
}
const LANG = () => prefs.lang === "es" ? "es" : "ca";

/* ================================================== Textos de la interfície (CA | ES) */
const UI = {
  ca:{
    kicker:"MP0061 Anatomofisiologia i patologia bàsiques · RA3", lead:"Arriba un pacient a la farmàcia. Acompanya'l de la primera pregunta fins al tractament.",
    email:"Correu de l'institut", pass:"Contrasenya", enter:"Entra a la farmàcia", note:"Només per a l'alumnat amb correu @isvh.cat. La contrasenya te la dona el professorat.",
    errEmail:"Escriu el teu correu de l'institut. Ha d'acabar en @isvh.cat.", errPass:"La contrasenya no és correcta. Torna-ho a provar.", errCrypto:"Aquest navegador no pot validar l'accés. Fes servir Chrome, Edge, Firefox o Safari actualitzats.",
    brand:"El cas del taulell", logout:"Surt", pts:"punts", langBtn:"ES", langLabel:"Llegeix en castellà",
    a11yTitle:"Opcions de lectura", size:"Mida del text", sNormal:"Normal", sL:"Gran", sXL:"Molt gran", font:"Tipus de lletra", fA:"Molt llegible", fL:"Lectura fàcil",
    contrast:"Contrast", cN:"Normal", cH:"Alt", motion:"Animacions", yes:"Sí", no:"No", d3:"Escenes 3D", d3off:"No (ordinadors lents)", sound:"So en encertar i fallar", done:"Fet",
    listen:"Escolta", noVoice:"Lectura no disponible",
    wizStep:(n, m) => "Instruccions · pas " + n + " de " + m, prev:"Anterior", next:"Següent", toDiabetes:"Abans de començar",
    w1:"Ets el tècnic o la tècnica de farmàcia", nameLbl:"Escriu el teu nom i cognoms per començar", namePh:"Nom i cognoms", nameErr:"Escriu el teu nom i almenys un cognom per començar.",
    w1a:"Avui fas el torn a l'oficina de farmàcia. Entrarà un pacient amb un problema de salut i el veuràs des de darrere del taulell.",
    w1b:"El seguiràs fins que el metge decideixi el tractament. A cada pas aplicaràs el que has après al RA3, «La malaltia».",
    w2:"Cinc fases", phaseDesc:["Escoltes el pacient, observes i decideixes què fer.","Descobreixes l'agent o la causa i els factors de risc.","La doctora l'explora: classifiques signes i símptomes.","Tries les proves que calen i en veus els resultats.","Compares, diagnostiques, classifiques la malaltia i tries el tractament."],
    w3:"Com es puntua", rules:["<b>Cada fase val 200 punts</b>, 1.000 en total. La nota s'obté dividint els punts per 100.","Cada fase té <b>9 o 10 preguntes</b>. Un encert suma els punts de la pregunta i un error en resta la meitat.","Les ajudes <b>«Consulta els apunts»</b> resten 15 punts cadascuna.","Demanar proves que no calen també resta. Saber per a què serveix cada prova (botó ⓘ) és gratis.","Només compta la primera resposta: llegeix bé abans de comprovar."],
    w4:"Com es lliura", w4a:"Al final veuràs un informe amb la teva puntuació, <b>el teu perfil de tècnic/a de farmàcia</b> i un <b>codi de verificació</b>.", w4b:"Copia el text de l'informe o fes-ne una captura de pantalla i lliura-ho a la tasca de <b>Google Classroom</b>.", w4c:"El progrés es desa en aquest navegador. Si el tanques, continuaràs on eres.",
    w5:"Comencem", w5a:n => "Torn de <b>" + n + "</b>. Abans del primer pacient, una explicació breu de la diabetis.", w5b:"Les fases s'obren una darrere l'altra: per passar a la següent cal respondre totes les preguntes de l'actual.",
    diaKicker:(n, m) => "Abans de començar · " + n + " de " + m, replay:"Torna a veure l'animació", startShift:"Comença el torn",
    phaseOf:(n, place, cs) => "Fase " + n + " de 5 · " + place + " · cas: " + cs, hintsIntro:"Si t'encalles, pots consultar els apunts. Cada ajuda que obres resta 15 punts.", hintCost:"−15 punts", hintUsed:"oberta · −15",
    qOf:(n, m) => "Pregunta " + n + " de " + m, phaseScore:(n, p) => "Fase " + n + ": <b>" + p + "</b> de 200 punts", nextPhase:(n, t) => "Passa a la fase " + n + ": " + t, toReport:"Mostra l'informe final",
    check:"Comprova", multiHint:"Pots marcar més d'una opció.", ptsN:n => n + " punts",
    explore:n => "Toca els punts verds del cos a la il·lustració, o aquests botons, per explorar. Et queden <b>" + n + "</b> zones.", exploreBtn:z => "Explora: " + z, explored:"Has explorat totes les zones.",
    dragHint:"Arrossega cada targeta a la seva casella, o toca la targeta i després la casella.", pool:"Targetes per classificar", selected:"triada",
    orderHint:"Arrossega els passos o fes servir les fletxes per posar-los en ordre.", up:"Puja", down:"Baixa",
    testsHint:"Marca les proves i després demana-les. Les que no calen resten punts. Toca ⓘ per saber per a què serveix cada una (gratis).", ask:"Demana les proves", info:"Per a què serveix", ionizing:"Radiació ionitzant", noIonizing:"Sense radiació ionitzant", invasive:"Invasiva", nonInvasive:"No invasiva", close:"Tanca",
    what:"Què estudia", why:"Per a què serveix", how:"Com es fa",
    correct:"Correcte", wrong:"No és correcte", chose:t => "has triat «" + t + "».", rightIs:t => "La resposta correcta és <b>«" + t + "»</b>.",
    hit:"Encert", extra:"No hi anava", missed:"T'has deixat", isReally:t => "és " + t, posOk:"al lloc correcte", posBad:n => "anava a la posició " + n,
    kind:{need:"Calia", neutral:"Neutra", no:"No calia"}, missedTest:t => "No has demanat una prova que calia: " + t + ".", whyLbl:"Per què?",
    clinic:"Clínica de la consulta", results:"Resultats de les proves", noTests:"No vas demanar cap prova.",
    repKicker:c => "Informe del torn · cas: " + c, repTitle:n => "Torn acabat, " + n, repLead:p => "Has acompanyat " + p + " del taulell al tractament.", grade:"nota sobre 10",
    stats:(e, h) => "Errors: <b>" + e + "</b> · Ajudes obertes: <b>" + h + "</b> (−" + h * 15 + " punts)",
    profile:"El teu perfil de tècnic/a de farmàcia", pF:"Punts forts", pD:"Per millorar", pO:"Què repassar", pA:"Errors a vigilar",
    deliver:"Lliura-ho a Classroom", code:"Codi de verificació:", deliverTxt:"Copia el text i enganxa'l a la tasca de Classroom. També pots fer una captura de pantalla d'aquesta pàgina. El text és en català perquè el docent el pugui verificar.",
    copy:"Copia el resultat", copied:"Copiat. Ara enganxa'l a Classroom.", copySel:"Text seleccionat. Copia'l amb Ctrl+C (o mantén premut al mòbil).",
    chartLbl:"Punts per fase", patient:{Marta:"la Marta", Jordi:"en Jordi", Antoni:"l'Antoni"}
  },
  es:{
    kicker:"MP0061 Anatomofisiología y patología básicas · RA3", lead:"Llega un paciente a la farmacia. Acompáñalo desde la primera pregunta hasta el tratamiento.",
    email:"Correo del instituto", pass:"Contraseña", enter:"Entra en la farmacia", note:"Solo para el alumnado con correo @isvh.cat. La contraseña te la da el profesorado.",
    errEmail:"Escribe tu correo del instituto. Debe terminar en @isvh.cat.", errPass:"La contraseña no es correcta. Vuelve a intentarlo.", errCrypto:"Este navegador no puede validar el acceso. Usa Chrome, Edge, Firefox o Safari actualizados.",
    brand:"El caso del mostrador", logout:"Salir", pts:"puntos", langBtn:"CA", langLabel:"Llegeix en català",
    a11yTitle:"Opciones de lectura", size:"Tamaño del texto", sNormal:"Normal", sL:"Grande", sXL:"Muy grande", font:"Tipo de letra", fA:"Muy legible", fL:"Lectura fácil",
    contrast:"Contraste", cN:"Normal", cH:"Alto", motion:"Animaciones", yes:"Sí", no:"No", d3:"Escenas 3D", d3off:"No (ordenadores lentos)", sound:"Sonido al acertar y fallar", done:"Hecho",
    listen:"Escucha", noVoice:"Lectura no disponible",
    wizStep:(n, m) => "Instrucciones · paso " + n + " de " + m, prev:"Anterior", next:"Siguiente", toDiabetes:"Antes de empezar",
    w1:"Eres el técnico o la técnica de farmacia", nameLbl:"Escribe tu nombre y apellidos para empezar", namePh:"Nombre y apellidos", nameErr:"Escribe tu nombre y al menos un apellido para empezar.",
    w1a:"Hoy haces el turno en la oficina de farmacia. Entrará un paciente con un problema de salud y lo verás desde detrás del mostrador.",
    w1b:"Lo seguirás hasta que el médico decida el tratamiento. En cada paso aplicarás lo que has aprendido en el RA3, «La enfermedad».",
    w2:"Cinco fases", phaseDesc:["Escuchas al paciente, observas y decides qué hacer.","Descubres el agente o la causa y los factores de riesgo.","La doctora lo explora: clasificas signos y síntomas.","Eliges las pruebas necesarias y ves los resultados.","Comparas, diagnosticas, clasificas la enfermedad y eliges el tratamiento."],
    w3:"Cómo se puntúa", rules:["<b>Cada fase vale 200 puntos</b>, 1.000 en total. La nota se obtiene dividiendo los puntos entre 100.","Cada fase tiene <b>9 o 10 preguntas</b>. Un acierto suma los puntos de la pregunta y un error resta la mitad.","Las ayudas <b>«Consulta los apuntes»</b> restan 15 puntos cada una.","Pedir pruebas innecesarias también resta. Saber para qué sirve cada prueba (botón ⓘ) es gratis.","Solo cuenta la primera respuesta: lee bien antes de comprobar."],
    w4:"Cómo se entrega", w4a:"Al final verás un informe con tu puntuación, <b>tu perfil de técnico/a de farmacia</b> y un <b>código de verificación</b>.", w4b:"Copia el texto del informe o haz una captura de pantalla y entrégalo en la tarea de <b>Google Classroom</b>.", w4c:"El progreso se guarda en este navegador. Si lo cierras, continuarás donde estabas.",
    w5:"Empezamos", w5a:n => "Turno de <b>" + n + "</b>. Antes del primer paciente, una explicación breve de la diabetes.", w5b:"Las fases se abren una tras otra: para pasar a la siguiente hay que responder todas las preguntas de la actual.",
    diaKicker:(n, m) => "Antes de empezar · " + n + " de " + m, replay:"Vuelve a ver la animación", startShift:"Empieza el turno",
    phaseOf:(n, place, cs) => "Fase " + n + " de 5 · " + place + " · caso: " + cs, hintsIntro:"Si te atascas, puedes consultar los apuntes. Cada ayuda que abres resta 15 puntos.", hintCost:"−15 puntos", hintUsed:"abierta · −15",
    qOf:(n, m) => "Pregunta " + n + " de " + m, phaseScore:(n, p) => "Fase " + n + ": <b>" + p + "</b> de 200 puntos", nextPhase:(n, t) => "Pasa a la fase " + n + ": " + t, toReport:"Muestra el informe final",
    check:"Comprueba", multiHint:"Puedes marcar más de una opción.", ptsN:n => n + " puntos",
    explore:n => "Toca los puntos verdes del cuerpo en la ilustración, o estos botones, para explorar. Te quedan <b>" + n + "</b> zonas.", exploreBtn:z => "Explora: " + z, explored:"Has explorado todas las zonas.",
    dragHint:"Arrastra cada tarjeta a su casilla, o toca la tarjeta y después la casilla.", pool:"Tarjetas para clasificar", selected:"elegida",
    orderHint:"Arrastra los pasos o usa las flechas para ponerlos en orden.", up:"Sube", down:"Baja",
    testsHint:"Marca las pruebas y después pídelas. Las innecesarias restan puntos. Toca ⓘ para saber para qué sirve cada una (gratis).", ask:"Pide las pruebas", info:"Para qué sirve", ionizing:"Radiación ionizante", noIonizing:"Sin radiación ionizante", invasive:"Invasiva", nonInvasive:"No invasiva", close:"Cierra",
    what:"Qué estudia", why:"Para qué sirve", how:"Cómo se hace",
    correct:"Correcto", wrong:"No es correcto", chose:t => "has elegido «" + t + "».", rightIs:t => "La respuesta correcta es <b>«" + t + "»</b>.",
    hit:"Acierto", extra:"No iba", missed:"Te has dejado", isReally:t => "es " + t, posOk:"en el lugar correcto", posBad:n => "iba en la posición " + n,
    kind:{need:"Necesaria", neutral:"Neutra", no:"Innecesaria"}, missedTest:t => "No has pedido una prueba necesaria: " + t + ".", whyLbl:"¿Por qué?",
    clinic:"Clínica de la consulta", results:"Resultados de las pruebas", noTests:"No pediste ninguna prueba.",
    repKicker:c => "Informe del turno · caso: " + c, repTitle:n => "Turno terminado, " + n, repLead:p => "Has acompañado a " + p + " del mostrador al tratamiento.", grade:"nota sobre 10",
    stats:(e, h) => "Errores: <b>" + e + "</b> · Ayudas abiertas: <b>" + h + "</b> (−" + h * 15 + " puntos)",
    profile:"Tu perfil de técnico/a de farmacia", pF:"Puntos fuertes", pD:"Para mejorar", pO:"Qué repasar", pA:"Errores a vigilar",
    deliver:"Entrégalo en Classroom", code:"Código de verificación:", deliverTxt:"Copia el texto y pégalo en la tarea de Classroom. También puedes hacer una captura de pantalla de esta página. El texto está en catalán para que el docente pueda verificarlo.",
    copy:"Copia el resultado", copied:"Copiado. Ahora pégalo en Classroom.", copySel:"Texto seleccionado. Cópialo con Ctrl+C (o mantén pulsado en el móvil).",
    chartLbl:"Puntos por fase", patient:{Marta:"Marta", Jordi:"Jordi", Antoni:"Antoni"}
  }
};
const t = (k, ...a) => { const v = UI[LANG()][k] !== undefined ? UI[LANG()][k] : UI.ca[k]; return typeof v === "function" ? v(...a) : v; };
/* textes fixos de l'HTML (portada, capçalera, menú) */
function applyStatic(){
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll(".langBtn").forEach(b => { b.textContent = t("langBtn"); b.setAttribute("aria-label", t("langLabel")); b.lang = LANG() === "ca" ? "es" : "ca"; });
  document.title = (LANG() === "es" ? "El caso del mostrador · RA3 La enfermedad" : "El cas del taulell · RA3 La malaltia");
}
function toggleLang(){ prefs.lang = LANG() === "ca" ? "es" : "ca"; applyPrefs(); applyStatic(); if (window.__ra3Rerender) window.__ra3Rerender(); }
document.addEventListener("click", e => { if (e.target.closest(".langBtn")) toggleLang(); });

function initA11y(){
  const btn = $("#a11yBtn"), dlg = $("#a11y");
  const close = () => { dlg.hidden = true; btn.setAttribute("aria-expanded", "false"); btn.focus(); };
  btn.onclick = () => { const open = dlg.hidden; dlg.hidden = !open; btn.setAttribute("aria-expanded", String(open)); if (open) dlg.querySelector("input:checked").focus(); };
  $("#a11yClose").onclick = close;
  dlg.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  ["size","font","contrast","motion","d3","sound"].forEach(n => dlg.querySelectorAll(`input[name=${n}]`).forEach(inp => {
    inp.checked = prefs[n] === inp.value;
    inp.onchange = () => { prefs[n] = inp.value; applyPrefs(); if (n === "d3" && window.__ra3Rerender) window.__ra3Rerender(); };
  }));
}

/* ================================================== Moviment i efectes (pautes HyperFrames: transformacions i opacitat) */
const still = () => prefs.motion === "off" || matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap;
const fx = (targets, from, extra) => { if (still()) return; const tg = typeof targets === "string" ? document.querySelectorAll(targets) : targets; if (!tg || tg.length === 0) return; gsap.from(tg, Object.assign({duration:.5, ease:"power3.out", clearProps:"transform,opacity,visibility"}, from, extra || {})); };
let audioCtx = null;
function tone(kind){
  if (prefs.sound !== "on") return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = kind === "ok" ? [660, 880] : kind === "win" ? [523, 659, 784, 1047] : [220, 180];
    notes.forEach((f, i) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(), t0 = audioCtx.currentTime + i * .09;
      o.type = kind === "bad" ? "sawtooth" : "sine"; o.frequency.value = f; g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(kind === "bad" ? .05 : .09, t0 + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + .22);
      o.connect(g).connect(audioCtx.destination); o.start(t0); o.stop(t0 + .25); });
  } catch(e) {}
}
function burst(el, colors, n){
  if (still() || !el) return;
  const r = el.getBoundingClientRect(), layer = document.createElement("div"); layer.className = "fxlayer"; document.body.appendChild(layer);
  const cx = r.left + r.width / 2, cy = r.top + Math.min(r.height / 2, 60);
  for (let i = 0; i < n; i++){
    const p = document.createElement("i"), a = (i / n) * Math.PI * 2, d = 50 + (i * 37) % 70;
    p.style.cssText = `left:${cx}px;top:${cy}px;background:${colors[i % colors.length]}`; layer.appendChild(p);
    gsap.fromTo(p, {x:0, y:0, scale:1, opacity:1}, {x:Math.cos(a) * d, y:Math.sin(a) * d - 20, scale:0, opacity:0, duration:.8, ease:"power2.out"});
  }
  setTimeout(() => layer.remove(), 900);
}
function confetti(){
  if (still()) return;
  const layer = document.createElement("div"); layer.className = "fxlayer"; document.body.appendChild(layer);
  const cols = ["#0e8a5f","#2a5db0","#f2b880","#e07a5f","#8a3b78","#f2c14e"];
  for (let i = 0; i < 70; i++){
    const p = document.createElement("i"); p.className = "cf"; p.style.cssText = `left:${(i * 53) % 100}vw;top:-20px;background:${cols[i % cols.length]}`; layer.appendChild(p);
    gsap.to(p, {y:innerHeight + 40, x:((i * 29) % 120) - 60, rotation:(i % 2 ? 1 : -1) * (180 + i * 7), duration:1.6 + (i % 7) * .15, delay:(i % 10) * .04, ease:"power1.in"});
  }
  setTimeout(() => layer.remove(), 2800);
}
function reactTo(card, delta, max){
  if (!card) return;
  if (delta >= max){ tone("ok"); burst(card.querySelector(".pts") || card, ["#0e8a5f","#3fcf93","#f2c14e"], 18); if (!still()) gsap.fromTo(card, {boxShadow:"0 0 0 0 rgba(14,138,95,.0)"}, {boxShadow:"0 0 0 10px rgba(14,138,95,.25)", duration:.35, yoyo:true, repeat:1, clearProps:"boxShadow"}); }
  else if (delta > 0){ tone("ok"); burst(card.querySelector(".pts") || card, ["#f2c14e","#f2b880"], 10); }
  else { tone("bad"); if (!still()){ gsap.fromTo(card, {x:0}, {keyframes:[{x:-10},{x:10},{x:-7},{x:7},{x:-3},{x:0}], duration:.45, ease:"none", clearProps:"transform"});
    gsap.fromTo(card, {backgroundColor:"rgba(179,38,30,.16)"}, {backgroundColor:"rgba(179,38,30,0)", duration:.8, clearProps:"backgroundColor"}); } }
}

/* ================================================== Veu */
let speaking = null;
function speak(text, btn){
  if (!("speechSynthesis" in window)){ if (btn) btn.querySelector("span").textContent = t("noVoice"); return; }
  if (speaking === btn && speechSynthesis.speaking){ speechSynthesis.cancel(); btn.classList.remove("on"); speaking = null; return; }
  speechSynthesis.cancel(); document.querySelectorAll(".say.on").forEach(b => b.classList.remove("on"));
  const u = new SpeechSynthesisUtterance(text.replace(/\s+/g, " ").trim());
  const want = LANG() === "es" ? /^es/i : /^ca/i, vs = speechSynthesis.getVoices(); const v = vs.find(x => want.test(x.lang)) || vs.find(x => /^es/i.test(x.lang));
  u.lang = v ? v.lang : (LANG() === "es" ? "es-ES" : "ca-ES"); if (v) u.voice = v; u.rate = .95;
  u.onend = u.onerror = () => { btn && btn.classList.remove("on"); speaking = null; };
  speaking = btn; btn && btn.classList.add("on"); speechSynthesis.speak(u);
}
const sayBtn = text => `<button type="button" class="say" data-act="say" data-text="${esc(text)}">${SPEAK_ICON}<span>${t("listen")}</span></button>`;

/* ================================================== Activitat */
function startApp(USER){
  const {CASES, COMPS, TRAPS, PHASES, HINTS} = window.RA3_CASES;
  const ES = () => window.RA3_ES || {}, TESTS = window.RA3_TESTS || {};
  const KEY = "ra3-malaltia-v2:" + USER;   // v2: preguntes i punts nous; el progrés de la v1 no s'hi barreja
  const fresh = () => ({step:"wizard", wiz:0, dia:0, name:"", caseId:null, ans:{}, hints:[], seen:[]});
  let S = fresh();
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch(e) {}
  const stored = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch(e){ return null; } };
  const sync = () => { S = RA3.mergeState(S, stored()); };   // una altra pestanya pot haver respost abans
  const save = () => { sync(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} };
  addEventListener("storage", e => { if (e.key === KEY){ sync(); render(); } });
  const tmp = {}, pick = {};       // seleccions encara no comprovades; targeta triada per classificar
  let infoTest = null;
  const main = $("#main");
  const CASE = () => CASES[S.caseId];
  const ph = i => S.caseId ? RA3.phaseScore(CASE().phases[i], S.ans, S.hints) : 0;
  const total = () => [0,1,2,3,4].reduce((s, i) => s + ph(i), 0);
  const errors = () => S.caseId ? CASE().phases.reduce((s, p) => s + p.items.reduce((u, it) => u + RA3.itemErrors(it, S.ans[it.id]), 0), 0) : 0;
  const answered = it => S.ans[it.id] !== undefined;
  const nameOk = n => String(n || "").trim().split(/\s+/).filter(w => w.length >= 2).length >= 2;
  const signed = n => (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n);
  const seed = id => USER + "|" + id;

  /* --- contingut traduït (el català és la font; el castellà és una capa per id) */
  const sh = () => (LANG() === "es" && ES().shared) || null;
  const PH = i => { const s = sh(); return s ? Object.assign({}, PHASES[i], s.phases[i]) : PHASES[i]; };
  const caseTx = k => { const c = CASE(), e = LANG() === "es" && ES()[c.id]; return (e && e[k]) || (k === "ofici" ? c.patient.ofici : c[k]); };
  const compsL = () => { const s = sh(); if (!s) return COMPS; const o = {}; Object.keys(COMPS).forEach(k => { o[k] = Object.assign({}, COMPS[k], {t:s.comps[k] || COMPS[k].t}); }); return o; };
  const trapsL = () => { const s = sh(); return s ? Object.assign({}, TRAPS, s.traps) : TRAPS; };
  const spotName = s => { const x = sh(); return (x && x.spots[s]) || SCENES.SPOT_NAMES[s] || s; };
  const hintL = h => { const s = sh(); if (!s) return h; const m = h.id.match(/-h(\d)([abc])$/); const tr = m && s.hints[+m[1] - 1] && s.hints[+m[1] - 1]["abc".indexOf(m[2])]; return tr ? Object.assign({}, h, tr) : h; };
  function testL(x){
    const info = TESTS[x.id], e = LANG() === "es" && ES()[S.caseId] && ES()[S.caseId].tests && ES()[S.caseId].tests[x.id];
    const name = info ? info[LANG()].name : (e && e.t) || x.t;
    return Object.assign({}, x, {t:name, result:Object.assign({}, x.result, e ? {label:e.label || x.result.label, text:e.text || x.result.text} : {})});
  }
  function L(it){
    const e = LANG() === "es" && ES()[S.caseId] && ES()[S.caseId].items && ES()[S.caseId].items[it.id];
    const map = (arr, m) => arr && arr.map(o => Object.assign({}, o, {t:(m && m[o.id]) || o.t}));
    const o = Object.assign({}, it);
    if (e){ ["prompt","say","why"].forEach(k => { if (e[k]) o[k] = e[k]; }); o.options = map(it.options, e.options); o.bins = map(it.bins, e.bins); o.cards = map(it.cards, e.cards); o.steps = map(it.steps, e.steps); }
    if (it.tests) o.tests = it.tests.map(testL);
    return o;
  }
  /* ordre de les preguntes: fase 1 com és (diàleg); explorar i proves primer; la resta barrejada */
  function itemsOf(pi){
    const items = CASE().phases[pi].items;
    if (pi === 0) return items;
    const anchor = items.filter(it => it.explore || it.type === "tests"), rest = items.filter(it => !anchor.includes(it));
    return anchor.concat(RA3.shuffleFor(seed("fase" + pi), rest));
  }
  const optsOf = it => it.timeline ? it.options : RA3.shuffleFor(seed(it.id), it.options);

  /* --- capçalera */
  let shown = 0;
  function renderBar(){
    const cur = typeof S.step === "number" ? S.step : S.step === "report" ? 6 : 0;
    $("#steps").innerHTML = PHASES.map((p, i) => `<li class="${i + 1 < cur ? "done" : i + 1 === cur ? "now" : ""}"${i + 1 === cur ? ' aria-current="step"' : ""}><span>${i + 1}</span> ${esc(PH(i).title)}</li>`).join("");
    const to = total(), sc = $("#score");
    if (!S.caseId){ sc.innerHTML = ""; return; }
    sc.innerHTML = `<b id="scoreN">${shown}</b> <small>/ 1000 ${t("pts")}</small>`;
    if (to === shown) return;
    if (still()){ shown = to; $("#scoreN").textContent = to; return; }
    const o = {v:shown}; shown = to;
    gsap.to(o, {v:to, duration:.8, ease:"power2.out", onUpdate:() => { const n = $("#scoreN"); if (n) n.textContent = Math.round(o.v); }});
    gsap.fromTo(sc, {scale:1.15}, {scale:1, duration:.5, ease:"back.out(3)", clearProps:"transform"});
  }

  /* --- render general */
  let lastView = null, stage = null;
  function render(focusSel){
    renderBar();
    const view = S.step === "wizard" ? "wizard-" + S.wiz : S.step === "diabetes" ? "dia-" + S.dia : String(S.step);
    if (S.step === "wizard") main.innerHTML = wizard();
    else if (S.step === "diabetes") main.innerHTML = window.DIABETES.view(S.dia, LANG());
    else if (S.step === "report") main.innerHTML = report();
    else main.innerHTML = phaseView(S.step - 1);
    mountStage();
    if (view !== lastView){
      lastView = view;
      if (S.step === "report") introReport();
      else if (S.step === "diabetes") window.DIABETES.play(main, S.dia, still());
      else { fx(".scenebox", {autoAlpha:0, scale:.97, duration:.6}); fx(".wiz > *, .pcol > *", {autoAlpha:0, y:18}, {stagger:.05, delay:.1}); }
    }
    if (focusSel){ const el = main.querySelector(focusSel); if (el) el.focus({preventScroll:false}); }
  }
  window.__ra3Rerender = () => { if (stage){ stage.api.dispose(); stage = null; } lastView = null; render(); };

  /* --- escenes 3D: es mantenen vives entre renders perquè no es perdi la càmera */
  const use3D = () => prefs.d3 !== "off" && window.STAGE3D && STAGE3D.supported();
  const DEVICE_TEST = {"Negatoscopi":"radiografia", "Monitor d'ECG":"ecg", "Tubs d'analítica":"sang", "Centrífuga":"orina", "Microscopi":"citologia"};
  function stageOpts(kind){
    const c = CASE(), s = sh(), names = {spots:Object.fromEntries(Object.keys(SCENES.SPOT_NAMES).map(k => [k, spotName(k)])), agents:s ? s.agents : null, devices:s ? s.devices : null};
    if (kind === "pharmacy"){ const items = itemsOf(0), cur = items.find(it => !answered(it)); const said = items.filter(it => it.say && (answered(it) || it === cur)).map(L); return {patient:c.patient, names, signText:LANG() === "es" ? "FARMACIA" : "FARMÀCIA", say:(said[said.length - 1] || L(items[0])).say}; }
    if (kind === "lab"){ const it = c.phases[1].items.find(x => x.icons); return {names, models:it.options.map(o => o.id), selected:answered(it) ? S.ans[it.id] : tmp[it.id], onPick:id => { if (answered(it)) return; tmp[it.id] = id; render(); const q = $("#q-" + it.id); if (q) q.scrollIntoView({block:"nearest", behavior: still() ? "auto" : "smooth"}); }}; }
    if (kind === "consult"){ const ex = c.phases[2].items.find(it => it.explore); return {names, patient:c.patient, spots:[...new Set(ex.cards.map(k => k.spot))], seen:S.seen.slice(), onSpot:explore}; }
    if (kind === "tests") return {names, onDevice:dev => { const id = DEVICE_TEST[dev]; if (!id) return; infoTest = id; render(); const p = $("#testInfo"); if (p) p.scrollIntoView({block:"nearest", behavior: still() ? "auto" : "smooth"}); }};
    return {names};
  }
  function mountStage(){
    const slot = main.querySelector(".stage-slot");
    if (!slot || !use3D()){ if (stage){ stage.api.dispose(); stage = null; } return; }
    const kind = slot.dataset.kind, key = kind + ":" + S.caseId + ":" + LANG(), opts = stageOpts(kind);
    slot.innerHTML = ""; slot.classList.add("is3d", "k-" + kind);
    if (stage && stage.key === key){ slot.appendChild(stage.api.el); stage.api.update(opts); return; }
    if (stage) stage.api.dispose();
    try { stage = {key, api:STAGE3D[kind === "tests" ? "testsRoom" : kind](slot, opts)}; }
    catch(err){ stage = null; slot.classList.remove("is3d"); slot.innerHTML = slot.dataset.fallback ? decodeURIComponent(slot.dataset.fallback) : ""; }
  }
  const goTop = () => { window.scrollTo(0, 0); main.focus({preventScroll:true}); };

  /* ================================================== Assistent d'instruccions */
  const WIZ = [
    {t:() => t("w1"), b:() => `<label class="fl" for="wName">${t("nameLbl")}</label><input id="wName" type="text" autocomplete="name" value="${esc(S.name)}" placeholder="${t("namePh")}"><p class="lgerr" id="wErr" role="alert"></p><p>${t("w1a")}</p><p>${t("w1b")}</p><div class="wizart">${SCENES.technicianArt()}</div>`},
    {t:() => t("w2"), b:() => `<ol class="phlist">${PHASES.map((p, i) => `<li><b>${esc(PH(i).title)}</b> <span class="muted">${esc(PH(i).place)}</span><br>${t("phaseDesc")[i]}</li>`).join("")}</ol>`},
    {t:() => t("w3"), b:() => `<ul class="rules">${t("rules").map(r => `<li>${r}</li>`).join("")}</ul>`},
    {t:() => t("w4"), b:() => `<p>${t("w4a")}</p><p>${t("w4b")}</p><p class="muted">${t("w4c")}</p>`},
    {t:() => t("w5"), b:() => `<p>${t("w5a", esc(S.name))}</p><p class="muted">${t("w5b")}</p>`}
  ];
  function wizard(){
    const w = WIZ[S.wiz], last = S.wiz === WIZ.length - 1;
    return `<section class="wiz" aria-labelledby="wTitle">
      <ol class="dots" aria-label="${t("wizStep", S.wiz + 1, WIZ.length)}">${WIZ.map((_, i) => `<li class="${i < S.wiz ? "done" : i === S.wiz ? "now" : ""}"></li>`).join("")}</ol>
      <p class="muted small">${t("wizStep", S.wiz + 1, WIZ.length)}</p>
      <h1 id="wTitle" class="ptitle">${esc(w.t())}</h1>
      <div class="wbody">${w.b()}</div>
      <div class="row wnav">${S.wiz > 0 ? `<button type="button" class="btn ghost" data-act="wprev">${t("prev")}</button>` : ""}
        ${last ? `<button type="button" class="btn" data-act="start">${t("toDiabetes")}</button>` : `<button type="button" class="btn" data-act="wnext">${t("next")}</button>`}</div>
    </section>`;
  }

  /* ================================================== Fases */
  const slot = (kind, svg) => `<div class="stage-slot" data-kind="${kind}" data-fallback="${encodeURIComponent(svg)}">${svg}</div>`;
  function sceneFor(pi, cur){
    const c = CASE(), p = c.patient;
    if (pi === 0){
      const items = itemsOf(0), said = items.filter(it => it.say && (answered(it) || it === cur)).map(L);
      const say = said.length ? said[said.length - 1].say : L(items[0]).say;
      return `<div class="scenebox">${slot("pharmacy", SCENES.pharmacy(p))}<div class="bubble" role="note"><b>${esc(p.nom)}</b><p>${esc(say)}</p>${sayBtn(say)}</div></div>`;
    }
    if (pi === 1) return `<div class="scenebox">${slot("lab", SCENES.lab())}</div>`;
    if (pi === 2){ const ex = c.phases[2].items.find(it => it.explore); return `<div class="scenebox">${slot("consult", SCENES.consult(p, [...new Set(ex.cards.map(k => k.spot))], S.seen))}</div>`; }
    if (pi === 3) return `<div class="scenebox">${slot("tests", SCENES.testsScene())}</div>`;
    return `<div class="scenebox">${SCENES.deskScene(p)}</div>`;
  }
  function hintsBox(phase){
    return `<div class="hints"><p class="small muted">${t("hintsIntro")}</p>${phase.hints.map(h0 => {
      const h = hintL(h0), used = S.hints.includes(h.id);
      return `<details class="hint${used ? " used" : ""}" data-hint="${h.id}"${used ? " open" : ""}><summary>${esc(h.title)} <span class="cost">${used ? t("hintUsed") : t("hintCost")}</span></summary><p>${esc(h.text)}</p></details>`; }).join("")}</div>`;
  }
  function comparison(){
    const c = CASE(), ex = L(c.phases[2].items.find(it => it.explore)), tst = L(c.phases[3].items.find(it => it.type === "tests"));
    const req = S.ans[tst.id] || [], binT = id => ex.bins.find(b => b.id === id).t;
    return `<div class="compare"><div><h3>${t("clinic")}</h3><ul>${ex.cards.map(k => `<li><span class="tag ${k.a}">${esc(binT(k.a))}</span> ${esc(k.t)}</li>`).join("")}</ul></div>
      <div><h3>${t("results")}</h3>${req.length ? `<ul>${tst.tests.filter(x => req.includes(x.id)).map(x => `<li><b>${esc(x.result.label)}:</b> ${esc(x.result.text)}</li>`).join("")}</ul>` : `<p class="muted">${t("noTests")}</p>`}</div></div>`;
  }
  function phaseView(pi){
    const c = CASE(), phase = c.phases[pi], P = PH(pi), items = itemsOf(pi);
    const cur = items.find(it => !answered(it)), shownItems = items.filter(it => answered(it) || it === cur), done = !cur;
    return `<section class="phase" aria-labelledby="phTitle">
      ${sceneFor(pi, cur)}
      <div class="pcol">
        <p class="muted small">${esc(t("phaseOf", pi + 1, P.place, caseTx("name")))}</p>
        <h1 id="phTitle" class="ptitle">${esc(P.title)}</h1>
        ${pi === 0 ? `<p class="lead">${esc(caseTx("intro"))}</p>` : ""}
        ${pi === 4 ? comparison() : ""}
        ${hintsBox(phase)}
        <div class="items">${shownItems.map(it => itemCard(it)).join("")}</div>
        <div class="phfoot">${done ? `<p class="phscore">${t("phaseScore", pi + 1, ph(pi))}</p><button type="button" class="btn big" data-act="next" id="nextBtn">${pi < 4 ? esc(t("nextPhase", pi + 2, PH(pi + 1).title.toLowerCase())) : t("toReport")}</button>` : `<p class="small muted">${t("qOf", shownItems.length, items.length)}</p>`}</div>
      </div>
    </section>`;
  }

  /* --- targetes de pregunta */
  function itemCard(it0){
    const it = L(it0), done = answered(it0);
    const d = done ? RA3.itemDelta(it0, S.ans[it0.id]) : 0, max = RA3.itemMax(it0);
    const speech = it.prompt + (it.options ? ". " + optsOf(it).map(o => o.t).join(". ") : "");
    return `<article class="q${done ? " done" : " active"}" id="q-${it.id}" tabindex="-1">
      <header class="qhead"><h2>${esc(it.prompt)}</h2><span class="pts">${done ? `<b class="${d > 0 ? "ok" : d < 0 ? "bad" : ""}">${signed(d)}</b> / ${max}` : t("ptsN", max)}</span></header>
      ${sayBtn(speech)}
      ${done ? feedback(it) : interact(it)}
    </article>`;
  }
  function interact(it){
    const cur = tmp[it.id];
    if (it.type === "single"){
      const cls = it.icons ? "opts tiles" : it.timeline ? "opts timeline" : "opts";
      return `<div class="${cls}" role="group">${optsOf(it).map(o => `<button type="button" class="opt" data-act="pick" data-item="${it.id}" data-opt="${o.id}" aria-pressed="${cur === o.id}">${it.icons && SCENES.ICONS[o.id] ? SCENES.ICONS[o.id] : ""}<span>${esc(o.t)}</span></button>`).join("")}</div>
        <button type="button" class="btn" data-act="check" data-item="${it.id}"${cur ? "" : " disabled"}>${t("check")}</button>`;
    }
    if (it.type === "multi"){
      const sel = cur || [];
      return `<p class="small muted">${t("multiHint")}</p><div class="opts" role="group">${optsOf(it).map(o => `<button type="button" class="opt chk" data-act="tog" data-item="${it.id}" data-opt="${o.id}" aria-pressed="${sel.includes(o.id)}"><span>${esc(o.t)}</span></button>`).join("")}</div>
        <button type="button" class="btn" data-act="check" data-item="${it.id}"${sel.length ? "" : " disabled"}>${t("check")}</button>`;
    }
    if (it.type === "classify"){
      const sel = cur || {}, cards = RA3.shuffleFor(seed(it.id), it.cards).filter(k => !it.explore || S.seen.includes(k.spot));
      const spotsLeft = it.explore ? [...new Set(it.cards.map(k => k.spot))].filter(s => !S.seen.includes(s)) : [];
      const chip = k => `<button type="button" class="chip${pick[it.id] === k.id ? " picked" : ""}" data-act="chip" data-item="${it.id}" data-card="${k.id}" aria-pressed="${pick[it.id] === k.id}">${esc(k.t)}</button>`;
      return `${it.explore ? `<p class="explore">${spotsLeft.length ? t("explore", spotsLeft.length) + `</p><p class="row">${spotsLeft.map(s => `<button type="button" class="btn ghost small" data-act="spot" data-spot="${s}">${esc(t("exploreBtn", spotName(s).toLowerCase()))}</button>`).join("")}` : t("explored")}</p>` : ""}
        <p class="small muted">${t("dragHint")}</p>
        <div class="pool" aria-label="${t("pool")}" data-item="${it.id}">${cards.filter(k => !sel[k.id]).map(chip).join("")}</div>
        <div class="zones" style="--n:${it.bins.length}">${it.bins.map(b => `<div class="zone b-${b.id}" data-zone="${b.id}" data-item="${it.id}"><button type="button" class="zhead" data-act="zone" data-item="${it.id}" data-bin="${b.id}">${esc(b.t)}</button><div class="zbody">${cards.filter(k => sel[k.id] === b.id).map(chip).join("")}</div></div>`).join("")}</div>
        <button type="button" class="btn" data-act="check" data-item="${it.id}"${it.cards.every(k => sel[k.id]) ? "" : " disabled"}>${t("check")}</button>`;
    }
    if (it.type === "order"){
      if (!cur){ let ids = RA3.shuffleFor(seed(it.id), it.steps).map(s => s.id); if (ids.join() === it.steps.map(s => s.id).join()) ids.push(ids.shift()); tmp[it.id] = ids; }
      const ids = tmp[it.id], byId = id => it.steps.find(s => s.id === id);
      return `<p class="small muted">${t("orderHint")}</p><ol class="ordlist" data-item="${it.id}">${ids.map((id, i) => `<li class="ord" data-step="${id}"><span class="grip" aria-hidden="true">⠿</span><span class="on">${i + 1}</span><span class="ot">${esc(byId(id).t)}</span>
        <span class="oarrows"><button type="button" class="sc" data-act="up" data-item="${it.id}" data-step="${id}" aria-label="${t("up")}"${i === 0 ? " disabled" : ""}>↑</button><button type="button" class="sc" data-act="down" data-item="${it.id}" data-step="${id}" aria-label="${t("down")}"${i === ids.length - 1 ? " disabled" : ""}>↓</button></span></li>`).join("")}</ol>
        <button type="button" class="btn" data-act="check" data-item="${it.id}">${t("check")}</button>`;
    }
    if (it.type === "tests"){
      const sel = cur || [];
      return `<p class="small muted">${t("testsHint")}</p><div class="opts tests" role="group">${RA3.shuffleFor(seed(it.id), it.tests).map(x => `<div class="testopt"><button type="button" class="opt chk" data-act="tog" data-item="${it.id}" data-opt="${x.id}" aria-pressed="${sel.includes(x.id)}"><span>${esc(x.t)}</span></button><button type="button" class="infob" data-act="info" data-test="${x.id}" aria-label="${t("info")}: ${esc(x.t)}" aria-expanded="${infoTest === x.id}">ⓘ</button></div>`).join("")}</div>
        ${testInfo()}
        <button type="button" class="btn" data-act="check" data-item="${it.id}"${sel.length ? "" : " disabled"}>${t("ask")}</button>`;
    }
    return "";
  }
  function testInfo(){
    const x = infoTest && TESTS[infoTest]; if (!x) return "";
    const L1 = x[LANG()];
    return `<aside class="tinfo" id="testInfo" role="region" aria-label="${t("info")}"><div class="tihead"><span class="tiico">${(SCENES.TEST_ICONS || {})[x.icon] || ""}</span><h3>${esc(L1.name)}</h3><button type="button" class="btn ghost small" data-act="info" data-test="${infoTest}">${t("close")}</button></div>
      <p class="badges"><span class="badge ${x.ionizing ? "warn" : "ok"}">${x.ionizing ? t("ionizing") : t("noIonizing")}</span><span class="badge ${x.invasive ? "warn" : "ok"}">${x.invasive ? t("invasive") : t("nonInvasive")}</span></p>
      <dl><dt>${t("what")}</dt><dd>${esc(L1.what)}</dd><dt>${t("why")}</dt><dd>${esc(L1.why)}</dd><dt>${t("how")}</dt><dd>${esc(L1.how)}</dd></dl></aside>`;
  }
  function feedback(it){
    const a = S.ans[it.id];
    let body = "";
    if (it.type === "single"){
      const ok = a === it.a, chosen = it.options.find(o => o.id === a), right = it.options.find(o => o.id === it.a);
      body = `<p class="verdict ${ok ? "ok" : "bad"}">${ok ? t("correct") : t("wrong")}: ${esc(t("chose", chosen.t))}</p>${ok ? "" : `<p>${t("rightIs", esc(right.t))}</p>`}`;
    } else if (it.type === "multi"){
      body = `<ul class="fb">${optsOf(it).map(o => { const s = a.includes(o.id), r = it.a.includes(o.id);
        return (s || r) ? `<li class="${s && r ? "ok" : "bad"}">${s && r ? t("hit") : s ? t("extra") : t("missed")}: ${esc(o.t)}</li>` : ""; }).join("")}</ul>`;
    } else if (it.type === "classify"){
      const binT = id => it.bins.find(b => b.id === id).t;
      body = `<ul class="fb">${it.cards.map(k => { const ok = a[k.id] === k.a;
        return `<li class="${ok ? "ok" : "bad"}">${esc(k.t)}: <b>${esc(binT(a[k.id]))}</b>${ok ? "" : ` (${esc(t("isReally", binT(k.a).toLowerCase()))})`}</li>`; }).join("")}</ul>`;
    } else if (it.type === "order"){
      body = `<ol class="fb">${a.map((id, i) => { const st = it.steps.find(s => s.id === id), ok = it.steps[i].id === id, right = it.steps.findIndex(s => s.id === id) + 1;
        return `<li class="${ok ? "ok" : "bad"}">${esc(st.t)} · <span class="small">${ok ? t("posOk") : t("posBad", right)}</span></li>`; }).join("")}</ol>`;
    } else if (it.type === "tests"){
      body = `<div class="results">${it.tests.filter(x => a.includes(x.id)).map((x, i) => `<figure class="res k-${x.kind}" style="animation-delay:${i * 120}ms">${SCENES.result(x.result.viz, x)}<figcaption><b>${esc(x.result.label)}</b><span class="kind">${t("kind")[x.kind]} · ${x.kind === "need" ? "+" + x.pts : x.kind === "no" ? "−" + Math.round(x.pts / 2) : "0"} ${t("pts")}</span><span>${esc(x.result.text)}</span></figcaption></figure>`).join("")}</div>
        ${it.tests.filter(x => x.kind === "need" && !a.includes(x.id)).map(x => `<p class="verdict bad">${esc(t("missedTest", x.t))}</p>`).join("")}`;
    }
    return `<div class="feedback">${body}<p class="why"><b>${t("whyLbl")}</b> ${esc(it.why)}</p></div>`;
  }

  /* ================================================== Informe final */
  function fields(){ return {email:USER, name:S.name, caseId:S.caseId, phases:[0,1,2,3,4].map(ph), hints:S.hints.length, errors:errors(), total:total()}; }
  function chart(scores){
    const W = 520, H = 220, bw = 64, gap = (W - 60 - bw * 5) / 4;
    return `<svg class="chart" viewBox="0 0 ${W} ${H + 40}" role="img" aria-label="${t("chartLbl")}: ${scores.map((s, i) => PH(i).title + " " + s + " / 200").join(", ")}">
      ${[0,50,100,150,200].map(v => `<line x1="40" x2="${W}" y1="${H - v}" y2="${H - v}" class="grid"/><text x="32" y="${H - v + 4}" text-anchor="end" class="ax">${v}</text>`).join("")}
      ${scores.map((s, i) => { const x = 50 + i * (bw + gap);
        return `<rect class="barbg" x="${x}" y="${H - 200}" width="${bw}" height="200" rx="6"/><rect class="bar growy" style="animation-delay:${i * 90}ms" x="${x}" y="${H - s}" width="${bw}" height="${Math.max(s, 0)}" rx="6"/><text x="${x + bw / 2}" y="${H - s - 8}" text-anchor="middle" class="val">${s}</text><text x="${x + bw / 2}" y="${H + 22}" text-anchor="middle" class="ax">${esc(PH(i).title.replace(/^(El|La|Les|Las|Los) /, ""))}</text>`; }).join("")}
    </svg>`;
  }
  function introReport(){
    fx(".rhead > div:first-child > *", {autoAlpha:0, y:16}, {stagger:.07});
    const b = $(".bignum b"); if (b && !still()){ const fin = b.textContent, n = parseFloat(fin.replace(",", ".")), o = {v:0};
      gsap.to(o, {v:n, duration:1.4, ease:"power2.out", onUpdate:() => { b.textContent = o.v.toFixed(1).replace(".", ","); }, onComplete:() => { b.textContent = fin; if (n >= 5) { confetti(); tone("win"); } }}); }
    fx(".panel", {autoAlpha:0, y:24}, {stagger:.12, delay:.2}); fx(".dq", {autoAlpha:0, scale:.94}, {stagger:.1, delay:.5});
  }
  function report(){
    const f = fields(), c = CASE();
    const d = RA3.dafo(RA3.compStats(c, S.ans), RA3.trapsHit(c, S.ans), S.hints.length, compsL(), trapsL(), LANG());
    const code = RA3.verifCode(f), txt = RA3.resultText(f);
    const q = (k, title, list) => `<div class="dq dq-${k}"><h3>${title}</h3><ul>${list.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
    return `<section class="report" aria-labelledby="rTitle">
      <div class="rhead">
        <div><p class="muted small">${esc(t("repKicker", caseTx("name")))}</p><h1 id="rTitle" class="ptitle">${esc(t("repTitle", S.name.trim().split(/\s+/)[0]))}</h1>
          <p class="lead">${esc(t("repLead", t("patient")[c.patient.nom] || c.patient.nom))}</p></div>
        <div class="bignum"><b>${RA3.grade(f.total)}</b><span>${t("grade")}</span><small>${f.total} / 1000 ${t("pts")}</small></div>
      </div>
      <div class="rgrid">
        <div class="panel">${chart(f.phases)}<p class="small muted">${t("stats", f.errors, f.hints)}</p></div>
        <div class="panel dafo"><h2>${t("profile")}</h2><div class="dgrid">${q("f", t("pF"), d.F)}${q("d", t("pD"), d.D)}${q("o", t("pO"), d.O)}${q("a", t("pA"), d.A)}</div></div>
      </div>
      <div class="panel deliver">
        <h2>${t("deliver")}</h2>
        <p>${t("code")} <span class="code">${code}</span></p>
        <p>${t("deliverTxt")}</p>
        <div class="row"><button type="button" class="btn" data-act="copy" id="copyBtn">${t("copy")}</button><span class="small" id="copied" aria-live="polite"></span></div>
        <textarea class="copy" id="resultTxt" readonly rows="14" aria-label="Text">${esc(txt)}</textarea>
      </div>
    </section>`;
  }

  /* ================================================== Esdeveniments */
  const itemById = id => CASE().phases.flatMap(p => p.items).find(x => x.id === id);
  function place(id, card, bin){ tmp[id] = Object.assign({}, tmp[id], {[card]: bin}); delete pick[id]; render(`[data-act=chip][data-card="${card}"][data-item="${id}"]`); }
  main.addEventListener("click", e => {
    if (dragJustEnded){ dragJustEnded = false; return; }
    const b = e.target.closest("[data-act]"); if (!b) { const sp = e.target.closest(".spot"); if (sp) explore(sp.dataset.spot); return; }
    const act = b.dataset.act, id = b.dataset.item, it = id && S.caseId ? itemById(id) : null;
    if (act === "say") return speak(b.dataset.text, b);
    if (act === "spot") return explore(b.dataset.spot);
    if (act === "info"){ infoTest = infoTest === b.dataset.test ? null : b.dataset.test; render(infoTest ? `#testInfo .btn` : `[data-act=info][data-test="${b.dataset.test}"]`); fx("#testInfo", {autoAlpha:0, y:10}); return; }
    if (act === "wnext"){
      if (S.wiz === 0){ const name = ($("#wName") || {}).value || ""; if (!nameOk(name)){ $("#wErr").textContent = t("nameErr"); $("#wName").focus(); return; } S.name = name.trim().replace(/\s+/g, " "); }
      S.wiz++; save(); render("#wTitle"); return; }
    if (act === "wprev"){ S.wiz--; save(); render("#wTitle"); return; }
    if (act === "start"){ if (!nameOk(S.name)){ S.wiz = 0; save(); render("#wName"); return; } S.step = "diabetes"; S.dia = 0; save(); render("#diaTitle"); goTop(); return; }
    if (act === "dnext"){ S.dia = Math.min(S.dia + 1, window.DIABETES.count - 1); save(); render("#diaTitle"); return; }
    if (act === "dprev"){ S.dia = Math.max(S.dia - 1, 0); save(); render("#diaTitle"); return; }
    if (act === "dreplay"){ lastView = null; render("#diaTitle"); return; }
    if (act === "shift"){ S.caseId = RA3.caseFor(USER); S.step = 1; save(); render(); goTop(); return; }
    if (act === "pick"){ tmp[id] = b.dataset.opt; render(`[data-act=pick][data-opt="${b.dataset.opt}"][data-item="${id}"]`); return; }
    if (act === "tog"){ const s = tmp[id] || []; const o = b.dataset.opt; tmp[id] = s.includes(o) ? s.filter(x => x !== o) : s.concat(o); render(`[data-act=tog][data-opt="${o}"][data-item="${id}"]`); return; }
    if (act === "chip"){ pick[id] = pick[id] === b.dataset.card ? undefined : b.dataset.card; render(`[data-act=chip][data-card="${b.dataset.card}"][data-item="${id}"]`); return; }
    if (act === "zone"){ if (pick[id]) place(id, pick[id], b.dataset.bin); return; }
    if (act === "up" || act === "down"){ const ids = tmp[id], i = ids.indexOf(b.dataset.step), j = act === "up" ? i - 1 : i + 1; if (j < 0 || j >= ids.length) return; [ids[i], ids[j]] = [ids[j], ids[i]]; render(`[data-act=${act}][data-step="${b.dataset.step}"][data-item="${id}"]`); return; }
    if (act === "check"){
      sync();
      if (!it || answered(it) || tmp[id] === undefined){ delete tmp[id]; render(); return; }
      S.ans[id] = it.type === "classify" ? Object.assign({}, tmp[id]) : Array.isArray(tmp[id]) ? tmp[id].slice() : tmp[id];
      delete tmp[id]; delete pick[id]; save(); render();
      const q = $("#q-" + id); if (q){ q.focus({preventScroll:true}); q.scrollIntoView({block:"start", behavior: still() ? "auto" : "smooth"}); }
      reactTo(q, RA3.itemDelta(it, S.ans[id]), RA3.itemMax(it));
      fx(`#q-${id} .feedback`, {autoAlpha:0, y:12}); fx(`#q-${id} .pts b`, {scale:1.8, autoAlpha:0, duration:.6, ease:"back.out(3)"});
      fx(".q.active", {autoAlpha:0, y:22}, {delay:.25}); fx(".phfoot .btn", {autoAlpha:0, y:14, scale:.95}, {delay:.3});
      if (typeof S.step === "number" && CASE().phases[S.step - 1].items.every(answered)) setTimeout(() => { confetti(); tone("win"); }, 350);
      return;
    }
    if (act === "next"){
      if (typeof S.step === "number" && CASE().phases[S.step - 1].items.some(x => !answered(x))) return;   // fases progressives
      infoTest = null; S.step = S.step < 5 ? S.step + 1 : "report"; save(); render(); goTop(); return; }
    if (act === "copy"){
      const msg = $("#copied"), ta = $("#resultTxt"), fallback = () => { ta.focus(); ta.select(); msg.textContent = t("copySel"); };
      try { navigator.clipboard.writeText(ta.value).then(() => { msg.textContent = t("copied"); }, fallback); } catch(err){ fallback(); }
    }
  });
  function explore(spot){
    if (S.step !== 3 || S.seen.includes(spot)) return;
    S.seen.push(spot); save(); render(`.spot[data-spot="${spot}"], [data-act=spot], .q.active`);
  }

  /* --- arrossegar: targetes a caselles i passos d'una seqüència (ratolí i tacte) */
  let drag = null, dragJustEnded = false;
  main.addEventListener("pointerdown", e => {
    const chip = e.target.closest(".chip"), grip = e.target.closest(".ord .grip"), ord = grip && grip.closest(".ord");   // l'ordre s'arrossega només per la nansa: la resta de la fila deixa fer scroll
    if (!chip && !ord) return;
    const el = chip || ord, r = el.getBoundingClientRect();
    drag = {el, chip:!!chip, id:(chip || ord.parentElement).dataset.item, key:chip ? chip.dataset.card : ord.dataset.step, x0:e.clientX, y0:e.clientY, dx:e.clientX - r.left, dy:e.clientY - r.top, ghost:null, moved:false, w:r.width};
  });
  addEventListener("pointermove", e => {
    if (!drag) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 8) return;
    if (!drag.moved){ drag.moved = true; drag.ghost = drag.el.cloneNode(true); drag.ghost.classList.add("dragghost"); drag.ghost.style.width = drag.w + "px"; document.body.appendChild(drag.ghost); drag.el.classList.add("dragging"); }
    e.preventDefault();
    drag.ghost.style.transform = `translate(${e.clientX - drag.dx}px, ${e.clientY - drag.dy}px) rotate(-2deg)`;
    document.querySelectorAll(".zone.over, .ord.over").forEach(z => z.classList.remove("over"));
    const under = document.elementFromPoint(e.clientX, e.clientY);
    const tgt = under && (drag.chip ? under.closest(`.zone[data-item="${drag.id}"]`) : under.closest(`.ordlist[data-item="${drag.id}"] .ord`));
    if (tgt) tgt.classList.add("over");
  }, {passive:false});
  addEventListener("pointercancel", () => { if (!drag) return; if (drag.ghost) drag.ghost.remove(); drag.el.classList.remove("dragging"); drag = null; render(); });
  addEventListener("pointerup", e => {
    if (!drag) return;
    const d = drag; drag = null;
    if (!d.moved) return;
    dragJustEnded = true; setTimeout(() => { dragJustEnded = false; }, 0);
    d.ghost.remove(); d.el.classList.remove("dragging");
    const under = document.elementFromPoint(e.clientX, e.clientY);
    if (d.chip){
      const zone = under && under.closest(`.zone[data-item="${d.id}"]`), pool = under && under.closest(`.pool[data-item="${d.id}"]`);
      if (zone) place(d.id, d.key, zone.dataset.zone);
      else if (pool){ const s = Object.assign({}, tmp[d.id]); delete s[d.key]; tmp[d.id] = s; render(); }
      else render();   // fora de qualsevol casella: la targeta torna on era
    } else {
      const li = under && under.closest(`.ordlist[data-item="${d.id}"] .ord`), ids = tmp[d.id];
      if (li && li.dataset.step !== d.key){ const from = ids.indexOf(d.key), to = ids.indexOf(li.dataset.step); ids.splice(from, 1); ids.splice(to, 0, d.key); }
      render(`.ordlist[data-item="${d.id}"] .ord[data-step="${d.key}"] .sc:not([disabled])`);
    }
  });
  main.addEventListener("keydown", e => {
    const sp = e.target.closest && e.target.closest(".spot");
    if (sp && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); explore(sp.dataset.spot); }
    if (e.target.id === "wName" && e.key === "Enter"){ e.preventDefault(); main.querySelector("[data-act=wnext]").click(); }
  });
  main.addEventListener("toggle", e => {
    const d = e.target; if (!d.matches || !d.matches("details.hint") || !d.open) return;
    sync();
    if (!S.hints.includes(d.dataset.hint)){ S.hints.push(d.dataset.hint); save(); d.classList.add("used"); d.querySelector(".cost").textContent = t("hintUsed"); renderBar(); }
  }, true);
  main.addEventListener("input", e => { if (e.target.id === "wName") S.name = e.target.value; });

  applyStatic();
  render();
}

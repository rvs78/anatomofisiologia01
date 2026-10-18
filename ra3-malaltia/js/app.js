/* Lògica de la interfície · El cas del taulell (RA3 La malaltia) */
"use strict";
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const SPEAK_ICON = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

/* ================================================== Preferències de lectura */
const PREF_KEY = "ra3-malaltia-prefs";
const prefs = Object.assign({size:"m", contrast:"normal", font:"atkinson", motion:"on"}, (() => { try { return JSON.parse(localStorage.getItem(PREF_KEY)) || {}; } catch(e){ return {}; } })());
function applyPrefs(){
  const r = document.documentElement;
  r.dataset.size = prefs.size; r.dataset.font = prefs.font; r.dataset.motion = prefs.motion;
  if (prefs.contrast === "high") r.dataset.contrast = "high"; else delete r.dataset.contrast;
  try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch(e) {}
}
function initA11y(){
  const btn = $("#a11yBtn"), dlg = $("#a11y");
  const close = () => { dlg.hidden = true; btn.setAttribute("aria-expanded", "false"); btn.focus(); };
  btn.onclick = () => { const open = dlg.hidden; dlg.hidden = !open; btn.setAttribute("aria-expanded", String(open)); if (open) dlg.querySelector("input:checked").focus(); };
  $("#a11yClose").onclick = close;
  dlg.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  ["size","font","contrast","motion"].forEach(n => dlg.querySelectorAll(`input[name=${n}]`).forEach(inp => {
    inp.checked = prefs[n] === inp.value;
    inp.onchange = () => { prefs[n] = inp.value; applyPrefs(); };
  }));
}

/* ================================================== Veu */
let speaking = null;
function speak(text, btn){
  if (!("speechSynthesis" in window)){ if (btn) btn.querySelector("span").textContent = "Lectura no disponible"; return; }
  if (speaking === btn && speechSynthesis.speaking){ speechSynthesis.cancel(); btn.classList.remove("on"); speaking = null; return; }
  speechSynthesis.cancel(); document.querySelectorAll(".say.on").forEach(b => b.classList.remove("on"));
  const u = new SpeechSynthesisUtterance(text.replace(/\s+/g, " ").trim());
  const vs = speechSynthesis.getVoices(); const v = vs.find(x => /^ca/i.test(x.lang)) || vs.find(x => /^es/i.test(x.lang));
  u.lang = v ? v.lang : "ca-ES"; if (v) u.voice = v; u.rate = .95;
  u.onend = u.onerror = () => { btn && btn.classList.remove("on"); speaking = null; };
  speaking = btn; btn && btn.classList.add("on"); speechSynthesis.speak(u);
}
const sayBtn = (text, label) => `<button type="button" class="say" data-act="say" data-text="${esc(text)}">${SPEAK_ICON}<span>${label || "Escolta"}</span></button>`;

/* ================================================== Activitat */
function startApp(USER){
  const {CASES, COMPS, TRAPS, PHASES} = window.RA3_CASES;
  const KEY = "ra3-malaltia:" + USER;
  const fresh = () => ({step:"wizard", wiz:0, name:"", caseId:null, ans:{}, hints:[], seen:[]});
  let S = fresh();
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch(e) {}
  const stored = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch(e){ return null; } };
  const sync = () => { S = RA3.mergeState(S, stored()); };   // una altra pestanya pot haver respost abans
  const save = () => { sync(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} };
  addEventListener("storage", e => { if (e.key === KEY){ sync(); render(); } });
  const tmp = {};                 // seleccions encara no comprovades (no es desen)
  const main = $("#main");
  const CASE = () => CASES[S.caseId];
  const ph = i => S.caseId ? RA3.phaseScore(CASE().phases[i], S.ans, S.hints) : 0;
  const total = () => [0,1,2,3,4].reduce((s, i) => s + ph(i), 0);
  const errors = () => S.caseId ? CASE().phases.reduce((s, p) => s + p.items.reduce((t, it) => t + RA3.itemErrors(it, S.ans[it.id]), 0), 0) : 0;
  const answered = it => S.ans[it.id] !== undefined;
  const signed = n => (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n);

  /* --- capçalera */
  function renderBar(){
    const cur = typeof S.step === "number" ? S.step : S.step === "report" ? 6 : 0;
    $("#steps").innerHTML = PHASES.map((p, i) => `<li class="${i + 1 < cur ? "done" : i + 1 === cur ? "now" : ""}"${i + 1 === cur ? ' aria-current="step"' : ""}><span>${i + 1}</span> ${esc(p.title)}</li>`).join("");
    $("#score").innerHTML = S.caseId ? `${total()} <small>/ 1000 punts</small>` : "";
  }

  /* --- render general */
  function render(focusSel){
    renderBar();
    if (S.step === "wizard") main.innerHTML = wizard();
    else if (S.step === "report") main.innerHTML = report();
    else main.innerHTML = phaseView(S.step - 1);
    if (focusSel){ const el = main.querySelector(focusSel); if (el) el.focus({preventScroll:false}); }
  }
  const goTop = () => { window.scrollTo(0, 0); main.focus({preventScroll:true}); };

  /* ================================================== Assistent d'instruccions */
  const WIZ = [
    {t:"Ets el tècnic o la tècnica de farmàcia", b:() => `<p>Avui fas el torn a l'oficina de farmàcia. Entrarà un pacient amb un problema de salut i el veuràs des de darrere del taulell.</p><p>El seguiràs fins que el metge decideixi el tractament. A cada pas aplicaràs el que has après al RA3, «La malaltia».</p><div class="wizart">${SCENES.counterArt()}</div>`},
    {t:"Cinc fases", b:() => `<ol class="phlist">${PHASES.map((p, i) => `<li><b>${esc(p.title)}</b> <span class="muted">${esc(p.place)}</span><br>${["Escoltes el pacient, observes i decideixes què fer.","Descobreixes l'agent o la causa i els factors de risc.","La doctora l'explora: classifiques signes i símptomes.","Tries les proves que calen i en veus els resultats.","Compares, diagnostiques, classifiques la malaltia i tries el tractament."][i]}</li>`).join("")}</ol>`},
    {t:"Com es puntua", b:() => `<ul class="rules"><li><b>Cada fase val 200 punts</b>, 1.000 en total. La nota s'obté dividint els punts per 100.</li><li>Un encert suma els punts de la pregunta. Un error en resta la meitat.</li><li>Les ajudes <b>«Consulta els apunts»</b> resten 15 punts cadascuna.</li><li>Demanar proves que no calen també resta.</li><li>Només compta la primera resposta: llegeix bé abans de comprovar.</li></ul>`},
    {t:"Com es lliura", b:() => `<p>Al final veuràs un informe amb la teva puntuació, un <b>DAFO</b> personal (fortaleses, debilitats, oportunitats i amenaces) i un <b>codi de verificació</b>.</p><p>Copia el text de l'informe o fes-ne una captura de pantalla i lliura-ho a la tasca de <b>Google Classroom</b>.</p><p class="muted">El progrés es desa en aquest navegador. Si el tanques, continuaràs on eres.</p>`},
    {t:"Comencem", b:() => `<label class="fl" for="wName">Escriu el teu nom i cognoms</label><input id="wName" type="text" autocomplete="name" value="${esc(S.name)}" placeholder="Nom i cognoms"><p class="lgerr" id="wErr" role="alert"></p>`}
  ];
  function wizard(){
    const w = WIZ[S.wiz], last = S.wiz === WIZ.length - 1;
    return `<section class="wiz" aria-labelledby="wTitle">
      <ol class="dots" aria-label="Pas ${S.wiz + 1} de ${WIZ.length}">${WIZ.map((_, i) => `<li class="${i < S.wiz ? "done" : i === S.wiz ? "now" : ""}"></li>`).join("")}</ol>
      <p class="muted small">Instruccions · pas ${S.wiz + 1} de ${WIZ.length}</p>
      <h1 id="wTitle" class="ptitle">${esc(w.t)}</h1>
      <div class="wbody">${w.b()}</div>
      <div class="row wnav">${S.wiz > 0 ? `<button type="button" class="btn ghost" data-act="wprev">Anterior</button>` : ""}
        ${last ? `<button type="button" class="btn" data-act="start">Comença el torn</button>` : `<button type="button" class="btn" data-act="wnext">Següent</button>`}</div>
    </section>`;
  }

  /* ================================================== Fases */
  function sceneFor(pi, cur){
    const c = CASE(), p = c.patient;
    if (pi === 0){
      const said = c.phases[0].items.filter(it => it.say && (answered(it) || it === cur));
      const say = said.length ? said[said.length - 1].say : c.phases[0].items[0].say;
      return `<div class="scenebox">${SCENES.pharmacy(p)}<div class="bubble" role="note"><b>${esc(p.nom)}</b><p>${esc(say)}</p>${sayBtn(say)}</div></div>`;
    }
    if (pi === 1) return `<div class="scenebox">${SCENES.lab()}</div>`;
    if (pi === 2){
      const ex = c.phases[2].items.find(it => it.explore);
      const spots = [...new Set(ex.cards.map(k => k.spot))];
      return `<div class="scenebox">${SCENES.consult(p, spots, S.seen)}</div>`;
    }
    if (pi === 3) return `<div class="scenebox">${SCENES.testsScene()}</div>`;
    return `<div class="scenebox">${SCENES.deskScene(p)}</div>`;
  }
  function hintsBox(phase){
    return `<div class="hints" aria-label="Ajudes"><p class="small muted">Si t'encalles, pots consultar els apunts. Cada ajuda que obres resta 15 punts.</p>${phase.hints.map(h => {
      const used = S.hints.includes(h.id);
      return `<details class="hint${used ? " used" : ""}" data-hint="${h.id}"${used ? " open" : ""}><summary>${esc(h.title)} <span class="cost">${used ? "oberta · −15" : "−15 punts"}</span></summary><p>${esc(h.text)}</p></details>`; }).join("")}</div>`;
  }
  function comparison(){
    const c = CASE(), ex = c.phases[2].items.find(it => it.explore), tst = c.phases[3].items.find(it => it.type === "tests");
    const req = S.ans[tst.id] || [];
    const binT = id => ex.bins.find(b => b.id === id).t;
    return `<div class="compare"><div><h3>Clínica de la consulta</h3><ul>${ex.cards.map(k => `<li><span class="tag ${k.a}">${binT(k.a)}</span> ${esc(k.t)}</li>`).join("")}</ul></div>
      <div><h3>Resultats de les proves</h3>${req.length ? `<ul>${tst.tests.filter(t => req.includes(t.id)).map(t => `<li><b>${esc(t.result.label)}:</b> ${esc(t.result.text)}</li>`).join("")}</ul>` : `<p class="muted">No vas demanar cap prova.</p>`}</div></div>`;
  }
  function phaseView(pi){
    const c = CASE(), phase = c.phases[pi], P = PHASES[pi];
    const cur = phase.items.find(it => !answered(it));
    const shown = phase.items.filter(it => answered(it) || it === cur);
    const done = !cur;
    return `<section class="phase" aria-labelledby="phTitle">
      ${sceneFor(pi, cur)}
      <div class="pcol">
        <p class="muted small">Fase ${pi + 1} de 5 · ${esc(P.place)} · cas: ${esc(c.name)}</p>
        <h1 id="phTitle" class="ptitle">${esc(P.title)}</h1>
        ${pi === 0 ? `<p class="lead">${esc(c.intro)}</p>` : ""}
        ${pi === 4 ? comparison() : ""}
        ${hintsBox(phase)}
        <div class="items">${shown.map((it, i) => itemCard(it, i + 1, phase.items.length, pi)).join("")}</div>
        <div class="phfoot">${done ? `<p class="phscore">Fase ${pi + 1}: <b>${ph(pi)}</b> de 200 punts</p><button type="button" class="btn big" data-act="next" id="nextBtn">${pi < 4 ? "Passa a la fase " + (pi + 2) + ": " + esc(PHASES[pi + 1].title.toLowerCase()) : "Mostra l'informe final"}</button>` : `<p class="small muted">Pregunta ${shown.length} de ${phase.items.length}</p>`}</div>
      </div>
    </section>`;
  }

  /* --- targetes de pregunta */
  function itemCard(it, n, of, pi){
    const done = answered(it);
    const d = done ? RA3.itemDelta(it, S.ans[it.id]) : 0;
    const max = RA3.itemMax(it);
    return `<article class="q${done ? " done" : " active"}" id="q-${it.id}" tabindex="-1">
      <header class="qhead"><h2>${esc(it.prompt)}</h2><span class="pts">${done ? `<b class="${d > 0 ? "ok" : d < 0 ? "bad" : ""}">${signed(d)}</b> / ${max}` : max + " punts"}</span></header>
      ${sayBtn(it.prompt + (it.type === "single" || it.type === "multi" ? ". " + it.options.map(o => o.t).join(". ") : ""))}
      ${done ? feedback(it) : interact(it)}
    </article>`;
  }
  function interact(it){
    const t = tmp[it.id];
    if (it.type === "single"){
      const cls = it.icons ? "opts tiles" : it.timeline ? "opts timeline" : "opts";
      return `<div class="${cls}" role="group" aria-label="Opcions">${it.options.map(o => `<button type="button" class="opt" data-act="pick" data-item="${it.id}" data-opt="${o.id}" aria-pressed="${t === o.id}">${it.icons && SCENES.ICONS[o.id] ? SCENES.ICONS[o.id] : ""}<span>${esc(o.t)}</span></button>`).join("")}</div>
        <button type="button" class="btn" data-act="check" data-item="${it.id}"${t ? "" : " disabled"}>Comprova</button>`;
    }
    if (it.type === "multi"){
      const sel = t || [];
      return `<p class="small muted">Pots marcar més d'una opció.</p><div class="opts" role="group">${it.options.map(o => `<button type="button" class="opt chk" data-act="tog" data-item="${it.id}" data-opt="${o.id}" aria-pressed="${sel.includes(o.id)}"><span>${esc(o.t)}</span></button>`).join("")}</div>
        <button type="button" class="btn" data-act="check" data-item="${it.id}"${sel.length ? "" : " disabled"}>Comprova</button>`;
    }
    if (it.type === "classify"){
      const sel = t || {};
      const visible = it.cards.filter(k => !it.explore || S.seen.includes(k.spot));
      const allSet = it.cards.every(k => sel[k.id]);
      const spotsLeft = it.explore ? [...new Set(it.cards.map(k => k.spot))].filter(s => !S.seen.includes(s)) : [];
      return `${it.explore ? `<p class="explore">${spotsLeft.length ? `Toca els punts verds del cos a la il·lustració, o aquests botons, per explorar. Et queden <b>${spotsLeft.length}</b> zones.</p><p class="row">${spotsLeft.map(s => `<button type="button" class="btn ghost small" data-act="spot" data-spot="${s}">Explora: ${SCENES.SPOT_NAMES[s].toLowerCase()}</button>`).join("")}` : "Has explorat totes les zones."}</p>` : ""}
        <ul class="cards">${visible.map(k => `<li class="crd"><span class="ct">${esc(k.t)}</span><span class="bins" role="group" aria-label="Classifica: ${esc(k.t)}">${it.bins.map(b => `<button type="button" class="bin b-${b.id}" data-act="bin" data-item="${it.id}" data-card="${k.id}" data-bin="${b.id}" aria-pressed="${sel[k.id] === b.id}">${esc(b.t)}</button>`).join("")}</span></li>`).join("")}</ul>
        <button type="button" class="btn" data-act="check" data-item="${it.id}"${allSet ? "" : " disabled"}>Comprova</button>`;
    }
    if (it.type === "tests"){
      const sel = t || [];
      return `<p class="small muted">Marca les proves i després demana-les. Les que no calen resten punts.</p><div class="opts tests" role="group">${it.tests.map(x => `<button type="button" class="opt chk" data-act="tog" data-item="${it.id}" data-opt="${x.id}" aria-pressed="${sel.includes(x.id)}"><span>${esc(x.t)}</span></button>`).join("")}</div>
        <button type="button" class="btn" data-act="check" data-item="${it.id}"${sel.length ? "" : " disabled"}>Demana les proves</button>`;
    }
    return "";
  }
  function feedback(it){
    const a = S.ans[it.id];
    let body = "";
    if (it.type === "single"){
      const ok = a === it.a, chosen = it.options.find(o => o.id === a), right = it.options.find(o => o.id === it.a);
      body = `<p class="verdict ${ok ? "ok" : "bad"}">${ok ? "Correcte" : "No és correcte"}: has triat «${esc(chosen.t)}».</p>${ok ? "" : `<p>La resposta correcta és <b>«${esc(right.t)}»</b>.</p>`}`;
    } else if (it.type === "multi"){
      body = `<ul class="fb">${it.options.map(o => { const s = a.includes(o.id), r = it.a.includes(o.id);
        return (s || r) ? `<li class="${s && r ? "ok" : "bad"}">${s && r ? "Encert" : s ? "No hi anava" : "T'has deixat"}: ${esc(o.t)}</li>` : ""; }).join("")}</ul>`;
    } else if (it.type === "classify"){
      const binT = id => it.bins.find(b => b.id === id).t;
      body = `<ul class="fb">${it.cards.map(k => { const ok = a[k.id] === k.a;
        return `<li class="${ok ? "ok" : "bad"}">${esc(k.t)}: <b>${esc(binT(a[k.id]))}</b>${ok ? "" : ` (és ${esc(binT(k.a).toLowerCase())})`}</li>`; }).join("")}</ul>`;
    } else if (it.type === "tests"){
      const label = {need:"Calia", neutral:"Neutra", no:"No calia"};
      body = `<div class="results">${it.tests.filter(x => a.includes(x.id)).map((x, i) => `<figure class="res k-${x.kind}" style="animation-delay:${i * 120}ms">${SCENES.result(x.result.viz, x)}<figcaption><b>${esc(x.result.label)}</b><span class="kind">${label[x.kind]} · ${x.kind === "need" ? "+" + x.pts : x.kind === "no" ? "−" + Math.round(x.pts / 2) : "0"} punts</span><span>${esc(x.result.text)}</span></figcaption></figure>`).join("")}</div>
        ${it.tests.filter(x => x.kind === "need" && !a.includes(x.id)).map(x => `<p class="verdict bad">No has demanat una prova que calia: ${esc(x.t)}.</p>`).join("")}`;
    }
    return `<div class="feedback">${body}<p class="why"><b>Per què?</b> ${esc(it.why)}</p></div>`;
  }

  /* ================================================== Informe final */
  function fields(){
    return {email:USER, name:S.name, caseId:S.caseId, phases:[0,1,2,3,4].map(ph), hints:S.hints.length, errors:errors(), total:total()};
  }
  function chart(scores){
    const W = 520, H = 220, bw = 64, gap = (W - 60 - bw * 5) / 4;
    return `<svg class="chart" viewBox="0 0 ${W} ${H + 40}" role="img" aria-label="Punts per fase: ${scores.map((s, i) => PHASES[i].title + " " + s + " de 200").join(", ")}">
      ${[0,50,100,150,200].map(v => `<line x1="40" x2="${W}" y1="${H - v}" y2="${H - v}" class="grid"/><text x="32" y="${H - v + 4}" text-anchor="end" class="ax">${v}</text>`).join("")}
      ${scores.map((s, i) => { const x = 50 + i * (bw + gap);
        return `<rect class="barbg" x="${x}" y="${H - 200}" width="${bw}" height="200" rx="6"/><rect class="bar growy" style="animation-delay:${i * 90}ms" x="${x}" y="${H - s}" width="${bw}" height="${Math.max(s, 0)}" rx="6"/><text x="${x + bw / 2}" y="${H - s - 8}" text-anchor="middle" class="val">${s}</text><text x="${x + bw / 2}" y="${H + 22}" text-anchor="middle" class="ax">${esc(PHASES[i].title.replace(/^(El|La|Les) /, ""))}</text>`; }).join("")}
    </svg>`;
  }
  function report(){
    const f = fields(), c = CASE();
    const d = RA3.dafo(RA3.compStats(c, S.ans), RA3.trapsHit(c, S.ans), S.hints.length, COMPS, TRAPS);
    const code = RA3.verifCode(f), txt = RA3.resultText(f);
    const q = (k, t, list) => `<div class="dq dq-${k}"><h3>${t}</h3><ul>${list.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
    return `<section class="report" aria-labelledby="rTitle">
      <div class="rhead">
        <div><p class="muted small">Informe del torn · cas: ${esc(c.name)}</p><h1 id="rTitle" class="ptitle">Torn acabat, ${esc(S.name.trim().split(/\s+/)[0])}</h1>
          <p class="lead">Has acompanyat ${esc(c.patient.nom === "Marta" ? "la Marta" : c.patient.nom === "Jordi" ? "en Jordi" : "l'Antoni")} del taulell al tractament.</p></div>
        <div class="bignum"><b>${RA3.grade(f.total)}</b><span>nota sobre 10</span><small>${f.total} / 1000 punts</small></div>
      </div>
      <div class="rgrid">
        <div class="panel">${chart(f.phases)}<p class="small muted">Errors: <b>${f.errors}</b> · Ajudes obertes: <b>${f.hints}</b> (−${f.hints * 15} punts)</p></div>
        <div class="panel dafo"><h2>El teu DAFO</h2><div class="dgrid">${q("f","Fortaleses",d.F)}${q("d","Debilitats",d.D)}${q("o","Oportunitats",d.O)}${q("a","Amenaces",d.A)}</div></div>
      </div>
      <div class="panel deliver">
        <h2>Lliura-ho a Classroom</h2>
        <p>Codi de verificació: <span class="code">${code}</span></p>
        <p>Copia el text i enganxa'l a la tasca de Classroom. També pots fer una captura de pantalla d'aquesta pàgina.</p>
        <div class="row"><button type="button" class="btn" data-act="copy" id="copyBtn">Copia el resultat</button><span class="small" id="copied" aria-live="polite"></span></div>
        <textarea class="copy" id="resultTxt" readonly rows="14" aria-label="Resultat en text">${esc(txt)}</textarea>
      </div>
    </section>`;
  }

  /* ================================================== Esdeveniments */
  main.addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) { const sp = e.target.closest(".spot"); if (sp) explore(sp.dataset.spot); return; }
    const act = b.dataset.act, id = b.dataset.item;
    const it = id ? CASE().phases.flatMap(p => p.items).find(x => x.id === id) : null;
    if (act === "say") return speak(b.dataset.text, b);
    if (act === "spot") return explore(b.dataset.spot);
    if (act === "wnext"){ S.wiz++; save(); render("#wTitle"); return; }
    if (act === "wprev"){ S.wiz--; save(); render("#wTitle"); return; }
    if (act === "start"){
      const name = $("#wName").value.trim();
      if (name.length < 3){ $("#wErr").textContent = "Escriu el teu nom i cognoms per poder lliurar l'informe."; $("#wName").focus(); return; }
      S.name = name; S.caseId = RA3.caseFor(USER); S.step = 1; save(); render(); goTop(); return;
    }
    if (act === "pick"){ tmp[id] = b.dataset.opt; render(`[data-act=pick][data-opt="${b.dataset.opt}"][data-item="${id}"]`); return; }
    if (act === "tog"){ const s = tmp[id] || []; const o = b.dataset.opt; tmp[id] = s.includes(o) ? s.filter(x => x !== o) : s.concat(o); render(`[data-act=tog][data-opt="${o}"][data-item="${id}"]`); return; }
    if (act === "bin"){ tmp[id] = Object.assign({}, tmp[id], {[b.dataset.card]: b.dataset.bin}); render(`[data-act=bin][data-card="${b.dataset.card}"][data-bin="${b.dataset.bin}"][data-item="${id}"]`); return; }
    if (act === "check"){
      sync();
      if (!it || answered(it) || tmp[id] === undefined){ delete tmp[id]; render(); return; }
      S.ans[id] = it.type === "classify" ? Object.assign({}, tmp[id]) : Array.isArray(tmp[id]) ? tmp[id].slice() : tmp[id];
      delete tmp[id]; save(); render(); const q = $("#q-" + id); if (q){ q.focus({preventScroll:true}); q.scrollIntoView({block:"start", behavior: prefs.motion === "off" ? "auto" : "smooth"}); }
      return;
    }
    if (act === "next"){ S.step = S.step < 5 ? S.step + 1 : "report"; save(); render(); goTop(); return; }
    if (act === "copy"){
      const msg = $("#copied"), ta = $("#resultTxt"), fallback = () => { ta.focus(); ta.select(); msg.textContent = "Text seleccionat. Copia'l amb Ctrl+C (o mantén premut al mòbil)."; };
      try { navigator.clipboard.writeText(ta.value).then(() => { msg.textContent = "Copiat. Ara enganxa'l a Classroom."; }, fallback); } catch(err){ fallback(); }
    }
  });
  function explore(spot){
    if (S.step !== 3 || S.seen.includes(spot)) return;
    S.seen.push(spot); save(); render(`.spot[data-spot="${spot}"]`);
  }
  main.addEventListener("keydown", e => {
    const sp = e.target.closest && e.target.closest(".spot");
    if (sp && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); explore(sp.dataset.spot); }
    if (e.target.id === "wName" && e.key === "Enter"){ e.preventDefault(); main.querySelector("[data-act=start]").click(); }
  });
  main.addEventListener("toggle", e => {
    const d = e.target; if (!d.matches || !d.matches("details.hint") || !d.open) return;
    sync();
    if (!S.hints.includes(d.dataset.hint)){ S.hints.push(d.dataset.hint); save(); d.classList.add("used"); d.querySelector(".cost").textContent = "oberta · −15"; renderBar(); }
  }, true);
  main.addEventListener("input", e => { if (e.target.id === "wName") S.name = e.target.value; });

  render();
}

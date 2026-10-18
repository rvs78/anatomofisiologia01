/* Lògica pura de l'activitat RA3 · La malaltia: accés, puntuació, DAFO i codi de verificació.
   Funciona al navegador (window.RA3) i a Node (module.exports) per poder-la provar. */
(function(root, factory){
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.RA3 = factory();
})(typeof self !== "undefined" ? self : this, function(){
  "use strict";

  /* ---------- Accés */
  const DOMAIN_RE = /^[a-z0-9._-]+@isvh\.cat$/;   // sense «+»: un àlies donaria una partida d'assaig
  const normEmail = s => String(s || "").trim().toLowerCase();
  const isValidEmail = s => DOMAIN_RE.test(normEmail(s));
  const PASS_SHA256 = "77b7f7d35e3cc81fbbdcc2b7aec11a3a3a07779cf5002155d0b741300e963435";
  const HINT_COST = 15, PHASE_MAX = 200, TOTAL_MAX = 1000;

  /* ---------- Hash FNV-1a (32 bits) */
  function fnv1a(str){
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h >>> 0;
  }
  /* Barreja estable: mateixa llavor → mateix ordre (Fisher–Yates amb mulberry32) */
  function shuffleFor(seed, arr){
    let a = fnv1a(String(seed)) || 1;
    const rnd = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--){ const j = Math.floor(rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }
  const caseFor = email => ["A","B","C"][fnv1a("cas|" + normEmail(email)) % 3];

  /* ---------- Puntuació */
  const half = n => Math.round(n / 2);
  function itemMax(item){
    if (item.type === "tests") return item.tests.reduce((s, t) => s + (t.kind === "need" ? t.pts : 0), 0);
    return item.pts;
  }
  function itemDelta(item, ans){
    if (ans === undefined || ans === null) return 0;
    switch (item.type){
      case "single": return ans === item.a ? item.pts : -half(item.pts);
      case "multi": {
        const share = item.pts / item.a.length;
        return Math.round(ans.reduce((s, id) => s + (item.a.includes(id) ? share : -share / 2), 0));
      }
      case "classify": {
        const share = item.pts / item.cards.length;
        return Math.round(item.cards.reduce((s, c) => s + (ans[c.id] === undefined ? 0 : ans[c.id] === c.a ? share : -share / 2), 0));
      }
      case "order": {
        const share = item.pts / item.steps.length;
        return Math.round(item.steps.reduce((s, st, i) => s + (ans[i] === st.id ? share : -share / 2), 0));
      }
      case "tests": return item.tests.reduce((s, t) => !ans.includes(t.id) ? s : t.kind === "need" ? s + t.pts : t.kind === "no" ? s - half(t.pts) : s, 0);
    }
    return 0;
  }
  function itemErrors(item, ans){
    if (ans === undefined || ans === null) return 0;
    switch (item.type){
      case "single": return ans === item.a ? 0 : 1;
      case "multi": return ans.filter(id => !item.a.includes(id)).length + item.a.filter(id => !ans.includes(id)).length;
      case "classify": return item.cards.filter(c => ans[c.id] !== undefined && ans[c.id] !== c.a).length;
      case "tests": return item.tests.filter(t => t.kind === "no" && ans.includes(t.id)).length;
      case "order": return item.steps.filter((st, i) => ans[i] !== st.id).length;
    }
    return 0;
  }
  function phaseScore(phase, answers, hintsOpen){
    const hints = (phase.hints || []).filter(h => (hintsOpen || []).includes(h.id)).length;
    const raw = phase.items.reduce((s, it) => s + itemDelta(it, answers[it.id]), 0) - hints * HINT_COST;
    return Math.max(0, Math.min(PHASE_MAX, raw));
  }
  function compStats(caseObj, answers){
    const st = {};
    caseObj.phases.forEach(p => p.items.forEach(it => {
      const s = st[it.comp] || (st[it.comp] = {got:0, max:0});
      s.max += itemMax(it);
      s.got += Math.max(0, itemDelta(it, answers[it.id]));
    }));
    return st;
  }
  function trapsHit(caseObj, answers){
    const out = [];
    const add = t => { if (t && !out.includes(t)) out.push(t); };
    caseObj.phases.forEach(p => p.items.forEach(it => {
      const a = answers[it.id];
      if (a === undefined) return;
      if (it.type === "single") (it.options.find(o => o.id === a) || {}).trap && add(it.options.find(o => o.id === a).trap);
      else if (it.type === "multi") a.forEach(id => { const o = it.options.find(x => x.id === id); if (o && !it.a.includes(id)) add(o.trap); });
      else if (it.type === "tests") it.tests.forEach(t => { if (t.kind === "no" && a.includes(t.id)) add(t.trap || "provesInnecessaries"); });
      else if ((it.type === "classify" || it.type === "order") && itemErrors(it, a) > 0) add(it.trap);
    }));
    return out;
  }

  /* ---------- Dues pestanyes: la primera resposta desada sempre guanya */
  const stepRank = st => st === "report" ? 6 : typeof st === "number" ? st : 0;
  function mergeState(mine, stored){
    if (!stored) return mine;
    const union = (a, b) => (a || []).concat((b || []).filter(x => !(a || []).includes(x)));
    return Object.assign({}, mine, {
      name: mine.name || stored.name, caseId: mine.caseId || stored.caseId,
      step: stepRank(stored.step) > stepRank(mine.step) ? stored.step : mine.step,
      wiz: Math.max(mine.wiz || 0, stored.wiz || 0),
      ans: Object.assign({}, mine.ans, stored.ans),
      hints: union(stored.hints, mine.hints), seen: union(mine.seen, stored.seen)
    });
  }

  /* ---------- DAFO */
  function dafo(stats, trapIds, hintsCount, COMPS, TRAPS){
    const F = [], D = [], O = [], A = [];
    Object.keys(stats).forEach(k => {
      const c = COMPS[k] || {t:k, sec:""}, r = stats[k].max ? stats[k].got / stats[k].max : 1;
      if (r >= 0.8) F.push(c.t + ": domines aquest contingut (" + Math.round(r * 100) + "% d'encert).");
      else if (r < 0.5) D.push(c.t + ": encara costa (" + Math.round(r * 100) + "% d'encert).");
      if (r < 0.8) O.push("Repassa «" + c.t + "» a l'apartat " + c.sec + " dels apunts abans de la prova del 23/10.");
    });
    (trapIds || []).forEach(t => { if (TRAPS[t]) A.push(TRAPS[t]); });
    if (hintsCount >= 3) A.push("Dependència de les ajudes: has obert " + hintsCount + " ajudes. A la prova no n'hi haurà.");
    if (!F.length) F.push("Has completat tot el cas clínic, de la farmàcia al tractament.");
    if (!D.length) D.push("Cap competència per sota del 50%. Mantén el ritme de repàs.");
    if (!O.length) O.push("Fes la infografia del dossier amb una altra malaltia per consolidar-ho.");
    if (!A.length) A.push("Cap error de concepte greu. Vigila de no confiar-te el dia de la prova.");
    return {F, D, O, A};
  }

  /* ---------- Resultat i codi */
  const SALT = "RA3-MALALTIA-2026";
  const grade = total => (Math.round(total / 10) / 10).toFixed(1).replace(".", ",");
  function verifCode(f){
    const s = [SALT, normEmail(f.email), String(f.name).trim(), f.caseId, f.phases.join(","), f.hints, f.errors, f.total].join("|");
    const h = fnv1a(s).toString(16).toUpperCase().padStart(8, "0");
    return "RA3-" + h.slice(0, 4) + "-" + h.slice(4);
  }
  const PH_NAMES = ["Taulell","Causa","Consulta","Proves","Decisió"];
  function resultText(f){
    return ["RA3 · LA MALALTIA · EL CAS DEL TAULELL",
      "Alumne/a: " + String(f.name).trim(),
      "Correu: " + normEmail(f.email),
      "Cas: " + f.caseId,
      ...f.phases.map((p, i) => "Fase " + (i + 1) + " " + PH_NAMES[i] + ": " + p + "/" + PHASE_MAX),
      "Ajudes: " + f.hints,
      "Errors: " + f.errors,
      "TOTAL: " + f.total + "/" + TOTAL_MAX,
      "Nota: " + grade(f.total) + "/10",
      "Codi de verificació: " + verifCode(f)].join("\n");
  }
  function parseResultText(txt){
    const get = re => { const m = String(txt || "").match(re); return m ? m[1].trim() : null; };
    const name = get(/^Alumne\/a:\s*(.+)$/m), email = get(/^Correu:\s*(\S+)$/m), caseId = get(/^Cas:\s*([ABC])\b/m);
    const phases = [1,2,3,4,5].map(i => get(new RegExp("^Fase " + i + "[^:]*:\\s*(\\d+)\\/", "m")));
    const hints = get(/^Ajudes:\s*(\d+)/m), errors = get(/^Errors:\s*(\d+)/m), total = get(/^TOTAL:\s*(\d+)/m), code = get(/^Codi de verificació:\s*(RA3-[0-9A-F]{4}-[0-9A-F]{4})/m);
    if ([name, email, caseId, hints, errors, total, code].includes(null) || phases.includes(null)) return null;
    return {code, email, name, caseId, phases: phases.map(Number), hints: +hints, errors: +errors, total: +total};
  }

  return {DOMAIN_RE, normEmail, isValidEmail, PASS_SHA256, HINT_COST, PHASE_MAX, TOTAL_MAX, PH_NAMES,
    fnv1a, shuffleFor, caseFor, mergeState, itemMax, itemDelta, itemErrors, phaseScore, compStats, trapsHit, dafo, grade, verifCode, resultText, parseResultText};
});

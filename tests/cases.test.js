const test = require("node:test");
const assert = require("node:assert/strict");
const RA3 = require("../ra3-malaltia/js/core.js");
const {CASES, COMPS, TRAPS, PHASES} = require("../ra3-malaltia/js/cases.js");
const SECS = ["3.1","3.2","3.3","3.4","3.5","3.6"];

test("hi ha tres casos i cinc fases", () => {
  assert.deepEqual(Object.keys(CASES).sort(), ["A","B","C"]);
  assert.equal(PHASES.length, 5);
});

for (const id of ["A","B","C"]) {
  const c = CASES[id];
  test("cas " + id + ": estructura i punts", () => {
    assert.equal(c.phases.length, 5);
    assert.ok(c.patient && c.patient.nom && c.intro);
    const ids = new Set();
    c.phases.forEach((p, pi) => {
      assert.equal(p.items.reduce((s, it) => s + RA3.itemMax(it), 0), 200, "fase " + (pi + 1));
      assert.ok(p.hints.length >= 1, "ajudes fase " + (pi + 1));
      p.hints.forEach(h => { assert.ok(h.id && h.title && h.text); assert.ok(!ids.has(h.id)); ids.add(h.id); });
      p.items.forEach(it => {
        assert.ok(!ids.has(it.id), "id repetit " + it.id); ids.add(it.id);
        assert.ok(COMPS[it.comp], it.id + " comp " + it.comp);
        assert.ok(SECS.includes(it.sec), it.id + " sec");
        assert.ok(it.prompt && it.why, it.id + " prompt/why");
        if (it.type === "single") assert.ok(it.options.some(o => o.id === it.a), it.id);
        if (it.type === "multi") it.a.forEach(a => assert.ok(it.options.some(o => o.id === a), it.id));
        if (it.type === "single" || it.type === "multi") it.options.forEach(o => { assert.ok(o.t); if (o.trap) assert.ok(TRAPS[o.trap], it.id + " trap " + o.trap); });
        if (it.type === "classify") { it.cards.forEach(k => assert.ok(it.bins.some(b => b.id === k.a), it.id + " card " + k.id)); if (it.trap) assert.ok(TRAPS[it.trap]); }
        if (it.type === "tests") it.tests.forEach(t => { assert.ok(["need","neutral","no"].includes(t.kind)); assert.ok(t.result && t.result.viz && t.result.text, it.id + " " + t.id); if (t.trap) assert.ok(TRAPS[t.trap]); });
        if (it.type === "order") { assert.ok(it.steps.length >= 3); assert.equal(new Set(it.steps.map(x => x.id)).size, it.steps.length); }
        assert.ok(["single","multi","classify","tests","order"].includes(it.type), it.id + " type");
      });
    });
  });
  test("cas " + id + ": cada fase té exactament una prova de diagnòstic a la fase 4", () => {
    assert.equal(c.phases[3].items.filter(it => it.type === "tests").length, 1);
  });
}

const testsOf = id => CASES[id].phases[3].items.find(it => it.type === "tests").tests;
test("regles de proves del disseny", () => {
  assert.equal(testsOf("A").find(t => t.id === "radiografia").kind, "neutral");
  assert.equal(testsOf("B").find(t => t.id === "biopsia").kind, "need");
  const imatge = ["radiografia","ecografia","tc","rm"];
  assert.ok(!testsOf("C").some(t => imatge.includes(t.id) && t.kind === "need"));
});

test("el millor cas dona 1000 i el pitjor 0", () => {
  for (const id of ["A","B","C"]) {
    const best = {}, worst = {};
    CASES[id].phases.forEach(p => p.items.forEach(it => {
      if (it.type === "single") { best[it.id] = it.a; worst[it.id] = it.options.find(o => o.id !== it.a).id; }
      if (it.type === "multi") { best[it.id] = it.a.slice(); worst[it.id] = it.options.filter(o => !it.a.includes(o.id)).map(o => o.id); }
      if (it.type === "classify") { best[it.id] = {}; worst[it.id] = {}; it.cards.forEach(k => { best[it.id][k.id] = k.a; worst[it.id][k.id] = it.bins.find(b => b.id !== k.a).id; }); }
      if (it.type === "tests") { best[it.id] = it.tests.filter(t => t.kind === "need").map(t => t.id); worst[it.id] = it.tests.filter(t => t.kind === "no").map(t => t.id); }
      if (it.type === "order") { best[it.id] = it.steps.map(x => x.id); worst[it.id] = it.steps.map(x => x.id).reverse(); if (it.steps.length % 2) { const w = worst[it.id]; [w[0], w[1]] = [w[1], w[0]]; } }
    }));
    const allHints = CASES[id].phases.flatMap(p => p.hints.map(h => h.id));
    assert.equal(CASES[id].phases.reduce((s, p) => s + RA3.phaseScore(p, best, []), 0), 1000, id);
    CASES[id].phases.forEach(p => assert.equal(RA3.phaseScore(p, worst, allHints), 0, id));
  }
});

test("cas C: a la consulta, cap símptoma característic que contradigui el període subclínic", () => {
  const c3a = CASES.C.phases[2].items.find(it => it.id === "C3a");
  assert.ok(!c3a.cards.some(k => /borrosa|formigueig/i.test(k.t)));
  assert.match(CASES.C.phases[2].items.find(it => it.id === "C3c").prompt, /[Aa]bans de l'examen/);
});

test("la justificació cita l'apartat on està etiquetada la pregunta", () => {
  for (const id of ["A","B","C"]) CASES[id].phases.forEach(p => p.items.forEach(it =>
    assert.ok(it.why.includes(it.sec), `${it.id}: sec ${it.sec} però «${it.why.slice(-14)}»`)));
});

test("versió 2: 9 o 10 preguntes per fase i 13 proves a cada cas", () => {
  const CAT = ["sang","orina","frotis","citologia","biopsia","radiografia","ecografia","tc","rm","ecg","eeg","emg","endoscopia"];
  const INFO = require("../ra3-malaltia/js/tests-info.js");
  assert.deepEqual(Object.keys(INFO).sort(), CAT.slice().sort());
  for (const id of ["A","B","C"]) {
    CASES[id].phases.forEach(p => assert.ok(p.items.length >= 9 && p.items.length <= 10));
    const ids = CASES[id].phases[3].items.find(it => it.type === "tests").tests.map(t => t.id);
    assert.deepEqual(ids.slice().sort(), CAT.slice().sort(), "proves del cas " + id);
  }
});

test("tot el contingut té traducció al castellà", () => {
  global.self = global;
  for (const id of ["A","B","C"]) {
    const ES = require("../ra3-malaltia/js/i18n/es-" + id + ".js");
    assert.ok(ES.name && ES.intro);
    CASES[id].phases.forEach(p => p.items.forEach(it => {
      const e = ES.items[it.id]; assert.ok(e && e.prompt && e.why, id + " " + it.id);
      ["options","cards","bins","steps"].forEach(k => (it[k] || []).forEach(o => assert.ok(e[k] && e[k][o.id], `${it.id} ${k} ${o.id}`)));
      if (it.say) assert.ok(e.say, it.id + " say");
      if (it.tests) it.tests.forEach(x => assert.ok(ES.tests[x.id] && ES.tests[x.id].text, it.id + " test " + x.id));
    }));
  }
  const SH = require("../ra3-malaltia/js/i18n/es-shared.js");
  Object.keys(COMPS).forEach(k => assert.ok(SH.comps[k], "comp " + k));
  Object.keys(TRAPS).forEach(k => assert.ok(SH.traps[k], "trap " + k));
});

test("cap patró: la resposta correcta no és sempre la primera opció", () => {
  for (const id of ["A","B","C"]) {
    const singles = CASES[id].phases.flatMap(p => p.items).filter(it => it.type === "single" && !it.timeline);
    const first = singles.filter(it => it.options[0].id === it.a).length;
    // les preguntes antigues tenien la correcta primer; l'app les barreja per alumne
    const R = require("../ra3-malaltia/js/core.js");
    const firstShuffled = singles.filter(it => R.shuffleFor("alumne1@isvh.cat|" + it.id, it.options)[0].id === it.a).length;
    assert.ok(firstShuffled < singles.length * 0.5, id + ": " + firstShuffled + "/" + singles.length + " (abans " + first + ")");
  }
});

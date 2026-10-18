const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const RA3 = require("../ra3-malaltia/js/core.js");

test("valida el correu de l'institut", () => {
  assert.equal(RA3.isValidEmail("  Nom.Cognom@ISVH.CAT "), true);
  assert.equal(RA3.normEmail("  Nom.Cognom@ISVH.CAT "), "nom.cognom@isvh.cat");
  for (const bad of ["a@isvh.cat.evil.com", "@isvh.cat", "a@isvh.com", "", "a b@isvh.cat"]) assert.equal(RA3.isValidEmail(bad), false, bad);
});

test("la contrasenya només hi és com a empremta SHA-256", () => {
  assert.equal(RA3.PASS_SHA256, crypto.createHash("sha256").update("far2026").digest("hex"));
});

test("el cas surt del correu, és estable i es reparteix", () => {
  assert.equal(RA3.caseFor("Anna.Puig@isvh.cat"), RA3.caseFor(" anna.puig@ISVH.cat"));
  const n = {A:0, B:0, C:0};
  for (let i = 0; i < 300; i++) n[RA3.caseFor("alumne" + i + "@isvh.cat")]++;
  assert.deepEqual(Object.keys(n).sort(), ["A","B","C"]);
  for (const k in n) assert.ok(n[k] >= 60, k + ":" + n[k]);
});

const single = {id:"s", type:"single", options:[{id:"a"},{id:"b",trap:"antibiotic"}], a:"a", pts:20};
const multi = {id:"m", type:"multi", options:[{id:"a"},{id:"b"},{id:"c"}], a:["a","b"], pts:20};
const cls = {id:"c", type:"classify", bins:[{id:"si"},{id:"sim"}], cards:[{id:"1",a:"si"},{id:"2",a:"si"},{id:"3",a:"sim"},{id:"4",a:"sim"}], pts:40};
const tests = {id:"t", type:"tests", tests:[{id:"x",kind:"need",pts:20},{id:"y",kind:"need",pts:20},{id:"z",kind:"no",pts:10},{id:"n",kind:"neutral",pts:0}]};

test("puntuació per ítem", () => {
  assert.equal(RA3.itemDelta(single, "a"), 20);
  assert.equal(RA3.itemDelta(single, "b"), -10);
  assert.equal(RA3.itemDelta(single, undefined), 0);
  assert.equal(RA3.itemDelta(multi, ["a","b"]), 20);
  assert.equal(RA3.itemDelta(multi, ["a","c"]), 5);
  assert.equal(RA3.itemDelta(cls, {1:"si",2:"si",3:"sim",4:"si"}), 25);
  assert.equal(RA3.itemDelta(tests, ["x","y","z","n"]), 35);
  assert.equal(RA3.itemMax(tests), 40);
  assert.equal(RA3.itemMax(cls), 40);
  assert.equal(RA3.itemErrors(cls, {1:"si",2:"sim",3:"sim",4:"si"}), 2);
  assert.equal(RA3.itemErrors(tests, ["x","z"]), 1);
  assert.equal(RA3.itemErrors(single, "a"), 0);
});

test("la fase no baixa de 0 i les ajudes resten 15", () => {
  const phase = {items:[single, cls], hints:[{id:"h1"},{id:"h2"}]};
  assert.equal(RA3.phaseScore(phase, {s:"b", c:{1:"sim",2:"sim",3:"si",4:"si"}}, ["h1","h2"]), 0);
  assert.equal(RA3.phaseScore(phase, {s:"a", c:{1:"si",2:"si",3:"sim",4:"sim"}}, []), 60);
  assert.equal(RA3.phaseScore(phase, {s:"a", c:{1:"si",2:"si",3:"sim",4:"sim"}}, ["h1"]), 45);
});

const F = {email:"nuria.langel@isvh.cat", name:"Núria L'Àngel", caseId:"B", phases:[200,150,0,185,90], hints:2, errors:7, total:625};

test("text del resultat i codi de verificació", () => {
  const code = RA3.verifCode(F);
  assert.match(code, /^RA3-[0-9A-F]{4}-[0-9A-F]{4}$/);
  const txt = RA3.resultText(F);
  assert.ok(txt.includes(code));
  assert.deepEqual(RA3.parseResultText(txt), Object.assign({code}, F));
  assert.notEqual(RA3.verifCode(Object.assign({}, F, {phases:[200,150,0,185,91]})), code);
  assert.equal(RA3.parseResultText("hola"), null);
});

test("DAFO", () => {
  const COMPS = {etiologia:{t:"Etiologia", sec:"3.2"}, signes:{t:"Signes i símptomes", sec:"3.2"}, proves:{t:"Proves", sec:"3.5"}};
  const TRAPS = {antibiotic:"Triar antibiòtic per a una infecció vírica."};
  const d = RA3.dafo({etiologia:{got:90,max:100}, signes:{got:30,max:100}, proves:{got:60,max:100}}, ["antibiotic"], 3, COMPS, TRAPS);
  assert.ok(d.F.some(s => s.includes("Etiologia")));
  assert.ok(d.D.some(s => s.includes("Signes i símptomes")));
  assert.ok(d.O.some(s => s.includes("3.2")));
  assert.ok(d.A.includes(TRAPS.antibiotic));
  assert.ok(d.A.some(s => /ajudes/.test(s)));
  for (const k of ["F","D","O","A"]) assert.ok(d[k].length >= 1, k);
});

test("un àlies amb + no és vàlid (evita una partida d'assaig)", () => {
  assert.equal(RA3.isValidEmail("nom.cognom+1@isvh.cat"), false);
  assert.equal(RA3.isValidEmail("nom.cognom@isvh.cat"), true);
});

test("fusionar estats de dues pestanyes conserva la primera resposta i les ajudes", () => {
  const stored = {step:2, wiz:4, name:"Anna", caseId:"A", ans:{A1a:"b"}, hints:["A-h1a"], seen:[]};
  const mine = {step:1, wiz:4, name:"Anna", caseId:"A", ans:{A1a:"a", A1b:["a"]}, hints:[], seen:["cap"]};
  const m = RA3.mergeState(mine, stored);
  assert.equal(m.ans.A1a, "b");
  assert.deepEqual(m.ans.A1b, ["a"]);
  assert.deepEqual(m.hints, ["A-h1a"]);
  assert.deepEqual(m.seen, ["cap"]);
  assert.equal(m.step, 2);
  assert.equal(RA3.mergeState(mine, null), mine);
  assert.equal(RA3.mergeState({step:"report", ans:{}, hints:[], seen:[]}, {step:5, ans:{}, hints:[], seen:[]}).step, "report");
});

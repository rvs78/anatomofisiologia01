// Recorregut complet al navegador (Chromium de Playwright) · versió 2.
// Ús: RA3_PASS=… node tests/e2e.mjs   (cal playwright-core; PW_MODULE=camí/al/mòdul si no és al NODE_PATH)
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import fs from "node:fs";

const require = createRequire(import.meta.url);
const pw = require(process.env.PW_MODULE || "playwright-core");
const RA3 = require("../ra3-malaltia/js/core.js");
const { CASES } = require("../ra3-malaltia/js/cases.js");
globalThis.self = globalThis;
const ES = { A:require("../ra3-malaltia/js/i18n/es-A.js"), B:require("../ra3-malaltia/js/i18n/es-B.js"), C:require("../ra3-malaltia/js/i18n/es-C.js") };
const exe = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/opt/pw-browsers/chromium"].find(p => fs.existsSync(p));
const PASS = process.env.RA3_PASS;
if (!PASS) { console.error("Cal RA3_PASS=<contrasenya del curs>"); process.exit(2); }

const PORT = 8765, BASE = `http://127.0.0.1:${PORT}/ra3-malaltia/`;
const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { stdio: "ignore" });
await new Promise(r => setTimeout(r, 800));

const emailFor = id => { for (let i = 0; ; i++) { const e = `alumne${i}@isvh.cat`; if (RA3.caseFor(e) === id) return e; } };
const itemOf = (id, itemId) => CASES[id].phases.flatMap(p => p.items).find(x => x.id === itemId);

async function login(page, email, pass = PASS) {
  await page.goto(BASE);
  await page.fill("#lgEmail", email); await page.fill("#lgPass", pass);
  await page.click("button[type=submit]");
}
async function noHScroll(page, where) {
  const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  assert.ok(sw <= iw, `desplaçament horitzontal a ${where}: ${sw} > ${iw}`);
}
async function begin(page, name = "Núria L'Àngel Prova") {
  await page.click("[data-act=wnext]");
  assert.ok((await page.textContent("#wErr")).length > 5, "cal el nom per començar");
  await page.fill("#wName", name);
  for (let i = 0; i < 4; i++) await page.click("[data-act=wnext]");
  await page.click("[data-act=start]");
  await page.waitForSelector("#diaTitle");
  for (let i = 0; i < 5; i++) await page.click("[data-act=dnext]");
  await page.click("[data-act=shift]");
}
async function answer(page, it, good) {
  const sel = (act, extra) => `[data-act=${act}][data-item="${it.id}"]${extra || ""}`;
  if (it.type === "single") await page.click(sel("pick", `[data-opt="${good ? it.a : it.options.find(o => o.id !== it.a).id}"]`));
  if (it.type === "multi") for (const o of it.options.filter(o => good ? it.a.includes(o.id) : !it.a.includes(o.id))) await page.click(sel("tog", `[data-opt="${o.id}"]`));
  if (it.type === "classify") {
    if (it.explore) for (const s of [...new Set(it.cards.map(k => k.spot))]) { const b = await page.$(`[data-act=spot][data-spot="${s}"]`); if (b) await b.click(); }   // les ja explorades no tenen botó
    for (const k of it.cards) { await page.click(sel("chip", `[data-card="${k.id}"]`)); await page.click(sel("zone", `[data-bin="${good ? k.a : it.bins.find(b => b.id !== k.a).id}"]`)); }
  }
  if (it.type === "order" && good) for (let k = 0; k < it.steps.length; k++) {
    for (;;) { const ids = await page.$$eval(`.ordlist[data-item="${it.id}"] .ord`, l => l.map(x => x.dataset.step)); if (ids.indexOf(it.steps[k].id) <= k) break; await page.click(sel("up", `[data-step="${it.steps[k].id}"]`)); }
  }
  if (it.type === "tests") for (const t of it.tests.filter(t => good ? t.kind === "need" : t.kind === "no")) await page.click(sel("tog", `[data-opt="${t.id}"]`));
  await page.click(sel("check"));
  await page.waitForSelector(`#q-${it.id}.done`);
}
async function play(page, id, good, { mobile, hints, lang } = {}) {
  for (let pi = 0; pi < 5; pi++) {
    const phase = CASES[id].phases[pi];
    if (hints) for (const h of phase.hints) await page.click(`details[data-hint="${h.id}"] summary`);
    let n = 0;
    for (;;) {
      const active = await page.$(".q.active"); if (!active) break;
      assert.equal(await page.$("#nextBtn"), null, "no es pot avançar amb preguntes pendents");
      const qid = (await active.getAttribute("id")).slice(2), it = itemOf(id, qid);
      if (lang === "es") assert.equal((await page.textContent(`#q-${qid} .qhead h2`)).trim(), ES[id].items[qid].prompt, "enunciat en castellà " + qid);
      await answer(page, it, good); n++;
      if (id === "A" && pi === 1 && n === 1 && good && !mobile) {
        const before = await page.textContent("#score");
        await page.reload(); await page.waitForSelector(`#q-${qid}.done`);
        assert.equal(await page.textContent("#score"), before, "la puntuació canvia en recarregar");
      }
    }
    assert.equal(n, phase.items.length, "totes les preguntes de la fase " + (pi + 1));
    if (mobile) await noHScroll(page, `${id} fase ${pi + 1}`);
    await page.click("#nextBtn");
  }
  await page.waitForSelector(".report");
}

const browser = await pw.chromium.launch({ executablePath: exe });
let failures = 0;
try {
  for (const id of ["A", "B", "C"]) {
    for (const mobile of [false, true]) {
      const ctx = await browser.newContext(mobile ? { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" } : { viewport: { width: 1280, height: 860 }, reducedMotion: "reduce" });
      const page = await ctx.newPage(); const errs = [];
      page.on("pageerror", e => errs.push(e.message)); page.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
      await login(page, emailFor(id));
      if (mobile) await noHScroll(page, "assistent");
      await begin(page);
      await play(page, id, true, { mobile });
      assert.equal((await page.textContent(".bignum b")).trim(), "10,0", "nota màxima " + id);
      const txt = await page.inputValue("#resultTxt");
      assert.match(txt, /TOTAL: 1000\/1000/); assert.match(txt, new RegExp("Cas: " + id));
      assert.ok((await page.textContent(".dafo h2")).includes("perfil"), "perfil de tècnic");
      if (mobile) await noHScroll(page, "informe");
      await page.goto(BASE + "verifica.html"); await page.fill("#txt", txt); await page.click("#go");
      assert.equal(await page.getAttribute("#out", "class"), "ok", "verificació " + id);
      await page.fill("#txt", txt.replace("TOTAL: 1000", "TOTAL: 999")); await page.click("#go");
      assert.equal(await page.getAttribute("#out", "class"), "bad", "detecta canvis " + id);
      assert.deepEqual(errs, [], "errors de consola " + id);
      console.log(`ok · cas ${id} · ${mobile ? "mòbil 360" : "escriptori"} · 1000 punts · verificació correcta`);
      await ctx.close();
    }
    const ctx = await browser.newContext({ reducedMotion: "reduce" }); const page = await ctx.newPage();
    await login(page, emailFor(id)); await begin(page);
    await play(page, id, false, { hints: true });
    assert.equal((await page.textContent(".bignum b")).trim(), "0,0", "pitjor cas " + id);
    console.log(`ok · cas ${id} · tot malament + totes les ajudes → 0 punts`);
    await ctx.close();
  }
  { // castellà: tot el recorregut, enunciats traduïts i informe
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, reducedMotion: "reduce" }); const page = await ctx.newPage(); const errs = [];
    page.on("pageerror", e => errs.push(e.message));
    await page.goto(BASE); await page.click(".lgcard .langBtn");
    assert.equal((await page.textContent("#lgTitle")).trim(), "El caso del mostrador");
    await page.fill("#lgEmail", emailFor("B")); await page.fill("#lgPass", PASS); await page.click("button[type=submit]");
    await begin(page, "Pablo Ruiz Prova");
    await play(page, "B", true, { lang: "es" });
    assert.ok((await page.textContent(".dafo h2")).includes("Tu perfil"));
    assert.match(await page.inputValue("#resultTxt"), /Alumne\/a:/, "el text de lliurament es manté en català");
    assert.deepEqual(errs, [], "errors en castellà");
    console.log("ok · castellà: 49 enunciats traduïts, informe en castellà, lliurament en català");
    await ctx.close();
  }
  { // dues pestanyes: la segona no pot tornar a respondre ni esborrar ajudes
    const ctx = await browser.newContext({ reducedMotion: "reduce" }); const id = "A", e = emailFor(id), it = CASES[id].phases[0].items[0];
    const p1 = await ctx.newPage(); await login(p1, e); await begin(p1, "Dues Pestanyes");
    const p2 = await ctx.newPage(); await login(p2, e); await p2.waitForSelector(`#q-${it.id}`);
    await p2.click(`[data-act=pick][data-item="${it.id}"][data-opt="${it.a}"]`);
    await p1.click(`details[data-hint="A-h1a"] summary`);
    await p1.click(`[data-act=pick][data-item="${it.id}"][data-opt="${it.options.find(o => o.id !== it.a).id}"]`);
    await p1.click(`[data-act=check][data-item="${it.id}"]`);
    await p2.waitForSelector(`#q-${it.id}.done`);
    assert.ok((await p2.getAttribute(`#q-${it.id} .verdict`, "class")).includes("bad"));
    assert.equal(await p2.textContent("#score"), await p1.textContent("#score"));
    const st = await p2.evaluate(k => JSON.parse(localStorage.getItem(k)), "ra3-malaltia-v2:" + e);
    assert.notEqual(st.ans[it.id], it.a); assert.ok(st.hints.includes("A-h1a"));
    console.log("ok · dues pestanyes: es manté la primera resposta i l'ajuda");
    await ctx.close();
  }
  { // arrossegar targetes, ordenar arrossegant, info de proves i escenes 3D
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } }); const page = await ctx.newPage(); const errs = [];
    page.on("pageerror", e => errs.push(e.message));
    await login(page, emailFor("B")); await begin(page, "Prova Tres De");
    await page.waitForSelector(".stage3d canvas");
    const yaw = async () => +(await page.getAttribute(".stage3d", "data-yaw"));
    const dist = async () => +(await page.getAttribute(".stage3d", "data-dist"));
    await page.waitForTimeout(400);
    const y0 = await yaw(), box = await (await page.$(".stage3d canvas")).boundingBox();
    await page.mouse.move(box.x + box.width * .7, box.y + box.height * .6); await page.mouse.down();
    await page.mouse.move(box.x + box.width * .4, box.y + box.height * .6, { steps: 8 }); await page.mouse.up();
    await page.waitForTimeout(700);
    assert.ok(Math.abs(await yaw() - y0) > .2, "arrossegar gira la vista");
    const d0 = await dist(); await page.click(".sc[data-c=in]"); await page.waitForTimeout(700);
    assert.ok(await dist() < d0, "el botó + apropa");
    await page.click(".sc[data-c=center]"); await page.waitForTimeout(1000);
    assert.ok(Math.abs(await yaw() - y0) < .05, "centra torna a la vista inicial");
    const handle = await page.$(".stage3d canvas");
    // arrossegar una targeta de classificar fins a una casella
    let drag = null;
    for (;;) {
      const active = await page.$(".q.active"); if (!active) break;
      const it = itemOf("B", (await active.getAttribute("id")).slice(2));
      if (it.type === "classify" && !drag) {
        const k = it.cards[0], chip = await page.$(`[data-act=chip][data-item="${it.id}"][data-card="${k.id}"]`), zone = await page.$(`.zone[data-item="${it.id}"][data-zone="${k.a}"]`);
        const a = await chip.boundingBox(), z = await zone.boundingBox();
        await page.mouse.move(a.x + 10, a.y + 10); await page.mouse.down(); await page.mouse.move(z.x + z.width / 2, z.y + z.height / 2, { steps: 10 }); await page.mouse.up();
        await page.waitForSelector(`.zone[data-zone="${k.a}"] [data-card="${k.id}"]`);
        drag = it.id;
      }
      await answer(page, it, true);
    }
    assert.ok(drag, "hi havia una pregunta de classificar"); assert.equal(await page.evaluate(c => c.isConnected, handle), true, "l'escena es manté viva");
    console.log("ok · arrossegar una targeta a la casella; 3D: gira, apropa, centra");
    await page.click("#nextBtn");
    for (;;) { const a = await page.$(".q.active"); if (!a) break; await answer(page, itemOf("B", (await a.getAttribute("id")).slice(2)), true); }
    await page.click("#nextBtn");
    await page.waitForSelector(".s3lbl.todo");
    const n0 = await page.$$eval(".s3lbl.todo", l => l.length);
    await page.click(".s3lbl.todo:not(.off)");
    await page.waitForFunction(n => document.querySelectorAll(".s3lbl.todo").length === n - 1, n0);
    console.log("ok · 3D: tocar un punt del pacient l'explora");
    for (;;) {
      const a = await page.$(".q.active"); if (!a) break; const it = itemOf("B", (await a.getAttribute("id")).slice(2));
      if (it.type === "order") { // arrossegar l'últim pas al primer lloc
        const items = await page.$$(`.ordlist[data-item="${it.id}"] .ord`), last = items[items.length - 1], lastId = await last.getAttribute("data-step");
        const b1 = await (await last.$(".grip")).boundingBox(), b0 = await items[0].boundingBox();
        await page.mouse.move(b1.x + b1.width / 2, b1.y + b1.height / 2); await page.mouse.down(); await page.mouse.move(b0.x + 20, b0.y + 4, { steps: 10 }); await page.mouse.up();
        assert.equal(await page.$eval(`.ordlist[data-item="${it.id}"] .ord`, x => x.dataset.step), lastId, "arrossegar reordena");
        console.log("ok · ordenar arrossegant");
      }
      await answer(page, it, true);
    }
    await page.click("#nextBtn");
    await page.waitForSelector(".infob");
    await page.click(".infob[data-test=ecg]"); await page.waitForSelector("#testInfo");
    assert.match(await page.textContent("#testInfo"), /ECG/);
    await page.click(".s3lbl.dev:not(.off)"); await page.waitForSelector("#testInfo");
    console.log("ok · info de proves amb ⓘ i tocant un aparell 3D");
    assert.deepEqual(errs, [], "errors 3D/arrossegar");
    await ctx.close();
  }
  const ctx = await browser.newContext(); const page = await ctx.newPage();
  for (const [email, pass, msg] of [["a@isvh.cat.evil.com", PASS, "@isvh.cat"], ["nom+1@isvh.cat", PASS, "@isvh.cat"], ["nom@isvh.cat", "dolenta", "contrasenya"]]) {
    await login(page, email, pass);
    assert.match(await page.textContent("#lgErr"), new RegExp(msg));
  }
  await login(page, "  Nom.Cognom@ISVH.CAT ");
  await page.waitForSelector(".wiz");
  console.log("ok · accés: domini, contrasenya i majúscules");
  await ctx.close();
} catch (e) { failures++; console.error("FAIL", e.message); }
await browser.close(); server.kill();
process.exit(failures ? 1 : 0);

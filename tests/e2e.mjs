// Recorregut complet al navegador (Chromium de Playwright).
// Ús: node tests/e2e.mjs   (cal playwright o playwright-core; PW_MODULE=camí/al/mòdul si no és al NODE_PATH)
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import fs from "node:fs";

const require = createRequire(import.meta.url);
const pw = require(process.env.PW_MODULE || "playwright-core");
const RA3 = require("../ra3-malaltia/js/core.js");
const { CASES } = require("../ra3-malaltia/js/cases.js");
const exe = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/opt/pw-browsers/chromium"].find(p => fs.existsSync(p));

const PORT = 8765, BASE = `http://127.0.0.1:${PORT}/ra3-malaltia/`;
const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { stdio: "ignore" });
await new Promise(r => setTimeout(r, 800));

const emailFor = id => { for (let i = 0; ; i++) { const e = `alumne${i}@isvh.cat`; if (RA3.caseFor(e) === id) return e; } };
const items = id => CASES[id].phases.flatMap(p => p.items);

const PASS = process.env.RA3_PASS;
if (!PASS) { console.error("Cal RA3_PASS=<contrasenya del curs>"); process.exit(2); }
async function login(page, email, pass = PASS) {
  await page.goto(BASE);
  await page.fill("#lgEmail", email); await page.fill("#lgPass", pass);
  await page.click("button[type=submit]");
}
async function noHScroll(page, where) {
  const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  assert.ok(sw <= iw, `desplaçament horitzontal a ${where}: ${sw} > ${iw}`);
}
async function answer(page, it, good) {
  const sel = (act, extra) => `[data-act=${act}][data-item="${it.id}"]${extra || ""}`;
  if (it.type === "single") await page.click(sel("pick", `[data-opt="${good ? it.a : it.options.find(o => o.id !== it.a).id}"]`));
  if (it.type === "multi") for (const o of it.options.filter(o => good ? it.a.includes(o.id) : !it.a.includes(o.id))) await page.click(sel("tog", `[data-opt="${o.id}"]`));
  if (it.type === "classify") {
    if (it.explore) for (const s of [...new Set(it.cards.map(k => k.spot))]) await page.click(`[data-act=spot][data-spot="${s}"]`);
    for (const k of it.cards) await page.click(sel("bin", `[data-card="${k.id}"][data-bin="${good ? k.a : it.bins.find(b => b.id !== k.a).id}"]`));
  }
  if (it.type === "tests") for (const t of it.tests.filter(t => good ? t.kind === "need" : t.kind === "no")) await page.click(sel("tog", `[data-opt="${t.id}"]`));
  await page.click(sel("check"));
  await page.waitForSelector(`#q-${it.id}.done`);
}
async function play(page, id, good, { mobile, hints } = {}) {
  await page.click("[data-act=wnext]");
  assert.match(await page.textContent("#wErr"), /nom i almenys un cognom/, "cal el nom per començar");
  await page.fill("#wName", "Núria L'Àngel Prova");
  for (let i = 0; i < 4; i++) await page.click("[data-act=wnext]");
  await page.click("[data-act=start]");
  for (let pi = 0; pi < 5; pi++) {
    const phase = CASES[id].phases[pi];
    if (hints) for (const h of phase.hints) await page.click(`details[data-hint="${h.id}"] summary`);
    for (const it of phase.items) {
      assert.equal(await page.$("#nextBtn"), null, "no es pot avançar amb preguntes pendents");
      await answer(page, it, good);
      if (id === "A" && pi === 1 && it === phase.items[0] && good) { // la recàrrega no canvia res
        const before = await page.textContent("#score");
        await page.reload(); await page.waitForSelector(`#q-${it.id}.done`);
        assert.equal(await page.textContent("#score"), before, "la puntuació canvia en recarregar");
      }
    }
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
      page.on("pageerror", e => errs.push(e.message)); page.on("console", m => { if (m.type() === "error" && !/fonts\.g/.test(m.text())) errs.push(m.text()); });
      await login(page, emailFor(id));
      if (mobile) await noHScroll(page, "assistent");
      await play(page, id, true, { mobile });
      assert.equal((await page.textContent(".bignum b")).trim(), "10,0", "nota màxima " + id);
      const txt = await page.inputValue("#resultTxt");
      assert.match(txt, /TOTAL: 1000\/1000/); assert.match(txt, new RegExp("Cas: " + id));
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
    await login(page, emailFor(id));
    await play(page, id, false, { hints: true });
    assert.equal((await page.textContent(".bignum b")).trim(), "0,0", "pitjor cas " + id);
    console.log(`ok · cas ${id} · tot malament + totes les ajudes → 0 punts`);
    await ctx.close();
  }
  { // dues pestanyes: la segona no pot tornar a respondre ni esborrar ajudes
    const ctx = await browser.newContext({ reducedMotion: "reduce" }); const id = "A", e = emailFor(id), it = CASES[id].phases[0].items[0];
    const p1 = await ctx.newPage(); await login(p1, e);
    await p1.fill("#wName", "Dues Pestanyes"); for (let i = 0; i < 4; i++) await p1.click("[data-act=wnext]");
    await p1.click("[data-act=start]");
    const p2 = await ctx.newPage(); await login(p2, e); await p2.waitForSelector(`#q-${it.id}`);
    await p2.click(`[data-act=pick][data-item="${it.id}"][data-opt="${it.a}"]`);
    await p1.click(`details[data-hint="A-h1a"] summary`);
    await p1.click(`[data-act=pick][data-item="${it.id}"][data-opt="${it.options.find(o => o.id !== it.a).id}"]`);
    await p1.click(`[data-act=check][data-item="${it.id}"]`);
    await p2.waitForSelector(`#q-${it.id}.done`);
    assert.match(await p2.textContent(`#q-${it.id} .verdict`), /No és correcte/);
    assert.equal(await p2.textContent("#score"), await p1.textContent("#score"));
    const st = await p2.evaluate(k => JSON.parse(localStorage.getItem(k)), "ra3-malaltia:" + e);
    assert.notEqual(st.ans[it.id], it.a); assert.ok(st.hints.includes("A-h1a"));
    console.log("ok · dues pestanyes: es manté la primera resposta i l'ajuda");
    await ctx.close();
  }
  { // escenes 3D: es poden girar, apropar i tocar
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } }); const page = await ctx.newPage(); const errs = [];
    page.on("pageerror", e => errs.push(e.message));
    await login(page, emailFor("B"));
    await page.fill("#wName", "Prova Tres De"); for (let i = 0; i < 4; i++) await page.click("[data-act=wnext]"); await page.click("[data-act=start]");
    await page.waitForSelector(".stage3d canvas");
    const yaw = async () => +(await page.getAttribute(".stage3d", "data-yaw"));
    const dist = async () => +(await page.getAttribute(".stage3d", "data-dist"));
    await page.waitForTimeout(400);
    const y0 = await yaw(), box = await (await page.$(".stage3d canvas")).boundingBox();
    await page.mouse.move(box.x + box.width * .7, box.y + box.height * .6); await page.mouse.down();
    await page.mouse.move(box.x + box.width * .4, box.y + box.height * .6, { steps: 8 }); await page.mouse.up();
    await page.waitForTimeout(600);
    assert.ok(Math.abs(await yaw() - y0) > .2, "arrossegar gira la vista");
    const d0 = await dist(); await page.click(".sc[data-c=in]"); await page.waitForTimeout(600);
    assert.ok(await dist() < d0, "el botó + apropa");
    await page.click(".sc[data-c=center]"); await page.waitForTimeout(900);
    assert.ok(Math.abs(await yaw() - y0) < .05, "centra torna a la vista inicial");
    // el canvas no es recrea en respondre (la càmera es manté)
    const handle = await page.$(".stage3d canvas"); await page.click(".sc[data-c=left]");
    await answer(page, CASES.B.phases[0].items[0], true);
    assert.equal(await page.evaluate(c => c.isConnected, handle), true, "l'escena es manté viva");
    const shot = await page.evaluate(() => { const c = document.querySelector(".stage3d canvas"); return c.width > 0 && c.height > 0; });
    assert.ok(shot, "el canvas té mida");
    console.log("ok · 3D: arrossegar gira, + apropa, ◎ centra, l'escena es manté");
    // fase 3: etiquetes 3D clicables
    for (const it of CASES.B.phases[0].items.slice(1)) await answer(page, it, true);
    await page.click("#nextBtn");
    for (const it of CASES.B.phases[1].items) await answer(page, it, true);
    await page.click("#nextBtn");
    await page.waitForSelector(".s3lbl.todo");
    const n0 = await page.$$eval(".s3lbl.todo", l => l.length);
    await page.click(".s3lbl.todo:not(.off)");
    await page.waitForFunction(n => document.querySelectorAll(".s3lbl.todo").length === n - 1, n0);
    assert.ok(await page.$(".crd"), "explorar un punt 3D mostra una troballa");
    assert.deepEqual(errs, [], "errors 3D");
    console.log("ok · 3D: tocar un punt del pacient l'explora");
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

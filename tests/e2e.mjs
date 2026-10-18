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

async function login(page, email, pass = "far2026") {
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
    if (it.explore) for (const s of [...new Set(it.cards.map(k => k.spot))]) await page.dispatchEvent(`.spot[data-spot="${s}"]`, "click"); // el punt batega i la capçalera fixa el pot tapar
    for (const k of it.cards) await page.click(sel("bin", `[data-card="${k.id}"][data-bin="${good ? k.a : it.bins.find(b => b.id !== k.a).id}"]`));
  }
  if (it.type === "tests") for (const t of it.tests.filter(t => good ? t.kind === "need" : t.kind === "no")) await page.click(sel("tog", `[data-opt="${t.id}"]`));
  await page.click(sel("check"));
  await page.waitForSelector(`#q-${it.id}.done`);
}
async function play(page, id, good, { mobile, hints } = {}) {
  for (let i = 0; i < 4; i++) await page.click("[data-act=wnext]");
  await page.fill("#wName", "Núria L'Àngel Prova");
  await page.click("[data-act=start]");
  for (let pi = 0; pi < 5; pi++) {
    const phase = CASES[id].phases[pi];
    if (hints) for (const h of phase.hints) await page.click(`details[data-hint="${h.id}"] summary`);
    for (const it of phase.items) {
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
      const ctx = await browser.newContext(mobile ? { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true } : { viewport: { width: 1280, height: 860 } });
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
    const ctx = await browser.newContext(); const page = await ctx.newPage();
    await login(page, emailFor(id));
    await play(page, id, false, { hints: true });
    assert.equal((await page.textContent(".bignum b")).trim(), "0,0", "pitjor cas " + id);
    console.log(`ok · cas ${id} · tot malament + totes les ajudes → 0 punts`);
    await ctx.close();
  }
  const ctx = await browser.newContext(); const page = await ctx.newPage();
  for (const [email, pass, msg] of [["a@isvh.cat.evil.com", "far2026", "@isvh.cat"], ["nom@isvh.cat", "dolenta", "contrasenya"]]) {
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

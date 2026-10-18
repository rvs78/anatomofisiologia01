# RA3 · El cas del taulell — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Static Catalan web app (login → wizard → 5 scored phases on one of three clinical cases → report with DAFO and verification code) for FAR 1L, live on GitHub Pages before Monday 19/10/2026.

**Architecture:** Vanilla HTML/CSS/JS in `ra3-malaltia/`, same pattern as `rvs78/logistica02`. Pure logic (`core.js`) and case data (`cases.js`) are UMD modules (browser global + `module.exports`) so `node --test` covers them; UI (`app.js`, `scenes.js`) renders into one page. State lives in `localStorage` per user. No server.

**Tech Stack:** HTML5, CSS custom properties, ES2020 JavaScript, inline SVG, Web Crypto (SHA-256), Web Speech API, `node --test` (Node 22), Playwright (Chromium at `/opt/pw-browsers`) for the end-to-end check.

**Spec:** `docs/superpowers/specs/2026-10-18-ra3-malaltia-design.md` · content source `docs/ra3-contingut.md`

## Global Constraints

- All user-facing text in Catalan, terminology from `docs/ra3-contingut.md`; nothing asked that is not in that file.
- Login: email must match `/^[a-z0-9._%+-]+@isvh\.cat$/` after `trim().toLowerCase()`; password `far2026` compared only as SHA-256 hex (never stored in clear in the code).
- 5 phases × 200 points = 1.000; phase score floored at 0; grade = total/100 with one decimal.
- Each hint opened costs 15 points once; correct sums `pts`, wrong subtracts `round(pts/2)`.
- Phase 4 test kinds: `need` (+pts if requested), `neutral` (0, explanation), `no` (−round(pts/2) if requested).
- Case = `["A","B","C"][fnv1a(email) % 3]`.
- Code `RA3-XXXX-XXXX` = FNV-1a over salt `RA3-MALALTIA-2026` + the fields printed in the result text only.
- First attempt counts: no restart button; each item answerable once.
- Works at 360 px width with no horizontal scroll; touch targets ≥ 44 px; keyboard operable; `prefers-reduced-motion` respected.
- Storage keys prefixed `ra3-malaltia:` (shares origin `rvs78.github.io` with other apps).

## Review Focus

1. Reload in the middle of a phase → answered items stay locked with their feedback and the score does not change (no double scoring).
2. Email variants: `  Nom.Cognom@ISVH.CAT ` accepted and normalised; `a@isvh.cat.evil.com`, `@isvh.cat`, `a@isvh.com` rejected.
3. Worst case (all wrong + all hints) → every phase shows 0, total ≥ 0; best case → exactly 1.000 for every case.
4. Clipboard API unavailable → "Copia el resultat" falls back to selecting the textarea with a message.
5. Names with accents and apostrophes (`Núria L'Àngel`) survive result text → `verifica.html` parse → code matches.

---

## File Structure

```
index.html                         root landing with link to the app (create)
ra3-malaltia/index.html            login, wizard, app shell, a11y dialog
ra3-malaltia/verifica.html         teacher checker page
ra3-malaltia/version.json          {"v":"1"}
ra3-malaltia/css/app.css           tokens, layout, components, scenes
ra3-malaltia/js/core.js            pure logic (UMD → window.RA3)
ra3-malaltia/js/cases.js           case data (UMD → window.RA3_CASES), glossary of competencies
ra3-malaltia/js/scenes.js          SVG builders (pharmacy, lab, consultation, test results)
ra3-malaltia/js/login.js           access gate (as logistica02)
ra3-malaltia/js/app.js             state, wizard, phase renderers, report
tests/core.test.js                 node --test
tests/cases.test.js                node --test (data integrity)
tests/e2e.mjs                      Playwright run-through (desktop + 360 px)
package.json                       {"type":"commonjs","scripts":{"test":"node --test tests/"}}
```

## Data model (`cases.js`)

```js
// item types
{ id, comp, sec, type:"single", prompt, say?, options:[{id,t,trap?}], a:"optId", pts, why }
{ id, comp, sec, type:"multi",  prompt, options:[{id,t,trap?}], a:["optId",...], pts, why }      // pts split across correct options
{ id, comp, sec, type:"classify", prompt, bins:[{id,t}], cards:[{id,t,a:"binId"}], pts, why }    // pts split across cards
{ id, comp, sec, type:"tests", prompt, tests:[{id,t,kind:"need"|"neutral"|"no",pts,result:{viz,label,text}}], why } // max = sum of need pts
CASES = { A:{ id:"A", name, patient:{nom,edat,ofici,avatar}, intro, phases:[{key, title, scene, hints:[{id,title,text}], items:[...]}, ×5] }, B, C }
COMPS = { salut, etiologia, signes, exploracio, proves, classificacio, tractament, farmacia }  // id → Catalan label + review section
TRAPS = { antibiotic, diagnosticar, signeSimptoma, provesInnecessaries, ... } // id → Catalan threat text
```
`comp` must be a key of `COMPS`; `sec` one of `"3.1".."3.6"`; `trap` a key of `TRAPS`.

---

### Task 1: Core logic

**Files:** Create `ra3-malaltia/js/core.js`, `tests/core.test.js`, `package.json`

**Interfaces — Produces (window.RA3 / module.exports):**
- `normEmail(s:string):string`, `isValidEmail(s:string):boolean`
- `PASS_SHA256:string` (hex of `far2026`)
- `fnv1a(s:string):number` (uint32), `caseFor(email:string):"A"|"B"|"C"`
- `itemMax(item):number`, `itemDelta(item, answer):number` (answer: optId | optId[] | {cardId:binId} | testId[] | undefined → 0)
- `phaseScore(phase, answers:{[itemId]:any}, hintsOpen:string[]):number` (floored 0)
- `itemErrors(item, answer):number` (count of wrong choices/cards/unneeded tests)
- `compStats(caseObj, answers):{[comp]:{got:number,max:number}}`
- `trapsHit(caseObj, answers):string[]`
- `dafo(stats, trapIds, hintsCount, COMPS, TRAPS):{F:string[],D:string[],O:string[],A:string[]}`
- `resultFields(o):{email,name,caseId,phases:number[5],hints,errors,total}`; `resultText(f):string`; `parseResultText(txt):fields|null`; `verifCode(f):string`

- [ ] **Step 1: Write failing tests** in `tests/core.test.js`:
  - `isValidEmail("  Nom.Cognom@ISVH.CAT ") === true`; false for `"a@isvh.cat.evil.com"`, `"@isvh.cat"`, `"a@isvh.com"`.
  - `PASS_SHA256 === sha256hex("far2026")` (compute with `crypto.createHash`).
  - `caseFor` returns only A/B/C and is stable for the same normalised email; over 300 synthetic emails each case gets ≥ 60.
  - `itemDelta` single: correct → `pts`, wrong → `-Math.round(pts/2)`, undefined → 0. Classify with 4 cards, pts 40: 3 right 1 wrong → `30 - 5 = 25`. Tests item: need(20)+need(20)+no(10)+neutral picked → `40 - 5 = 35`.
  - `phaseScore` with all wrong and 2 hints → 0; with all right and 0 hints → sum of `itemMax`.
  - `verifCode(f)` matches `/^RA3-[0-9A-F]{4}-[0-9A-F]{4}$/`; `parseResultText(resultText(f))` deep-equals `f` for name `"Núria L'Àngel"`; changing any phase score changes the code.
  - `dafo` puts a comp at 0.9 in F, at 0.3 in D and O, trap `antibiotic` text in A, and hints ≥ 3 adds the dependence threat.
- [ ] **Step 2:** `node --test tests/core.test.js` → FAIL (module missing).
- [ ] **Step 3:** Implement `core.js` (UMD wrapper; `multi` splits pts evenly over `a`, wrong pick −half a share; classify splits pts over cards; floor rounding with `Math.round`).
- [ ] **Step 4:** `node --test tests/core.test.js` → PASS.
- [ ] **Step 5:** Commit `feat(ra3): lògica pura de puntuació, accés i codi de verificació`.

### Task 2: Case data A, B, C

**Files:** Create `ra3-malaltia/js/cases.js`, `tests/cases.test.js`

**Interfaces — Consumes:** `itemMax` from Task 1. **Produces:** `CASES`, `COMPS`, `TRAPS`, `PHASES` (titles: Taulell, Causa, Consulta, Proves, Decisió).

Content per case follows spec §5–§6 and `docs/ra3-contingut.md`: phase 1 4–5 dialogue items (incl. a derivation item and a trap option `diagnosticar`/`antibiotic`); phase 2 agent pick, exògena/endògena/ambiental/multifactorial, classify factors (modificable / no modificable or agent/persona/entorn), 1–2 concept items; phase 3 classify findings signe/símptoma, exploration maneuvers, history-natural timeline; phase 4 one `tests` item (A: frotis need, radiografia neutral; B: frotis, radiografia, biòpsia need; C: analítica sang, orina need) + 2–3 concept items; phase 5 diagnosis, classification axes, treatment type and measures, desenllaç. Every item has `why` citing its section. Each phase has 1–2 hints that recall theory without giving the answer.

- [ ] **Step 1: Write failing tests** in `tests/cases.test.js`, for each case: 5 phases; `sum(itemMax) === 200` per phase; every `a`/card `a` references an existing option/bin; `comp ∈ COMPS`, `sec ∈ 3.1–3.6`, `trap ∈ TRAPS`; every item has non-empty `why`; ids unique within case; each phase has ≥ 1 hint; phase 4 of A has `radiografia` neutral, of B has `biopsia` need, of C has no `need` imaging test.
- [ ] **Step 2:** `node --test` → FAIL.
- [ ] **Step 3:** Write `cases.js` (case A first, then B and C with the same item counts).
- [ ] **Step 4:** `node --test` → PASS.
- [ ] **Step 5:** Commit `feat(ra3): casos clínics de la grip, en Jordi i l'Antoni`.

### Task 3: Shell, access and wizard

**Files:** Create `ra3-malaltia/index.html`, `ra3-malaltia/css/app.css`, `ra3-malaltia/js/login.js`, `ra3-malaltia/version.json`, `ra3-malaltia/js/app.js` (wizard + state only)

**Interfaces — Consumes:** `RA3.isValidEmail`, `RA3.normEmail`, `RA3.PASS_SHA256`, `RA3.caseFor`. **Produces:** `startApp(user)` in `app.js`; state `S = {step:"wizard"|1..5|"report", wiz:0, name:"", caseId, ans:{}, hints:[], done:[]}` saved under `ra3-malaltia:` + email.

- [ ] **Step 1:** `login.js` mirrors logistica02 (`sessionStorage` key `ra3-malaltia-user`, Catalan errors exactly: «Escriu el teu correu de l'institut. Ha d'acabar en @isvh.cat.» / «La contrasenya no és correcta. Torna-ho a provar.»).
- [ ] **Step 2:** Header (brand, 5-phase progress, score `/1000`, a11y button, user, «Surt»), a11y dialog (size, font, contrast, motion), voice `speak()` as logistica02.
- [ ] **Step 3:** Wizard with 5 steps from spec §4, Anterior/Següent, step dots, name required (≥ 3 chars) before «Comença el torn»; on start set `caseId = caseFor(user)`.
- [ ] **Step 4:** Verify manually: `python3 -m http.server -d ra3-malaltia 8000` and open in Playwright: wrong domain shows error; correct login reaches wizard; reload keeps wizard step.
- [ ] **Step 5:** Commit `feat(ra3): accés, assistent d'instruccions i estructura`.

### Task 4: Phase engine and scenes

**Files:** Create `ra3-malaltia/js/scenes.js`; Modify `ra3-malaltia/js/app.js`, `ra3-malaltia/css/app.css`

**Interfaces — Consumes:** `CASES`, `RA3.itemDelta`, `RA3.phaseScore`. **Produces:** `SCENES.pharmacy(patient)`, `SCENES.lab(cards)`, `SCENES.consult(patient, hotspots)`, `SCENES.result(viz, data)` returning SVG strings; renderers `renderSingle/Multi/Classify/Tests(item)`.

- [ ] **Step 1:** Phase layout: scene panel (SVG) + question cards; hint `<details>` showing «−15 punts» before opening, confirmation on first open, recorded in `S.hints`.
- [ ] **Step 2:** Renderers: single/multi (buttons with `aria-pressed`, «Comprova»), classify (tap card → tap bin, also keyboard; bins show placed cards), tests (toggle tests, «Demana les proves», then each requested test animates its result: `thermo`, `bars` with normal range band, `xray`, `ecg`, `micro`, `swab`). After answering: locked, ✓/✗ text + `why` + delta.
- [ ] **Step 3:** Phase 1 scene: first-person counter with patient and speech bubbles (with «Escolta»); Phase 3 consultation with clickable hotspots revealing findings; Phase 5 comparison table built from phase 3 findings and phase 4 results.
- [ ] **Step 4:** «Fase següent» enabled only when all items answered; header score updates live.
- [ ] **Step 5:** Verify in browser at 1280 px and 360 px for each case (set email to hit A/B/C): no console errors, no horizontal scroll.
- [ ] **Step 6:** Commit `feat(ra3): fases interactives i escenes il·lustrades`.

### Task 5: Report and teacher checker

**Files:** Modify `ra3-malaltia/js/app.js`, `css/app.css`; Create `ra3-malaltia/verifica.html`

**Interfaces — Consumes:** `RA3.compStats`, `RA3.trapsHit`, `RA3.dafo`, `RA3.resultFields`, `RA3.resultText`, `RA3.verifCode`, `RA3.parseResultText`.

- [ ] **Step 1:** Report: total /1000 and grade /10 big, SVG bar chart per phase (200 max each, accessible labels), errors and hints, DAFO 2×2 grid, code, result textarea + «Copia el resultat» with clipboard fallback, screenshot instruction, «Torna a veure les fases» read-only.
- [ ] **Step 2:** `verifica.html`: textarea → parse → «Codi correcte» / «El codi no quadra» / «Text no reconegut»; loads `js/core.js` only.
- [ ] **Step 3:** Commit `feat(ra3): informe final amb DAFO i pàgina de verificació`.

### Task 6: End-to-end check, landing and publish

**Files:** Create `tests/e2e.mjs`, `index.html`; Modify `README.md`

- [ ] **Step 1:** `tests/e2e.mjs` (playwright-core, `executablePath: '/opt/pw-browsers/...chromium'`): for one email per case, log in, finish wizard, answer every item with the correct answer read from `CASES`, open no hints, reach report; assert score text `1000`, grade `10,0`, code format, and that pasting the result text into `verifica.html` shows «Codi correcte». Repeat at 360×740 asserting `scrollWidth <= innerWidth`. Second run: all wrong + all hints → every phase 0.
- [ ] **Step 2:** `node --test tests/ && node tests/e2e.mjs` → all PASS, no console errors.
- [ ] **Step 3:** Root `index.html` (link card to `ra3-malaltia/`), README section with access and teacher checker.
- [ ] **Step 4:** Commit, merge branch into `main`, push `main` and the feature branch; check `https://rvs78.github.io/anatomofisiologia01/ra3-malaltia/` responds; if Pages is off, tell the teacher: Settings → Pages → Deploy from branch → `main` / root.

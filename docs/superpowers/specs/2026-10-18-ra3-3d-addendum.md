# RA3 · El cas del taulell — annex: 3D, moviment, fonts i progressió

Data: 18/10/2026 · Amplia `2026-10-18-ra3-malaltia-design.md` i substitueix el punt «sense 3D» de la secció 8.

## Decisions del docent

- Fonts allotjades al mateix lloc (cap petició a Google).
- El nom s'escriu a la pantalla d'introducció i és obligatori per iniciar les fases.
- Fases progressives: no es pot passar a la següent fins a completar l'actual.
- Escenes en 3D que es poden moure, girar i ampliar, realistes i interactives.
- Dinàmica d'efectes segons les pautes de moviment de HyperFrames (GSAP).

## Com es construeix (decisions del constructor)

- **3D amb three.js r147 i animació amb GSAP 3.12**, tots dos allotjats a `ra3-malaltia/vendor/` (sense CDN; la CSP continua sent `script-src 'self'`).
- **Escenes 3D:**
  1. Taulell en primera persona: girar el cap (arrossegar o fletxes), apropar (roda o pessic); el pacient respira i assenteix quan parla.
  2. Laboratori: banc amb microscopi i models 3D dels agents (virus, bacteri, pol·len, núvol de gas, cèl·lules); es poden girar al voltant i tocar per veure'n el nom.
  3. Consulta: pacient de cos sencer sobre una plataforma giratòria (360°), punts d'exploració 3D clicables amb etiquetes; se segueixen mostrant els botons «Explora: zona».
  4. Proves: banc de laboratori 3D (gradeta de tubs, negatoscopi, monitor d'ECG animat).
  5. Decisió: es manté la il·lustració 2D (és una taula comparativa).
- **Controls visibles:** botons «Gira ←», «Gira →», «Apropa», «Allunya» i «Centra» sobre cada escena, perquè girar no depengui de saber arrossegar.
- **Si l'ordinador no té WebGL**, es mostren les il·lustracions SVG actuals. Amb «Animacions: No» o `prefers-reduced-motion`, no hi ha moviment automàtic.
- **Moviment (pautes HyperFrames):** només transformacions i opacitat; entrada de fase en una sola seqüència; resposta comprovada → retroacció que apareix i xip de punts que fa «pop»; marcador que compta; informe amb la nota que compta i el DAFO en cascada. Les regles de determinisme de HyperFrames són per a vídeo renderitzat i no s'apliquen a una app interactiva.
- **Nom:** nom i almenys un cognom (dues paraules), a la primera pantalla de l'assistent; sense nom no es pot avançar.
- **Progressió:** a més del botó que només apareix en acabar la fase, el codi rebutja avançar si hi ha preguntes sense respondre.
- **Rendiment:** densitat de píxels màxima 1,5, ombres de 1024 px, el bucle s'atura quan la pestanya no és visible.

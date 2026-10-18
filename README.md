# anatomofisiologia01

Aplicacions interactives i simuladors per al mòdul MP0061 Anatomofisiologia i patologia bàsiques (CFGM Farmàcia i Parafarmàcia), especialment de patologia.

## RA3 · El cas del taulell (`ra3-malaltia/`)

Activitat individual gamificada del RA3 «La malaltia». L'alumne fa de tècnic o tècnica al taulell de la farmàcia i segueix un cas clínic en cinc fases:

1. **El taulell**: escolta el pacient, separa signes i símptomes i decideix si cal derivar-lo.
2. **La causa**: identifica l'agent o la causa i classifica els factors de risc.
3. **La consulta**: explora el pacient tocant la il·lustració, classifica signes i símptomes i el situa en la història natural.
4. **Les proves**: demana les proves que calen (les innecessàries resten) i en veu els resultats.
5. **La decisió**: compara clínica i resultats, tria el diagnòstic, classifica la malaltia i tria el tractament.

Hi ha tres casos (grip, faringitis amb lesió a la galta, diabetis tipus 2). El cas surt del correu de l'alumne, de manera que sempre li toca el mateix. Cada fase val 200 punts (1.000 en total, nota = punts / 100). Els errors resten la meitat dels punts de la pregunta i cada ajuda «Consulta els apunts» resta 15 punts.

### Accés

- Usuari: correu de l'institut acabat en `@isvh.cat`.
- Contrasenya: la facilita el professorat. Al codi només hi ha la seva empremta SHA-256.

L'accés filtra l'entrada, però no protegeix dades: és un allotjament estàtic (GitHub Pages) i el progrés es desa només al navegador de cada alumne. No s'envia cap dada a cap servidor.

### Lliurament i verificació

L'informe final mostra la puntuació, un DAFO personal i un codi de verificació `RA3-XXXX-XXXX`. L'alumne copia el text (o fa una captura) i el lliura a Google Classroom.

El docent pot enganxar el text a `ra3-malaltia/verifica.html` per comprovar que no s'ha editat a mà.

### Contingut

Tot el contingut surt dels apunts del RA3 (resum a `docs/ra3-contingut.md`). Disseny i pla: `docs/superpowers/`.

### Proves

```bash
npm test                 # lògica i integritat dels casos (node --test)
RA3_PASS=… node tests/e2e.mjs   # recorregut complet a Chromium (cal playwright-core; PW_MODULE=camí si no és al NODE_PATH)
```

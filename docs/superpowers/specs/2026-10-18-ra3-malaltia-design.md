# RA3 · El cas del taulell — disseny

Data: 18/10/2026 · Docent: Rubén Vallejo · Grup: FAR 1L (CFGM Farmàcia i Parafarmàcia, MP0061)
Contingut de referència: `docs/ra3-contingut.md` (resum fidel del Drive del docent).
Sistema de referència: repositori `rvs78/logistica02` (accés, desat, informe i codi de verificació).

## 1. Intenció

Activitat individual gamificada per repassar el RA3 «La malaltia» el **dilluns 19/10/2026** (sessió de repàs abans de la prova global del 23/10). L'alumnat fa de **tècnic/a de farmàcia al taulell**: arriba un pacient amb un problema i el segueix pas a pas pel procés d'emmalaltir i d'estudi clínic: causa → signes i símptomes → diagnòstic i proves → classificació i tractament. El valor és relacionar els conceptes del RA3 amb un cas real, no memoritzar definicions soltes.

Tot el text de l'app és en **català**, amb la terminologia dels apunts del docent.

## 2. Objectius, no-objectius i anti-objectius

**Objectius**
- 5 fases interactives, visuals i puntuades, sobre un cas clínic assignat a l'atzar.
- Ajudes desplegables que resten punts; errors que resten; encerts que sumen.
- Informe final visual amb puntuació, nota sobre 10, DAFO personal i codi de verificació per lliurar a Classroom.
- Funciona en ordinador i mòbil, sense instal·lar res.

**No-objectius**
- No es desen resultats en cap servidor ni full de càlcul. L'alumne lliura el resultat a Classroom (captura o text copiat).
- No hi ha panell de docent.
- No es classifiquen patògens en detall (bacteris/virus/fongs/protozous/helmints). A la fase d'etiologia n'hi ha prou que identifiquin la causa i el tipus d'agent.

**Anti-objectius** (seria un fracàs encara que funcionés)
- Preguntes amb contingut que no surt a `docs/ra3-contingut.md` o que el contradiu.
- Que el tècnic de farmàcia «diagnostiqui» al taulell: a la fase 1 la resposta correcta és escoltar, observar, descriure i derivar.
- Que no estigui publicada i provada abans de dilluns al matí.
- Text en castellà o amb errades de català.

## 3. Decisions del docent (tal com les ha pres)

- Idioma català.
- Accés: correu obligatori acabat en `@isvh.cat` i una contrasenya comuna que el docent dona a classe (no s'escriu al repositori).
- Pantalla 2: instruccions per passos en format **wizard**.
- 5 fases: (1) farmàcia en primera persona, pacient al taulell que fa preguntes; (2) etiologia: causa / agent; (3) signes i símptomes en una consulta mèdica; (4) diagnòstic i proves, amb dibuixos o gràfics dinàmics; (5) comparar resultats amb signes i símptomes, determinar i classificar la malaltia i decidir tractament.
- Tot avaluat: suma i resta punts. Ajudes desplegables que resten punts.
- Pantalla final: resultats visuals, DAFO de l'alumne i codi/resum per enviar a Classroom.
- **Cas clínic diferent** per alumne (assignat a l'atzar).
- Sense desar resultats: s'usa el sistema de `logistica02` i l'alumne envia el resultat.

## 4. Flux de pantalles

1. **Accés.** Correu + contrasenya. Missatges d'error en català (correu sense `@isvh.cat`; contrasenya incorrecta). Sessió en `sessionStorage` com a `logistica02`.
2. **Instruccions (wizard, 5 passos)** amb botons Anterior / Següent i indicador de pas:
   1. Benvinguda i rol: «Ets tècnic/a a l'oficina de farmàcia».
   2. Les 5 fases (icona + una línia cadascuna).
   3. Puntuació: encerts sumen, errors resten, ajudes resten; nota final sobre 10.
   4. Com lliurar: informe + codi a Classroom.
   5. Escriu el teu nom i cognoms → «Comença el torn». En aquest moment s'assigna el cas.
3. **Fases 1–5** (una pantalla per fase; barra de progrés de fases i marcador de punts sempre visibles).
4. **Informe final.**

El progrés es desa a `localStorage` per usuari (clau pròpia, p. ex. `ra3-malaltia:` + correu). Si es recarrega, es continua on era. Cada pregunta es respon un cop (la primera resposta compta; després es mostra la correcció i la justificació). Botó «Surt» per tancar sessió.

## 5. Casos clínics

Tres casos, un per alumne. *Decisió del constructor:* el cas es deriva d'un hash del correu (mateix cas en qualsevol dispositiu o finestra privada; el docent pot comprovar-lo). El repartiment pot no ser exactament equilibrat. Els tres casos han de tenir dificultat i nombre d'ítems equivalents. Els tres usen només contingut del RA3.

**A · Grip — «La Marta»** (34 anys, mestra). Al taulell: fa dos dies que es troba fatal, té febre, tos, mal de cap i dolor muscular; vol «un antibiòtic per tallar-ho». Etiologia exògena, infecciosa, virus de la grip; triada agent–persona–entorn (escola, espais compartits). Fases: incubació → pròdroms → clínic. Signes: 39 °C mesurats, taquicàrdia, faringe vermella; símptomes: mal de cap, cansament, esgarrifances, dolor muscular. Diagnòstic per anamnesi i exploració (auscultació); proves: test de frotis nasofaringi amb hisop; radiografia de tòrax = prova **neutra** (0 punts, amb explicació: només si se sospita complicació). Classificació: aguda, infecciosa, transmissible/epidèmica, pronòstic lleu. Tractament simptomàtic (paracetamol antipirètic, repòs i hidratació), no antibiòtic (no actua sobre virus). Desenllaç esperat: curació completa.

**B · Faringitis + lesió a la galta — «En Jordi»** (cas del dossier). Fumador, al·lèrgic al pol·len, s'automedica amb paracetamol; mal de coll, disfàgia, tos, i comenta un bony a la galta que no fa mal. Etiologia: faringitis exògena infecciosa probablement vírica; tabac com a factor de risc modificable de la lesió; al·lèrgia com a factor de la persona. Exploració: inspecció de gola amb depressor, auscultació amb fonendoscopi, palpació de la massa. Proves: frotis amb hisop, radiografia de tòrax, biòpsia → anatomia patològica. Resultats: frotis sense bacteri (vírica), radiografia normal, biòpsia amb lesió precancerosa inicial. Classificació: faringitis aguda infecciosa; lesió = neoplàsia (no maligna encara, sense metàstasi). Tractament: simptomàtic per a la faringitis, extirpació (cirurgia) i deixar de fumar per a la lesió; pronòstic bo si es tracta aviat.

**C · Diabetis tipus 2 — «L'Antoni»** (cas del dossier). 52 anys, obesitat, sedentari, pare diabètic. Ve amb el resultat de l'examen de salut de l'empresa: glucosa a l'orina. Diu que es troba bé. Etiologia multifactorial / endògena (metabòlica) amb factors de risc modificables (obesitat, sedentarisme, alimentació) i no modificables (edat, antecedents familiars). Fase: patogènica subclínica (latència) detectada per cribratge (diagnòstic precoç). Signes: glucosúria, pes i perímetre abdominal elevats; símptomes: pocs o cap (potser set i cansament lleus). Proves: analítica de sang (glucosa en dejú), analítica d'orina; no calen imatge ni biòpsia. Classificació: crònica, metabòlica, no transmissible, general/sistèmica. Tractament: dietoteràpia + exercici (mesures higièniques), farmacoteràpia si cal segons el metge; paper de la farmàcia: ús correcte del tractament prescrit. «Es troba bé però és malalt.»

Les dades exactes (diàlegs, valors de proves, opcions, justificacions) les escriu el constructor seguint aquestes línies i `docs/ra3-contingut.md`. Cada pregunta porta una justificació curta que cita l'apartat (3.1–3.6).

## 6. Les 5 fases

Cada fase val **200 punts** (total 1.000). La fase no pot quedar per sota de 0. Nota sobre 10 = total / 100, amb un decimal.

Regles generals de puntuació (decisió del constructor ajustable):
- Encert: suma els punts de l'ítem. Error: resta la meitat dels punts de l'ítem.
- Cada fase té **1–2 ajudes desplegables** («Consulta els apunts»): obrir-ne una resta **15 punts** un sol cop i mostra un recordatori teòric del RA3, mai la resposta directa.
- Una prova diagnòstica innecessària resta punts (fase 4). *Decisió del constructor:* hi ha tres categories de prova: necessària (suma), neutra (0 punts, explicació) i innecessària (resta).

**Fase 1 · El taulell (primera persona).** Escena il·lustrada: el taulell de la farmàcia en primer pla, prestatges al fons i el pacient davant. El pacient parla amb bafarades (text + botó d'escoltar). 4–5 preguntes de diàleg en què l'alumne tria què respon o què fa: recollir informació (quant fa, febre mesurada?, medicació, al·lèrgies), separar el que diu (símptoma) del que es veu (signe), detectar senyals per derivar al metge, no diagnosticar ni dispensar el que no toca (p. ex. antibiòtic sense recepta). Acaba amb la decisió de derivar el pacient a la consulta.

**Fase 2 · La causa (etiologia).** Visual: «laboratori» amb targetes d'agents i factors (virus, bacteri, al·lergen, tabac, obesitat, sedentarisme, edat, antecedents familiars, sol, gas irritant…). L'alumne: (a) tria l'agent o causa principal del seu cas; (b) classifica la causa (exògena / endògena / ambiental / multifactorial); (c) classifica els factors del cas en factor de risc modificable vs no modificable (o agent vs persona vs entorn, triada); (d) 1–2 preguntes de concepte (etiologia vs patogènia, causa vs factor de risc).

**Fase 3 · La consulta mèdica.** Escena de consulta amb una silueta del pacient i punts clicables (cap, gola, pit, abdomen, galta, etc.). En tocar-los apareixen troballes. L'alumne: (a) classifica cada troballa com a **signe** o **símptoma** (arrossegar o tocar per assignar; ha de funcionar amb teclat i tacte); (b) relaciona cada maniobra d'exploració (inspecció, palpació, percussió, auscultació) amb el que es fa; (c) situa el pacient en la fase de la història natural (línia del temps clicable: prepatogènic → incubació/latència → prodròmic → clínic → desenllaç).

**Fase 4 · Diagnòstic i proves.** Panell de proves amb icones (analítica de sang, analítica d'orina, frotis amb hisop, radiografia, ecografia, TC, RM, ECG, biòpsia, endoscòpia). L'alumne demana les proves que cal per confirmar la hipòtesi; les necessàries sumen, les innecessàries resten («no cal fer-les totes»). Cada prova demanada mostra un **resultat visual animat**: termòmetre, barres d'analítica amb rang normal i valor del pacient, radiografia esquemàtica, traç d'ECG, imatge de biòpsia/citologia esquemàtica, etc. Preguntes: tipus de diagnòstic (diferencial/hipòtesi, definitiu, precoç), quines proves fan servir radiació ionitzant, què estudia l'anatomia patològica.

**Fase 5 · Decisió.** Taula comparativa: a l'esquerra els signes i símptomes de la fase 3, a la dreta els resultats de la fase 4. L'alumne: (a) tria el diagnòstic definitiu entre 3–4 opcions (cas B: les opcions combinen les dues condicions, p. ex. «faringitis vírica + lesió precancerosa»; els eixos de classificació es pregunten per a la condició principal indicada a l'enunciat, sense superar el mateix nombre d'ítems que els altres casos); (b) classifica la malaltia en diversos eixos (durada, causa/etiopatogènia, localització, presentació, pronòstic); (c) tria el tipus de tractament (curatiu, simptomàtic, pal·liatiu, específic; local o sistèmic) i les mesures concretes; (d) tria el desenllaç esperat.

## 7. Informe final

- **Resultats visuals**: puntuació total /1.000, nota /10, gràfic de barres o radar per fase, nombre d'errors i d'ajudes.
- **DAFO personal**, generat automàticament a partir del rendiment per competència (cada pregunta s'etiqueta amb una competència: salut i malaltia, etiologia, signes i símptomes, exploració i fases, proves diagnòstiques, classificació, tractament, paper de la farmàcia):
  - Fortaleses: competències amb ≥80% d'encert.
  - Debilitats: competències amb <50%.
  - Oportunitats: què repassar abans de la prova del 23/10, amb l'apartat del PDF (3.1–3.6).
  - Amenaces: patrons d'error concrets (confondre signe i símptoma, demanar proves innecessàries, triar antibiòtic per a un virus, «diagnosticar» al taulell, dependre de les ajudes).
- **Codi de verificació** `RA3-XXXX-XXXX` calculat amb un hash (com `logistica02`: FNV-1a) **només dels camps que surten al text lliurat** (correu, nom, cas, punts per fase, ajudes, errors, total) més una sal fixa. *Decisió del constructor:* s'afegeix una pàgina `ra3-malaltia/verifica.html` on el docent enganxa el text lliurat i comprova si el codi quadra. Serveix per detectar edicions manuals, no és seguretat forta.
- **Lliurament a Classroom**: text de resum preparat (nom, correu, cas, punts per fase, ajudes, errors, total, nota, codi) amb botó «Copia el resultat» i alternativa de selecció manual; instrucció de fer captura de pantalla.
- Botó per tornar a començar? **No**: el primer intent és el que val (criteri del docent als tests anteriors). Es pot revisar l'informe tantes vegades com calgui. La nota té ús formatiu (repàs), com els tests anteriors.

## 8. Estil visual

- Il·lustracions vectorials pròpies (SVG en línia), sense imatges externes ni 3D. Estètica d'oficina de farmàcia: creu verda, prestatges, taulell; consulta mèdica amb llitera i fonendoscopi.
- Paleta clara amb accent verd farmàcia; mode fosc per `prefers-color-scheme`.
- Animacions suaus (aparició de bafarades, resultats de proves) desactivables i respectant `prefers-reduced-motion`.
- Mòbil: una columna, objectius tàctils ≥44 px, sense desplaçament horitzontal.

## 9. Accessibilitat (com `logistica02`)

Opcions de mida de text, tipus de lletra (Atkinson Hyperlegible / Lexend), contrast alt i moviment; botó «Escolta» (síntesi de veu en català) a les bafarades i enunciats; tot operable amb teclat; etiquetes ARIA; correcció comunicada amb text, no només amb color.

## 10. Tecnologia i publicació

- Pàgina estàtica sense servidor ni dependències de compilació: HTML, CSS i JavaScript vanilla, com `logistica02`. Fonts de Google Fonts.
- Contrasenya comparada per empremta SHA-256 (`crypto.subtle`), mai en clar al codi.
- Ubicació al repositori: carpeta `ra3-malaltia/` (el repositori allotjarà més apps de l'assignatura) i un `index.html` arrel amb un enllaç.
- Publicació a GitHub Pages del repositori `rvs78/anatomofisiologia01`. Si Pages no està activat, el docent l'activa (Settings → Pages → branca) i se li indica.
- Mecanisme de versió (`version.json`) per evitar memòria cau antiga, com `logistica02`.
- Proves automàtiques mínimes amb `node --test` sobre la lògica pura (validació d'accés, puntuació, codi de verificació, DAFO, integritat de les dades dels casos) i una comprovació al navegador (Playwright) del recorregut complet.

## 11. Què queda per al constructor

Textos concrets dels diàlegs i preguntes, valors de les proves, il·lustracions, nombre exacte d'ítems per fase (que sumin 200), punts per ítem, disseny de components i estructura de fitxers. Tot ha de complir les seccions anteriors i `docs/ra3-contingut.md`.

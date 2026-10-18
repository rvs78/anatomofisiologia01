/* Preguntes noves del cas C (versió 2). Contingut: docs/ra3-contingut.md */
(function(root, factory){
  const v = factory();
  if (typeof module === "object" && module.exports) module.exports = v;
  else { root.RA3_EXTRA = root.RA3_EXTRA || {}; root.RA3_EXTRA.C = v; }
})(typeof self !== "undefined" ? self : this, function(){
  "use strict";
  return {
    phases: [
      /* ---------- Fase 1 · El taulell */
      [
        {id:"C1n1", comp:"salut", sec:"3.1", type:"single", pts:20,
          say:"Jo sempre he pensat que estar sa vol dir no estar malalt, i prou.",
          prompt:"L'Antoni té una idea molt simple de la salut. Quina és la definició de salut de l'OMS?",
          options:[
            {id:"a", t:"No tenir cap malaltia diagnosticada"},
            {id:"b", t:"Un estat complet de benestar físic, psíquic i social, i no només l'absència de malaltia"},
            {id:"c", t:"Tenir totes les analítiques dins dels valors normals"},
            {id:"d", t:"Trobar-se bé físicament, encara que hi hagi problemes emocionals o socials"}],
          a:"b",
          why:"Per a l'OMS, la salut és un estat complet de benestar físic, psíquic i social i no només l'absència de malaltia; a més, és un concepte dinàmic (3.1)."},
        {id:"C1n2", comp:"salut", sec:"3.1", type:"single", pts:20,
          say:"Jo crec que això del sucre és cosa de l'herència: el meu pare també en tenia.",
          prompt:"Segons el model de Lalonde, quin determinant pesa més en la salut d'una persona?",
          options:[
            {id:"a", t:"La biologia humana (herència, edat)"},
            {id:"b", t:"El sistema sanitari"},
            {id:"c", t:"L'estil de vida (alimentació, activitat física, hàbits)"},
            {id:"d", t:"El medi ambient"}],
          a:"c",
          why:"Segons Lalonde, l'estil de vida pesa un 43%, més que la biologia humana (27%), el medi ambient (19%) i el sistema sanitari (11%): els hàbits de l'Antoni compten molt (3.1)."},
        {id:"C1n3", comp:"salut", sec:"3.1", type:"classify", pts:20,
          prompt:"La salut té tres components. Classifica cada dada de l'Antoni en el component que correspon.",
          bins:[{id:"bio", t:"Biològic (cos)"}, {id:"psi", t:"Psíquic (emocions)"}, {id:"soc", t:"Social (entorn)"}],
          cards:[
            {id:"1", t:"Glucosa a l'orina i pes de 108 kg", a:"bio"},
            {id:"2", t:"Està preocupat i nerviós pel resultat de l'examen", a:"psi"},
            {id:"3", t:"Els companys de l'oficina porten pastes cada matí per esmorzar junts", a:"soc"},
            {id:"4", t:"Té por que li diguin que està malalt", a:"psi"}],
          why:"Biològic és el cos (glucosa, pes); psíquic, les emocions (preocupació, por); social, l'entorn (els companys i els esmorzars de la feina) (3.1)."},
        {id:"C1n4", comp:"terminologia", sec:"3.6", type:"single", pts:20,
          say:"Ah, i una altra cosa: ara orino molt més sovint que abans, fins i tot a la nit.",
          prompt:"A la fitxa d'observacions vols fer servir el terme correcte. Com s'anomena orinar molt més del normal?",
          options:[
            {id:"a", t:"Oligúria"},
            {id:"b", t:"Poliúria"},
            {id:"c", t:"Anúria"},
            {id:"d", t:"Glucosúria"}],
          a:"b",
          why:"Poliúria és orinar molt; oligúria, orinar poc; anúria, no orinar. Glucosúria vol dir glucosa a l'orina, no quantitat d'orina (3.2, 3.6)."},
        {id:"C1n5", comp:"farmacia", sec:"3.5", type:"single", pts:20,
          say:"Mentre no vaig al metge, em puc prendre unes pastilles per al sucre que té el meu cunyat?",
          prompt:"Què li respons a l'Antoni?",
          options:[
            {id:"a", t:"Sí, si al seu cunyat li van bé, a vostè també li aniran bé"},
            {id:"b", t:"Sí, però prengui'n només la meitat de la dosi"},
            {id:"c", t:"Millor que es prengui un antibiòtic per si de cas", trap:"antibiotic"},
            {id:"d", t:"No: no s'ha d'automedicar amb fàrmacs d'una altra persona. Primer l'ha de valorar el metge i després l'ajudarem a fer servir bé el tractament que li prescrigui"}],
          a:"d",
          why:"El tècnic no recomana automedicar-se: deriva al metge i després contribueix a l'ús correcte del tractament prescrit (3.5)."}
      ],
      /* ---------- Fase 2 · La causa */
      [
        {id:"C2n1", comp:"etiologia", sec:"3.2", type:"classify", pts:20,
          prompt:"Al laboratori treballen diverses branques de la patologia. Relaciona cada tasca amb la branca que la fa.",
          bins:[{id:"semio", t:"Semiologia"}, {id:"fisio", t:"Fisiopatologia"}, {id:"anat", t:"Anatomia patològica"}, {id:"pato", t:"Patogènia"}],
          cards:[
            {id:"1", t:"Estudia els signes i símptomes de l'Antoni: la set, la glucosa a l'orina", a:"semio"},
            {id:"2", t:"Estudia com funciona el seu organisme malalt: per què no regula bé el sucre", a:"fisio"},
            {id:"3", t:"Estudia al microscopi els canvis de cèl·lules i teixits (biòpsia)", a:"anat"},
            {id:"4", t:"Estudia el mecanisme pas a pas: entrada, acció, resposta i resultat", a:"pato"}],
          why:"Semiologia: signes i símptomes. Fisiopatologia: com funciona un òrgan malalt. Anatomia patològica: canvis de cèl·lules i teixits. Patogènia: mecanisme de desenvolupament (3.2)."},
        {id:"C2n2", comp:"etiologia", sec:"3.2", type:"classify", pts:30,
          prompt:"Al laboratori hi ha mostres de causes diferents. Classifica cada causa segons el seu origen.",
          bins:[{id:"exo", t:"Exògena"}, {id:"endo", t:"Endògena"}, {id:"amb", t:"Ambiental"}],
          cards:[
            {id:"1", t:"L'alteració metabòlica de l'Antoni", a:"endo"},
            {id:"2", t:"El virus de la grip d'un company de l'oficina", a:"exo"},
            {id:"3", t:"L'aire contaminat de la ciutat", a:"amb"},
            {id:"4", t:"Un dèficit de lactasa", a:"endo"},
            {id:"5", t:"Un al·lergen com el pol·len", a:"exo"},
            {id:"6", t:"Un gest repetitiu a la feina", a:"amb"}],
          why:"Exògena ve de fora (virus, al·lergen); endògena és una alteració interna (metabòlica, dèficit de lactasa); ambiental és una exposició de l'entorn (aire contaminat, gest repetitiu) (3.2)."},
        {id:"C2n3", comp:"etiologia", sec:"3.2", type:"single", pts:15,
          prompt:"L'Antoni diu: «El meu germà menja tant de dolç com jo i no té diabetis. Per tant, menjar dolç no hi té res a veure!» Què és correcte?",
          options:[
            {id:"a", t:"Té raó: si no passa a tothom, no hi té cap relació", trap:"causaRisc"},
            {id:"b", t:"Menjar molt de dolç és un factor de risc: augmenta la probabilitat, però no garanteix la malaltia"},
            {id:"c", t:"Menjar dolç és la causa única de la diabetis", trap:"causaRisc"},
            {id:"d", t:"El seu germà segur que també té diabetis"}],
          a:"b",
          why:"Cal distingir causa de factor de risc: un factor de risc augmenta la probabilitat d'emmalaltir, però no garanteix que aparegui la malaltia (3.2)."},
        {id:"C2n4", comp:"etiologia", sec:"3.2", type:"classify", pts:20,
          prompt:"Aquest hivern, la grip ha passat per l'oficina de l'Antoni. Classifica cada element en la triada agent – persona – entorn.",
          bins:[{id:"agent", t:"Agent"}, {id:"persona", t:"Persona"}, {id:"entorn", t:"Entorn"}],
          cards:[
            {id:"1", t:"El virus de la grip", a:"agent"},
            {id:"2", t:"Les defenses baixes d'un company", a:"persona"},
            {id:"3", t:"Una oficina tancada on tothom comparteix l'espai", a:"entorn"},
            {id:"4", t:"La susceptibilitat de cada treballador", a:"persona"}],
          why:"A la grip, l'agent és el virus; la persona aporta la susceptibilitat i les defenses; l'entorn són els espais compartits (3.2)."},
        {id:"C2n5", comp:"terminologia", sec:"3.6", type:"single", pts:15,
          prompt:"A l'informe del laboratori apareix la paraula «hiperglucèmia». Què vol dir?",
          options:[
            {id:"a", t:"Poca glucosa a la sang"},
            {id:"b", t:"Glucosa a l'orina"},
            {id:"c", t:"Molta glucosa a la sang"},
            {id:"d", t:"Inflamació del fetge"}],
          a:"c",
          why:"Hiper- vol dir excés i -èmia, sang: hiperglucèmia és molta glucosa a la sang. Poca seria hipo-; la inflamació del fetge és hepatitis (-itis) (3.6)."}
      ],
      /* ---------- Fase 3 · La consulta */
      [
        {id:"C3n1", comp:"signes", sec:"3.2", type:"multi", pts:20,
          prompt:"La doctora avisa l'Antoni que vigili les ferides i els cops, i que es fixi si una zona s'inflama. Quins són els signes de la inflamació? Marca'ls tots.",
          options:[
            {id:"a", t:"Rubor (envermelliment)"},
            {id:"b", t:"Cianosi (color blavós)"},
            {id:"c", t:"Calor"},
            {id:"d", t:"Edema (inflor)"},
            {id:"e", t:"Pal·lidesa"},
            {id:"f", t:"Dolor"}],
          a:["a","c","d","f"],
          why:"La inflamació es reconeix per rubor, calor, edema i dolor. La cianosi i la pal·lidesa són altres manifestacions (3.2)."},
        {id:"C3n2", comp:"signes", sec:"3.2", type:"single", pts:15,
          prompt:"L'Antoni té 36,8 °C. La doctora li explica que, si un dia tingués 38,5 °C amb esgarrifances i cansament, ho hauria de consultar. Com es descriu aquesta situació?",
          options:[
            {id:"a", t:"Febrícula: una manifestació localitzada"},
            {id:"b", t:"Hipertèrmia: una manifestació localitzada"},
            {id:"c", t:"Febrícula: una manifestació sistèmica"},
            {id:"d", t:"Febre: una manifestació sistèmica (afecta tot el cos)"}],
          a:"d",
          why:"Febrícula és 37–38 °C, febre 38–40 °C i hipertèrmia més de 41 °C. La síndrome febril afecta tot l'organisme: és una manifestació sistèmica (3.2)."},
        {id:"C3n3", comp:"signes", sec:"3.2", type:"single", pts:15,
          prompt:"L'Antoni ha llegit «síndrome» en una revista i pregunta si és el mateix que «malaltia». Què és correcte?",
          options:[
            {id:"a", t:"Sí: són sinònims"},
            {id:"b", t:"No: una síndrome sempre és més greu que una malaltia"},
            {id:"c", t:"No: una síndrome és un conjunt de signes i símptomes que apareixen junts i pot tenir més d'una causa; una malaltia té una identitat clínica definida"},
            {id:"d", t:"No: una síndrome només té símptomes, mai signes", trap:"signeSimptoma"}],
          a:"c",
          why:"Una síndrome és un conjunt de signes i símptomes que apareixen junts i pot tenir més d'una causa; una malaltia és una identitat clínica definida (3.2)."},
        {id:"C3n4", comp:"fases", sec:"3.4", type:"order", pts:20,
          prompt:"Ordena els períodes de la història natural de la malaltia, aplicats a l'Antoni.",
          steps:[
            {id:"pre", t:"Prepatogènic: sa, però exposat a factors de risc (sobrepès, sedentarisme)"},
            {id:"sub", t:"Subclínic de latència: la glucosa ja és alta, però no nota res"},
            {id:"pro", t:"Prodròmic: manifestacions inespecífiques, com el malestar o el cansament"},
            {id:"cli", t:"Clínic: manifestacions característiques"},
            {id:"des", t:"Desenllaç: en el seu cas, el més probable és la cronicitat"}],
          why:"L'ordre és prepatogènic → subclínic (latència en processos lents) → prodròmic → clínic → desenllaç (3.4)."},
        {id:"C3n5", comp:"signes", sec:"3.2", type:"classify", pts:30,
          prompt:"La doctora repassa termes de manifestacions per aparells. Classifica cada terme en l'aparell que correspon.",
          bins:[{id:"resp", t:"Respiratòria"}, {id:"uri", t:"Urinària"}, {id:"circ", t:"Circulatòria"}],
          cards:[
            {id:"1", t:"Taquipnea (respiració ràpida)", a:"resp"},
            {id:"2", t:"Dispnea (dificultat per respirar)", a:"resp"},
            {id:"3", t:"Poliúria (orinar molt), com l'Antoni", a:"uri"},
            {id:"4", t:"Oligúria (orinar poc)", a:"uri"},
            {id:"5", t:"Hipertensió (145/92), com l'Antoni", a:"circ"},
            {id:"6", t:"Taquicàrdia (cor ràpid)", a:"circ"}],
          why:"Taquipnea i dispnea són respiratòries; poliúria i oligúria, urinàries; hipertensió i taquicàrdia, circulatòries (3.2)."}
      ],
      /* ---------- Fase 4 · Les proves */
      [
        {id:"C4n1", comp:"proves", sec:"3.5", type:"order", pts:20,
          prompt:"Ordena els passos del procés diagnòstic que ha seguit la doctora amb l'Antoni.",
          steps:[
            {id:"esc", t:"Escoltar (anamnesi): la set, els hàbits, el pare diabètic"},
            {id:"exp", t:"Explorar: pes, perímetre abdominal i tensió arterial"},
            {id:"hip", t:"Hipòtesi: sospita de diabetis (diagnòstic diferencial)"},
            {id:"pro", t:"Proves: analítiques de sang i d'orina"},
            {id:"def", t:"Diagnòstic definitiu: diabetis mellitus tipus 2"}],
          why:"El procés és escoltar (anamnesi) → explorar → hipòtesi → proves → diagnòstic definitiu (3.5)."},
        {id:"C4n2", comp:"proves", sec:"3.5", type:"classify", pts:20,
          prompt:"L'Antoni pregunta quines proves fan servir radiació. Classifica-les.",
          bins:[{id:"ion", t:"Radiació ionitzant"}, {id:"noion", t:"Sense radiació ionitzant"}],
          cards:[
            {id:"1", t:"Radiografia (raigs X)", a:"ion"},
            {id:"2", t:"TC (raigs X en talls)", a:"ion"},
            {id:"3", t:"Ecografia (ultrasons)", a:"noion"},
            {id:"4", t:"RM (imants i ones de ràdio)", a:"noion"},
            {id:"5", t:"Electrocardiograma (activitat elèctrica del cor)", a:"noion"}],
          why:"La radiografia i la TC fan servir raigs X, radiació ionitzant; l'ecografia, la RM i l'ECG no (3.5)."},
        {id:"C4n3", comp:"proves", sec:"3.5", type:"classify", pts:20,
          prompt:"Relaciona cada prova amb el que estudia.",
          bins:[{id:"cor", t:"El cor"}, {id:"cervell", t:"El cervell"}, {id:"muscul", t:"El múscul"}, {id:"anat", t:"Cèl·lules o teixit (anatomia patològica)"}],
          cards:[
            {id:"1", t:"ECG", a:"cor"},
            {id:"2", t:"EEG", a:"cervell"},
            {id:"3", t:"EMG", a:"muscul"},
            {id:"4", t:"Citologia", a:"anat"},
            {id:"5", t:"Biòpsia", a:"anat"}],
          why:"L'ECG estudia el cor, l'EEG el cervell i l'EMG el múscul. La citologia (cèl·lules) i la biòpsia (teixit) van a anatomia patològica (3.5)."},
        {id:"C4n4", comp:"proves", sec:"3.5", type:"single", pts:10,
          prompt:"Per què és útil un cribratge com l'examen de salut de l'empresa de l'Antoni?",
          options:[
            {id:"a", t:"Perquè cura la malaltia abans que aparegui"},
            {id:"b", t:"Perquè només es fa a les persones amb molts símptomes", trap:"asimptomatic"},
            {id:"c", t:"Perquè permet un diagnòstic precoç: detecta alguns processos en el període de latència, sense símptomes"},
            {id:"d", t:"Perquè dona el diagnòstic definitiu sense cap altra prova"}],
          a:"c",
          why:"El cribratge permet el diagnòstic precoç i detecta alguns processos en latència; després cal confirmar-ho amb proves (3.4, 3.5)."},
        {id:"C4n5", comp:"proves", sec:"3.5", type:"multi", pts:30,
          prompt:"Per a què serveixen les proves que ha demanat la doctora? Marca-ho tot.",
          options:[
            {id:"a", t:"Confirmar la hipòtesi de diabetis"},
            {id:"b", t:"Fer-les totes, per si de cas", trap:"provesInnecessaries"},
            {id:"c", t:"Precisar l'abast: com d'alta és la glucosa"},
            {id:"d", t:"Substituir l'anamnesi i l'exploració"},
            {id:"e", t:"Descartar altres explicacions"}],
          a:["a","c","e"],
          why:"Les proves es demanen per confirmar, precisar o descartar, després d'escoltar i explorar; no cal fer-les totes (3.5)."}
      ],
      /* ---------- Fase 5 · La decisió */
      [
        {id:"C5n1", comp:"classificacio", sec:"3.3", type:"single", pts:20,
          prompt:"La doctora compara: aquest hivern, la grip ha afectat de cop molta gent de l'oficina de l'Antoni en poques setmanes. Com es classifica aquesta presentació?",
          options:[
            {id:"a", t:"Esporàdica"},
            {id:"b", t:"Endèmica"},
            {id:"c", t:"Epidèmica"},
            {id:"d", t:"Crònica"}],
          a:"c",
          why:"Molts casos de cop en poc temps és una presentació epidèmica; esporàdica són casos aïllats i endèmica, una presència constant en una zona. Crònica parla de durada, no de presentació (3.3)."},
        {id:"C5n2", comp:"tractament", sec:"3.5", type:"multi", pts:20,
          prompt:"Què és cert sobre el pronòstic de l'Antoni? Marca-ho tot.",
          options:[
            {id:"a", t:"És un judici anticipat sobre com evolucionarà la malaltia"},
            {id:"b", t:"El dona el tècnic de farmàcia al taulell", trap:"diagnosticar"},
            {id:"c", t:"El dona el personal mèdic"},
            {id:"d", t:"Pot canviar, per exemple si apareix una complicació (un problema nou durant l'evolució)"},
            {id:"e", t:"Un cop donat, no canvia mai"},
            {id:"f", t:"Es pot expressar en graus: lleu, greu, molt greu, crític o reservat"}],
          a:["a","c","d","f"],
          why:"El pronòstic és un judici anticipat sobre l'evolució, el dona el personal mèdic, té graus (lleu, greu, molt greu, crític, reservat) i pot canviar, per exemple per una complicació (3.4, 3.5)."},
        {id:"C5n3", comp:"tractament", sec:"3.5", type:"classify", pts:20,
          prompt:"L'Antoni pregunta com actuen els medicaments. Classifica cada tractament en local o sistèmic.",
          bins:[{id:"local", t:"Local"}, {id:"sist", t:"Sistèmic"}],
          cards:[
            {id:"1", t:"Comprimits per via oral, si el metge els prescriu", a:"sist"},
            {id:"2", t:"Una pomada per a una irritació de la pell", a:"local"},
            {id:"3", t:"Un col·liri per als ulls", a:"local"},
            {id:"4", t:"Un medicament per via intravenosa", a:"sist"}],
          why:"Local: actua on s'aplica (pomada, col·liri). Sistèmic: arriba a tot l'organisme (via oral, intravenosa) (3.5)."},
        {id:"C5n4", comp:"tractament", sec:"3.5", type:"single", pts:20,
          prompt:"Un dia l'Antoni té mal de cap i pren el paracetamol que li va indicar el metge. Quin tipus de tractament és?",
          options:[
            {id:"a", t:"Curatiu: elimina la causa de la malaltia", trap:"simptomaticCuratiu"},
            {id:"b", t:"Pal·liatiu: redueix el malestar en una malaltia avançada"},
            {id:"c", t:"Simptomàtic: alleuja les manifestacions"},
            {id:"d", t:"Específic: actua sobre l'agent que causa la malaltia"}],
          a:"c",
          why:"El paracetamol alleuja les manifestacions (dolor, febre) però no elimina la causa: és un tractament simptomàtic (3.5)."},
        {id:"C5n5", comp:"terminologia", sec:"3.6", type:"single", pts:20,
          prompt:"La doctora diu que l'Antoni no necessita cap gastroscòpia. Què vol dir «gastroscòpia»?",
          options:[
            {id:"a", t:"Extirpació de l'estómac"},
            {id:"b", t:"Observació de l'interior de l'estómac amb un endoscopi"},
            {id:"c", t:"Inflamació de l'estómac"},
            {id:"d", t:"Dolor d'estómac"}],
          a:"b",
          why:"Gastr/o és l'estómac i -scòpia, observar: és una endoscòpia de l'estómac. Extirpar seria -ectomia, la inflamació -itis i el dolor -àlgia (3.6)."}
      ]
    ],
    tests: [
      {id:"frotis", t:"Frotis amb hisop", kind:"no", pts:10,
        result:{viz:"swab", label:"Frotis", text:"Sense res a destacar. L'Antoni no té cap exsudat ni sospita d'infecció: la mostra no aporta res a la sospita de diabetis."}},
      {id:"citologia", t:"Citologia", kind:"no", pts:10,
        result:{viz:"micro", label:"Citologia", text:"Cèl·lules normals. No hi ha cap lesió per estudiar: no ajuda a confirmar una alteració metabòlica."}},
      {id:"eeg", t:"Electroencefalograma (EEG)", kind:"no", pts:10,
        result:{viz:"ecg", label:"EEG", text:"Activitat elèctrica del cervell normal. No té relació amb la sospita: no calia."}},
      {id:"emg", t:"Electromiograma (EMG)", kind:"no", pts:10,
        result:{viz:"ecg", label:"EMG", text:"Activitat del múscul normal. No aporta res per confirmar la diabetis."}},
      {id:"endoscopia", t:"Endoscòpia (gastroscòpia)", kind:"no", pts:10,
        result:{viz:"scope", label:"Endoscòpia", text:"Mucosa normal. Prova invasiva sense justificació: l'Antoni no té cap símptoma digestiu."}}
    ]
  };
});

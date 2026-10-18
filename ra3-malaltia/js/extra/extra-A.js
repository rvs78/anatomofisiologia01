/* Preguntes noves del cas A (versió 2). Contingut: docs/ra3-contingut.md */
(function(root, factory){
  const v = factory();
  if (typeof module === "object" && module.exports) module.exports = v;
  else { root.RA3_EXTRA = root.RA3_EXTRA || {}; root.RA3_EXTRA.A = v; }
})(typeof self !== "undefined" ? self : this, function(){
  "use strict";
  return {
    phases: [
      /* ---------------- Fase 1 · El taulell */
      [
        {id:"A1n1", comp:"salut", sec:"3.1", type:"multi", pts:20,
          say:"Jo sempre dic que estic sana perquè no em poso mai malalta… fins avui!",
          prompt:"La Marta diu que «estar sana» és no estar mai malalta. Quines afirmacions sobre la salut són correctes?",
          options:[
            {id:"a", t:"La salut és només no tenir cap malaltia"},
            {id:"b", t:"Segons l'OMS, és un estat complet de benestar físic, psíquic i social, i no només l'absència de malaltia"},
            {id:"c", t:"Una persona amb una condició controlada no pot tenir mai salut"},
            {id:"d", t:"És un concepte dinàmic: es pot passar del benestar a una zona intermèdia i a la malaltia, i tornar enrere"}
          ],
          a:["b","d"],
          why:"L'OMS defineix la salut com a benestar físic, psíquic i social, no només com a absència de malaltia, i és un contínuum dinàmic que pot coexistir amb una condició controlada (3.1)."},

        {id:"A1n2", comp:"salut", sec:"3.1", type:"single", pts:20,
          say:"És que no paro: dormo poc, menjo qualsevol cosa a correcuita i gairebé no em moc del sofà quan arribo a casa.",
          prompt:"Segons Lalonde, quin determinant de la salut pesa més, i és precisament el que descriu la Marta?",
          options:[
            {id:"a", t:"La biologia humana"},
            {id:"b", t:"El medi ambient"},
            {id:"c", t:"L'estil de vida"},
            {id:"d", t:"El sistema sanitari"}
          ],
          a:"c",
          why:"Segons Lalonde, l'estil de vida (dormir, menjar, moure's) és el determinant que més pesa (43%), per davant de la biologia humana (27%), el medi ambient (19%) i el sistema sanitari (11%) (3.1)."},

        {id:"A1n3", comp:"salut", sec:"3.1", type:"classify", pts:20,
          say:"A més, estic angoixada: dijous tinc reunió de pares i a l'escola hauran de buscar una substituta.",
          prompt:"La malaltia afecta la Marta en tots els components de la salut. Classifica cada situació.",
          bins:[{id:"bio", t:"Biològic (cos)"}, {id:"psi", t:"Psíquic (emocions)"}, {id:"soc", t:"Social (entorn)"}],
          cards:[
            {id:"1", t:"Té febre i dolor muscular", a:"bio"},
            {id:"2", t:"Està angoixada per la reunió de pares", a:"psi"},
            {id:"3", t:"No pot anar a treballar i l'escola ha de buscar una substituta", a:"soc"},
            {id:"4", t:"Tus i li costa empassar", a:"bio"},
            {id:"5", t:"Ha d'anul·lar el sopar amb les amigues", a:"soc"}
          ],
          why:"La salut té un component biològic (el cos), un de psíquic (les emocions) i un de social (l'entorn): la malaltia de la Marta toca els tres (3.1)."},

        {id:"A1n4", comp:"terminologia", sec:"3.6", type:"single", pts:20,
          say:"I em fan mal totes les articulacions: els genolls, els colzes, els canells…",
          prompt:"Quin terme mèdic descriu el que explica la Marta?",
          options:[
            {id:"a", t:"Artritis"},
            {id:"b", t:"Gastràlgia"},
            {id:"c", t:"Artràlgia"},
            {id:"d", t:"Osteopatia"}
          ],
          a:"c",
          why:"Artràlgia = artr/o (articulació) + -àlgia (dolor). Artritis seria inflamació (-itis) de l'articulació, i gastràlgia, dolor d'estómac (3.6)."},

        {id:"A1n5", comp:"farmacia", sec:"3.5", type:"multi", pts:20,
          say:"Tu que hi entens: què tinc, exactament? I què m'he de fer?",
          prompt:"Què forma part de la teva feina com a tècnic/a al taulell amb la Marta? Marca-ho tot.",
          options:[
            {id:"a", t:"Escoltar el seu relat i observar dades (temperatura, aspecte)"},
            {id:"b", t:"Dir-li quina malaltia té exactament", trap:"diagnosticar"},
            {id:"c", t:"Descriure el quadre sense diagnosticar i derivar-la al metge"},
            {id:"d", t:"Decidir quines proves s'ha de fer", trap:"diagnosticar"},
            {id:"e", t:"Recordar-li que no s'automediqui"},
            {id:"f", t:"Contribuir a l'ús correcte del tractament que li prescrigui el metge"}
          ],
          a:["a","c","e","f"],
          why:"El tècnic escolta i observa per orientar i derivar, descriu el quadre sense diagnosticar i contribueix a l'ús correcte del tractament prescrit; diagnosticar i demanar proves és cosa del metge (3.5)."}
      ],

      /* ---------------- Fase 2 · La causa */
      [
        {id:"A2n1", comp:"etiologia", sec:"3.2", type:"classify", pts:20,
          prompt:"Al laboratori treballen diverses branques de la patologia. Quina estudia cada aspecte de la grip de la Marta?",
          bins:[{id:"semio", t:"Semiologia"}, {id:"fisio", t:"Fisiopatologia"}, {id:"anat", t:"Anatomia patològica"}, {id:"pato", t:"Patogènia"}],
          cards:[
            {id:"1", t:"Recull i estudia la febre, la tos i el mal de cap de la Marta", a:"semio"},
            {id:"2", t:"Explica com funcionen les vies respiratòries quan estan malaltes", a:"fisio"},
            {id:"3", t:"Observa al microscopi els canvis de les cèl·lules i els teixits", a:"anat"},
            {id:"4", t:"Descriu com el virus entra, actua i com respon el cos", a:"pato"}
          ],
          why:"Semiologia: signes i símptomes. Fisiopatologia: com funciona un òrgan malalt. Anatomia patològica: canvis de cèl·lules i teixits. Patogènia: mecanisme (Entrada → Acció → Resposta → Resultat) (3.2)."},

        {id:"A2n2", comp:"etiologia", sec:"3.2", type:"classify", pts:30,
          prompt:"La grip de la Marta té una causa exògena. Classifica aquestes altres causes segons el seu origen.",
          bins:[{id:"exo", t:"Exògena"}, {id:"endo", t:"Endògena"}, {id:"amb", t:"Ambiental"}],
          cards:[
            {id:"1", t:"Un bacteri", a:"exo"},
            {id:"2", t:"Dèficit de lactasa", a:"endo"},
            {id:"3", t:"Exposició prolongada al sol", a:"amb"},
            {id:"4", t:"Un al·lergen com el pol·len", a:"exo"},
            {id:"5", t:"Una alteració hormonal", a:"endo"},
            {id:"6", t:"Respirar aire contaminat cada dia", a:"amb"}
          ],
          why:"Exògena: ve de fora (bacteri, virus, al·lergen). Endògena: alteració interna (dèficit de lactasa, hormonal). Ambiental: exposició de l'entorn (sol, aire contaminat) (3.2)."},

        {id:"A2n3", comp:"etiologia", sec:"3.2", type:"single", pts:20,
          prompt:"A l'aula de la Marta, tots els infants han estat en contacte amb el virus, però només n'han emmalaltit alguns. Com s'explica?",
          options:[
            {id:"a", t:"La grip és una malaltia endògena i només afecta qui la porta a dins"},
            {id:"b", t:"Hi intervenen diverses causes: l'agent, les defenses de cada persona i l'entorn"},
            {id:"c", t:"El virus no és la causa de la grip", trap:"causaRisc"},
            {id:"d", t:"Els que no emmalalteixen tenen una malaltia congènita"}
          ],
          a:"b",
          why:"La grip és multifactorial: cal l'agent (virus), una persona susceptible (defenses) i un entorn que afavoreixi l'exposició (3.2)."},

        {id:"A2n4", comp:"etiologia", sec:"3.2", type:"multi", pts:20,
          prompt:"La Marta pregunta si s'ha engripat per culpa de dormir poc. Quines afirmacions són correctes?",
          options:[
            {id:"a", t:"Un factor de risc augmenta la probabilitat d'emmalaltir"},
            {id:"b", t:"Dormir poc és la causa de la seva grip", trap:"causaRisc"},
            {id:"c", t:"Els hàbits (dormir, alimentació, tabac) són factors de risc modificables"},
            {id:"d", t:"L'edat és un factor de risc no modificable"},
            {id:"e", t:"Un factor de risc garanteix que apareixerà la malaltia", trap:"causaRisc"},
            {id:"f", t:"La predisposició genètica és un factor de risc no modificable"}
          ],
          a:["a","c","d","f"],
          why:"La causa és el virus; dormir poc és un factor de risc modificable, que augmenta la probabilitat però no garanteix la malaltia. Edat i genètica no es poden modificar (3.2)."},

        {id:"A2n5", comp:"terminologia", sec:"3.6", type:"single", pts:10,
          prompt:"Si el virus inflama la faringe de la Marta, es parla de faringitis. Què indica el sufix -itis?",
          options:[
            {id:"a", t:"Dolor"},
            {id:"b", t:"Extirpació"},
            {id:"c", t:"Sang"},
            {id:"d", t:"Inflamació"}
          ],
          a:"d",
          why:"El sufix -itis vol dir inflamació (faringitis, artritis); el dolor és -àlgia, l'extirpació -ectomia i la sang -èmia (3.6)."}
      ],

      /* ---------------- Fase 3 · La consulta */
      [
        {id:"A3n1", comp:"signes", sec:"3.2", type:"classify", pts:30,
          prompt:"La doctora revisa les temperatures que la Marta s'ha pres aquests dies. Classifica cada valor.",
          bins:[{id:"febricula", t:"Febrícula (37–38 °C)"}, {id:"febre", t:"Febre (38–40 °C)"}, {id:"hiper", t:"Hipertèrmia (>41 °C)"}],
          cards:[
            {id:"1", t:"Dissabte al matí: 37,4 °C", a:"febricula"},
            {id:"2", t:"Dissabte al vespre: 37,8 °C", a:"febricula"},
            {id:"3", t:"A la farmàcia: 38,9 °C", a:"febre"},
            {id:"4", t:"Diumenge a la nit: 39,6 °C", a:"febre"},
            {id:"5", t:"Un valor de 41,3 °C", a:"hiper"},
            {id:"6", t:"Un valor de 41,8 °C", a:"hiper"}
          ],
          why:"Febrícula: 37–38 °C; febre: 38–40 °C; hipertèrmia: més de 41 °C. La Marta té febre, no hipertèrmia (3.2)."},

        {id:"A3n2", comp:"signes", sec:"3.2", type:"single", pts:15,
          prompt:"La doctora diu que la Marta té una «síndrome febril» i que la seva malaltia és la grip. Quina diferència hi ha entre síndrome i malaltia?",
          options:[
            {id:"a", t:"Cap: són sinònims"},
            {id:"b", t:"La síndrome és un conjunt de signes i símptomes que apareixen junts i pot tenir més d'una causa; la malaltia té una identitat clínica definida"},
            {id:"c", t:"La síndrome és sempre més greu que la malaltia"},
            {id:"d", t:"La síndrome només té símptomes i la malaltia només té signes", trap:"signeSimptoma"}
          ],
          a:"b",
          why:"Una síndrome agrupa signes i símptomes que van junts i pot tenir diverses causes; la malaltia (la grip) és una identitat clínica definida (3.2)."},

        {id:"A3n3", comp:"fases", sec:"3.4", type:"order", pts:20,
          prompt:"Ordena la història natural de la grip de la Marta, del primer període a l'últim.",
          steps:[
            {id:"pre", t:"Prepatogènic: està sana, però a l'aula hi ha infants amb grip"},
            {id:"inc", t:"Subclínic (incubació): el virus es multiplica i encara no nota res"},
            {id:"pro", t:"Prodròmic: malestar general i mal de cap, poc específics"},
            {id:"cli", t:"Clínic: febre alta, tos i dolor muscular característics"},
            {id:"des", t:"Desenllaç: curació"}
          ],
          why:"Prepatogènic → subclínic (incubació en les infeccions) → prodròmic (manifestacions inespecífiques) → clínic (manifestacions característiques) → desenllaç (3.4)."},

        {id:"A3n4", comp:"signes", sec:"3.2", type:"classify", pts:20,
          prompt:"La doctora anota les manifestacions de la Marta per aparells. Classifica cada terme.",
          bins:[{id:"resp", t:"Respiratòria"}, {id:"circ", t:"Circulatòria"}, {id:"urin", t:"Urinària"}],
          cards:[
            {id:"1", t:"Taquipnea: 26 respiracions per minut", a:"resp"},
            {id:"2", t:"Dispnea: diu que li costa respirar quan puja escales", a:"resp"},
            {id:"3", t:"Taquicàrdia: 110 batecs per minut", a:"circ"},
            {id:"4", t:"Oligúria: orina molt poc perquè sua i beu poc", a:"urin"}
          ],
          why:"Taquipnea i dispnea són manifestacions respiratòries; la taquicàrdia, circulatòria; l'oligúria (poca orina), urinària (3.2)."},

        {id:"A3n5", comp:"signes", sec:"3.2", type:"single", pts:15,
          prompt:"La gola de la Marta està vermella, calenta, inflada i li fa mal; a més té febre i dolor a tot el cos. Quina afirmació és correcta?",
          options:[
            {id:"a", t:"Totes les manifestacions són locals, perquè la infecció és a la gola"},
            {id:"b", t:"La inflamació només té un signe: la vermellor"},
            {id:"c", t:"La gola mostra els signes de la inflamació (rubor, calor, edema, dolor) de forma localitzada; la febre i el dolor muscular són manifestacions sistèmiques"},
            {id:"d", t:"Totes són sistèmiques, perquè la grip és una malaltia de tot el cos"}
          ],
          a:"c",
          why:"La inflamació es reconeix per rubor, calor, edema i dolor; a la gola és una manifestació localitzada, mentre que la febre i el dolor de tot el cos són sistèmiques (3.2)."}
      ],

      /* ---------------- Fase 4 · Les proves */
      [
        {id:"A4n1", comp:"proves", sec:"3.5", type:"order", pts:20,
          prompt:"Ordena els passos que ha seguit la doctora amb la Marta fins al diagnòstic.",
          steps:[
            {id:"esc", t:"Escoltar: anamnesi (símptomes, hàbits, antecedents)"},
            {id:"exp", t:"Explorar: buscar signes (inspecció, palpació, percussió, auscultació)"},
            {id:"hip", t:"Hipòtesi: sospita de grip (diagnòstic diferencial)"},
            {id:"pro", t:"Proves: frotis amb hisop per confirmar l'agent"},
            {id:"def", t:"Diagnòstic definitiu: grip"}
          ],
          why:"El procés diagnòstic és Escoltar (anamnesi) → Explorar → Hipòtesi → Proves → Diagnòstic definitiu (3.5)."},

        {id:"A4n2", comp:"proves", sec:"3.5", type:"classify", pts:25,
          prompt:"La Marta té por de la radiació. Classifica les proves segons si fan servir radiació ionitzant.",
          bins:[{id:"ion", t:"Radiació ionitzant"}, {id:"no", t:"Sense radiació ionitzant"}],
          cards:[
            {id:"1", t:"Radiografia de tòrax", a:"ion"},
            {id:"2", t:"Ecografia", a:"no"},
            {id:"3", t:"TC (tomografia computada)", a:"ion"},
            {id:"4", t:"Ressonància magnètica (RM)", a:"no"},
            {id:"5", t:"Electrocardiograma (ECG)", a:"no"}
          ],
          why:"Radiografia i TC fan servir raigs X (radiació ionitzant); l'ecografia (ultrasons), la RM (imants i ones de ràdio) i l'ECG no (3.5)."},

        {id:"A4n3", comp:"proves", sec:"3.5", type:"classify", pts:20,
          prompt:"Si la grip de la Marta es compliqués, quin registre elèctric triaria la doctora en cada situació?",
          bins:[{id:"ecg", t:"ECG"}, {id:"eeg", t:"EEG"}, {id:"emg", t:"EMG"}],
          cards:[
            {id:"1", t:"Nota el cor accelerat i irregular", a:"ecg"},
            {id:"2", t:"Cal estudiar l'activitat elèctrica del cervell", a:"eeg"},
            {id:"3", t:"Té una debilitat muscular que no marxa", a:"emg"},
            {id:"4", t:"Cal estudiar l'activitat elèctrica del cor", a:"ecg"}
          ],
          why:"L'ECG estudia el cor, l'EEG el cervell i l'EMG el múscul (3.5)."},

        {id:"A4n4", comp:"proves", sec:"3.5", type:"single", pts:20,
          prompt:"La doctora recorda a la Marta que hi ha programes de cribratge per a persones sanes. Què és el diagnòstic precoç?",
          options:[
            {id:"a", t:"Diagnosticar la grip el primer dia de febre"},
            {id:"b", t:"Si no hi ha símptomes no hi ha malaltia, i no cal cap prova", trap:"asimptomatic"},
            {id:"c", t:"El diagnòstic que fa el tècnic de farmàcia al taulell", trap:"diagnosticar"},
            {id:"d", t:"Detectar una malaltia abans que doni símptomes, amb proves de cribratge"}
          ],
          a:"d",
          why:"El diagnòstic precoç, mitjançant el cribratge, detecta malalties en període subclínic, quan encara no fan símptomes (3.5)."},

        {id:"A4n5", comp:"proves", sec:"3.5", type:"multi", pts:15,
          prompt:"Per què la doctora demana proves a la Marta? Marca els motius correctes.",
          options:[
            {id:"a", t:"Per confirmar la hipòtesi de grip"},
            {id:"b", t:"Per fer-les totes, per si de cas", trap:"provesInnecessaries"},
            {id:"c", t:"Per descartar altres explicacions, com una pneumònia"},
            {id:"d", t:"Per substituir l'anamnesi i l'exploració"},
            {id:"e", t:"Per precisar l'abast de la malaltia"}
          ],
          a:["a","c","e"],
          why:"Les proves serveixen per confirmar, precisar o descartar, i no cal fer-les totes; no substitueixen l'anamnesi ni l'exploració (3.5)."}
      ],

      /* ---------------- Fase 5 · La decisió */
      [
        {id:"A5n1", comp:"classificacio", sec:"3.3", type:"single", pts:15,
          prompt:"A l'escola de la Marta hi ha molts casos de grip alhora. Si només hagués emmalaltit ella, sense cap altre cas, com seria la presentació?",
          options:[
            {id:"a", t:"Epidèmica"},
            {id:"b", t:"Esporàdica"},
            {id:"c", t:"Endèmica"},
            {id:"d", t:"Crònica"}
          ],
          a:"b",
          why:"Un cas aïllat és una presentació esporàdica; molts casos alhora, epidèmica; i present sempre en una zona, endèmica. Crònica fa referència a la durada, no a la presentació (3.3)."},

        {id:"A5n2", comp:"tractament", sec:"3.5", type:"multi", pts:20,
          prompt:"La doctora diu que el pronòstic de la Marta és bo. Quines afirmacions sobre el pronòstic són correctes?",
          options:[
            {id:"a", t:"És un judici anticipat sobre l'evolució de la malaltia"},
            {id:"b", t:"El dona el tècnic de farmàcia", trap:"diagnosticar"},
            {id:"c", t:"El dona el personal mèdic"},
            {id:"d", t:"Un cop dit, no pot canviar mai"},
            {id:"e", t:"Pot canviar si apareix una complicació"},
            {id:"f", t:"Els graus són lleu, greu, molt greu, crític i reservat"}
          ],
          a:["a","c","e","f"],
          why:"El pronòstic és un judici anticipat sobre l'evolució que dona el personal mèdic; té graus (lleu, greu, molt greu, crític, reservat) i pot canviar (3.5)."},

        {id:"A5n3", comp:"tractament", sec:"3.5", type:"classify", pts:30, trap:"simptomaticCuratiu",
          prompt:"Classifica cada tractament segons el seu objectiu. Fixa't també si és local o sistèmic.",
          bins:[{id:"simp", t:"Simptomàtic"}, {id:"cur", t:"Curatiu"}, {id:"pal", t:"Pal·liatiu"}],
          cards:[
            {id:"1", t:"Paracetamol oral per baixar la febre de la Marta (sistèmic)", a:"simp"},
            {id:"2", t:"Xarop per calmar la tos de la Marta (sistèmic)", a:"simp"},
            {id:"3", t:"Antibiòtic intravenós per a una infecció bacteriana sensible (sistèmic)", a:"cur"},
            {id:"4", t:"Col·liri antibiòtic per a una infecció bacteriana sensible de l'ull (local)", a:"cur"},
            {id:"5", t:"Mesures per reduir el malestar en una malaltia avançada", a:"pal"},
            {id:"6", t:"Pomada per alleujar la picor d'una erupció (local)", a:"simp"}
          ],
          why:"Simptomàtic: alleuja manifestacions (paracetamol). Curatiu: elimina la causa (antibiòtic en infecció bacteriana sensible). Pal·liatiu: redueix el malestar. Local (pomada, col·liri) o sistèmic (oral, intravenós) (3.5)."},

        {id:"A5n4", comp:"fases", sec:"3.4", type:"single", pts:20,
          prompt:"Imagina que, durant la grip, la Marta comencés a tenir dificultat per respirar i la radiografia mostrés una pneumònia. Què seria la pneumònia?",
          options:[
            {id:"a", t:"Una seqüela"},
            {id:"b", t:"Un pròdrom"},
            {id:"c", t:"Una cronicitat"},
            {id:"d", t:"Una complicació"}
          ],
          a:"d",
          why:"Una complicació és un problema que apareix durant l'evolució de la malaltia. Una seqüela queda després de curar i no és el mateix que la cronicitat (3.4)."},

        {id:"A5n5", comp:"terminologia", sec:"3.6", type:"single", pts:15,
          prompt:"La Marta pregunta què és una gastroscòpia, que li van fer a la seva mare. Què és?",
          options:[
            {id:"a", t:"L'extirpació de l'estómac"},
            {id:"b", t:"La inflamació de l'estómac"},
            {id:"c", t:"L'observació de l'interior de l'estómac amb un endoscopi"},
            {id:"d", t:"El dolor d'estómac"}
          ],
          a:"c",
          why:"Gastr/o (estómac) + -scòpia (observar): és una endoscòpia de l'estómac. L'extirpació seria gastrectomia (-ectomia), la inflamació gastritis i el dolor gastràlgia (3.6)."}
      ]
    ],

    tests: [
      {id:"citologia", t:"Citologia", kind:"no", pts:10,
        result:{viz:"micro", label:"Citologia", text:"Cèl·lules sense alteracions. La citologia estudia cèl·lules per buscar canvis anormals; per confirmar la grip de la Marta n'hi havia prou amb el frotis."}},
      {id:"ecografia", t:"Ecografia", kind:"no", pts:10,
        result:{viz:"echo", label:"Ecografia abdominal", text:"Òrgans abdominals normals. L'ecografia (ultrasons) estudia l'abdomen o l'embaràs i no aporta res a una infecció respiratòria com la grip."}},
      {id:"eeg", t:"Electroencefalograma (EEG)", kind:"no", pts:10,
        result:{viz:"ecg", label:"EEG", text:"Activitat elèctrica cerebral normal. L'EEG estudia el cervell: la Marta no té cap manifestació neurològica que el justifiqui."}},
      {id:"emg", t:"Electromiograma (EMG)", kind:"no", pts:10,
        result:{viz:"ecg", label:"EMG", text:"Activitat muscular normal. El dolor muscular de la Marta forma part de la grip i marxarà sol: l'EMG no calia."}},
      {id:"endoscopia", t:"Endoscòpia", kind:"no", pts:10,
        result:{viz:"scope", label:"Gastroscòpia", text:"Mucosa digestiva normal. És una prova invasiva i la Marta no té cap símptoma digestiu: no aporta res al cas."}}
    ]
  };
});

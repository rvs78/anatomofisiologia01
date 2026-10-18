/* Casos clínics de l'activitat RA3 · La malaltia.
   Tot el contingut surt de docs/ra3-contingut.md (apunts del docent, apartats 3.1–3.6).
   Cada fase suma 200 punts (ho comprova tests/cases.test.js). */
(function(root, factory){
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.RA3_CASES = factory();
})(typeof self !== "undefined" ? self : this, function(){
  "use strict";

  const COMPS = {
    salut:        {t:"Salut i malaltia", sec:"3.1"},
    etiologia:    {t:"Etiologia i factors de risc", sec:"3.2"},
    signes:       {t:"Signes i símptomes", sec:"3.2"},
    classificacio:{t:"Tipologia de malalties", sec:"3.3"},
    fases:        {t:"Història natural de la malaltia", sec:"3.4"},
    exploracio:   {t:"Anamnesi i exploració física", sec:"3.5"},
    proves:       {t:"Diagnòstic i proves complementàries", sec:"3.5"},
    tractament:   {t:"Pronòstic i tractament", sec:"3.5"},
    farmacia:     {t:"Paper del tècnic al taulell", sec:"3.5"}
  };

  const TRAPS = {
    antibiotic: "Triar un antibiòtic per a una infecció vírica o sense recepta: l'antibiòtic només actua sobre bacteris sensibles i el prescriu el metge.",
    diagnosticar: "Diagnosticar o decidir proves des del taulell: el tècnic escolta, observa, descriu el quadre i deriva.",
    signeSimptoma: "Confondre signe (objectiu, es mesura o s'observa) i símptoma (subjectiu, el percep el pacient).",
    provesInnecessaries: "Demanar proves que no calen: es demanen per confirmar, precisar o descartar, no totes.",
    causaRisc: "Confondre la causa d'una malaltia amb un factor de risc, que només n'augmenta la probabilitat.",
    asimptomatic: "Pensar que sense símptomes no hi ha malaltia: hi ha períodes subclínics i el cribratge els detecta.",
    simptomaticCuratiu: "Confondre tractament simptomàtic (alleuja manifestacions) amb curatiu (elimina la causa).",
    exploracio: "Barrejar les maniobres d'exploració física (inspecció, palpació, percussió, auscultació)."
  };

  const PHASES = [
    {key:"taulell",  title:"El taulell",  place:"Oficina de farmàcia", icon:"cross"},
    {key:"causa",    title:"La causa",    place:"Laboratori d'etiologia", icon:"micro"},
    {key:"consulta", title:"La consulta", place:"Consulta mèdica", icon:"steth"},
    {key:"proves",   title:"Les proves",  place:"Diagnòstic", icon:"flask"},
    {key:"decisio",  title:"La decisió",  place:"Diagnòstic i tractament", icon:"check"}
  ];

  /* Ajudes (resten 15 punts): recorden teoria, no donen la resposta */
  const HINTS = [
    [{title:"El paper del tècnic al taulell", text:"A la farmàcia, escoltar el relat i observar dades ajuda a orientar i derivar. Cal descriure el quadre sense diagnosticar i contribuir a l'ús correcte del tractament prescrit (3.5)."},
     {title:"Signe o símptoma?", text:"Signe: manifestació objectiva que el personal sanitari pot observar o mesurar (febre mesurada, pal·lidesa, erupció). Símptoma: manifestació subjectiva que només percep el pacient (dolor, mareig, nàusees). «Em roda el cap» és un símptoma; 39 °C mesurats és un signe (3.2)."}],
    [{title:"Tipus de causes", text:"Exògena: ve de fora del cos (bacteri, virus, al·lergen, gas irritant). Endògena: alteració interna (metabòlica, hormonal, genètica). Ambiental: exposició de l'entorn (sol, aire contaminat). Si les causes són diverses, la malaltia és multifactorial."},
     {title:"Causa i factor de risc", text:"Un factor de risc augmenta la probabilitat d'emmalaltir, però no garanteix que aparegui la malaltia. Modificables: hàbits i exposicions (tabac, sedentarisme, alimentació). No modificables: edat, antecedents, predisposició genètica. Triada: agent – persona – entorn."}],
    [{title:"Exploració física", text:"Inspecció: amb la vista. Palpació: amb el tacte (bonys, masses, dolor). Percussió: copejar suaument amb la mà o instruments. Auscultació: amb l'oïda i el fonendoscopi, per sentir els sorolls dels òrgans (3.5)."},
     {title:"Història natural", text:"Prepatogènic: sa però exposat a factors de risc. Subclínic: malaltia sense símptomes (incubació en infeccions; latència en processos lents). Prodròmic: manifestacions inespecífiques. Clínic: manifestacions característiques. Desenllaç: curació, seqüeles, cronicitat o mort (3.4)."}],
    [{title:"Per què es demana una prova", text:"Escoltar → explorar → hipòtesi (diagnòstic diferencial) → proves → diagnòstic definitiu. Les proves serveixen per confirmar una hipòtesi, precisar l'abast o descartar altres explicacions. No cal fer-les totes (3.5)."},
     {title:"Tècniques diagnòstiques", text:"Analítiques (sang, orina, esput, frotis). Citologia (cèl·lules) i biòpsia (teixit) → anatomia patològica. Radiografia i TC: raigs X, radiació ionitzant. Ecografia (ultrasons) i RM (imants i ones de ràdio): sense radiació ionitzant. ECG: activitat elèctrica del cor."}],
    [{title:"Tipologia de malalties", text:"Durada: aguda o crònica. Localització: local o general/sistèmica. Presentació: esporàdica, epidèmica, endèmica. Causa: infecciosa, immunitària, vascular, neoplàsia, congènita, traumàtica, metabòlica. Pronòstic: lleu, greu, fatal. Una malaltia pot ser de més d'un grup (3.3)."},
     {title:"Tipus de tractament", text:"Curatiu: elimina la malaltia o la causa. Simptomàtic: només alleuja les manifestacions (paracetamol). Pal·liatiu: redueix el malestar en malalties avançades. Específic: actua sobre l'agent. Recursos: higiene, fàrmacs, cirurgia, dietoteràpia… (3.5)."}]
  ];
  const hintsFor = (cid, pi) => HINTS[pi].map((h, i) => ({id: cid + "-h" + (pi + 1) + "abc"[i], title: h.title, text: h.text}));

  /* Constructors curts */
  const o = (id, t, trap) => trap ? {id, t, trap} : {id, t};
  const single = (id, comp, sec, pts, prompt, options, a, why, extra) => Object.assign({id, comp, sec, type:"single", pts, prompt, options, a, why}, extra || {});
  const multi = (id, comp, sec, pts, prompt, options, a, why, extra) => Object.assign({id, comp, sec, type:"multi", pts, prompt, options, a, why}, extra || {});
  const classify = (id, comp, sec, pts, prompt, bins, cards, why, extra) => Object.assign({id, comp, sec, type:"classify", pts, prompt, bins, cards, why}, extra || {});
  const SS = [{id:"signe", t:"Signe"}, {id:"simptoma", t:"Símptoma"}];
  const MANIOBRES = [{id:"inspeccio", t:"Inspecció"}, {id:"palpacio", t:"Palpació"}, {id:"percussio", t:"Percussió"}, {id:"auscultacio", t:"Auscultació"}];
  const HN = [o("pre","Període prepatogènic"), o("inc","Subclínic: incubació"), o("lat","Subclínic: latència"), o("pro","Període prodròmic"), o("cli","Període clínic"), o("des","Desenllaç")];
  const card = (id, t, a, spot) => spot ? {id, t, a, spot} : {id, t, a};

  /* Catàleg de proves (resultat segons el cas) */
  const T = (id, t, kind, pts, viz, label, text, extra) => Object.assign({id, t, kind, pts, result:{viz, label, text}}, extra || {});
  const tests = (id, prompt, list, why) => ({id, comp:"proves", sec:"3.5", type:"tests", prompt, tests:list, why});

  /* ================================================================ CAS A · Grip */
  const A = {
    id:"A", name:"La febre de la Marta", short:"Grip",
    patient:{nom:"Marta", edat:34, ofici:"mestra d'infantil", skin:"#f1c7a5", hair:"#5b3a1e", hairStyle:"long", shirt:"#d9534f", sex:"f"},
    intro:"Dilluns, 10 del matí. Entra la Marta, mestra d'una escola bressol. Té els ulls cansats, les galtes enceses i tus mentre espera torn.",
    phases:[
      {hints:hintsFor("A",0), items:[
        single("A1a","farmacia","3.5",40,"La Marta s'acosta al taulell. Què fas primer?",
          [o("a","Escoltar-la i fer-li preguntes per recollir informació"), o("b","Dir-li que té la grip i donar-li un antigripal","diagnosticar"), o("c","Recomanar-li que es faci una radiografia","diagnosticar"), o("d","Dir-li que torni quan tingui més símptomes")],
          "a","A la farmàcia, escoltar el relat i observar dades ajuda a orientar i derivar. El tècnic descriu el quadre, no diagnostica (3.5).",
          {say:"Bon dia. Fa dos dies que em trobo fatal: tinc febre, tos, mal de cap i em fa mal tot el cos. A l'escola n'hi ha molts així."}),
        multi("A1b","farmacia","3.5",40,"Quines preguntes són útils per orientar el cas? Marca-les totes.",
          [o("a","Des de quan es troba així?"), o("b","S'ha pres la temperatura amb un termòmetre?"), o("c","Pren algun medicament o té al·lèrgies?"), o("d","Quin grup sanguini té?"), o("e","Té assegurança privada?")],
          ["a","b","c"],"L'anamnesi recull l'evolució, les dades mesurades i els antecedents (medicació, al·lèrgies). La resta no orienta el cas (3.5)."),
        single("A1c","farmacia","3.5",40,"La Marta et demana un antibiòtic. Què li respons?",
          [o("a","Sí, l'amoxicil·lina li anirà bé","antibiotic"), o("b","Li explico que l'antibiòtic necessita recepta i no actua sobre els virus; ho ha de valorar el metge"), o("c","Li dic que té una pneumònia i que necessita antibiòtic","diagnosticar"), o("d","Li dono mig blíster per si de cas","antibiotic")],
          "b","L'antibiòtic és un tractament específic per a infeccions bacterianes sensibles i el prescriu el metge. El tècnic no diagnostica (3.5).",
          {say:"Em pots donar un antibiòtic? Així ho tallo de seguida, que dijous tinc reunió de pares."}),
        classify("A1d","signes","3.2",40,"Classifica el que notes al taulell: és un signe o un símptoma?", SS,
          [card("1","Diu que li fa molt mal el cap","simptoma"), card("2","El termòmetre de la farmàcia marca 38,9 °C","signe"), card("3","Diu que està molt cansada","simptoma"), card("4","La veus pàl·lida i suada","signe")],
          "Signe: objectiu, s'observa o es mesura (temperatura, pal·lidesa). Símptoma: subjectiu, només el percep el pacient (mal de cap, cansament) (3.2).",{trap:"signeSimptoma"}),
        single("A1e","farmacia","3.5",40,"Quina és la millor decisió final al taulell?",
          [o("a","Derivar-la al metge i recordar-li repòs i hidratació mentre hi va"), o("b","No cal derivar: és un refredat sense importància","diagnosticar"), o("c","Trucar una ambulància"), o("d","Vendre-li un xarop i dir-li que no cal anar al metge","diagnosticar")],
          "a","Amb febre alta i malestar general, el tècnic orienta i deriva al metge, que és qui diagnostica (3.5).")
      ]},
      {hints:hintsFor("A",1), items:[
        single("A2a","etiologia","3.2",40,"Al laboratori de causes, quin agent explica millor el quadre de la Marta?",
          [o("virus","Virus de la grip"), o("bacteri","Bacteri"), o("pollen","Al·lergen (pol·len)"), o("gas","Gas irritant")],
          "virus","La grip la causa un virus: és l'agent etiològic, l'element causant de la malaltia (3.2).",{icons:true}),
        single("A2b","etiologia","3.2",40,"Com classifiques aquesta causa segons el seu origen?",
          [o("a","Exògena: ve de fora del cos"), o("b","Endògena: alteració interna"), o("c","Ambiental: exposició al sol o a l'aire contaminat"), o("d","Congènita: present en néixer")],
          "a","Un virus prové de fora del cos: és una causa exògena (3.2)."),
        classify("A2c","etiologia","3.2",60,"Triada agent – persona – entorn: on va cada element?",
          [{id:"agent",t:"Agent"},{id:"persona",t:"Persona"},{id:"entorn",t:"Entorn"}],
          [card("1","Virus de la grip","agent"), card("2","Microorganisme que es multiplica a la mucosa respiratòria","agent"), card("3","Defenses baixes de la Marta","persona"), card("4","Està esgotada i dorm poc","persona"), card("5","Aula plena d'infants amb tos","entorn"), card("6","Espais tancats i compartits","entorn")],
          "A la grip: agent = virus; persona = susceptibilitat i defenses; entorn = exposició en espais compartits (3.2)."),
        single("A2d","etiologia","3.2",30,"El virus s'enganxa a la mucosa, es replica i el cos respon amb febre. Quina branca estudia aquest mecanisme?",
          [o("a","La patogènia"), o("b","L'etiologia"), o("c","La semiologia"), o("d","L'anatomia patològica")],
          "a","L'etiologia estudia la causa; la patogènia, el mecanisme pel qual es desenvolupa la malaltia (Entrada → Acció → Resposta → Resultat) (3.2)."),
        single("A2e","etiologia","3.2",30,"La Marta dorm poc i està molt estressada. Això és…",
          [o("a","Un factor que augmenta la probabilitat d'emmalaltir, no la causa"), o("b","La causa de la grip","causaRisc"), o("c","Un signe de la grip","signeSimptoma"), o("d","Un símptoma de la grip","signeSimptoma")],
          "a","Cal distingir la causa (el virus) d'un factor de risc, que augmenta la probabilitat però no garanteix la malaltia (3.2).")
      ]},
      {hints:hintsFor("A",2), items:[
        classify("A3a","signes","3.2",80,"La doctora explora la Marta. Toca cada zona del cos i classifica les troballes.", SS,
          [card("1","39 °C mesurats amb el termòmetre","signe","braç"), card("2","Mal de cap","simptoma","cap"), card("3","Faringe vermella en mirar la gola","signe","gola"), card("4","Mal de coll en empassar","simptoma","gola"), card("5","Pols ràpid: 110 batecs per minut (taquicàrdia)","signe","pit"), card("6","Dolor muscular a tot el cos","simptoma","cos"), card("7","Esgarrifances","simptoma","cos"), card("8","Respiració ràpida (taquipnea)","signe","pit")],
          "Els signes es poden mesurar o observar (temperatura, pols, respiració, color de la gola). Els símptomes els explica la pacient (3.2).",{trap:"signeSimptoma", explore:true}),
        classify("A3b","exploracio","3.5",40,"Relaciona cada acció de la doctora amb la maniobra d'exploració.", MANIOBRES,
          [card("1","Mira la gola amb un depressor lingual","inspeccio"), card("2","Toca el coll per buscar ganglis inflats","palpacio"), card("3","Escolta els pulmons amb el fonendoscopi","auscultacio"), card("4","Copeja suaument el tòrax amb els dits","percussio")],
          "Inspecció amb la vista, palpació amb el tacte, percussió copejant i auscultació amb l'oïda i el fonendoscopi (3.5).",{trap:"exploracio"}),
        single("A3c","fases","3.4",40,"Situa la Marta a la línia del temps de la malaltia. On és avui?", HN, "cli",
          "Té les manifestacions característiques (febre alta, tos, dolor muscular): període clínic. Els pròdroms (malestar inespecífic) van ser el primer dia (3.4).",{timeline:true}),
        single("A3d","signes","3.2",40,"Febre, taquicàrdia, taquipnea, cansament, esgarrifances i mal de cap apareixen junts. Com es diu aquest conjunt?",
          [o("a","Síndrome febril"), o("b","Hipertèrmia"), o("c","Seqüela"), o("d","Malaltia crònica")],
          "a","La síndrome febril agrupa signes (taquicàrdia, taquipnea) i símptomes (cansament, esgarrifances, mal de cap). La hipertèrmia és més de 41 °C (3.2).")
      ]},
      {hints:hintsFor("A",3), items:[
        single("A4a","proves","3.5",30,"Després de l'anamnesi i l'exploració, la doctora sospita una grip però vol confirmar-ho. Quin diagnòstic té ara?",
          [o("a","Una hipòtesi diagnòstica (diagnòstic diferencial)"), o("b","El diagnòstic definitiu"), o("c","Un diagnòstic precoç per cribratge"), o("d","Un pronòstic")],
          "a","Després de l'estudi inicial es sospita, però es demanen proves per confirmar o descartar: és el diagnòstic diferencial o hipòtesi (3.5)."),
        tests("A4b","Demana només les proves que calen per confirmar la sospita de grip.", [
          T("frotis","Frotis nasofaringi amb hisop","need",110,"swab","Test d'antígens de la grip","POSITIU per al virus de la grip. Confirma l'agent."),
          T("radiografia","Radiografia de tòrax","neutral",0,"xray","Radiografia de tòrax","Pulmons nets, sense condensacions. Només cal si se sospita una complicació, com una pneumònia."),
          T("sang","Analítica de sang","no",20,"bars","Hemograma","Lleugeres alteracions inespecífiques. No identifica la causa.",{bars:[{t:"Leucòcits",v:9.8,lo:4,hi:11,u:"mil/µL"}]}),
          T("orina","Analítica d'orina","no",20,"bars","Sediment d'orina","Normal. No aporta res al cas.",{bars:[{t:"Glucosa",v:0,lo:0,hi:15,u:"mg/dL"}]}),
          T("ecg","Electrocardiograma (ECG)","no",20,"ecg","ECG","Ritme ràpid per la febre. No aporta res al diagnòstic."),
          T("tc","TC (tomografia computada)","no",40,"scan","TC","Prova amb radiació ionitzant sense justificació en aquest cas."),
          T("rm","Ressonància magnètica (RM)","no",40,"scan","RM","No hi ha cap teixit tou a estudiar: no calia."),
          T("biopsia","Biòpsia","no",40,"micro","Biòpsia","No hi ha cap lesió per biopsiar: prova invasiva innecessària.")
        ],"Per confirmar l'agent, n'hi ha prou amb el frotis. La radiografia només es justifica si se sospita una complicació. No cal fer-les totes (3.5)."),
        single("A4c","proves","3.5",30,"La tos i la febre, per si soles, confirmen que és grip?",
          [o("a","No: poden tenir altres causes; cal una prova que identifiqui l'agent"), o("b","Sí: sempre que hi ha tos i febre és grip"), o("c","Sí, si la febre passa de 38 °C"), o("d","No, perquè la febre és un símptoma","signeSimptoma")],
          "a","«La tos i la febre, per si soles, no confirmen la causa» (3.5)."),
        single("A4d","proves","3.5",30,"Quines dues proves fan servir radiació ionitzant?",
          [o("a","Radiografia i TC"), o("b","Ecografia i RM"), o("c","ECG i analítica"), o("d","RM i TC")],
          "a","Radiografia i TC fan servir raigs X (radiació ionitzant); ecografia i RM no (3.5).")
      ]},
      {hints:hintsFor("A",4), items:[
        single("A5a","proves","3.5",50,"Compara la clínica amb els resultats. Quin és el diagnòstic definitiu?",
          [o("a","Grip (infecció pel virus de la grip)"), o("b","Pneumònia bacteriana"), o("c","Al·lèrgia al pol·len"), o("d","Refredat sense importància: no cal diagnòstic")],
          "a","Quadre clínic de síndrome febril + frotis positiu per al virus + radiografia normal (si s'ha fet) → grip. El diagnòstic definitiu s'obté després de valorar els resultats (3.5)."),
        multi("A5b","classificacio","3.3",60,"Com classifiques la grip de la Marta? Marca totes les que corresponen.",
          [o("a","Aguda"), o("b","Infecciosa"), o("c","Epidèmica (molts casos alhora a l'escola)"), o("d","Pronòstic lleu"), o("e","Crònica"), o("f","Congènita"), o("g","Neoplàsia")],
          ["a","b","c","d"],"La grip té un inici i un final (aguda), la causa un microorganisme (infecciosa), afecta molta gent alhora (epidèmica) i en aquest cas es preveu curació sense afectació important (lleu) (3.3)."),
        single("A5c","tractament","3.5",40,"Quin tipus de tractament li correspon?",
          [o("a","Simptomàtic: alleujar la febre i el malestar"), o("b","Curatiu amb antibiòtic","antibiotic"), o("c","Pal·liatiu, com en una malaltia avançada"), o("d","Quirúrgic")],
          "a","El tractament simptomàtic només alleuja les manifestacions (paracetamol). Alleujar la febre no demostra que la causa hagi desaparegut (3.5)."),
        multi("A5d","tractament","3.5",30,"Quines mesures concretes recomana la doctora?",
          [o("a","Paracetamol com a antitèrmic"), o("b","Repòs i hidratació"), o("c","Antibiòtic","antibiotic"), o("d","Quimioteràpia")],
          ["a","b"],"Paracetamol (antitèrmic) i mesures higièniques com el repòs i la hidratació. L'antibiòtic no actua sobre virus (3.5)."),
        single("A5e","fases","3.4",20,"Quin desenllaç és el més probable?",
          [o("a","Curació completa"), o("b","Curació amb seqüeles"), o("c","Cronicitat"), o("d","Mort")],
          "a","Una grip lleu en una persona sana es resol amb curació completa: exposició → incubació → pròdroms → clínica → resolució (3.4).")
      ]}
    ]
  };

  /* ================================================================ CAS B · En Jordi */
  const B = {
    id:"B", name:"La gola d'en Jordi", short:"Faringitis i lesió a la galta",
    patient:{nom:"Jordi", edat:45, ofici:"repartidor", skin:"#e8b48c", hair:"#2b2b2b", hairStyle:"short", shirt:"#2f6db5", sex:"m", beard:true, mark:true},
    intro:"Dimarts, 6 de la tarda. Entra en Jordi, repartidor. Fa olor de tabac, parla amb la veu ronca i es toca la gola sovint.",
    phases:[
      {hints:hintsFor("B",0), items:[
        single("B1a","farmacia","3.5",40,"En Jordi t'explica el seu problema. Què fas primer?",
          [o("a","Escoltar-lo i preguntar-li des de quan té el bony i què es pren"), o("b","Dir-li que el bony és un càncer","diagnosticar"), o("c","Dir-li que el bony no és res perquè no fa mal","asimptomatic"), o("d","Vendre-li pastilles per a la gola i prou")],
          "a","El tècnic escolta, pregunta i observa per orientar i derivar, sense diagnosticar (3.5).",
          {say:"Ei, bon dia. Tinc la gola fatal des de fa tres dies, em costa empassar i tinc tos. Ja em prenc paracetamol pel meu compte. Ah, i fa setmanes que tinc un bony aquí a la galta, però no fa mal."}),
        multi("B1b","farmacia","3.5",40,"Quines dades són útils per orientar el cas? Marca-les totes.",
          [o("a","Si fuma i quant"), o("b","Si té al·lèrgies"), o("c","Quant paracetamol pren i cada quan"), o("d","Quin equip de futbol li agrada"), o("e","Si té cotxe propi")],
          ["a","b","c"],"Hàbits (tabac), antecedents (al·lèrgies) i medicació actual orienten el cas i el risc d'automedicació (3.5)."),
        single("B1c","fases","3.4",40,"En Jordi et pregunta: «Com que el bony no fa mal, no deu ser res, oi?» Què li respons?",
          [o("a","Que no faci mal no vol dir que no sigui res: cal que el vegi el metge"), o("b","Si no fa mal, segur que és benigne","asimptomatic"), o("c","És un tumor maligne, segur","diagnosticar"), o("d","Posi-hi una pomada i ja està")],
          "a","Una malaltia pot estar instaurada sense símptomes (període subclínic). El dolor és una alarma, però la seva absència no descarta res (3.4).",
          {say:"Com que el bony no fa mal, no deu ser res, oi?"}),
        classify("B1d","signes","3.2",40,"Classifica el que notes al taulell: és un signe o un símptoma?", SS,
          [card("1","Diu que li costa empassar (disfàgia)","simptoma"), card("2","Diu que se li acaba l'aire pujant escales (dispnea)","simptoma"), card("3","Veus un bony a la galta esquerra","signe"), card("4","El termòmetre marca 37,6 °C (febrícula)","signe")],
          "El bony visible i la temperatura mesurada són signes. La disfàgia i la dispnea les percep el pacient: són símptomes (3.2).",{trap:"signeSimptoma"}),
        single("B1e","farmacia","3.5",40,"Quina és la millor decisió final al taulell?",
          [o("a","Derivar-lo al metge perquè valori la gola i el bony, i recomanar-li no automedicar-se"), o("b","Recomanar-li un esprai per a la gola i esperar que el bony marxi sol"), o("c","Enviar-lo directament a fer-se una biòpsia","diagnosticar"), o("d","Dir-li que torni d'aquí a un mes si el bony creix")],
          "a","Un bony persistent en un fumador i un mal de coll amb automedicació s'han de derivar al metge. Les proves les decideix el metge (3.5).")
      ]},
      {hints:hintsFor("B",1), items:[
        single("B2a","etiologia","3.2",40,"Al laboratori de causes, quin agent és el més probable del mal de coll d'en Jordi (sense plaques de pus a la gola)?",
          [o("virus","Virus"), o("bacteri","Bacteri"), o("pollen","Al·lergen (pol·len)"), o("gas","Gas irritant")],
          "virus","Faringitis infecciosa probablement vírica, perquè no hi ha plaques de pus. Ho confirmarà el frotis (3.2).",{icons:true}),
        single("B2b","etiologia","3.2",40,"Com classifiques el tabac respecte a la lesió de la galta?",
          [o("a","Factor de risc modificable"), o("b","Factor de risc no modificable"), o("c","Agent etiològic de la faringitis","causaRisc"), o("d","Un signe de la malaltia","signeSimptoma")],
          "a","El tabac és un hàbit: factor de risc modificable. Augmenta la probabilitat de la lesió, però no és l'agent de la faringitis (3.2, 3.4)."),
        classify("B2c","etiologia","3.2",60,"Classifica els factors del cas d'en Jordi.",
          [{id:"mod",t:"Factor de risc modificable"},{id:"nomod",t:"Factor de la persona no modificable"},{id:"agent",t:"Agent causal"}],
          [card("1","Fumar un paquet al dia","mod"), card("2","Automedicar-se sense control","mod"), card("3","Al·lèrgia al pol·len","nomod"), card("4","Edat: 45 anys","nomod"), card("5","Virus a la mucosa de la faringe","agent"), card("6","Predisposició genètica","nomod")],
          "Modificables: hàbits i exposicions (tabac, automedicació). No modificables: edat, al·lèrgia, genètica. L'agent és el microorganisme causant (3.2, 3.4).",{trap:"causaRisc"}),
        single("B2d","etiologia","3.2",30,"Quina branca de la patologia estudia les causes que originen la malaltia?",
          [o("a","L'etiologia"), o("b","La patogènia"), o("c","La fisiopatologia"), o("d","La semiologia")],
          "a","L'etiologia estudia les causes: respon a «quina és la causa?» (3.2)."),
        single("B2e","etiologia","3.2",30,"Un virus prové de fora del cos. Quin tipus de causa és?",
          [o("a","Exògena"), o("b","Endògena"), o("c","Ambiental"), o("d","Multifactorial")],
          "a","Exògena: prové de fora del cos, com un bacteri, un virus o un al·lergen (3.2).")
      ]},
      {hints:hintsFor("B",2), items:[
        classify("B3a","signes","3.2",80,"La doctora explora en Jordi. Toca cada zona del cos i classifica les troballes.", SS,
          [card("1","Febrícula: 37,6 °C mesurats","signe","braç"), card("2","Gola vermella sense plaques de pus","signe","gola"), card("3","Massa dura a la galta en palpar-la","signe","galta"), card("4","Mal de coll","simptoma","gola"), card("5","Dificultat per empassar (disfàgia)","simptoma","gola"), card("6","Sensació de falta d'aire (dispnea)","simptoma","pit"), card("7","Ganglis del coll inflats al tacte","signe","coll"), card("8","Cansament","simptoma","cos")],
          "La doctora mesura i observa signes (temperatura, gola, massa, ganglis). En Jordi explica els símptomes (dolor, disfàgia, dispnea, cansament) (3.2).",{trap:"signeSimptoma", explore:true}),
        classify("B3b","exploracio","3.5",40,"Relaciona cada acció de la doctora amb la maniobra d'exploració.", MANIOBRES,
          [card("1","Mira la gola amb un depressor lingual","inspeccio"), card("2","Toca el bony de la galta per veure si és dur i si es mou","palpacio"), card("3","Escolta els pulmons amb el fonendoscopi","auscultacio"), card("4","Copeja el tòrax amb els dits i escolta com sona","percussio")],
          "Inspecció amb la vista, palpació amb el tacte, percussió copejant i auscultació amb el fonendoscopi (3.5).",{trap:"exploracio"}),
        single("B3c","fases","3.4",40,"La lesió de la galta no fa mal i ha crescut lentament durant setmanes. En quin període estava abans que en Jordi la notés?", HN, "lat",
          "Era una malaltia instaurada sense símptomes en un procés de curs lent: període subclínic de latència. La incubació és pròpia de les infeccions (3.4).",{timeline:true}),
        single("B3d","exploracio","3.5",40,"La doctora li pregunta pels hàbits, els antecedents personals i els familiars. Com es diu aquesta part?",
          [o("a","Anamnesi"), o("b","Exploració física"), o("c","Prova complementària"), o("d","Pronòstic")],
          "a","L'anamnesi és l'entrevista sobre hàbits de vida i antecedents personals i familiars per arribar al diagnòstic (3.5).")
      ]},
      {hints:hintsFor("B",3), items:[
        single("B4a","proves","3.5",30,"La doctora pensa en una faringitis vírica i en una possible lesió a la galta, però encara no té resultats. Quin diagnòstic té?",
          [o("a","Una hipòtesi diagnòstica (diagnòstic diferencial)"), o("b","El diagnòstic definitiu"), o("c","Un diagnòstic precoç per cribratge"), o("d","Un tractament")],
          "a","Sospita després de l'estudi inicial i demana proves per confirmar o descartar: hipòtesi o diagnòstic diferencial (3.5)."),
        tests("B4b","Demana les proves que calen per a la gola, els pulmons d'un fumador amb dispnea i el bony de la galta.", [
          T("frotis","Frotis faringi amb hisop","need",30,"swab","Frotis faringi","No creix cap bacteri. Compatible amb una faringitis vírica."),
          T("radiografia","Radiografia de tòrax","need",30,"xray","Radiografia de tòrax","Tòrax normal, sense masses ni condensacions."),
          T("biopsia","Biòpsia del bony de la galta","need",50,"micro","Anatomia patològica","Cèl·lules alterades: lesió precancerosa inicial, sense invasió dels teixits."),
          T("ecografia","Ecografia de la galta","neutral",0,"echo","Ecografia","Massa sòlida petita. Orienta, però no diu quin tipus de cèl·lules hi ha: ho dirà la biòpsia."),
          T("orina","Analítica d'orina","no",20,"bars","Sediment d'orina","Normal. No té relació amb el cas.",{bars:[{t:"Glucosa",v:0,lo:0,hi:15,u:"mg/dL"}]}),
          T("ecg","Electrocardiograma (ECG)","no",20,"ecg","ECG","Normal. No aporta res al diagnòstic."),
          T("rm","Ressonància magnètica (RM)","no",40,"scan","RM","No calia per confirmar: la biòpsia és la prova que confirma la lesió."),
          T("endoscopia","Gastroscòpia","no",40,"scope","Gastroscòpia","L'estómac no té relació amb el cas: prova innecessària.")
        ],"Frotis per a la gola, radiografia per al tòrax d'un fumador amb dispnea i biòpsia per saber què és el bony. No cal fer-les totes (3.5)."),
        single("B4c","proves","3.5",30,"Què estudia l'anatomia patològica amb la mostra de la biòpsia?",
          [o("a","Els canvis visibles o microscòpics de les cèl·lules i els teixits"), o("b","L'activitat elèctrica del cor"), o("c","Com funciona un òrgan quan està malalt"), o("d","Les causes de la malaltia")],
          "a","L'anatomia patològica estudia canvis visibles o microscòpics de cèl·lules i teixits; la fisiopatologia, com funciona l'òrgan malalt (3.2, 3.5)."),
        single("B4d","proves","3.5",30,"Quina diferència hi ha entre una citologia i una biòpsia?",
          [o("a","La citologia estudia cèl·lules; la biòpsia, un fragment de teixit"), o("b","Són el mateix"), o("c","La biòpsia fa servir raigs X"), o("d","La citologia estudia l'activitat elèctrica")],
          "a","Citologia: estudi de cèl·lules. Biòpsia: estudi d'un teixit. Totes dues van a anatomia patològica (3.5).")
      ]},
      {hints:hintsFor("B",4), items:[
        single("B5a","proves","3.5",50,"Compara la clínica amb els resultats. Quin és el diagnòstic definitiu?",
          [o("a","Faringitis vírica i lesió precancerosa inicial a la galta"), o("b","Faringitis bacteriana i tumor maligne amb metàstasi"), o("c","Al·lèrgia al pol·len i res més"), o("d","Pneumònia")],
          "a","Frotis sense bacteri → faringitis vírica. Biòpsia → lesió precancerosa inicial sense invasió. Radiografia normal → no hi ha pneumònia (3.5)."),
        multi("B5b","classificacio","3.3",60,"Classifica la lesió de la galta, que és el que més preocupa. Marca totes les que corresponen.",
          [o("a","Neoplàsia (creixement cel·lular anòmal)"), o("b","Local (afecta una zona)"), o("c","Encara no ha fet metàstasis"), o("d","Té el tabac com a factor de risc modificable"), o("e","Infecciosa"), o("f","Congènita"), o("g","Epidèmica")],
          ["a","b","c","d"],"És una neoplàsia localitzada, sense metàstasis, amb el tabac com a factor de risc. Un tumor maligne pot envair teixits i fer metàstasis (3.3)."),
        single("B5c","tractament","3.5",40,"Quin tractament és el més adequat per a la lesió de la galta?",
          [o("a","Extirpar-la amb cirurgia i deixar de fumar"), o("b","Només paracetamol","simptomaticCuratiu"), o("c","Antibiòtic","antibiotic"), o("d","Tractament pal·liatiu")],
          "a","Tractament curatiu: eliminar la lesió (cirurgia) i el factor de risc (tabac). El paracetamol només és simptomàtic (3.5)."),
        multi("B5d","tractament","3.5",30,"I per a la faringitis vírica, què recomana la doctora?",
          [o("a","Paracetamol per al dolor de coll"), o("b","Hidratació i repòs de la veu"), o("c","Antibiòtic","antibiotic"), o("d","Quimioteràpia")],
          ["a","b"],"Una faringitis vírica es tracta de manera simptomàtica. L'antibiòtic no actua sobre virus (3.5)."),
        single("B5e","tractament","3.5",20,"La doctora diu que el pronòstic és «bo si es tracta aviat». Què vol dir?",
          [o("a","Que es preveu una bona evolució si s'actua de seguida"), o("b","Que ja està curat"), o("c","Que no hi ha prou dades per preveure res"), o("d","Que el risc és immediat")],
          "a","El pronòstic és un judici anticipat sobre l'evolució i pot canviar. «Reservat» vol dir que no hi ha prou dades; «crític», risc immediat (3.5).")
      ]}
    ]
  };

  /* ================================================================ CAS C · L'Antoni */
  const C = {
    id:"C", name:"El sucre de l'Antoni", short:"Diabetis tipus 2",
    patient:{nom:"Antoni", edat:52, ofici:"administratiu", skin:"#f3d1b5", hair:"#9a9a9a", hairStyle:"bald", shirt:"#4f8a5b", sex:"m", wide:true},
    intro:"Dijous, 9 del matí. Entra l'Antoni, administratiu, amb un sobre a la mà. Somriu: diu que es troba perfectament.",
    phases:[
      {hints:hintsFor("C",0), items:[
        single("C1a","farmacia","3.5",40,"L'Antoni et mostra el resultat de l'examen de salut de l'empresa. Què fas primer?",
          [o("a","Escoltar-lo, llegir l'informe amb ell i explicar-li que ho ha de valorar el metge"), o("b","Dir-li que té diabetis","diagnosticar"), o("c","Dir-li que, si es troba bé, no és res","asimptomatic"), o("d","Vendre-li un suplement per baixar el sucre")],
          "a","El tècnic escolta, observa i orienta. No interpreta un resultat com a diagnòstic: deriva al metge (3.5).",
          {say:"Bon dia. A l'examen de salut de l'empresa m'han trobat glucosa a l'orina. Però jo em trobo perfectament! Què vol dir això?"}),
        multi("C1b","farmacia","3.5",40,"Quines preguntes són útils per orientar el cas? Marca-les totes.",
          [o("a","Té familiars amb diabetis?"), o("b","Com és la seva alimentació i quanta activitat física fa?"), o("c","Ha notat més set o més cansament?"), o("d","Quina marca de cotxe té?"), o("e","Li agrada el cinema?")],
          ["a","b","c"],"Antecedents familiars, estil de vida i manifestacions recents orienten el cas (3.1, 3.5)."),
        single("C1c","salut","3.1",40,"L'Antoni et pregunta: «Si em trobo bé, vol dir que estic sa, no?» Què li respons?",
          [o("a","No necessàriament: es pot estar malalt sense notar símptomes"), o("b","Sí: sense símptomes no hi ha malaltia","asimptomatic"), o("c","Sí: la salut només és com ens sentim"), o("d","Depèn del dia")],
          "a","La salut és dinàmica i hi ha períodes subclínics sense símptomes. «Es troba bé però és malalt» (3.1, 3.4).",
          {say:"Si em trobo bé, vol dir que estic sa, no?"}),
        classify("C1d","signes","3.2",40,"Classifica el que notes al taulell: és un signe o un símptoma?", SS,
          [card("1","La glucosa a l'orina de l'informe","signe"), card("2","Diu que beu més aigua que abans","simptoma"), card("3","La bàscula de la farmàcia marca 108 kg","signe"), card("4","Diu que a la tarda es nota cansat","simptoma")],
          "Un resultat de laboratori i un pes mesurat són signes. La set i el cansament els explica ell: són símptomes (3.2).",{trap:"signeSimptoma"}),
        single("C1e","farmacia","3.5",40,"Quina és la millor decisió final al taulell?",
          [o("a","Derivar-lo al metge de capçalera amb l'informe"), o("b","Recomanar-li una dieta i que no vagi al metge","diagnosticar"), o("c","Fer-li una prova de glucosa a la farmàcia i dir-li què té","diagnosticar"), o("d","Dir-li que repeteixi l'examen d'aquí a un any")],
          "a","El tècnic deriva al metge, que farà l'anamnesi, l'exploració i les proves per arribar al diagnòstic (3.5).")
      ]},
      {hints:hintsFor("C",1), items:[
        single("C2a","etiologia","3.2",40,"Al laboratori de causes, què explica millor el cas de l'Antoni?",
          [o("multi","Diverses causes juntes: metabolisme, hàbits i herència"), o("virus","Un virus"), o("bacteri","Un bacteri"), o("gas","Un gas irritant")],
          "multi","No hi ha un microorganisme: hi ha una alteració metabòlica amb diversos factors (hàbits, herència, edat). És multifactorial (3.2).",{icons:true}),
        single("C2b","etiologia","3.2",40,"La diabetis neix d'una alteració interna del metabolisme. Aquesta alteració és d'origen…",
          [o("a","Endogen"), o("b","Exogen"), o("c","Ambiental"), o("d","Traumàtic")],
          "a","Endogen: prové d'una alteració interna, com una alteració hormonal o metabòlica (3.2)."),
        classify("C2c","etiologia","3.2",60,"Classifica els factors de risc de l'Antoni.",
          [{id:"mod",t:"Modificable"},{id:"nomod",t:"No modificable"}],
          [card("1","Obesitat","mod"), card("2","Sedentarisme","mod"), card("3","Alimentació rica en sucres","mod"), card("4","Edat: 52 anys","nomod"), card("5","Pare diabètic (antecedents familiars)","nomod"), card("6","Predisposició genètica","nomod")],
          "Modificables: hàbits i estil de vida. No modificables: edat, antecedents i genètica (3.2, 3.4).",{trap:"causaRisc"}),
        single("C2d","etiologia","3.2",30,"Si una malaltia té diverses causes, diem que és…",
          [o("a","Multifactorial"), o("b","Congènita"), o("c","Epidèmica"), o("d","Aguda")],
          "a","«Si les causes són diverses, parlem de malaltia multifactorial» (3.2)."),
        single("C2e","etiologia","3.2",30,"L'obesitat garanteix que l'Antoni tingui diabetis?",
          [o("a","No: un factor de risc augmenta la probabilitat, no la garanteix"), o("b","Sí: l'obesitat és la causa única de la diabetis","causaRisc"), o("c","Sí, si té més de 50 anys"), o("d","Només si a més fuma")],
          "a","«Un factor de risc augmenta probabilitats; no garanteix que aparegui la malaltia» (3.2, 3.4).")
      ]},
      {hints:hintsFor("C",2), items:[
        classify("C3a","signes","3.2",80,"La doctora explora l'Antoni. Toca cada zona del cos i classifica les troballes.", SS,
          [card("1","Glucosa a l'orina (glucosúria)","signe","abdomen"), card("2","Perímetre abdominal de 118 cm","signe","abdomen"), card("3","Tensió arterial 145/92 (hipertensió)","signe","braç"), card("4","Pes de 108 kg (obesitat)","signe","cos"), card("5","Set més freqüent","simptoma","gola"), card("6","Cansament a la tarda","simptoma","cos"), card("7","Pols de 78 batecs per minut (normal)","signe","braç"), card("8","Diu que s'aixeca a orinar a la nit","simptoma","abdomen")],
          "Glucosúria, perímetre, tensió, pes i pols es mesuren: signes. La set, el cansament i aixecar-se a orinar els explica ell: són símptomes lleus (3.2).",{trap:"signeSimptoma", explore:true}),
        classify("C3b","exploracio","3.5",40,"Relaciona cada acció de la doctora amb la maniobra d'exploració.", MANIOBRES,
          [card("1","Observa la pell i la forma de l'abdomen","inspeccio"), card("2","Prem l'abdomen amb les mans per veure si fa mal","palpacio"), card("3","Escolta el cor amb el fonendoscopi","auscultacio"), card("4","Copeja l'abdomen per sentir el so dels òrgans","percussio")],
          "Inspecció amb la vista, palpació amb el tacte, percussió copejant i auscultació amb el fonendoscopi (3.5).",{trap:"exploracio"}),
        single("C3c","fases","3.4",40,"Abans de l'examen de l'empresa, quan l'Antoni no notava res, en quin període de la malaltia estava?", HN.map(x => x.id === "pre" ? o("pre","Període prepatogènic","asimptomatic") : x), "lat",
          "Malaltia instaurada però sense símptomes, en un procés lent: període subclínic de latència. El cribratge en detecta alguns casos (3.4).",{timeline:true}),
        single("C3d","proves","3.5",40,"L'examen de salut de l'empresa que l'ha detectat és un exemple de…",
          [o("a","Diagnòstic precoç (cribratge)"), o("b","Diagnòstic definitiu"), o("c","Tractament"), o("d","Pronòstic")],
          "a","El diagnòstic precoç preveu malalties amb proves de cribratge poblacional (3.5).")
      ]},
      {hints:hintsFor("C",3), items:[
        single("C4a","proves","3.5",30,"La doctora sospita una diabetis però encara no té les analítiques. Quin diagnòstic té ara?",
          [o("a","Una hipòtesi diagnòstica (diagnòstic diferencial)"), o("b","El diagnòstic definitiu"), o("c","Un pronòstic reservat"), o("d","Un tractament")],
          "a","Sospita amb l'anamnesi i l'exploració i demana proves per confirmar: hipòtesi diagnòstica (3.5)."),
        tests("C4b","Demana només les proves que calen per confirmar la sospita.", [
          T("sang","Analítica de sang (glucosa en dejú)","need",70,"bars","Bioquímica en dejú","Glucosa alta en dejú: confirma l'alteració metabòlica.",{bars:[{t:"Glucosa en dejú",v:162,lo:70,hi:100,u:"mg/dL"}]}),
          T("orina","Analítica d'orina","need",40,"bars","Analítica d'orina","Glucosa a l'orina: positiva.",{bars:[{t:"Glucosa a l'orina",v:300,lo:0,hi:15,u:"mg/dL"}]}),
          T("ecg","Electrocardiograma (ECG)","neutral",0,"ecg","ECG","Normal. Pot ser útil per al control de la tensió, però no confirma la diabetis."),
          T("radiografia","Radiografia de tòrax","no",20,"xray","Radiografia de tòrax","Normal. No té relació amb la sospita."),
          T("ecografia","Ecografia abdominal","no",20,"echo","Ecografia","No aporta res per confirmar la diabetis."),
          T("tc","TC (tomografia computada)","no",40,"scan","TC","Radiació ionitzant sense cap justificació."),
          T("rm","Ressonància magnètica (RM)","no",40,"scan","RM","No calia."),
          T("biopsia","Biòpsia","no",40,"micro","Biòpsia","No hi ha cap lesió per estudiar: prova invasiva innecessària.")
        ],"Les analítiques de sang i d'orina confirmen l'alteració metabòlica. No calen proves d'imatge ni biòpsia (3.5)."),
        single("C4c","proves","3.5",30,"Per què la doctora no demana una RM ni una biòpsia?",
          [o("a","Perquè les proves es demanen per confirmar, precisar o descartar: no cal fer-les totes"), o("b","Perquè són massa cares"), o("c","Perquè l'Antoni no té símptomes"), o("d","Perquè només es fan als hospitals")],
          "a","«No cal fer-les totes»: cada prova ha de respondre una pregunta del diagnòstic (3.5)."),
        single("C4d","proves","3.5",30,"Quines dues proves NO fan servir radiació ionitzant?",
          [o("a","Ecografia i RM"), o("b","Radiografia i TC"), o("c","TC i RM"), o("d","Radiografia i ecografia")],
          "a","Ecografia (ultrasons) i RM (imants i ones de ràdio) no fan servir radiació ionitzant; radiografia i TC, sí (3.5).")
      ]},
      {hints:hintsFor("C",4), items:[
        single("C5a","proves","3.5",50,"Compara la clínica amb els resultats. Quin és el diagnòstic definitiu?",
          [o("a","Diabetis mellitus tipus 2"), o("b","Grip"), o("c","Infecció d'orina"), o("d","Està sa: només havia menjat dolç abans de l'examen")],
          "a","Glucosa alta en dejú i a l'orina, amb factors de risc i pocs símptomes → diabetis. El diagnòstic definitiu s'obté després de valorar els resultats (3.5)."),
        multi("C5b","classificacio","3.3",60,"Com classifiques la malaltia de l'Antoni? Marca totes les que corresponen.",
          [o("a","Crònica"), o("b","Metabòlica"), o("c","General o sistèmica (afecta tot el cos)"), o("d","Aguda"), o("e","Infecciosa"), o("f","Congènita"), o("g","Traumàtica")],
          ["a","b","c"],"La diabetis persisteix (crònica), és una alteració del metabolisme (metabòlica) i afecta tot el cos (general) (3.3)."),
        single("C5c","tractament","3.5",40,"Quin recurs terapèutic és la base del tractament inicial?",
          [o("a","Dietoteràpia i exercici físic"), o("b","Antibiòtic","antibiotic"), o("c","Cirurgia"), o("d","Quimioteràpia")],
          "a","Dietoteràpia: preparats i pautes nutricionals sota prescripció, amb mesures higièniques com l'exercici (3.5)."),
        multi("C5d","farmacia","3.5",30,"Quin paper té la farmàcia a partir d'ara? Marca-ho tot.",
          [o("a","Contribuir a l'ús correcte del tractament prescrit"), o("b","Reforçar els hàbits saludables que ha indicat el metge"), o("c","Canviar-li la dosi si li sembla","diagnosticar"), o("d","Dir-li que deixi el tractament quan es trobi bé","diagnosticar")],
          ["a","b"],"L'equip de farmàcia contribueix a l'ús correcte del tractament prescrit; no modifica pautes (3.5)."),
        single("C5e","fases","3.4",20,"Quin desenllaç és el més probable?",
          [o("a","Cronicitat: la malaltia persisteix, però es pot controlar"), o("b","Curació completa en una setmana"), o("c","Curació amb seqüeles"), o("d","Mort a curt termini")],
          "a","La diabetis persisteix molt temps: cronicitat. Una seqüela és una alteració estable després de curar, no és el mateix (3.4).")
      ]}
    ]
  };

  return {CASES:{A, B, C}, COMPS, TRAPS, PHASES, HINTS};
});

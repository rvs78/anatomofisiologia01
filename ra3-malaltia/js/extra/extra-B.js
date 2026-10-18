/* Preguntes noves del cas B (versió 2). Contingut: docs/ra3-contingut.md */
(function(root, factory){
  const v = factory();
  if (typeof module === "object" && module.exports) module.exports = v;
  else { root.RA3_EXTRA = root.RA3_EXTRA || {}; root.RA3_EXTRA.B = v; }
})(typeof self !== "undefined" ? self : this, function(){
  "use strict";
  return {
    phases: [
      /* ---------------------------------------------------------------- Fase 1 · Taulell */
      [
        {id:"B1n1", comp:"salut", sec:"3.1", type:"single", pts:20,
          say:"Mira, jo sempre he estat sa: no he anat mai al metge. Només és la gola i aquest bony que no fa mal.",
          prompt:"En Jordi creu que «estar sa» és no haver anat mai al metge. Segons l'OMS, què és la salut?",
          options:[
            {id:"a", t:"No haver d'anar mai al metge"},
            {id:"b", t:"No sentir cap dolor", trap:"asimptomatic"},
            {id:"c", t:"Un estat complet de benestar físic, psíquic i social, i no només l'absència de malaltia"},
            {id:"d", t:"Estar en bona forma física"}],
          a:"c",
          why:"L'OMS defineix la salut com un estat complet de benestar físic, psíquic i social. És un concepte dinàmic: no sentir dolor no vol dir estar sa (3.1)."},
        {id:"B1n2", comp:"salut", sec:"3.1", type:"single", pts:20,
          prompt:"En Jordi fuma un paquet al dia i s'automedica. Segons Lalonde, a quin determinant de salut pertanyen aquests hàbits, que és el que pesa més?",
          options:[
            {id:"a", t:"Biologia humana (27%)"},
            {id:"b", t:"Sistema sanitari (11%)"},
            {id:"c", t:"Medi ambient (19%)"},
            {id:"d", t:"Estil de vida (43%)"}],
          a:"d",
          why:"Fumar i automedicar-se són hàbits: estil de vida, el determinant que més pesa segons Lalonde (43%), per davant de la biologia (27%), el medi ambient (19%) i el sistema sanitari (11%) (3.1)."},
        {id:"B1n3", comp:"salut", sec:"3.1", type:"classify", pts:20,
          prompt:"La salut té tres components. Classifica el que t'explica en Jordi al taulell.",
          bins:[{id:"bio", t:"Biològic (cos)"}, {id:"psi", t:"Psíquic (emocions)"}, {id:"soc", t:"Social (entorn)"}],
          cards:[
            {id:"1", t:"Té mal de coll i un bony a la galta", a:"bio"},
            {id:"2", t:"Diu que està nerviós i preocupat pel bony", a:"psi"},
            {id:"3", t:"Ha deixat de sopar amb els amics perquè no pot parlar bé", a:"soc"},
            {id:"4", t:"Té febrícula: 37,6 °C", a:"bio"}],
          why:"El component biològic és el cos (dolor, bony, febrícula), el psíquic les emocions (preocupació) i el social l'entorn i les relacions (3.1)."},
        {id:"B1n4", comp:"terminologia", sec:"3.6", type:"single", pts:20,
          say:"Em costa molt empassar, fins i tot l'aigua. I quan pujo escales se m'acaba l'aire.",
          prompt:"El que diu en Jordi té dos noms mèdics: disfàgia (costa empassar) i dispnea (costa respirar). Què indica el prefix dis-?",
          options:[
            {id:"a", t:"Ràpid"},
            {id:"b", t:"Dificultat o alteració d'una funció"},
            {id:"c", t:"Inflamació"},
            {id:"d", t:"Absència total"}],
          a:"b",
          why:"El prefix dis- indica dificultat o alteració: disfàgia, dificultat per empassar; dispnea, dificultat per respirar. «Ràpid» és taqui- i «absència» és a-/an- (3.6)."},
        {id:"B1n5", comp:"farmacia", sec:"3.5", type:"multi", pts:20,
          say:"Ja em prenc paracetamol pel meu compte. Em podries donar també un antibiòtic, per si de cas?",
          prompt:"En Jordi et demana un antibiòtic sense recepta. Què fas? Marca totes les respostes correctes.",
          options:[
            {id:"a", t:"Donar-li l'antibiòtic perquè es curi abans", trap:"antibiotic"},
            {id:"b", t:"Explicar-li que l'antibiòtic el prescriu el metge i només actua sobre bacteris"},
            {id:"c", t:"Dir-li que té una faringitis bacteriana", trap:"diagnosticar"},
            {id:"d", t:"Recomanar-li no automedicar-se i derivar-lo al metge"}],
          a:["b","d"],
          why:"El tècnic no diagnostica ni dispensa antibiòtics sense recepta: deriva al metge, desaconsella l'automedicació i contribueix a l'ús correcte del tractament prescrit (3.5)."}
      ],
      /* ---------------------------------------------------------------- Fase 2 · Causa */
      [
        {id:"B2n1", comp:"etiologia", sec:"3.2", type:"classify", pts:20,
          prompt:"Cada branca de la patologia estudia una part del cas d'en Jordi. Relaciona-les.",
          bins:[{id:"semio", t:"Semiologia"}, {id:"fisio", t:"Fisiopatologia"}, {id:"anat", t:"Anatomia patològica"}, {id:"pato", t:"Patogènia"}],
          cards:[
            {id:"1", t:"Recull els signes i símptomes: disfàgia, febrícula, ganglis inflats", a:"semio"},
            {id:"2", t:"Explica com funciona la faringe quan està malalta", a:"fisio"},
            {id:"3", t:"Observa al microscopi les cèl·lules del bony de la galta", a:"anat"},
            {id:"4", t:"Descriu com el virus entra a la mucosa, actua i provoca la resposta del cos", a:"pato"}],
          why:"Semiologia: signes i símptomes. Fisiopatologia: com funciona un òrgan malalt. Anatomia patològica: canvis de cèl·lules i teixits. Patogènia: el mecanisme (entrada → acció → resposta → resultat) (3.2)."},
        {id:"B2n2", comp:"etiologia", sec:"3.2", type:"classify", pts:30,
          prompt:"Al laboratori de causes classifiques possibles causes de malaltia. D'on venen?",
          bins:[{id:"exo", t:"Exògena"}, {id:"endo", t:"Endògena"}, {id:"amb", t:"Ambiental"}],
          cards:[
            {id:"1", t:"El virus de la faringitis d'en Jordi", a:"exo"},
            {id:"2", t:"El pol·len al qual és al·lèrgic", a:"exo"},
            {id:"3", t:"Una alteració hormonal", a:"endo"},
            {id:"4", t:"Una alteració genètica", a:"endo"},
            {id:"5", t:"L'aire contaminat que respira repartint per la ciutat", a:"amb"},
            {id:"6", t:"Moltes hores d'exposició al sol", a:"amb"}],
          why:"Exògena: ve de fora (virus, al·lergen). Endògena: alteració interna (hormonal, genètica). Ambiental: exposició de l'entorn (aire contaminat, sol) (3.2)."},
        {id:"B2n3", comp:"etiologia", sec:"3.2", type:"single", pts:20,
          prompt:"Quina opció descriu bé la triada agent – persona – entorn de la faringitis d'en Jordi?",
          options:[
            {id:"a", t:"Agent: el tabac · Persona: el virus · Entorn: la furgoneta"},
            {id:"b", t:"Agent: el virus · Persona: les seves defenses i la gola irritada pel tabac · Entorn: el contacte diari amb molts clients"},
            {id:"c", t:"Agent: els clients · Persona: el virus · Entorn: el pol·len"},
            {id:"d", t:"Agent: l'edat · Persona: el tabac · Entorn: el virus"}],
          a:"b",
          why:"L'agent és el virus; la persona aporta la susceptibilitat i les defenses; l'entorn, els espais compartits. Per això la malaltia és multifactorial (3.2)."},
        {id:"B2n4", comp:"etiologia", sec:"3.2", type:"single", pts:15,
          prompt:"Un company de feina li diu a en Jordi: «Si fumes, segur que tindràs càncer». És correcte?",
          options:[
            {id:"a", t:"Sí: el tabac és la causa segura del càncer", trap:"causaRisc"},
            {id:"b", t:"No: el tabac no té cap relació amb les lesions de la boca"},
            {id:"c", t:"No: el tabac és un factor de risc; augmenta la probabilitat, però no la garanteix"},
            {id:"d", t:"Només si té antecedents familiars"}],
          a:"c",
          why:"Un factor de risc augmenta la probabilitat d'emmalaltir però no garanteix la malaltia. El tabac és un factor de risc modificable (3.2)."},
        {id:"B2n5", comp:"terminologia", sec:"3.6", type:"single", pts:15,
          prompt:"En Jordi té una faringitis. Què indica el sufix -itis?",
          options:[
            {id:"a", t:"Dolor"},
            {id:"b", t:"Hemorràgia"},
            {id:"c", t:"Extirpació"},
            {id:"d", t:"Inflamació"}],
          a:"d",
          why:"-itis vol dir inflamació: faringitis és la inflamació de la faringe. Dolor és -àlgia, hemorràgia -rràgia i extirpació -ectomia (3.6)."}
      ],
      /* ---------------------------------------------------------------- Fase 3 · Consulta */
      [
        {id:"B3n1", comp:"signes", sec:"3.2", type:"multi", pts:20,
          prompt:"La doctora veu la gola d'en Jordi inflamada. Quins són els quatre signes clàssics de la inflamació?",
          options:[
            {id:"a", t:"Cianosi"},
            {id:"b", t:"Rubor (vermellor)"},
            {id:"c", t:"Calor"},
            {id:"d", t:"Poliúria"},
            {id:"e", t:"Edema (inflor)"},
            {id:"f", t:"Dolor"}],
          a:["b","c","e","f"],
          why:"La inflamació es manifesta amb rubor, calor, edema i dolor, com la gola vermella i adolorida d'en Jordi. La cianosi i la poliúria són manifestacions d'altres aparells (3.2)."},
        {id:"B3n2", comp:"signes", sec:"3.2", type:"multi", pts:30,
          prompt:"El termòmetre marca 37,6 °C i en Jordi està cansat. Marca les afirmacions correctes.",
          options:[
            {id:"a", t:"És una febrícula (entre 37 i 38 °C)"},
            {id:"b", t:"És una hipertèrmia"},
            {id:"c", t:"La febre és una manifestació sistèmica (general)"},
            {id:"d", t:"La gola vermella és una manifestació localitzada"},
            {id:"e", t:"La febre sempre és una manifestació local"}],
          a:["a","c","d"],
          why:"Febrícula: 37–38 °C; febre: 38–40 °C; hipertèrmia: més de 41 °C. La febre afecta tot el cos (sistèmica) i la gola vermella, una zona (localitzada) (3.2)."},
        {id:"B3n3", comp:"fases", sec:"3.4", type:"order", pts:20,
          prompt:"Ordena la història natural de la faringitis d'en Jordi, del primer període a l'últim.",
          steps:[
            {id:"pre", t:"Prepatogènic: està sa, però fuma i és en contacte amb molta gent"},
            {id:"inc", t:"Subclínic (incubació): el virus ja és a la faringe, però encara no hi ha símptomes"},
            {id:"pro", t:"Prodròmic: malestar general i febrícula, encara inespecífics"},
            {id:"cli", t:"Clínic: mal de coll, disfàgia i gola vermella"},
            {id:"des", t:"Desenllaç: curació completa al cap d'uns dies"}],
          why:"Prepatogènic → subclínic (incubació, en les infeccions) → prodròmic (manifestacions inespecífiques) → clínic (manifestacions característiques) → desenllaç (3.4)."},
        {id:"B3n4", comp:"signes", sec:"3.2", type:"classify", pts:20,
          prompt:"La doctora repassa termes que pot trobar en un quadre com el d'en Jordi. A quin aparell pertany cada manifestació?",
          bins:[{id:"resp", t:"Respiratòria"}, {id:"circ", t:"Circulatòria"}, {id:"urin", t:"Urinària"}],
          cards:[
            {id:"1", t:"Taquipnea (respiració ràpida)", a:"resp"},
            {id:"2", t:"Cianosi (color blavós)", a:"resp"},
            {id:"3", t:"Taquicàrdia (cor ràpid)", a:"circ"},
            {id:"4", t:"Oligúria (poca orina)", a:"urin"}],
          why:"Taquipnea i cianosi són respiratòries, la taquicàrdia és circulatòria i l'oligúria és urinària. A la síndrome febril poden aparèixer taquicàrdia, taquipnea i menys orina (3.2)."},
        {id:"B3n5", comp:"classificacio", sec:"3.2", type:"single", pts:10,
          prompt:"Febrícula, cansament i mal de cap apareixen junts i poden tenir més d'una causa. Com s'anomena aquest conjunt?",
          options:[
            {id:"a", t:"Una malaltia"},
            {id:"b", t:"Un signe"},
            {id:"c", t:"Una síndrome"},
            {id:"d", t:"Un diagnòstic definitiu"}],
          a:"c",
          why:"Una síndrome és un conjunt de signes i símptomes que apareixen junts i pot tenir més d'una causa; una malaltia té una identitat clínica definida (3.2)."}
      ],
      /* ---------------------------------------------------------------- Fase 4 · Proves */
      [
        {id:"B4n1", comp:"proves", sec:"3.5", type:"order", pts:20,
          prompt:"Ordena el procés que ha seguit la doctora per arribar al diagnòstic d'en Jordi.",
          steps:[
            {id:"esc", t:"Escoltar: anamnesi (símptomes, tabac, al·lèrgies, antecedents)"},
            {id:"exp", t:"Explorar: inspecció de la gola, palpació del bony, auscultació"},
            {id:"hip", t:"Hipòtesi: faringitis vírica i possible lesió a la galta (diagnòstic diferencial)"},
            {id:"pro", t:"Proves: frotis, radiografia de tòrax i biòpsia"},
            {id:"def", t:"Diagnòstic definitiu"}],
          why:"El procés diagnòstic és escoltar (anamnesi) → explorar (signes) → hipòtesi → proves → diagnòstic definitiu (3.5)."},
        {id:"B4n2", comp:"proves", sec:"3.5", type:"classify", pts:20,
          prompt:"En Jordi pregunta si les proves d'imatge «fan mal amb radiació». Classifica-les.",
          bins:[{id:"ion", t:"Radiació ionitzant"}, {id:"noion", t:"Sense radiació ionitzant"}],
          cards:[
            {id:"1", t:"Radiografia de tòrax", a:"ion"},
            {id:"2", t:"Tomografia computada (TC)", a:"ion"},
            {id:"3", t:"Ecografia de la galta", a:"noion"},
            {id:"4", t:"Ressonància magnètica (RM)", a:"noion"}],
          why:"Radiografia i TC fan servir raigs X (radiació ionitzant). L'ecografia fa servir ultrasons i la RM imants i ones de ràdio: no són ionitzants (3.5)."},
        {id:"B4n3", comp:"proves", sec:"3.5", type:"classify", pts:20,
          prompt:"Relaciona cada prova amb el que estudia.",
          bins:[{id:"ecg", t:"ECG"}, {id:"eeg", t:"EEG"}, {id:"emg", t:"EMG"}, {id:"cito", t:"Citologia"}, {id:"biop", t:"Biòpsia"}],
          cards:[
            {id:"1", t:"L'activitat elèctrica del cor", a:"ecg"},
            {id:"2", t:"L'activitat elèctrica del cervell", a:"eeg"},
            {id:"3", t:"L'activitat elèctrica del múscul", a:"emg"},
            {id:"4", t:"Cèl·lules soltes d'una mostra", a:"cito"},
            {id:"5", t:"Un fragment de teixit del bony de la galta", a:"biop"}],
          why:"ECG: cor; EEG: cervell; EMG: múscul. La citologia estudia cèl·lules i la biòpsia un teixit; totes dues van a anatomia patològica (3.5)."},
        {id:"B4n4", comp:"proves", sec:"3.5", type:"single", pts:10,
          prompt:"Si a en Jordi li haguessin revisat la boca en una revisió periòdica, sense símptomes, la lesió s'hauria trobat abans. Com s'anomena això?",
          options:[
            {id:"a", t:"Diagnòstic definitiu"},
            {id:"b", t:"Hipòtesi diagnòstica"},
            {id:"c", t:"Pronòstic"},
            {id:"d", t:"Diagnòstic precoç (cribratge)"}],
          a:"d",
          why:"El cribratge busca la malaltia abans que doni símptomes (període de latència): és el diagnòstic precoç (3.5)."},
        {id:"B4n5", comp:"proves", sec:"3.5", type:"multi", pts:30,
          prompt:"Per què la doctora demana proves a en Jordi? Marca totes les respostes correctes.",
          options:[
            {id:"a", t:"Per confirmar la hipòtesi de faringitis vírica"},
            {id:"b", t:"Cal fer-les totes, per si de cas", trap:"provesInnecessaries"},
            {id:"c", t:"Per precisar què és i fins on arriba el bony de la galta"},
            {id:"d", t:"Per descartar altres explicacions, com una pneumònia"},
            {id:"e", t:"Per començar el tractament abans de tenir el diagnòstic"}],
          a:["a","c","d"],
          why:"Les proves serveixen per confirmar, precisar o descartar; no cal fer-les totes. El tractament arriba després del diagnòstic (3.5)."}
      ],
      /* ---------------------------------------------------------------- Fase 5 · Decisió */
      [
        {id:"B5n1", comp:"classificacio", sec:"3.3", type:"single", pts:20,
          prompt:"Aquest mes, a la farmàcia, la lesió de la galta d'en Jordi és un cas aïllat: no n'hi ha cap altre al barri. Com és la seva presentació?",
          options:[
            {id:"a", t:"Epidèmica"},
            {id:"b", t:"Esporàdica"},
            {id:"c", t:"Endèmica"}],
          a:"b",
          why:"Esporàdica: casos aïllats. Epidèmica: molts casos alhora en poc temps. Endèmica: present de manera habitual en una zona (3.3)."},
        {id:"B5n2", comp:"tractament", sec:"3.5", type:"single", pts:20,
          prompt:"La doctora preveu que la faringitis vírica d'en Jordi es curarà en pocs dies sense problemes. Quin grau de pronòstic és?",
          options:[
            {id:"a", t:"Reservat"},
            {id:"b", t:"Greu"},
            {id:"c", t:"Lleu"},
            {id:"d", t:"Crític"}],
          a:"c",
          why:"Graus de pronòstic: lleu, greu, molt greu, crític (risc immediat) i reservat (no hi ha prou dades). Una evolució bona i ràpida és un pronòstic lleu (3.5)."},
        {id:"B5n3", comp:"tractament", sec:"3.5", type:"classify", pts:20, trap:"simptomaticCuratiu",
          prompt:"Classifica cada tractament segons el que pretén.",
          bins:[{id:"cur", t:"Curatiu"}, {id:"sim", t:"Simptomàtic"}, {id:"pal", t:"Pal·liatiu"}],
          cards:[
            {id:"1", t:"Extirpar la lesió de la galta amb cirurgia", a:"cur"},
            {id:"2", t:"Paracetamol per al mal de coll d'en Jordi", a:"sim"},
            {id:"3", t:"Antibiòtic per a una infecció bacteriana sensible (un altre pacient)", a:"cur"},
            {id:"4", t:"Pastilles per a la gola que alleugen la molèstia", a:"sim"},
            {id:"5", t:"Reduir el malestar d'un pacient amb una malaltia avançada", a:"pal"}],
          why:"Curatiu: elimina la causa (cirurgia, antibiòtic en infecció bacteriana sensible). Simptomàtic: alleuja les manifestacions (paracetamol). Pal·liatiu: redueix el malestar (3.5)."},
        {id:"B5n4", comp:"fases", sec:"3.4", type:"multi", pts:20,
          prompt:"Pensa en l'evolució i el tractament d'en Jordi. Marca les afirmacions correctes.",
          options:[
            {id:"a", t:"Si després de la cirurgia li queda una cicatriu permanent a la galta, és una seqüela"},
            {id:"b", t:"Seqüela i cronicitat volen dir el mateix"},
            {id:"c", t:"Un problema nou que aparegués durant la faringitis seria una complicació"},
            {id:"d", t:"El paracetamol per via oral és un tractament sistèmic"},
            {id:"e", t:"Una pomada a la pell és un tractament sistèmic"},
            {id:"f", t:"Cronicitat vol dir que la malaltia persisteix"}],
          a:["a","c","d","f"],
          why:"Seqüela: alteració que queda després de curar; cronicitat: la malaltia persisteix. Complicació: problema que apareix durant l'evolució. Oral és sistèmic; pomada, local (3.4, 3.5)."},
        {id:"B5n5", comp:"terminologia", sec:"3.6", type:"single", pts:20,
          prompt:"La doctora explica que, si un gangli del coll estigués afectat, potser caldria extirpar-lo. Quin sufix vol dir «extirpació»?",
          options:[
            {id:"a", t:"-scòpia"},
            {id:"b", t:"-àlgia"},
            {id:"c", t:"-ectomia"},
            {id:"d", t:"-itis"}],
          a:"c",
          why:"-ectomia vol dir extirpació; -scòpia, observació amb un instrument (gastroscòpia); -àlgia, dolor; -itis, inflamació (3.6)."}
      ]
    ],
    tests: [
      {id:"sang", t:"Analítica de sang", kind:"neutral", pts:0,
        bars:[{t:"Leucòcits", v:7.8, lo:4, hi:11, u:"×10³/µL"}, {t:"Glucosa", v:92, lo:70, hi:110, u:"mg/dL"}],
        result:{viz:"bars", label:"Analítica de sang", text:"Valors normals. És defensable com a estudi general, però no confirma la faringitis ni diu què és el bony de la galta."}},
      {id:"citologia", t:"Citologia de la galta", kind:"neutral", pts:0,
        result:{viz:"micro", label:"Citologia", text:"Algunes cèl·lules soltes amb canvis. Orienta, però per saber si el teixit està afectat cal la biòpsia, que estudia un fragment de teixit."}},
      {id:"tc", t:"Tomografia computada (TC)", kind:"no", pts:10,
        result:{viz:"scan", label:"TC de coll i tòrax", text:"Sense troballes noves. Fa servir radiació ionitzant i no calia: la radiografia ja descartava problemes al tòrax i la biòpsia confirma la lesió."}},
      {id:"eeg", t:"Electroencefalograma (EEG)", kind:"no", pts:10,
        result:{viz:"ecg", label:"EEG", text:"Activitat elèctrica del cervell normal. En Jordi no té cap manifestació neurològica: prova innecessària."}},
      {id:"emg", t:"Electromiograma (EMG)", kind:"no", pts:10,
        result:{viz:"ecg", label:"EMG", text:"Activitat elèctrica dels músculs normal. No té relació amb la gola ni amb el bony: prova innecessària."}}
    ]
  };
});

/* Traducció al castellà del contingut compartit del RA3 (competències, errors, fases, ajudes, escenes) */
(function(root, factory){ const v = factory(); if (typeof module === "object" && module.exports) module.exports = v; else { root.RA3_ES = root.RA3_ES || {}; root.RA3_ES.shared = v; } })(typeof self !== "undefined" ? self : this, function(){
  "use strict";
  return {
    comps: {
      salut: "Salud y enfermedad",
      etiologia: "Etiología y factores de riesgo",
      signes: "Signos y síntomas",
      classificacio: "Tipología de enfermedades",
      fases: "Historia natural de la enfermedad",
      exploracio: "Anamnesis y exploración física",
      proves: "Diagnóstico y pruebas complementarias",
      tractament: "Pronóstico y tratamiento",
      farmacia: "Papel del técnico en el mostrador",
      terminologia: "Terminología médica"
    },
    traps: {
      antibiotic: "Elegir un antibiótico para una infección vírica o sin receta: el antibiótico solo actúa sobre bacterias sensibles y lo prescribe el médico.",
      diagnosticar: "Diagnosticar o decidir pruebas desde el mostrador: el técnico escucha, observa, describe el cuadro y deriva.",
      signeSimptoma: "Confundir signo (objetivo, se mide o se observa) y síntoma (subjetivo, lo percibe el paciente).",
      provesInnecessaries: "Pedir pruebas que no hacen falta: se piden para confirmar, precisar o descartar, no todas.",
      causaRisc: "Confundir la causa de una enfermedad con un factor de riesgo, que solo aumenta su probabilidad.",
      asimptomatic: "Pensar que sin síntomas no hay enfermedad: hay periodos subclínicos y el cribado los detecta.",
      simptomaticCuratiu: "Confundir tratamiento sintomático (alivia las manifestaciones) con curativo (elimina la causa).",
      exploracio: "Mezclar las maniobras de exploración física (inspección, palpación, percusión, auscultación)."
    },
    phases: [
      {title: "El mostrador", place: "Oficina de farmacia"},
      {title: "La causa", place: "Laboratorio de etiología"},
      {title: "La consulta", place: "Consulta médica"},
      {title: "Las pruebas", place: "Diagnóstico"},
      {title: "La decisión", place: "Diagnóstico y tratamiento"}
    ],
    hints: [
      [{title: "El papel del técnico en el mostrador", text: "En la farmacia, escuchar el relato y observar datos ayuda a orientar y derivar. Hay que describir el cuadro sin diagnosticar y contribuir al uso correcto del tratamiento prescrito (3.5)."},
       {title: "¿Signo o síntoma?", text: "Signo: manifestación objetiva que el personal sanitario puede observar o medir (fiebre medida, palidez, erupción). Síntoma: manifestación subjetiva que solo percibe el paciente (dolor, mareo, náuseas). «Me da vueltas la cabeza» es un síntoma; 39 °C medidos es un signo (3.2)."}],
      [{title: "Tipos de causas", text: "Exógena: viene de fuera del cuerpo (bacteria, virus, alérgeno, gas irritante). Endógena: alteración interna (metabólica, hormonal, genética). Ambiental: exposición del entorno (sol, aire contaminado). Si las causas son diversas, la enfermedad es multifactorial."},
       {title: "Causa y factor de riesgo", text: "Un factor de riesgo aumenta la probabilidad de enfermar, pero no garantiza que aparezca la enfermedad. Modificables: hábitos y exposiciones (tabaco, sedentarismo, alimentación). No modificables: edad, antecedentes, predisposición genética. Tríada: agente – persona – entorno."}],
      [{title: "Exploración física", text: "Inspección: con la vista. Palpación: con el tacto (bultos, masas, dolor). Percusión: golpear suavemente con la mano o con instrumentos. Auscultación: con el oído y el fonendoscopio, para oír los ruidos de los órganos (3.5)."},
       {title: "Historia natural", text: "Prepatogénico: sano pero expuesto a factores de riesgo. Subclínico: enfermedad sin síntomas (incubación en infecciones; latencia en procesos lentos). Prodrómico: manifestaciones inespecíficas. Clínico: manifestaciones características. Desenlace: curación, secuelas, cronicidad o muerte (3.4)."}],
      [{title: "Por qué se pide una prueba", text: "Escuchar → explorar → hipótesis (diagnóstico diferencial) → pruebas → diagnóstico definitivo. Las pruebas sirven para confirmar una hipótesis, precisar el alcance o descartar otras explicaciones. No hace falta hacerlas todas (3.5)."},
       {title: "Técnicas diagnósticas", text: "Análisis (sangre, orina, esputo, frotis). Citología (células) y biopsia (tejido) → anatomía patológica. Radiografía y TC: rayos X, radiación ionizante. Ecografía (ultrasonidos) y RM (imanes y ondas de radio): sin radiación ionizante. ECG: actividad eléctrica del corazón."}],
      [{title: "Tipología de enfermedades", text: "Duración: aguda o crónica. Localización: local o general/sistémica. Presentación: esporádica, epidémica, endémica. Causa: infecciosa, inmunitaria, vascular, neoplasia, congénita, traumática, metabólica. Pronóstico: leve, grave, fatal. Una enfermedad puede pertenecer a más de un grupo (3.3)."},
       {title: "Tipos de tratamiento", text: "Curativo: elimina la enfermedad o la causa. Sintomático: solo alivia las manifestaciones (paracetamol). Paliativo: reduce el malestar en enfermedades avanzadas. Específico: actúa sobre el agente. Recursos: higiene, fármacos, cirugía, dietoterapia… (3.5)."}]
    ],
    spots: {cap: "Cabeza", galta: "Mejilla", gola: "Garganta", coll: "Cuello", pit: "Pecho", "braç": "Brazo", abdomen: "Abdomen", cos: "Todo el cuerpo", peus: "Pies"},
    agents: {virus: "Virus", bacteri: "Bacteria", pollen: "Polen", gas: "Gas irritante", multi: "Varias causas"},
    devices: {"Negatoscopi": "Negatoscopio", "Monitor d'ECG": "Monitor de ECG", "Tubs d'analítica": "Tubos de análisis", "Centrífuga": "Centrífuga"}
  };
});

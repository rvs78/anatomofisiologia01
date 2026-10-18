/* Traducció al castellà del cas C (versió 2). Contingut: docs/ra3-contingut.md */
(function(root, factory){
  const v = factory();
  if (typeof module === "object" && module.exports) module.exports = v;
  else { root.RA3_ES = root.RA3_ES || {}; root.RA3_ES.C = v; }
})(typeof self !== "undefined" ? self : this, function(){
  "use strict";
  const SS = {signe:"Signo", simptoma:"Síntoma"};
  return {
    name: "El azúcar de Antoni",
    short: "Diabetes tipo 2",
    intro: "Jueves, 9 de la mañana. Entra Antoni, administrativo, con un sobre en la mano. Sonríe: dice que se encuentra perfectamente.",
    ofici: "administrativo",
    items: {
      /* ================= Fase 1 · El mostrador (existentes) */
      "C1a": {
        prompt: "Antoni te enseña el resultado del examen de salud de la empresa. ¿Qué haces primero?",
        say: "Buenos días. En el examen de salud de la empresa me han encontrado glucosa en la orina. ¡Pero yo me encuentro perfectamente! ¿Qué quiere decir esto?",
        options: {a:"Escucharlo, leer el informe con él y explicarle que lo tiene que valorar el médico", b:"Decirle que tiene diabetes", c:"Decirle que, si se encuentra bien, no es nada", d:"Venderle un suplemento para bajar el azúcar"},
        why: "El técnico escucha, observa y orienta. No interpreta un resultado como un diagnóstico: deriva al médico (3.5)."
      },
      "C1b": {
        prompt: "¿Qué preguntas son útiles para orientar el caso? Márcalas todas.",
        options: {a:"¿Tiene familiares con diabetes?", b:"¿Cómo es su alimentación y cuánta actividad física hace?", c:"¿Ha notado más sed o más cansancio?", d:"¿De qué marca es su coche?", e:"¿Le gusta el cine?"},
        why: "Los antecedentes familiares, el estilo de vida y las manifestaciones recientes orientan el caso (3.1, 3.5)."
      },
      "C1c": {
        prompt: "Antoni te pregunta: «Si me encuentro bien, quiere decir que estoy sano, ¿no?» ¿Qué le respondes?",
        say: "Si me encuentro bien, quiere decir que estoy sano, ¿no?",
        options: {a:"No necesariamente: se puede estar enfermo sin notar síntomas", b:"Sí: sin síntomas no hay enfermedad", c:"Sí: la salud solo es cómo nos sentimos", d:"Depende del día"},
        why: "La salud es dinámica y hay periodos subclínicos sin síntomas. «Se encuentra bien pero está enfermo» (3.1, 3.4)."
      },
      "C1d": {
        prompt: "Clasifica lo que notas en el mostrador: ¿es un signo o un síntoma?",
        bins: SS,
        cards: {"1":"La glucosa en la orina del informe", "2":"Dice que bebe más agua que antes", "3":"La báscula de la farmacia marca 108 kg", "4":"Dice que por la tarde se nota cansado"},
        why: "Un resultado de laboratorio y un peso medido son signos. La sed y el cansancio los explica él: son síntomas (3.2)."
      },
      "C1e": {
        prompt: "¿Cuál es la mejor decisión final en el mostrador?",
        options: {a:"Derivarlo al médico de cabecera con el informe", b:"Recomendarle una dieta y que no vaya al médico", c:"Hacerle una prueba de glucosa en la farmacia y decirle qué tiene", d:"Decirle que repita el examen dentro de un año"},
        why: "El técnico deriva al médico, que hará la anamnesis, la exploración y las pruebas para llegar al diagnóstico (3.5)."
      },
      /* ================= Fase 1 · nuevas */
      "C1n1": {
        say: "Yo siempre he pensado que estar sano quiere decir no estar enfermo, y ya está.",
        prompt: "Antoni tiene una idea muy simple de la salud. ¿Cuál es la definición de salud de la OMS?",
        options: {a:"No tener ninguna enfermedad diagnosticada", b:"Un estado completo de bienestar físico, psíquico y social, y no solo la ausencia de enfermedad", c:"Tener todas las analíticas dentro de los valores normales", d:"Encontrarse bien físicamente, aunque haya problemas emocionales o sociales"},
        why: "Para la OMS, la salud es un estado completo de bienestar físico, psíquico y social y no solo la ausencia de enfermedad; además, es un concepto dinámico (3.1)."
      },
      "C1n2": {
        say: "Yo creo que esto del azúcar es cosa de la herencia: mi padre también tenía.",
        prompt: "Según el modelo de Lalonde, ¿qué determinante pesa más en la salud de una persona?",
        options: {a:"La biología humana (herencia, edad)", b:"El sistema sanitario", c:"El estilo de vida (alimentación, actividad física, hábitos)", d:"El medio ambiente"},
        why: "Según Lalonde, el estilo de vida pesa un 43%, más que la biología humana (27%), el medio ambiente (19%) y el sistema sanitario (11%): los hábitos de Antoni cuentan mucho (3.1)."
      },
      "C1n3": {
        prompt: "La salud tiene tres componentes. Clasifica cada dato de Antoni en el componente que corresponde.",
        bins: {bio:"Biológico (cuerpo)", psi:"Psíquico (emociones)", soc:"Social (entorno)"},
        cards: {"1":"Glucosa en la orina y peso de 108 kg", "2":"Está preocupado y nervioso por el resultado del examen", "3":"Los compañeros de la oficina traen pastas cada mañana para desayunar juntos", "4":"Tiene miedo de que le digan que está enfermo"},
        why: "Biológico es el cuerpo (glucosa, peso); psíquico, las emociones (preocupación, miedo); social, el entorno (los compañeros y los desayunos del trabajo) (3.1)."
      },
      "C1n4": {
        say: "Ah, y otra cosa: ahora orino mucho más a menudo que antes, incluso por la noche.",
        prompt: "En la ficha de observaciones quieres usar el término correcto. ¿Cómo se llama orinar mucho más de lo normal?",
        options: {a:"Oliguria", b:"Poliuria", c:"Anuria", d:"Glucosuria"},
        why: "Poliuria es orinar mucho; oliguria, orinar poco; anuria, no orinar. Glucosuria quiere decir glucosa en la orina, no cantidad de orina (3.2, 3.6)."
      },
      "C1n5": {
        say: "Mientras no voy al médico, ¿me puedo tomar unas pastillas para el azúcar que tiene mi cuñado?",
        prompt: "¿Qué le respondes a Antoni?",
        options: {a:"Sí, si a su cuñado le van bien, a usted también le irán bien", b:"Sí, pero tome solo la mitad de la dosis", c:"Mejor que se tome un antibiótico por si acaso", d:"No: no debe automedicarse con fármacos de otra persona. Primero lo tiene que valorar el médico y después le ayudaremos a usar bien el tratamiento que le prescriba"},
        why: "El técnico no recomienda automedicarse: deriva al médico y después contribuye al uso correcto del tratamiento prescrito (3.5)."
      },

      /* ================= Fase 2 · La causa (existentes) */
      "C2a": {
        prompt: "En el laboratorio de causas, ¿qué explica mejor el caso de Antoni?",
        options: {multi:"Varias causas juntas: metabolismo, hábitos y herencia", virus:"Un virus", bacteri:"Una bacteria", gas:"Un gas irritante"},
        why: "No hay un microorganismo: hay una alteración metabólica con varios factores (hábitos, herencia, edad). Es multifactorial (3.2)."
      },
      "C2b": {
        prompt: "La diabetes nace de una alteración interna del metabolismo. Esta alteración es de origen…",
        options: {a:"Endógeno", b:"Exógeno", c:"Ambiental", d:"Traumático"},
        why: "Endógeno: proviene de una alteración interna, como una alteración hormonal o metabólica (3.2)."
      },
      "C2c": {
        prompt: "Clasifica los factores de riesgo de Antoni.",
        bins: {mod:"Modificable", nomod:"No modificable"},
        cards: {"1":"Obesidad", "2":"Sedentarismo", "3":"Alimentación rica en azúcares", "4":"Edad: 52 años", "5":"Padre diabético (antecedentes familiares)", "6":"Predisposición genética"},
        why: "Modificables: hábitos y estilo de vida. No modificables: edad, antecedentes y genética (3.2, 3.4)."
      },
      "C2d": {
        prompt: "Si una enfermedad tiene varias causas, decimos que es…",
        options: {a:"Multifactorial", b:"Congénita", c:"Epidémica", d:"Aguda"},
        why: "«Si las causas son varias, hablamos de enfermedad multifactorial» (3.2)."
      },
      "C2e": {
        prompt: "¿La obesidad garantiza que Antoni tenga diabetes?",
        options: {a:"No: un factor de riesgo aumenta la probabilidad, no la garantiza", b:"Sí: la obesidad es la causa única de la diabetes", c:"Sí, si tiene más de 50 años", d:"Solo si además fuma"},
        why: "«Un factor de riesgo aumenta las probabilidades; no garantiza que aparezca la enfermedad» (3.2, 3.4)."
      },
      /* ================= Fase 2 · nuevas */
      "C2n1": {
        prompt: "En el laboratorio trabajan varias ramas de la patología. Relaciona cada tarea con la rama que la hace.",
        bins: {semio:"Semiología", fisio:"Fisiopatología", anat:"Anatomía patológica", pato:"Patogenia"},
        cards: {"1":"Estudia los signos y síntomas de Antoni: la sed, la glucosa en la orina", "2":"Estudia cómo funciona su organismo enfermo: por qué no regula bien el azúcar", "3":"Estudia al microscopio los cambios de células y tejidos (biopsia)", "4":"Estudia el mecanismo paso a paso: entrada, acción, respuesta y resultado"},
        why: "Semiología: signos y síntomas. Fisiopatología: cómo funciona un órgano enfermo. Anatomía patológica: cambios de células y tejidos. Patogenia: mecanismo de desarrollo (3.2)."
      },
      "C2n2": {
        prompt: "En el laboratorio hay muestras de causas diferentes. Clasifica cada causa según su origen.",
        bins: {exo:"Exógena", endo:"Endógena", amb:"Ambiental"},
        cards: {"1":"La alteración metabólica de Antoni", "2":"El virus de la gripe de un compañero de la oficina", "3":"El aire contaminado de la ciudad", "4":"Un déficit de lactasa", "5":"El polen que provoca una alergia", "6":"Un gesto repetitivo en el trabajo"},
        why: "Exógena viene de fuera (virus, alérgeno); endógena es una alteración interna (metabólica, déficit de lactasa); ambiental es una exposición del entorno (aire contaminado, gesto repetitivo) (3.2)."
      },
      "C2n3": {
        prompt: "Antoni dice: «Mi hermano come tanto dulce como yo y no tiene diabetes. Por lo tanto, ¡comer dulce no tiene nada que ver!» ¿Qué es correcto?",
        options: {a:"Tiene razón: si no le pasa a todo el mundo, no tiene ninguna relación", b:"Comer mucho dulce es un factor de riesgo: aumenta la probabilidad, pero no garantiza la enfermedad", c:"Comer dulce es la causa única de la diabetes", d:"Seguro que su hermano también tiene diabetes"},
        why: "Hay que distinguir causa de factor de riesgo: un factor de riesgo aumenta la probabilidad de enfermar, pero no garantiza que aparezca la enfermedad (3.2)."
      },
      "C2n4": {
        prompt: "Este invierno, la gripe ha pasado por la oficina de Antoni. Clasifica cada elemento en la tríada agente – persona – entorno.",
        bins: {agent:"Agente", persona:"Persona", entorn:"Entorno"},
        cards: {"1":"El virus de la gripe", "2":"Las defensas bajas de un compañero", "3":"Una oficina cerrada donde todos comparten el espacio", "4":"La susceptibilidad de cada trabajador"},
        why: "En la gripe, el agente es el virus; la persona aporta la susceptibilidad y las defensas; el entorno son los espacios compartidos (3.2)."
      },
      "C2n5": {
        prompt: "En el informe del laboratorio aparece la palabra «hiperglucemia». ¿Qué quiere decir?",
        options: {a:"Poca glucosa en la sangre", b:"Glucosa en la orina", c:"Mucha glucosa en la sangre", d:"Inflamación del hígado"},
        why: "Hiper- quiere decir exceso y -emia, sangre: hiperglucemia es mucha glucosa en la sangre. Poca sería hipo-; la inflamación del hígado es hepatitis (-itis) (3.6)."
      },

      /* ================= Fase 3 · La consulta (existentes) */
      "C3a": {
        prompt: "La doctora explora a Antoni. Toca cada zona del cuerpo y clasifica los hallazgos.",
        bins: SS,
        cards: {"1":"Glucosa en la orina (glucosuria)", "2":"Perímetro abdominal de 118 cm", "3":"Tensión arterial 145/92 (hipertensión)", "4":"Peso de 108 kg (obesidad)", "5":"Sed más frecuente", "6":"Cansancio por la tarde", "7":"Pulso de 78 latidos por minuto (normal)", "8":"Dice que se levanta a orinar por la noche"},
        why: "La glucosuria, el perímetro, la tensión, el peso y el pulso se miden: son signos. La sed, el cansancio y levantarse a orinar los explica él: son síntomas leves (3.2)."
      },
      "C3b": {
        prompt: "Relaciona cada acción de la doctora con la maniobra de exploración.",
        bins: {inspeccio:"Inspección", palpacio:"Palpación", percussio:"Percusión", auscultacio:"Auscultación"},
        cards: {"1":"Observa la piel y la forma del abdomen", "2":"Presiona el abdomen con las manos para ver si duele", "3":"Escucha el corazón con el fonendoscopio", "4":"Golpea el abdomen para oír el sonido de los órganos"},
        why: "Inspección con la vista, palpación con el tacto, percusión golpeando y auscultación con el fonendoscopio (3.5)."
      },
      "C3c": {
        prompt: "Antes del examen de la empresa, cuando Antoni no notaba nada, ¿en qué periodo de la enfermedad estaba?",
        options: {pre:"Periodo prepatogénico", inc:"Subclínico: incubación", lat:"Subclínico: latencia", pro:"Periodo prodrómico", cli:"Periodo clínico", des:"Desenlace"},
        why: "Enfermedad instaurada pero sin síntomas, en un proceso lento: periodo subclínico de latencia. El cribado detecta algunos casos (3.4)."
      },
      "C3d": {
        prompt: "El examen de salud de la empresa que lo ha detectado es un ejemplo de…",
        options: {a:"Diagnóstico precoz (cribado)", b:"Diagnóstico definitivo", c:"Tratamiento", d:"Pronóstico"},
        why: "El diagnóstico precoz prevé enfermedades con pruebas de cribado poblacional (3.5)."
      },
      /* ================= Fase 3 · nuevas */
      "C3n1": {
        prompt: "La doctora avisa a Antoni de que vigile las heridas y los golpes, y que se fije si una zona se inflama. ¿Cuáles son los signos de la inflamación? Márcalos todos.",
        options: {a:"Rubor (enrojecimiento)", b:"Cianosis (color azulado)", c:"Calor", d:"Edema (hinchazón)", e:"Palidez", f:"Dolor"},
        why: "La inflamación se reconoce por rubor, calor, edema y dolor. La cianosis y la palidez son otras manifestaciones (3.2)."
      },
      "C3n2": {
        prompt: "Antoni tiene 36,8 °C. La doctora le explica que, si un día tuviera 38,5 °C con escalofríos y cansancio, lo tendría que consultar. ¿Cómo se describe esta situación?",
        options: {a:"Febrícula: una manifestación localizada", b:"Hipertermia: una manifestación localizada", c:"Febrícula: una manifestación sistémica", d:"Fiebre: una manifestación sistémica (afecta a todo el cuerpo)"},
        why: "Febrícula es 37–38 °C, fiebre 38–40 °C e hipertermia más de 41 °C. El síndrome febril afecta a todo el organismo: es una manifestación sistémica (3.2)."
      },
      "C3n3": {
        prompt: "Antoni ha leído «síndrome» en una revista y pregunta si es lo mismo que «enfermedad». ¿Qué es correcto?",
        options: {a:"Sí: son sinónimos", b:"No: un síndrome siempre es más grave que una enfermedad", c:"No: un síndrome es un conjunto de signos y síntomas que aparecen juntos y puede tener más de una causa; una enfermedad tiene una identidad clínica definida", d:"No: un síndrome solo tiene síntomas, nunca signos"},
        why: "Un síndrome es un conjunto de signos y síntomas que aparecen juntos y puede tener más de una causa; una enfermedad es una identidad clínica definida (3.2)."
      },
      "C3n4": {
        prompt: "Ordena los periodos de la historia natural de la enfermedad, aplicados a Antoni.",
        steps: {pre:"Prepatogénico: sano, pero expuesto a factores de riesgo (sobrepeso, sedentarismo)", sub:"Subclínico de latencia: la glucosa ya es alta, pero no nota nada", pro:"Prodrómico: manifestaciones inespecíficas, como el malestar o el cansancio", cli:"Clínico: manifestaciones características", des:"Desenlace: en su caso, lo más probable es la cronicidad"},
        why: "El orden es prepatogénico → subclínico (latencia en procesos lentos) → prodrómico → clínico → desenlace (3.4)."
      },
      "C3n5": {
        prompt: "La doctora repasa términos de manifestaciones por aparatos. Clasifica cada término en el aparato que corresponde.",
        bins: {resp:"Respiratoria", uri:"Urinaria", circ:"Circulatoria"},
        cards: {"1":"Taquipnea (respiración rápida)", "2":"Disnea (dificultad para respirar)", "3":"Poliuria (orinar mucho), como Antoni", "4":"Oliguria (orinar poco)", "5":"Hipertensión (145/92), como Antoni", "6":"Taquicardia (corazón rápido)"},
        why: "La taquipnea y la disnea son respiratorias; la poliuria y la oliguria, urinarias; la hipertensión y la taquicardia, circulatorias (3.2)."
      },

      /* ================= Fase 4 · Las pruebas (existentes) */
      "C4a": {
        prompt: "La doctora sospecha una diabetes pero todavía no tiene las analíticas. ¿Qué diagnóstico tiene ahora?",
        options: {a:"Una hipótesis diagnóstica (diagnóstico diferencial)", b:"El diagnóstico definitivo", c:"Un pronóstico reservado", d:"Un tratamiento"},
        why: "Sospecha con la anamnesis y la exploración y pide pruebas para confirmar: hipótesis diagnóstica (3.5)."
      },
      "C4b": {
        prompt: "Pide solo las pruebas que hacen falta para confirmar la sospecha.",
        why: "Las analíticas de sangre y de orina confirman la alteración metabólica. No hacen falta pruebas de imagen ni biopsia (3.5)."
      },
      "C4c": {
        prompt: "¿Por qué la doctora no pide una RM ni una biopsia?",
        options: {a:"Porque las pruebas se piden para confirmar, precisar o descartar: no hace falta hacerlas todas", b:"Porque son demasiado caras", c:"Porque Antoni no tiene síntomas", d:"Porque solo se hacen en los hospitales"},
        why: "«No hace falta hacerlas todas»: cada prueba tiene que responder una pregunta del diagnóstico (3.5)."
      },
      "C4d": {
        prompt: "¿Qué dos pruebas NO usan radiación ionizante?",
        options: {a:"Ecografía y RM", b:"Radiografía y TC", c:"TC y RM", d:"Radiografía y ecografía"},
        why: "La ecografía (ultrasonidos) y la RM (imanes y ondas de radio) no usan radiación ionizante; la radiografía y la TC, sí (3.5)."
      },
      /* ================= Fase 4 · nuevas */
      "C4n1": {
        prompt: "Ordena los pasos del proceso diagnóstico que ha seguido la doctora con Antoni.",
        steps: {esc:"Escuchar (anamnesis): la sed, los hábitos, el padre diabético", exp:"Explorar: peso, perímetro abdominal y tensión arterial", hip:"Hipótesis: sospecha de diabetes (diagnóstico diferencial)", pro:"Pruebas: analíticas de sangre y de orina", def:"Diagnóstico definitivo: diabetes mellitus tipo 2"},
        why: "El proceso es escuchar (anamnesis) → explorar → hipótesis → pruebas → diagnóstico definitivo (3.5)."
      },
      "C4n2": {
        prompt: "Antoni pregunta qué pruebas usan radiación. Clasifícalas.",
        bins: {ion:"Radiación ionizante", noion:"Sin radiación ionizante"},
        cards: {"1":"Radiografía (rayos X)", "2":"TC (rayos X en cortes)", "3":"Ecografía (ultrasonidos)", "4":"RM (imanes y ondas de radio)", "5":"Electrocardiograma (actividad eléctrica del corazón)"},
        why: "La radiografía y la TC usan rayos X, radiación ionizante; la ecografía, la RM y el ECG no (3.5)."
      },
      "C4n3": {
        prompt: "Relaciona cada prueba con lo que estudia.",
        bins: {cor:"El corazón", cervell:"El cerebro", muscul:"El músculo", anat:"Células o tejido (anatomía patológica)"},
        cards: {"1":"ECG", "2":"EEG", "3":"EMG", "4":"Citología", "5":"Biopsia"},
        why: "El ECG estudia el corazón, el EEG el cerebro y el EMG el músculo. La citología (células) y la biopsia (tejido) van a anatomía patológica (3.5)."
      },
      "C4n4": {
        prompt: "¿Por qué es útil un cribado como el examen de salud de la empresa de Antoni?",
        options: {a:"Porque cura la enfermedad antes de que aparezca", b:"Porque solo se hace a las personas con muchos síntomas", c:"Porque permite un diagnóstico precoz: detecta algunos procesos en el periodo de latencia, sin síntomas", d:"Porque da el diagnóstico definitivo sin ninguna otra prueba"},
        why: "El cribado permite el diagnóstico precoz y detecta algunos procesos en latencia; después hay que confirmarlo con pruebas (3.4, 3.5)."
      },
      "C4n5": {
        prompt: "¿Para qué sirven las pruebas que ha pedido la doctora? Márcalo todo.",
        options: {a:"Confirmar la hipótesis de diabetes", b:"Hacerlas todas, por si acaso", c:"Precisar el alcance: cuánto de alta está la glucosa", d:"Sustituir la anamnesis y la exploración", e:"Descartar otras explicaciones"},
        why: "Las pruebas se piden para confirmar, precisar o descartar, después de escuchar y explorar; no hace falta hacerlas todas (3.5)."
      },

      /* ================= Fase 5 · La decisión (existentes) */
      "C5a": {
        prompt: "Compara la clínica con los resultados. ¿Cuál es el diagnóstico definitivo?",
        options: {a:"Diabetes mellitus tipo 2", b:"Gripe", c:"Infección de orina", d:"Está sano: solo había comido dulce antes del examen"},
        why: "Glucosa alta en ayunas y en la orina, con factores de riesgo y pocos síntomas → diabetes. El diagnóstico definitivo se obtiene después de valorar los resultados (3.5)."
      },
      "C5b": {
        prompt: "¿Cómo clasificas la enfermedad de Antoni? Marca todas las que corresponden.",
        options: {a:"Crónica", b:"Metabólica", c:"General o sistémica (afecta a todo el cuerpo)", d:"Aguda", e:"Infecciosa", f:"Congénita", g:"Traumática"},
        why: "La diabetes persiste (crónica), es una alteración del metabolismo (metabólica) y afecta a todo el cuerpo (general) (3.3)."
      },
      "C5c": {
        prompt: "¿Qué recurso terapéutico es la base del tratamiento inicial?",
        options: {a:"Dietoterapia y ejercicio físico", b:"Antibiótico", c:"Cirugía", d:"Quimioterapia"},
        why: "Dietoterapia: preparados y pautas nutricionales bajo prescripción, con medidas higiénicas como el ejercicio (3.5)."
      },
      "C5d": {
        prompt: "¿Qué papel tiene la farmacia a partir de ahora? Márcalo todo.",
        options: {a:"Contribuir al uso correcto del tratamiento prescrito", b:"Reforzar los hábitos saludables que ha indicado el médico", c:"Cambiarle la dosis si le parece", d:"Decirle que deje el tratamiento cuando se encuentre bien"},
        why: "El equipo de farmacia contribuye al uso correcto del tratamiento prescrito; no modifica pautas (3.5)."
      },
      "C5e": {
        prompt: "¿Qué desenlace es el más probable?",
        options: {a:"Cronicidad: la enfermedad persiste, pero se puede controlar", b:"Curación completa en una semana", c:"Curación con secuelas", d:"Muerte a corto plazo"},
        why: "La diabetes persiste mucho tiempo: cronicidad. Una secuela es una alteración estable después de curarse, no es lo mismo (3.4)."
      },
      /* ================= Fase 5 · nuevas */
      "C5n1": {
        prompt: "La doctora compara: este invierno, la gripe ha afectado de golpe a mucha gente de la oficina de Antoni en pocas semanas. ¿Cómo se clasifica esta presentación?",
        options: {a:"Esporádica", b:"Endémica", c:"Epidémica", d:"Crónica"},
        why: "Muchos casos de golpe en poco tiempo es una presentación epidémica; esporádica son casos aislados y endémica, una presencia constante en una zona. Crónica habla de duración, no de presentación (3.3)."
      },
      "C5n2": {
        prompt: "¿Qué es cierto sobre el pronóstico de Antoni? Márcalo todo.",
        options: {a:"Es un juicio anticipado sobre cómo evolucionará la enfermedad", b:"Lo da el técnico de farmacia en el mostrador", c:"Lo da el personal médico", d:"Puede cambiar, por ejemplo si aparece una complicación (un problema nuevo durante la evolución)", e:"Una vez dado, no cambia nunca", f:"Se puede expresar en grados: leve, grave, muy grave, crítico o reservado"},
        why: "El pronóstico es un juicio anticipado sobre la evolución, lo da el personal médico, tiene grados (leve, grave, muy grave, crítico, reservado) y puede cambiar, por ejemplo por una complicación (3.4, 3.5)."
      },
      "C5n3": {
        prompt: "Antoni pregunta cómo actúan los medicamentos. Clasifica cada tratamiento en local o sistémico.",
        bins: {local:"Local", sist:"Sistémico"},
        cards: {"1":"Comprimidos por vía oral, si el médico los prescribe", "2":"Una pomada para una irritación de la piel", "3":"Un colirio para los ojos", "4":"Un medicamento por vía intravenosa"},
        why: "Local: actúa donde se aplica (pomada, colirio). Sistémico: llega a todo el organismo (vía oral, intravenosa) (3.5)."
      },
      "C5n4": {
        prompt: "Un día Antoni tiene dolor de cabeza y toma el paracetamol que le indicó el médico. ¿Qué tipo de tratamiento es?",
        options: {a:"Curativo: elimina la causa de la enfermedad", b:"Paliativo: reduce el malestar en una enfermedad avanzada", c:"Sintomático: alivia las manifestaciones", d:"Específico: actúa sobre el agente que causa la enfermedad"},
        why: "El paracetamol alivia las manifestaciones (dolor, fiebre) pero no elimina la causa: es un tratamiento sintomático (3.5)."
      },
      "C5n5": {
        prompt: "La doctora dice que Antoni no necesita ninguna gastroscopia. ¿Qué quiere decir «gastroscopia»?",
        options: {a:"Extirpación del estómago", b:"Observación del interior del estómago con un endoscopio", c:"Inflamación del estómago", d:"Dolor de estómago"},
        why: "Gastr/o es el estómago y -scopia, observar: es una endoscopia del estómago. Extirpar sería -ectomía, la inflamación -itis y el dolor -algia (3.6)."
      }
    },
    tests: {
      sang:        {t:"Analítica de sangre (glucosa en ayunas)", label:"Bioquímica en ayunas", text:"Glucosa alta en ayunas: confirma la alteración metabólica."},
      orina:       {t:"Analítica de orina", label:"Analítica de orina", text:"Glucosa en la orina: positiva."},
      ecg:         {t:"Electrocardiograma (ECG)", label:"ECG", text:"Normal. Puede ser útil para el control de la tensión, pero no confirma la diabetes."},
      radiografia: {t:"Radiografía de tórax", label:"Radiografía de tórax", text:"Normal. No tiene relación con la sospecha."},
      ecografia:   {t:"Ecografía abdominal", label:"Ecografía", text:"No aporta nada para confirmar la diabetes."},
      tc:          {t:"TC (tomografía computarizada)", label:"TC", text:"Radiación ionizante sin ninguna justificación."},
      rm:          {t:"Resonancia magnética (RM)", label:"RM", text:"No hacía falta."},
      biopsia:     {t:"Biopsia", label:"Biopsia", text:"No hay ninguna lesión que estudiar: prueba invasiva innecesaria."},
      frotis:      {t:"Frotis con hisopo", label:"Frotis", text:"Sin nada que destacar. Antoni no tiene ningún exudado ni sospecha de infección: la muestra no aporta nada a la sospecha de diabetes."},
      citologia:   {t:"Citología", label:"Citología", text:"Células normales. No hay ninguna lesión que estudiar: no ayuda a confirmar una alteración metabólica."},
      eeg:         {t:"Electroencefalograma (EEG)", label:"EEG", text:"Actividad eléctrica del cerebro normal. No tiene relación con la sospecha: no hacía falta."},
      emg:         {t:"Electromiograma (EMG)", label:"EMG", text:"Actividad del músculo normal. No aporta nada para confirmar la diabetes."},
      endoscopia:  {t:"Endoscopia (gastroscopia)", label:"Endoscopia", text:"Mucosa normal. Prueba invasiva sin justificación: Antoni no tiene ningún síntoma digestivo."}
    }
  };
});

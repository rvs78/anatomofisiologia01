/* Pantalla «Què és la diabetis?»: 6 passos amb diagrames SVG animats (GSAP, pautes de moviment HyperFrames).
   Pensada per a alumnes de 15–16 anys: poques paraules, una idea per pas, dibuixos que expliquen el mecanisme. */
(function(){
  "use strict";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  const TX = {
    ca:[
      {t:"El combustible: la glucosa", p:["Quan mengem, l'aparell digestiu transforma els aliments en <b>glucosa</b>, un sucre.", "La <b>sang</b> porta la glucosa a totes les <b>cèl·lules</b>, que la fan servir com a energia, com un cotxe fa servir la benzina."], l:["Aliments","Glucosa a la sang","Cèl·lula amb energia"]},
      {t:"La clau: la insulina", p:["El <b>pàncrees</b> fabrica una hormona, la <b>insulina</b>.", "La insulina funciona com una <b>clau</b>: obre la porta de la cèl·lula perquè hi entri la glucosa."], l:["Pàncrees","Insulina = clau","La glucosa entra"]},
      {t:"Què passa en la diabetis?", p:["Si falta la clau o la clau no obre bé, la glucosa <b>no pot entrar</b> a les cèl·lules.", "Llavors s'acumula a la sang: és la <b>hiperglucèmia</b> (hiper- = molt, -èmia = a la sang). La diabetis és una malaltia <b>crònica</b>: dura tota la vida i cal controlar-la."], l:["Sang amb massa glucosa","Cèl·lula sense energia"]},
      {t:"Dos tipus principals", p:["<b>Tipus 1:</b> el pàncrees gairebé no fa insulina perquè les defenses l'ataquen. Sol començar de jove i cal injectar insulina.", "<b>Tipus 2:</b> hi ha insulina, però la porta està «rovellada» i no obre bé. És la més freqüent i s'hi suma l'estil de vida: sedentarisme, obesitat, alimentació i herència."], l:["Tipus 1: sense clau","Tipus 2: pany rovellat"]},
      {t:"Com es nota i com es descobreix", p:["Signes i símptomes: <b>molta set</b>, <b>orinar molt</b> (poliúria), <b>cansament</b> i, de vegades, visió borrosa. Al principi sovint <b>no es nota res</b>: per això són útils els <b>cribratges</b>.", "Es confirma amb proves: <b>glucosa a la sang en dejú</b> i glucosa a l'orina (glucosúria)."], l:["Set","Orinar molt","Cansament","Analítica"]},
      {t:"Tractament i paper de la farmàcia", p:["Base del tractament: <b>alimentació</b> equilibrada, <b>exercici</b> i, si cal, <b>fàrmacs o insulina</b> que receptarà el metge.", "A la farmàcia ajudem a fer servir bé el tractament, ensenyem a usar el <b>glucòmetre</b>, reforcem els hàbits saludables i <b>derivem al metge</b> si alguna cosa no va bé."], l:["Alimentació","Exercici","Medicació","Glucòmetre"]}
    ],
    es:[
      {t:"El combustible: la glucosa", p:["Cuando comemos, el aparato digestivo transforma los alimentos en <b>glucosa</b>, un azúcar.", "La <b>sangre</b> lleva la glucosa a todas las <b>células</b>, que la usan como energía, como un coche usa la gasolina."], l:["Alimentos","Glucosa en la sangre","Célula con energía"]},
      {t:"La llave: la insulina", p:["El <b>páncreas</b> fabrica una hormona, la <b>insulina</b>.", "La insulina funciona como una <b>llave</b>: abre la puerta de la célula para que entre la glucosa."], l:["Páncreas","Insulina = llave","La glucosa entra"]},
      {t:"¿Qué pasa en la diabetes?", p:["Si falta la llave o la llave no abre bien, la glucosa <b>no puede entrar</b> en las células.", "Entonces se acumula en la sangre: es la <b>hiperglucemia</b> (hiper- = mucho, -emia = en la sangre). La diabetes es una enfermedad <b>crónica</b>: dura toda la vida y hay que controlarla."], l:["Sangre con demasiada glucosa","Célula sin energía"]},
      {t:"Dos tipos principales", p:["<b>Tipo 1:</b> el páncreas casi no fabrica insulina porque las defensas lo atacan. Suele empezar en jóvenes y hay que inyectarse insulina.", "<b>Tipo 2:</b> hay insulina, pero la cerradura está «oxidada» y no abre bien. Es la más frecuente y se suma el estilo de vida: sedentarismo, obesidad, alimentación y herencia."], l:["Tipo 1: sin llave","Tipo 2: cerradura oxidada"]},
      {t:"Cómo se nota y cómo se descubre", p:["Signos y síntomas: <b>mucha sed</b>, <b>orinar mucho</b> (poliuria), <b>cansancio</b> y, a veces, visión borrosa. Al principio a menudo <b>no se nota nada</b>: por eso son útiles los <b>cribados</b>.", "Se confirma con pruebas: <b>glucosa en sangre en ayunas</b> y glucosa en la orina (glucosuria)."], l:["Sed","Orinar mucho","Cansancio","Análisis"]},
      {t:"Tratamiento y papel de la farmacia", p:["Base del tratamiento: <b>alimentación</b> equilibrada, <b>ejercicio</b> y, si hace falta, <b>fármacos o insulina</b> que recetará el médico.", "En la farmacia ayudamos a usar bien el tratamiento, enseñamos a usar el <b>glucómetro</b>, reforzamos los hábitos saludables y <b>derivamos al médico</b> si algo no va bien."], l:["Alimentación","Ejercicio","Medicación","Glucómetro"]}
    ],
    ui:{ca:{kicker:(n, m) => "Abans de començar · " + n + " de " + m, prev:"Anterior", next:"Següent", replay:"Torna a veure l'animació", go:"Comença el torn", title:"Què és la diabetis?"},
        es:{kicker:(n, m) => "Antes de empezar · " + n + " de " + m, prev:"Anterior", next:"Siguiente", replay:"Vuelve a ver la animación", go:"Empieza el turno", title:"¿Qué es la diabetes?"}}
  };

  /* peces de dibuix */
  const cell = (x, y, r, cls) => `<g class="${cls || "cell"}" transform="translate(${x} ${y})"><circle r="${r}" fill="#fde7c8" stroke="#e0a458" stroke-width="4"/><circle r="${r * .32}" fill="#e7a3d6" opacity=".8"/></g>`;
  const glu = (x, y, cls) => `<g class="glu ${cls || ""}" transform="translate(${x} ${y})"><polygon points="0,-11 10,-4 6,9 -6,9 -10,-4" fill="#f2c14e" stroke="#c99418" stroke-width="2"/></g>`;
  const key = (x, y, cls, rot) => `<g class="${cls || "key"}" transform="translate(${x} ${y}) rotate(${rot || 0})"><circle r="11" fill="none" stroke="#0e8a5f" stroke-width="6"/><path d="M11 0 H40 M30 0 V9 M37 0 V7" stroke="#0e8a5f" stroke-width="6" stroke-linecap="round"/></g>`;
  const label = (x, y, txt, anchor) => `<text x="${x}" y="${y}" class="dlbl" text-anchor="${anchor || "middle"}">${esc(txt)}</text>`;
  const vessel = (y, h) => `<rect x="40" y="${y}" width="640" height="${h}" rx="${h / 2}" fill="#f6d4dc" stroke="#d9534f" stroke-width="4"/>`;

  function art(i, L){
    const l = L.l;
    switch (i){
      case 0: return `<svg viewBox="0 0 720 300" class="dsvg" role="img" aria-label="${esc(l.join(" → "))}">
        <g class="food" transform="translate(90 120)"><ellipse rx="62" ry="20" cy="40" fill="#e3eee9" stroke="#9fb7ad" stroke-width="3"/><circle cx="-22" cy="22" r="18" fill="#d9534f"/><rect x="0" y="6" width="34" height="26" rx="6" fill="#f2b880"/><path d="M-8 10 q10 -30 22 -10" stroke="#5fae7a" stroke-width="5" fill="none"/></g>
        ${label(90, 210, l[0])}
        <path class="arrow a1" d="M170 130 H250" stroke="#4a635b" stroke-width="5" marker-end="url(#ah)" fill="none"/>
        ${vessel(95, 70)}${[0,1,2,3,4].map(k => glu(300 + k * 60, 130, "flow")).join("")}
        ${label(420, 210, l[1])}
        ${cell(620, 130, 52, "cell target")}<g class="spark" transform="translate(620 130)">${[0,1,2,3,4,5].map(k => `<path d="M0 -70 v-14" transform="rotate(${k * 60})" stroke="#f2c14e" stroke-width="5" stroke-linecap="round"/>`).join("")}</g>
        ${label(620, 220, l[2])}
        <defs><marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#4a635b"/></marker></defs></svg>`;
      case 1: return `<svg viewBox="0 0 720 300" class="dsvg" role="img" aria-label="${esc(l.join(" → "))}">
        <g class="pancreas" transform="translate(120 140)"><path d="M-80 0 C-60 -40 20 -40 60 -18 C90 -4 90 22 60 26 C20 30 -40 34 -80 0Z" fill="#f2b880" stroke="#c97d3d" stroke-width="4"/></g>
        ${label(110, 210, l[0])}
        ${key(200, 140, "key k1")}${label(250, 210, l[1])}
        ${cell(520, 140, 80, "cell")}<g class="door" transform="translate(440 140)"><rect x="-8" y="-28" width="16" height="56" rx="4" fill="#8a5a00"/></g>
        ${glu(350, 120, "g1")}${glu(360, 165, "g2")}
        ${label(520, 260, l[2])}</svg>`;
      case 2: return `<svg viewBox="0 0 720 300" class="dsvg" role="img" aria-label="${esc(l.join(", "))}">
        ${vessel(70, 110)}${Array.from({length:22}, (_, k) => glu(80 + (k * 29) % 600, 95 + (k * 37) % 70, "pile")).join("")}
        <g class="meter" transform="translate(610 40)"><rect x="-40" y="-26" width="80" height="44" rx="8" fill="#2b3442"/><text class="mtxt" x="0" y="4" text-anchor="middle" fill="#ff8a80" font-weight="700" font-size="20">180</text></g>
        ${label(360, 210, l[0])}
        ${cell(360, 260, 30, "cell sad")}<g transform="translate(360 260)"><path d="M-10 6 q10 -8 20 0" stroke="#8a5a00" stroke-width="3" fill="none"/></g>
        ${label(430, 266, l[1], "start")}</svg>`;
      case 3: return `<svg viewBox="0 0 720 300" class="dsvg" role="img" aria-label="${esc(l.join(" / "))}">
        <line x1="360" y1="20" x2="360" y2="280" stroke="#b6cac1" stroke-width="3" stroke-dasharray="8 8"/>
        <g class="t1">${cell(180, 140, 70, "cell")}<g transform="translate(100 140)"><rect x="-8" y="-28" width="16" height="56" rx="4" fill="#8a5a00"/></g>
          <g transform="translate(40 60)"><circle r="20" fill="none" stroke="#b3261e" stroke-width="5"/><path d="M-14 14 L14 -14" stroke="#b3261e" stroke-width="5"/>${key(-6, 0, "key ghost", 0)}</g>
          ${glu(50, 150, "bump1")}</g>
        ${label(180, 255, l[0])}
        <g class="t2">${cell(540, 140, 70, "cell")}<g class="rusty" transform="translate(460 140)"><rect x="-10" y="-28" width="20" height="56" rx="4" fill="#9a5b2e"/><circle cx="-3" cy="-10" r="4" fill="#c97d3d"/><circle cx="3" cy="8" r="5" fill="#c97d3d"/></g>
          ${key(400, 140, "key k2", 0)}${glu(410, 190, "bump2")}</g>
        ${label(540, 255, l[1])}</svg>`;
      case 4: return `<svg viewBox="0 0 720 300" class="dsvg" role="img" aria-label="${esc(l.join(", "))}">
        <g class="sym s1" transform="translate(110 120)"><path d="M-22 -40 h44 l-6 80 h-32z" fill="#cfe4f6" stroke="#2a5db0" stroke-width="4"/><rect x="-18" y="0" width="36" height="34" fill="#86b5f0"/></g>${label(110, 210, l[0])}
        <g class="sym s2" transform="translate(280 120)"><path d="M0 -50 C30 -10 30 30 0 40 C-30 30 -30 -10 0 -50Z" fill="#f7d774" stroke="#c99418" stroke-width="4"/></g>${label(280, 210, l[1])}
        <g class="sym s3" transform="translate(450 120)"><rect x="-34" y="-40" width="68" height="80" rx="10" fill="none" stroke="#4a635b" stroke-width="5"/><rect x="-24" y="10" width="48" height="20" fill="#d9534f"/><rect x="-6" y="-48" width="12" height="8" fill="#4a635b"/></g>${label(450, 210, l[2])}
        <g class="sym s4" transform="translate(620 120)"><rect x="-10" y="-50" width="20" height="90" rx="10" fill="#fff" stroke="#7f90b2" stroke-width="4"/><rect x="-6" y="-10" width="12" height="46" rx="6" fill="#b03a2e"/><rect x="-12" y="-58" width="24" height="12" rx="3" fill="#8e44ad"/></g>${label(620, 210, l[3])}</svg>`;
      default: return `<svg viewBox="0 0 720 300" class="dsvg" role="img" aria-label="${esc(l.join(", "))}">
        <g class="tr r1" transform="translate(110 120)"><ellipse rx="56" ry="18" cy="34" fill="#e3eee9" stroke="#9fb7ad" stroke-width="3"/><circle cx="-18" cy="16" r="16" fill="#5fae7a"/><circle cx="14" cy="18" r="14" fill="#d9534f"/><rect x="-6" y="0" width="20" height="14" rx="4" fill="#f2b880"/></g>${label(110, 210, l[0])}
        <g class="tr r2" transform="translate(280 120)"><circle cy="-40" r="14" fill="#f1c7a5"/><path d="M0 -24 L0 16 M0 16 L-22 50 M0 16 L22 46 M0 -14 L-26 4 M0 -14 L26 -24" stroke="#2a5db0" stroke-width="8" stroke-linecap="round"/></g>${label(280, 210, l[1])}
        <g class="tr r3" transform="translate(450 120)"><rect x="-40" y="-14" width="80" height="28" rx="14" fill="#fff" stroke="#0e8a5f" stroke-width="4"/><rect x="0" y="-14" width="40" height="28" rx="14" fill="#0e8a5f"/></g>${label(450, 210, l[2])}
        <g class="tr r4" transform="translate(620 120)"><rect x="-30" y="-46" width="60" height="92" rx="12" fill="#2b3442"/><rect x="-22" y="-36" width="44" height="34" rx="4" fill="#9fe3c4"/><text class="gtxt" x="0" y="-12" text-anchor="middle" font-weight="700" font-size="16" fill="#12322b">110</text><path d="M-4 46 v20" stroke="#7f90b2" stroke-width="6"/></g>${label(620, 210, l[3])}</svg>`;
    }
  }

  function view(i, lang){
    const L = TX[lang === "es" ? "es" : "ca"], U = TX.ui[lang === "es" ? "es" : "ca"], n = L.length, P = L[i];
    return `<section class="wiz dia" aria-labelledby="diaTitle">
      <ol class="dots" aria-label="${esc(U.kicker(i + 1, n))}">${L.map((_, k) => `<li class="${k < i ? "done" : k === i ? "now" : ""}"></li>`).join("")}</ol>
      <p class="muted small">${esc(U.title)} · ${esc(U.kicker(i + 1, n))}</p>
      <h1 id="diaTitle" class="ptitle" tabindex="-1">${esc(P.t)}</h1>
      <div class="diart">${art(i, P)}</div>
      ${P.p.map(x => `<p class="dtxt">${x}</p>`).join("")}
      <div class="row wnav">${i > 0 ? `<button type="button" class="btn ghost" data-act="dprev">${U.prev}</button>` : "<span></span>"}
        <button type="button" class="btn ghost small" data-act="dreplay">↻ ${U.replay}</button>
        ${i < n - 1 ? `<button type="button" class="btn" data-act="dnext">${U.next}</button>` : `<button type="button" class="btn big" data-act="shift">${U.go}</button>`}</div>
    </section>`;
  }

  /* una seqüència orquestrada per pas (només transformacions i opacitat) */
  function play(root, i, still){
    if (still || !window.gsap) return;
    const q = s => root.querySelectorAll(".dsvg " + s), tl = gsap.timeline({defaults:{ease:"power3.out"}});
    tl.from(root.querySelectorAll(".dtxt"), {autoAlpha:0, y:12, stagger:.15, duration:.5}, 0);
    if (i === 0){
      tl.from(q(".food"), {scale:.6, autoAlpha:0, transformOrigin:"50% 50%", duration:.5}, .1)
        .from(q(".arrow"), {autoAlpha:0, x:-20, duration:.4}, .5)
        .from(q(".glu.flow"), {x:-260, autoAlpha:0, stagger:.12, duration:.8}, .7)
        .from(q(".cell.target"), {scale:.8, transformOrigin:"50% 50%", duration:.5}, 1.3)
        .from(q(".spark path"), {autoAlpha:0, scale:0, transformOrigin:"50% 100%", stagger:.05, duration:.3}, 1.7);
    } else if (i === 1){
      tl.from(q(".pancreas"), {autoAlpha:0, x:-40, duration:.5}, .1)
        .from(q(".key.k1"), {x:-80, autoAlpha:0, duration:.6}, .5)
        .to(q(".key.k1"), {x:230, duration:.9, ease:"power2.inOut"}, 1.2)
        .to(q(".door"), {rotation:-80, transformOrigin:"0% 0%", duration:.4}, 2.1)
        .to(q(".g1, .g2"), {x:140, duration:.8, stagger:.1}, 2.3);
    } else if (i === 2){
      tl.from(q(".pile"), {autoAlpha:0, scale:0, transformOrigin:"50% 50%", stagger:.04, duration:.3}, .1)
        .from(q(".meter"), {autoAlpha:0, y:-20, duration:.4}, .8)
        .from(q(".cell.sad"), {scale:1.2, transformOrigin:"50% 50%", duration:.6}, 1.2);
    } else if (i === 3){
      tl.from(q(".t1"), {autoAlpha:0, x:-30, duration:.6}, .1).from(q(".t2"), {autoAlpha:0, x:30, duration:.6}, .3)
        .to(q(".bump1"), {x:20, yoyo:true, repeat:3, duration:.25}, 1)
        .to(q(".key.k2"), {x:24, duration:.5}, 1).to(q(".key.k2"), {rotation:25, yoyo:true, repeat:3, duration:.18, transformOrigin:"0% 50%"}, 1.5)
        .to(q(".bump2"), {x:20, yoyo:true, repeat:3, duration:.25}, 1.6);
    } else if (i === 4){
      tl.from(q(".sym"), {autoAlpha:0, y:30, scale:.8, transformOrigin:"50% 50%", stagger:.18, duration:.5}, .1);
    } else {
      tl.from(q(".tr"), {autoAlpha:0, y:30, stagger:.18, duration:.5}, .1).from(q(".gtxt"), {autoAlpha:0, duration:.4}, 1);
    }
  }

  window.DIABETES = {view, play, count:6, TX};
})();

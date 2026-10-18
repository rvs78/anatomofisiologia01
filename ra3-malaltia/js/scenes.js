/* Il·lustracions SVG pròpies: farmàcia en primera persona, laboratori, consulta, proves i icones */
(function(){
  "use strict";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  /* ---------- Persona (pacient), mig cos. (x,y) = centre del cap */
  function person(p, x, y, s){
    s = s || 1;
    const w = p.wide ? 1.25 : 1;
    const hair = p.hairStyle === "long"
      ? `<path d="M-34 -6 C-40 -52 40 -52 34 -6 L38 46 L22 40 L24 0 C10 -20 -10 -20 -24 0 L-22 40 L-38 46 Z" fill="${p.hair}"/>`
      : p.hairStyle === "bald"
      ? `<path d="M-31 -8 C-33 -18 -28 -24 -24 -26 L-26 -6 Z M31 -8 C33 -18 28 -24 24 -26 L26 -6 Z" fill="${p.hair}"/>`
      : `<path d="M-31 -6 C-34 -44 34 -44 31 -6 C24 -24 -24 -24 -31 -6 Z" fill="${p.hair}"/>`;
    const beard = p.beard ? `<path d="M-24 10 C-20 34 20 34 24 10 C14 22 -14 22 -24 10 Z" fill="${p.hair}" opacity=".75"/>` : "";
    const mark = p.mark ? `<circle cx="-17" cy="10" r="5.5" fill="#d79a74" stroke="#b97752" stroke-width="1.2"/>` : "";
    const cheeks = p.sex === "f" ? `<circle cx="-17" cy="8" r="6" fill="#e9877a" opacity=".55"/><circle cx="17" cy="8" r="6" fill="#e9877a" opacity=".55"/>` : "";
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M${-70*w} 150 C${-70*w} 80 ${-46*w} 52 0 52 C${46*w} 52 ${70*w} 80 ${70*w} 150 Z" fill="${p.shirt}"/>
      <path d="M-14 50 L0 70 L14 50 Z" fill="${p.skin}"/>
      <rect x="-10" y="28" width="20" height="26" fill="${p.skin}"/>
      ${p.hairStyle === "long" ? hair : ""}
      <ellipse cx="0" cy="0" rx="31" ry="36" fill="${p.skin}"/>
      ${p.hairStyle !== "long" ? hair : ""}
      ${cheeks}${mark}
      <ellipse cx="-11" cy="-3" rx="3.2" ry="4" fill="#26302c"/><ellipse cx="11" cy="-3" rx="3.2" ry="4" fill="#26302c"/>
      <path d="M-17 -11 L-6 -15 M6 -15 L17 -11" stroke="#3b2a1e" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M-9 17 C-4 13 4 13 9 17" fill="none" stroke="#7a3b2e" stroke-width="2.4" stroke-linecap="round"/>
      ${beard}
    </g>`;
  }

  /* ---------- Taulell de farmàcia en primera persona */
  function shelfRow(y, seed){
    const cols = ["#e8f1ec","#cfe4f6","#fde7c8","#f6d4dc","#d9ead3","#e4dcf3","#ffffff"];
    let out = "", x = 24, i = seed;
    while (x < 776){
      const w = 22 + (i * 7) % 26, h = 30 + (i * 11) % 22;
      out += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="2" fill="${cols[i % cols.length]}" stroke="#9fb7ad" stroke-width="1"/>`;
      if (i % 3 === 0) out += `<rect x="${x + 4}" y="${y - h + 6}" width="${w - 8}" height="5" fill="#0e8a5f" opacity=".6"/>`;
      x += w + 4; i++;
    }
    return out + `<rect x="16" y="${y}" width="768" height="7" fill="#c9b79c"/>`;
  }
  function pharmacy(p, opts){
    opts = opts || {};
    return `<svg class="scene" viewBox="0 0 800 340" role="img" aria-label="Taulell de la farmàcia vist des de darrere. ${esc(p.nom)} és davant teu.">
      <rect width="800" height="340" fill="#f4f8f6"/>
      <rect x="0" y="0" width="800" height="210" fill="#e3eee9"/>
      ${shelfRow(70, 1)}${shelfRow(140, 5)}
      <g transform="translate(690 34)"><rect x="-34" y="-30" width="68" height="68" rx="8" fill="#0b6e4b"/><path d="M-9 -22h18v13h13v18H9v13H-9V9h-13V-9h13z" fill="#7cf0b8" class="glow"/></g>
      ${person(p, 400, 150, 1.05)}
      <rect x="0" y="252" width="800" height="88" fill="#d8c7ad"/>
      <rect x="0" y="244" width="800" height="14" fill="#efe4d2"/>
      <rect x="0" y="256" width="800" height="3" fill="#b9a383"/>
      <g transform="translate(96 230)"><rect x="0" y="0" width="92" height="24" rx="4" fill="#3d4b46"/><rect x="8" y="-30" width="76" height="32" rx="4" fill="#58706a"/><rect x="14" y="-24" width="64" height="18" rx="2" fill="#9fe3c4"/></g>
      <g transform="translate(600 214)"><rect x="0" y="0" width="70" height="40" rx="3" fill="#ffffff" stroke="#9fb7ad"/><path d="M10 12h50M10 22h40M10 32h46" stroke="#9fb7ad" stroke-width="3"/></g>
      <g transform="translate(520 226)"><rect width="34" height="26" rx="3" fill="#0e8a5f"/><path d="M13 8h8v4h4v6h-4v4h-8v-4H9v-6h4z" fill="#fff"/></g>
    </svg>`;
  }
  /* Arte de la pantalla d'accés */
  function counterArt(){
    return pharmacy({nom:"Un pacient", skin:"#f1c7a5", hair:"#5b3a1e", hairStyle:"long", shirt:"#d9534f", sex:"f"});
  }

  /* ---------- Laboratori d'etiologia */
  function lab(){
    return `<svg class="scene" viewBox="0 0 800 260" role="img" aria-label="Laboratori: microscopi, tubs d'assaig i plaques de cultiu.">
      <rect width="800" height="260" fill="#eef3fb"/>
      <rect x="0" y="180" width="800" height="80" fill="#c8d3e6"/><rect x="0" y="174" width="800" height="10" fill="#e6ecf6"/>
      <g transform="translate(150 70)"><rect x="-10" y="96" width="80" height="12" rx="3" fill="#3c4a63"/><rect x="20" y="10" width="16" height="90" rx="4" fill="#5a6b8c"/><rect x="2" y="-6" width="40" height="22" rx="6" fill="#3c4a63" transform="rotate(-20 22 5)"/><circle cx="28" cy="72" r="18" fill="#7f90b2"/></g>
      <g transform="translate(330 96)">${[0,1,2,3].map(i => `<rect x="${i*26}" y="0" width="16" height="78" rx="8" fill="#ffffff" stroke="#7f90b2" stroke-width="2"/><rect x="${i*26+2}" y="${30+i*6}" width="12" height="${46-i*6}" rx="6" fill="${["#8fd3b6","#f2b880","#c7a5e6","#86b5f0"][i]}"/>`).join("")}<rect x="-8" y="70" width="112" height="12" rx="3" fill="#3c4a63"/></g>
      <g transform="translate(560 150)">${[0,1,2].map(i => `<ellipse cx="${i*70}" cy="20" rx="30" ry="10" fill="#fff" stroke="#7f90b2" stroke-width="2"/><circle cx="${i*70-8}" cy="18" r="3" fill="#e07a5f"/><circle cx="${i*70+6}" cy="21" r="2.4" fill="#e07a5f"/>`).join("")}</g>
    </svg>`;
  }

  /* ---------- Consulta mèdica amb punts per explorar */
  const SPOTS = {cap:[400,64,1], galta:[372,96,-1], gola:[400,128,-1], coll:[432,140,1], pit:[400,186,1], braç:[328,226,-1], abdomen:[400,262,1], cos:[478,232,-1], peus:[380,336,-1]};
  const SPOT_NAMES = {cap:"Cap", galta:"Galta", gola:"Gola", coll:"Coll", pit:"Pit", braç:"Braç", abdomen:"Abdomen", cos:"Tot el cos", peus:"Peus"};
  function consult(p, spots, seen){
    const w = p.wide ? 1.25 : 1;
    const spotG = spots.map(s => { const [x, y, side] = SPOTS[s]; const done = seen.includes(s);
      return `<g class="spot${done ? " seen" : ""}" data-spot="${s}" tabindex="0" role="button" aria-label="Explora: ${SPOT_NAMES[s]}${done ? " (explorat)" : ""}" transform="translate(${x} ${y})"><circle r="15" class="ring"/><circle r="6" class="dot"/><text x="${side * 20}" y="5" text-anchor="${side > 0 ? "start" : "end"}">${SPOT_NAMES[s]}</text></g>`; }).join("");
    const vb = (typeof innerWidth !== "undefined" && innerWidth < 640) ? "250 30 300 330" : "0 0 800 360";
    return `<svg class="scene" viewBox="${vb}" role="group" aria-label="Consulta mèdica. Toca els punts per explorar ${esc(p.nom)}.">
      <rect width="800" height="360" fill="#f3f6fa"/>
      <rect x="0" y="292" width="800" height="68" fill="#d6dee8"/>
      <g transform="translate(560 200)"><rect x="0" y="0" width="200" height="24" rx="6" fill="#9cc7b7"/><rect x="10" y="24" width="8" height="70" fill="#7b8a99"/><rect x="182" y="24" width="8" height="70" fill="#7b8a99"/><rect x="0" y="-14" width="56" height="16" rx="6" fill="#ffffff"/></g>
      <g transform="translate(150 120)"><circle r="26" fill="#f0c9a8"/><path d="M-26 -6 C-26 -36 26 -36 26 -6 C16 -22 -16 -22 -26 -6Z" fill="#3a2a22"/><path d="M-56 170 C-56 70 -36 40 0 40 C36 40 56 70 56 170 Z" fill="#ffffff" stroke="#c4ceda" stroke-width="2"/><path d="M-14 46 C-30 90 -8 110 10 92" fill="none" stroke="#3c4a63" stroke-width="4"/><circle cx="10" cy="92" r="7" fill="#3c4a63"/><text x="0" y="200" text-anchor="middle" class="lbl">Dra. Soler</text></g>
      <g transform="translate(400 90)">
        <ellipse cx="0" cy="0" rx="31" ry="36" fill="${p.skin}"/>
        <path d="M${-58*w} 250 L${-62*w} 60 C${-60*w} 30 ${60*w} 30 ${62*w} 60 L${58*w} 250 Z" fill="${p.shirt}" opacity=".9"/>
        <rect x="-10" y="28" width="20" height="16" fill="${p.skin}"/>
        <path d="M${-62*w} 70 L${-84*w} 190" stroke="${p.shirt}" stroke-width="22" stroke-linecap="round"/><path d="M${62*w} 70 L${84*w} 190" stroke="${p.shirt}" stroke-width="22" stroke-linecap="round"/>
        <path d="M-30 250 L-26 240 L-14 240 M30 250 L26 240 L14 240" stroke="#56606b" stroke-width="10"/>
        <rect x="-40" y="246" width="34" height="10" rx="4" fill="#3c4a63"/><rect x="6" y="246" width="34" height="10" rx="4" fill="#3c4a63"/>
        <ellipse cx="-11" cy="-3" rx="3" ry="4" fill="#26302c"/><ellipse cx="11" cy="-3" rx="3" ry="4" fill="#26302c"/><path d="M-9 17 C-4 13 4 13 9 17" fill="none" stroke="#7a3b2e" stroke-width="2.4" stroke-linecap="round"/>
        ${p.mark ? `<circle cx="-17" cy="10" r="5.5" fill="#d79a74" stroke="#b97752" stroke-width="1.2"/>` : ""}
      </g>
      ${spotG}
    </svg>`;
  }

  /* ---------- Escena de proves i de decisió */
  function testsScene(){
    return `<svg class="scene" viewBox="0 0 800 220" role="img" aria-label="Sala de proves: tubs d'analítica, un negatoscopi i un monitor.">
      <rect width="800" height="220" fill="#f1f4f8"/><rect x="0" y="170" width="800" height="50" fill="#d3dbe6"/>
      <g transform="translate(120 40)"><rect width="180" height="120" rx="6" fill="#2b3442"/><rect x="10" y="10" width="160" height="100" fill="#dfe9f5"/><path d="M90 20 v80 M60 34 C40 40 40 60 62 62 M60 50 C38 56 38 76 62 78 M120 34 C140 40 140 60 118 62 M120 50 C142 56 142 76 118 78" stroke="#7f90b2" stroke-width="4" fill="none"/></g>
      <g transform="translate(360 70)"><rect width="200" height="96" rx="8" fill="#2b3442"/><path class="ecgline" d="M10 50 H60 L70 30 L80 70 L90 20 L100 60 L110 50 H190" stroke="#7cf0b8" stroke-width="3" fill="none"/></g>
      <g transform="translate(610 92)">${[0,1,2,3].map(i => `<rect x="${i*28}" y="0" width="18" height="70" rx="9" fill="#fff" stroke="#7f90b2" stroke-width="2"/><rect x="${i*28}" y="0" width="18" height="12" rx="4" fill="${["#c0392b","#8e44ad","#f39c12","#2e86de"][i]}"/><rect x="${i*28+3}" y="${36}" width="12" height="30" rx="6" fill="${i===2?"#f7d774":"#b03a2e"}"/>`).join("")}</g>
    </svg>`;
  }
  function deskScene(p){
    return `<svg class="scene" viewBox="0 0 800 220" role="img" aria-label="Taula de la consulta amb l'informe de ${esc(p.nom)} i una recepta.">
      <rect width="800" height="220" fill="#f4f6f1"/><rect x="0" y="140" width="800" height="80" fill="#c9b79c"/><rect x="0" y="132" width="800" height="12" fill="#e3d6c1"/>
      <g transform="translate(210 40) rotate(-4)"><rect width="170" height="120" rx="4" fill="#fff" stroke="#a9b8b1"/><text x="14" y="26" class="lbl">Informe · ${esc(p.nom)}</text><path d="M14 44h140M14 60h120M14 76h136M14 92h90" stroke="#a9b8b1" stroke-width="4"/></g>
      <g transform="translate(450 46) rotate(3)"><rect width="150" height="110" rx="4" fill="#eef7ff" stroke="#8fb3d9"/><text x="14" y="28" class="lbl">Rx</text><path d="M14 46h110M14 62h90M14 78h120" stroke="#8fb3d9" stroke-width="4"/></g>
      <g transform="translate(660 70)"><rect width="24" height="70" rx="6" fill="#0e8a5f"/><rect x="2" y="-12" width="20" height="14" rx="3" fill="#ffffff" stroke="#0e8a5f"/></g>
    </svg>`;
  }

  /* ---------- Icones del laboratori de causes */
  const ICONS = {
    virus:`<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="16" fill="#e07a5f"/>${[0,45,90,135,180,225,270,315].map(a => `<g transform="rotate(${a} 32 32)"><path d="M32 16 V8" stroke="#b5523a" stroke-width="3"/><circle cx="32" cy="7" r="3.5" fill="#b5523a"/></g>`).join("")}<circle cx="27" cy="29" r="3" fill="#fff" opacity=".5"/></svg>`,
    bacteri:`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="22" width="40" height="20" rx="10" fill="#5fae7a"/><path d="M12 32 C6 30 4 36 0 34 M52 32 C58 30 60 36 64 34" stroke="#3d7a52" stroke-width="2.5" fill="none"/><circle cx="26" cy="31" r="3" fill="#3d7a52"/><circle cx="38" cy="33" r="3" fill="#3d7a52"/></svg>`,
    pollen:`<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="18" fill="#f2c14e"/>${[0,40,80,120,160,200,240,280,320].map(a => `<circle cx="${32+15*Math.cos(a*Math.PI/180)}" cy="${32+15*Math.sin(a*Math.PI/180)}" r="3" fill="#c99418"/>`).join("")}</svg>`,
    gas:`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 44 C2 34 16 24 22 30 C22 16 42 14 44 28 C56 24 62 40 50 46 Z" fill="#a9b0bc"/><path d="M18 52 h28" stroke="#7b8494" stroke-width="3" stroke-linecap="round"/></svg>`,
    multi:`<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="22" cy="24" r="12" fill="#86b5f0"/><circle cx="42" cy="24" r="12" fill="#f2b880" opacity=".9"/><circle cx="32" cy="42" r="12" fill="#8fd3b6" opacity=".9"/></svg>`
  };

  /* ---------- Resultats de proves (animats) */
  function result(viz, t){
    switch (viz){
      case "thermo": return `<svg viewBox="0 0 120 120" class="rviz"><rect x="52" y="10" width="16" height="80" rx="8" fill="#fff" stroke="#7f90b2" stroke-width="2"/><circle cx="60" cy="96" r="14" fill="#c0392b"/><rect class="grow" x="56" y="30" width="8" height="66" rx="4" fill="#c0392b"/></svg>`;
      case "swab": { const pos = /POSITIU/.test(t.result.text);
        return `<svg viewBox="0 0 160 120" class="rviz"><rect x="10" y="30" width="140" height="60" rx="12" fill="#fff" stroke="#7f90b2" stroke-width="2"/><rect x="62" y="44" width="60" height="32" rx="4" fill="#f2f4f8"/><text x="70" y="40" class="lbl">C</text><text x="104" y="40" class="lbl">T</text><rect class="pop" x="72" y="48" width="5" height="24" fill="#b03a6e"/>${pos ? `<rect class="pop d2" x="106" y="48" width="5" height="24" fill="#b03a6e"/>` : ""}<circle cx="34" cy="60" r="10" fill="#e4e8ef"/></svg>`; }
      case "xray": return `<svg viewBox="0 0 160 120" class="rviz"><rect width="160" height="120" rx="6" fill="#141a22"/><g class="fadein" stroke="#cfe0f2" stroke-width="3" fill="none"><path d="M80 12 V108"/>${[0,1,2,3,4].map(i => `<path d="M76 ${24+i*16} C${44-i*2} ${26+i*16} ${36-i*2} ${44+i*16} 74 ${42+i*16}"/><path d="M84 ${24+i*16} C${116+i*2} ${26+i*16} ${124+i*2} ${44+i*16} 86 ${42+i*16}"/>`).join("")}</g></svg>`;
      case "ecg": return `<svg viewBox="0 0 160 120" class="rviz"><rect width="160" height="120" rx="6" fill="#0f2a22"/><path class="draw" d="M0 64 H30 L36 50 L42 76 L48 30 L54 70 L60 64 H90 L96 50 L102 76 L108 30 L114 70 L120 64 H160" stroke="#7cf0b8" stroke-width="2.5" fill="none"/></svg>`;
      case "micro": { const bad = /alterades/.test(t.result.text);
        return `<svg viewBox="0 0 120 120" class="rviz"><circle cx="60" cy="60" r="54" fill="#f6e9f3" stroke="#7f90b2" stroke-width="3"/>${[[38,40],[66,34],[86,58],[44,70],[70,82],[30,92],[92,88],[58,56]].map(([x,y],i) => `<g class="pop" style="animation-delay:${i*60}ms"><ellipse cx="${x}" cy="${y}" rx="${bad && i%3===0 ? 12 : 9}" ry="${bad && i%3===0 ? 9 : 7}" fill="#e3b5d6"/><circle cx="${x}" cy="${y}" r="${bad && i%3===0 ? 6 : 3}" fill="#8e3f7a"/></g>`).join("")}</svg>`; }
      case "echo": return `<svg viewBox="0 0 160 120" class="rviz"><rect width="160" height="120" rx="6" fill="#111"/><path d="M80 8 L20 110 A70 70 0 0 0 140 110 Z" fill="#2d2d2d"/><ellipse class="fadein" cx="84" cy="74" rx="14" ry="10" fill="#9a9a9a"/></svg>`;
      case "scan": return `<svg viewBox="0 0 160 120" class="rviz"><rect width="160" height="120" rx="6" fill="#141a22"/><ellipse class="fadein" cx="80" cy="60" rx="54" ry="42" fill="#3a4555"/><ellipse cx="80" cy="60" rx="36" ry="26" fill="#56647a"/></svg>`;
      case "scope": return `<svg viewBox="0 0 160 120" class="rviz"><rect width="160" height="120" rx="6" fill="#2a1414"/><circle class="fadein" cx="80" cy="60" r="44" fill="#d98a7e"/><circle cx="80" cy="60" r="16" fill="#8f3f35"/></svg>`;
      case "bars": {
        const bars = t.bars || [];
        return `<svg viewBox="0 0 220 ${30 + bars.length * 48}" class="rviz wide" role="img" aria-label="${esc(bars.map(b => b.t + ": " + b.v + " " + b.u + ", referència " + b.lo + "–" + b.hi).join(". "))}">${bars.map((b, i) => {
          const max = Math.max(b.hi * 1.6, b.v * 1.1), X = v => 10 + 200 * v / max, y = 20 + i * 48, hi = b.v > b.hi || b.v < b.lo;
          return `<text x="10" y="${y}" class="lbl">${esc(b.t)}</text><rect x="10" y="${y + 8}" width="200" height="16" rx="8" fill="#e7ecf2"/><rect x="${X(b.lo)}" y="${y + 8}" width="${X(b.hi) - X(b.lo)}" height="16" fill="#b9e3cc"/><rect class="growx" x="10" y="${y + 12}" width="${X(b.v) - 10}" height="8" rx="4" fill="${hi ? "#c0392b" : "#2e7d4f"}"/><text x="210" y="${y}" text-anchor="end" class="lbl">${b.v} ${esc(b.u)}</text>`;
        }).join("")}</svg>`;
      }
    }
    return "";
  }

  window.SCENES = {person, pharmacy, counterArt, lab, consult, testsScene, deskScene, ICONS, result, SPOT_NAMES};
})();

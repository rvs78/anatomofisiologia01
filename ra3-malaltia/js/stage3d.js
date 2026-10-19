/* Escenes 3D (three.js r147) que es poden girar, apropar i tocar.
   Si el navegador no té WebGL, app.js mostra les il·lustracions SVG de scenes.js. */
(function(){
  "use strict";
  const T = window.THREE;
  if (T && T.ColorManagement) T.ColorManagement.legacyMode = false;   // colors hex en sRGB: tons fidels, no rentats
  const reduce = () => document.documentElement.dataset.motion === "off" || matchMedia("(prefers-reduced-motion: reduce)").matches;
  function supported(){
    if (!T) return false;
    try { const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); } catch(e){ return false; }
  }

  /* ---------- Peces bàsiques */
  const mat = (color, o) => new T.MeshStandardMaterial(Object.assign({color, roughness:.75, metalness:0}, o || {}));
  function mesh(geo, m, x, y, z, cast){ const me = new T.Mesh(geo, m); me.position.set(x || 0, y || 0, z || 0); me.castShadow = cast !== false; me.receiveShadow = true; return me; }
  const box = (w, h, d) => new T.BoxGeometry(w, h, d);
  function canvasTex(w, h, draw){
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d"); draw(g, w, h);
    const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4; t.userData = {canvas:c, ctx:g, draw}; return t;
  }
  /* imatges generades (img/*.webp): es carreguen sense bloquejar i es redibuixa quan arriben */
  const IMG_V = "?v=8";
  function imgTex(url, onload){ const t = new T.TextureLoader().load(url + IMG_V, onload); t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t; }
  function poster(ctx, url, w, h, x, y, z, rotY){
    const {scene, mesh, box, mat} = ctx, g = new T.Group(); g.position.set(x, y, z); g.rotation.y = rotY || 0;
    g.add(mesh(box(w + .06, h + .06, .03), mat("#f7f5f0", {roughness:.6}), 0, 0, 0, false));
    g.add(mesh(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial({map:ctx.imgTex(url), roughness:.55}), 0, 0, .017, false));
    scene.add(g); return g;
  }
  function labelBox(w, h, d, color, text, sub){
    const tex = canvasTex(256, 160, (g, W, H) => {
      g.fillStyle = color; g.fillRect(0, 0, W, H);
      g.fillStyle = "rgba(255,255,255,.92)"; g.fillRect(0, H * .52, W, H * .48);
      g.fillStyle = "#12322b"; g.font = "bold 30px sans-serif"; g.fillText(text, 14, H * .72);
      if (sub){ g.font = "22px sans-serif"; g.fillStyle = "#4a635b"; g.fillText(sub, 14, H * .92); }
      g.fillStyle = "rgba(255,255,255,.85)"; g.fillRect(14, 16, 26, 26);
    });
    const side = mat(color), front = new T.MeshStandardMaterial({map:tex, roughness:.6});
    return new T.Mesh(box(w, h, d), [side, side, side, side, front, side]);
  }

  /* ---------- Persona (pacient o doctora) */
  function person(p, opt){
    opt = opt || {};
    const g = new T.Group(), w = p.wide ? 1.25 : 1;
    const skin = mat(p.skin, {roughness:.6}), shirt = mat(p.shirt, {roughness:.85}), hair = mat(p.hair, {roughness:.9});
    const pants = mat(opt.coat ? "#3c4a63" : "#33405a"), shoe = mat("#2b2f36", {roughness:.5});
    const head = new T.Group(); head.position.set(0, 1.6, 0); g.add(head);
    head.add(mesh(new T.SphereGeometry(.11, 32, 24), skin, 0, 0, 0));
    head.children[0].scale.set(.92, 1.08, .95);
    // cabell
    if (p.hairStyle === "bald"){
      [-1, 1].forEach(s => head.add(mesh(new T.SphereGeometry(.05, 16, 12), hair, s * .085, -.01, -.03)));
    } else {
      const cap = mesh(new T.SphereGeometry(.118, 32, 16, 0, Math.PI * 2, 0, Math.PI * .5), hair, 0, .012, -.008); cap.rotation.x = -.25; head.add(cap);
      if (p.hairStyle === "long"){ const back = mesh(new T.CapsuleGeometry(.1, .18, 6, 16), hair, 0, -.1, -.06); back.scale.z = .55; head.add(back); }
    }
    // cara: ulls, celles i boca preocupada
    const dark = mat("#26302c", {roughness:.3});
    [-1, 1].forEach(s => {
      head.add(mesh(new T.SphereGeometry(.017, 16, 12), mat("#fbfbf8", {roughness:.2}), s * .038, .012, .092, false));
      head.add(mesh(new T.SphereGeometry(.01, 12, 8), mat(p.eyes || "#5b3a1e", {roughness:.2}), s * .038, .012, .106, false));
      head.add(mesh(new T.SphereGeometry(.005, 8, 6), dark, s * .038, .012, .114, false));
      const ear = mesh(new T.SphereGeometry(.026, 12, 10), skin, s * .1, 0, 0, false); ear.scale.set(.45, 1, .8); head.add(ear);
      const brow = mesh(box(.04, .007, .008), mat(p.hair), s * .04, .045, .1, false); brow.rotation.z = s * .22; head.add(brow);
    });
    const nose = mesh(new T.SphereGeometry(.018, 12, 10), skin, 0, -.018, .108, false); nose.scale.set(.8, 1.1, 1); head.add(nose);
    const mouth = mesh(new T.TorusGeometry(.024, .005, 6, 16, Math.PI), mat("#8a3b2e"), 0, opt.smile ? -.04 : -.05, .1, false); if (opt.smile) mouth.rotation.z = Math.PI; head.add(mouth);
    if (p.sex === "f") [-1, 1].forEach(s => { const ch = mesh(new T.SphereGeometry(.02, 12, 8), mat("#e9877a", {transparent:true, opacity:.55}), s * .062, -.02, .085, false); ch.scale.z = .4; head.add(ch); });
    if (p.beard){ const b = mesh(new T.SphereGeometry(.1, 24, 12, 0, Math.PI * 2, Math.PI * .55, Math.PI * .45), mat(p.hair, {roughness:.95}), 0, -.005, .012); head.add(b); }
    if (p.mark){ const m = mesh(new T.SphereGeometry(.018, 16, 12), mat("#c98a64", {roughness:.5}), -.07, -.025, .075); head.add(m); g.userData.mark = m; }
    // coll, tronc i braços
    g.add(mesh(new T.CylinderGeometry(.045, .05, .1, 16), skin, 0, 1.47, 0));
    const chest = new T.Group(); chest.position.y = 1.2; g.add(chest);
    const torso = mesh(new T.CapsuleGeometry(.17 * w, .36, 8, 24), opt.coat ? mat("#f4f6f8", {roughness:.8}) : shirt, 0, 0, 0); torso.scale.z = .62; chest.add(torso);
    if (opt.coat){ const steth = mesh(new T.TorusGeometry(.09, .008, 8, 24, Math.PI * 1.2), mat("#3c4a63", {metalness:.4, roughness:.4}), 0, .16, .1); steth.rotation.z = Math.PI * .9; chest.add(steth); }
    [-1, 1].forEach(s => {
      chest.add(mesh(new T.SphereGeometry(.07, 16, 12), opt.coat ? mat("#f4f6f8") : shirt, s * (.15 * w + .02), .2, 0));
      const arm = mesh(new T.CapsuleGeometry(.048, .44, 6, 12), opt.coat ? mat("#f4f6f8") : shirt, s * (.17 * w + .045), -.04, 0); arm.rotation.z = s * .1; chest.add(arm);
      chest.add(mesh(new T.SphereGeometry(.043, 12, 10), skin, s * (.17 * w + .07), -.31, 0));
    });
    if (opt.full){
      [-1, 1].forEach(s => {
        g.add(mesh(new T.CapsuleGeometry(.065, .66, 6, 12), pants, s * .085, .5, 0));
        g.add(mesh(box(.1, .06, .2), shoe, s * .085, .03, .04));
      });
    }
    g.userData.head = head; g.userData.chest = chest;
    return g;
  }

  /* ---------- Models d'agents (laboratori) */
  function agent(id){
    const g = new T.Group();
    if (id === "virus"){
      const core = mesh(new T.IcosahedronGeometry(.07, 2), mat("#e07a5f", {roughness:.45})); g.add(core);
      const pos = new T.IcosahedronGeometry(.07, 1).attributes.position, seen = new Set();
      for (let i = 0; i < pos.count; i++){
        const v = new T.Vector3().fromBufferAttribute(pos, i), k = v.toArray().map(n => n.toFixed(3)).join(); if (seen.has(k)) continue; seen.add(k);
        const dir = v.clone().normalize(), stalk = mesh(new T.CylinderGeometry(.004, .004, .03, 6), mat("#b5523a"), 0, 0, 0, false);
        stalk.position.copy(dir.clone().multiplyScalar(.083)); stalk.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir); g.add(stalk);
        const tip = mesh(new T.SphereGeometry(.009, 8, 6), mat("#b5523a"), 0, 0, 0, false); tip.position.copy(dir.multiplyScalar(.1)); g.add(tip);
      }
    } else if (id === "bacteri"){
      const b = mesh(new T.CapsuleGeometry(.04, .1, 8, 16), mat("#5fae7a", {roughness:.5})); b.rotation.z = Math.PI / 2; g.add(b);
      for (let i = 0; i < 3; i++){
        const curve = new T.CatmullRomCurve3([new T.Vector3(.09, 0, 0), new T.Vector3(.13, .02 * (i - 1) + .02, .02), new T.Vector3(.17, .02 * (i - 1) - .02, -.02), new T.Vector3(.21, .03 * (i - 1), 0)]);
        g.add(mesh(new T.TubeGeometry(curve, 20, .003, 6), mat("#3d7a52"), 0, 0, 0, false));
      }
    } else if (id === "pollen"){
      g.add(mesh(new T.SphereGeometry(.07, 24, 16), mat("#f2c14e", {roughness:.8})));
      for (let i = 0; i < 40; i++){
        const phi = Math.acos(1 - 2 * (i + .5) / 40), th = Math.PI * (1 + Math.sqrt(5)) * i;
        const dir = new T.Vector3(Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th));
        const sp = mesh(new T.ConeGeometry(.008, .025, 6), mat("#c99418"), 0, 0, 0, false); sp.position.copy(dir.clone().multiplyScalar(.075)); sp.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir); g.add(sp);
      }
    } else if (id === "gas"){
      [[0, 0, 0, .07], [.06, .02, .01, .05], [-.06, .015, -.01, .055], [.01, .06, 0, .045]].forEach(([x, y, z, r]) => g.add(mesh(new T.SphereGeometry(r, 20, 14), mat("#a9b0bc", {transparent:true, opacity:.6, roughness:1}), x, y, z, false)));
    } else {
      [["#86b5f0", -.04, .03], ["#f2b880", .04, .03], ["#8fd3b6", 0, -.035]].forEach(([c, x, y]) => g.add(mesh(new T.SphereGeometry(.05, 20, 14), mat(c, {transparent:true, opacity:.85}), x, y, 0)));
    }
    return g;
  }

  /* ---------- Escenari genèric: càmera, controls, etiquetes i bucle */
  function createStage(container, cfg){
    const el = document.createElement("div"); el.className = "stage3d";
    el.innerHTML = `<div class="stage-canvas"></div><div class="stage-labels"></div>
      <div class="stage-ctrl" role="group" aria-label="Controls de l'escena 3D">
        <button type="button" class="sc" data-c="left" aria-label="Gira a l'esquerra">⟲</button>
        <button type="button" class="sc" data-c="right" aria-label="Gira a la dreta">⟳</button>
        <button type="button" class="sc" data-c="in" aria-label="Apropa">+</button>
        <button type="button" class="sc" data-c="out" aria-label="Allunya">−</button>
        <button type="button" class="sc" data-c="center" aria-label="Centra la vista">◎</button>
      </div><p class="stage-hint">${cfg.hint}</p>`;
    container.appendChild(el);
    const holder = el.querySelector(".stage-canvas"), labelsEl = el.querySelector(".stage-labels");
    const renderer = new T.WebGLRenderer({antialias:true, powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.outputEncoding = T.sRGBEncoding; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = .82;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    const cv = renderer.domElement; cv.tabIndex = 0; cv.setAttribute("role", "img"); cv.setAttribute("aria-label", cfg.label);
    holder.appendChild(cv);
    const scene = new T.Scene(); scene.background = new T.Color(cfg.bg || "#e9f0ec"); scene.fog = new T.Fog(cfg.bg || "#e9f0ec", 7, 16);
    const camera = new T.PerspectiveCamera(cfg.fov || 45, 2, .05, 50);
    if (T.RoomEnvironment){ const pm = new T.PMREMGenerator(renderer); scene.environment = pm.fromScene(new T.RoomEnvironment(), .04).texture; pm.dispose(); }
    scene.add(new T.HemisphereLight("#ffffff", "#b9a383", T.RoomEnvironment ? .25 : .9));
    const sun = new T.DirectionalLight("#fff6e8", T.RoomEnvironment ? .75 : .9); sun.position.set(2.5, 4, 3); sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, {left:-4, right:4, top:4, bottom:-4, near:.5, far:12}); sun.shadow.bias = -.0005; scene.add(sun);

    const C = Object.assign({mode:"orbit", target:[0, 1, 0], yaw:0, pitch:.2, dist:3, minYaw:-Infinity, maxYaw:Infinity, minPitch:-.2, maxPitch:1.1, minDist:1, maxDist:5}, cfg.camera);
    const home = {yaw:C.yaw, pitch:C.pitch, dist:C.dist};
    const cur = Object.assign({}, home), tgt = Object.assign({}, home);
    const target = new T.Vector3(...C.target);
    const clamp = () => { tgt.yaw = Math.min(C.maxYaw, Math.max(C.minYaw, tgt.yaw)); tgt.pitch = Math.min(C.maxPitch, Math.max(C.minPitch, tgt.pitch)); tgt.dist = Math.min(C.maxDist, Math.max(C.minDist, tgt.dist)); };
    function place(){
      if (C.mode === "look"){
        camera.position.set(...C.eye);
        camera.fov = cur.dist; camera.updateProjectionMatrix();
        camera.rotation.order = "YXZ"; camera.rotation.set(cur.pitch, cur.yaw, 0);
      } else {
        camera.position.set(target.x + cur.dist * Math.cos(cur.pitch) * Math.sin(cur.yaw), target.y + cur.dist * Math.sin(cur.pitch), target.z + cur.dist * Math.cos(cur.pitch) * Math.cos(cur.yaw));
        camera.lookAt(target);
      }
    }
    const ctx = {scene, camera, renderer, T, mat, mesh, box, person, agent, labelBox, canvasTex, reduce, imgTex:url => imgTex(url, () => { dirty = true; })};
    const built = cfg.build(ctx);
    const pickables = built.pickables || [];

    /* etiquetes HTML sobre punts 3D (clicables, accessibles) */
    let labels = [];
    function setLabels(list){
      labelsEl.innerHTML = ""; labels = (list || []).map(l => {
        const b = document.createElement(l.onClick ? "button" : "span"); b.className = "s3lbl " + (l.cls || ""); b.textContent = l.text;
        if (l.onClick){ b.type = "button"; b.onclick = e => { e.stopPropagation(); l.onClick(); }; }
        labelsEl.appendChild(b); return Object.assign({}, l, {el:b});
      });
    }
    setLabels(built.labels);
    const v3 = new T.Vector3();
    function placeLabels(){
      const w = holder.clientWidth, h = holder.clientHeight, occZ = built.occluder ? built.occluder.clone().applyMatrix4(camera.matrixWorldInverse).z : 0;
      labels.forEach(l => {
        l.obj.getWorldPosition(v3); const behind = built.occluder && v3.clone().applyMatrix4(camera.matrixWorldInverse).z < occZ - .06;   // darrere del cos (profunditat de càmera)
        v3.project(camera);
        const off = v3.z > 1 || behind || Math.abs(v3.x) > 1.05 || Math.abs(v3.y) > 1.05;
        const ox = l.side === "left" ? "calc(-100% - 14px)" : l.side === "right" ? "14px" : "-50%", oy = l.side ? "-50%" : l.above ? "-140%" : "40%";
        l.el.style.transform = `translate(${(v3.x + 1) / 2 * w}px, ${(1 - v3.y) / 2 * h}px) translate(${ox}, ${oy})`;
        l.el.classList.toggle("off", off); if (l.onClick) l.el.tabIndex = off ? -1 : 0;
      });
    }

    /* controls: arrossegar, roda, pessic, tecles i botons */
    const pts = new Map(); let dragged = 0, pinch0 = 0, dist0 = 0;
    const rotK = C.mode === "look" ? .0035 : .008;
    cv.addEventListener("pointerdown", e => { cv.setPointerCapture(e.pointerId); pts.set(e.pointerId, {x:e.clientX, y:e.clientY}); dragged = 0;
      if (pts.size === 2){ const [a, b] = [...pts.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); dist0 = tgt.dist; } });
    cv.addEventListener("pointermove", e => { const p = pts.get(e.pointerId); if (!p) return;
      if (pts.size === 2){ p.x = e.clientX; p.y = e.clientY; const [a, b] = [...pts.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (pinch0) { tgt.dist = dist0 * pinch0 / d; clamp(); } dragged = 99; return; }
      const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY; dragged += Math.abs(dx) + Math.abs(dy);
      tgt.yaw += (C.mode === "look" ? 1 : -1) * dx * rotK; tgt.pitch += (C.mode === "look" ? 1 : 1) * dy * rotK * (C.mode === "look" ? 1 : .8); clamp(); });
    const up = e => { const was = pts.has(e.pointerId); pts.delete(e.pointerId); if (pts.size < 2) pinch0 = 0; if (was && dragged < 6 && e.type === "pointerup") pick(e); };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    cv.addEventListener("wheel", e => { e.preventDefault(); tgt.dist *= e.deltaY > 0 ? 1.1 : .9; clamp(); }, {passive:false});
    cv.addEventListener("keydown", e => {
      const k = {ArrowLeft:["yaw", C.mode === "look" ? .12 : -.25], ArrowRight:["yaw", C.mode === "look" ? -.12 : .25], ArrowUp:["pitch", .08], ArrowDown:["pitch", -.08]}[e.key];
      if (k){ e.preventDefault(); tgt[k[0]] += k[1]; clamp(); }
      if (e.key === "+" || e.key === "="){ tgt.dist *= .9; clamp(); } if (e.key === "-"){ tgt.dist *= 1.1; clamp(); }
    });
    el.querySelector(".stage-ctrl").addEventListener("click", e => {
      const c = e.target.closest("[data-c]"); if (!c) return; const a = c.dataset.c, step = C.mode === "look" ? .25 : .5;
      if (a === "left") tgt.yaw += C.mode === "look" ? step : -step; if (a === "right") tgt.yaw -= C.mode === "look" ? step : -step;
      if (a === "in") tgt.dist *= .85; if (a === "out") tgt.dist *= 1.18; if (a === "center") Object.assign(tgt, home); clamp();
    });
    const ray = new T.Raycaster(), ndc = new T.Vector2();
    function pick(e){
      if (!pickables.length || !built.onPick) return;
      const r = cv.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
      ray.setFromCamera(ndc, camera); const hit = ray.intersectObjects(pickables, true)[0];
      if (hit){ let o = hit.object; while (o && !o.userData.pickId) o = o.parent; if (o) built.onPick(o.userData.pickId); }
    }

    /* mida i bucle */
    let dirty = true;   // sense moviment automàtic només es redibuixa quan canvia alguna cosa
    function resize(){ dirty = true; const w = holder.clientWidth || 600, h = holder.clientHeight || 300; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
    const ro = new ResizeObserver(resize); ro.observe(holder); resize();
    let raf = 0, alive = true; const t0 = performance.now();
    function frame(now){
      if (!alive) return; raf = requestAnimationFrame(frame);
      if (document.hidden || !el.isConnected) return;
      const dt = Math.min(.25, (now - (frame.last || now)) / 1000); frame.last = now;
      const still = reduce(), k = still ? 1 : 1 - Math.exp(-dt * 9);   // suavitzat per temps: igual en ordinadors lents
      const moving = Math.abs(tgt.yaw - cur.yaw) + Math.abs(tgt.pitch - cur.pitch) + Math.abs(tgt.dist - cur.dist) > 1e-4;
      if (still && !moving && !dirty) return;
      dirty = false;
      cur.yaw += (tgt.yaw - cur.yaw) * k; cur.pitch += (tgt.pitch - cur.pitch) * k; cur.dist += (tgt.dist - cur.dist) * k;
      place(); if (built.tick && !still) built.tick((now - t0) / 1000);
      renderer.render(scene, camera); placeLabels();
      el.dataset.yaw = cur.yaw.toFixed(3); el.dataset.dist = cur.dist.toFixed(3);
    }
    const onTick = () => { if (gsap.globalTimeline.getChildren(false, true, false).length) dirty = true; };
    if (window.gsap) gsap.ticker.add(onTick);
    raf = requestAnimationFrame(frame);
    return {
      el,
      update(opts){ dirty = true; if (built.update) { const l = built.update(opts); if (l) setLabels(l); } },
      dispose(){ alive = false; cancelAnimationFrame(raf); ro.disconnect(); if (window.gsap) gsap.ticker.remove(onTick); scene.traverse(o => { if (o.geometry) o.geometry.dispose(); [].concat(o.material || []).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); }); renderer.dispose(); renderer.forceContextLoss(); el.remove(); }
    };
  }

  /* ---------- Sala comuna: terra i parets */
  function room(ctx, o){
    const {scene, mesh, box, mat} = ctx;
    const tiles = ctx.canvasTex(512, 512, (g, W, H) => { g.fillStyle = o.floor || "#d9c8ad"; g.fillRect(0, 0, W, H);
      for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++){ g.fillStyle = `rgba(255,255,255,${((x * 7 + y * 3) % 5) * .018})`; g.fillRect(x * 128 + 3, y * 128 + 3, 122, 122); }
      g.strokeStyle = "rgba(0,0,0,.12)"; g.lineWidth = 4; for (let k = 0; k <= 4; k++){ g.beginPath(); g.moveTo(k * 128, 0); g.lineTo(k * 128, H); g.stroke(); g.beginPath(); g.moveTo(0, k * 128); g.lineTo(W, k * 128); g.stroke(); } });
    tiles.wrapS = tiles.wrapT = T.RepeatWrapping; tiles.repeat.set(10, 10);
    const floor = mesh(new T.PlaneGeometry(14, 14), new T.MeshStandardMaterial({map:tiles, roughness:.35, metalness:0}), 0, 0, 0, false); floor.rotation.x = -Math.PI / 2; scene.add(floor);
    const ceil = mesh(new T.PlaneGeometry(14, 14), mat("#f6f8f7"), 0, 3.2, 0, false); ceil.rotation.x = Math.PI / 2; scene.add(ceil);
    [[-1.6, -1], [1.6, -1], [-1.6, 1.2], [1.6, 1.2]].forEach(([x, z]) => scene.add(mesh(box(1.1, .03, .5), new T.MeshStandardMaterial({color:"#ffffff", emissive:"#fffbe8", emissiveIntensity:1.2}), x, 3.18, z, false)));
    scene.add(mesh(box(14, 4, .1), mat(o.wall || "#e3eee9"), 0, 2, o.back || -3.2, false));
    [-1, 1].forEach(s => scene.add(mesh(box(.1, 4, 8), mat(o.wall || "#e3eee9"), s * (o.side || 4.5), 2, 0, false)));
  }

  /* ---------- 1 · Taulell de farmàcia en primera persona */
  function pharmacy(container, opts){
    return createStage(container, {
      label:"Oficina de farmàcia vista des de darrere del taulell. " + opts.patient.nom + " és davant teu.",
      hint:"Arrossega per mirar al voltant · roda o pessic per apropar",
      camera:{mode:"look", eye:[0, 1.62, 1.25], yaw:0, pitch:-.2, dist:56, minYaw:-.85, maxYaw:.85, minPitch:-.35, maxPitch:.25, minDist:28, maxDist:62},
      build(ctx){
        const {scene, mesh, box, mat, labelBox} = ctx;
        room(ctx, {floor:"#cdb894", wall:"#e6efe9", back:-3.4});
        // prestatgeries de parafarmàcia amb caixes etiquetades
        const brands = [["#d9534f","Ibuprofèn","400 mg"],["#2a5db0","Paracetamol","1 g"],["#0e8a5f","Crema solar","SPF 50"],["#8a3b78","Xarop tos","200 ml"],["#f2b880","Vitamina C","1000 mg"],["#5fae7a","Sèrum fisiol.","5 ml"],["#e07a5f","Pastilles gola","mel i llimona"],["#86b5f0","Termòmetre","digital"]];
        for (let row = 0; row < 4; row++){
          const y = .55 + row * .48;
          scene.add(mesh(box(6.4, .03, .38), mat("#c9b79c"), 0, y - .02, -3.15));
          for (let i = 0; i < 18; i++){
            const b = brands[(i * 3 + row * 5) % brands.length], hgt = .2 + ((i * 7 + row) % 4) * .04;
            const m = labelBox(.26, hgt, .16, b[0], b[1], b[2]); m.position.set(-3 + i * .35, y + hgt / 2, -3.1); m.castShadow = true; scene.add(m);
          }
        }
        // rètol, aparador amb llum de carrer, plantes i flascons
        const sign = ctx.canvasTex(512, 96, (g, W, H) => { g.fillStyle = "#0b6e4b"; g.fillRect(0, 0, W, H); g.fillStyle = "#ffffff"; g.font = "bold 58px sans-serif"; g.textAlign = "center"; g.fillText(opts.signText || "FARMÀCIA", W / 2, 70); });
        scene.add(mesh(new T.PlaneGeometry(2.2, .42), new T.MeshStandardMaterial({map:sign, emissive:"#ffffff", emissiveMap:sign, emissiveIntensity:.35}), -.6, 2.72, -3.13, false));
        const street = ctx.imgTex("img/street.webp");
        [-1, 1].forEach(sd => { const w = mesh(new T.PlaneGeometry(2.4, 2.1), new T.MeshBasicMaterial({map:street}), sd * 4.44, 1.45, -1.2, false); w.rotation.y = -sd * Math.PI / 2; scene.add(w);
          scene.add(mesh(box(.06, 2.2, 2.5), new T.MeshStandardMaterial({color:"#dff3ff", transparent:true, opacity:.18, roughness:.05, metalness:.1}), sd * 4.4, 1.45, -1.2, false)); });
        const plant = (x, z) => { const pl = new T.Group(); pl.position.set(x, 0, z);
          pl.add(mesh(new T.CylinderGeometry(.18, .14, .36, 20), mat("#c97d3d", {roughness:.7}), 0, .18, 0));
          [[0, .6, 0, .2], [.12, .5, .06, .15], [-.12, .52, -.04, .16], [0, .78, .05, .13]].forEach(([a, b, c, r]) => pl.add(mesh(new T.SphereGeometry(r, 16, 12), mat("#4f9a5b", {roughness:.8}), a, b, c)));
          scene.add(pl); };
        plant(-3.6, -2.6); plant(3.6, -2.6);
        poster(ctx, "img/poster-salut.webp", .42, 1.34, -4.43, 1.6, -2.85, Math.PI / 2);
        for (let i = 0; i < 9; i++){ const bt = mesh(new T.CylinderGeometry(.045, .05, .2, 16), new T.MeshStandardMaterial({color:["#8fd3b6", "#f2b880", "#c7a5e6", "#86b5f0"][i % 4], roughness:.15, metalness:0, transparent:true, opacity:.9}), -3 + i * .7, 2.47, -3.1); scene.add(bt); }
        // creu verda lluminosa
        const cross = new T.Group(); cross.position.set(2.3, 2.3, -3.12);
        const crossMat = new T.MeshStandardMaterial({color:"#2bd67b", emissive:"#2bd67b", emissiveIntensity:1.4});
        cross.add(mesh(box(.5, .16, .05), crossMat, 0, 0, 0, false), mesh(box(.16, .5, .05), crossMat, 0, 0, 0, false));
        scene.add(cross); const glow = new T.PointLight("#2bd67b", 1.2, 3); glow.position.set(2.3, 2.3, -2.9); scene.add(glow);
        // taulell (primer pla)
        scene.add(mesh(box(3.6, 1, .7), mat("#b8a07f", {roughness:.6}), 0, .5, .55));
        scene.add(mesh(box(3.7, .05, .8), mat("#efe4d2", {roughness:.35}), 0, 1.02, .55));
        const term = new T.Group(); term.position.set(-.9, 1.05, .55);
        term.add(mesh(box(.4, .08, .3), mat("#3d4b46"), 0, .04, 0), mesh(box(.36, .22, .03), mat("#3d4b46"), 0, .2, -.1));
        term.add(mesh(box(.32, .17, .01), new T.MeshStandardMaterial({color:"#9fe3c4", emissive:"#4fbf8f", emissiveIntensity:.6}), 0, .2, -.083, false));
        scene.add(term);
        const card = mesh(box(.12, .04, .2), mat("#0e8a5f"), .8, 1.07, .45); scene.add(card);
        const leaf = mesh(box(.3, .01, .22), mat("#ffffff"), .35, 1.05, .6); leaf.rotation.y = .3; scene.add(leaf);
        // pacient
        const pat = person(opts.patient, {full:true}); pat.position.set(0, 0, -.45); scene.add(pat);
        const head = pat.userData.head, chest = pat.userData.chest;
        let lastSay = opts.say;
        return {
          tick(t){ chest.scale.y = 1 + Math.sin(t * 1.6) * .012; head.rotation.y = Math.sin(t * .5) * .06; crossMat.emissiveIntensity = 1.2 + Math.sin(t * 2) * .3; },
          update(o){ if (o.say !== lastSay){ lastSay = o.say; if (window.gsap && !reduce()) gsap.fromTo(head.rotation, {x:0}, {x:.18, duration:.25, yoyo:true, repeat:3, ease:"sine.inOut"}); } }
        };
      }
    });
  }

  /* ---------- 2 · Laboratori d'etiologia */
  const AGENT_NAMES = {virus:"Virus", bacteri:"Bacteri", pollen:"Pol·len", gas:"Gas irritant", multi:"Diverses causes"};
  function lab(container, opts){
    return createStage(container, {
      label:"Laboratori d'etiologia amb models 3D dels agents. Toca un model per triar-lo.",
      hint:"Arrossega per girar · roda o pessic per apropar · toca un model",
      bg:"#e8eef8",
      camera:{target:[0, 1.05, -.1], yaw:0, pitch:.32, dist:1.9, minPitch:.05, maxPitch:1.0, minDist:.9, maxDist:3.2, minYaw:-1.2, maxYaw:1.2},
      build(ctx){
        const {scene, mesh, box, mat} = ctx;
        room(ctx, {floor:"#cfd6e2", wall:"#eef3fb", back:-2});
        poster(ctx, "img/microbis.webp", .6, .95, 0, 1.48, -1.94);
        scene.add(mesh(box(2.4, .06, .8), mat("#f4f6f8", {roughness:.3}), 0, .9, 0));
        [[-1.1, -.35], [1.1, -.35], [-1.1, .35], [1.1, .35]].forEach(([x, z]) => scene.add(mesh(box(.06, .9, .06), mat("#7b8a99", {metalness:.5, roughness:.4}), x, .45, z)));
        // microscopi
        const mic = new T.Group(); mic.position.set(-1.0, .93, -.22);
        mic.add(mesh(box(.2, .03, .16), mat("#3c4a63"), 0, .015, 0), mesh(new T.CylinderGeometry(.02, .02, .3, 12), mat("#5a6b8c", {metalness:.5}), -.05, .17, 0));
        const tube = mesh(new T.CylinderGeometry(.025, .03, .2, 16), mat("#3c4a63", {metalness:.4}), .01, .3, 0); tube.rotation.z = -.4; mic.add(tube);
        mic.add(mesh(box(.12, .015, .1), mat("#9aa7bb"), .03, .12, 0)); scene.add(mic);
        // flascons
        ["#8fd3b6", "#f2b880", "#c7a5e6"].forEach((c, i) => {
          const f = new T.Group(); f.position.set(.8 + i * .14, .93, -.3);
          f.add(mesh(new T.CylinderGeometry(.045, .05, .16, 20), new T.MeshStandardMaterial({color:"#ffffff", transparent:true, opacity:.35, roughness:.05}), 0, .08, 0));
          f.add(mesh(new T.CylinderGeometry(.042, .046, .09, 20), mat(c, {transparent:true, opacity:.85}), 0, .05, 0)); scene.add(f);
        });
        // models dels agents sobre peanyes
        const ids = opts.models, pickables = [], models = [], labels = [];
        ids.forEach((id, i) => {
          const x = (i - (ids.length - 1) / 2) * .44;
          const ped = mesh(new T.CylinderGeometry(.08, .09, .05, 24), mat("#dfe6f1", {roughness:.4}), x, .955, .1); scene.add(ped);
          const ring = mesh(new T.TorusGeometry(.1, .008, 8, 32), new T.MeshStandardMaterial({color:"#0e8a5f", emissive:"#0e8a5f", emissiveIntensity:.8}), x, .985, .1, false); ring.rotation.x = Math.PI / 2; ring.visible = false; scene.add(ring);
          const m = agent(id); m.position.set(x, 1.1, .1); m.scale.setScalar(1.25); m.userData.pickId = id; scene.add(m);
          pickables.push(m); models.push({id, m, ring});
          const anchor = new T.Object3D(); anchor.position.set(x, .93, .2); scene.add(anchor);
          labels.push({obj:anchor, text:((opts.names && opts.names.agents) || AGENT_NAMES)[id] || AGENT_NAMES[id] || id, cls:"agent", onClick: opts.onPick ? () => opts.onPick(id) : null});
        });
        const mark = sel => models.forEach(o => { o.ring.visible = o.id === sel; });
        mark(opts.selected);
        return {
          pickables, labels, onPick: opts.onPick,
          tick(t){ models.forEach((o, i) => { o.m.rotation.y = t * .5 + i; o.m.position.y = 1.1 + Math.sin(t * 1.2 + i) * .012; }); },
          update(o){ mark(o.selected); }
        };
      }
    });
  }

  /* ---------- 3 · Consulta: pacient de cos sencer amb punts d'exploració */
  const SPOT3 = {cap:[0, 1.74, .03], galta:[-.075, 1.58, .085], gola:[0, 1.5, .07], coll:[.06, 1.47, .045], pit:[0, 1.3, .12], braç:[-.27, 1.12, .03], abdomen:[0, 1.04, .11], cos:[.2, .82, .08], peus:[.085, .05, .16]};
  function consult(container, opts){
    return createStage(container, {
      label:"Consulta mèdica en 3D. Gira al voltant de " + opts.patient.nom + " i toca els punts per explorar.",
      hint:"Arrossega per girar al voltant del pacient · toca els punts verds",
      bg:"#eef2f7",
      camera:{target:[0, 1.05, 0], yaw:.15, pitch:.12, dist:2.6, minPitch:-.15, maxPitch:.9, minDist:1.1, maxDist:4.2},
      build(ctx){
        const {scene, mesh, box, mat} = ctx;
        room(ctx, {floor:"#d6dee8", wall:"#f3f6fa", back:-2.5, side:3.5});
        poster(ctx, "img/anatomia.webp", .78, 1.16, .8, 1.75, -2.44);
        // llitera, taula i doctora
        const bed = new T.Group(); bed.position.set(1.6, 0, -1.4);
        bed.add(mesh(box(1.9, .12, .7), mat("#9cc7b7"), 0, .7, 0), mesh(box(.5, .08, .6), mat("#ffffff"), -.65, .8, 0));
        [[-.85, -.3], [.85, -.3], [-.85, .3], [.85, .3]].forEach(([x, z]) => bed.add(mesh(new T.CylinderGeometry(.025, .025, .64, 8), mat("#7b8a99", {metalness:.6, roughness:.3}), x, .32, z)));
        scene.add(bed);
        scene.add(mesh(box(1.2, .05, .6), mat("#b8a07f"), -1.7, .75, -1.6), mesh(box(.3, .02, .22), mat("#ffffff"), -1.6, .785, -1.55));
        const doc = person({skin:"#f0c9a8", hair:"#3a2a22", hairStyle:"short", shirt:"#ffffff"}, {full:true, coat:true, smile:true}); doc.position.set(-1.05, 0, -.4); doc.rotation.y = .55; scene.add(doc);
        // plataforma i pacient
        scene.add(mesh(new T.CylinderGeometry(.45, .48, .04, 48), mat("#c4ceda", {roughness:.5}), 0, .02, 0));
        const pat = person(opts.patient, {full:true}); pat.position.y = .04; scene.add(pat);
        const head = pat.userData.head, chest = pat.userData.chest;
        // punts d'exploració
        const spots = [], pickables = [];
        opts.spots.forEach(s => {
          const p = SPOT3[s] || [0, 1, .15], g = new T.Group(); g.position.set(p[0], p[1] + .04, p[2]);
          const dotM = new T.MeshStandardMaterial({color:"#0e8a5f", emissive:"#0e8a5f", emissiveIntensity:.9});
          const dot = mesh(new T.SphereGeometry(.028, 16, 12), dotM, 0, 0, 0, false);
          const halo = mesh(new T.SphereGeometry(.05, 16, 12), new T.MeshBasicMaterial({color:"#0e8a5f", transparent:true, opacity:.25, depthWrite:false}), 0, 0, 0, false);
          g.add(dot, halo); g.userData.pickId = s; scene.add(g); pickables.push(g); spots.push({s, g, dotM, halo});
        });
        const NAMES = (opts.names && opts.names.spots) || (window.SCENES ? SCENES.SPOT_NAMES : {});
        const SIDE = {cap:"right", galta:null, gola:"left", coll:"right", pit:"right", braç:"left", abdomen:"right", cos:"right", peus:"left"};
        const mkLabels = seen => spots.map(o => ({obj:o.g, side:SIDE[o.s], text:(seen.includes(o.s) ? "✓ " : "") + (NAMES[o.s] || o.s), cls:seen.includes(o.s) ? "seen" : "todo", above:true, onClick:() => opts.onSpot(o.s)}));
        let seen = opts.seen.slice();
        const paint = () => spots.forEach(o => { const c = seen.includes(o.s) ? "#2a5db0" : "#0e8a5f"; o.dotM.color.set(c); o.dotM.emissive.set(c); o.halo.material.color.set(c); });
        paint();
        const occ = new T.Vector3(0, 1.2, 0);
        return {
          pickables, labels:mkLabels(seen), occluder:occ, onPick:s => opts.onSpot(s),
          tick(t){ chest.scale.y = 1 + Math.sin(t * 1.6) * .012; head.rotation.y = Math.sin(t * .4) * .08; spots.forEach((o, i) => { if (!seen.includes(o.s)) o.halo.scale.setScalar(1 + .35 * (.5 + .5 * Math.sin(t * 3 + i))); else o.halo.scale.setScalar(1); }); },
          update(o){ if (o.seen && o.seen.length !== seen.length){ const fresh = o.seen.filter(x => !seen.includes(x)); seen = o.seen.slice(); paint();
            fresh.forEach(s => { const sp = spots.find(x => x.s === s); if (sp && window.gsap && !reduce()) gsap.fromTo(sp.g.scale, {x:1.8, y:1.8, z:1.8}, {x:1, y:1, z:1, duration:.5, ease:"back.out(2)"}); });
            return mkLabels(seen); } }
        };
      }
    });
  }

  /* ---------- 4 · Sala de proves */
  function testsRoom(container, opts){
    opts = opts || {};
    return createStage(container, {
      label:"Sala de proves en 3D: tubs d'analítica, negatoscopi amb una radiografia i monitor d'ECG.",
      hint:"Arrossega per girar · roda o pessic per apropar",
      bg:"#eef1f6",
      camera:{target:[0, 1.15, -.3], yaw:0, pitch:.22, dist:2.3, minPitch:0, maxPitch:.9, minDist:1, maxDist:3.6, minYaw:-1.1, maxYaw:1.1},
      build(ctx){
        const {scene, mesh, box, mat, canvasTex} = ctx;
        room(ctx, {floor:"#d3dbe6", wall:"#f1f4f8", back:-1.4});
        scene.add(mesh(box(2.6, .06, .8), mat("#f4f6f8", {roughness:.3}), 0, .9, -.4));
        [[-1.2, -.75], [1.2, -.75], [-1.2, -.05], [1.2, -.05]].forEach(([x, z]) => scene.add(mesh(box(.06, .9, .06), mat("#7b8a99", {metalness:.5}), x, .45, z)));
        // negatoscopi amb radiografia de tòrax
        const xr = canvasTex(256, 200, (g, W, H) => { g.fillStyle = "#141a22"; g.fillRect(0, 0, W, H); g.strokeStyle = "#cfe0f2"; g.lineWidth = 6; g.beginPath(); g.moveTo(W / 2, 14); g.lineTo(W / 2, H - 14); g.stroke();
          for (let i = 0; i < 6; i++){ const y = 34 + i * 26; g.beginPath(); g.moveTo(W / 2 - 6, y); g.bezierCurveTo(W / 2 - 70, y - 6, W / 2 - 96, y + 22, W / 2 - 10, y + 22); g.stroke(); g.beginPath(); g.moveTo(W / 2 + 6, y); g.bezierCurveTo(W / 2 + 70, y - 6, W / 2 + 96, y + 22, W / 2 + 10, y + 22); g.stroke(); } });
        const lb = new T.Group(); lb.position.set(-.75, 1.55, -1.33);
        lb.add(mesh(box(.8, .62, .05), mat("#2b3442"), 0, 0, 0), mesh(new T.PlaneGeometry(.72, .54), new T.MeshStandardMaterial({map:xr, emissive:"#ffffff", emissiveMap:xr, emissiveIntensity:.8}), 0, 0, .03, false));
        scene.add(lb);
        // monitor d'ECG amb traç que es mou
        const ecg = canvasTex(256, 128, (g, W, H) => { g.fillStyle = "#0f2a22"; g.fillRect(0, 0, W, H);
          g.strokeStyle = "#7cf0b8"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 70);   // traç inicial (es veu encara que no hi hagi animacions)
          for (let x = 0; x <= W; x += 64) { g.lineTo(x + 20, 70); g.lineTo(x + 26, 30); g.lineTo(x + 32, 100); g.lineTo(x + 38, 54); g.lineTo(x + 44, 70); g.lineTo(x + 64, 70); }
          g.stroke(); });
        const mon = new T.Group(); mon.position.set(.55, 1.2, -.62);
        mon.add(mesh(box(.62, .4, .06), mat("#2b3442"), 0, 0, 0), mesh(new T.PlaneGeometry(.56, .33), new T.MeshBasicMaterial({map:ecg}), 0, 0, .031, false), mesh(box(.08, .25, .08), mat("#2b3442"), 0, -.3, -.02));
        mon.rotation.y = -.25; scene.add(mon);
        // gradeta de tubs i centrífuga
        const rack = new T.Group(); rack.position.set(-.2, .93, -.2);
        rack.add(mesh(box(.5, .05, .12), mat("#e0e6ee"), 0, .06, 0));
        ["#c0392b", "#8e44ad", "#f39c12", "#2e86de", "#16a085"].forEach((c, i) => {
          const x = -.2 + i * .1; rack.add(mesh(new T.CylinderGeometry(.018, .018, .16, 16), new T.MeshStandardMaterial({color:"#ffffff", transparent:true, opacity:.5, roughness:.05}), x, .1, 0));
          rack.add(mesh(new T.CylinderGeometry(.016, .016, .09, 16), mat(i === 2 ? "#f7d774" : "#9e2b25"), x, .065, 0), mesh(new T.CylinderGeometry(.02, .02, .03, 16), mat(c), x, .19, 0));
        });
        scene.add(rack);
        const cen = mesh(new T.CylinderGeometry(.15, .17, .18, 32), mat("#dfe6f1", {roughness:.3}), .95, 1.02, -.3); scene.add(cen);
        const lid = mesh(new T.CylinderGeometry(.13, .13, .02, 32), mat("#3c4a63", {roughness:.3}), .95, 1.12, -.3); scene.add(lid);
        const DEV = (opts.names && opts.names.devices) || {};
        const labels = [[lb, "Negatoscopi"], [mon, "Monitor d'ECG"], [rack, "Tubs d'analítica"], [cen, "Centrífuga"]].map(([obj, key]) => ({obj, text:"ⓘ " + (DEV[key] || key), cls:"info dev", above:true, onClick:opts.onDevice ? () => opts.onDevice(key) : null}));
        [[lb, "Negatoscopi"], [mon, "Monitor d'ECG"], [rack, "Tubs d'analítica"], [cen, "Centrífuga"]].forEach(([o, k]) => { o.userData.pickId = k; });
        let x0 = 0;
        return {
          labels, pickables:[lb, mon, rack, cen], onPick:k => opts.onDevice && opts.onDevice(k),
          tick(t){
            const g = ecg.userData.ctx, W = 256, H = 128; const x = Math.floor((t * 90) % W);
            g.fillStyle = "#0f2a22"; g.fillRect(x, 0, 14, H);
            const ph = (t * 1.2) % 1, y = ph > .1 && ph < .13 ? 30 : ph > .13 && ph < .16 ? 100 : ph > .16 && ph < .19 ? 54 : 70;
            g.strokeStyle = "#7cf0b8"; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, g.lastY || 70); g.lineTo(x, y); if (x > x0) g.stroke(); g.lastY = y; x0 = x;
            ecg.needsUpdate = true; lid.rotation.y = t * 6;
          }
        };
      }
    });
  }

  window.STAGE3D = {supported, pharmacy, lab, consult, testsRoom};
})();

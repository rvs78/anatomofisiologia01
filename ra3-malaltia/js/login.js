/* Accés: correu @isvh.cat + contrasenya comuna (es compara la seva empremta SHA-256), com logistica02 */
(function(){
  "use strict";
  var SKEY = "ra3-malaltia-user";
  var login = document.getElementById("login"), app = document.getElementById("app");
  var form = document.getElementById("lgForm"), err = document.getElementById("lgErr");
  applyPrefs();
  // portada: foto de la tècnica (img/tecnica.webp); si no carrega, la il·lustració SVG
  (function(){
    var art = document.getElementById("lgArt"), img = new Image();
    img.alt = ""; img.className = "lgphoto"; img.decoding = "async";
    img.onload = function(){ art.textContent = ""; art.classList.add("photo"); art.appendChild(img); };
    img.onerror = function(){ art.innerHTML = SCENES.technicianArt(); };
    img.src = "img/tecnica.webp?v=8";
  })();
  applyStatic();
  function hex(buf){ return Array.prototype.map.call(new Uint8Array(buf), function(b){ return ("0" + b.toString(16)).slice(-2); }).join(""); }
  function enter(user){
    login.hidden = true; app.hidden = false;
    document.getElementById("who").textContent = user;
    document.getElementById("logout").onclick = function(){ try { sessionStorage.removeItem(SKEY); } catch(e) {} if (window.speechSynthesis) speechSynthesis.cancel(); location.reload(); };
    initA11y();
    startApp(user);
  }
  var saved = null; try { saved = sessionStorage.getItem(SKEY); } catch(e) {}
  if (saved && RA3.isValidEmail(saved)) { enter(RA3.normEmail(saved)); return; }
  document.getElementById("lgEmail").focus();
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var email = RA3.normEmail(document.getElementById("lgEmail").value);
    var pass = document.getElementById("lgPass").value;
    if (!RA3.isValidEmail(email)) { err.textContent = t("errEmail"); document.getElementById("lgEmail").focus(); return; }
    if (!window.crypto || !crypto.subtle) { err.textContent = t("errCrypto"); return; }
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(pass)).then(function(buf){
      if (hex(buf) !== RA3.PASS_SHA256) { err.textContent = t("errPass"); document.getElementById("lgPass").select(); return; }
      err.textContent = "";
      try { sessionStorage.setItem(SKEY, email); } catch(e) {}
      enter(email);
    });
  });
})();

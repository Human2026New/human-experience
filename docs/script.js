/* -------------------------
   LANGUAGE + TEXT LOADING
-------------------------- */
const langFiles = {
  pt: "assets/lang/pt.json",
  en: "assets/lang/en.json"
};

let currentLang = localStorage.getItem("lang") || "pt";

function applyTranslations(data){
  document.querySelectorAll("[data-key]").forEach(el=>{
    const key = el.getAttribute("data-key");
    if(data[key]) el.textContent = data[key];
  });
}

/* Load json */
async function loadLang(lang){
  currentLang = lang;
  localStorage.setItem("lang", lang);
  const res = await fetch(langFiles[lang]);
  const json = await res.json();
  applyTranslations(json);
}
loadLang(currentLang);

/* Manual switch */
document.querySelectorAll("[data-lang]").forEach(btn=>{
  btn.onclick = ()=>loadLang(btn.dataset.lang);
});

/* -------------------------
   PORTAL -> MAIN TRANSITION
-------------------------- */
const portal = document.getElementById("portal");
const main = document.getElementById("main");
document.getElementById("ascender").onclick = ()=>{
  portal.style.opacity = "0";
  setTimeout(()=>{
    portal.classList.add("hidden");
    main.classList.remove("hidden");
  },500);
};

/* -------------------------
   SHOW BIG CHOICE
-------------------------- */
const section = document.getElementById("big-choice");
document.getElementById("btn-understand").onclick = ()=>section.classList.remove("hidden");
document.getElementById("btn-participate").onclick = ()=>section.classList.remove("hidden");

/* -------------------------
   BUTTONS ACTIONS
-------------------------- */
document.getElementById("btn-app").onclick = ()=>window.location.href="app/index.html";
document.getElementById("btn-radar").onclick = ()=>window.location.href="radar.html";

/* Moon Phase placeholder */
document.getElementById("moon-phase").textContent="🌕";

/* Optional sound (add to folder if wanted) */
// new Audio("assets/sound/ambience.mp3").play();

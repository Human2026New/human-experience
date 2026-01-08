let LANG_DATA = {};
const LANG_KEY = "lang";
const DEFAULT_LANG = "pt";

async function loadLang() {
  const res = await fetch("lang.json");
  LANG_DATA = await res.json();
  applyLang(localStorage.getItem(LANG_KEY) || DEFAULT_LANG);
}

function applyLang(lang){
  if (!LANG_DATA[lang]) lang = DEFAULT_LANG;
  localStorage.setItem(LANG_KEY, lang);

  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.dataset.key;
    el.innerHTML = LANG_DATA[lang][key] || `⚠ ${key}`;
  });
}

function setLang(lang){
  applyLang(lang);
}

loadLang();

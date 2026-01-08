/* =========================
   HUMAN — APP.JS (BILINGUE JSON)
   ========================= */

const STORAGE_KEY = "human_app_state_v1";
const LANG_KEY    = "lang";
let LANG = "pt";
let LANG_DATA = {};

async function init() {
  LANG = localStorage.getItem(LANG_KEY) || "pt";
  const res = await fetch("../lang.json");
  LANG_DATA = await res.json();

  loadState();
  updateUI();
  tick();
}
init();

let state = { hum: 0, percent: 0, phase: 0 };

function loadState(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved) state = { ...state, ...JSON.parse(saved) };
}

const humValue    = document.getElementById("humValue");
const percentText = document.getElementById("percentText");
const phaseText   = document.getElementById("phaseText");

function updateUI() {
  const langPack = LANG_DATA[LANG] || LANG_DATA["pt"];

  humValue.textContent = state.hum.toFixed(5) + " HUM";
  percentText.textContent = state.percent.toFixed(2) + " " + langPack["app.percent"];

  phaseText.textContent =
    state.phase === 0
      ? langPack["app.phase0"]
      : state.phase === 1
      ? langPack["app.phase1"]
      : langPack["app.phase2"];
}

function tick(){
  setInterval(() => {
    state.hum += 0.00002;
    state.percent += 0.00001;
    updateUI();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, 1000);
}

/* =========================
   HUMAN — app.js
   ========================= */

const STORAGE_KEY = "human_app_state_v1";

/* ---------- TELEGRAM SAFE ---------- */
if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.ready();
}

/* ---------- STATE ---------- */
let state = {
  hum: 0,
  percent: 0,
  phase: 0
};

/* ---------- ELEMENTS ---------- */
const humValue = document.getElementById("humValue");
const percentText = document.getElementById("percentText");
const phaseText = document.getElementById("phaseText");

/* ---------- LOAD ---------- */
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) state = { ...state, ...JSON.parse(saved) };

/* ---------- UI ---------- */
function updateUI() {
  humValue.textContent = state.hum.toFixed(5) + " HUM";
  percentText.textContent = state.percent.toFixed(2) + "% minerado";

  phaseText.textContent =
    state.phase === 0
      ? "Fase 0 — Génese\nHUM dormente"
      : state.phase === 1
      ? "Fase 1 — Ativação"
      : "Fase 2 — Circulação";
}

/* ---------- PRESENÇA (visual) ---------- */
setInterval(() => {
  state.hum += 0.00002;
  state.percent += 0.00001;
  updateUI();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}, 1000);

/* ---------- MODAIS ---------- */
document.querySelectorAll("[data-open]").forEach(btn => {
  btn.onclick = () => {
    document.getElementById(btn.dataset.open).classList.remove("hidden");
  };
});

document.querySelectorAll(".close").forEach(btn => {
  btn.onclick = () => {
    btn.closest(".space").classList.add("hidden");
  };
});

/* ---------- INIT ---------- */
updateUI();

/* ==================================================
   HUMAN — app.js (produção / excelência)
   ================================================== */

/* ---------- CONFIG ---------- */
const STORAGE_KEY = "human_app_state_v1";
const BACKEND_URL = "http://localhost:3000"; // depois trocas para Render
const DONATION_ADDRESS =
  "UQC_QK4Kwcw68zJYKGYMKRhrWNAK7lYmniEgV-Kq9kCLkzlf";

/* ---------- TELEGRAM SAFE ---------- */
if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
  document.body.style.height = "auto";
  document.body.style.overflow = "auto";
}

/* ---------- STATE ---------- */
let state = {
  started: false,
  hum: 0,
  time: 0,
  days: {},
  lastTick: Date.now()
};

let humStatus = {
  phase: 0,
  phase_name: "Génese",
  mined_percent: 0,
  hum_price_eur: 0.05,
  conversion_enabled: false,
  withdraw_enabled: false
};

/* ---------- LOAD STATE ---------- */
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    state = { ...state, ...JSON.parse(saved) };
  } catch {}
}

/* ---------- HELPERS ---------- */
const $ = id => document.getElementById(id);

function today() {
  return new Date().toISOString().slice(0, 10);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- ELEMENTS ---------- */
const enterBtn = $("enterBtn");
const dashboard = $("dashboard");
const humValue = $("humValue");
const eurValue = $("eurValue");
const presenceCount = $("presenceCount");

/* ---------- SPLASH ---------- */
window.addEventListener("load", () => {
  const splash = $("mainnetSplash");
  if (!splash) return;
  setTimeout(() => {
    splash.style.display = "none";
    document.body.style.overflow = "auto";
  }, 2000);
});

/* ---------- ENTER ---------- */
let loopStarted = false;

if (enterBtn) {
  enterBtn.onclick = () => {
    if (loopStarted) return;
    loopStarted = true;

    state.started = true;
    enterBtn.style.display = "none";
    dashboard.classList.remove("hidden");

    startLoop();
    save();
  };
}

/* ---------- PRESENÇA (ANTI RESET) ---------- */
function startLoop() {
  setInterval(() => {
    const now = Date.now();
    const delta = Math.floor((now - state.lastTick) / 1000);
    state.lastTick = now;

    if (delta <= 0) return;

    state.time += delta;
    state.hum += delta * 0.00002;

    if (state.time >= 300) {
      state.days[today()] = true;
    }

    updateUI();
    save();
  }, 1000);
}

/* ---------- BACKEND STATUS ---------- */
async function fetchHumStatus() {
  try {
    const r = await fetch(BACKEND_URL + "/hum/status");
    const data = await r.json();
    humStatus = data;
    applyHumStatus();
  } catch {
    console.warn("Backend offline — modo local ativo");
  }
}

function applyHumStatus() {
  const statusBox = document.querySelector(".card.big small");
  if (!statusBox) return;

  statusBox.innerHTML = `
    Fase: <b>Fase ${humStatus.phase} — ${humStatus.phase_name}</b><br>
    Percentagem minerada: ${humStatus.mined_percent.toFixed(4)}%<br>
    ${
      humStatus.conversion_enabled
        ? "Conversão ativa"
        : "Conversão bloqueada até Fase 2"
    }
  `;
}

/* ---------- UI ---------- */
function updateUI() {
  humValue.textContent = state.hum.toFixed(5) + " HUM";
  eurValue.textContent = "€ " + (state.hum * humStatus.hum_price_eur).toFixed(2);
  presenceCount.textContent = Math.max(1, Math.floor(1 + state.time / 60));
}

/* ---------- INIT ---------- */
updateUI();
fetchHumStatus();
setInterval(fetchHumStatus, 15000);

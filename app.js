/* =========================
   HUMAN — app.js (FASES)
   ========================= */

const BACKEND_URL = "http://localhost:3000";

/* ---------- STATE ---------- */
let state = {
  hum: 0,
  time: 0,
  days: {},
  tasks: []
};

/* ---------- ELEMENTS ---------- */
const $ = id => document.getElementById(id);

const enterBtn = $("enterBtn");
const dashboard = $("dashboard");
const humValue = $("humValue");
const eurValue = $("eurValue");
const usdValue = $("usdValue");
const tonValue = $("tonValue");
const phaseText = $("phaseText");
const presenceCount = $("presenceCount");
const minedPercentEl = $("minedPercent");
const conversionState = $("conversionState");
const daysCount = $("daysCount");
const timeSpent = $("timeSpent");
const taskList = $("taskList");

/* ---------- ENTER ---------- */
enterBtn.onclick = () => {
  enterBtn.style.display = "none";
  dashboard.classList.remove("hidden");
  startLoop();
};

/* ---------- PRESENÇA ---------- */
function startLoop() {
  setInterval(() => {
    state.time++;
    state.hum += 0.00002;

    if (state.time >= 300) {
      state.days[today()] = true;
    }

    updateUI();
  }, 1000);
}

/* ---------- BACKEND STATUS ---------- */
async function fetchHumStatus() {
  try {
    const r = await fetch(`${BACKEND_URL}/hum/status`);
    const d = await r.json();
    applyPhase(d.phase, d.minedPercent);
  } catch {}
}

/* ---------- PHASE LOGIC ---------- */
function applyPhase(phase, minedPercent) {
  minedPercentEl.textContent = minedPercent.toFixed(4) + "%";

  if (phase === 0) {
    phaseText.innerHTML =
      "Fase 0 — Génese<br>HUM guardado (dormente)";
    conversionState.textContent =
      "Conversão bloqueada até Fase 2";
  }

  if (phase === 1) {
    phaseText.innerHTML =
      "Fase 1 — Expansão<br>HUM ativo internamente";
  }

  if (phase >= 2) {
    phaseText.innerHTML =
      "Fase 2 — Maturidade<br>Conversões ativadas";
    conversionState.textContent = "Conversão disponível";
  }
}

/* ---------- UI ---------- */
function updateUI() {
  humValue.textContent = state.hum.toFixed(5) + " HUM";
  daysCount.textContent = Object.keys(state.days).length;
  timeSpent.textContent = Math.floor(state.time / 60) + " min";
  presenceCount.textContent = Math.max(1, Math.floor(state.time / 60));
}

/* ---------- MODALS ---------- */
document.querySelectorAll("[data-open]").forEach(btn => {
  btn.onclick = () =>
    document.getElementById(btn.dataset.open).classList.remove("hidden");
});

document.querySelectorAll(".close").forEach(btn => {
  btn.onclick = () =>
    document.querySelectorAll(".space").forEach(s =>
      s.classList.add("hidden")
    );
});

/* ---------- UTILS ---------- */
function today() {
  return new Date().toISOString().slice(0, 10);
}

/* ---------- INIT ---------- */
fetchHumStatus();
setInterval(fetchHumStatus, 5000);

/* ---------- SPLASH ---------- */
window.addEventListener("load", () => {
  setTimeout(() => {
    $("mainnetSplash").style.display = "none";
  }, 2000);
});

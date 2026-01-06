const STORAGE_KEY = "human_app_final";

/* CONFIGURAÇÃO DE FASE */
const HUM_PHASE = 0; // 0 = Génese | 1 = Formação | 2 = Conversão ativa

/* STATE */
let state = {
  started: false,
  hum: 0,
  time: 0,
  days: {},
  tasks: [],
  taskDay: null
};

/* LOAD */
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try { state = { ...state, ...JSON.parse(saved) }; } catch {}
}

const $ = id => document.getElementById(id);

/* ELEMENTOS */
const enterBtn = $("enterBtn");
const dashboard = $("dashboard");
const humValue = $("humValue");
const eurValue = $("eurValue");
const usdValue = $("usdValue");
const tonValue = $("tonValue");
const presenceCount = $("presenceCount");
const phaseText = $("phaseText");
const minedPercent = $("minedPercent");

/* ENTER */
if (enterBtn) {
  enterBtn.onclick = () => {
    state.started = true;
    enterBtn.style.display = "none";
    dashboard.classList.remove("hidden");
    startLoop();
    save();
  };
}

/* LOOP */
function startLoop() {
  setInterval(() => {
    state.time++;
    state.hum += 0.00002;

    if (state.time >= 300) {
      state.days[today()] = true;
    }

    updateUI();
    save();
  }, 1000);
}

/* UI */
function updateUI() {
  humValue.textContent = state.hum.toFixed(5) + " HUM";

  eurValue.textContent = "€ 0.00";
  usdValue.textContent = "$ 0.00";
  tonValue.textContent = "—";

  presenceCount.textContent = Math.max(1, Math.floor(state.time / 60));

  phaseText.textContent =
    HUM_PHASE === 0 ? "Fase 0 — Génese" :
    HUM_PHASE === 1 ? "Fase 1 — Formação" :
    "Fase 2 — Conversão";

  minedPercent.textContent = "0.000%";

  $("humStatus").textContent = "HUM guardado (dormente)";
  $("conversionStatus").textContent =
    HUM_PHASE < 2
      ? "Conversão bloqueada até Fase 2"
      : "Conversão disponível";
}

/* MODALS */
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

/* UTILS */
function today() {
  return new Date().toISOString().slice(0, 10);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* SPLASH */
window.addEventListener("load", () => {
  setTimeout(() => {
    const splash = document.getElementById("mainnetSplash");
    if (splash) splash.style.display = "none";
  }, 2000);
});

updateUI();

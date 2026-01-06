/* =========================
   HUMAN — app.js (stable)
   ========================= */

const STORAGE_KEY = "human_app_state_v1";

/* ---------- STATE ---------- */
let state = {
  started: true,
  hum: 0,
  time: 0,
  days: {},
  tasks: [],
  taskDay: null,
  phase: 0,           // 0 | 1 | 2
  minedPercent: 0     // backend futuramente
};

/* ---------- LOAD ---------- */
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    state = { ...state, ...JSON.parse(saved) };
  } catch {}
}

/* ---------- HELPERS ---------- */
const $ = id => document.getElementById(id);
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function today() {
  return new Date().toISOString().slice(0, 10);
}

/* ---------- ELEMENTS ---------- */
const humValue = $("humValue");
const presenceCount = $("presenceCount");
const daysCount = $("daysCount");
const timeSpent = $("timeSpent");
const stateText = $("stateText");
const phaseText = $("phaseText");
const taskList = $("taskList");

/* ---------- START LOOP ---------- */
let loopStarted = false;
if (!loopStarted) {
  loopStarted = true;
  startMiningLoop();
}

/* ---------- MINING LOOP ---------- */
function startMiningLoop() {
  setInterval(() => {
    state.time++;
    state.hum += 0.00002;

    if (state.time >= 300) {
      state.days[today()] = true;
    }

    updatePhase();
    updateUI();
    save();
  }, 1000);
}

/* ---------- PHASE LOGIC ---------- */
function updatePhase() {
  if (state.minedPercent >= 20) state.phase = 1;
  if (state.minedPercent >= 40) state.phase = 2;
}

/* ---------- UI ---------- */
function updateUI() {
  humValue.textContent = state.hum.toFixed(5) + " HUM";
  daysCount.textContent = Object.keys(state.days).length;
  timeSpent.textContent = Math.floor(state.time / 60) + " min";
  stateText.textContent = Object.keys(state.days).length >= 7
    ? "consistência"
    : "presença";

  presenceCount.textContent = Math.max(1, Math.floor(state.time / 60));

  phaseText.innerHTML =
    state.phase === 0
      ? "Fase 0 — Génese<br>HUM guardado (dormente)"
      : state.phase === 1
      ? "Fase 1 — Maturação<br>Levantamentos limitados"
      : "Fase 2 — Conversão ativa";

  renderTasks();
}

/* ---------- TASKS ---------- */
const TASK_POOL = [
  { text: "Entrar com presença", hum: 0.001 },
  { text: "Permanecer 3 minutos", hum: 0.0015 },
  { text: "Permanecer 7 minutos", hum: 0.0025 }
];

function renderTasks() {
  taskList.innerHTML = "";
  TASK_POOL.forEach(t => {
    const li = document.createElement("li");
    li.textContent = "✔️ " + t.text;
    taskList.appendChild(li);
  });
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

/* ---------- SPLASH ---------- */
window.addEventListener("load", () => {
  setTimeout(() => {
    const splash = $("mainnetSplash");
    if (splash) splash.style.display = "none";
  }, 2000);
});

updateUI();

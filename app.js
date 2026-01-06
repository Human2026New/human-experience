/* =========================
   HUMAN — app.js (BACKEND LINKED)
   ========================= */

const STORAGE_KEY = "human_app_v7";
const BACKEND_URL = "http://localhost:3000";

/* ---------- STATE ---------- */
let state = {
  started: false,
  hum: 0,
  tonSim: 0,
  time: 0,
  days: {},
  tasks: [],
  taskDay: null,
  humStatus: null
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

/* ---------- ELEMENTS ---------- */
const enterBtn = $("enterBtn");
const dashboard = $("dashboard");

const humValue = $("humValue");
const eurValue = $("eurValue");
const usdValue = $("usdValue");
const tonValue = $("tonValue");

const daysCount = $("daysCount");
const timeSpent = $("timeSpent");
const stateText = $("stateText");
const taskList = $("taskList");

const buyHumAmount = $("buyHumAmount");
const buyTonEstimate = $("buyTonEstimate");
const buyHumBtn = $("buyHumBtn");

const exchangeHum = $("exchangeHum");
const exchangeTon = $("exchangeTon");
const humToTonBtn = $("humToTon");
const tonToHumBtn = $("tonToHum");

/* ---------- HUM STATUS (BACKEND) ---------- */
async function fetchHumStatus() {
  try {
    const r = await fetch(`${BACKEND_URL}/hum/status`);
    const d = await r.json();
    state.humStatus = d.hum;
    updateUI();
  } catch {
    console.warn("HUM backend indisponível");
  }
}

/* ---------- ENTER ---------- */
let loopStarted = false;

if (enterBtn) {
  enterBtn.onclick = () => {
    if (loopStarted) return;
    loopStarted = true;

    state.started = true;
    enterBtn.style.display = "none";
    dashboard.classList.remove("hidden");

    generateDailyTasks();
    startLoop();
    save();
  };
}

/* ---------- LOOP PRESENÇA ---------- */
function startLoop() {
  setInterval(() => {
    state.time++;
    state.hum += 0.00002;

    if (state.time >= 300) {
      state.days[today()] = true;
    }

    checkTasks();
    updateUI();
    save();
  }, 1000);
}

/* ---------- TASKS ---------- */
const TASK_POOL = [
  { text: "Entrar com presença", type: "enter", hum: 0.001 },
  { text: "Permanecer 3 minutos", type: "time3", hum: 0.0015 },
  { text: "Permanecer 7 minutos", type: "time7", hum: 0.0025 }
];

function generateDailyTasks() {
  const d = today();
  if (state.taskDay === d) return;

  state.taskDay = d;
  state.tasks = [];

  [...TASK_POOL]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .forEach((t, i) => {
      state.tasks.push({
        id: d + "_" + i,
        text: t.text,
        type: t.type,
        hum: t.hum,
        done: false
      });
    });
}

function checkTasks() {
  state.tasks.forEach(t => {
    if (t.done) return;
    if (t.type === "enter") completeTask(t);
    if (t.type === "time3" && state.time >= 180) completeTask(t);
    if (t.type === "time7" && state.time >= 420) completeTask(t);
  });
}

function completeTask(task) {
  task.done = true;
  state.hum += task.hum;
}

/* ---------- UI ---------- */
function updateUI() {
  const humStatus = state.humStatus;

  humValue.textContent = state.hum.toFixed(5) + " HUM";
  daysCount.textContent = Object.keys(state.days).length;
  timeSpent.textContent = Math.floor(state.time / 60) + " min";

  if (humStatus) {
    stateText.textContent =
      `Fase ${humStatus.phase.id} — ${humStatus.phase.name}`;

    eurValue.textContent = "€ " + humStatus.price_eur.toFixed(2);
    usdValue.textContent = "$ " + (humStatus.price_eur * 1.1).toFixed(2);

    tonValue.textContent =
      humStatus.conversion_allowed
        ? "Conversão ativa"
        : "Conversão bloqueada até Fase 2";

    if (exchangeHum)
      exchangeHum.textContent = state.hum.toFixed(5) + " HUM";

    if (exchangeTon)
      exchangeTon.textContent = humStatus.conversion_allowed
        ? "disponível"
        : "bloqueado";
  }

  renderTasks();
  updateBuyEstimate();
}

/* ---------- BUY HUM ---------- */
function updateBuyEstimate() {
  if (!state.humStatus) return;
  if (!buyHumAmount || !buyTonEstimate) return;

  const hum = Number(buyHumAmount.value || 0);
  const eur = hum * state.humStatus.price_eur;

  buyTonEstimate.textContent = eur.toFixed(2) + " € (equivalente)";
}

if (buyHumAmount) {
  buyHumAmount.oninput = updateBuyEstimate;
}

if (buyHumBtn) {
  buyHumBtn.onclick = () => {
    if (!state.humStatus) return alert("Sistema indisponível.");

    state.hum += Number(buyHumAmount.value || 0);
    save();
    updateUI();

    alert("Compra HUM registada.\nHUM guardado (dormente).");
  };
}

/* ---------- CONVERSÃO ---------- */
if (humToTonBtn) {
  humToTonBtn.onclick = () => {
    if (!state.humStatus?.conversion_allowed) {
      return alert("Conversão bloqueada até Fase 2.");
    }
  };
}

if (tonToHumBtn) {
  tonToHumBtn.onclick = () => {
    alert("Conversão inversa ainda não disponível.");
  };
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

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- INIT ---------- */
fetchHumStatus();
setInterval(fetchHumStatus, 10000);
updateUI();

// --------------------
// Safe Telegram init
// --------------------
let tg = null;
try {
  tg = window.Telegram?.WebApp;
  tg?.ready();
} catch {}

// --------------------
// Config
// --------------------
const STORAGE_KEY = "human_state_v3";

// --------------------
// State
// --------------------
let state = {
  started: false,
  time: 0,
  hum: 0,
  rate: 0.00002,
  sessions: 0,
  days: {},        // presença (>=5min)
  checkins: {}     // { "YYYY-MM-DD": "presente" }
};

// --------------------
// Load local
// --------------------
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try { state = { ...state, ...JSON.parse(saved) }; } catch {}
}

// --------------------
// Elements
// --------------------
const enterBtn = document.getElementById("enterBtn");
const timeEl = document.getElementById("time");
const humEl = document.getElementById("hum");
const stateEl = document.getElementById("state");
const statsEl = document.getElementById("stats");
const goalsEl = document.getElementById("goals");
const checkinEl = document.getElementById("checkin");
const statusMsg = document.getElementById("statusMsg");

const goal7 = document.getElementById("goal7");
const goal30 = document.getElementById("goal30");
const goal7txt = document.getElementById("goal7txt");
const goal30txt = document.getElementById("goal30txt");

const checkinStatus = document.getElementById("checkinStatus");
const checkinButtons = document.querySelectorAll(".checkin-options button");

// --------------------
// Restore UI
// --------------------
if (state.started) {
  enterBtn.style.display = "none";
  statsEl.classList.remove("hidden");
  goalsEl.classList.remove("hidden");
  checkinEl.classList.remove("hidden");
  statusMsg.textContent = "Presença retomada.";
  startLoop();
  updateUI();
  restoreCheckin();
}

// --------------------
// Enter
// --------------------
enterBtn.onclick = () => {
  if (state.started) return;

  state.started = true;
  state.sessions += 1;

  enterBtn.style.display = "none";
  statsEl.classList.remove("hidden");
  goalsEl.classList.remove("hidden");
  checkinEl.classList.remove("hidden");

  statusMsg.textContent = "Presença iniciada.";
  saveLocal();
  startLoop();
};

// --------------------
// Loop humano
// --------------------
function startLoop() {
  setInterval(() => {
    state.time += 1;
    const drift = (Math.random() - 0.5) * 0.00001;
    state.hum += Math.max(0, state.rate + drift);

    checkDay();
    updateUI();
    saveLocal();
  }, 1000);
}

// --------------------
// Dia humano (>=5 min)
// --------------------
function checkDay() {
  if (state.time < 300) return;

  const today = todayKey();
  if (!state.days[today]) {
    state.days[today] = true;
    statusMsg.textContent = "Dia humano registado.";
  }
}

// --------------------
// Check-in consciente
// --------------------
checkinButtons.forEach(btn => {
  btn.onclick = () => {
    const today = todayKey();
    if (state.checkins[today]) {
      checkinStatus.textContent = "Já fizeste check-in hoje.";
      return;
    }

    const mood = btn.dataset.mood;
    state.checkins[today] = mood;

    checkinStatus.textContent = `Hoje foi registado como: ${mood}.`;
    stateEl.textContent = mood;

    saveLocal();
  };
});

function restoreCheckin() {
  const today = todayKey();
  if (state.checkins[today]) {
    checkinStatus.textContent =
      `Hoje já registaste: ${state.checkins[today]}.`;
    stateEl.textContent = state.checkins[today];
  }
}

// --------------------
// UI
// --------------------
function updateUI() {
  const daysCount = Object.keys(state.days).length;

  timeEl.textContent = `${state.time}s`;
  humEl.textContent = state.hum.toFixed(5);

  if (!state.checkins[todayKey()]) {
    stateEl.textContent =
      daysCount >= 30 ? "consistência profunda" :
      daysCount >= 7 ? "consistência" :
      "presença";
  }

  const p7 = Math.min(daysCount / 7, 1);
  const p30 = Math.min(daysCount / 30, 1);

  goal7.style.width = `${p7 * 100}%`;
  goal30.style.width = `${p30 * 100}%`;

  goal7txt.textContent = `${Math.min(daysCount,7)} / 7`;
  goal30txt.textContent = `${Math.min(daysCount,30)} / 30`;
}

// --------------------
// Utils
// --------------------
function todayKey() {
  return new Date().toISOString().slice(0,10);
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

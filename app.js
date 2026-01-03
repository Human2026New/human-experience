// =====================================================
// HUMAN — app.js FINAL (Telegram SAFE, UI explícita)
// =====================================================

const STORAGE_KEY = "human_state_v12";
const BACKEND_URL = "https://human-backend-1.onrender.com";

// Telegram detection
const isTelegram = !!window.Telegram?.WebApp;
if (isTelegram) {
  try { Telegram.WebApp.ready(); } catch {}
}

// --------------------
// State
// --------------------
let state = {
  started: false,
  time: 0,
  hum: 0,
  rate: 0.00002,
  days: {},
  checkins: {}
};

// --------------------
// Load local
// --------------------
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try { state = { ...state, ...JSON.parse(saved) }; } catch {}
}

// No Telegram nunca arrancar automático
if (isTelegram) {
  state.started = false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// --------------------
// Elements
// --------------------
const enterBtn = document.getElementById("enterBtn");

const statsEl   = document.getElementById("stats");
const goalsEl   = document.getElementById("goals");
const checkinEl = document.getElementById("checkin");
const walletEl  = document.getElementById("wallet");
const mirrorEl  = document.getElementById("mirror");

const timeEl  = document.getElementById("time");
const humEl   = document.getElementById("hum");
const stateEl = document.getElementById("state");

const goal7 = document.getElementById("goal7");
const goal30 = document.getElementById("goal30");
const goal7txt = document.getElementById("goal7txt");
const goal30txt = document.getElementById("goal30txt");

const walletBalance = document.getElementById("walletBalance");
const walletState   = document.getElementById("walletState");

const mirrorTotal = document.getElementById("mirrorTotal");
const mirrorToday = document.getElementById("mirrorToday");
const mirrorText  = document.getElementById("mirrorText");

// --------------------
// ENTER — MOSTRAR TUDO EXPLICITAMENTE
// --------------------
enterBtn.onclick = () => {
  if (state.started) return;

  state.started = true;
  enterBtn.style.display = "none";

  statsEl.classList.remove("hidden");
  goalsEl.classList.remove("hidden");
  checkinEl.classList.remove("hidden");
  walletEl.classList.remove("hidden");
  mirrorEl.classList.remove("hidden");

  saveLocal();
  startLoop();
  updateUI();
  fetchMirror();
};

// --------------------
// Loop humano
// --------------------
function startLoop() {
  setInterval(() => {
    state.time++;
    state.hum += state.rate;

    checkDay();
    updateUI();
    saveLocal();

    if (state.time % 30 === 0) {
      fetchMirror();
    }
  }, 1000);
}

// --------------------
function checkDay() {
  if (state.time < 300) return;
  const d = todayKey();
  if (!state.days[d]) state.days[d] = true;
}

// --------------------
function updateUI() {
  const days = Object.keys(state.days).length;

  timeEl.textContent = `${state.time}s`;
  humEl.textContent = state.hum.toFixed(5);

  stateEl.textContent =
    days >= 30 ? "consistência profunda" :
    days >= 7 ? "consistência" :
    "presença";

  goal7.style.width = `${Math.min(days / 7, 1) * 100}%`;
  goal30.style.width = `${Math.min(days / 30, 1) * 100}%`;
  goal7txt.textContent = `${Math.min(days, 7)} / 7`;
  goal30txt.textContent = `${Math.min(days, 30)} / 30`;

  walletBalance.textContent = `${state.hum.toFixed(5)} HUM`;
  walletState.textContent =
    state.hum >= 1 ? "saldo profundo" :
    state.hum >= 0.1 ? "saldo consistente" :
    "saldo em crescimento";
}

// --------------------
// Espelho social real
// --------------------
function fetchMirror() {
  fetch(`${BACKEND_URL}/mirror`)
    .then(r => r.json())
    .then(d => {
      mirrorTotal.textContent = d.total_humans;
      mirrorToday.textContent = d.active_today;
      mirrorText.textContent =
        d.total_humans > 30
          ? "Existe continuidade coletiva."
          : "Outros humanos também estão aqui.";
    })
    .catch(() => {});
}

// --------------------
function todayKey() {
  return new Date().toISOString().slice(0,10);
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

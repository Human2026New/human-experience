// --------------------
// Config
// --------------------
const STORAGE_KEY = "human_state_v6";

// --------------------
// State
// --------------------
let state = {
  started: false,
  time: 0,
  hum: 0,
  rate: 0.00002,
  sessions: 0,
  days: {},
  checkins: {},
  invites: []        // [{ name, code, date }]
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
const statsEl = document.getElementById("stats");
const goalsEl = document.getElementById("goals");
const checkinEl = document.getElementById("checkin");
const walletEl = document.getElementById("wallet");
const invitesEl = document.getElementById("invites");

const timeEl = document.getElementById("time");
const humEl = document.getElementById("hum");
const stateEl = document.getElementById("state");

const goal7 = document.getElementById("goal7");
const goal30 = document.getElementById("goal30");
const goal7txt = document.getElementById("goal7txt");
const goal30txt = document.getElementById("goal30txt");

const checkinStatus = document.getElementById("checkinStatus");
const checkinButtons = document.querySelectorAll(".checkin-options button");

const walletBalance = document.getElementById("walletBalance");
const walletState = document.getElementById("walletState");

const inviteInput = document.getElementById("inviteInput");
const inviteBtn = document.getElementById("inviteBtn");
const inviteStatus = document.getElementById("inviteStatus");
const inviteCount = document.getElementById("inviteCount");

const statusMsg = document.getElementById("statusMsg");

// --------------------
// Restore UI
// --------------------
if (state.started) {
  showCoreUI();
  startLoop();
  restoreCheckin();
  updateUI();
}

// --------------------
// Enter
// --------------------
enterBtn.onclick = () => {
  if (state.started) return;
  state.started = true;
  state.sessions++;
  showCoreUI();
  saveLocal();
  startLoop();
};

// --------------------
// Core UI
// --------------------
function showCoreUI() {
  enterBtn.style.display = "none";
  statsEl.classList.remove("hidden");
  goalsEl.classList.remove("hidden");
  checkinEl.classList.remove("hidden");
  walletEl.classList.remove("hidden");
  invitesEl.classList.remove("hidden");
}

// --------------------
// Loop humano
// --------------------
function startLoop() {
  setInterval(() => {
    state.time++;
    state.hum += Math.max(0, state.rate + (Math.random() - 0.5) * 0.00001);
    checkDay();
    updateUI();
    saveLocal();
  }, 1000);
}

// --------------------
// Dia humano
// --------------------
function checkDay() {
  if (state.time < 300) return;
  const today = todayKey();
  if (!state.days[today]) state.days[today] = true;
}

// --------------------
// Check-in
// --------------------
checkinButtons.forEach(btn => {
  btn.onclick = () => {
    const today = todayKey();
    if (state.checkins[today]) return;
    const mood = btn.dataset.mood;
    state.checkins[today] = mood;
    stateEl.textContent = mood;
    checkinStatus.textContent = `Hoje foi registado como: ${mood}`;
    saveLocal();
  };
});

function restoreCheckin() {
  const today = todayKey();
  if (state.checkins[today]) {
    stateEl.textContent = state.checkins[today];
    checkinStatus.textContent = `Hoje já registaste: ${state.checkins[today]}`;
  }
}

// --------------------
// Convites humanos
// --------------------
inviteBtn.onclick = () => {
  const code = crypto.randomUUID();
  state.invites.push({
    name: inviteInput.value || "humano",
    code,
    date: new Date().toISOString()
  });

  inviteStatus.textContent = "Convite humano registado.";
  inviteInput.value = "";
  updateUI();
  saveLocal();
};

// --------------------
// UI update
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

  goal7.style.width = `${Math.min(daysCount / 7, 1) * 100}%`;
  goal30.style.width = `${Math.min(daysCount / 30, 1) * 100}%`;

  goal7txt.textContent = `${Math.min(daysCount,7)} / 7`;
  goal30txt.textContent = `${Math.min(daysCount,30)} / 30`;

  walletBalance.textContent = `${state.hum.toFixed(5)} HUM`;
  walletState.textContent =
    state.hum >= 1 ? "saldo profundo" :
    state.hum >= 0.1 ? "saldo consistente" :
    "saldo em crescimento";

  inviteCount.textContent = state.invites.length;
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

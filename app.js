// --------------------
// Config
// --------------------
const STORAGE_KEY = "human_state_v7";

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
  invites: [],
  identity: {
    name: ""
  }
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
const identityEl = document.getElementById("identity");

const timeEl = document.getElementById("time");
const humEl = document.getElementById("hum");
const stateEl = document.getElementById("state");

const goal7 = document.getElementById("goal7");
const goal30 = document.getElementById("goal30");
const goal7txt = document.getElementById("goal7txt");
const goal30txt = document.getElementById("goal30txt");

const checkinButtons = document.querySelectorAll(".checkin-options button");
const checkinStatus = document.getElementById("checkinStatus");

const walletBalance = document.getElementById("walletBalance");
const walletState = document.getElementById("walletState");

const inviteInput = document.getElementById("inviteInput");
const inviteBtn = document.getElementById("inviteBtn");
const inviteStatus = document.getElementById("inviteStatus");
const inviteCount = document.getElementById("inviteCount");

const identityName = document.getElementById("identityName");
const identityAge = document.getElementById("identityAge");
const identityState = document.getElementById("identityState");
const identityPhrase = document.getElementById("identityPhrase");

// --------------------
// Restore UI
// --------------------
if (state.started) {
  showUI();
  startLoop();
  restoreCheckin();
  restoreIdentity();
  updateUI();
}

// --------------------
// Enter
// --------------------
enterBtn.onclick = () => {
  if (state.started) return;
  state.started = true;
  state.sessions++;
  showUI();
  saveLocal();
  startLoop();
};

// --------------------
// Show UI
// --------------------
function showUI() {
  enterBtn.style.display = "none";
  statsEl.classList.remove("hidden");
  goalsEl.classList.remove("hidden");
  checkinEl.classList.remove("hidden");
  walletEl.classList.remove("hidden");
  invitesEl.classList.remove("hidden");
  identityEl.classList.remove("hidden");
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
    state.checkins[today] = btn.dataset.mood;
    checkinStatus.textContent = `Hoje foi: ${btn.dataset.mood}`;
    stateEl.textContent = btn.dataset.mood;
    saveLocal();
  };
});

function restoreCheckin() {
  const today = todayKey();
  if (state.checkins[today]) {
    stateEl.textContent = state.checkins[today];
    checkinStatus.textContent = `Hoje foi: ${state.checkins[today]}`;
  }
}

// --------------------
// Identidade
// --------------------
identityName.value = state.identity.name || "";

identityName.oninput = () => {
  state.identity.name = identityName.value.trim();
  saveLocal();
};

// --------------------
// Convites
// --------------------
inviteBtn.onclick = () => {
  state.invites.push({
    name: inviteInput.value || "humano",
    code: crypto.randomUUID(),
    date: new Date().toISOString()
  });
  inviteInput.value = "";
  inviteStatus.textContent = "Convite registado.";
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

  const symbolicState =
    daysCount >= 30 ? "consistência profunda" :
    daysCount >= 7 ? "consistência" :
    "presença";

  if (!state.checkins[todayKey()]) {
    stateEl.textContent = symbolicState;
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

  identityAge.textContent = `${daysCount} dias`;
  identityState.textContent = symbolicState;
  identityPhrase.textContent = generateIdentityPhrase(daysCount);
}

// --------------------
// Identity phrase
// --------------------
function generateIdentityPhrase(days) {
  if (days >= 30) return "Construiu presença ao longo do tempo.";
  if (days >= 7) return "Volta com consistência.";
  return "Começou a estar presente.";
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

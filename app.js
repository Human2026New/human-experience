// --------------------
// Config
// --------------------
const STORAGE_KEY = "human_state_v8";

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
  identity: { name: "" }
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
const sections = ["stats","goals","checkin","wallet","invites","identity","unlock"];
sections.forEach(id => window[id+"El"] = document.getElementById(id));

const timeEl = document.getElementById("time");
const humEl = document.getElementById("hum");
const stateEl = document.getElementById("state");
const statusMsg = document.getElementById("statusMsg");

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

const unlockMsg = document.getElementById("unlockMsg");

// --------------------
// Restore UI
// --------------------
if (state.started) {
  showUI();
  startLoop();
  restoreCheckin();
  identityName.value = state.identity.name || "";
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
function showUI() {
  enterBtn.style.display = "none";
  sections.forEach(id => window[id+"El"].classList.remove("hidden"));
}

// --------------------
// Loop humano
// --------------------
function startLoop() {
  setInterval(() => {
    state.time++;
    state.hum += Math.max(0, state.rate + (Math.random()-0.5)*0.00001);
    checkDay();
    updateUI();
    saveLocal();
  }, 1000);
}

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
    stateEl.textContent = btn.dataset.mood;
    checkinStatus.textContent = `Hoje foi: ${btn.dataset.mood}`;
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
// Identity
// --------------------
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
  saveLocal();
};

// --------------------
// UI update + desbloqueios
// --------------------
function updateUI() {
  const days = Object.keys(state.days).length;

  timeEl.textContent = `${state.time}s`;
  humEl.textContent = state.hum.toFixed(5);

  const symbolic =
    days >= 30 ? "consistência profunda" :
    days >= 7 ? "consistência" :
    "presença";

  if (!state.checkins[todayKey()]) stateEl.textContent = symbolic;

  goal7.style.width = `${Math.min(days/7,1)*100}%`;
  goal30.style.width = `${Math.min(days/30,1)*100}%`;
  goal7txt.textContent = `${Math.min(days,7)} / 7`;
  goal30txt.textContent = `${Math.min(days,30)} / 30`;

  walletBalance.textContent = `${state.hum.toFixed(5)} HUM`;
  walletState.textContent =
    state.hum >= 1 ? "saldo profundo" :
    state.hum >= 0.1 ? "saldo consistente" :
    "saldo em crescimento";

  inviteCount.textContent = state.invites.length;

  identityAge.textContent = `${days} dias`;
  identityState.textContent = symbolic;

  identityPhrase.textContent =
    days >= 30 ? "Construiu presença profunda." :
    days >= 7 ? "Volta com consistência." :
    "Começou a estar presente.";

  // desbloqueios simbólicos
  unlockMsg.textContent =
    days >= 30 ? "Aqui o tempo já não precisa de provar nada." :
    days >= 7 ? "Este espaço não pede atenção. Apenas continuidade." :
    days >= 3 ? "Estar aqui já começou a criar rasto." :
    "";
}

// --------------------
function todayKey() {
  return new Date().toISOString().slice(0,10);
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

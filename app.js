// --------------------
// Telegram safe init
// --------------------
let tg = null;
try {
  tg = window.Telegram?.WebApp;
  tg?.ready();
} catch {}

// --------------------
// Local storage keys
// --------------------
const STORAGE_KEY = "human_state_v1";

// --------------------
// State
// --------------------
let state = {
  started: false,
  time: 0,
  hum: 0,
  rate: 0.00002,
  sessions: 0
};

// --------------------
// Load saved state
// --------------------
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    state = { ...state, ...parsed };
  } catch {}
}

// --------------------
// Elements
// --------------------
const enterBtn = document.getElementById("enterBtn");
const timeEl = document.getElementById("time");
const humEl = document.getElementById("hum");
const stateEl = document.getElementById("state");
const statsEl = document.getElementById("stats");
const statusMsg = document.getElementById("statusMsg");

// --------------------
// Restore UI if active
// --------------------
if (state.started) {
  enterBtn.style.display = "none";
  statsEl.classList.remove("hidden");
  statusMsg.textContent = "Presença retomada.";
  startLoop();
  updateUI();
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
  statusMsg.textContent = "Presença iniciada.";

  saveState();
  startLoop();
};

// --------------------
// Main loop
// --------------------
function startLoop() {
  setInterval(() => {
    state.time += 1;

    // ritmo humano não-linear
    const drift = (Math.random() - 0.5) * 0.00001;
    state.hum += Math.max(0, state.rate + drift);

    updateUI();
    saveState();
  }, 1000);
}

// --------------------
// UI
// --------------------
function updateUI() {
  timeEl.textContent = `${state.time}s`;
  humEl.textContent = state.hum.toFixed(5);

  stateEl.textContent =
    state.time < 60 ? "neutro" :
    state.time < 300 ? "estável" :
    "consistente";
}

// --------------------
// Save local
// --------------------
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

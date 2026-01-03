// --------------------
// Telegram safe init
// --------------------
let tg = null;
try {
  tg = window.Telegram?.WebApp;
  tg?.ready();
} catch {}

// --------------------
// Config
// --------------------
const STORAGE_KEY = "human_state_v1";
const BACKEND = "https://human-backend-ywuf.onrender.com";

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
// Load local
// --------------------
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    state = { ...state, ...JSON.parse(saved) };
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
// Restore UI
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

    updateUI();
    saveLocal();
  }, 1000);

  // backend snapshot a cada 20s
  setInterval(syncBackend, 20000);
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
// Local save
// --------------------
function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// --------------------
// Backend sync (espelho)
// --------------------
function syncBackend() {
  fetch(`${BACKEND}/sync_hum`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      hum: state.hum,
      time: state.time,
      sessions: state.sessions,
      initDataUnsafe: tg?.initDataUnsafe || {}
    })
  })
  .then(() => {
    statusMsg.textContent = "Sincronizado.";
  })
  .catch(() => {
    statusMsg.textContent = "Offline (local ativo).";
  });
}

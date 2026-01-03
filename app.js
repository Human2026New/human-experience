// --------------------
// Telegram safe init
// --------------------
let tg = null;
try {
  tg = window.Telegram?.WebApp;
  tg?.ready();
} catch {}

// --------------------
// Backend URL
// --------------------
const BACKEND = "https://human-backend-ywuf.onrender.com";

// --------------------
// State
// --------------------
let state = {
  started: false,
  time: 0,
  hum: 0,
  rate: 0.00002,
  sessions: 0,
  lastSync: 0
};

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
// Enter
// --------------------
enterBtn.onclick = () => {
  if (state.started) return;

  state.started = true;
  state.sessions += 1;

  enterBtn.style.display = "none";
  statsEl.classList.remove("hidden");
  statusMsg.textContent = "Presença registada. HUM a acumular.";

  startLoop();
};

// --------------------
// Main loop (humano)
// --------------------
function startLoop() {
  setInterval(() => {
    state.time += 1;

    // ritmo humano não-linear
    const drift = (Math.random() - 0.5) * 0.00001;
    state.hum += Math.max(0, state.rate + drift);

    updateUI();
    maybeSync();
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
// Backend sync (safe)
// --------------------
function maybeSync() {
  const now = Date.now();
  if (now - state.lastSync < 15000) return; // 15s

  state.lastSync = now;

  fetch(`${BACKEND}/sync_hum`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      hum: state.hum,
      sessions: state.sessions,
      initDataUnsafe: tg?.initDataUnsafe || {}
    })
  })
  .then(r => r.json())
  .then(() => {
    statusMsg.textContent = "Sincronizado.";
  })
  .catch(() => {
    statusMsg.textContent = "Offline. Continua local.";
  });
}

// =====================================
// HUMAN WebApp — UX VIVO
// =====================================

if (!(window.Telegram && Telegram.WebApp)) {
  document.body.innerHTML = "HUMAN exists only inside Telegram.";
  throw new Error("Not inside Telegram");
}

const tg = Telegram.WebApp;
tg.ready();

// ---------- STATE ----------
let state = {
  streak: 0,
  hum: 0,
  displayHum: 0,
  trust: 1.0,
  busy: false
};

// ---------- ELEMENTS ----------
const intro = document.getElementById("intro");
const main = document.getElementById("main");

const enterBtn = document.getElementById("enterBtn");
const startBtn = document.getElementById("startBtn");

const elTime = document.getElementById("timeActive");
const elCycle = document.getElementById("cycle");
const elState = document.getElementById("state");
const core = document.getElementById("core");

// ---------- BACKEND ----------
const BACKEND = "http://localhost:5000";

// ---------- INTRO ----------
enterBtn.onclick = () => {
  tg.HapticFeedback.impactOccurred("light");
  intro.style.display = "none";
  main.style.display = "flex";
  fetchStatus();
  startLiveCounter();
};

// ---------- BACKEND ----------
function fetchStatus() {
  fetch(`${BACKEND}/api/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData: tg.initData })
  })
    .then(r => r.json())
    .then(data => {
      if (!data) return;
      state.streak = data.streak;
      state.hum = data.hum;
      state.displayHum = data.hum;
      state.trust = data.trust;
      render();
    });
}

function proveHumanity() {
  if (state.busy) return;

  state.busy = true;
  startBtn.innerText = "⏳";
  tg.HapticFeedback.impactOccurred("medium");

  fetch(`${BACKEND}/api/prove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData: tg.initData })
  })
    .then(r => r.json())
    .then(data => {
      state.busy = false;

      if (!data.allowed) {
        startBtn.innerText = "⏳ AINDA NÃO";
        setTimeout(render, 1500);
        return;
      }

      state.streak = data.streak;
      state.hum = data.hum;
      state.displayHum = data.hum;
      state.trust = data.trust;

      pulseCore();
      tg.HapticFeedback.notificationOccurred("success");
      render();
    });
}

// ---------- LIVE COUNTER ----------
function startLiveCounter() {
  setInterval(() => {
    state.displayHum += 0.00001;
    updateCounter();
    syncPulse();
  }, 1000);
}

// ---------- UI ----------
function render() {
  elTime.innerText = `${state.streak} dias`;
  elState.innerText = `trust ${state.trust.toFixed(2)}`;
  updateCounter();
  startBtn.innerText = "⛏ PROVAR HUMANIDADE";
}

function updateCounter() {
  elCycle.innerText = `${state.displayHum.toFixed(5)} HUM`;
}

// ---------- PULSE SYNC ----------
function syncPulse() {
  const scale = 1 + Math.min(state.displayHum / 1000, 0.15);
  core.style.transform = `scale(${scale})`;
}

function pulseCore() {
  core.style.transition = "transform 0.2s ease";
  core.style.transform = "scale(1.2)";
  setTimeout(() => {
    core.style.transform = "";
  }, 200);
}

// ---------- ACTION ----------
startBtn.onclick = proveHumanity;

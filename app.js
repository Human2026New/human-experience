// =====================================
// HUMAN — LÓGICA HUMANA PROFUNDA
// =====================================

const tg = Telegram.WebApp;
tg.ready();

let state = {
  streak: 0,
  hum: 0,
  displayHum: 0,
  trust: 1,
  rate: 0.00001,
  busy: false
};

const BACKEND = "https://human-backend-ywuf.onrender.com";

const elTime = document.getElementById("timeActive");
const elCycle = document.getElementById("cycle");
const elState = document.getElementById("state");
const startBtn = document.getElementById("startBtn");
const core = document.getElementById("core");

// -----------------------------
function fetchStatus() {
  fetch(`${BACKEND}/api/status`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({initData: tg.initData})
  })
  .then(r => r.json())
  .then(d => {
    state.streak = d.streak;
    state.hum = d.hum;
    state.displayHum = d.hum;
    state.trust = d.trust;
    updateRate();
    render();
  });
}

function proveHumanity() {
  if (state.busy) return;
  state.busy = true;

  fetch(`${BACKEND}/api/prove`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({initData: tg.initData})
  })
  .then(r => r.json())
  .then(d => {
    state.busy = false;
    state.streak = d.streak;
    state.hum = d.hum;
    state.displayHum = d.hum;
    state.trust = d.trust;
    updateRate();
    pulseCore();
    render();
  });
}

// -----------------------------
function updateRate() {
  // presença humana real
  state.rate = 0.00001 * state.trust * Math.log(state.streak + 1);
}

function startCounter() {
  setInterval(() => {
    state.displayHum += state.rate;
    elCycle.innerText = `${state.displayHum.toFixed(5)} HUM`;
  }, 1000);
}

// -----------------------------
function render() {
  elTime.innerText = `${state.streak} dias`;
  elState.innerText = `trust ${state.trust.toFixed(2)}`;
  elCycle.innerText = `${state.displayHum.toFixed(5)} HUM`;
  startBtn.innerText = "⛏ PROVAR HUMANIDADE";
}

// -----------------------------
function pulseCore() {
  core.style.transform = "scale(1.25)";
  setTimeout(() => {
    core.style.transform = "";
  }, 250);
}

// -----------------------------
startBtn.onclick = proveHumanity;
fetchStatus();
startCounter();

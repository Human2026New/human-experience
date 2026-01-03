// =====================================
// HUMAN WebApp — HARDENED + LIVE COUNTER
// =====================================

// ---------- STATE ----------
let state = {
  streak: 0,
  hum: 0,          // valor real (backend)
  displayHum: 0,  // valor animado
  trust: 1.0,
  busy: false
};

// ---------- ELEMENTS ----------
const elTime = document.getElementById("timeActive");
const elCycle = document.getElementById("cycle");
const elState = document.getElementById("state");
const elAction = document.getElementById("startBtn");

// ---------- TELEGRAM CHECK ----------
if (!(window.Telegram && Telegram.WebApp)) {
  document.body.innerHTML = `
    <div style="
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
      background:#000;
      color:#aaa;
      font-family:system-ui;
      text-align:center;
    ">
      HUMAN<br><br>
      This experience only exists inside Telegram.
    </div>
  `;
  throw new Error("Not inside Telegram");
}

const tg = Telegram.WebApp;
tg.ready();

// ---------- BACKEND ----------
const BACKEND = "http://localhost:5000";

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  fetchStatus();
  startLiveCounter();
});

// ---------- BACKEND CALLS ----------
function fetchStatus() {
  fetch(`${BACKEND}/api/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData: tg.initData })
  })
    .then(r => r.json())
    .then(data => {
      if (data.error) return;

      state.streak = data.streak;
      state.hum = data.hum;
      state.displayHum = data.hum;
      state.trust = data.trust;

      render();
    })
    .catch(() => {
      console.warn("Backend offline");
    });
}

function proveHumanity() {
  if (state.busy) return;

  state.busy = true;
  elAction.disabled = true;
  elAction.innerText = "⏳ A PROVAR...";

  fetch(`${BACKEND}/api/prove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData: tg.initData })
  })
    .then(r => r.json())
    .then(data => {
      state.busy = false;

      if (!data.allowed) {
        elAction.innerText = "⏳ AINDA NÃO";
        setTimeout(render, 1500);
        return;
      }

      state.streak = data.streak;
      state.hum = data.hum;
      state.trust = data.trust;

      animateSuccess(data.reward);
      syncCounter();
      render();
    })
    .catch(() => {
      state.busy = false;
      render();
      alert("Sistema indisponível.");
    });
}

// ---------- LIVE COUNTER ----------
function startLiveCounter() {
  setInterval(() => {
    // velocidade simbólica (visual apenas)
    const rate = 0.00001; // HUM por segundo
    state.displayHum += rate;
    updateCounterUI();
  }, 1000);
}

function syncCounter() {
  // quando backend responde, ajusta suavemente
  state.displayHum = state.hum;
}

// ---------- UI ----------
function render() {
  elTime.innerText = `${state.streak} dias`;
  elState.innerText = `trust ${state.trust.toFixed(2)}`;

  updateCounterUI();

  if (!state.busy) {
    elAction.innerText = "⛏ PROVAR HUMANIDADE";
    elAction.disabled = false;
  }
}

function updateCounterUI() {
  elCycle.innerText = `${state.displayHum.toFixed(5)} HUM`;
}

function animateSuccess(reward) {
  elAction.innerText = `+${reward.toFixed(2)} HUM`;
  elAction.style.background = "rgba(76,255,215,0.35)";
  setTimeout(() => {
    elAction.style.background = "";
  }, 1200);
}

// ---------- ACTION ----------
elAction.addEventListener("click", proveHumanity);

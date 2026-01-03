// =====================================
// HUMAN WebApp — INTRO → LIVE APP
// =====================================

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

// ---------- BACKEND ----------
const BACKEND = "http://localhost:5000";

// ---------- INTRO ACTION ----------
enterBtn.addEventListener("click", () => {
  intro.style.display = "none";
  main.style.display = "block";

  fetchStatus();
  startLiveCounter();
});

// ---------- BACKEND ----------
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
    });
}

function proveHumanity() {
  if (state.busy) return;

  state.busy = true;
  startBtn.disabled = true;
  startBtn.innerText = "⏳ A PROVAR...";

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
      state.trust = data.trust;
      state.displayHum = data.hum;

      animateSuccess(data.reward);
      render();
    });
}

// ---------- LIVE COUNTER ----------
function startLiveCounter() {
  setInterval(() => {
    state.displayHum += 0.00001;
    updateCounter();
  }, 1000);
}

// ---------- UI ----------
function render() {
  elTime.innerText = `${state.streak} dias`;
  elState.innerText = `trust ${state.trust.toFixed(2)}`;
  updateCounter();

  startBtn.innerText = "⛏ PROVAR HUMANIDADE";
  startBtn.disabled = false;
}

function updateCounter() {
  elCycle.innerText = `${state.displayHum.toFixed(5)} HUM`;
}

function animateSuccess(reward) {
  startBtn.innerText = `+${reward.toFixed(2)} HUM`;
  startBtn.style.background = "rgba(76,255,215,0.35)";
  setTimeout(() => {
    startBtn.style.background = "";
  }, 1200);
}

// ---------- ACTION ----------
startBtn.addEventListener("click", proveHumanity);

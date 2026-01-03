// ================================
// HUMAN WEBAPP — CORE
// ================================

const tg = window.Telegram?.WebApp;
if (tg) tg.ready();

// ---------- ESTADO ----------
let state = {
  started: false,
  hum: 0,
  startTime: null,
  timer: null
};

// ---------- ELEMENTOS ----------
const startBtn = document.getElementById("startBtn");
const core = document.getElementById("core");
const info = document.getElementById("info");

// ---------- SEGURANÇA ----------
function isTelegram() {
  return !!window.Telegram?.WebApp;
}

// ---------- UI ----------
function showCore() {
  startBtn.style.display = "none";
  info.style.display = "none";

  core.style.display = "block";
  core.style.opacity = 0;

  setTimeout(() => {
    core.style.opacity = 1;
  }, 50);
}

// ---------- CONTADOR HUM ----------
function startHumanCycle() {
  state.started = true;
  state.startTime = Date.now();

  state.timer = setInterval(() => {
    const seconds = Math.floor((Date.now() - state.startTime) / 1000);
    state.hum = (seconds * 0.00001).toFixed(5);

    document.getElementById("hum").innerText = state.hum;
    document.getElementById("time").innerText = seconds + "s";
  }, 1000);
}

// ---------- CLICK ----------
startBtn.addEventListener("click", () => {
  if (!isTelegram()) {
    alert("Esta experiência funciona apenas dentro do Telegram.");
    return;
  }

  if (state.started) return;

  showCore();
  startHumanCycle();
});

// ---------- DEBUG ----------
console.log("HUMAN WebApp carregada");

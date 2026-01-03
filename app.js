// ==================================
// HUMAN — APP.JS
// Ritmo humano não-linear
// ==================================

console.log("HUMAN app.js carregado");

// Telegram WebApp (se existir)
const tg = window.Telegram?.WebApp;
if (tg) tg.ready();

// ELEMENTOS
const startBtn = document.getElementById("startBtn");
const info = document.getElementById("info");
const core = document.getElementById("core");
const timeEl = document.getElementById("time");
const humEl = document.getElementById("hum");
const sphere = document.querySelector(".sphere");

// ESTADO HUMANO
let started = false;
let startTime = null;
let timer = null;

let hum = 0;
let lastTick = 0;

// parâmetros humanos (ajustáveis no futuro)
const BASE_RATE = 0.000006;   // base lenta
const MAX_RATE = 0.00002;    // limite superior humano

// ---------- FUNÇÕES ----------

// calcula ritmo humano (não-linear)
function calculateHumanRate(secondsActive) {
  // crescimento inicial mais rápido (acolhimento)
  let rhythm = BASE_RATE * Math.log(secondsActive + 2);

  // fadiga suave após muito tempo contínuo
  if (secondsActive > 300) {
    rhythm *= 0.85;
  }
  if (secondsActive > 900) {
    rhythm *= 0.7;
  }

  // micro-variação humana
  const noise = (Math.random() - 0.5) * rhythm * 0.3;

  rhythm += noise;

  // limites humanos
  rhythm = Math.max(BASE_RATE * 0.4, rhythm);
  rhythm = Math.min(MAX_RATE, rhythm);

  return rhythm;
}

// pulso vivo sincronizado com ritmo
function updatePulse(rate) {
  if (!sphere) return;

  const scale = 1 + (rate / MAX_RATE) * 0.08;
  const glow = 25 + (rate / MAX_RATE) * 25;

  sphere.style.transform = `scale(${scale})`;
  sphere.style.boxShadow = `0 0 ${glow}px rgba(63,255,224,0.45)`;
}

// ---------- INICIAR EXPERIÊNCIA ----------
startBtn.addEventListener("click", () => {
  if (started) return;
  started = true;

  startBtn.style.display = "none";
  info.style.display = "none";

  core.classList.remove("hidden");
  setTimeout(() => core.classList.add("show"), 50);

  startTime = Date.now();
  lastTick = startTime;

  timer = setInterval(() => {
    const now = Date.now();
    const secondsActive = Math.floor((now - startTime) / 1000);
    const delta = (now - lastTick) / 1000;
    lastTick = now;

    const rate = calculateHumanRate(secondsActive);
    hum += rate * delta;

    timeEl.innerText = secondsActive + "s";
    humEl.innerText = hum.toFixed(5);

    updatePulse(rate);
  }, 1000);
});

// DEBUG
alert("APP CARREGADA — ritmo humano ativo");

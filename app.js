// ================================
// HUMAN — APP.JS (UX VIVO)
// ================================

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

// ESTADO
let started = false;
let startTime = null;
let timer = null;

// ---------- FUNÇÕES UX VIVO ----------

// Pulso humano variável (não mecânico)
function updatePulse(seconds) {
  if (!sphere) return;

  const base = 1.04;
  const slowWave = Math.sin(seconds / 6) * 0.02;
  const micro = (Math.random() - 0.5) * 0.01;

  const scale = base + slowWave + micro;

  sphere.style.transform = `scale(${scale})`;
  sphere.style.boxShadow = `0 0 ${30 + (seconds % 12)}px rgba(63,255,224,0.45)`;
}

// ---------- INICIAR EXPERIÊNCIA ----------
startBtn.addEventListener("click", () => {
  console.log("ENTRAR clicado");

  if (started) return;
  started = true;

  // esconder intro
  startBtn.style.display = "none";
  info.style.display = "none";

  // mostrar core
  core.classList.remove("hidden");
  setTimeout(() => core.classList.add("show"), 50);

  startTime = Date.now();

  timer = setInterval(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const hum = (seconds * 0.00001).toFixed(5);

    timeEl.innerText = seconds + "s";
    humEl.innerText = hum;

    updatePulse(seconds);
  }, 1000);
});

// DEBUG VISUAL (podes remover depois)
alert("APP CARREGADA — botão ENTRAR deve funcionar");

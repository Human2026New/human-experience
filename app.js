console.log("HUMAN — loop humano ativo");

const tg = window.Telegram?.WebApp;
if (tg) tg.ready();

const BACKEND = "https://human-backend-XXXX.onrender.com"; // mantém, mas NÃO bloqueia

const startBtn = document.getElementById("startBtn");
const info = document.getElementById("info");
const core = document.getElementById("core");

const timeEl = document.getElementById("time");
const humEl = document.getElementById("hum");
const stateEl = document.getElementById("state");
const sphere = document.querySelector(".sphere");

let started = false;
let startTime = 0;
let lastTick = 0;

let totalTime = 0;
let hum = 0;

let presence = 0;
let calm = 0;
let stable = 0;

// ritmo humano
function humanRate(seconds) {
  let r = 0.000004 + Math.log(seconds + 2) * 0.000002;
  r += (Math.random() - 0.5) * r * 0.3;
  return Math.max(0.000002, Math.min(0.00002, r));
}

// animação viva
function updateVisual(rate) {
  const scale = 1 + rate * 1500;
  sphere.style.transform = `scale(${scale})`;
  sphere.style.boxShadow = `0 0 ${30 + rate * 8000}px rgba(63,255,224,0.5)`;
}

// guarda no backend SEM bloquear
function saveCheckpoint() {
  fetch(`${BACKEND}/api/update`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      initData: tg?.initData || "web",
      delta_hum: 0,
      total_time: totalTime,
      presence,
      calm,
      stable
    })
  }).catch(()=>{});
}

startBtn.onclick = () => {
  if (started) return;
  started = true;

  startBtn.style.display = "none";
  info.style.display = "none";

  core.classList.remove("hidden");
  core.classList.add("show");

  startTime = Date.now();
  lastTick = startTime;

  // LOOP HUMANO LOCAL (NUNCA BLOQUEIA)
  setInterval(() => {
    const now = Date.now();
    const delta = (now - lastTick) / 1000;
    lastTick = now;

    totalTime += delta;

    const rate = humanRate(totalTime);
    hum += rate * delta;

    if (totalTime > 120) calm = 1;
    if (totalTime > 300) presence = 1;
    if (totalTime > 600) stable = 1;

    timeEl.innerText = Math.floor(totalTime) + "s";
    humEl.innerText = hum.toFixed(5);
    stateEl.innerText = stable ? "estável" : calm ? "calmo" : presence ? "presente" : "neutro";

    updateVisual(rate);

  }, 1000);

  // CHECKPOINT BACKEND (a cada 15s)
  setInterval(saveCheckpoint, 15000);
};

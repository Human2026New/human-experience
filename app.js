console.log("HUMAN — persistência ativa");

const tg = window.Telegram?.WebApp;
if (tg) tg.ready();

const BACKEND = "https://human-backend-ywuf.onrender.com";

const startBtn = document.getElementById("startBtn");
const info = document.getElementById("info");
const core = document.getElementById("core");

const timeEl = document.getElementById("time");
const humEl = document.getElementById("hum");
const stateEl = document.getElementById("state");
const sphere = document.querySelector(".sphere");

let started = false;
let startTime = null;
let lastTick = null;

let hum = 0;
let totalTime = 0;

let presence = 0;
let calm = 0;
let stable = 0;

const BASE_RATE = 0.000006;
const MAX_RATE = 0.00002;

async function loadState() {
  const res = await fetch(`${BACKEND}/api/status`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      initData: tg?.initData || "web"
    })
  });
  const d = await res.json();

  hum = d.hum;
  totalTime = d.total_time;
  presence = d.presence;
  calm = d.calm;
  stable = d.stable;
}

async function saveState() {
  fetch(`${BACKEND}/api/update`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      initData: tg?.initData || "web",
      hum,
      total_time: totalTime,
      presence,
      calm,
      stable
    })
  });
}

function humanRate(seconds) {
  let r = BASE_RATE * Math.log(seconds + 2);
  if (stable) r *= 1.15;
  r += (Math.random() - 0.5) * r * 0.25;
  return Math.min(MAX_RATE, Math.max(BASE_RATE * 0.4, r));
}

startBtn.addEventListener("click", async () => {
  if (started) return;
  started = true;

  await loadState();

  startBtn.style.display = "none";
  info.style.display = "none";
  core.classList.remove("hidden");
  core.classList.add("show");

  startTime = Date.now();
  lastTick = startTime;

  setInterval(() => {
    const now = Date.now();
    const delta = (now - lastTick) / 1000;
    lastTick = now;

    totalTime += delta;

    const rate = humanRate(totalTime);
    hum += rate * delta;

    if (totalTime > 300) presence = 1;
    if (totalTime > 120) calm = 1;
    if (totalTime > 600) stable = 1;

    timeEl.innerText = Math.floor(totalTime) + "s";
    humEl.innerText = hum.toFixed(5);
    stateEl.innerText = stable ? "estável" : calm ? "calmo" : presence ? "presente" : "neutro";

    saveState();
  }, 2000);
});

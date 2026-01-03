console.log("HUMAN — metas humanas ativas");

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
let state = "neutro";

let presenceUnlocked = false;
let calmUnlocked = false;
let stabilityUnlocked = false;

const BASE_RATE = 0.000006;
const MAX_RATE = 0.00002;

function humanRate(seconds) {
  let r = BASE_RATE * Math.log(seconds + 2);
  if (stabilityUnlocked) r *= 1.15;

  const noise = (Math.random() - 0.5) * r * 0.25;
  r += noise;

  return Math.min(MAX_RATE, Math.max(BASE_RATE * 0.4, r));
}

function updateVisual(rate) {
  const scale = 1 + (rate / MAX_RATE) * 0.08;
  sphere.style.transform = `scale(${scale})`;
}

function updateState(seconds) {
  // META 1 — presença
  if (seconds >= 300 && !presenceUnlocked) {
    presenceUnlocked = true;
    state = "presente";
  }

  // META 2 — calma
  if (seconds >= 120 && !calmUnlocked) {
    calmUnlocked = true;
    state = "calmo";
    document.body.classList.add("state-calm");
  }

  // META 3 — estabilidade
  if (seconds >= 600 && !stabilityUnlocked) {
    stabilityUnlocked = true;
    state = "estável";
    document.body.classList.add("state-stable");
  }

  stateEl.innerText = state;
}

startBtn.addEventListener("click", () => {
  if (started) return;
  started = true;

  startBtn.style.display = "none";
  info.style.display = "none";
  core.classList.remove("hidden");
  setTimeout(() => core.classList.add("show"), 50);

  startTime = Date.now();
  lastTick = startTime;

  setInterval(() => {
    const now = Date.now();
    const seconds = Math.floor((now - startTime) / 1000);
    const delta = (now - lastTick) / 1000;
    lastTick = now;

    const rate = humanRate(seconds);
    hum += rate * delta;

    timeEl.innerText = seconds + "s";
    humEl.innerText = hum.toFixed(5);

    updateVisual(rate);
    updateState(seconds);
  }, 1000);
});

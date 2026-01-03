// ESTADO HUMANO LOCAL (não depende de backend)
let started = false;
let seconds = 0;
let hum = 0;
let rateBase = 0.00001;

const enterBtn = document.getElementById("enterBtn");
const stats = document.getElementById("stats");
const timeEl = document.getElementById("time");
const humEl = document.getElementById("hum");
const stateEl = document.getElementById("state");
const core = document.getElementById("core");

// Ritmo humano não-linear
function humanRate() {
  const noise = Math.sin(Date.now() / 3000) * 0.5 + 0.5;
  return rateBase * (0.5 + noise);
}

// Loop vivo
function tick() {
  if (!started) return;

  seconds++;
  hum += humanRate();

  timeEl.textContent = seconds + "s";
  humEl.textContent = hum.toFixed(5);

  // Estados simbólicos
  if (seconds < 30) stateEl.textContent = "início";
  else if (seconds < 120) stateEl.textContent = "presente";
  else stateEl.textContent = "consistência";

  // micro-variação visual
  const scale = 1 + Math.sin(Date.now()/800) * 0.02;
  core.style.transform = `scale(${scale})`;
}

// BOTÃO ENTRAR — SEMPRE FUNCIONA
enterBtn.onclick = () => {
  if (started) return;

  started = true;
  enterBtn.classList.add("hidden");
  stats.classList.remove("hidden");
  document.getElementById("text").textContent =
    "Presença registada. HUM acumulado.";

  setInterval(tick, 1000);
};

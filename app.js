const STORAGE_KEY = "human_state_v13";
const BACKEND_URL = "https://human-backend-1.onrender.com";

let state = {
  started: false,
  time: 0,
  hum: 0,
  rate: 0.00002,
  days: {},
  checkins: {}
};

const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try { state = { ...state, ...JSON.parse(saved) }; } catch {}
}

const enterBtn = document.getElementById("enterBtn");
const dashboard = document.getElementById("dashboard");

const identityDays = document.getElementById("identityDays");
const identityState = document.getElementById("identityState");

const walletBalance = document.getElementById("walletBalance");

const goal7 = document.getElementById("goal7");
const goal30 = document.getElementById("goal30");
const goal7txt = document.getElementById("goal7txt");
const goal30txt = document.getElementById("goal30txt");

const checkinStatus = document.getElementById("checkinStatus");
const actionButtons = document.querySelectorAll(".actions button");

const mirrorTotal = document.getElementById("mirrorTotal");
const mirrorToday = document.getElementById("mirrorToday");
const mirrorText = document.getElementById("mirrorText");

enterBtn.onclick = () => {
  if (state.started) return;
  state.started = true;
  enterBtn.style.display = "none";
  dashboard.classList.remove("hidden");
  save();
  start();
  update();
  fetchMirror();
};

actionButtons.forEach(btn => {
  btn.onclick = () => {
    const mood = btn.dataset.mood;
    const today = todayKey();
    if (state.checkins[today]) return;
    state.checkins[today] = mood;
    checkinStatus.textContent = `Hoje registado como: ${mood}`;
    save();
  };
});

function start() {
  setInterval(() => {
    state.time++;
    state.hum += state.rate;
    checkDay();
    update();
    save();
  }, 1000);
}

function checkDay() {
  if (state.time < 300) return;
  const d = todayKey();
  if (!state.days[d]) state.days[d] = true;
}

function update() {
  const days = Object.keys(state.days).length;

  identityDays.textContent = days;
  identityState.textContent =
    days >= 30 ? "consistência profunda" :
    days >= 7 ? "consistência" :
    "presença";

  walletBalance.textContent = `${state.hum.toFixed(5)} HUM`;

  goal7.style.width = `${Math.min(days / 7, 1) * 100}%`;
  goal30.style.width = `${Math.min(days / 30, 1) * 100}%`;
  goal7txt.textContent = `${Math.min(days, 7)} / 7`;
  goal30txt.textContent = `${Math.min(days, 30)} / 30`;
}

function fetchMirror() {
  fetch(`${BACKEND_URL}/mirror`)
    .then(r => r.json())
    .then(d => {
      mirrorTotal.textContent = d.total_humans;
      mirrorToday.textContent = d.active_today;
      mirrorText.textContent =
        d.total_humans > 30
          ? "Existe continuidade coletiva."
          : "Outros humanos também estão aqui.";
    })
    .catch(() => {});
}

function todayKey() {
  return new Date().toISOString().slice(0,10);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

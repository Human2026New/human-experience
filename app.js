const STORAGE_KEY = "human_dashboard_v1";

let state = {
  started: false,
  hum: 0,
  time: 0,
  days: {},
  invites: []
};

const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try { state = { ...state, ...JSON.parse(saved) }; } catch {}
}

const enterBtn = document.getElementById("enterBtn");
const dashboard = document.getElementById("dashboard");
const humValue = document.getElementById("humValue");
const daysCount = document.getElementById("daysCount");
const timeSpent = document.getElementById("timeSpent");
const stateText = document.getElementById("stateText");

enterBtn.onclick = () => {
  state.started = true;
  enterBtn.style.display = "none";
  dashboard.classList.remove("hidden");
  save();
  startLoop();
};

function startLoop() {
  setInterval(() => {
    state.time++;
    state.hum += 0.00002;

    if (state.time >= 300) {
      const d = today();
      state.days[d] = true;
    }

    updateUI();
    save();
  }, 1000);
}

function updateUI() {
  humValue.textContent = `${state.hum.toFixed(5)} HUM`;
  daysCount.textContent = Object.keys(state.days).length;
  timeSpent.textContent = `${Math.floor(state.time / 60)} min`;
  stateText.textContent =
    Object.keys(state.days).length >= 7 ? "consistência" : "presença";
}

document.querySelectorAll(".menu button").forEach(btn => {
  btn.onclick = () => {
    document.getElementById(btn.dataset.open).classList.remove("hidden");
  };
});

document.querySelectorAll(".close").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".space").forEach(s => s.classList.add("hidden"));
  };
});

const inviteName = document.getElementById("inviteName");
const inviteList = document.getElementById("inviteList");
document.getElementById("createInvite").onclick = () => {
  const name = inviteName.value.trim();
  if (!name) return;
  state.invites.push(name);
  inviteName.value = "";
  renderInvites();
  save();
};

function renderInvites() {
  inviteList.innerHTML = "";
  state.invites.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n;
    inviteList.appendChild(li);
  });
}

function today() {
  return new Date().toISOString().slice(0,10);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

updateUI();
renderInvites();

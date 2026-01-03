const STORAGE_KEY = "human_state_v16";

let state = {
  started: false,
  time: 0,
  hum: 0,
  rate: 0.00002,
  days: {},
  userName: "",
  invites: []
};

const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try { state = { ...state, ...JSON.parse(saved) }; } catch {}
}

// Elements
const enterBtn = document.getElementById("enterBtn");
const home = document.getElementById("home");

const daysCount = document.getElementById("daysCount");
const stateText = document.getElementById("stateText");
const humValue = document.getElementById("humValue");

const walletSpace = document.getElementById("walletSpace");
const inviteSpace = document.getElementById("inviteSpace");

const openWallet = document.getElementById("openWallet");
const openInvites = document.getElementById("openInvites");

const walletBalance = document.getElementById("walletBalance");

const userNameInput = document.getElementById("userName");
const inviteNameInput = document.getElementById("inviteName");
const addInviteBtn = document.getElementById("addInvite");
const inviteList = document.getElementById("inviteList");
const inviteCount = document.getElementById("inviteCount");

// ENTER
enterBtn.onclick = () => {
  if (state.started) return;
  state.started = true;
  enterBtn.style.display = "none";
  home.classList.remove("hidden");
  save();
  startLoop();
  updateUI();
};

// Loop
function startLoop() {
  setInterval(() => {
    state.time++;
    state.hum += state.rate;
    checkDay();
    updateUI();
    save();
  }, 1000);
}

function checkDay() {
  if (state.time < 300) return;
  const d = todayKey();
  if (!state.days[d]) state.days[d] = true;
}

// UI
function updateUI() {
  const days = Object.keys(state.days).length;

  daysCount.textContent = days;
  stateText.textContent =
    days >= 30 ? "consistência profunda" :
    days >= 7 ? "consistência" :
    "presença";

  humValue.textContent = `${state.hum.toFixed(5)} HUM`;
  walletBalance.textContent = `${state.hum.toFixed(5)} HUM`;

  inviteList.innerHTML = "";
  state.invites.forEach(inv => {
    const li = document.createElement("li");
    li.textContent = inv.name;
    inviteList.appendChild(li);
  });

  inviteCount.textContent = `${state.invites.length} convite(s) criados`;
}

// Wallet
openWallet.onclick = () => {
  walletSpace.classList.remove("hidden");
};

// Invites
openInvites.onclick = () => {
  inviteSpace.classList.remove("hidden");
};

addInviteBtn.onclick = () => {
  const name = inviteNameInput.value.trim();
  if (!name) return;

  state.invites.push({
    name,
    created: new Date().toISOString()
  });

  inviteNameInput.value = "";
  save();
  updateUI();
};

// Close spaces
document.querySelectorAll(".closeSpace").forEach(btn => {
  btn.onclick = () => {
    walletSpace.classList.add("hidden");
    inviteSpace.classList.add("hidden");
  };
});

// Name
userNameInput.oninput = () => {
  state.userName = userNameInput.value.trim();
  save();
};

// Utils
function todayKey() {
  return new Date().toISOString().slice(0,10);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

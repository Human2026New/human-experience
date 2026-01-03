const STORAGE_KEY = "human_state_v19";

let state = {
  started: false,
  time: 0,
  hum: 0,
  baseRate: 0.00002,
  days: {},
  userName: "",
  invites: [] // { name, created, status }
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
const humContainer = document.getElementById("humContainer");
const bonusText = document.getElementById("bonusText");

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
    state.hum += getCurrentRate();
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

// Bónus simbólico
function getCurrentRate() {
  const activeFriends = state.invites.filter(i => i.status === "ativo").length;
  const bonus = Math.min(activeFriends * 0.05, 0.30);
  return state.baseRate * (1 + bonus);
}

// UI
function updateUI() {
  const days = Object.keys(state.days).length;
  const activeFriends = state.invites.filter(i => i.status === "ativo").length;

  daysCount.textContent = days;

  let symbolicState = "presença";
  if (activeFriends >= 1) symbolicState = "presença partilhada";
  if (activeFriends >= 3) symbolicState = "presença ampliada";

  stateText.textContent = symbolicState;

  humValue.textContent = `${state.hum.toFixed(5)} HUM`;
  walletBalance.textContent = `${state.hum.toFixed(5)} HUM`;

  // Bónus visual
  if (activeFriends > 0) {
    humContainer.classList.add("bonus");
    bonusText.textContent =
      activeFriends === 1
        ? "A tua presença está a ser partilhada."
        : "A tua presença está a crescer com outros.";
  } else {
    humContainer.classList.remove("bonus");
    bonusText.textContent = "";
  }

  // Convites
  inviteList.innerHTML = "";
  state.invites.forEach(inv => {
    const li = document.createElement("li");
    li.textContent = `${inv.name} — ${inv.status}`;
    inviteList.appendChild(li);
  });

  inviteCount.textContent =
    `${state.invites.length} convite(s) • ${activeFriends} ativo(s)`;
}

// Spaces
openWallet.onclick = () => walletSpace.classList.remove("hidden");
openInvites.onclick = () => inviteSpace.classList.remove("hidden");

document.querySelectorAll(".closeSpace").forEach(btn => {
  btn.onclick = () => {
    walletSpace.classList.add("hidden");
    inviteSpace.classList.add("hidden");
  };
});

// Convites
addInviteBtn.onclick = () => {
  const name = inviteNameInput.value.trim();
  if (!name) return;

  state.invites.push({
    name,
    created: new Date().toISOString(),
    status: "convidado"
  });

  inviteNameInput.value = "";
  save();
  updateUI();
};

// Simulação simples:
// após 2 dias, convite passa a "ativo"
setInterval(() => {
  state.invites.forEach(inv => {
    if (inv.status === "convidado") {
      inv.status = "ativo";
    }
  });
}, 60000);

// Nome
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

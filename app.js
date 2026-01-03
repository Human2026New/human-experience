// =====================================================
// HUMAN — app.js FINAL REAL (até PASSO 14)
// =====================================================

const STORAGE_KEY = "human_state_v20";
const BACKEND_URL = "https://human-backend-1.onrender.com";

// --------------------
// Identidade técnica anónima
// --------------------
let anon_id = localStorage.getItem("human_anon_id");
if (!anon_id) {
  anon_id = crypto.randomUUID();
  localStorage.setItem("human_anon_id", anon_id);
}

// --------------------
// State global (LOCAL-FIRST)
// --------------------
let state = {
  started: false,
  time: 0,
  hum: 0,
  baseRate: 0.00002,
  days: {},

  userName: "",

  // Convites locais (espelho humano)
  invites: [
    // { name, code, status: convidado | entrou | ativo }
  ],

  // Wallet futura
  wallet: {
    id: null,
    chain: null,
    address: null,
    status: "local" // local | ready | linked
  }
};

// --------------------
// Load local
// --------------------
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    state = { ...state, ...JSON.parse(saved) };
  } catch {}
}

// --------------------
// Elements
// --------------------
const enterBtn = document.getElementById("enterBtn");
const home = document.getElementById("home");

const daysCount = document.getElementById("daysCount");
const stateText = document.getElementById("stateText");
const humValue = document.getElementById("humValue");
const humContainer = document.getElementById("humContainer");
const bonusText = document.getElementById("bonusText");

const openWallet = document.getElementById("openWallet");
const openInvites = document.getElementById("openInvites");

const walletSpace = document.getElementById("walletSpace");
const walletBalance = document.getElementById("walletBalance");
const walletStatus = document.getElementById("walletStatus");

const inviteSpace = document.getElementById("inviteSpace");
const userNameInput = document.getElementById("userName");
const inviteNameInput = document.getElementById("inviteName");
const addInviteBtn = document.getElementById("addInvite");
const inviteList = document.getElementById("inviteList");
const inviteCount = document.getElementById("inviteCount");

// --------------------
// ENTER
// --------------------
enterBtn.onclick = () => {
  if (state.started) return;

  state.started = true;
  enterBtn.style.display = "none";
  home.classList.remove("hidden");

  save();
  startLoop();
  updateUI();

  // primeira presença real
  syncPresence();
  fetchFriends();
};

// --------------------
// LOOP HUMANO (1s)
// --------------------
function startLoop() {
  setInterval(() => {
    state.time++;
    state.hum += getCurrentRate();

    checkDay();
    updateUI();
    save();

    // sincronizações suaves
    if (state.time % 30 === 0) {
      syncPresence();
      fetchFriends();
    }
  }, 1000);
}

// --------------------
// DIA HUMANO (>=5min)
// --------------------
function checkDay() {
  if (state.time < 300) return;
  const today = todayKey();
  if (!state.days[today]) state.days[today] = true;
}

// --------------------
// BÓNUS REAL (amigos ativos)
// --------------------
function getCurrentRate() {
  const activeFriends =
    state.invites.filter(i => i.status === "ativo").length;

  const bonus = Math.min(activeFriends * 0.05, 0.30);
  return state.baseRate * (1 + bonus);
}

// --------------------
// UI
// --------------------
function updateUI() {
  const days = Object.keys(state.days).length;
  const activeFriends =
    state.invites.filter(i => i.status === "ativo").length;

  daysCount.textContent = days;

  let symbolicState = "presença";
  if (activeFriends >= 1) symbolicState = "presença partilhada";
  if (activeFriends >= 3) symbolicState = "presença ampliada";

  stateText.textContent = symbolicState;

  humValue.textContent = `${state.hum.toFixed(5)} HUM`;
  walletBalance.textContent = `${state.hum.toFixed(5)} HUM`;
  walletStatus.textContent = state.wallet.status;

  // Bónus simbólico visual
  if (activeFriends > 0) {
    humContainer.classList.add("bonus");
    bonusText.textContent =
      activeFriends === 1
        ? "A tua presença está a ser partilhada."
        : "A tua presença cresce com outros.";
  } else {
    humContainer.classList.remove("bonus");
    bonusText.textContent = "";
  }

  // Convites (lista humana)
  inviteList.innerHTML = "";
  state.invites.forEach(inv => {
    const li = document.createElement("li");
    li.textContent = `${inv.name} — ${inv.status}`;
    inviteList.appendChild(li);
  });

  inviteCount.textContent =
    `${state.invites.length} convite(s) • ${activeFriends} ativo(s)`;
}

// --------------------
// SPACES
// --------------------
openWallet.onclick = () => walletSpace.classList.remove("hidden");
openInvites.onclick = () => inviteSpace.classList.remove("hidden");

document.querySelectorAll(".closeSpace").forEach(btn => {
  btn.onclick = () => {
    walletSpace.classList.add("hidden");
    inviteSpace.classList.add("hidden");
  };
});

// --------------------
// WALLET FUTURA (ponte)
// --------------------
const prepareWalletBtn = document.getElementById("prepareWallet");
if (prepareWalletBtn) {
  prepareWalletBtn.onclick = () => {
    if (state.wallet.status !== "local") return;

    state.wallet.id = crypto.randomUUID();
    state.wallet.status = "ready";
    state.wallet.chain = "undecided";
    state.wallet.address = null;

    save();
    updateUI();
  };
}

// --------------------
// CONVITES REAIS
// --------------------
addInviteBtn.onclick = () => {
  const name = inviteNameInput.value.trim();
  if (!name) return;

  const code = crypto.randomUUID().slice(0, 8);

  state.invites.push({
    name,
    code,
    status: "convidado"
  });

  inviteNameInput.value = "";
  save();
  updateUI();

  // enviar ao backend (fire-and-forget)
  fetch(`${BACKEND_URL}/invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      invite_code: code,
      inviter_id: anon_id
    })
  }).catch(() => {});
};

// --------------------
// PRESENÇA REAL (backend)
// --------------------
function syncPresence(invite_code = null) {
  fetch(`${BACKEND_URL}/presence`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      anon_id,
      invite_code
    })
  }).catch(() => {});
}

// --------------------
// AMIGOS REAIS (backend)
// --------------------
function fetchFriends() {
  fetch(`${BACKEND_URL}/friends/${anon_id}`)
    .then(r => r.json())
    .then(data => {
      // atualizar estados locais com base no backend
      state.invites.forEach(inv => {
        if (inv.status === "convidado" && data.total > 0) {
          inv.status = "entrou";
        }
        if (inv.status === "entrou" && data.active_today > 0) {
          inv.status = "ativo";
        }
      });
      save();
      updateUI();
    })
    .catch(() => {});
}

// --------------------
// Nome do utilizador
// --------------------
userNameInput.oninput = () => {
  state.userName = userNameInput.value.trim();
  save();
};

// --------------------
// Utils
// --------------------
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

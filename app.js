// =====================================================
// HUMAN — app.js FINAL (PASSO 15 — TON TESTNET)
// =====================================================

const STORAGE_KEY = "human_state_v21";
const BACKEND_URL = "https://human-backend-1.onrender.com";

// --------------------
// Anon ID
// --------------------
let anon_id = localStorage.getItem("human_anon_id");
if (!anon_id) {
  anon_id = crypto.randomUUID();
  localStorage.setItem("human_anon_id", anon_id);
}

// --------------------
// State
// --------------------
let state = {
  started: false,
  time: 0,
  hum: 0,
  baseRate: 0.00002,
  days: {},

  userName: "",
  invites: [],

  wallet: {
    status: "local",   // local | linked
    chain: null,       // "ton"
    address: null
  }
};

// --------------------
// Load local
// --------------------
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try { state = { ...state, ...JSON.parse(saved) }; } catch {}
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
const walletAddress = document.getElementById("walletAddress");

const inviteSpace = document.getElementById("inviteSpace");
const userNameInput = document.getElementById("userName");
const inviteNameInput = document.getElementById("inviteName");
const addInviteBtn = document.getElementById("addInvite");
const inviteList = document.getElementById("inviteList");
const inviteCount = document.getElementById("inviteCount");

// --------------------
// TON CONNECT INIT
// --------------------
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://your-domain-or-github-pages/tonconnect-manifest.json",
  buttonRootId: "tonConnectButton",
  network: "testnet"
});

tonConnectUI.onStatusChange(wallet => {
  if (wallet) {
    state.wallet.status = "linked";
    state.wallet.chain = "ton";
    state.wallet.address = wallet.account.address;
  } else {
    state.wallet.status = "local";
    state.wallet.chain = null;
    state.wallet.address = null;
  }
  save();
  updateUI();
});

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

  syncPresence();
  fetchFriends();
};

// --------------------
// Loop humano
// --------------------
function startLoop() {
  setInterval(() => {
    state.time++;
    state.hum += getCurrentRate();

    checkDay();
    updateUI();
    save();

    if (state.time % 30 === 0) {
      syncPresence();
      fetchFriends();
    }
  }, 1000);
}

// --------------------
// Dia humano
// --------------------
function checkDay() {
  if (state.time < 300) return;
  const d = todayKey();
  if (!state.days[d]) state.days[d] = true;
}

// --------------------
// Bónus por amigos ativos
// --------------------
function getCurrentRate() {
  const active = state.invites.filter(i => i.status === "ativo").length;
  const bonus = Math.min(active * 0.05, 0.30);
  return state.baseRate * (1 + bonus);
}

// --------------------
// UI
// --------------------
function updateUI() {
  const days = Object.keys(state.days).length;
  const active = state.invites.filter(i => i.status === "ativo").length;

  daysCount.textContent = days;

  let symbolic = "presença";
  if (active >= 1) symbolic = "presença partilhada";
  if (active >= 3) symbolic = "presença ampliada";
  stateText.textContent = symbolic;

  humValue.textContent = `${state.hum.toFixed(5)} HUM`;
  walletBalance.textContent = `${state.hum.toFixed(5)} HUM`;

  walletStatus.textContent = state.wallet.status;
  walletAddress.textContent =
    state.wallet.address
      ? shorten(state.wallet.address)
      : "—";

  if (active > 0) {
    humContainer.classList.add("bonus");
    bonusText.textContent = "A tua presença cresce com outros.";
  } else {
    humContainer.classList.remove("bonus");
    bonusText.textContent = "";
  }

  inviteList.innerHTML = "";
  state.invites.forEach(inv => {
    const li = document.createElement("li");
    li.textContent = `${inv.name} — ${inv.status}`;
    inviteList.appendChild(li);
  });

  inviteCount.textContent =
    `${state.invites.length} convite(s) • ${active} ativo(s)`;
}

// --------------------
// Spaces
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
// Convites
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
// Backend sync
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

function fetchFriends() {
  fetch(`${BACKEND_URL}/friends/${anon_id}`)
    .then(r => r.json())
    .then(data => {
      state.invites.forEach(inv => {
        if (inv.status === "convidado" && data.total > 0) inv.status = "entrou";
        if (inv.status === "entrou" && data.active_today > 0) inv.status = "ativo";
      });
      save();
      updateUI();
    })
    .catch(() => {});
}

// --------------------
// Nome
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

function shorten(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const STORAGE_KEY = "human_state_v22";
const BACKEND_URL = "https://human-backend-1.onrender.com";

// --------------------
// anon id
// --------------------
let anon_id = localStorage.getItem("human_anon_id");
if (!anon_id) {
  anon_id = crypto.randomUUID();
  localStorage.setItem("human_anon_id", anon_id);
}

// --------------------
// state
// --------------------
let state = {
  started: false,
  time: 0,
  hum: 0,
  baseRate: 0.00002,
  days: {},

  invites: [],

  wallet: {
    status: "local",
    chain: null,
    address: null
  },

  profile: {
    public: false,
    id: null,
    name: "",
    note: ""
  }
};

// --------------------
// load
// --------------------
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try { state = { ...state, ...JSON.parse(saved) }; } catch {}
}

// --------------------
// elements
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
const openProfile = document.getElementById("openProfile");

const walletSpace = document.getElementById("walletSpace");
const walletBalance = document.getElementById("walletBalance");
const walletStatus = document.getElementById("walletStatus");
const walletAddress = document.getElementById("walletAddress");

const inviteSpace = document.getElementById("inviteSpace");
const inviteNameInput = document.getElementById("inviteName");
const addInviteBtn = document.getElementById("addInvite");
const inviteList = document.getElementById("inviteList");
const inviteCount = document.getElementById("inviteCount");

const profileSpace = document.getElementById("profileSpace");
const profilePublic = document.getElementById("profilePublic");
const profileName = document.getElementById("profileName");
const profileNote = document.getElementById("profileNote");
const profileId = document.getElementById("profileId");

// --------------------
// TON CONNECT
// --------------------
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://your-domain/tonconnect-manifest.json",
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
// enter
// --------------------
enterBtn.onclick = () => {
  if (state.started) return;
  state.started = true;
  enterBtn.style.display = "none";
  home.classList.remove("hidden");
  save();
  startLoop();
  updateUI();
};

// --------------------
// loop
// --------------------
function startLoop() {
  setInterval(() => {
    state.time++;
    state.hum += state.baseRate;
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

// --------------------
// ui
// --------------------
function updateUI() {
  const days = Object.keys(state.days).length;

  daysCount.textContent = days;
  stateText.textContent = days >= 7 ? "consistência" : "presença";
  humValue.textContent = `${state.hum.toFixed(5)} HUM`;
  walletBalance.textContent = `${state.hum.toFixed(5)} HUM`;

  walletStatus.textContent = state.wallet.status;
  walletAddress.textContent =
    state.wallet.address ? shorten(state.wallet.address) : "—";

  profilePublic.checked = state.profile.public;
  profileName.value = state.profile.name;
  profileNote.value = state.profile.note;
  profileId.textContent = state.profile.id ?? "—";

  inviteList.innerHTML = "";
  state.invites.forEach(inv => {
    const li = document.createElement("li");
    li.textContent = inv.name;
    inviteList.appendChild(li);
  });

  inviteCount.textContent = `${state.invites.length} convite(s)`;
}

// --------------------
// spaces
// --------------------
openWallet.onclick = () => walletSpace.classList.remove("hidden");
openInvites.onclick = () => inviteSpace.classList.remove("hidden");
openProfile.onclick = () => profileSpace.classList.remove("hidden");

document.querySelectorAll(".closeSpace").forEach(btn => {
  btn.onclick = () => {
    walletSpace.classList.add("hidden");
    inviteSpace.classList.add("hidden");
    profileSpace.classList.add("hidden");
  };
});

// --------------------
// profile logic
// --------------------
profilePublic.onchange = () => {
  state.profile.public = profilePublic.checked;
  if (state.profile.public && !state.profile.id) {
    state.profile.id = crypto.randomUUID().slice(0, 8);
  }
  save();
};

profileName.oninput = () => {
  state.profile.name = profileName.value.trim();
  save();
};

profileNote.oninput = () => {
  state.profile.note = profileNote.value.trim();
  save();
};

// --------------------
// invites
// --------------------
addInviteBtn.onclick = () => {
  const name = inviteNameInput.value.trim();
  if (!name) return;
  state.invites.push({ name });
  inviteNameInput.value = "";
  save();
  updateUI();
};

// --------------------
// utils
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

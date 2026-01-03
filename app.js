// =====================================================
// HUMAN — app.js COMPLETO (Browser + Telegram SAFE)
// =====================================================

// --------------------
// Config
// --------------------
const STORAGE_KEY = "human_state_v11";
const BACKEND_URL = "https://human-backend-1.onrender.com"; // 🔁 altera

// --------------------
// Detect Telegram
// --------------------
const isTelegram = !!window.Telegram?.WebApp;
if (isTelegram) {
  try {
    Telegram.WebApp.ready();
  } catch {}
}

// --------------------
// State
// --------------------
let state = {
  started: false,
  time: 0,
  hum: 0,
  rate: 0.00002,
  sessions: 0,
  days: {},
  checkins: {},
  invites: [],
  identity: { name: "" }
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

// ⚠️ REGRA CRÍTICA:
// No Telegram, nunca confiar em started automático
if (isTelegram) {
  state.started = false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// --------------------
// Elements
// --------------------
const enterBtn = document.getElementById("enterBtn");

const timeEl = document.getElementById("time");
const humEl = document.getElementById("hum");
const stateEl = document.getElementById("state");
const statusMsg = document.getElementById("statusMsg");

const goal7 = document.getElementById("goal7");
const goal30 = document.getElementById("goal30");
const goal7txt = document.getElementById("goal7txt");
const goal30txt = document.getElementById("goal30txt");

const checkinButtons = document.querySelectorAll(".checkin-options button");
const checkinStatus = document.getElementById("checkinStatus");

const walletBalance = document.getElementById("walletBalance");
const walletState = document.getElementById("walletState");

const inviteInput = document.getElementById("inviteInput");
const inviteBtn = document.getElementById("inviteBtn");
const inviteStatus = document.getElementById("inviteStatus");
const inviteCount = document.getElementById("inviteCount");

const identityName = document.getElementById("identityName");
const identityAge = document.getElementById("identityAge");
const identityState = document.getElementById("identityState");
const identityPhrase = document.getElementById("identityPhrase");

const mirrorTotal = document.getElementById("mirrorTotal");
const mirrorToday = document.getElementById("mirrorToday");
const mirrorText = document.getElementById("mirrorText");

// --------------------
// anon_id (técnico, anónimo)
// --------------------
let anon_id = localStorage.getItem("human_anon_id");
if (!anon_id) {
  anon_id = crypto.randomUUID();
  localStorage.setItem("human_anon_id", anon_id);
}

// --------------------
// ENTER (ÚNICA FORMA DE ARRANQUE)
// --------------------
enterBtn.onclick = () => {
  if (state.started) return;

  state.started = true;
  state.sessions += 1;

  enterBtn.style.display = "none";
  document.querySelectorAll(".hidden").forEach(el =>
    el.classList.remove("hidden")
  );

  saveLocal();
  startLoop();
  restoreCheckin();
  restoreIdentity();
  updateUI();

  syncPresence();
  fetchMirror();
};

// --------------------
// Loop humano
// --------------------
function startLoop() {
  setInterval(() => {
    state.time += 1;

    const drift = (Math.random() - 0.5) * 0.00001;
    state.hum += Math.max(0, state.rate + drift);

    checkDay();
    updateUI();
    saveLocal();

    if (state.time % 30 === 0) {
      syncPresence();
      fetchMirror();
    }
  }, 1000);
}

// --------------------
// Dia humano (>=5min)
// --------------------
function checkDay() {
  if (state.time < 300) return;
  const today = todayKey();
  if (!state.days[today]) {
    state.days[today] = true;
  }
}

// --------------------
// Check-in consciente
// --------------------
checkinButtons.forEach(btn => {
  btn.onclick = () => {
    const today = todayKey();
    if (state.checkins[today]) return;

    const mood = btn.dataset.mood;
    state.checkins[today] = mood;

    checkinStatus.textContent = `Hoje foi: ${mood}`;
    stateEl.textContent = mood;

    saveLocal();
    syncPresence();
  };
});

function restoreCheckin() {
  const today = todayKey();
  if (state.checkins[today]) {
    checkinStatus.textContent = `Hoje foi: ${state.checkins[today]}`;
    stateEl.textContent = state.checkins[today];
  }
}

// --------------------
// Identidade
// --------------------
function restoreIdentity() {
  identityName.value = state.identity.name || "";
}

identityName.oninput = () => {
  state.identity.name = identityName.value.trim();
  saveLocal();
};

// --------------------
// Convites humanos
// --------------------
inviteBtn.onclick = () => {
  state.invites.push({
    name: inviteInput.value || "humano",
    code: crypto.randomUUID(),
    date: new Date().toISOString()
  });

  inviteInput.value = "";
  inviteStatus.textContent = "Convite humano registado.";

  saveLocal();
  syncPresence();
};

// --------------------
// UI update
// --------------------
function updateUI() {
  const days = Object.keys(state.days).length;

  timeEl.textContent = `${state.time}s`;
  humEl.textContent = state.hum.toFixed(5);

  const symbolic =
    days >= 30 ? "consistência profunda" :
    days >= 7 ? "consistência" :
    "presença";

  if (!state.checkins[todayKey()]) {
    stateEl.textContent = symbolic;
  }

  goal7.style.width = `${Math.min(days / 7, 1) * 100}%`;
  goal30.style.width = `${Math.min(days / 30, 1) * 100}%`;
  goal7txt.textContent = `${Math.min(days, 7)} / 7`;
  goal30txt.textContent = `${Math.min(days, 30)} / 30`;

  walletBalance.textContent = `${state.hum.toFixed(5)} HUM`;
  walletState.textContent =
    state.hum >= 1 ? "saldo profundo" :
    state.hum >= 0.1 ? "saldo consistente" :
    "saldo em crescimento";

  inviteCount.textContent = state.invites.length;

  identityAge.textContent = `${days} dias`;
  identityState.textContent = symbolic;
  identityPhrase.textContent =
    days >= 30 ? "Construiu presença profunda." :
    days >= 7 ? "Volta com consistência." :
    "Começou a estar presente.";
}

// =====================================================
// BACKEND — FIRE & FORGET
// =====================================================
function syncPresence() {
  if (!BACKEND_URL) return;

  const days = Object.keys(state.days).length;
  const symbolic =
    days >= 30 ? "consistência profunda" :
    days >= 7 ? "consistência" :
    "presença";

  try {
    fetch(`${BACKEND_URL}/presence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anon_id,
        days,
        hum: Number(state.hum.toFixed(5)),
        symbolic_state: symbolic
      })
    });
  } catch {}
}

function fetchMirror() {
  if (!BACKEND_URL) return;

  try {
    fetch(`${BACKEND_URL}/mirror`)
      .then(r => r.json())
      .then(data => {
        mirrorTotal.textContent = data.total_humans ?? "–";
        mirrorToday.textContent = data.active_today ?? "–";

        mirrorText.textContent =
          data.total_humans > 30
            ? "Existe continuidade coletiva."
            : "Outros humanos também estão aqui.";
      });
  } catch {}
}

// --------------------
// Utils
// --------------------
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

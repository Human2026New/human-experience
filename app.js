/* =========================
   HUMAN — app.js FINAL
   Fonte: Backend (/hum/status)
   ========================= */

const API_BASE = "https://TEU_BACKEND.render.com"; // altera
const STORAGE_KEY = "human_app_state_v1";

/* ---------- STATE ---------- */
let state = {
  hum: 0,
  mining_today: false,
  phase: 0,
  percent: 0,
  price: 0,
  last_sync: null
};

/* ---------- ELEMENTS ---------- */
const humValue = document.getElementById("humValue");
const phaseText = document.getElementById("phaseText");
const percentText = document.getElementById("percentText");
const buyBtn = document.getElementById("buyHumBtn");
const convertBtn = document.getElementById("humToTon");
const protocolText = document.getElementById("protocolText");

/* ---------- LOAD ---------- */
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) state = { ...state, ...JSON.parse(saved) };

/* ---------- SYNC STATUS ---------- */
async function syncStatus() {
  try {
    const r = await fetch(`${API_BASE}/hum/status`);
    const d = await r.json();

    state.phase = d.phase;
    state.percent = d.percent_mined;
    state.price = d.price_hum;
    state.rules = d.rules;

    updateUI();
    save();
  } catch (e) {
    console.warn("Offline /hum/status");
  }
}

/* ---------- UI ---------- */
function updateUI() {
  humValue.textContent = state.hum.toFixed(5) + " HUM";
  percentText.textContent = state.percent.toFixed(2) + "% minerado";

  phaseText.textContent =
    state.phase === 0 ? "Fase 0 — Génese" :
    state.phase === 1 ? "Fase 1 — Ativação" :
    "Fase 2 — Circulação";

  buyBtn.disabled = !state.rules.buy;
  convertBtn.disabled = !state.rules.convert;

  protocolText.textContent =
    state.phase === 0
      ? "HUM está em fase génese. Conversão bloqueada."
      : state.phase === 1
      ? "Levantamento limitado. Conversão bloqueada."
      : "Conversão ativa.";
}

/* ---------- MINERAÇÃO (frontend apenas visual) ---------- */
function startPresenceTimer() {
  setInterval(() => {
    state.hum += 0.00002;
    updateUI();
    save();
  }, 1000);
}

/* ---------- BUY ---------- */
buyBtn.onclick = async () => {
  const amount = Number(document.getElementById("buyHumAmount").value);
  if (amount <= 0) return alert("Quantidade inválida");

  const r = await fetch(`${API_BASE}/hum/buy/prepare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      telegram_id: Telegram.WebApp.initDataUnsafe.user.id,
      hum_amount: amount
    })
  });

  const d = await r.json();

  Telegram.WebApp.openLink(
    `ton://transfer/${d.ton_address}?amount=${d.ton_amount}&text=${encodeURIComponent(d.payload)}`
  );
};

/* ---------- SAVE ---------- */
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- INIT ---------- */
syncStatus();
setInterval(syncStatus, 30000);
startPresenceTimer();

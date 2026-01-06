/* =========================
   HUMAN — app.js FINAL
   Backend-synced
   ========================= */

const API_BASE = "https://TEU_BACKEND_RENDER_URL"; // 🔴 ALTERA SÓ ISTO
const STORAGE_KEY = "human_app_state_v1";

/* ---------- STATE ---------- */
let state = {
  telegram_id: null,
  hum: 0,
  phase: 0,
  phase_name: "Génese",
  mined_percent: 0,
  hum_price_eur: 0,
  can_buy: false,
  can_convert: false,
  mining_active: false
};

/* ---------- HELPERS ---------- */
const $ = id => document.getElementById(id);

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function load() {
  const s = localStorage.getItem(STORAGE_KEY);
  if (s) {
    try {
      state = { ...state, ...JSON.parse(s) };
    } catch {}
  }
}

/* ---------- TELEGRAM ---------- */
if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.ready();
  state.telegram_id = String(Telegram.WebApp.initDataUnsafe?.user?.id || "");
}

/* ---------- FETCH STATUS ---------- */
async function fetchStatus() {
  if (!state.telegram_id) return;

  try {
    const r = await fetch(
      `${API_BASE}/hum/status?telegram_id=${state.telegram_id}`
    );
    const d = await r.json();

    state.phase = d.phase;
    state.phase_name = d.phase_name;
    state.mined_percent = d.mined_percent;
    state.hum_price_eur = d.hum_price_eur;
    state.can_buy = d.can_buy;
    state.can_convert = d.can_convert;
    state.hum = d.user?.hum || state.hum;

    updateUI();
    save();
  } catch (e) {
    console.error("STATUS ERROR", e);
  }
}

/* ---------- UI ---------- */
function updateUI() {
  $("humValue").textContent = state.hum.toFixed(5) + " HUM";

  $("phaseText").textContent =
    `Fase ${state.phase} — ${state.phase_name}`;

  $("percentText").textContent =
    state.mined_percent.toFixed(4) + "% minerado";

  $("priceText").textContent =
    state.hum_price_eur.toFixed(4) + " € / HUM";

  $("buyStatus").textContent = state.can_buy
    ? "Compra ativa"
    : "Compra bloqueada";

  $("convertStatus").textContent = state.can_convert
    ? "Conversão ativa"
    : "Conversão bloqueada";

  $("humState").textContent =
    state.can_convert
      ? "HUM ativo"
      : "HUM guardado (dormente)";
}

/* ---------- COMPRA HUM ---------- */
$("buyHumBtn").onclick = async () => {
  const amount = Number($("buyHumAmount").value);

  if (!amount || amount <= 0) {
    alert("Quantidade inválida");
    return;
  }

  if (!state.can_buy) {
    alert("Compra bloqueada nesta fase");
    return;
  }

  try {
    const r = await fetch(`${API_BASE}/hum/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegram_id: state.telegram_id,
        hum_amount: amount
      })
    });

    const d = await r.json();

    if (d.status === "ok") {
      state.hum += amount;
      updateUI();
      save();
      alert("HUM creditado com sucesso");
    } else {
      alert("Erro na compra");
    }
  } catch {
    alert("Erro de ligação");
  }
};

/* ---------- INIT ---------- */
load();
fetchStatus();
setInterval(fetchStatus, 10_000);

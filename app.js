/* =========================
   HUMAN — app.js (BACKEND)
   ========================= */

const STORAGE_KEY = "human_app_backend";
const BACKEND_URL = "http://localhost:3000";

/* ---------- STATE ---------- */
let state = {
  telegram_id: null,
  hum: 0,
  phase: 0,
  mined_percent: 0,
  can_buy: false,
  can_convert: false,
  can_withdraw: false,
  message: ""
};

/* ---------- HELPERS ---------- */
const $ = id => document.getElementById(id);

/* ---------- ELEMENTS ---------- */
const enterBtn = $("enterBtn");
const dashboard = $("dashboard");
const humValue = $("humValue");
const eurValue = $("eurValue");
const usdValue = $("usdValue");
const tonValue = $("tonValue");
const presenceCount = $("presenceCount");

/* Exchange / Buy */
const buyHumAmount = $("buyHumAmount");
const buyTonEstimate = $("buyTonEstimate");
const buyHumBtn = $("buyHumBtn");

const exchangeHum = $("exchangeHum");
const exchangeTon = $("exchangeTon");
const humToTonBtn = $("humToTon");
const tonToHumBtn = $("tonToHum");

/* ---------- TELEGRAM ID ---------- */
function resolveTelegramId() {
  if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe?.user) {
    return String(Telegram.WebApp.initDataUnsafe.user.id);
  }
  return "demo_user";
}

/* ---------- BACKEND ---------- */
async function fetchStatus() {
  const url = `${BACKEND_URL}/hum/status?telegram_id=${state.telegram_id}`;
  const r = await fetch(url);
  const d = await r.json();

  state = { ...state, ...d };
  save();
  updateUI();
}

/* ---------- ENTER ---------- */
if (enterBtn) {
  enterBtn.onclick = async () => {
    enterBtn.style.display = "none";
    dashboard.classList.remove("hidden");

    state.telegram_id = resolveTelegramId();
    await fetchStatus();
  };
}

/* ---------- UI ---------- */
function updateUI() {
  humValue.textContent = state.hum.toFixed(5) + " HUM";

  presenceCount.textContent =
    state.phase === 0
      ? "Fase 0 — Génese"
      : state.phase === 1
      ? "Fase 1 — Maturação"
      : "Fase 2 — Conversão ativa";

  eurValue.textContent = "—";
  usdValue.textContent = "—";
  tonValue.textContent = "—";

  if (exchangeHum)
    exchangeHum.textContent = state.hum.toFixed(5) + " HUM";

  if (exchangeTon)
    exchangeTon.textContent = state.can_convert
      ? "Conversão disponível"
      : "Bloqueada até Fase 2";

  // Comprar HUM
  if (buyHumBtn) {
    buyHumBtn.disabled = !state.can_buy;
    buyHumBtn.textContent = state.can_buy
      ? "Comprar HUM"
      : "Compra indisponível";
  }

  // Conversão
  if (humToTonBtn) {
    humToTonBtn.disabled = !state.can_convert;
  }
}

/* ---------- COMPRA HUM (placeholder) ---------- */
if (buyHumBtn) {
  buyHumBtn.onclick = () => {
    if (!state.can_buy) {
      alert("Compra de HUM indisponível nesta fase.");
      return;
    }

    alert(
      "Compra registada.\n\n" +
      "O backend validará a transação TON\n" +
      "e creditará HUM automaticamente."
    );
  };
}

/* ---------- CONVERSÃO ---------- */
if (humToTonBtn) {
  humToTonBtn.onclick = () => {
    if (!state.can_convert) {
      alert("Conversão bloqueada até Fase 2.");
      return;
    }

    alert("Conversão HUM → TON será ativada na Fase 2.");
  };
}

/* ---------- STORAGE ---------- */
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- SPLASH ---------- */
window.addEventListener("load", () => {
  const splash = $("mainnetSplash");
  if (!splash) return;
  setTimeout(() => (splash.style.display = "none"), 2000);
});

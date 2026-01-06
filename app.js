/* =========================
   HUMAN — app.js (FASE B)
   Compras HUM + Fases
   ========================= */

const STORAGE_KEY = "human_app_v7";

/* ---------- BACKEND ---------- */
const BACKEND_URL = "http://localhost:3000";

/* ---------- WALLET OFICIAL HUM ---------- */
const HUM_WALLET =
  "EQCC2LH8-sEap7cfMZZIJOSVQ2aTWNUYIUEEKD8GeRYpB7oU";

/* ---------- STATE ---------- */
let state = {
  started: false,
  hum: 0,
  humStatus: "dormente",
  phase: 0,
  minedPercent: 0,
  priceEUR: 0.05,
  tonSim: 0,
  time: 0,
  days: {},
  tasks: [],
  taskDay: null
};

/* ---------- LOAD ---------- */
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    state = { ...state, ...JSON.parse(saved) };
  } catch {}
}

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

/* BUY */
const buyHumAmount = $("buyHumAmount");
const buyTonEstimate = $("buyTonEstimate");
const buyHumBtn = $("buyHumBtn");

/* STATUS TEXTS */
const exchangeHum = $("exchangeHum");
const exchangeTon = $("exchangeTon");

/* ---------- FETCH HUM STATUS ---------- */
async function fetchHumStatus() {
  try {
    const r = await fetch(`${BACKEND_URL}/hum/status`);
    const d = await r.json();

    state.phase = d.phase;
    state.minedPercent = d.minedPercent;

    const priceRes = await fetch(`${BACKEND_URL}/hum/price`);
    const p = await priceRes.json();
    state.priceEUR = p.priceEUR;

    updateUI();
    save();
  } catch (e) {
    console.warn("Backend indisponível");
  }
}

/* ---------- TON PRICE ---------- */
let tonEurPrice = 0;

async function fetchTonPrice() {
  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=eur,usd"
    );
    const d = await r.json();
    tonEurPrice = d["the-open-network"].eur;
    updateUI();
  } catch {}
}

/* ---------- PRICE HELPERS ---------- */
function humToTonRate() {
  if (!tonEurPrice) return 0;
  return state.priceEUR / tonEurPrice;
}

/* ---------- ENTER ---------- */
let loopStarted = false;

if (enterBtn) {
  enterBtn.onclick = () => {
    if (loopStarted) return;
    loopStarted = true;

    state.started = true;
    enterBtn.style.display = "none";
    dashboard.classList.remove("hidden");

    startLoop();
    fetchHumStatus();
    save();
  };
}

/* ---------- LOOP PRESENÇA ---------- */
function startLoop() {
  setInterval(() => {
    state.time++;
    state.hum += 0.00002;

    if (state.time >= 300) {
      state.days[today()] = true;
    }

    updateUI();
    save();
  }, 1000);
}

/* ---------- UI ---------- */
function updateUI() {
  humValue.textContent =
    state.hum.toFixed(5) + " HUM (guardado)";

  eurValue.textContent =
    "€ " + state.priceEUR.toFixed(4);

  usdValue.textContent =
    "$ " + (state.priceEUR * 1.1).toFixed(4);

  const rate = humToTonRate();
  tonValue.textContent =
    rate ? rate.toFixed(6) + " TON" : "—";

  if (buyHumAmount && buyTonEstimate) {
    const hum = Number(buyHumAmount.value || 0);
    buyTonEstimate.textContent =
      rate ? (hum * rate).toFixed(6) + " TON" : "—";
  }

  if (exchangeHum) {
    exchangeHum.textContent =
      state.hum.toFixed(5) + " HUM";
  }

  if (exchangeTon) {
    exchangeTon.textContent =
      "Conversão bloqueada até Fase 2";
  }

  if (presenceCount) {
    presenceCount.textContent =
      Math.max(1, Math.floor(1 + state.time / 60));
  }
}

/* ---------- COMPRAR HUM (SIMULADO) ---------- */
if (buyHumBtn) {
  buyHumBtn.onclick = () => {
    const hum = Number(buyHumAmount.value);

    if (!hum || hum <= 0)
      return alert("Quantidade inválida.");

    if (state.phase > 1) {
      alert("Compra disponível apenas até Fase 1.");
      return;
    }

    state.hum += hum;
    state.humStatus = "dormente";

    alert(
      "✔ Compra registada\n\n" +
      `+${hum} HUM\n` +
      "Estado: guardado (dormente)\n\n" +
      "Conversão apenas a partir da Fase 2."
    );

    save();
    updateUI();
  };
}

/* ---------- UTILS ---------- */
function today() {
  return new Date().toISOString().slice(0, 10);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- INIT ---------- */
fetchHumStatus();
fetchTonPrice();
setInterval(fetchHumStatus, 15000);
setInterval(fetchTonPrice, 30000);
updateUI();

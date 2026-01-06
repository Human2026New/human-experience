/* =========================
   HUMAN — app.js
   TON Connect REAL (E3)
   ========================= */

const STORAGE_KEY = "human_app_v8";

/* BACKEND */
const BACKEND_URL = "http://localhost:3000";

/* WALLET HUM (OFICIAL) */
const HUM_WALLET =
  "EQCC2LH8-sEap7cfMZZIJOSVQ2aTWNUYIUEEKD8GeRYpB7oU";

/* STATE */
let state = {
  started: false,
  hum: 0,
  phase: 0,
  minedPercent: 0,
  priceEUR: 0.05
};

/* LOAD */
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try { state = { ...state, ...JSON.parse(saved) }; } catch {}
}

const $ = id => document.getElementById(id);

/* ELEMENTS */
const enterBtn = $("enterBtn");
const dashboard = $("dashboard");
const humValue = $("humValue");
const eurValue = $("eurValue");
const usdValue = $("usdValue");
const tonValue = $("tonValue");
const buyHumAmount = $("buyHumAmount");
const buyTonEstimate = $("buyTonEstimate");
const buyHumBtn = $("buyHumBtn");

/* TON CONNECT */
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://human2026new.github.io/tonconnect-manifest.json",
  buttonRootId: "ton-connect"
});

/* ENTER */
enterBtn.onclick = () => {
  state.started = true;
  enterBtn.style.display = "none";
  dashboard.classList.remove("hidden");
  updateUI();
  save();
};

/* FETCH HUM STATUS */
async function fetchHumStatus() {
  try {
    const r = await fetch(`${BACKEND_URL}/hum/status`);
    const d = await r.json();
    state.phase = d.phase;
    state.minedPercent = d.minedPercent;

    const pr = await fetch(`${BACKEND_URL}/hum/price`);
    const p = await pr.json();
    state.priceEUR = p.priceEUR;

    updateUI();
    save();
  } catch {}
}

/* TON PRICE */
let tonEurPrice = 0;
async function fetchTonPrice() {
  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=eur"
    );
    const d = await r.json();
    tonEurPrice = d["the-open-network"].eur;
    updateUI();
  } catch {}
}

function humToTonRate() {
  if (!tonEurPrice) return 0;
  return state.priceEUR / tonEurPrice;
}

/* BUY HUM WITH TON */
buyHumBtn.onclick = async () => {
  if (!tonConnectUI.wallet) {
    alert("Liga primeiro a tua wallet TON.");
    return;
  }

  const hum = Number(buyHumAmount.value);
  if (!hum || hum <= 0) {
    alert("Quantidade inválida.");
    return;
  }

  const tonAmount = hum * humToTonRate();
  if (!tonAmount) {
    alert("Preço indisponível.");
    return;
  }

  const tx = {
    validUntil: Math.floor(Date.now() / 1000) + 300,
    messages: [
      {
        address: HUM_WALLET,
        amount: Math.floor(tonAmount * 1e9).toString(),
        payload: "HUM purchase"
      }
    ]
  };

  try {
    await tonConnectUI.sendTransaction(tx);
    alert(
      "⏳ Transação enviada\n\n" +
      "Após confirmação na rede TON,\n" +
      "o HUM será creditado.\n\n" +
      "Estado: guardado (dormente)"
    );
  } catch (e) {
    alert("Transação cancelada.");
  }
};

/* UI */
function updateUI() {
  humValue.textContent = state.hum.toFixed(5) + " HUM";
  eurValue.textContent = "€ " + state.priceEUR.toFixed(4);
  usdValue.textContent = "$ " + (state.priceEUR * 1.1).toFixed(4);
  tonValue.textContent =
    humToTonRate() ? humToTonRate().toFixed(6) + " TON" : "—";

  if (buyHumAmount && buyTonEstimate) {
    const hum = Number(buyHumAmount.value || 0);
    buyTonEstimate.textContent =
      humToTonRate() ? (hum * humToTonRate()).toFixed(6) + " TON" : "—";
  }
}

/* SAVE */
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* INIT */
fetchHumStatus();
fetchTonPrice();
setInterval(fetchHumStatus, 15000);
setInterval(fetchTonPrice, 30000);
updateUI();

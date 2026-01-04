/* =========================
   HUMAN — app.js (final)
   ========================= */

const STORAGE_KEY = "human_app_v6";
const DONATION_ADDRESS =
  "UQC_QK4Kwcw68zJYKGYMKRhrWNAK7lYmniEgV-Kq9kCLkzlf";

/* ---------- PREÇO HUM ---------- */
const HUM_EUR_PRICE = 0.05; // 1 HUM = 0.05 €

/* ---------- STATE (compatível) ---------- */
let state = {
  started: false,
  hum: 0,
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

const daysCount = $("daysCount");
const timeSpent = $("timeSpent");
const stateText = $("stateText");
const taskList = $("taskList");

/* Exchange / Buy */
const buyHumAmount = $("buyHumAmount");
const buyTonEstimate = $("buyTonEstimate");
const buyHumBtn = $("buyHumBtn");

const exchangeHum = $("exchangeHum");
const exchangeTon = $("exchangeTon");
const humToTonBtn = $("humToTon");
const tonToHumBtn = $("tonToHum");

/* ---------- TON PRICE (LIVE) ---------- */
let tonEurPrice = 0;

async function fetchTonPrice() {
  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=eur,usd"
    );
    const d = await r.json();
    tonEurPrice = d["the-open-network"].eur;
    updatePrices();
  } catch {}
}

/* ---------- CONVERSÕES ---------- */
function humToTonRate() {
  if (!tonEurPrice) return 0;
  return HUM_EUR_PRICE / tonEurPrice;
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

    generateDailyTasks();
    initDonation();
    startLoop();
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

    checkTasks();
    updateUI();
    save();
  }, 1000);
}

/* ---------- TASKS ---------- */
const TASK_POOL = [
  { text: "Entrar com presença", type: "enter", hum: 0.001 },
  { text: "Permanecer 3 minutos", type: "time3", hum: 0.0015 },
  { text: "Permanecer 7 minutos", type: "time7", hum: 0.0025 }
];

function generateDailyTasks() {
  const d = today();
  if (state.taskDay === d) return;

  state.taskDay = d;
  state.tasks = [];

  [...TASK_POOL]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .forEach((t, i) => {
      state.tasks.push({
        id: d + "_" + i,
        text: t.text,
        type: t.type,
        hum: t.hum,
        done: false
      });
    });
}

function checkTasks() {
  state.tasks.forEach(t => {
    if (t.done) return;
    if (t.type === "enter") completeTask(t);
    if (t.type === "time3" && state.time >= 180) completeTask(t);
    if (t.type === "time7" && state.time >= 420) completeTask(t);
  });
}

function completeTask(task) {
  task.done = true;
  state.hum += task.hum;
}

/* ---------- UI ---------- */
function updateUI() {
  humValue.textContent = state.hum.toFixed(5) + " HUM";
  daysCount.textContent = Object.keys(state.days).length;
  timeSpent.textContent = Math.floor(state.time / 60) + " min";
  stateText.textContent =
    Object.keys(state.days).length >= 7 ? "consistência" : "presença";

  if (presenceCount) presenceCount.textContent = calculatePresence();

  renderTasks();
  updatePrices();
}

function renderTasks() {
  taskList.innerHTML = "";
  state.tasks.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t.done
      ? `✔️ ${t.text} (+${t.hum} HUM)`
      : `⏳ ${t.text}`;
    taskList.appendChild(li);
  });
}

function calculatePresence() {
  return Math.max(1, Math.floor(1 + state.time / 60));
}

/* ---------- PREÇOS ---------- */
function updatePrices() {
  eurValue.textContent = "€ " + HUM_EUR_PRICE.toFixed(2);
  usdValue.textContent = "$ " + (HUM_EUR_PRICE * 1.1).toFixed(2);

  const rate = humToTonRate();
  tonValue.textContent = rate ? rate.toFixed(6) + " TON" : "—";

  if (buyHumAmount && buyTonEstimate) {
    const hum = Number(buyHumAmount.value || 0);
    buyTonEstimate.textContent =
      rate ? (hum * rate).toFixed(6) + " TON" : "—";
  }

  if (exchangeHum)
    exchangeHum.textContent = state.hum.toFixed(5) + " HUM";

  if (exchangeTon)
    exchangeTon.textContent =
      rate ? (state.hum * rate).toFixed(6) + " TON" : "—";
}

/* ---------- COMPRAR HUM ---------- */
if (buyHumAmount) {
  buyHumAmount.oninput = updatePrices;
}

if (buyHumBtn) {
  buyHumBtn.onclick = () => {
    const hum = Number(buyHumAmount.value);
    if (hum <= 0) return alert("Quantidade inválida.");

    state.hum += hum;
    save();
    updateUI();

    alert("Compra registada.\nHUM creditado internamente.");
  };
}

/* ---------- TROCA ---------- */
if (humToTonBtn) {
  humToTonBtn.onclick = () => {
    if (state.hum <= 0) return alert("Sem HUM disponível.");

    const ton = state.hum * humToTonRate();
    state.tonSim += ton;
    state.hum = 0;

    save();
    updateUI();
  };
}

if (tonToHumBtn) {
  tonToHumBtn.onclick = () => {
    if (state.tonSim <= 0) return alert("Sem TON disponível.");

    state.hum += state.tonSim / humToTonRate();
    state.tonSim = 0;

    save();
    updateUI();
  };
}

/* ---------- CONVITES ---------- */
const inviteBtn = $("createInvite");
if (inviteBtn && window.Telegram && Telegram.WebApp) {
  inviteBtn.onclick = () => {
    Telegram.WebApp.openTelegramLink(
      "https://t.me/share/url?url=https://t.me/human_proto_bot&text=Estou%20num%20espaço%20chamado%20HUMAN.%20Só%20presença."
    );
  };
}

/* ---------- DOAÇÃO ---------- */
function initDonation() {
  $("donationAddress").textContent = DONATION_ADDRESS;
  $("tonQr").src =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
    DONATION_ADDRESS;

  $("openTonkeeper").onclick = () => {
    window.location.href = "ton://transfer/" + DONATION_ADDRESS;
  };

  $("copyDonation").onclick = () => {
    navigator.clipboard.writeText(DONATION_ADDRESS);
    alert("Endereço TON copiado.");
  };
}

/* ---------- MODALS ---------- */
document.querySelectorAll("[data-open]").forEach(btn => {
  btn.onclick = () =>
    document.getElementById(btn.dataset.open).classList.remove("hidden");
});

document.querySelectorAll(".close").forEach(btn => {
  btn.onclick = () =>
    document.querySelectorAll(".space").forEach(s =>
      s.classList.add("hidden")
    );
});

/* ---------- UTILS ---------- */
function today() {
  return new Date().toISOString().slice(0, 10);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- INIT ---------- */
fetchTonPrice();
setInterval(fetchTonPrice, 1000);

updateUI();

/* ---------- SPLASH ---------- */
window.addEventListener("load", () => {
  const splash = $("mainnetSplash");
  if (!splash) return;
  setTimeout(() => (splash.style.display = "none"), 2000);
});

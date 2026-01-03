/* =========================
   HUMAN — app.js (stable)
   ========================= */

const STORAGE_KEY = "human_app_v3";
const DONATION_ADDRESS =
  "UQC_QK4Kwcw68zJYKGYMKRhrWNAK7lYmniEgV-Kq9kCLkzlf";

/* ---------- TASK POOL ---------- */
const TASK_POOL = [
  { text: "Entrar com presença", type: "enter", hum: 0.001 },
  { text: "Permanecer 3 minutos", type: "time3", hum: 0.0015 },
  { text: "Permanecer 7 minutos", type: "time7", hum: 0.0025 },
  { text: "Escrever uma nota humana", type: "note", hum: 0.002 },
  { text: "Voltar depois de uma pausa", type: "return", hum: 0.003 }
];

/* ---------- STATE ---------- */
let state = {
  started: false,
  hum: 0,
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
const daysCount = $("daysCount");
const timeSpent = $("timeSpent");
const stateText = $("stateText");
const taskList = $("taskList");
const presenceCount = $("presenceCount");
const tonValue = $("tonValue");

/* ---------- PRESENÇA ---------- */
const presenceBase = Math.floor(Math.random() * 3) + 1;

/* ---------- ENTER ---------- */
let loopStarted = false;

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

/* ---------- LOOP ---------- */
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
  humValue.textContent = `${state.hum.toFixed(5)} HUM`;
  daysCount.textContent = Object.keys(state.days).length;
  timeSpent.textContent = `${Math.floor(state.time / 60)} min`;
  stateText.textContent =
    Object.keys(state.days).length >= 7 ? "consistência" : "presença";

  if (presenceCount) {
    presenceCount.textContent = calculatePresence();
  }

  renderTasks();
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

/* ---------- PRESENÇA ---------- */
function calculatePresence() {
  const active = Math.min(state.time / 60, 10);
  return Math.max(
    1,
    Math.floor(presenceBase + active + Math.random() * 2)
  );
}

/* ---------- CONVITES ---------- */
const inviteBtn = $("createInvite");
if (inviteBtn && window.Telegram && Telegram.WebApp) {
  inviteBtn.onclick = () => {
    Telegram.WebApp.openTelegramLink(
      "https://t.me/share/url?url=https://t.me/human_proto_bot&text=Estou%20num%20espaço%20chamado%20HUMAN.%20Não%20promete%20nada.%20Só%20presença."
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

/* ---------- TON CONNECT ---------- */
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl:
    "https://Human2026New.github.io/human-experience/tonconnect-manifest.json",
  buttonRootId: "ton-connect"
});

tonConnectUI.onStatusChange(wallet => {
  if (!wallet) {
    $("tonAddress").textContent = "não ligada";
    $("tonBalance").textContent = "0";
    if (tonValue) tonValue.textContent = "0 TON";
    return;
  }

  const address = wallet.account.address;
  $("tonAddress").textContent = address;

  fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`)
    .then(r => r.json())
    .then(d => {
      if (!d.result) return;
      const ton = (d.result / 1e9).toFixed(4);
      $("tonBalance").textContent = ton;
      if (tonValue) tonValue.textContent = ton + " TON";
    })
    .catch(() => {});
});

/* ---------- MODALS ---------- */
document.querySelectorAll(".menu button").forEach(btn => {
  btn.onclick = () => {
    const target = btn.dataset.open;
    const section = document.getElementById(target);
    if (section) section.classList.remove("hidden");
  };
});

document.querySelectorAll(".close").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".space").forEach(s =>
      s.classList.add("hidden")
    );
  };
});

/* ---------- UTILS ---------- */
function today() {
  return new Date().toISOString().slice(0, 10);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- INIT ---------- */
updateUI();

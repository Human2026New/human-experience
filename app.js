const STORAGE_KEY = "human_dashboard_v4";

/* ---------- TASK POOL ---------- */
const TASK_POOL = [
  { text: "Entrar com presença", type: "enter", hum: 0.001 },
  { text: "Ficar 3 minutos", type: "time3", hum: 0.0015 },
  { text: "Ficar 7 minutos", type: "time7", hum: 0.0025 },
  { text: "Escrever uma nota humana", type: "note", hum: 0.002 },
  { text: "Voltar depois de uma pausa", type: "return", hum: 0.003 },
  { text: "Abrir HUMAN sem fazer nada", type: "idle", hum: 0.001 }
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
  try { state = { ...state, ...JSON.parse(saved) }; } catch {}
}

/* ---------- PRESENCE ---------- */
let presenceBase = Math.floor(Math.random() * 3) + 1;

/* ---------- ELEMENTS ---------- */
const enterBtn = document.getElementById("enterBtn");
const dashboard = document.getElementById("dashboard");
const humValue = document.getElementById("humValue");
const daysCount = document.getElementById("daysCount");
const timeSpent = document.getElementById("timeSpent");
const stateText = document.getElementById("stateText");
const taskList = document.getElementById("taskList");
const presenceEl = document.getElementById("presenceCount");
const tonValue = document.getElementById("tonValue");

/* ---------- ENTER ---------- */
enterBtn.onclick = () => {
  state.started = true;
  enterBtn.style.display = "none";
  dashboard.classList.remove("hidden");

  generateDailyTasks();
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

  const shuffled = [...TASK_POOL].sort(() => 0.5 - Math.random());
  shuffled.slice(0, 3).forEach((t, i) => {
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
  state.tasks.forEach(task => {
    if (task.done) return;

    if (task.type === "enter") completeTask(task);
    if (task.type === "time3" && state.time >= 180) completeTask(task);
    if (task.type === "time7" && state.time >= 420) completeTask(task);
  });
}

function completeTask(task) {
  task.done = true;
  state.hum += task.hum;
}

/* ---------- PRESENCE ---------- */
function calculatePresence() {
  const active = Math.min(state.time / 60, 10);
  return Math.max(1, Math.floor(presenceBase + active + Math.random() * 2));
}

/* ---------- UI ---------- */
function updateUI() {
  humValue.textContent = `${state.hum.toFixed(5)} HUM`;
  daysCount.textContent = Object.keys(state.days).length;
  timeSpent.textContent = `${Math.floor(state.time / 60)} min`;
  stateText.textContent =
    Object.keys(state.days).length >= 7 ? "consistência" : "presença";

  if (presenceEl) presenceEl.textContent = calculatePresence();
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

/* ---------- MODALS ---------- */
document.querySelectorAll(".menu button").forEach(btn => {
  btn.onclick = () => {
    document.getElementById(btn.dataset.open).classList.remove("hidden");
  };
});

document.querySelectorAll(".close").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".space").forEach(s => s.classList.add("hidden"));
  };
});

/* ---------- INVITES ---------- */
document.getElementById("createInvite").onclick = () => {
  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.share({
      text: "Estou num espaço chamado HUMAN. Não promete nada. Só presença."
    });
  }
};

/* ---------- TON CONNECT ---------- */
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://ton.org/tonconnect-manifest.json",
  buttonRootId: "ton-connect"
});

tonConnectUI.onStatusChange(wallet => {
  if (!wallet) {
    document.getElementById("tonAddress").textContent = "não ligada";
    document.getElementById("tonBalance").textContent = "0";
    tonValue.textContent = "0 TON";
    return;
  }

  document.getElementById("tonAddress").textContent =
    wallet.account.address;

  fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${wallet.account.address}`)
    .then(r => r.json())
    .then(d => {
      const ton = (d.result / 1e9).toFixed(4);
      document.getElementById("tonBalance").textContent = ton;
      tonValue.textContent = ton + " TON";
    });
});

/* ---------- UTILS ---------- */
function today() {
  return new Date().toISOString().slice(0, 10);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

updateUI();

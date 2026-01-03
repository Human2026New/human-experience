const STORAGE_KEY = "human_dashboard_v6";
const DONATION_ADDRESS = "UQC_QK4Kwcw68zJYKGYMKRhrWNAK7lYmniEgV-Kq9kCLkzlf";

/* ---------- TASK POOL ---------- */
const TASK_POOL = [
  { text: "Entrar com presença", type: "enter", hum: 0.001 },
  { text: "Ficar 3 minutos", type: "time3", hum: 0.0015 },
  { text: "Ficar 7 minutos", type: "time7", hum: 0.0025 },
  { text: "Escrever uma nota humana", type: "note", hum: 0.002 },
  { text: "Voltar depois de uma pausa", type: "return", hum: 0.003 },
  { text: "Abrir HUMAN sem fazer nada", type: "idle", hum: 0.001 }
};

/* ---------- STATE ---------- */
let state = {
  started: false,
  hum: 0,
  time: 0,
  days: {},
  tasks: [],
  taskDay: null
};

const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try { state = { ...state, ...JSON.parse(saved) }; } catch {}
}

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
  initDonation();
  save();
};

/* ---------- LOOP ---------- */
function startLoop() {
  setInterval(() => {
    state.time++;
    state.hum += 0.00002;

    if (state.time >= 300) state.days[today()] = true;

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

  [...TASK_POOL].sort(() => 0.5 - Math.random()).slice(0,3).forEach((t,i)=>{
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

function completeTask(t) {
  t.done = true;
  state.hum += t.hum;
}

/* ---------- PRESENCE ---------- */
function calculatePresence() {
  return Math.max(1, Math.floor(presenceBase + Math.min(state.time/60,10) + Math.random()*2));
}

/* ---------- UI ---------- */
function updateUI() {
  humValue.textContent = `${state.hum.toFixed(5)} HUM`;
  daysCount.textContent = Object.keys(state.days).length;
  timeSpent.textContent = `${Math.floor(state.time/60)} min`;
  stateText.textContent = Object.keys(state.days).length >= 7 ? "consistência" : "presença";
  presenceEl.textContent = calculatePresence();
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  state.tasks.forEach(t=>{
    const li = document.createElement("li");
    li.textContent = t.done ? `✔️ ${t.text} (+${t.hum} HUM)` : `⏳ ${t.text}`;
    taskList.appendChild(li);
  });
}

/* ---------- MODALS ---------- */
document.querySelectorAll(".menu button").forEach(btn=>{
  btn.onclick=()=>document.getElementById(btn.dataset.open).classList.remove("hidden");
});
document.querySelectorAll(".close").forEach(btn=>{
  btn.onclick=()=>document.querySelectorAll(".space").forEach(s=>s.classList.add("hidden"));
});

/* ---------- INVITES ---------- */
document.getElementById("createInvite").onclick=()=>{
  if(window.Telegram && Telegram.WebApp){
    Telegram.WebApp.share({text:"Estou num espaço chamado HUMAN. Não promete nada. Só presença."});
  }
};

/* ---------- DONATION ---------- */
function initDonation() {
  document.getElementById("tonQr").src =
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${DONATION_ADDRESS}`;

  document.getElementById("copyDonation").onclick = () => {
    navigator.clipboard.writeText(DONATION_ADDRESS);
    alert("Endereço TON copiado.");
  };

  document.getElementById("openTonkeeper").onclick = () => {
    window.open(`ton://transfer/${DONATION_ADDRESS}`, "_blank");
  };
}

/* ---------- TON CONNECT ---------- */
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://ton.org/tonconnect-manifest.json",
  buttonRootId: "ton-connect"
});

tonConnectUI.onStatusChange(wallet=>{
  if(!wallet){
    tonValue.textContent="0 TON";
    return;
  }
});

/* ---------- UTILS ---------- */
function today(){return new Date().toISOString().slice(0,10);}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
updateUI();

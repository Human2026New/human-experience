console.log("HUMAN — wallet ativa");

const tg = window.Telegram?.WebApp;
if (tg) tg.ready();

const BACKEND = "https://human-backend-ywuf.onrender.com";

const startBtn = document.getElementById("startBtn");
const info = document.getElementById("info");
const core = document.getElementById("core");

const timeEl = document.getElementById("time");
const humEl = document.getElementById("hum");
const stateEl = document.getElementById("state");

let totalTime = 0;
let hum = 0;
let presence=0, calm=0, stable=0;
let started=false;

async function loadWallet(){
  const r = await fetch(`${BACKEND}/api/wallet`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({initData:tg?.initData||"web"})
  });
  return await r.json();
}

async function save(delta, reason){
  fetch(`${BACKEND}/api/update`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      initData:tg?.initData||"web",
      delta_hum: delta,
      reason,
      total_time: totalTime,
      presence, calm, stable
    })
  });
}

startBtn.onclick = async ()=>{
  if(started) return;
  started=true;

  startBtn.style.display="none";
  info.innerText="Presença registada. HUM acumulado.";
  core.classList.remove("hidden");

  setInterval(async ()=>{
    totalTime++;
    let rate = 0.000005 + Math.random()*0.000002;
    hum += rate;

    if(totalTime>120) calm=1;
    if(totalTime>300) presence=1;
    if(totalTime>600) stable=1;

    await save(rate,"presence");

    const w = await loadWallet();
    humEl.innerText = w.hum.toFixed(5);
    timeEl.innerText = totalTime+"s";
    stateEl.innerText = stable?"estável":calm?"calmo":presence?"presente":"neutro";
  },3000);
};

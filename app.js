console.log("HUMAN — convites humanos ativos");

const tg = window.Telegram?.WebApp;
if (tg) tg.ready();

const BACKEND = "https://human-backend-XXXX.onrender.com";

const startBtn = document.getElementById("startBtn");
const info = document.getElementById("info");
const core = document.getElementById("core");

const timeEl = document.getElementById("time");
const humEl = document.getElementById("hum");
const stateEl = document.getElementById("state");

let hum=0, totalTime=0;
let presence=0, calm=0, stable=0;
let inviteCode=null, inviter=null;
let started=false;

async function load() {
  const invite = new URLSearchParams(window.location.search).get("invite");
  const r = await fetch(`${BACKEND}/api/status`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({initData:tg?.initData||"web", invite})
  });
  const d = await r.json();
  hum=d.hum; totalTime=d.total_time;
  presence=d.presence; calm=d.calm; stable=d.stable;
  inviteCode=d.invite_code; inviter=d.inviter;
}

async function save() {
  fetch(`${BACKEND}/api/update`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      initData:tg?.initData||"web",
      hum,total_time:totalTime,
      presence,calm,stable
    })
  });
}

startBtn.onclick = async ()=>{
  if(started) return;
  started=true;
  await load();
  startBtn.style.display="none";
  info.innerHTML = `
    Teu código humano:<br><b>${inviteCode}</b><br>
    Partilha com alguém consciente.
  `;
  core.classList.remove("hidden");
  let start=Date.now();

  setInterval(async ()=>{
    totalTime++;
    hum+=0.000005+Math.random()*0.000002;

    if(totalTime>180 && inviter){
      await fetch(`${BACKEND}/api/invite/confirm`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({initData:tg?.initData||"web"})
      });
      inviter=null;
    }

    timeEl.innerText=totalTime+"s";
    humEl.innerText=hum.toFixed(5);
    stateEl.innerText= stable?"ligado":calm?"calmo":presence?"presente":"neutro";
    save();
  },2000);
};

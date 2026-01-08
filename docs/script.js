/**************************
 🌍 BILINGUE PT/EN
**************************/
const content={
 pt:{
  "what-title":"O que é o HUMAN",
  what:`HUMAN mede tempo humano real.
Não procura pressa, procura presença.`,
  "token-title":"Marca HUM",
  token:`HUM é o símbolo da presença humana acumulada.`,
  "start-title":"Como começar",
  start:`Liga ao Telegram e volta uma vez por dia.`,
  "eco-title":"Maturidade & Valor",
  eco:`Troca abre quando 20% for conquistado.`,
  "phase-title":"O caminho",
  phase:`Génese → Presença → Troca → Comunidade`,
  "why-title":"Porque participar?",
  why:`Porque existes — e isso importa.`,
  "tasks-title":"Tarefas HUMAN",
  tasks:`Em breve: falar, ajudar, trazer humanos.`,
  "daily-title":"Presença Extra",
  daily:`Visitar o site dá +0.01 HUM diário.`,
  "comm-title":"Rede Humana"
 },
 en:{
  "what-title":"What is HUMAN",
  what:`HUMAN measures real human time.`,
  "token-title":"HUM Mark",
  token:`HUM represents accumulated human presence.`,
  "start-title":"How to start",
  start:`Connect via Telegram, return daily.`,
  "eco-title":"Maturity & Value",
  eco:`Exchange opens when 20% is reached.`,
  "phase-title":"The path",
  phase:`Genesis → Presence → Exchange → Community`,
  "why-title":"Why join?",
  why:`Because your presence has value.`,
  "tasks-title":"Tasks",
  tasks:`Soon: talk, help, invite.`,
  "daily-title":"Daily bonus",
  daily:`Visit gives +0.01 HUM.`,
  "comm-title":"Human Network"
 }
};

function setLang(l){
 localStorage.setItem("lang",l);
 document.querySelectorAll("[data-key]").forEach(el=>{
   el.innerHTML=content[l][el.dataset.key];
 });
}
setLang(localStorage.getItem("lang")||"pt");

/**************************
 📅 PRESENÇA & HUM
**************************/
let days=+localStorage.getItem("hum_days")||0;
const last=localStorage.getItem("hum_last");
const today=new Date().toDateString();

if(last!==today){
 days++;
 localStorage.setItem("hum_days",days);
 localStorage.setItem("hum_last",today);
 let hum=+localStorage.getItem("hum_balance")||0;
 hum+=0.01;
 localStorage.setItem("hum_balance",hum);
}

document.getElementById("days").textContent=days;
document.getElementById("humBalance").textContent=
 (+localStorage.getItem("hum_balance")||0).toFixed(3)+" HUM";

const tl=document.getElementById("timeline");
for(let i=0;i<days;i++){
 let dot=document.createElement("span");
 dot.className="mark";
 tl.appendChild(dot);
}

/**************************
 🌫 NÉVOA E TRAIL
**************************/
const fog=document.getElementById("fog").getContext("2d");
function loopFog(){
 fog.clearRect(0,0,innerWidth,innerHeight);
 fog.fillStyle="rgba(255,215,120,0.05)";
 fog.beginPath();
 fog.arc(innerWidth/2,innerHeight/2,200,0,Math.PI*2);
 fog.fill();
 requestAnimationFrame(loopFog);
}
function sizeFog(){fog.canvas.width=innerWidth;fog.canvas.height=innerHeight;}
sizeFog();loopFog();addEventListener("resize",sizeFog);

const trail=[];
const tctx=document.getElementById("trail").getContext("2d");
function sizeTrail(){tctx.canvas.width=innerWidth;tctx.canvas.height=innerHeight;}
sizeTrail();addEventListener("resize",sizeTrail);

window.addEventListener("mousemove",e=>{
 trail.push({x:e.clientX,y:e.clientY,a:1});
});
function drawTrail(){
 tctx.clearRect(0,0,innerWidth,innerHeight);
 trail.forEach(p=>{
  tctx.fillStyle=`rgba(255,220,150,${p.a})`;
  tctx.beginPath();tctx.arc(p.x,p.y,6*p.a,0,Math.PI*2);tctx.fill();
  p.a-=0.03;
 });
 requestAnimationFrame(drawTrail);
}
drawTrail();

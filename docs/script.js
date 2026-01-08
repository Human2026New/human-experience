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
  "origem-btn":"A Origem",

"origem-title":"A Origem",
"origem-intro":"O HUM começa no momento em que regressas. Não nasce do computador — nasce de ti.",

"origem-what":"O que é o HUMAN",
"origem-what-text":"HUMAN é um sistema que valoriza tempo humano real. Cada visita deixa uma marca viva.",

"origem-entry":"Como entrar",
"origem-entry-text":"Telegram, Play Store, Apple ou Web App. Com ou sem download. Sempre acessível.",

"origem-growth":"Crescimento Humano",
"origem-growth-text":"HUM surge com presença, interação e disciplina. Não há mineração, há vivência.",

"origem-distribution":"Distribuição Justa",
"origem-distribution-text":"60% crescimento humano • 39% oferta protegida até 20% desbloqueio • 1% equipa.",

"origem-when":"Quando posso trocar HUM?",
"origem-when-text":"Quando 20% do HUM total for criado através de participação humana.",

"origem-summary":"Em resumo",
"origem-summary-text":"HUM nasce do tempo humano. Cresce com disciplina. Vive na comunidade."
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
  "origem-btn":"The Origin",

"origem-title":"The Origin",
"origem-intro":"HUM begins the moment you return. It isn’t mined by machines — it’s born from you.",

"origem-what":"What is HUMAN",
"origem-what-text":"HUMAN is a system that values real human time. Every return leaves a living trace.",

"origem-entry":"How to enter",
"origem-entry-text":"Telegram, Play Store, Apple or Web App. With or without installs.",

"origem-growth":"Human Growth",
"origem-growth-text":"HUM appears through presence, interaction and discipline. No mining — only life.",

"origem-distribution":"Fair Distribution",
"origem-distribution-text":"60% human growth • 39% reserved until 20% creation • 1% team.",

"origem-when":"When can HUM be exchanged?",
"origem-when-text":"When 20% is created by human presence, HUM opens to Ton Coin and beyond.",

"origem-summary":"In summary",
"origem-summary-text":"HUM is born from human time. It grows with discipline. It lives in community."
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

/************** SPLASH **************/
const frasesSplash=[
"Tu és o protocolo.",
"O tempo cria valor.",
"A presença ilumina.",
"Voltar é crescer.",
"Caminho é disciplina."
];

if(document.body.classList.contains("splash")){
  document.getElementById("frase").innerText=
    frasesSplash[Math.floor(Math.random()*frasesSplash.length)];

  document.getElementById("ascender").onclick=()=>{
    document.body.style.animation="fadeOut 1s forwards";
    setTimeout(()=>{window.location.href="home.html";},800);
  };
}

/************** TEXTO MULTILINGUA **************/
let lang="pt";

const content={
pt:{
  "what-title":"O que é HUMAN",
  what:"HUMAN é um sistema digital de presença ao longo do tempo.",
  "not-title":"O que não é",
  not:"Não é mining, staking, promessa financeira ou máquina.",
  "phi-title":"Filosofia",
  phi:"O tempo humano tem valor. HUMAN mede disciplina e regresso.",
  "token-title":"Token HUM",
  token:"80,000,000 HUM total. Distribuído por presença humana.",
  "eco-title":"Economia HUM",
  eco:"HUM só circula quando 20% forem distribuídos. Troca possível via TON futuramente.",
  "phase-title":"Fases",
  phase:"0 Gênese • 1 Ativação • 2 Circulação • 3 Autonomia",
  "road-title":"Roadmap",
  road:"Hoje: acumulação • 2026: rede global • Futuro: HUM on-chain",
  "start-title":"Como começar",
  start:"Marca presença e regressa amanhã. Simples e humano.",
  "comm-title":"Comunidade",
  comm:"A rede vive das pessoas que regressam."
},
en:{
  "what-title":"What is HUMAN",
  what:"HUMAN is a digital time presence system.",
  "not-title":"What it's not",
  not:"Not mining, staking, financial promise or machines.",
  "phi-title":"Philosophy",
  phi:"Human time has value. HUMAN measures discipline and return.",
  "token-title":"HUM Token",
  token:"80,000,000 total HUM. Distributed to real humans.",
  "eco-title":"HUM Economy",
  eco:"HUM circulates only after 20% distributed. TON swaps later.",
  "phase-title":"Phases",
  phase:"0 Genesis • 1 Activation • 2 Circulation • 3 Autonomy",
  "road-title":"Roadmap",
  road:"Today: accumulation • 2026: global network • Future: on-chain",
  "start-title":"How to begin",
  start:"Mark presence and return tomorrow.",
  "comm-title":"Community",
  comm:"The network lives when humans return."
}
};

function setLang(l){
  lang=l;
  document.querySelectorAll("[id],[data-t]").forEach(el=>{
    const key=el.id||el.dataset.t;
    if(content[lang][key]) el.innerText=content[lang][key];
  });
}
setLang("pt");

/************** NÉVOA **************/
const fog=document.getElementById("fog");
const ctx=fog.getContext("2d");
function resizeFog(){fog.width=innerWidth;fog.height=innerHeight;}
resizeFog();addEventListener("resize",resizeFog);

let t=0;
function drawFog(){
  t+=0.002;
  ctx.clearRect(0,0,fog.width,fog.height);
  for(let i=0;i<60;i++){
    let x=Math.sin(t+i*.4)*innerWidth*.5+innerWidth/2;
    let y=Math.cos(t+i*.3)*innerHeight*.5+innerHeight/2;
    ctx.fillStyle=`rgba(255,215,100,${.07+Math.sin(i+t)*.05})`;
    ctx.beginPath();ctx.arc(x,y,140,0,Math.PI*2);ctx.fill();
  }
  requestAnimationFrame(drawFog);
}
drawFog();

/*************************************
 🌍 LINGUAGEM HUMAN — PT / EN
*************************************/
const content={
 pt:{
  "what-title":"O que é o HUMAN",
  what:`HUMAN mede tempo humano real.
Não procura pressa, procura presença.
Cada vez que voltas, deixas uma marca — e a rede acende um pouco mais.`,

  "token-title":"Marca HUM",
  token:`HUM é um símbolo da tua presença.
Ele nasce de humanos, não de máquinas.
Quanto mais regressas, mais HUM existe.`,

  "start-title":"Como começar",
  start:`Usa o Telegram ou WebApp.
Marca presença uma vez por dia.
Volta amanhã.
Deixa um rasto no tempo.`,

  "eco-title":"Maturidade & Valor",
  eco:`HUM nasce sem mercados ou promessas.
Cresce com humanos presentes.
A troca abre quando a comunidade amadurecer (20%).`,

  "phase-title":"O caminho",
  phase:`Génese → Presença
Ativação → Distribuição
Circulação → Troca
Autonomia → Comunidade`,

  "comm-title":"Rede Humana",
  comm:`Não segues o protocolo — tu és o protocolo.`,

  "why-title":"Porque Participar?",
  why:`HUMAN não é um jogo de sorte — é regresso ao teu próprio ritmo.
Participar significa:
✔ Criar constância
✔ Crescer com outros silenciosamente
✔ Acumular HUM como testemunho
HUM pede tempo — e devolve significado.`,

  "tasks-title":"Tarefas HUMAN",
  tasks:`Em breve poderás ganhar HUM por:
🗣 Reconectar com alguém
💬 Partilhar uma ideia no chat
👋 Trazer um novo humano
🤝 Ajudar alguém
🌱 Voltar amanhã
Pequenos atos → pequenas centelhas.`,

  "daily-title":"Presença Extra",
  daily:`Entrar no site dá +0.01 HUM simbólico diário.
O tempo vivido vale mais que energia computacional.`
 },
 en:{
  "what-title":"What is HUMAN",
  what:`HUMAN measures real time — not speed.
Every return leaves a mark and lights the network.`,

  "token-title":"HUM Mark",
  token:`HUM symbolizes presence over time.
Not mined by machines — grown by humans.`,

  "start-title":"How to begin",
  start:`Use Telegram or WebApp.
Check in once per day.
Return tomorrow.`,

  "eco-title":"Maturity & Value",
  eco:`HUM begins without promise.
Trading opens only when the network matures.`,

  "phase-title":"The Path",
  phase:`Genesis → Presence
Activation → Expansion
Circulation → Exchange
Autonomy → Community-led`,

  "comm-title":"Human Network",
  comm:`You do not follow the protocol — YOU ARE the protocol.`,

  "why-title":"Why Participate?",
  why:`HUMAN brings you back to your own rhythm.`,

  "tasks-title":"HUMAN Tasks",
  tasks:`Soon HUM will reward human actions.`,

  "daily-title":"Daily Presence",
  daily:`Visiting the site gives +0.01 HUM mark daily.`
 }
};

function setLang(l){
 localStorage.setItem("lang",l);
 document.querySelectorAll("[data-key]").forEach(el=>{
   el.innerHTML=content[l][el.dataset.key];
 });
}
setLang(localStorage.getItem("lang")||"pt");

/*************************************
 ✨ FRASES MÍSTICAS — ROTATIVAS
*************************************/
const frases=[
 "O tempo decide o que floresce.",
 "A presença é a única prova de vida.",
 "Crescer é voltar.",
 "A tua marca é invisível, mas eterna.",
 "O silêncio é onde o valor nasce.",
 "Um passo por dia quebra montanhas.",
 "A rede vive contigo, não sem ti.",
 "Amanhã só existe quando regressas.",
 "Nada que vale a pena é instantâneo.",
 "HUM nasce porque tu existes."
];
const fraseEl=document.getElementById("frase");
if(fraseEl)fraseEl.textContent=frases[Math.floor(Math.random()*frases.length)];

/*************************************
 👤 IDENTIDADE + AVATAR + NOME
*************************************/
let uid=localStorage.getItem("hum_uid")||
       Math.random().toString(36).slice(2,10)+Date.now().toString(36);
localStorage.setItem("hum_uid",uid);

const archetypes=[
 {n:"Semente Solar",c:"#f5d48a"},
 {n:"Chama Guardiã",c:"#ffb35c"},
 {n:"Fluxo Vivo",c:"#ffd87f"},
 {n:"Guardião do Tempo",c:"#e5c16e"},
 {n:"Ascendente",c:"#fff0b3"}
];
let arc=archetypes[uid.charCodeAt(0)%archetypes.length];

const a=document.getElementById("avatar");
if(a){
 const ctx=a.getContext("2d");
 a.width=a.height=80;
 let seed=uid.split("").reduce((s,x)=>s+x.charCodeAt(0),0);
 function rnd(){seed=(seed*9301+49297)%233280;return seed/233280;}
 for(let i=0;i<30;i++){
  ctx.fillStyle=`hsla(${rnd()*360},80%,60%,${0.5+rnd()*0.5})`;
  ctx.beginPath();
  const x=rnd()*80,y=rnd()*80,r=rnd()*12;
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fill();
 }
 setInterval(()=>{a.style.transform=`scale(${1+Math.sin(Date.now()/800)*0.05})`;},120);
 const name=document.getElementById("avatarName");
 if(name)name.textContent=arc.n;
}

/*************************************
 📅 PRESENÇA DIÁRIA + BÓNUS
*************************************/
let days=+localStorage.getItem("hum_days")||0;
const last=localStorage.getItem("hum_last")||0;
const today=new Date().toDateString();
if(last!==today){
 days++;
 localStorage.setItem("hum_days",days);
 localStorage.setItem("hum_last",today);
 let hum=+localStorage.getItem("hum_balance")||0;
 hum+=0.01; // bónus visita
 localStorage.setItem("hum_balance",hum);
}

let humBalance=document.getElementById("humBalance");
if(humBalance)humBalance.textContent=(+localStorage.getItem("hum_balance")||0).toFixed(3)+" HUM";

let dayEl=document.getElementById("days");
if(dayEl)dayEl.textContent=`${days} dias presentes`;

let tl=document.getElementById("timeline");
if(tl){
 tl.innerHTML="";
 for(let i=0;i<days;i++){
  const dot=document.createElement("span");
  dot.className="mark";
  if(i+1===7||i+1===30||i+1===90)dot.style.background="#ffd700";
  tl.appendChild(dot);
 }
}

/*************************************
 🌫 NÉVOA DOURADA
*************************************/
const fogCanvas=document.getElementById("fog");
if(fogCanvas){
 const fogCtx=fogCanvas.getContext("2d");
 function resizeFog(){fogCanvas.width=innerWidth;fogCanvas.height=innerHeight;}
 resizeFog();addEventListener("resize",resizeFog);
 let fogT=0;
 function drawFog(){
  fogT+=0.002;
  fogCtx.clearRect(0,0,innerWidth,innerHeight);
  for(let i=0;i<60;i++){
   let x=Math.sin(fogT+i*0.4)*innerWidth*0.5+innerWidth/2;
   let y=Math.cos(fogT+i*0.3)*innerHeight*0.5+innerHeight/2;
   fogCtx.fillStyle=`rgba(255,215,100,${0.08+Math.sin(i+fogT)*0.06})`;
   fogCtx.beginPath();
   fogCtx.arc(x,y,140,0,Math.PI*2);
   fogCtx.fill();
  }
  requestAnimationFrame(drawFog);
 }
 drawFog();
}

/*************************************
 🟡 RASTO DO CURSOR + PARTÍCULAS
*************************************/
const trail=[];
window.addEventListener("mousemove",e=>{
 trail.push({x:e.clientX,y:e.clientY,a:1});
 if(trail.length>40)trail.shift();
});

const tp=document.getElementById("trail");
if(tp){
 const tctx=tp.getContext("2d");
 function size(){tp.width=innerWidth;tp.height=innerHeight;}
 size();addEventListener("resize",size);
 function draw(){
  tctx.clearRect(0,0,tp.width,tp.height);
  for(let p of trail){
   tctx.fillStyle=`rgba(255,220,140,${p.a})`;
   tctx.beginPath();
   tctx.arc(p.x,p.y,6*p.a,0,Math.PI*2);
   tctx.fill();
   p.a-=0.03;
  }
  requestAnimationFrame(draw);
 }
 draw();
}

/*************************************
 🌙 RITUAL NOTURNO
*************************************/
function checkNight(){
 let h=new Date().getHours();
 document.body.classList.toggle("night",h>=21||h<6);
}
checkNight();setInterval(checkNight,60000);

/*************************************
 🌌 RADAR POÉTICO HUMANO (simulado)
*************************************/
let spark=document.getElementById("spark");
if(spark){
 function pulse(){spark.style.opacity="1";setTimeout(()=>spark.style.opacity="0.1",800);}
 setInterval(pulse,4000+Math.random()*4000);
}

/*************************************
 🎇 TEXTO LETRA A LETRA (se tiver data-type="writer")
*************************************/
document.querySelectorAll("[data-writer]").forEach(el=>{
 let t=el.textContent;el.textContent="";
 let i=0;
 (function step(){
   if(i<t.length){el.textContent+=t[i++];setTimeout(step,30);}
 })();
});

/*************************************
 🌍 LINGUAGEM / MULTILÍNGUE
*************************************/
const content = {
  pt: {
    "what-title":"O que é o HUMAN",
    what:`HUMAN é um sistema digital que mede tempo humano real.
Não procura pressa, procura presença.
Cada vez que voltas, deixas uma marca — e a rede acende um pouco mais.`,

    "token-title":"O token HUM",
    token:`HUM é um símbolo da tua presença ao longo do tempo.
Ele não nasce de máquinas, mas de humanos reais.
Quanto mais regressas, mais HUM existe.`,

    "start-title":"Como começar",
    start:`Instala o app ou usa o Telegram.
Marca presença uma vez por dia.
Volta amanhã.
Deixa um rasto no tempo.
Cada retorno é um passo no teu caminho HUM.`,

    "eco-title":"Maturidade & Valor",
    eco:`HUM nasce sem mercado e sem promessa.
Cresce com humanos presentes.
Circula apenas quando a comunidade estiver pronta (20%).`,

    "phase-title":"O caminho",
    phase:`Génese → Presença  
Ativação → Distribuição  
Circulação → Troca  
Autonomia → HUM na mão da comunidade`,

    "comm-title":"Rede Humana",
    comm:`HUMAN cresce contigo.  
Tu não segues o protocolo — TU ÉS o protocolo.`,

    "why-title":"Porque Participar?",
    why:`HUMAN não é um jogo de sorte, é um caminho de regresso ao tempo humano.
Participar significa:
✔ Voltar a ti próprio
✔ Criar disciplina e constância
✔ Tornar-te parte de uma rede silenciosa que cresce todos os dias
✔ Acumular HUM como testemunho da tua presença
Há projetos que te pedem dinheiro.
O HUMAN pede tempo — e devolve significado.`,

    "tasks-title":"Tarefas HUMAN",
    tasks:`O HUM começa pela tua presença.
Mas em breve, vais poder ganhar HUM fazendo desafios humanos:
🗣 Falar com alguém que não falas há muito
💬 Partilhar uma ideia no grupo
👋 Trazer alguém novo ao HUMAN
🤝 Ajudar outro humano
🌱 Voltar amanhã e no dia seguinte
Pequenos atos humanos → pequenas centelhas.`
  },

  en: {
    "what-title":"What is HUMAN",
    what:`HUMAN measures real human time.
Not speed — presence.
Every return leaves a mark and lights the network.`,

    "token-title":"The HUM token",
    token:`HUM is a symbol of your presence.
It is not mined by machines but grown by humans.`,

    "start-title":"How to begin",
    start:`Join the Telegram or Web App.
Check in once per day.
Return tomorrow.
Leave a mark in time.`,

    "eco-title":"Maturity & Value",
    eco:`HUM starts without markets or promises.
It grows with human presence.
Trading opens only when the network matures.`,

    "phase-title":"The Path",
    phase:`Genesis → Presence
Activation → Distribution
Circulation → Exchange
Autonomy → Community-led`,

    "comm-title":"Human Network",
    comm:`You do not follow the protocol — YOU ARE the protocol.`,

    "why-title":"Why Participate?",
    why:`HUMAN is a return to human rhythm.
Join to:
✔ Build discipline
✔ Grow with others silently
✔ Accumulate HUM through time
HUMAN asks not for money — but for presence.`,

    "tasks-title":"HUMAN Tasks",
    tasks:`Soon, HUM will reward actions like:
🗣 Speaking to someone forgotten
💬 Sharing insight
👋 Bringing a soul along
🤝 Helping in the community
🌱 Returning tomorrow
Small actions → small sparks.`
  }
};

function setLang(l){
  localStorage.setItem("lang", l);
  document.querySelectorAll("[data-key]").forEach(el=>{
    el.innerHTML = content[l][el.dataset.key];
  });
}
setLang(localStorage.getItem("lang") || "pt");


/*************************************
 ✨ FRASES MÍSTICAS ROTATIVAS
*************************************/
const frases = [
  "O tempo decide o que floresce.",
  "A presença é a única prova de vida.",
  "Crescer é voltar.",
  "A tua marca é invisível, mas eterna.",
  "Os humanos movem montanhas lentamente.",
  "O silêncio é onde o valor nasce.",
  "Nada que vale a pena é instantâneo.",
  "A constância é um ritual.",
  "O tempo é o ouro final.",
  "Um passo por dia quebra montanhas.",
  "A rede vive contigo, não sem ti.",
  "Amanhã só existe quando regressas.",
  "HUM nasce porque tu existes."
];

const fraseEl = document.getElementById("frase");
if(fraseEl) fraseEl.textContent = frases[Math.floor(Math.random()*frases.length)];


/*************************************
 👤 IDENTIDADE & AVATAR LOCAL
*************************************/
const uid = localStorage.getItem("hum_uid") ||
            Math.random().toString(36).slice(2,10) +
            Date.now().toString(36);

localStorage.setItem("hum_uid", uid);

const a = document.getElementById("avatar");
if(a){
  const ctx = a.getContext("2d");
  a.width = a.height = 80;
  let seed = uid.split("").reduce((s,x)=>s+x.charCodeAt(0),0);
  function rnd(){seed = (seed*9301+49297)%233280; return seed/233280;}
  for(let i=0;i<30;i++){
    ctx.fillStyle = `hsla(${rnd()*360},80%,60%,${0.5+rnd()*0.5})`;
    ctx.beginPath();
    const x=rnd()*80,y=rnd()*80,r=rnd()*12;
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
  }
  // pulso
  setInterval(()=>{a.style.transform = `scale(${1 + Math.sin(Date.now()/800)*0.05})`;},120);
}


/*************************************
 📅 PRESENÇA DIÁRIA + LINHA DO TEMPO
*************************************/
let days = +localStorage.getItem("hum_days") || 0;
const last = localStorage.getItem("hum_last") || 0;
const today = new Date().toDateString();

if(last !== today){
  days++;
  localStorage.setItem("hum_days",days);
  localStorage.setItem("hum_last",today);
}

const dEl = document.getElementById("days");
if(dEl) dEl.textContent = days + " dias presentes";

const tl=document.getElementById("timeline");
if(tl){
  tl.innerHTML="";
  for(let i=0;i<days;i++){
    const dot=document.createElement("span");
    dot.className="mark";
    tl.appendChild(dot);
  }
}


/*************************************
 🌬 NÉVOA DOURADA (ETAPA 1)
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
      let x=Math.sin(fogT+i*0.4)*innerWidth*0.5 + innerWidth/2;
      let y=Math.cos(fogT+i*0.3)*innerHeight*0.5 + innerHeight/2;
      fogCtx.fillStyle=`rgba(255,215,100,${0.08+Math.sin(i+fogT)*0.06})`;
      fogCtx.beginPath();
      fogCtx.arc(x,y,140,0,Math.PI*2);
      fogCtx.fill();
    }
    requestAnimationFrame(drawFog);
  }
  drawFog();
}

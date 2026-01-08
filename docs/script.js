/***************
 SPLASH → HOME
***************/
const frasesSplash=[
"O tempo é a única energia que ninguém fabrica.",
"Cada presença é um passo no eterno agora.",
"A constância supera a intensidade.",
"Presença cria realidade.",
"Tu és o próprio protocolo."
];
if(document.body.classList.contains("splash")){
  document.getElementById("frase").innerText =
    frasesSplash[Math.floor(Math.random()*frasesSplash.length)];

  document.getElementById("ascender").onclick=()=>{
    document.body.style.animation="fadeOut 1s forwards";
    setTimeout(()=>{window.location.href="home.html";},800);
  };
}
/***************
 FRASES ROTATIVAS
****************/
const frases=[
"O tempo é a única energia que ninguém fabrica.",
"Cada presença é um passo no eterno agora.",
"A disciplina cria caminhos invisíveis.",
"Tudo o que cresce, cresce devagar.",
"A tua marca no tempo é única.",
"Não é sobre pressa — é sobre presença.",
"A constância supera a intensidade.",
"Voltar é transformação.",
"Presença cria realidade.",
"Quem regressa ilumina o caminho.",
"O tempo vivido é maior do que o contado.",
"O ser avança devagar.",
"O futuro pertence aos que regressam.",
"Tu és o próprio protocolo.",
"HUMAN não mede máquinas.",
"Mede presença humana.",
"Tempo humano é valor.",
"Não seguimos pressa.",
"Presença fortalece a rede.",
"O caminho escreve-se voltando."
];

document.getElementById("hero-line").innerText =
 frases[Math.floor(Math.random()*frases.length)];

/***************
 MULTILINGUA + TEXTO
****************/
let lang="pt";

const content={
  pt:{
    what:"HUMAN é um sistema digital de presença. Cada retorno deixa uma marca e fortalece a rede.",
    not:"Não é mining tradicional, não promete rendimento, não mede máquinas nem velocidade.",
    phi:"Tempo humano tem valor. HUMAN recompensa disciplina e continuidade.",
    token:"HUM é o marcador digital de presença. Oferta total fixa: 80.000.000 HUM.",
    eco:"HUM só circula quando 20% forem distribuídos. Depois poderá ser trocado livremente na rede TON.",
    phase:"Fase 0: Gênese | Fase 1: Ativação | Fase 2: Circulação | Fase 3: Autonomia",
    road:"Hoje: acumulação | 2026: rede global | Futuro: HUM on-chain e autonomia",
    start:"Entra, marca presença e regressa amanhã. Só isso constrói HUMAN.",
    comm:"A rede vive quando dois humanos regressam no dia seguinte."
  },
  en:{
    what:"HUMAN is a digital presence protocol. Every return leaves a mark and strengthens the network.",
    not:"Not mining, not staking, no yield promises, no machines, no speed.",
    phi:"Human time has value. HUMAN rewards discipline and continuity.",
    token:"HUM is the presence token. Fixed supply: 80,000,000 HUM.",
    eco:"HUM circulates only when 20% has been distributed. Then may be exchanged on TON.",
    phase:"Phase 0: Genesis | Phase 1: Activation | Phase 2: Circulation | Phase 3: Autonomy",
    road:"Today: accumulation | 2026: global network | Future: on-chain and autonomy",
    start:"Enter, mark presence, return tomorrow. That builds HUMAN.",
    comm:"The network lives when two humans return the next day."
  }
};

function setLang(l){
  lang=l;
  document.querySelectorAll("[id]").forEach(el=>{
    if(content[lang][el.id]) el.innerText=content[lang][el.id];
  });
}
setLang("pt");

/***************
 NÉVOA DOURADA
****************/
const fog=document.getElementById("fog");
const fCtx=fog.getContext("2d");
function resize(){fog.width=innerWidth;fog.height=innerHeight;}
resize();addEventListener("resize",resize);
let t=0;
function draw(){
  t+=0.002;
  fCtx.clearRect(0,0,fog.width,fog.height);
  for(let i=0;i<60;i++){
    let x=Math.sin(t+i*.4)*innerWidth*.5 + innerWidth/2;
    let y=Math.cos(t+i*.3)*innerHeight*.5 + innerHeight/2;
    fCtx.fillStyle=`rgba(255,215,100,${.07+Math.sin(i+t)*.05})`;
    fCtx.beginPath();fCtx.arc(x,y,140,0,Math.PI*2);fCtx.fill();
  }
  requestAnimationFrame(draw);
}
draw();

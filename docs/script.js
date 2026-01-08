/* FRASES */
const frases=[
"Presença cria valor.",
"O tempo é o tesouro.",
"Cada retorno ilumina o caminho.",
"Tu és o protocolo.",
"O futuro pertence aos que regressam."
];
const h=document.getElementById("hero-line"); if(h)h.innerText=frases[Math.floor(Math.random()*frases.length)];
const t=document.getElementById("tagline"); if(t)t.innerText=frases[Math.floor(Math.random()*frases.length)];

/* PAINÉIS */
const obs=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("show")));
document.querySelectorAll(".panel").forEach(s=>obs.observe(s));

/* NÉVOA */
const fog=document.getElementById("fog"),f=fog.getContext("2d");
function rf(){fog.width=innerWidth;fog.height=innerHeight;} rf();addEventListener("resize",rf);
let ft=0;function drawFog(){ft+=.002;f.clearRect(0,0,fog.width,fog.height);
for(let i=0;i<60;i++){let x=Math.sin(ft+i*.4)*innerWidth*.5+innerWidth/2;
let y=Math.cos(ft+i*.3)*innerHeight*.5+innerHeight/2;
f.fillStyle=`rgba(255,210,130,${.06+Math.sin(i+ft)*.05})`;
f.beginPath();f.arc(x,y,140,0,Math.PI*2);f.fill();}
requestAnimationFrame(drawFog);} drawFog();

/* PARTÍCULAS INTELIGENTES */
const p=document.getElementById("particles"),px=p.getContext("2d");
function rp(){p.width=innerWidth;p.height=innerHeight;} rp();window.addEventListener("resize",rp);
let dots=Array.from({length:120},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6}));
p.addEventListener("mousemove",e=>{dots.forEach(d=>{let dx=d.x-e.clientX,dy=d.y-e.clientY,dist=Math.hypot(dx,dy);if(dist<150){d.vx+=dx/dist*.4;d.vy+=dy/dist*.4;}});});
function drawP(){px.clearRect(0,0,p.width,p.height);
dots.forEach(d=>{d.x+=d.vx;d.y+=d.vy;d.vx*=.98;d.vy*=.98;
if(d.x<0||d.x>innerWidth)d.vx*=-1;if(d.y<0||d.y>innerHeight)d.vy*=-1;
px.fillStyle="rgba(255,220,160,.9)";px.fillRect(d.x,d.y,2,2);});
requestAnimationFrame(drawP);} drawP();

/* IDENTIDADE & PRESENÇA */
const KEY="hum_days",AKEY="hum_id";
let days=parseInt(localStorage.getItem(KEY)||0);
let last=localStorage.getItem("lastDay")||"";
let today=new Date().toDateString();
if(today!==last){days++;localStorage.setItem(KEY,days);localStorage.setItem("lastDay",today);}
document.getElementById("days")&&(document.getElementById("days").innerText=days+" dias presentes");

/* AVATAR GEOMÉTRICO */
function hash(str){let h=0;for(let i=0;i<str.length;i++)h=(h<<5)-h+str.charCodeAt(i);return Math.abs(h);}
let id=localStorage.getItem(AKEY)||Date.now().toString()+Math.random();
localStorage.setItem(AKEY,id);
const a=document.getElementById("avatar"),ac=a.getContext("2d");
let seed=hash(id);function rnd(){seed=(seed*9301+49297)%233280;return seed/233280;}
for(let i=0;i<40;i++){
 let x=rnd()*80,y=rnd()*80,s=4+rnd()*10;
 ac.fillStyle=`hsl(${rnd()*360},70%,60%)`;ac.fillRect(x,y,s,s);
}

/* CONTEÚDO PT */
const content={pt:{
"what-title":"O que é o HUMAN",
what:`HUMAN regista presença humana real e transforma tempo em participação.`,
"token-title":"O token HUM",
token:`60% mineração humana\n39% liquidez\n1% equipa\nValor cresce com comunidade`,
"eco-title":"Economia",
eco:`Trocas só quando 20% do HUM existir na rede.`,
"phase-title":"Fases",
phase:`Génese → Ativação → Circulação → Autonomia`,
"start-title":"Como ganhar HUM",
start:`Marca presença diariamente no app ou Telegram.`,
"comm-title":"Comunidade",
comm:`O valor nasce do humano, não das máquinas.`
}};

/* IDIOMA */
function setLang(l){
 document.querySelectorAll("[data-t]").forEach(el=>el.innerText=content[l][el.dataset.t]);
 Object.keys(content[l]).forEach(k=>{let el=document.getElementById(k);if(el)el.innerText=content[l][k];});
}
setLang("pt");

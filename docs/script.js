const frases=[
"O tempo é a energia mais rara.",
"Cada presença ilumina o caminho.",
"Tu és o protocolo.",
"O futuro pertence aos que regressam.",
"Presença cria valor."
];
document.getElementById("hero-line") &&
(document.getElementById("hero-line").innerText=
  frases[Math.floor(Math.random()*frases.length)]);

/* ANIMAÇÃO PAINÉIS */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("show")});
});
document.querySelectorAll(".panel").forEach(s=>obs.observe(s));

/* NÉVOA */
const fog=document.getElementById("fog"),ctx=fog.getContext("2d");
function size(){fog.width=innerWidth;fog.height=innerHeight;} size();
addEventListener("resize",size);
let t=0;
function draw(){
 t+=0.002;ctx.clearRect(0,0,fog.width,fog.height);
 for(let i=0;i<60;i++){
   let x=Math.sin(t+i*.4)*innerWidth*.5+innerWidth/2;
   let y=Math.cos(t+i*.3)*innerHeight*.5+innerHeight/2;
   ctx.fillStyle=`rgba(255,210,130,${.06+Math.sin(i+t)*.05})`;
   ctx.beginPath();ctx.arc(x,y,140,0,Math.PI*2);ctx.fill();
 }
 requestAnimationFrame(draw);
}
draw();

/* CONTEÚDO */
const content={pt:{
"what-title":"O que é o HUMAN",
what:`HUMAN regista presença humana real no tempo...
(continua com todo o texto que já colaste antes)`,

"token-title":"O que é o token HUM",
token:`HUM representa tempo humano acumulado...`,

"eco-title":"Economia & Distribuição",
eco:`60% mineração • 39% venda • 1% equipa
Valor interno €0.05 • Troca só após 20% distribuído`,

"phase-title":"Quando posso trocar HUM?",
phase:`Apenas quando 20% do HUM existir na comunidade.`,

"start-title":"Como ganhar HUM",
start:`Usa Telegram ou Web App, marca presença diária, acumula HUM.`,

"comm-title":"Comunidade",
comm:`O valor nasce do humano, não das máquinas.`
}};

/* IDIOMA */
function setLang(l){
 document.querySelectorAll("[data-t]").forEach(el=>{
   el.innerText=content[l][el.dataset.t];
 });
 Object.keys(content[l]).forEach(k=>{
   const t=document.getElementById(k);
   if(t)t.innerText=content[l][k];
 });
}
setLang("pt");

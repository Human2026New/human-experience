/***********************
 🌍 IDIOMA PT/EN
************************/
function setLang(lang){
  if(lang !== "pt" && lang !== "en") lang = "pt"; // só aceite PT ou EN
  localStorage.setItem("lang", lang);

  document.querySelectorAll("[data-pt]").forEach(el=>{
    el.innerHTML = el.dataset[lang];
  });
}

// carregar preferência salva
setLang(localStorage.getItem("lang") || "pt");

/***********************
 🎵 AUDIO
************************/
function toggleAudio(){
  const a=document.getElementById("bgm");
  a.muted=!a.muted;
  document.querySelector(".audio-toggle").textContent=a.muted?"🔈":"🔊";
}

/***********************
 ⚡ MODO CYBER
************************/
const toggle=document.getElementById("themeToggle");
toggle.onclick=()=>{
  document.body.classList.toggle("cyber");
  localStorage.setItem("cyber",document.body.classList.contains("cyber"));
}
if(localStorage.getItem("cyber")==="true")document.body.classList.add("cyber");

/***********************
 📈 GRÁFICO AO VIVO
************************/
const ctx=document.getElementById('humChart').getContext('2d');
let dataPoints=[5,12,22,32,45,50];
const chart=new Chart(ctx,{
  type:"line",
  data:{labels:dataPoints.map((_,i)=>i),
    datasets:[{label:"Distribuição %",data:dataPoints,borderWidth:2}]},
  options:{animation:false,scales:{y:{min:0,max:100}}}
});
setInterval(()=>{
  let v=Math.random()*100;
  dataPoints.push(v);
  if(dataPoints.length>20)dataPoints.shift();
  chart.data.labels=dataPoints.map((_,i)=>i);
  chart.data.datasets[0].data=dataPoints;
  chart.update();
  if(v>60)spawnDrop();
},3000);

/***********************
 🌌 PARTICLES HUMAN
************************/
const pCanvas=document.getElementById("particles");
const pctx=pCanvas.getContext("2d");
function resize(){pCanvas.width=innerWidth;pCanvas.height=innerHeight;}
resize();addEventListener("resize",resize);

let particles=[];
for(let i=0;i<100;i++)particles.push({
  x:Math.random()*innerWidth,
  y:Math.random()*innerHeight,
  s:Math.random()*2+1});

function drawParticles(){
  pctx.clearRect(0,0,innerWidth,innerHeight);
  pctx.fillStyle="rgba(230,201,122,.8)";
  particles.forEach(p=>{
    p.y-=p.s*0.2;
    if(p.y<0)p.y=innerHeight;
    pctx.fillRect(p.x,p.y,p.s,p.s);
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/***********************
 💸 AIRDROP VISUAL
************************/
const aCanvas=document.getElementById("airdrop");
const actx=aCanvas.getContext("2d");
function resize2(){aCanvas.width=innerWidth;aCanvas.height=innerHeight;}
resize2();addEventListener("resize",resize2);

let drops=[];
function spawnDrop(){
  for(let i=0;i<10;i++){
    drops.push({x:Math.random()*innerWidth,y:0,s:Math.random()*3+1});
  }
}

function drawDrops(){
  actx.clearRect(0,0,innerWidth,innerHeight);
  actx.fillStyle="rgba(255,215,81,.9)";
  drops.forEach(d=>{d.y+=d.s*2;actx.fillRect(d.x,d.y,3,3);});
  drops=drops.filter(d=>d.y<innerHeight);
  requestAnimationFrame(drawDrops);
}
drawDrops();

/***********************
 🌀 FRACTAL CHAOS
************************/
const fCanvas=document.getElementById("fractal");
const fctx=fCanvas.getContext("2d");
function resize3(){fCanvas.width=innerWidth;fCanvas.height=innerHeight;}
resize3();addEventListener("resize",resize3);

let t=0;
function fractal(){
  t+=0.01;
  fctx.clearRect(0,0,innerWidth,innerHeight);
  for(let i=0;i<200;i++){
    let angle=i+t;
    let x=(innerWidth/2)+Math.sin(angle*3)*100*Math.sin(t+i);
    let y=(innerHeight/2)+Math.cos(angle*2)*120*Math.cos(t+i*0.5);
    fctx.fillStyle= document.body.classList.contains("cyber")
      ? `rgba(0,255,255,${0.3+Math.sin(i+t)*0.2})`
      : `rgba(230,201,122,${0.3+Math.sin(i+t)*0.2})`;
    fctx.fillRect(x,y,2,2);
  }
  requestAnimationFrame(fractal);
}
fractal();

/***********************
 ✨ SCROLL APPEAR
************************/
const slides=document.querySelectorAll(".slide");
const ob=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("show")));
slides.forEach(s=>ob.observe(s));

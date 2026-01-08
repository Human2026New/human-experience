/*************************************
 🌍 IDIOMA
*************************************/
function setLang(l){
  localStorage.setItem("lang", l);
  document.querySelectorAll("[data-pt]").forEach(el=>{
    el.innerHTML = el.getAttribute(`data-${l}`);
  });
}
setLang(localStorage.getItem("lang") || "pt");

/*************************************
 🎵 AUDIO
*************************************/
const bgm=document.getElementById("bgm");
if(localStorage.getItem("playMusic")==="yes"){
  bgm.muted=false;
}
function toggleAudio(){
  bgm.muted=!bgm.muted;
  document.querySelector(".audio-toggle").textContent=bgm.muted?"🔈":"🔊";
}

/*************************************
 ⚡ THEME
*************************************/
const toggle=document.getElementById("themeToggle");
toggle.onclick=()=>{
  document.body.classList.toggle("cyber");
  localStorage.setItem("cyber",document.body.classList.contains("cyber"));
}
if(localStorage.getItem("cyber")==="true")document.body.classList.add("cyber");

/*************************************
 📈 GRÁFICO
*************************************/
const ctx=document.getElementById('humChart').getContext('2d');
let values=[5,12,18,30];
const chart=new Chart(ctx,{
  type:"line",
  data:{
    labels:values.map((_,i)=>i),
    datasets:[{
      label:"Distribuição %",
      data:values,
      borderWidth:2
    }]
  },
  options:{
    animation:false,
    scales:{y:{min:0,max:100}}
  }
});
setInterval(()=>{
  let v=Math.random()*100;
  values.push(v);
  if(values.length>20)values.shift();
  chart.data.labels=values.map((_,i)=>i);
  chart.data.datasets[0].data=values;
  chart.update();
  if(v>60)spawnDrop();
},3000);

/*************************************
 🌌 PARTICLES
*************************************/
const pCanvas=document.getElementById("particles");
const pctx=pCanvas.getContext("2d");
function resizeParticles(){pCanvas.width=innerWidth;pCanvas.height=innerHeight;}
resizeParticles();addEventListener("resize",resizeParticles);

let particles=[];
for(let i=0;i<120;i++)particles.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,s:Math.random()*2+1});

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

/*************************************
 💸 AIRDROP
*************************************/
const aCanvas=document.getElementById("airdrop");
const actx=aCanvas.getContext("2d");
function resizeDrops(){aCanvas.width=innerWidth;aCanvas.height=innerHeight;}
resizeDrops();addEventListener("resize",resizeDrops);

let drops=[];
function spawnDrop(){
  for(let i=0;i<10;i++){
    drops.push({x:Math.random()*innerWidth,y:0,s:Math.random()*3+1});
  }
}
function drawDrops(){
  actx.clearRect(0,0,innerWidth,innerHeight);
  actx.fillStyle="rgba(255,215,81,.9)";
  drops.forEach(d=>{
    d.y+=d.s*2;
    actx.fillRect(d.x,d.y,3,3);
  });
  drops=drops.filter(d=>d.y<innerHeight);
  requestAnimationFrame(drawDrops);
}
drawDrops();

/*************************************
 🌀 FRACTAL HOME
*************************************/
const fCanvas=document.getElementById("fractal");
const fctx=fCanvas.getContext("2d");
function resizeFractal(){fCanvas.width=innerWidth;fCanvas.height=innerHeight;}
resizeFractal();addEventListener("resize",resizeFractal);

let t=0;
function fractal(){
  t+=0.01;
  fctx.clearRect(0,0,innerWidth,innerHeight);
  for(let i=0;i<200;i++){
    let angle=i+t;
    let x=(innerWidth/2)+Math.sin(angle*3)*100*Math.sin(t+i);
    let y=(innerHeight/2)+Math.cos(angle*2)*120*Math.cos(t+i*0.5);
    fctx.fillStyle=document.body.classList.contains("cyber")
      ?`rgba(0,255,255,${0.3+Math.sin(i+t)*0.2})`
      :`rgba(230,201,122,${0.3+Math.sin(i+t)*0.2})`;
    fctx.fillRect(x,y,2,2);
  }
  requestAnimationFrame(fractal);
}
fractal();

/*************************************
 ✨ HOME REVEAL
*************************************/
const main=document.getElementById("page-content");
main.style.opacity=0;
window.addEventListener("scroll",()=>main.classList.add("show"));
setTimeout(()=>main.classList.add("show"),500);

/*************************************
 🌫 SPLASH FRACTAL
*************************************/
const sCanvas=document.getElementById("splash-fractal");
if(sCanvas){
  const sctx=sCanvas.getContext("2d");
  function resizeS(){sCanvas.width=innerWidth;sCanvas.height=innerHeight;}
  resizeS();addEventListener("resize",resizeS);
  let t2=0;
  function splashFx(){
    t2+=0.008;
    sctx.clearRect(0,0,innerWidth,innerHeight);
    for(let i=0;i<150;i++){
      let a=i+t2;
      let x=(innerWidth/2)+Math.sin(a*2)*80*Math.cos(t2+i);
      let y=(innerHeight/2)+Math.cos(a*3)*100*Math.sin(t2+i*0.4);
      sctx.fillStyle=`rgba(255,215,100,${0.3+Math.sin(i+t2)*0.2})`;
      sctx.fillRect(x,y,2,2);
    }
    requestAnimationFrame(splashFx);
  }
  splashFx();
    }

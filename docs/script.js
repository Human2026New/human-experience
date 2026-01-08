/***********************
 🌍 LANGUAGE DISPLAY
************************/
function setLang(l){
  localStorage.setItem("lang",l);
  document.querySelectorAll("[data-key]").forEach(e=>{
    e.innerHTML = (LANG_DATA[l] && LANG_DATA[l][e.dataset.key]) || e.dataset.key;
  });
}

/***********************
 🔊 AUDIO
************************/
function toggleAudio(){
  const a=document.getElementById("bgm");
  a.muted=!a.muted;
  document.querySelector(".audio-toggle").textContent=a.muted?"🔈":"🔊";
}

/***********************
 ⚡ THEME
************************/
const toggle=document.getElementById("themeToggle");
toggle.onclick=()=>{
  document.body.classList.toggle("cyber");
  localStorage.setItem("cyber",document.body.classList.contains("cyber"));
};
if(localStorage.getItem("cyber")==="true")document.body.classList.add("cyber");

/***********************
 📈 GRAPH DEMO
************************/
const ctx=document.getElementById('humChart').getContext('2d');
let dataPoints=[10,25,40,55,60,75];
const chart=new Chart(ctx,{
  type:"line",
  data:{labels:dataPoints.map((_,i)=>i),
    datasets:[{label:"HUM",data:dataPoints,borderWidth:2}]},
  options:{animation:false,scales:{y:{min:0,max:100}}}
});
setInterval(()=>{
  let v=Math.random()*100;
  dataPoints.push(v);
  if(dataPoints.length>20)dataPoints.shift();
  chart.data.labels=dataPoints.map((_,i)=>i);
  chart.data.datasets[0].data=dataPoints;
  chart.update();
},2500);

/***********************
 🌌 PARTICLES / AIRDROP / FRACTAL
************************/
const pCanvas=document.getElementById("particles");
const pctx=pCanvas.getContext("2d");
function resize(){pCanvas.width=innerWidth;pCanvas.height=innerHeight;} resize();addEventListener("resize",resize);
let particles=[]; for(let i=0;i<100;i++)particles.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,s:Math.random()*2+1});
function drawParticles(){pctx.clearRect(0,0,innerWidth,innerHeight);pctx.fillStyle="rgba(230,201,122,.8)";particles.forEach(p=>{p.y-=p.s*0.2;if(p.y<0)p.y=innerHeight;pctx.fillRect(p.x,p.y,p.s,p.s);});requestAnimationFrame(drawParticles);} drawParticles();

const aCanvas=document.getElementById("airdrop");
const actx=aCanvas.getContext("2d");
function resize2(){aCanvas.width=innerWidth;aCanvas.height=innerHeight;} resize2();addEventListener("resize",resize2);
let drops=[];function spawnDrop(){for(let i=0;i<10;i++)drops.push({x:Math.random()*innerWidth,y:0,s:Math.random()*3+1});}
setInterval(()=>{if(Math.random()>0.6)spawnDrop();},2000);
function drawDrops(){actx.clearRect(0,0,innerWidth,innerHeight);actx.fillStyle="rgba(255,215,81,.9)";drops.forEach(d=>{d.y+=d.s*2;actx.fillRect(d.x,d.y,3,3);});drops=drops.filter(d=>d.y<innerHeight);requestAnimationFrame(drawDrops);} drawDrops();

const fCanvas=document.getElementById("fractal");
const fctx=fCanvas.getContext("2d");
function resize3(){fCanvas.width=innerWidth;fCanvas.height=innerHeight;} resize3();addEventListener("resize",resize3);
let t=0; function fractal(){t+=0.01;fctx.clearRect(0,0,innerWidth,innerHeight);for(let i=0;i<200;i++){let angle=i+t;let x=(innerWidth/2)+Math.sin(angle*3)*100*Math.sin(t+i);let y=(innerHeight/2)+Math.cos(angle*2)*120*Math.cos(t+i*0.5);fctx.fillStyle=`rgba(230,201,122,${0.3+Math.sin(i+t)*0.2})`;fctx.fillRect(x,y,2,2);}requestAnimationFrame(fractal);} fractal();

/***********************
 ✨ SCROLL REVEAL + FALLBACK
************************/
let revealed=false;
window.addEventListener("scroll",()=>{
  if(!revealed && scrollY>20){
    document.querySelector("main").classList.add("show");
    revealed=true;
  }
});
setTimeout(()=>{
  if(!revealed)document.querySelector("main").classList.add("show");
},1200);

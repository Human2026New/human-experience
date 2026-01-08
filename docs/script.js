/***********************
 LANG
************************/
function setLang(l){
  localStorage.setItem("lang",l);
  document.querySelectorAll("[data-key]").forEach(e=>e.textContent=e.getAttribute("data-key"));
}

/***********************
 AUDIO
************************/
function toggleAudio(){
  const a=document.getElementById("bgm");
  a.muted=!a.muted;
  document.querySelector(".audio-toggle").textContent=a.muted?"🔈":"🔊";
}

/***********************
 THEME
************************/
const toggle=document.getElementById("themeToggle");
toggle.onclick=()=>{
  document.body.classList.toggle("cyber");
};

/***********************
 GRAPH (Fake)
************************/
let dataPoints=[10,20,30,40];
const ctx=document.getElementById('humChart').getContext('2d');
const chart=new Chart(ctx,{
  type:"line",
  data:{labels:dataPoints.map((_,i)=>i),datasets:[{label:"HUM",data:dataPoints}]},
});

/***********************
 BACKGROUND ANIM
************************/
const pCanvas=document.getElementById("particles");
const pctx=pCanvas.getContext("2d");
pCanvas.width=innerWidth;pCanvas.height=innerHeight;
let particles=[];for(let i=0;i<100;i++)particles.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,s:Math.random()*2+1});
function drawParticles(){pctx.clearRect(0,0,innerWidth,innerHeight);pctx.fillStyle="rgba(230,201,122,.8)";particles.forEach(p=>{p.y-=p.s*0.2;if(p.y<0)p.y=innerHeight;pctx.fillRect(p.x,p.y,p.s,p.s);});requestAnimationFrame(drawParticles);}drawParticles();

/***********************
 SCROLL REVEAL
************************/
let revealed=false;
window.addEventListener("scroll",()=>{
  if(!revealed && scrollY>20){
    document.querySelector("main").classList.add("show");
    revealed=true;
  }
});

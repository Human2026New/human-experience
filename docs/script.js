/********** IDIOMA **********/
function setLang(l){
  localStorage.setItem("lang",l);
  document.querySelectorAll("[data-pt]").forEach(el=>{
    el.innerHTML = el.getAttribute(`data-${l}`);
  });
}
setLang(localStorage.getItem("lang")||"pt");

/********** AUDIO **********/
function toggleAudio(){
  const a=document.getElementById("bgm");
  a.muted=!a.muted;
  document.querySelector(".audio-toggle").textContent=a.muted?"🔈":"🔊";
}

/********** THEME **********/
document.getElementById("themeToggle").onclick=()=>{
  document.body.classList.toggle("cyber");
};

/********** CHART **********/
const ctx=document.getElementById('humChart').getContext('2d');
let values=[5,10,20,35];
const chart=new Chart(ctx,{
  type:"line",
  data:{labels:values.map((_,i)=>i),datasets:[{data:values,borderWidth:2}]},
  options:{animation:false}
});

/********** PARTICLES **********/
const p=document.getElementById("particles");
const pc=p.getContext("2d");
p.width=innerWidth;p.height=innerHeight;
let parts=[];for(let i=0;i<120;i++)parts.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,s:Math.random()*2+1});
function drawP(){pc.clearRect(0,0,innerWidth,innerHeight);pc.fillStyle="rgba(230,201,122,.8)";parts.forEach(p=>{p.y-=p.s*0.2;if(p.y<0)p.y=innerHeight;pc.fillRect(p.x,p.y,p.s,p.s);});requestAnimationFrame(drawP);}drawP();

/********** SCROLL **********/
window.addEventListener("scroll",()=>{
  if(scrollY>50) document.getElementById("page-content").style.opacity=1;
});

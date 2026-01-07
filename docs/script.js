/* GLOBAL STATE */
let lang = localStorage.getItem("lang") || navigator.language.slice(0,2);
const supported = ["pt","en","es","fr","de"];
if(!supported.includes(lang)) lang="en";

/* BOOT */
const boot=document.getElementById("boot");
const ascend=document.getElementById("ascend-btn");
ascend.onclick=()=>{
  openPortal(); boot.classList.add("hidden");
  document.getElementById("main-content").classList.remove("hidden");
};

/* PORTAL ANIMATION */
function openPortal(){
  const p=document.getElementById("portal");
  p.style.opacity="1"; p.style.width="150vw"; p.style.height="150vw";
  setTimeout(()=>p.style.opacity="0",400);
  setTimeout(()=>{p.style.width="0"; p.style.height="0";},800);
}

/* LANG LOAD */
async function loadLang(l){
  const res = await fetch(`assets/lang/${l}.json`);
  const data = await res.json();

  const set=(id,val)=>{ let el=document.getElementById(id); if(el) el.innerHTML=val; };

  set("choose_how",data.choose_how);
  set("understand",data.understand);
  set("read_protocol",data.read_protocol);
  set("participate",data.participate);
  set("participate_desc",data.participate_desc);
  set("create_title",data.create_title);
  set("create_desc",data.create_desc);
  set("explore_title",data.explore_title);
  set("faq_title",data.faq_title);

  const info=document.getElementById("info");
  info.innerHTML="";
  data.sections.forEach(s=>{
    let d=document.createElement("div");
    d.className="card";
    d.innerHTML=`<h3>${s.t}</h3><p>${s.p}</p>`;
    info.appendChild(d);
  });

  const faq=document.getElementById("faq");
  faq.innerHTML="";
  data.faq.forEach(s=>{
    let d=document.createElement("div");
    d.className="card";
    d.innerHTML=`<p>${s}</p>`;
    faq.appendChild(d);
  });

  localStorage.setItem("lang",l);
}
loadLang(lang);

/* SWAP LANG */
document.getElementById("pt-swap").onclick=()=>{lang="pt";loadLang(lang);};
document.getElementById("en-swap").onclick=()=>{lang="en";loadLang(lang);};

/* BUTTONS */
document.getElementById("explore-btn").onclick=()=>{
  openPortal();
  document.getElementById("explore").classList.remove("hidden");
};
document.getElementById("explore2-btn").onclick=()=>{
  openPortal();
  document.getElementById("explore").classList.remove("hidden");
};
document.getElementById("back").onclick=()=>{
  openPortal();
  document.getElementById("explore").classList.add("hidden");
  window.scrollTo(0,0);
};
document.getElementById("app-btn").onclick=()=>openPortal(window.location.href='app/index.html');
document.getElementById("radar-btn").onclick=()=>openPortal(window.location.href='radar.html');

/* HUD PRESENCE + MOON */
function days(){
  let d=parseInt(localStorage.getItem("days")||"0");
  document.getElementById("hud-days").innerText=d+"D";
}
function inc(){let d=parseInt(localStorage.getItem("days")||"0");localStorage.setItem("days",d+1);days();}
days();
setInterval(inc,60000);

function moon(){
  const syn=29.53;
  const base=new Date("2025-01-06").getTime();
  const ph=((Date.now()-base)/86400000)%syn;
  let face="🌑";
  if(ph<1)face="🌑"; else if(ph<8)face="🌒";
  else if(ph<15)face="🌕"; else if(ph<22)face="🌖";
  document.getElementById("hud-moon").innerText=face;
}
moon(); setInterval(moon, 30000);

/* FRACTAL */
const fc=document.getElementById("fractal");
const fctx=fc.getContext("2d");
function resize(){fc.width=innerWidth;fc.height=innerHeight;}
resize(); window.onresize=resize;

let particles=[];
for(let i=0;i<70;i++)particles.push({
  x:Math.random()*fc.width,
  y:Math.random()*fc.height,
  vx:(Math.random()-0.5)*1,
  vy:(Math.random()-0.5)*1
});

function fractal(){
  fctx.clearRect(0,0,fc.width,fc.height);
  particles.forEach((p,i)=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>fc.width)p.vx*=-1;
    if(p.y<0||p.y>fc.height)p.vy*=-1;
    fctx.beginPath();
    fctx.fillStyle="rgba(255,235,180,0.8)";
    fctx.arc(p.x,p.y,1.5,0,Math.PI*2);
    fctx.fill();
    for(let j=i+1;j<particles.length;j++){
      let m=particles[j],dist=Math.hypot(p.x-m.x,p.y-m.y);
      if(dist<140){
        fctx.strokeStyle=`rgba(255,235,180,${1-dist/140})`;
        fctx.beginPath();
        fctx.moveTo(p.x,p.y);fctx.lineTo(m.x,m.y);fctx.stroke();
      }
    }
  });
  requestAnimationFrame(fractal);
}
fractral=fractal(); // typo patch
fractal();

/* AUDIO */
let ctxA,osc,gain,started=false;
function audioStart(){
  if(started)return;
  ctxA=new AudioContext();osc=ctxA.createOscillator();gain=ctxA.createGain();
  osc.type="sine"; osc.frequency.value=60;
  gain.gain.value=0.02;
  osc.connect(gain); gain.connect(ctxA.destination);
  osc.start();
  started=true;
}
document.addEventListener("click",audioStart);
document.addEventListener("touchstart",audioStart);

/* AVATAR FRACTAL */
const av=document.getElementById("avatar"),ac=av.getContext("2d");
let seed=localStorage.getItem("seed");
if(!seed){seed=Math.floor(Math.random()*999999);localStorage.setItem("seed",seed);}
let s=seed; function r(){s=(s*16807)%2147483647; return (s-1)/2147483646;}
let t=0;
function drawAvatar(){
  t+=0.02; ac.clearRect(0,0,120,120);
  ac.fillStyle=`rgba(0,0,0,0.4)`;ac.beginPath();ac.arc(60,60,58,0,Math.PI*2);ac.fill();
  for(let i=0;i<12;i++){
    ac.beginPath();
    let hue=Math.floor(r()*60)+30+Math.sin(t+i)*40;
    ac.strokeStyle=`hsla(${hue},80%,70%,${0.5+Math.sin(t+i)*0.4})`;
    let x1=60+Math.cos(i+t+r()*2)*(20+r()*25);
    let y1=60+Math.sin(i+t+r()*2)*(20+r()*25);
    let x2=60+Math.cos(i*2+t+r()*4)*(r()*50);
    let y2=60+Math.sin(i*2+t+r()*4)*(r()*50);
    ac.moveTo(x1,y1);ac.lineTo(x2,y2);ac.stroke();
  }
  requestAnimationFrame(drawAvatar);
}
drawAvatar();

document.getElementById("save-avatar").onclick=()=>{
  let link=document.createElement("a");
  link.download=`HUMAN-${seed}.png`;
  link.href=av.toDataURL("image/png");
  link.click();
};

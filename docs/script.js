/* ========= BOOT SCREEN ========= */
const bootSeen = localStorage.getItem("hum-boot");
const bootEl = document.getElementById("boot");
if (!bootSeen) {
  setTimeout(()=>{
    bootEl.style.opacity="0";
    setTimeout(()=>bootEl.remove(),1500);
    localStorage.setItem("hum-boot","1");
  },2500);
} else bootEl.remove();

/* ========= GLOBAL MULTI-LANG ========= */
let currentLang = localStorage.getItem("lang") || "pt";
const supported = ["pt","en","es","fr","de","ru","zh","ar"];

function updateDir(lang,dir){ 
  document.documentElement.lang = lang;
  document.documentElement.dir = dir==="rtl" ? "rtl" : "ltr";
}

/* Banner mini */
function showBanner(text){
  const b=document.getElementById("lang-banner");
  b.innerText=text;
  b.classList.remove("hidden");
  setTimeout(()=>b.classList.add("hidden"),2000);
}

/* TTS */
function speak(text,lang){
  const msg=new SpeechSynthesisUtterance(text);
  msg.lang=lang;
  speechSynthesis.speak(msg);
}

/* Load JSON */
async function loadLang(lang){
  const res= await fetch(`assets/lang/${lang}.json`);
  const data= await res.json();

  updateDir(lang,data.dir);

  const pick = key =>
    data.variants?.[key]
    ? data.variants[key][Math.floor(Math.random()*data.variants[key].length)]
    : data[key];

  for(let key in data){
    let el=document.getElementById(key);
    if(el && typeof data[key]==="string") el.innerHTML = pick(key);
  }

  const info = document.getElementById("info-blocks");
  info.innerHTML="";
  for(let i=1;i<=11;i++){
    const title = pick(`section_${i}`);
    const body = pick(`section_${i}_p`);
    if(title&&body){
      const div=document.createElement("div");
      div.className="info-block";
      div.innerHTML=
      `<span class="tts-btn" onclick="speak('${body.replace(/'/g,'’')}','${lang}')">🔊</span>
      <h3>${title}</h3><p>${body}</p>`;
      info.appendChild(div);
    }
  }

  const div=document.createElement("div");
  div.className="info-block";
  div.innerHTML=
  `<span class="tts-btn" onclick="speak('${data.whitepaper}','${lang}')">🔊</span>
  <h3>Whitepaper</h3>
  <button onclick="window.open('whitepaper.pdf','_blank')">${pick("whitepaper")}</button>`;
  info.appendChild(div);

  const faq=document.getElementById("faq-container");
  faq.innerHTML="";
  for(let f=1;f<=6;f++){
    const text=pick(`faq_${f}`);
    if(text){
      const d=document.createElement("div");
      d.className="faq-item";
      d.innerHTML=
      `<span class="tts-btn" onclick="speak('${text.replace(/'/g,'’')}','${lang}')">🔊</span>
      <p>${text}</p>`;
      faq.appendChild(d);
    }
  }

  localStorage.setItem("lang",lang);
  showBanner(lang.toUpperCase());
}

/* ========= PAGE LOADED ========= */
document.addEventListener("DOMContentLoaded", async () => {
  await loadLang(currentLang);

  document.querySelectorAll(".flag-option").forEach(flag=>{
    flag.addEventListener("click",async()=>{
      currentLang = flag.dataset.lang;
      await loadLang(currentLang);
      openPortal();
    });
  });

  document.getElementById("explore-btn").addEventListener("click",()=>{
    openPortal();
    document.getElementById("explore-section").classList.remove("hidden");
    document.getElementById("explore-section").scrollIntoView({behavior:"smooth"});
  });

  document.getElementById("back").addEventListener("click",()=>{
    openPortal();
    window.scrollTo({top:0,behavior:"smooth"});
  });

  document.getElementById("create-btn").addEventListener("click",()=>{
    openPortal();
    document.getElementById("explore-section").classList.remove("hidden");
    document.getElementById("explore-section").scrollIntoView({behavior:"smooth"});
  });

  document.getElementById("enter-button").addEventListener("click",()=>{
    incrementPresence();
    openPortal();
  });
});

/* ========= MINI-HUD ========= */
const hudPresence=document.getElementById("hud-presence");
const hudMoon=document.getElementById("hud-moon");
const hudEnergy=document.getElementById("hud-energy");

function updatePresence(){
  let d=parseInt(localStorage.getItem("hum-days")||"0");
  hudPresence.textContent = `${d}d`;
}
function incrementPresence(){
  let d=parseInt(localStorage.getItem("hum-days")||"0");
  d++; localStorage.setItem("hum-days",d);
  updatePresence();
}
function updateMoon(){
  const syn=29.53; const ref=new Date("2025-01-06").getTime();
  const ph=((Date.now()-ref)/86400000)%syn;
  let face="🌑"; if(ph<1)face="🌑";
  else if(ph<8)face="🌒"; else if(ph<15)face="🌕";
  else if(ph<22)face="🌖";
  hudMoon.textContent=face;
}
function updateEnergyHUD(){
  let en=JSON.parse(localStorage.getItem("hum-energy")||"{}");
  let disp=Object.entries(en).map(([k,v])=>`${k}:${v}`).join(",");
  hudEnergy.textContent=disp||"0";
}
setInterval(()=>{
  updatePresence();updateMoon();updateEnergyHUD();
},1500);
updatePresence();updateMoon();updateEnergyHUD();

/* hook language count */
const origLoad = loadLang;
loadLang = async function(lang){
  await origLoad(lang);
  let en=JSON.parse(localStorage.getItem("hum-energy")||"{}");
  en[lang]=(en[lang]||0)+1;
  localStorage.setItem("hum-energy",JSON.stringify(en));
  updateEnergyHUD();
};

/* ========= PORTAL ========= */
function openPortal(){
  const p=document.getElementById("portal");
  p.style.opacity="1";
  p.style.width="150vw"; p.style.height="150vw";
  setTimeout(()=>{p.style.width="0";p.style.height="0";},400);
  setTimeout(()=>p.style.opacity="0",800);
}

/* ========= AVATAR ANIMATED ========= */
const avatarCanvas=document.getElementById("avatar-canvas");
const ac=avatarCanvas.getContext("2d");
avatarCanvas.width=120; avatarCanvas.height=120;

let seed=localStorage.getItem("hum-seed");
if(!seed){seed=""+Math.floor(Math.random()*9999999);localStorage.setItem("hum-seed",seed);}
let baseSeed=parseInt(seed);
function rs(){baseSeed=(16807*baseSeed)%2147483647;return(baseSeed-1)/2147483646;}

let t=0;
function drawAvatar(){
  t+=0.02; ac.clearRect(0,0,120,120);
  ac.beginPath();
  ac.arc(60,60,58,0,Math.PI*2);
  ac.fillStyle=`rgba(0,0,0,${0.25 + Math.sin(t)*0.10})`; ac.fill();

  for(let i=0;i<12;i++){
    ac.beginPath();
    let hue=Math.floor(rs()*60)+30+Math.sin(t+i)*40;
    ac.strokeStyle=`hsla(${hue},80%,70%,${0.5+Math.sin(t+i)*0.4})`;
    ac.lineWidth=1.5+rs()*1.5;
    const x1=60+Math.cos(i+t+rs()*2)*(20+rs()*25);
    const y1=60+Math.sin(i+t+rs()*2)*(20+rs()*25);
    const x2=60+Math.cos(i*2+t+rs()*4)*(rs()*50);
    const y2=60+Math.sin(i*2+t+rs()*4)*(rs()*50);
    ac.moveTo(x1,y1);ac.lineTo(x2,y2);ac.stroke();
  }
  ac.beginPath();
  ac.fillStyle=`rgba(255,230,180,${0.7+Math.sin(t*2)*0.3})`;
  ac.arc(60,60,5+Math.sin(t*3)*2,0,Math.PI*2);
  ac.fill();
  requestAnimationFrame(drawAvatar);
}
drawAvatar();

/* EXPORT PNG */
document.getElementById("export-avatar").addEventListener("click",()=>{
  const link=document.createElement("a");
  link.download=`HUM-avatar-${localStorage.getItem("hum-seed")}.png`;
  link.href=avatarCanvas.toDataURL("image/png");
  link.click();
});

/* ========= RADAR + GHOST NODES ========= */
const mapCanvas=document.getElementById("city-map");
const mc=mapCanvas.getContext("2d");
function resizeMap(){
  mapCanvas.width=mapCanvas.clientWidth;
  mapCanvas.height=mapCanvas.clientHeight;
}
resizeMap();window.addEventListener("resize",resizeMap);

let nodes=JSON.parse(localStorage.getItem("hum-nodes")||"[]");
const locSeed=localStorage.getItem("hum-location")||Math.random().toString(36).slice(2);
localStorage.setItem("hum-location",locSeed);

/* local node */
if(nodes.length<40){
  nodes.push({
    x:(parseInt(locSeed.slice(0,2),16)%100)/100*mapCanvas.width,
    y:(parseInt(locSeed.slice(2,4),16)%100)/100*mapCanvas.height,
    t:Date.now()
  });
  localStorage.setItem("hum-nodes",JSON.stringify(nodes));
}

/* ghost human simulation */
setInterval(()=>{
  if(nodes.length>=120) return;
  const now=Date.now();
  const g=now.toString(16);
  nodes.push({
    x:parseInt(g.slice(-2),16)/255*mapCanvas.width,
    y:parseInt(g.slice(-4,-2),16)/255*mapCanvas.height,
    t:now
  });
  localStorage.setItem("hum-nodes",JSON.stringify(nodes));
},20000);

/* draw & connect */
function drawNodes(){
  mc.clearRect(0,0,mapCanvas.width,mapCanvas.height);
  nodes.forEach((n,i)=>{
    mc.beginPath();
    mc.fillStyle="rgba(255,230,150,0.7)";
    mc.arc(n.x,n.y,3,0,Math.PI*2);
    mc.fill();
    for(let j=i+1;j<nodes.length;j++){
      let m=nodes[j];
      let dist=Math.hypot(n.x-m.x,n.y-m.y);
      if(dist<120){
        mc.strokeStyle=`rgba(255,230,150,${1-dist/120})`;
        mc.lineWidth=0.8;
        mc.beginPath();
        mc.moveTo(n.x,n.y);mc.lineTo(m.x,m.y);mc.stroke();
      }
    }
  });
  requestAnimationFrame(drawNodes);
}
drawNodes();

/* ========= FRACTAL PARTICLES + SOUND ========= */
const canvas=document.getElementById("fractal-canvas");
const ctx=canvas.getContext("2d");
function resizeCanvas(){canvas.width=innerWidth;canvas.height=innerHeight;}
resizeCanvas();window.addEventListener("resize",resizeCanvas);

const particles=[];
for(let i=0;i<70;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    vx:(Math.random()-0.5)*0.6,
    vy:(Math.random()-0.5)*0.6,
    r:1+Math.random()*2
  });
}
let attractor={x:null,y:null};
function handleA(e){
  const rect=canvas.getBoundingClientRect();
  attractor.x=(e.touches?e.touches[0].clientX:e.clientX)-rect.left;
  attractor.y=(e.touches?e.touches[0].clientY:e.clientY)-rect.top;
}
canvas.addEventListener("mousemove",handleA);
canvas.addEventListener("touchmove",handleA);
canvas.addEventListener("mouseleave",()=>attractor.x=attractor.y=null);
canvas.addEventListener("touchend",()=>attractor.x=attractor.y=null);

/* Sound */
let audioContext,ambientOsc,gainNode,soundEnabled=false;
function initSound(){
  if(soundEnabled)return;
  soundEnabled=true;
  audioContext=new (AudioContext||webkitAudioContext)();
  ambientOsc=audioContext.createOscillator();
  gainNode=audioContext.createGain();
  ambientOsc.type="sine";ambientOsc.frequency.value=64;
  gainNode.gain.value=0.02;
  ambientOsc.connect(gainNode);
  gainNode.connect(audioContext.destination);
  ambientOsc.start();
}
setInterval(()=>{
  if(!soundEnabled)return;
  let total=0;
  particles.forEach((p,i)=>{
    for(let j=i+1;j<particles.length;j++){
      const p2=particles[j];
      const dist=Math.hypot(p.x-p2.x,p.y-p2.y);
      if(dist<120) total++;
    }
  });
  const lvl=Math.min(total/300,0.08);
  gainNode.gain.linearRampToValueAtTime(0.02+lvl,audioContext.currentTime+0.1);
  ambientOsc.frequency.linearRampToValueAtTime(64+lvl*800,audioContext.currentTime+0.1);
},120);

document.addEventListener("click",initSound);
document.addEventListener("touchstart",initSound);

/* DRAW PARTICLES */
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach((p,i)=>{
    if(attractor.x!==null){
      const dx=attractor.x-p.x,dy=attractor.y-p.y;
      const dist=Math.hypot(dx,dy);
      if(dist<160){
        p.vx+=dx/dist*0.015;
        p.vy+=dy/dist*0.015;
      }
    }
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>canvas.width)p.vx*=-1;
    if(p.y<0||p.y>canvas.height)p.vy*=-1;

    ctx.beginPath();
    ctx.fillStyle="rgba(255,225,150,.9)";
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();

    for(let j=i+1;j<particles.length;j++){
      const p2=particles[j];
      const dist=Math.hypot(p.x-p2.x,p.y-p2.y);
      if(dist<140){
        ctx.strokeStyle=`rgba(255,225,150,${1-dist/140})`;
        ctx.lineWidth=0.5;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();
      }
    }
  });
  requestAnimationFrame(draw);
}
draw();

/* ========= TON PRECHECK ========= */
async function tonCheck(){
 try{
   const res = await fetch("https://tonapi.io/v2/blockchain/info");
   if(res.ok) localStorage.setItem("hum-ton-ready","1");
 }catch(e){
   console.log("TON offline mode");
 }}
tonCheck();

/***********************************************
 * HUMAN NETWORK ULTRA SCRIPT
 ************************************************/

let currentLang = "pt";
const supportedLangs = ["pt","en","es","fr","de","ru","zh","ar"];

// GEO fallback
const saved = localStorage.getItem("lang");
if (saved) currentLang = saved;

// Update <html>
function updateHtmlLang(lang, isRTL=false) {
  document.documentElement.lang = lang;
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
}

// Banner
function showBanner(text) {
  const banner = document.getElementById("lang-banner");
  banner.innerText = text;
  banner.classList.remove("hidden");
  setTimeout(()=>banner.classList.add("hidden"),2500);
}

// TTS
function speak(text, langCode) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = langCode;
  window.speechSynthesis.speak(msg);
}

// Load JSON
async function loadLang(lang) {
  const res = await fetch(`assets/lang/${lang}.json`);
  const data = await res.json();

  const pick = (key) =>
    data.variants?.[key]
      ? data.variants[key][Math.floor(Math.random()*data.variants[key].length)]
      : data[key];

  updateHtmlLang(lang, data.dir==="rtl");

  for (let key in data) {
    const el = document.getElementById(key);
    if (el && typeof data[key]==="string") el.innerHTML = pick(key);
  }

  const info = document.getElementById("info-blocks");
  info.innerHTML="";
  for (let i=1;i<=11;i++){
    const t=pick(`section_${i}`);
    const p=pick(`section_${i}_p`);
    if(t&&p){
      const div=document.createElement("div");
      div.className="info-block";
      div.innerHTML=`
      <span class="tts-btn" onclick="speak('${p.replace(/'/g,'’')}','${lang}')">🔊</span>
      <h3>${t}</h3><p>${p}</p>`;
      info.appendChild(div);
    }
  }

  const div=document.createElement("div");
  div.className="info-block";
  div.innerHTML=`
    <span class="tts-btn" onclick="speak('${data.whitepaper}','${lang}')">🔊</span>
    <h3>Whitepaper</h3>
    <button onclick="window.open('whitepaper.pdf','_blank')">${pick('whitepaper')}</button>`;
  info.appendChild(div);

  const faq=document.getElementById("faq-container");
  faq.innerHTML="";
  for(let f=1;f<=6;f++){
    const text=pick(`faq_${f}`);
    if(text){
      const d=document.createElement("div");
      d.className="faq-item";
      d.innerHTML=`
      <span class="tts-btn" onclick="speak('${text.replace(/'/g,'’')}','${lang}')">🔊</span>
      <p>${text}</p>`;
      faq.appendChild(d);
    }
  }

  showBanner(`${lang.toUpperCase()}`);
  localStorage.setItem("lang",lang);
}

document.addEventListener("DOMContentLoaded",async()=>{
  await loadLang(currentLang);

  document.querySelectorAll(".flag-option").forEach(flag=>{
    flag.addEventListener("click",async()=>{
      currentLang=flag.dataset.lang;
      await loadLang(currentLang);
    });
  });

  const explorer=document.getElementById("explore-section");
  document.getElementById("explore-btn").addEventListener("click",()=>{
    explorer.classList.remove("hidden");
    explorer.scrollIntoView({behavior:"smooth"});
  });

  document.getElementById("enter-button").addEventListener("click",()=>{
    incrementPresence();
  });

  document.getElementById("back").addEventListener("click",()=>{
    window.scrollTo({top:0,behavior:"smooth"});
  });
});

/*****************************************
 * HUMAN SIGIL AVATAR (procedural)
 *****************************************/
const avatarCanvas=document.getElementById("avatar-canvas");
const ac=avatarCanvas.getContext("2d");

avatarCanvas.width=120;
avatarCanvas.height=120;

let seed=localStorage.getItem("hum-seed");
if(!seed){
  seed=""+Math.floor(Math.random()*9999999);
  localStorage.setItem("hum-seed",seed);
}

function r(){
  seed=(16807*seed)%2147483647;
  return(seed-1)/2147483646;
}

function drawAvatar(){
  ac.clearRect(0,0,120,120);
  ac.beginPath();
  ac.arc(60,60,58,0,Math.PI*2);
  ac.fillStyle="rgba(0,0,0,0.3)";
  ac.fill();

  for(let i=0;i<12;i++){
    ac.beginPath();
    ac.strokeStyle=`hsla(${Math.floor(r()*60)+30},80%,70%,0.8)`;
    ac.lineWidth=1.5+r()*1.5;
    const x1=60+Math.cos(i+r()*Math.PI*2)*(20+r()*25);
    const y1=60+Math.sin(i+r()*Math.PI*2)*(20+r()*25);
    const x2=60+Math.cos(i*2+r()*Math.PI*2)*(r()*50);
    const y2=60+Math.sin(i*2+r()*Math.PI*2)*(r()*50);
    ac.moveTo(x1,y1);
    ac.lineTo(x2,y2);
    ac.stroke();
  }

  ac.beginPath();
  ac.fillStyle="rgba(255,230,180,0.9)";
  ac.arc(60,60,4+r()*3,0,Math.PI*2);
  ac.fill();
}
drawAvatar();

/*************************
 * HUM EXPERIENCE HUD
 *************************/
const counterEl=document.getElementById("presence-counter");
let days=parseInt(localStorage.getItem("hum-days")||"0");

function incrementPresence(){
  days++;
  localStorage.setItem("hum-days",days);
  counterEl.textContent=`Presença: ${days} dia${days>1?"s":""}`;
  counterEl.classList.remove("hidden");
}
if(days>0){
  counterEl.textContent=`Presença: ${days} dia${days>1?"s":""}`;
  counterEl.classList.remove("hidden");
}

// LUA
const moonEl=document.getElementById("moon-phase");
const today=new Date();
const synodic=29.53;
const ref=new Date("2025-01-06").getTime();
const phase=((today.getTime()-ref)/86400000)%synodic;

let moon="🌑 Nova";
if(phase<1)moon="🌑 Nova";
else if(phase<8)moon="🌒 Crescente";
else if(phase<15)moon="🌕 Cheia";
else if(phase<22)moon="🌖 Minguante";
moonEl.textContent=`Lua: ${moon}`;
moonEl.classList.remove("hidden");

/***********************
 * FRACTAL + ATTRACTOR
 ***********************/
const canvas=document.getElementById("fractal-canvas");
const ctx=canvas.getContext("2d");

function resizeCanvas(){
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize",resizeCanvas);

const particles=[];
const NUM=70;

for(let i=0;i<NUM;i++){
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

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  particles.forEach((p,i)=>{
    if(attractor.x!==null){
      const dx=attractor.x-p.x;
      const dy=attractor.y-p.y;
      const dist=Math.hypot(dx,dy);
      if(dist<160){
        p.vx+=dx/dist*0.015;
        p.vy+=dy/dist*0.015;
      }
    }
    p.x+=p.vx;
    p.y+=p.vy;
    if(p.x<0||p.x>canvas.width)p.vx*=-1;
    if(p.y<0||p.y>canvas.height)p.vy*=-1;

    ctx.beginPath();
    ctx.fillStyle="rgba(255,225,150,.9)";
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();

    for(let j=i+1;j<particles.length;j++){
      const p2=particles[j];
      const dist=Math.hypot(p.x-p2.x,p.y-p2.y);
      if(dist<140){
        ctx.strokeStyle=`rgba(255,225,150,${1-dist/140})`;
        ctx.lineWidth=0.5;
        ctx.beginPath();
        ctx.moveTo(p.x,p.y);
        ctx.lineTo(p2.x,p2.y);
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(draw);
}
draw();

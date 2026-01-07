/* ---------------------------
   LANGUAGE SETUP
---------------------------- */
let lang = localStorage.getItem("lang")
        || navigator.language.slice(0,2);

const supported = ["pt","en","es","fr","de"];
if(!supported.includes(lang)) lang = "en";

/* ---------------------------
   BOOT + PORTAL TRANSITION
---------------------------- */
const boot = document.getElementById("boot-screen");
const app = document.getElementById("app");

document.getElementById("ascender-btn").onclick = () => {
    boot.style.opacity = "0";
    setTimeout(() => {
        boot.classList.add("hidden");
        app.classList.remove("hidden");
        app.style.opacity = "1";
    }, 900);
    startAudio();
};

/* ---------------------------
   LOAD LANGUAGE FILE
---------------------------- */
async function loadLang(l) {
    const res = await fetch(`assets/lang/${l}.json`);
    const data = await res.json();

    const set = (attr, text) => {
        document.querySelectorAll(`[data-i18n="${attr}"]`)
            .forEach(el => el.innerHTML = text);
    };

    set("choose", data.choose);
    set("understandTitle", data.understandTitle);
    set("understandText", data.understandText);
    set("exploreBtn", data.exploreBtn);
    set("participateTitle", data.participateTitle);
    set("participateText", data.participateText);
    set("enterBtn", data.enterBtn);
    set("radarBtn", data.radarBtn);
    set("appsBtn", data.appsBtn);
}

loadLang(lang);

/* Swap PT/EN */
document.getElementById("lang-toggle").onclick = () => {
    lang = (lang === "pt") ? "en" : "pt";
    localStorage.setItem("lang", lang);
    loadLang(lang);
};

/* ---------------------------
   DAYS + MOON HUD
---------------------------- */
function updateDays(){
    let d = Number(localStorage.getItem("days") || 0);
    document.getElementById("days-counter").innerText = d + "D";
}
function tickDay(){
    let d = Number(localStorage.getItem("days") || 0);
    localStorage.setItem("days", d + 1);
    updateDays();
}
updateDays();
setInterval(tickDay, 60000);

function moonPhase(){
    const syn = 29.53;
    const base = new Date("2025-01-06").getTime();
    const ph = ((Date.now() - base) / 86400000) % syn;
    let m="🌑";
    if(ph<1)m="🌑"; else if(ph<8)m="🌒";
    else if(ph<15)m="🌕"; else if(ph<22)m="🌖";
    document.getElementById("moon-phase").innerText = m;
}
moonPhase();
setInterval(moonPhase, 30000);

/* ---------------------------
   BUTTONS
---------------------------- */
document.getElementById("learn-btn")
    .onclick = ()=> window.location.href = "radar.html"; // placeholder content

document.getElementById("enter-btn")
    .onclick = ()=> window.location.href = "app/index.html";

document.getElementById("radar-btn")
    .onclick = ()=> window.location.href = "radar.html";

document.getElementById("apps-btn")
    .onclick = ()=> window.location.href = "app/index.html";

/* ---------------------------
   FRACTAL PARTICLES
---------------------------- */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

let pts = [];
for(let i=0;i<60;i++){
    pts.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        vx:(Math.random()-0.5)*0.7,
        vy:(Math.random()-0.5)*0.7
    });
}

function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    pts.forEach((p,i)=>{
        p.x += p.vx;
        p.y += p.vy;
        if(p.x<0||p.x>canvas.width)p.vx*=-1;
        if(p.y<0||p.y>canvas.height)p.vy*=-1;

        ctx.fillStyle = "rgba(255,215,150,0.8)";
        ctx.beginPath();
        ctx.arc(p.x,p.y,1.5,0,Math.PI*2);
        ctx.fill();

        for(let j=i+1;j<pts.length;j++){
            let m = pts[j];
            let dist = Math.hypot(p.x-m.x,p.y-m.y);
            if(dist < 130){
                ctx.strokeStyle = `rgba(255,220,180,${1-dist/130})`;
                ctx.beginPath();
                ctx.moveTo(p.x,p.y);
                ctx.lineTo(m.x,m.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(loop);
}
loop();

/* ---------------------------
   AMBIENT SOUND (mobile safe)
---------------------------- */
let audioCtx, osc, gain, audioStarted=false;
function startAudio(){
    if(audioStarted)return;
    audioCtx=new AudioContext();
    osc=audioCtx.createOscillator();
    gain=audioCtx.createGain();
    osc.frequency.value=62;
    osc.type="sine";
    gain.gain.value=0.03;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    audioStarted=true;
}
document.addEventListener("touchstart", startAudio);
document.addEventListener("click", startAudio);

/* ---------------------------
   AVATAR FRACTAL (seeded)
---------------------------- */
try {
    const av=document.createElement("canvas");
    av.width=120; av.height=120;
    const ac=av.getContext("2d");
    let seed=localStorage.getItem("seed");
    if(!seed){
        seed=Math.floor(Math.random()*999999);
        localStorage.setItem("seed",seed);
    }
    let s=seed;
    const rand=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646;}
    let t=0;
    function draw(){
        t+=0.02;
        ac.clearRect(0,0,120,120);
        ac.fillStyle="rgba(0,0,0,0.4)";
        ac.beginPath(); ac.arc(60,60,58,0,Math.PI*2); ac.fill();
        for(let i=0;i<12;i++){
            ac.beginPath();
            let hue = Math.floor(rand()*60)+30+Math.sin(t+i)*40;
            ac.strokeStyle=`hsla(${hue},80%,70%,${0.5+Math.sin(t+i)*0.4})`;
            let x1=60+Math.cos(i+t+rand()*2)*(20+rand()*25);
            let y1=60+Math.sin(i+t+rand()*2)*(20+rand()*25);
            let x2=60+Math.cos(i*2+t+rand()*4)*(rand()*50);
            let y2=60+Math.sin(i*2+t+rand()*4)*(rand()*50);
            ac.moveTo(x1,y1); ac.lineTo(x2,y2); ac.stroke();
        }
        requestAnimationFrame(draw);
    }
    draw();

    document.querySelector('#hero').appendChild(av);

} catch(e){
    console.warn("Avatar error:",e);
}

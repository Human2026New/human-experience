/* FRASES MÍSTICAS */
const frases = [
    "A tua presença molda o tempo.",
    "Nada é mais valioso do que o agora.",
    "Só existe o momento que escolhes estar.",
    "O HUM nasce do humano.",
    "Tu és o pulso do sistema.",
    "O tempo escuta quem permanece.",
    "A consciência é a verdadeira moeda.",
    "Cada dia é um tijolo eterno.",
    "O mundo muda quando tu marcas presença.",
    "Humanos são o blockchain original."
];

/* PORTAL */
const portal = document.getElementById("portal");
const ascenderBtn = document.getElementById("ascenderBtn");
ascenderBtn.addEventListener("click", () => {
    portal.style.opacity = "0";
    portal.style.pointerEvents = "none";
    setTimeout(()=> portal.style.display="none", 1000);
});

/* HERO FRASE */
document.getElementById("heroPhrase").innerText =
    frases[Math.floor(Math.random()*frases.length)];

/* SCROLL REVEAL */
const sections = document.querySelectorAll("section");
window.addEventListener("scroll", () => {
    sections.forEach(sec=>{
        const top = sec.getBoundingClientRect().top;
        if(top < window.innerHeight - 120) sec.classList.add("visible");
    });
});

/* RADAR FAKE */
const canvas = document.getElementById("radarCanvas");
const ctx = canvas.getContext("2d");
setInterval(()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<80;i++){
        ctx.fillStyle="rgba(255,255,255,"+(Math.random()+.1)+")";
        ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height,2,2);
    }
},500);

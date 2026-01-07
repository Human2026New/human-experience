/* LISTA DE FRASES */
const frases = [
    "A tua presença molda o tempo.",
    "Não existe futuro sem agora.",
    "O HUM nasce onde estás consciente.",
    "Cada dia regressado é um tijolo eterno.",
    "Tu és o pulso do sistema.",
    "A presença é a verdadeira riqueza.",
    "O mundo escuta quem permanece.",
    "A humanidade é um só campo vivo.",
    "Tempo é energia investida.",
    "HUM é o humano em ação."
];

/* PORTAL */
const portal = document.getElementById("portal");
const ascenderBtn = document.getElementById("ascenderBtn");
ascenderBtn.addEventListener("click", () => {
    portal.style.opacity = "0";
    portal.style.pointerEvents = "none";
    setTimeout(()=> portal.style.display="none", 1200);
});

/* FRASE RANDOM */
document.getElementById("heroPhrase").innerText =
    frases[Math.floor(Math.random()*frases.length)];

/* RADAR */
const canvas = document.getElementById("radarCanvas");
const ctx = canvas.getContext("2d");
function drawRadar(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<100;i++){
        ctx.fillStyle=`rgba(255,255,255,${Math.random()})`;
        ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height,2,2);
    }
}
setInterval(drawRadar, 400);

/* REVEAL ON SCROLL */
const blocks = document.querySelectorAll(".block");
window.addEventListener("scroll", () => {
    blocks.forEach(b=>{
        const top = b.getBoundingClientRect().top;
        if(top < window.innerHeight - 100) b.style.opacity=1;
    });
});

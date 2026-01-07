/* ===============================
   PORTAL ASCENDER + SOM
================================*/
const introScreen = document.getElementById("intro-screen");
const mainScreen  = document.getElementById("main-screen");
const ascendBtn   = document.getElementById("ascend-btn");

const portalSound = new Audio("assets/sound/portal.mp3");
portalSound.volume = 0.4;

ascendBtn.addEventListener("click", () => {
    portalSound.play();

    introScreen.style.opacity = "0";
    introScreen.style.transform = "scale(1.2)";

    setTimeout(() => {
        introScreen.style.display = "none";
        mainScreen.classList.remove("hidden");
    }, 900);
});

/* ===============================
   LANGUAGE SYSTEM (PT / EN)
================================*/
const translations = {
    pt: {
        title: "Escolhe a tua jornada",
        subtitle: "Caminho, disciplina e presença",
        card1t: "Compreender",
        card1p: "Ler o protocolo. Entender as regras. Conhecer o funcionamento.",
        card2t: "Participar",
        card2p: "Marcar presença. Acumular HUM. Fazer parte do processo.",
        btn1: "Explorar",
        btn2: "Entrar"
    },
    en: {
        title: "Choose your journey",
        subtitle: "Path, discipline and presence",
        card1t: "Understand",
        card1p: "Read the protocol. Learn the rules. Discover how it works.",
        card2t: "Participate",
        card2p: "Check-in daily. Earn HUM. Be part of the process.",
        btn1: "Explore",
        btn2: "Enter"
    }
};

function setLang(lang) {
    localStorage.setItem("lang", lang);

    document.getElementById("title-main").innerText   = translations[lang].title;
    document.getElementById("subtitle-main").innerText = translations[lang].subtitle;

    document.getElementById("card1-title").innerText = translations[lang].card1t;
    document.getElementById("card1-text").innerText  = translations[lang].card1p;
    document.getElementById("btn-understand").innerText = translations[lang].btn1;

    document.getElementById("card2-title").innerText = translations[lang].card2t;
    document.getElementById("card2-text").innerText  = translations[lang].card2p;
    document.getElementById("btn-participate").innerText = translations[lang].btn2;
}

function initLang() {
    let saved = localStorage.getItem("lang");
    setLang(saved ? saved : "pt");
}

document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        setLang(btn.dataset.lang);
    });
});

/* ===============================
   BUTTON NAVIGATION
================================*/
document.getElementById("btn-understand")
    .addEventListener("click", () => window.location.href = "app/info.html");

document.getElementById("btn-participate")
    .addEventListener("click", () => window.location.href = "app/choose.html");

/* ===============================
   PARTICLES — Follow Touch
================================*/
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];
const maxParticles = 40;

function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

function spawn(x, y) {
    particles.push({ x, y, alpha: 1, size: Math.random()*3+2 });
    if (particles.length > maxParticles) particles.shift();
}

window.addEventListener("mousemove", e => spawn(e.clientX, e.clientY));
window.addEventListener("touchmove", e => {
    const t = e.touches[0];
    spawn(t.clientX, t.clientY);
});

function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach(p => {
        p.alpha -= 0.015;
        p.y -= 0.3;

        ctx.beginPath();
        ctx.fillStyle = `rgba(247,230,196,${p.alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
    });

    particles = particles.filter(p => p.alpha > 0);
    requestAnimationFrame(animate);
}
animate();

/* ===============================
   MOON PHASE PLACEHOLDER
================================*/
document.getElementById("moon-phase").innerHTML = "🌕";

/* ===============================
   INIT EVERYTHING
================================*/
initLang();

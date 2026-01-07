/* ============================================
   PORTAL ASCENDER → ZOOM BLAST + ENTRADA
============================================ */
const portal = document.getElementById("portal");
const portalTitle = document.getElementById("portal-title");
const portalBtn = document.getElementById("portal-btn");
const body = document.body;

// Som opcional
let sound;
try { sound = new Audio("assets/sound/portal.mp3"); } catch(e){}

portalBtn.addEventListener("click", () => {
    if(sound) sound.play();

    portalTitle.classList.add("portal-blast");
    portalBtn.classList.add("portal-blast");

    setTimeout(() => {
        portal.style.opacity = "0";
        portal.style.transition = "opacity 0.8s";
    }, 300);

    setTimeout(() => {
        body.classList.remove("portal-active");
        portal.style.display = "none";
        revealOnScroll();
    }, 1200);
});

/* ============================================
   HERO — FRASES MÍSTICAS ALEATÓRIAS (50 lines)
============================================ */
const mysticLines = [
    "És presença. És tempo. És HUMAN.",
    "O teu caminho começa agora.",
    "Um passo por dia transforma o mundo.",
    "O tempo é o único recurso realmente teu.",
    "Tu és a tua própria revolução silenciosa.",
    "Cada presença cria um novo universo.",
    "Camina, não corras. O tempo floresce.",
    "A disciplina é a ponte entre intenção e realidade.",
    "Presença transforma destino.",
    "O relógio humano marca possibilidades.",
    "És parte do tempo, és parte da história.",
    "A humanidade cresce contigo.",
    "Não busques pressa, constrói ritmo.",
    "Cada toque é uma semente temporal.",
    "O agora é o maior poder que existe.",
    "A frequência da presença ressoa no sistema.",
    "A consistência vence o caos.",
    "Senta-te no tempo e observa.",
    "O mundo muda quando tu mudas.",
    "Tu és o andar seguinte.",
    "Cada dia conta. Conta o teu.",
    "A mudança nasce da repetição consciente.",
    "A tua presença é a tua assinatura.",
    "Disciplina hoje, liberdade amanhã.",
    "A atenção é a forma mais pura de respeito a ti mesmo.",
    "Há um universo inteiro dentro de cada momento.",
    "A jornada humana nunca foi sobre velocidade.",
    "És feito de instantes.",
    "A cada amanhecer, renasces.",
    "O compromisso silencioso cria futuros ruidosos.",
    "A tua presença sustenta a rede.",
    "Coerência transforma intenção em realidade.",
    "A vida responde à constância.",
    "Tu és o próximo capítulo.",
    "Honra o teu próprio ritmo.",
    "Onde pões consciência, se expande.",
    "Cada dia aproxima-te da tua melhor versão.",
    "A persistência te revela o impossível.",
    "A vida é o que medes com a tua atenção.",
    "O futuro agradece a tua presença hoje.",
    "Tu és o início e a continuidade.",
    "A presença guia o propósito.",
    "Uma vida muda com pequenos gestos repetidos.",
    "A tua consistência inspira o planeta.",
    "O silêncio entre ações constrói força.",
    "O tempo humano é sagrado.",
    "Respira. Anda. Alinha. Recomeça.",
    "Sê constante, mesmo quando ninguém vê.",
    "Ascender é escolher voltar todos os dias.",
    "O sistema observa. E aprende contigo.",
    "Tu és HUMAN porque estás presente."
];
document.getElementById("mystic-line").textContent =
    mysticLines[Math.floor(Math.random() * mysticLines.length)];

/* ============================================
   SCROLL REVEAL (section-by-section)
============================================ */
const sections = document.querySelectorAll(".section");
function revealOnScroll() {
    const trigger = window.innerHeight * 0.75;
    sections.forEach(sec => {
        const box = sec.getBoundingClientRect().top;
        if (box < trigger) sec.classList.add("visible");
    });
}
window.addEventListener("scroll", revealOnScroll);

/* ============================================
   HUD CONSTELAÇÃO 365 DAYS
============================================ */
const TOTAL_DAYS = 365;
const ONE_DAY_MS = 86400000;
const progressLine = document.getElementById("progress-line");

function buildDots() {
    progressLine.innerHTML = "";
    for (let i = 0; i < TOTAL_DAYS; i++) {
        const d = document.createElement("div");
        d.classList.add("progress-dot");
        progressLine.appendChild(d);
    }
}

function updateHUD() {
    let start = localStorage.getItem("startDate");
    if (!start) {
        start = Date.now();
        localStorage.setItem("startDate", start);
    }
    const diff = Math.floor((Date.now() - start) / ONE_DAY_MS);

    const dots = document.querySelectorAll(".progress-dot");

    // RULE SET BY HELDER: RESET IF MISSED A DAY
    if (diff < 0 || diff > TOTAL_DAYS) {
        localStorage.removeItem("startDate");
        buildDots();
        return;
    }

    dots.forEach((d, i) => {
        if (i < diff) {
            d.classList.add("active");
            if ([30,100,200,365].includes(i)) d.classList.add("milestone");
        }
    });
}

buildDots();
updateHUD();

/* ============================================
   RADAR HUMANO (placeholder dots)
============================================ */
const radarCanvas = document.getElementById("radar-canvas");
if (radarCanvas) {
    const rctx = radarCanvas.getContext("2d");
    let dots = Array.from({length:30},()=>({
        x:Math.random()*radarCanvas.width,
        y:Math.random()*radarCanvas.height,
        a:1
    }));
    function animateRadar() {
        rctx.clearRect(0,0,radarCanvas.width,radarCanvas.height);
        dots.forEach(p=>{
            p.a -= 0.01;
            if(p.a<=0){
                p.x=Math.random()*radarCanvas.width;
                p.y=Math.random()*radarCanvas.height;
                p.a=1;
            }
            rctx.fillStyle=`rgba(247,230,196,${p.a})`;
            rctx.beginPath();
            rctx.arc(p.x,p.y,3,0,Math.PI*2);
            rctx.fill();
        });
        requestAnimationFrame(animateRadar);
    }
    radarCanvas.width = radarCanvas.clientWidth;
    radarCanvas.height = radarCanvas.clientHeight;
    animateRadar();
}

/* ============================================
   LANGUAGE SWITCH
============================================ */
document.querySelectorAll(".lang-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
        const lang = btn.dataset.lang;
        fetch(`./assets/lang/${lang}.json`)
            .then(r=>r.json())
            .then(data=>{
                document.getElementById("hero-title").textContent = data.hero.title;
            });
    });
});

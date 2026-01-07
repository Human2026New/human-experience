/* PORTAL */
const portal = document.getElementById("portal-screen");
const mainContent = document.getElementById("main-content");
document.getElementById("ascender-btn").addEventListener("click", ()=>{
    document.getElementById("portal-sound").play();
    portal.style.opacity="0";
    setTimeout(()=>{ 
        portal.style.display="none";
        document.body.classList.remove("portal-active");
        mainContent.style.opacity="1";
    },1400);
});

/* DAY COUNTER */
let count = localStorage.getItem("hum_days") || 0;
document.getElementById("day-counter").innerText = count+"D";

/* MOON SIMPLIFIED STATIC */
document.getElementById("moon-phase").innerHTML="🌕";

/* LANG */
const dict={
    pt:{
        hero_title:"Escolhe a tua jornada",
        hero_sub:"Caminho, disciplina e presença",
        learn_title:"Compreender",
        learn_desc:"Ler o protocolo. Entender as regras. Conhecer o funcionamento.",
        join_title:"Participar",
        join_desc:"Marcar presença. Acumular HUM. Fazer parte do processo.",
        btn_learn:"Explorar",
        btn_join:"Entrar"
    },
    en:{
        hero_title:"Choose your journey",
        hero_sub:"Path, discipline and presence",
        learn_title:"Understand",
        learn_desc:"Read the protocol. Learn rules. Know how it works.",
        join_title:"Participate",
        join_desc:"Check-in daily. Accumulate HUM. Join the process.",
        btn_learn:"Explore",
        btn_join:"Enter"
    }
};

function setLang(l){
    document.querySelectorAll("[data-i18n]").forEach(el=>{
        el.innerText=dict[l][el.dataset.i18n];
    });
}

document.querySelectorAll("#lang-switch button").forEach(btn=>{
    btn.addEventListener("click",()=>setLang(btn.dataset.lang));
});

setLang("pt");

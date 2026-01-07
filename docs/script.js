const phrases = [
"Tu és HUMAN porque estás presente.",
"A tua presença molda o tempo.",
"O futuro nasce nos teus dias.",
"A disciplina revela a consciência.",
"O tempo humano é ouro invisível.",
"A constância vence o caos.",
"O caminho cria quem caminha.",
"Nada muda se tu não mudares.",
"A presença é a chave do legado.",
"A jornada é o destino.",
"A luz nasce na repetição.",
"O invisível registra-te.",
"O hábito cria o humano.",
"Um dia de cada vez, para sempre.",
"Existir é participar.",
"A tua marca permanece.",
"O tempo é o espelho da vontade.",
"A Humanidade conta contigo."
];

document.addEventListener("DOMContentLoaded", () => {
    const ascenderBtn = document.getElementById("ascenderBtn");
    const portal = document.getElementById("portal");
    const hero = document.getElementById("hero");
    const heroPhrase = document.getElementById("heroPhrase");
    const avatar = document.getElementById("avatar");
    const radarBox = document.getElementById("radarBox");
    const platformBox = document.getElementById("platformBox");

    ascenderBtn.addEventListener("click", () => {
        portal.classList.add("fade-out");
        setTimeout(() => {
            portal.style.display = "none";
            hero.classList.remove("hidden");
        }, 800);

        const random = phrases[Math.floor(Math.random() * phrases.length)];
        heroPhrase.textContent = random;
    });

    // Scroll reveal
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.remove("hidden");
        });
    }, { threshold: 0.2 });

    document.querySelectorAll("section, footer").forEach(sec => {
        observer.observe(sec);
    });

    // Show HUD items at scroll
    const hudObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                avatar.classList.remove("hidden");
                radarBox.classList.remove("hidden");
                platformBox.classList.remove("hidden");
            }
        });
    }, { threshold: 0.5 });

    hudObserver.observe(document.body);
});

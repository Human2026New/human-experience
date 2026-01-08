/******** LANGUAGE ********/
function setLang(l){
  localStorage.setItem("lang",l);
  document.querySelectorAll("[data-pt]").forEach(el=>{
    el.innerHTML = el.getAttribute(`data-${l}`);
  });
}
setLang(localStorage.getItem("lang")||"pt");

/******** MUSIC AFTER ASCENSION ********/
const bgm=document.getElementById("bgm");
if(localStorage.getItem("playMusic")==="yes"){
  bgm.muted=false;
}

/******** PAGE FADE IN ********/
window.addEventListener("load",()=>{
  setTimeout(()=>{
    const m=document.getElementById("page-content");
    if(m)m.classList.add("show");
  },300);
});

/******** SCROLL APPEAR ********/
const slides=document.querySelectorAll(".slide");
const ob=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting)e.target.classList.add("show");
}));
slides.forEach(s=>ob.observe(s));

import "./styles/main.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { product } from "./data/product.js";
import { renderAll } from "./components/render.js";
import { initCursor } from "./components/cursor.js";
import { createParticles } from "./components/particles.js";
import { initStage, isMobile } from "./animations/stage.js";
import { initSpec, initApps, initReveal, initFinal } from "./animations/sections.js";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

renderAll();

/* ---------- Scroll suave ---------- */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}
const goTo = (target) => {
  const el = typeof target === "string" ? $(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 2.2, offset: 0 });
  else el.scrollIntoView({ behavior: "smooth" });
};
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.classList.contains("js-cta")) return;
  const href = a.getAttribute("href");
  if (href.length < 2) return;
  e.preventDefault();
  if (href === "#topo") (lenis ? lenis.scrollTo(0, { duration: 2.4 }) : window.scrollTo({ top: 0, behavior: "smooth" }));
  else goTo(href);
});
window.addEventListener("viper:goto", (e) => goTo(e.detail));

/* ---------- Loader: carrega as 3 cores antes de iniciar ---------- */
function preload(srcs, onProgress) {
  let done = 0;
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise((res) => {
          const img = new Image();
          img.decoding = "async";
          img.onload = img.onerror = () => {
            done++;
            onProgress(done / srcs.length);
            res();
          };
          img.src = src;
        })
    )
  );
}

const bar = $(".loader__bar i");
const pct = $(".loader__pct");
const timeout = new Promise((r) => setTimeout(r, 8000));
Promise.race([
  Promise.all([
    preload(product.colors.map((c) => c.image), (p) => {
      bar.style.transform = `scaleX(${p})`;
      pct.textContent = String(Math.round(p * 100)).padStart(3, "0");
    }),
    document.fonts ? document.fonts.ready : Promise.resolve(),
  ]),
  timeout,
]).then(start);

/* ---------- Início ---------- */
function start() {
  initCursor();
  const particles = reduced ? null : createParticles($(".particles"));

  /* progresso */
  const nav = $(".progress");
  const items = $$(".progress__list li");
  const fill = $(".progress__fill");
  let chapter = 0;
  const setChapter = (c) => {
    if (c === chapter) return;
    chapter = c;
    items.forEach((li, i) => {
      li.classList.toggle("is-active", i === c);
      li.classList.toggle("is-done", i < c);
    });
  };
  items[0].classList.add("is-active");

  const mobileCta = $(".mobile-cta");
  let heroLeft = false;
  let inFinal = false;
  const syncMobileCta = () => mobileCta.classList.toggle("is-visible", heroLeft && !inFinal);

  let stageActive = true;
  const stage = initStage({
    particles,
    onChapter: (c) => {
      if (stageActive) setChapter(c);
    },
    onHeroLeave: (v) => {
      if (v !== heroLeft) {
        heroLeft = v;
        syncMobileCta();
      }
    },
  });
  ScrollTrigger.create({
    trigger: ".stage",
    start: "top top",
    endTrigger: ".spec",
    end: "top 60%",
    onToggle: (s) => (stageActive = s.isActive),
  });

  initSpec();
  initApps();
  initReveal();
  initFinal();

  [
    [".spec", 2],
    [".apps", 3],
    ["#lancamento", 4],
  ].forEach(([sel, c]) =>
    ScrollTrigger.create({
      trigger: sel,
      start: "top 60%",
      end: sel === "#lancamento" ? "max" : "bottom 60%",
      onToggle: (s) => s.isActive && setChapter(c),
    })
  );
  const finalEl = $(".final");
  const checkFinal = () => {
    const v = finalEl.getBoundingClientRect().top < innerHeight * 0.7;
    if (v !== inFinal) {
      inFinal = v;
      syncMobileCta();
    }
  };
  window.addEventListener("scroll", checkFinal, { passive: true });
  checkFinal();

  const header = $(".header");
  const stageEnd = () => stage.st.end - innerHeight * 0.2;
  // barra de progresso geral
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (s) => {
      if (isMobile()) fill.style.transform = `scaleX(${s.progress})`;
      else fill.style.transform = `scaleY(${s.progress})`;
      nav.classList.toggle("is-visible", s.scroll() > innerHeight * 0.3 || isMobile());
      header.classList.toggle("is-solid", s.scroll() > stageEnd());
    },
  });

  ScrollTrigger.refresh();

  document.body.classList.remove("is-loading");
  stage.intro();
  stage.loadSequences();
  lenis && lenis.start();

  // recalcula após imagens tardias
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

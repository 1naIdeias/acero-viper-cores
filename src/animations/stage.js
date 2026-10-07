/* ==========================================================================
   PALCO PRINCIPAL — controlado pelo scroll
   HERO → COR 01 → COR 02 → COR 03 → EXPANSÃO → NANO-RIPSTOP → TPU → GEL PU → SOLADO
   ========================================================================== */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { product } from "../data/product.js";
import { createSequence } from "../components/sequence.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = (n) => String(n).padStart(2, "0");

export const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

/* Onde o ponto de foco da bota fica na tela durante as tecnologias */
function focusScreen() {
  const vw = innerWidth;
  const vh = $(".stage__inner").clientHeight;
  return isMobile() ? { x: vw * 0.5, y: vh * 0.36 } : { x: vw * 0.33, y: vh * 0.58 };
}

/* Calcula x/y/scale do rig para colocar o ponto (u,v) da bota no ponto de foco */
function focusOn(u, v, s) {
  const rig = $(".rig");
  const W = rig.offsetWidth;
  const H = rig.offsetHeight;
  const vw = innerWidth;
  const vh = $(".stage__inner").clientHeight;
  const F = focusScreen();
  const scale = isMobile() ? s * 0.82 : s;
  return {
    x: F.x - vw / 2 - (u - 0.5) * W * scale,
    y: F.y - vh / 2 - (v - 0.5) * H * scale,
    scale,
  };
}

export function initStage({ particles, onChapter, onHeroLeave }) {
  const stage = $(".stage");
  const rig = $(".rig");
  const boots = $$(".boot");
  const hero = $(".hero");
  const heroTitle = $(".hero__title");
  const heroBottom = $(".hero__bottom");
  const type = $(".stage__type span");
  const hud = $(".hud");
  const hudNum = $(".js-hud-num");
  const hudName = $(".js-hud-name");
  const hudDots = $$(".js-hud-dots i");
  const spot = $(".stage__spot");
  const grid = $(".stage__grid");
  const gravel = $(".stage__gravel");
  const expand = $(".expand-copy");
  const callout = $(".callout");
  const cTitle = $(".js-callout-title");
  const cSub = $(".js-callout-sub");
  const techs = $$(".tech");
  const zones = $$(".tech__zones li");
  const xray = $(".xray");
  const xrayPaths = $$(".xray__insole", xray);
  const stageCode = $(".js-stage-code");
  const scrim = $(".techs__scrim");

  const setCalloutPos = () => {
    const F = focusScreen();
    callout.style.setProperty("--fx", F.x + "px");
    callout.style.setProperty("--fy", F.y + "px");
    callout.style.setProperty("--len", (isMobile() ? 9 : 20) + "vh");
  };
  setCalloutPos();
  ScrollTrigger.addEventListener("refreshInit", setCalloutPos);

  // comprimento real das linhas da palmilha (para desenhar)
  xrayPaths.forEach((p) => {
    const L = p.getTotalLength();
    p.style.strokeDasharray = p.classList.contains("xray__insole--fill") ? "4 6" : L;
    if (!p.classList.contains("xray__insole--fill")) p.style.strokeDashoffset = L;
  });

  /* escurecimento da bota: camada mascarada (http) ou filtro na imagem (file://) */
  const dimEl = boots[2].querySelector(".boot__dim");
  const dimT = dimEl || boots[2].querySelector("img");
  const dimTo = (a) => (dimEl ? { opacity: a, duration: 0.8 } : { filter: `brightness(${1 - a})`, duration: 0.8 });

  const blur = (v) => (isMobile() ? "blur(0px)" : `blur(${v}px)`);

  gsap.set(boots, { opacity: 0 });
  gsap.set(boots[0], { opacity: 1 });
  gsap.set(rig, { x: 0, y: () => $(".stage__inner").clientHeight * (isMobile() ? 0.02 : 0.04), scale: 1, rotation: 0, "--lx": "26%", "--ly": "26%" });
  gsap.set(spot, { "--spot": "70, 70, 70", "--spot-a": 0.55, "--sx": "50%", "--sy": "52%" });

  /* ---------- estados discretos (texto do HUD/callout) a partir do tempo ---------- */
  const colorSteps = [0, 3.25, 5.3]; // tempo em que cada cor passa a ser a "atual"
  const calloutSteps = [];
  const techWindows = [];

  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

  /* ===== HERO → saída ===== */
  tl.addLabel("hero", 0)
    .to(heroTitle, { y: -60, opacity: 0, duration: 0.9, ease: "power2.in" }, 0.3)
    .to(heroBottom, { y: 50, opacity: 0, duration: 0.9, ease: "power2.in" }, 0.3)
    .to(type, { scale: 1.12, opacity: 0.35, duration: 1.6 }, 0.3)
    .to(rig, { y: 0, scale: () => (isMobile() ? 1.02 : 1.08), rotation: -2, duration: 1.4 }, 0.4)
    .to(hud, { opacity: 1, duration: 0.6 }, 1.1)
    .fromTo(hudDots[0], { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, 1.2)
    .to(rig, { "--lx": "44%", duration: 1.4, ease: "none" }, 1.4);

  /* ===== COR 01 → 02 → 03 ===== */
  /* sequências "troca de escamas" (canvas por cima das fotos) */
  const seqs = product.transitions.map((t, i) => ({
    canvas: $(`.boot-seq[data-seq="${i}"]`),
    player: createSequence($(`.boot-seq[data-seq="${i}"]`), {
      base: t.base,
      count: t.count,
      fallback: [boots[t.from].querySelector("img"), boots[t.to].querySelector("img")],
    }),
    proxy: { f: 0 },
  }));
  ScrollTrigger.addEventListener("refresh", () => seqs.forEach((q) => q.player.resize()));

  const SEQ_DUR = 1.9;
  const colorTransition = (from, to, at, light, spotRGB, rot) => {
    const q = seqs[from];
    const N = product.transitions[from].count - 1;
    // canvas assume no lugar da foto (as fotos fazem um crossfade simples por baixo, como reserva)
    tl.fromTo(q.canvas, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none", immediateRender: false }, at)
      .fromTo(
        q.proxy,
        { f: 0 },
        { f: N, duration: SEQ_DUR, ease: "none", immediateRender: false, onUpdate: () => q.player.draw(q.proxy.f) },
        at
      )
      .to(boots[from], { opacity: 0, duration: 0.08, ease: "none" }, at + 0.1)
      .fromTo(boots[to], { opacity: 0 }, { opacity: 1, duration: 0.08, ease: "none", immediateRender: false }, at + SEQ_DUR - 0.2)
      .to(q.canvas, { opacity: 0, duration: 0.12, ease: "none" }, at + SEQ_DUR - 0.02)
      .to(rig, { rotation: rot > 0 ? 1.5 : -1.5, x: () => innerWidth * (isMobile() ? 0 : rot > 0 ? 0.015 : -0.015), duration: SEQ_DUR }, at)
      .fromTo(rig, { "--lx": "15%" }, { "--lx": light, duration: 1.6, ease: "power1.out" }, at + 0.3)
      .to(spot, { "--spot": spotRGB, "--sx": rot > 0 ? "56%" : "44%", duration: SEQ_DUR }, at)
      .fromTo(hudName, { yPercent: 0, opacity: 1 }, { yPercent: -40, opacity: 0, duration: 0.35, ease: "power2.in", immediateRender: false }, at + 0.6)
      .fromTo(hudName, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: "power2.out", immediateRender: false }, at + 1.0)
      .fromTo(hudDots[to], { scaleX: 0 }, { scaleX: 1, duration: 1.2 }, at + 0.3);
  };
  colorTransition(0, 1, 2.3, product.colors[1].light, "92, 78, 60", 3);
  tl.to(rig, { scale: () => (isMobile() ? 1.04 : 1.1), duration: 0.5, ease: "none" }, 4.2);
  colorTransition(1, 2, 4.35, product.colors[2].light, "104, 94, 76", -3);
  tl.to(rig, { scale: () => (isMobile() ? 1.06 : 1.12), duration: 0.5, ease: "none" }, 6.4);

  /* ===== EXPANSÃO ===== */
  tl.addLabel("expand", 6.5)
    .to(hud, { opacity: 0, y: 20, duration: 0.6 }, 6.5)
    .to(type, { opacity: 0, scale: 1.3, duration: 1.0 }, 6.5)
    .to(rig, { x: 0, y: () => -$(".stage__inner").clientHeight * 0.02, scale: () => (isMobile() ? 1.3 : 1.5), rotation: 0, "--lx": "50%", duration: 1.6, ease: "power3.inOut" }, 6.6)
    .to(spot, { "--spot-a": 0.22, "--sx": "50%", duration: 1.6 }, 6.6)
    .to(grid, { opacity: 0.25, duration: 1.2 }, 6.6)
    .fromTo(expand, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 7.4)
    .to(expand, { opacity: 0, y: -20, duration: 0.6, ease: "power2.in" }, 8.4)
    .to(dimT, dimTo(0.55), 7.1)
    .to(dimT, dimTo(0), 8.6);

  /* ===== TECNOLOGIAS ===== */
  tl.to(scrim, { opacity: 1, duration: 0.8 }, 9.2).to(scrim, { opacity: 0, duration: 0.8 }, 20.9);
  const calloutIn = (at) =>
    tl.fromTo(callout, { opacity: 0, "--draw": 100 }, { opacity: 1, "--draw": 0, duration: 0.5, ease: "power2.out", immediateRender: false }, at);
  const calloutOut = (at) => tl.to(callout, { opacity: 0, duration: 0.3, ease: "power2.in" }, at);
  const panelIn = (el, at) =>
    tl.fromTo(el, { autoAlpha: 0, x: () => (isMobile() ? 0 : 40), y: () => (isMobile() ? 30 : 0) }, { autoAlpha: 1, x: 0, y: 0, duration: 0.6, ease: "power3.out", immediateRender: false }, at);
  const panelOut = (el, at) => tl.to(el, { autoAlpha: 0, x: () => (isMobile() ? 0 : -20), duration: 0.4, ease: "power2.in" }, at);
  const moveTo = (f, at, dur = 1.1, extra = {}) =>
    tl.to(rig, { x: () => focusOn(f.u, f.v, f.scale).x, y: () => focusOn(f.u, f.v, f.scale).y, scale: () => focusOn(f.u, f.v, f.scale).scale, duration: dur, ease: "power3.inOut", ...extra }, at);

  const [tRip, tTpu, tGel, tSol] = product.technologies;

  // 01 · NANO-RIPSTOP
  let t = 8.9;
  techWindows.push([t, 11.5, 0]);
  moveTo(tRip.focus[0], t, 1.2, { rotation: 0, "--lx": "60%", "--ly": "40%" });
  calloutSteps.push([t, tRip.focus[0]]);
  calloutIn(t + 0.8);
  panelIn(techs[0], t + 0.8);
  calloutOut(11.1);
  panelOut(techs[0], 11.1);

  // 02 · TPU — biqueira, depois calcanheira
  t = 11.5;
  techWindows.push([t, 15.6, 1]);
  moveTo(tTpu.focus[0], t, 1.2, { "--lx": "85%", "--ly": "55%" });
  calloutSteps.push([t, tTpu.focus[0]]);
  calloutIn(t + 0.9);
  panelIn(techs[1], t + 0.9);
  calloutOut(13.4);
  moveTo(tTpu.focus[1], 13.5, 1.3, { "--lx": "12%", "--ly": "50%" });
  calloutSteps.push([13.5, tTpu.focus[1]]);
  calloutIn(14.5);
  calloutOut(15.2);
  panelOut(techs[1], 15.2);

  // 03 · GEL PU — bota escurece, palmilha "raio-x"
  t = 15.6;
  techWindows.push([t, 18.2, 2]);
  moveTo(tGel.focus[0], t, 1.2, { "--lx": "50%", "--ly": "30%" });
  tl.to(dimT, dimTo(0.62), t + 0.3)
    .to(xray, { opacity: 1, duration: 0.5 }, t + 0.8)
    .to(xrayPaths[0], { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut" }, t + 0.8);
  calloutSteps.push([t, tGel.focus[0]]);
  calloutIn(t + 1.0);
  panelIn(techs[2], t + 1.0);
  calloutOut(17.8);
  panelOut(techs[2], 17.8);
  tl.to(xray, { opacity: 0, duration: 0.4 }, 17.9).to(dimT, dimTo(0), 18.0);

  // 04 · SOLADO — aproximação progressiva + terreno
  t = 18.2;
  techWindows.push([t, 21.2, 3]);
  moveTo(tSol.focus[0], t, 1.4, { rotation: -3, "--lx": "40%", "--ly": "85%" });
  tl.to(gravel, { opacity: 0.55, duration: 1.4 }, t + 0.2)
    .to(spot, { "--sy": "80%", "--spot-a": 0.32, duration: 1.4 }, t);
  calloutSteps.push([t, tSol.focus[0]]);
  calloutIn(t + 1.1);
  panelIn(techs[3], t + 1.1);
  tl.to(rig, { scale: () => focusOn(tSol.focus[0].u, tSol.focus[0].v, tSol.focus[0].scale * 1.06).scale, x: () => focusOn(tSol.focus[0].u, tSol.focus[0].v, tSol.focus[0].scale * 1.06).x, y: () => focusOn(tSol.focus[0].u, tSol.focus[0].v, tSol.focus[0].scale * 1.06).y, duration: 1.3, ease: "none" }, t + 1.4);
  calloutOut(20.8);
  panelOut(techs[3], 20.8);

  /* ===== SAÍDA DO PALCO ===== */
  tl.to(rig, { x: 0, y: () => -$(".stage__inner").clientHeight * 0.05, scale: () => (isMobile() ? 0.9 : 0.85), rotation: 0, opacity: 0, duration: 1.3, ease: "power2.inOut" }, 21.0)
    .to(gravel, { opacity: 0, duration: 1.0 }, 21.0)
    .to(spot, { "--spot-a": 0, duration: 1.2 }, 21.0)
    .to({}, { duration: 0.3 }, 22.3);

  /* abre espaço para a cor COYOTE respirar: empurra tudo a partir da 2ª troca */
  const SHIFT = 1.2,
    AT = 4.3;
  tl.shiftChildren(SHIFT, true, AT);
  const toBase = (t) => (t >= AT + SHIFT ? t - SHIFT : t >= AT ? AT : t);

  const TOTAL = tl.duration();
  tl.eventCallback("onUpdate", () => update());

  /* ---------- atualização dos estados discretos ---------- */
  let lastColor = -1,
    lastCallout = -1,
    lastZone = -1,
    lastCode = "";
  const update = () => {
    const time = toBase(tl.time());
    // cor
    let ci = 0;
    colorSteps.forEach((s, i) => {
      if (time >= s) ci = i;
    });
    if (ci !== lastColor) {
      lastColor = ci;
      hudNum.textContent = pad(ci + 1);
      hudName.textContent = product.colors[ci].name;
    }
    // callout
    let k = 0;
    calloutSteps.forEach(([s], i) => {
      if (time >= s) k = i;
    });
    if (k !== lastCallout) {
      lastCallout = k;
      cTitle.textContent = calloutSteps[k][1].label;
      cSub.textContent = calloutSteps[k][1].sub;
    }
    // zonas TPU
    const z = time >= 13.5 ? 1 : 0;
    if (z !== lastZone) {
      lastZone = z;
      zones.forEach((el, i) => el.classList.toggle("is-on", i === z));
    }
    // palmilha ao vivo só durante o GEL PU
    xray.classList.toggle("is-live", time > 16.3 && time < 18);
    // código da seção
    const code = time < 6.5 ? "SEC.01 — APRESENTAÇÃO" : time < 8.9 ? "SEC.02 — ENGENHARIA" : "SEC.02 — TECNOLOGIA " + pad((techWindows.findIndex(([a, b]) => time >= a && time < b) + 1) || 4) + " / 04";
    if (code !== lastCode) {
      lastCode = code;
      stageCode.textContent = code;
    }
    onChapter && onChapter(time < 6.5 ? 0 : 1);
    onHeroLeave && onHeroLeave(time > 1.0);
  };

  const st = ScrollTrigger.create({
    trigger: stage,
    start: "top top",
    end: () => "+=" + Math.round(innerHeight * (isMobile() ? 10 : 12.1)),
    pin: ".stage__inner",
    pinSpacing: true,
    scrub: isMobile() ? 0.6 : 1,
    animation: tl,
    invalidateOnRefresh: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      particles && particles.kick(self.getVelocity() / 8000);
    },
    onToggle: (self) => {
      if (self.isActive) particles && particles.start();
      else particles && particles.stop();
      rig.classList.toggle("is-still", !self.isActive);
    },
  });
  update();

  // estado inicial de entrada (após loader)
  const intro = () => {
    gsap.from(".rig__layers", { opacity: 0, yPercent: 6, scale: 0.94, duration: 1.8, ease: "power3.out" });
    gsap.from(".rig__shadow", { opacity: 0, duration: 1.8, ease: "power3.out" });
    gsap.from(".stage__type", { opacity: 0, scale: 0.94, duration: 2.2, ease: "power3.out" });
    gsap.from([".hero__brand", ".hero__model"], { yPercent: 110, opacity: 0, duration: 1.2, stagger: 0.1, ease: "power3.out", delay: 0.2 });
    gsap.from([".hero__tagline", ".hero__text", ".hero .btn", ".scroll-hint"], { y: 24, opacity: 0, duration: 1, stagger: 0.08, ease: "power3.out", delay: 0.5 });
    gsap.from(".stage__frame", { opacity: 0, duration: 1.5, delay: 0.6 });
  };

  // carrega os quadros em segundo plano, logo após a entrada
  const loadSequences = () => seqs.reduce((p, q) => p.then(() => q.player.load()), Promise.resolve()).then(() => tl.invalidate && update());

  return { st, tl, intro, TOTAL, loadSequences };
}

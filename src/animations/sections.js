/* Seções após o palco: CADA DETALHE · APLICAÇÕES · REVELAÇÃO · CTA */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isMobile } from "./stage.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function initSpec() {
  const sec = $(".spec");
  const lines = $$(".spec__lines path");
  lines.forEach((p) => {
    const L = p.getTotalLength();
    p.style.strokeDasharray = L;
    p.style.strokeDashoffset = L;
  });

  gsap.from([".spec__head .eyebrow", ".spec__head .h2"], {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: { trigger: sec, start: "top 75%" },
  });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: ".spec__sheet", start: "top 80%", end: "center 55%", scrub: 0.8 },
  });
  tl.from(".spec__img", { opacity: 0, scale: 0.9, xPercent: -4, duration: 1, ease: "power2.out" })
    .to(lines, { strokeDashoffset: 0, duration: 0.8, stagger: 0.12, ease: "power1.inOut" }, 0.4)
    .from(".pin", { scale: 0, opacity: 0, duration: 0.3, stagger: 0.12 }, 0.4)
    .from(".pin__tag", { opacity: 0, x: (i, el) => (el.style.transform.includes("-100%") ? 12 : -12), duration: 0.4, stagger: 0.12 }, 0.7)
    .from(".spec__row", { opacity: 0, y: 16, duration: 0.4, stagger: 0.08 }, 0.5);

  gsap.from(".spec__foot > *", {
    opacity: 0,
    y: 12,
    stagger: 0.08,
    duration: 0.8,
    scrollTrigger: { trigger: ".spec__foot", start: "top 92%" },
  });
}

export function initApps() {
  const apps = $$(".app");
  gsap.from([".apps__head .eyebrow", ".apps__head .h2"], {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".apps", start: "top 75%" },
  });

  const mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", () => {
    gsap.to(apps, {
      clipPath: "inset(0% 0 0 0)",
      ease: "power2.out",
      stagger: 0.15,
      scrollTrigger: { trigger: ".apps__track", start: "top 85%", end: "top 25%", scrub: 0.8 },
    });
    apps.forEach((a) => {
      gsap.fromTo(
        a.querySelector(".app__img"),
        { yPercent: -6 },
        { yPercent: 6, ease: "none", scrollTrigger: { trigger: a, start: "top bottom", end: "bottom top", scrub: true } }
      );
    });
  });
  mm.add("(max-width: 767px)", () => {
    apps.forEach((a) => {
      gsap.to(a, {
        clipPath: "inset(0% 0 0 0)",
        ease: "power2.out",
        scrollTrigger: { trigger: a, start: "top 92%", end: "top 45%", scrub: 0.6 },
      });
    });
  });
}

export function initReveal() {
  const sec = $(".reveal");
  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
  tl.to(".reveal__glow", { opacity: 1, duration: 1.2 }, 0)
    .fromTo(".reveal__img--sil", { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.4 }, 0.2)
    .fromTo(".reveal__line--1", { opacity: 0, y: 30, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }, 1.0)
    .to({}, { duration: 0.8 })
    .to(".reveal__line--1", { opacity: 0, y: -20, duration: 0.6, ease: "power2.in" }, 2.7)
    .fromTo(".reveal__line--2", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 3.2)
    .to(".reveal__img--lit", { opacity: 1, duration: 1.4 }, 3.6)
    .to(".reveal__img--sil", { opacity: 0, duration: 1.4 }, 3.6)
    .to(".reveal__glow", { opacity: 0.5, scale: 1.2, duration: 1.4 }, 3.6)
    .to(".reveal__boot", { scale: 1.04, duration: 2.0, ease: "none" }, 3.6)
    .to(".reveal__line--2", { opacity: 0, duration: 0.5 }, 5.0)
    .fromTo(".reveal__line--3", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 5.2)
    .to({}, { duration: 0.6 });

  ScrollTrigger.create({
    trigger: sec,
    start: "top top",
    end: () => "+=" + Math.round(innerHeight * (isMobile() ? 2.6 : 3.2)),
    pin: ".reveal__inner",
    scrub: 1,
    animation: tl,
    invalidateOnRefresh: true,
  });
}

export function initFinal() {
  gsap.from([".final__logo", ".final__title", ".final__text", ".final .btn", ".final__perks li"], {
    y: 36,
    opacity: 0,
    duration: 1.1,
    stagger: 0.09,
    ease: "power3.out",
    scrollTrigger: { trigger: ".final", start: "top 65%" },
  });
}

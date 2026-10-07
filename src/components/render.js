/* Renderiza no DOM as partes guiadas por dados (src/data/product.js) */
import { product, WHATSAPP_GROUP_URL } from "../data/product.js";

const $ = (s, r = document) => r.querySelector(s);
const pad = (n) => String(n).padStart(2, "0");

export function renderAll() {
  renderBoots();
  renderHudDots();
  renderTechs();
  renderSpecs();
  renderApps();
  renderReveal();
  bindCTAs();
  $(".js-final-text").textContent = product.cta.finalText;
}

function maskStyle(src) {
  return `-webkit-mask-image:url(${src});mask-image:url(${src});`;
}

/* abrindo o index.html direto (file://) o navegador bloqueia mask-image:
   nesse caso as camadas de luz recortada são omitidas */
export const IS_FILE = location.protocol === "file:";

function renderBoots() {
  const wrap = $(".js-boot-layers");
  wrap.innerHTML = product.colors
    .map(
      (c, i) => `
    <div class="boot" data-index="${i}">
      <img src="${c.image}" alt="ACERO VIPER ${c.name}" width="1800" height="1100" decoding="async" ${i === 0 ? 'fetchpriority="high"' : ""} draggable="false" />
      ${IS_FILE ? "" : `<span class="boot__shade" style="${maskStyle(c.image)}"></span>
      <span class="boot__light" style="${maskStyle(c.image)}"></span>
      <span class="boot__dim" style="${maskStyle(c.image)}"></span>`}
    </div>`
    )
    .join("") +
    product.transitions.map((t, i) => `<canvas class="boot-seq" data-seq="${i}" aria-hidden="true"></canvas>`).join("");
}

function renderHudDots() {
  $(".js-hud-dots").innerHTML = product.colors.map(() => `<li><i></i></li>`).join("");
}

function techMedia(t) {
  const m = t.media;
  if (m.type === "image") {
    return `<div class="tech__media tech__media--image ${m.contain ? "tech__media--contain" : ""}">
      <img src="${m.src}" alt="${m.caption}" loading="lazy" decoding="async" />
      <span class="brackets"><i></i><i></i><i></i><i></i></span>
      <span class="tech__caption mono">${m.caption}</span>
    </div>`;
  }
  if (m.type === "zones") {
    return `<ul class="tech__media tech__zones">${m.items
      .map((z, i) => `<li data-zone="${i}"><span>ZONA ${pad(i + 1)}</span><b>${z}</b></li>`)
      .join("")}</ul>`;
  }
  if (m.type === "impact") {
    return `<div class="tech__media impact" aria-hidden="true">
      <span class="impact__arrow"><i></i></span>
      <span class="impact__layer">PISADA <em>IMPACTO</em></span>
      <span class="impact__layer impact__layer--gel">PALMILHA GEL PU <em>ABSORÇÃO</em></span>
      <span class="impact__layer">SOLADO <em>TERRENO</em></span>
    </div>`;
  }
  return "";
}

function renderTechs() {
  const total = product.technologies.length;
  $(".js-techs").innerHTML = product.technologies
    .map(
      (t, i) => `
    <article class="tech" data-tech="${t.id}">
      <div class="tech__meta mono"><b>TEC ${pad(i + 1)}</b><span class="rule"></span><span>${pad(i + 1)} / ${pad(total)}</span></div>
      <span class="tech__title">${t.title} <span style="color:var(--tx-2)">— ${t.label}</span></span>
      <h2 class="tech__headline">${t.headline}</h2>
      <p class="tech__text">${t.description}</p>
      ${techMedia(t)}
    </article>`
    )
    .join("");
}

function renderSpecs() {
  const s = product.specs;
  const img = $(".js-spec-img");
  img.src = s.image;
  img.srcset = `${s.imageSmall} 960w, ${s.image} 1800w`;
  img.sizes = "(max-width: 767px) 92vw, 60vw";

  const W = 1000,
    H = 595;
  // posições dos rótulos (fora da bota), distribuídos por lado
  const labelY = { left: [0.1, 0.44, 0.9], right: [0.24, 0.58, 1.02] };
  const counters = { left: 0, right: 0 };
  const sorted = [...s.points].sort((a, b) => a.v - b.v);
  const lineData = new Map();
  sorted.forEach((p) => {
    const ly = labelY[p.side][counters[p.side]++] ?? p.v;
    lineData.set(p.id, ly);
  });

  const paths = [];
  const pins = [];
  s.points.forEach((p, i) => {
    const px = p.u * W,
      py = p.v * H;
    const ly = lineData.get(p.id) * H;
    const lx = p.side === "left" ? -0.06 * W : 1.06 * W;
    const ex = p.side === "left" ? Math.min(px - 40, 0.04 * W) : Math.max(px + 40, 0.96 * W);
    paths.push(`<path data-id="${p.id}" d="M${px.toFixed(1)} ${py.toFixed(1)} L${ex.toFixed(1)} ${ly.toFixed(1)} L${lx.toFixed(1)} ${ly.toFixed(1)}" />`);
    pins.push(`
      <button class="pin" type="button" data-id="${p.id}" style="left:${p.u * 100}%;top:${p.v * 100}%" aria-label="${p.name}"></button>
      <span class="pin__tag" data-id="${p.id}" style="left:${(lx / W) * 100}%;top:${(ly / H) * 100}%;transform:translate(${p.side === "left" ? "-100%" : "0"},-50%)">${p.name}</span>`);
  });
  $(".js-spec-lines").innerHTML = paths.join("");
  $(".js-spec-pins").innerHTML = pins.join("");
  $(".js-spec-table").innerHTML = s.points
    .map(
      (p, i) => `<div class="spec__row" data-id="${p.id}">
        <dt><span class="idx mono">${pad(i + 1)}</span><span class="name">${p.name}</span></dt>
        <dd>${p.text}</dd>
      </div>`
    )
    .join("");

  // interação: pin <-> linha da tabela
  const all = document.querySelectorAll(".spec [data-id]");
  const set = (id) => all.forEach((el) => el.classList.toggle("is-active", el.dataset.id === id));
  all.forEach((el) => {
    el.addEventListener("mouseenter", () => set(el.dataset.id));
    el.addEventListener("focus", () => set(el.dataset.id));
    el.addEventListener("click", () => set(el.dataset.id));
  });
  $(".spec__sheet").addEventListener("mouseleave", () => set(null));
}

function renderApps() {
  $(".js-apps").innerHTML = product.applications
    .map(
      (a, i) => `
    <figure class="app">
      <img class="app__img" src="${a.imageSmall}" srcset="${a.imageSmall} 640w, ${a.image} 1100w" sizes="(max-width: 767px) 100vw, 30vw" alt="ACERO VIPER em uso — ${a.name.toLowerCase()}" loading="lazy" decoding="async" />
      <span class="app__idx mono">${pad(i + 1)} / ${pad(product.applications.length)}</span>
      <figcaption class="app__name">${a.name}</figcaption>
      <span class="app__bar"><i></i></span>
    </figure>`
    )
    .join("");
}

function renderReveal() {
  const c = product.colors[1] || product.colors[0];
  document.querySelectorAll(".reveal__img").forEach((img) => {
    img.src = c.image;
  });
}

function bindCTAs() {
  const placeholder = !WHATSAPP_GROUP_URL || WHATSAPP_GROUP_URL.includes("COLE_O_LINK");
  document.querySelectorAll(".js-cta").forEach((a) => {
    a.href = placeholder ? "#grupo" : WHATSAPP_GROUP_URL;
    if (placeholder) a.removeAttribute("target");
    a.addEventListener("click", (e) => {
      a.classList.remove("is-clicked");
      void a.offsetWidth;
      a.classList.add("is-clicked");
      if (placeholder) {
        e.preventDefault();
        console.warn("[ACERO VIPER] Defina WHATSAPP_GROUP_URL em src/data/product.js");
        window.dispatchEvent(new CustomEvent("viper:goto", { detail: "#grupo" }));
      }
    });
  });
}

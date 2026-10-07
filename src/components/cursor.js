/* Cursor customizado (somente desktop com mouse) */
export function initCursor() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const el = document.querySelector(".cursor");
  const ring = el.querySelector(".cursor__ring");
  const dot = el.querySelector(".cursor__dot");
  document.body.classList.add("has-cursor");

  let mx = innerWidth / 2,
    my = innerHeight / 2,
    rx = mx,
    ry = my;
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    el.classList.remove("is-hidden");
  });
  document.addEventListener("mouseleave", () => el.classList.add("is-hidden"));

  const hoverSel = "a, button, .pin, .app, .spec__row";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverSel)) el.classList.add("is-hover");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverSel)) el.classList.remove("is-hover");
  });

  const tick = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };
  tick();
}

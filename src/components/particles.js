/* Partículas de poeira — discretas, só animam quando o palco está visível */
export function createParticles(canvas) {
  const ctx = canvas.getContext("2d");
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const COUNT = mobile ? 16 : 42;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let w = 0,
    h = 0,
    running = false,
    raf = 0,
    boost = 0;
  const parts = [];

  const resize = () => {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const spawn = (p = {}) => {
    p.x = Math.random() * w;
    p.y = Math.random() * h;
    p.r = Math.random() * 1.3 + 0.3;
    p.vx = (Math.random() - 0.5) * 0.12;
    p.vy = -(Math.random() * 0.18 + 0.04);
    p.a = Math.random() * 0.35 + 0.05;
    p.t = Math.random() * Math.PI * 2;
    return p;
  };

  resize();
  for (let i = 0; i < COUNT; i++) parts.push(spawn());
  window.addEventListener("resize", resize);

  const frame = () => {
    ctx.clearRect(0, 0, w, h);
    const k = 1 + boost * 3;
    for (const p of parts) {
      p.t += 0.01;
      p.x += (p.vx + Math.sin(p.t) * 0.05) * k;
      p.y += p.vy * k;
      if (p.y < -10 || p.x < -10 || p.x > w + 10) {
        spawn(p);
        p.y = h + 5;
      }
      ctx.globalAlpha = p.a * (0.7 + Math.sin(p.t * 2) * 0.3);
      ctx.fillStyle = "#e9e2d0";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    boost *= 0.94;
    raf = requestAnimationFrame(frame);
  };

  return {
    start() {
      if (running) return;
      running = true;
      frame();
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    kick(v) {
      boost = Math.min(1, boost + Math.abs(v));
    },
  };
}

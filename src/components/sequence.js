/* ==========================================================================
   SEQUÊNCIA DE QUADROS — troca de "escamas" entre as cores
   Vídeo gerado no Magnific, fatiado em quadros WebP com fundo transparente
   (24 fps, todos os quadros). O scroll escolhe o quadro e, entre dois quadros
   vizinhos, faz uma fusão proporcional — o movimento fica contínuo.
   ========================================================================== */

export function createSequence(canvas, { base, count, pad = 3, fallback = [] }) {
  const ctx = canvas.getContext("2d");
  const frames = new Array(count);
  let loaded = 0;
  let last = -1;
  let ready = false;
  let loading = null;

  const src = (i) => `${base}${String(i).padStart(pad, "0")}.webp`;
  const ok = (img) => img && img.complete && img.naturalWidth > 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const p = last;
    last = -1;
    if (p >= 0) draw(p);
  };

  // quadro carregado mais próximo de i (procurando para os dois lados)
  function nearest(i) {
    if (ok(frames[i])) return frames[i];
    for (let d = 1; d < count; d++) {
      if (ok(frames[i - d])) return frames[i - d];
      if (ok(frames[i + d])) return frames[i + d];
    }
    return null;
  }

  function draw(pos) {
    pos = Math.max(0, Math.min(count - 1, pos));
    if (Math.abs(pos - last) < 0.01) return;
    last = pos;
    const i0 = Math.floor(pos);
    const i1 = Math.min(count - 1, i0 + 1);
    const t = pos - i0;
    let a = nearest(i0);
    let b = ok(frames[i1]) ? frames[i1] : null;
    if (!a) a = pos < count / 2 ? fallback[0] : fallback[1];
    if (!ok(a)) return;
    const W = canvas.width,
      H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    ctx.drawImage(a, 0, 0, W, H);
    // fusão com o próximo quadro (suaviza o intervalo entre quadros)
    if (b && b !== a && t > 0.02) {
      ctx.globalAlpha = t;
      ctx.drawImage(b, 0, 0, W, H);
      ctx.globalAlpha = 1;
    }
  }

  /* carrega em ordem "espalhada" (0, fim, meio, quartos…) para ficar utilizável cedo */
  function load() {
    if (loading) return loading;
    const order = [];
    const seen = new Set();
    for (let step = 1 << Math.ceil(Math.log2(count)); step >= 1; step >>= 1) {
      for (let i = 0; i < count; i += step) if (!seen.has(i)) (seen.add(i), order.push(i));
    }
    if (!seen.has(count - 1)) order.splice(1, 0, count - 1);
    loading = new Promise((resolve) => {
      let next = 0;
      const PARALLEL = 6;
      const pump = () => {
        if (next >= order.length) return;
        const i = order[next++];
        const img = new Image();
        img.decoding = "async";
        img.onload = img.onerror = () => {
          loaded++;
          // decodifica antes de usar, evitando travadas no primeiro desenho
          (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(() => {
            if (loaded === count) {
              ready = true;
              resolve();
            }
            pump();
          });
        };
        img.src = src(i);
        frames[i] = img;
      };
      for (let k = 0; k < PARALLEL; k++) pump();
    });
    return loading;
  }

  window.addEventListener("resize", resize);
  resize();

  return {
    load,
    draw,
    resize,
    get ready() {
      return ready;
    },
    get progress() {
      return loaded / count;
    },
    count,
  };
}

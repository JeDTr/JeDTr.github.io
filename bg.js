// Nền "binary/code" vẽ bằng canvas: lưới ký tự 0/1 lẫn vài ký hiệu code,
// mờ ở trạng thái thường, sáng lên quanh con trỏ chuột (vết sáng mờ dần).
// Trên màn hình cảm ứng / khi chuột rời trang: một đốm sáng tự trôi chậm.
(function () {
  const canvas = document.getElementById("bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const CELL_W = 14, CELL_H = 20, RADIUS = 170;
  const GLYPHS = "{}[]()<>/=;:+*&|!?#$";
  const pick = () => (Math.random() < 0.88 ? (Math.random() < 0.5 ? "0" : "1") : GLYPHS[(Math.random() * GLYPHS.length) | 0]);

  let cols = 0, rows = 0, dpr = 1, chars = [], heat = [];
  let base = "#78716c", accent = "#c2410c", baseAlpha = 0.09;
  const mouse = { x: -9999, y: -9999, active: false, last: 0 };

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    base = cs.getPropertyValue("--muted").trim() || base;
    accent = cs.getPropertyValue("--accent").trim() || accent;
    baseAlpha = parseFloat(cs.getPropertyValue("--bg-code-alpha")) || 0.09;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = innerWidth, h = innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / CELL_W) + 1; rows = Math.ceil(h / CELL_H) + 1;
    chars = Array.from({ length: cols * rows }, pick);
    heat = new Float32Array(cols * rows);
    ctx.font = '500 13px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
  }

  function draw(t) {
    const w = innerWidth, h = innerHeight;
    ctx.clearRect(0, 0, w, h);

    // Đốm sáng tự trôi khi không có chuột (mobile, hoặc chuột đứng yên lâu)
    let fx = mouse.x, fy = mouse.y;
    if (!mouse.active || t - mouse.last > 4000) {
      fx = w * (0.5 + 0.38 * Math.sin(t / 5200));
      fy = h * (0.45 + 0.3 * Math.sin(t / 3700 + 1));
    }

    // Lật ngẫu nhiên vài ký tự cho có cảm giác "đang chạy"
    if (!reduceMotion) for (let k = 0; k < 6; k++) chars[(Math.random() * chars.length) | 0] = pick();

    const r2 = RADIUS * RADIUS;
    for (let j = 0; j < rows; j++) {
      const y = j * CELL_H + CELL_H / 2;
      for (let i = 0; i < cols; i++) {
        const idx = j * cols + i;
        const x = i * CELL_W + CELL_W / 2;
        const dx = x - fx, dy = y - fy, d2 = dx * dx + dy * dy;
        const near = d2 < r2 ? 1 - Math.sqrt(d2) / RADIUS : 0;
        // vết sáng: nóng lên nhanh, nguội từ từ
        heat[idx] = Math.max(near * near, heat[idx] * 0.94);
        const hv = heat[idx];
        if (hv > 0.02) {
          ctx.globalAlpha = Math.min(1, baseAlpha + hv * 0.6);
          ctx.fillStyle = accent;
          if (hv > 0.5 && Math.random() < 0.04) chars[idx] = pick();
        } else {
          ctx.globalAlpha = baseAlpha;
          ctx.fillStyle = base;
        }
        ctx.fillText(chars[idx], x, y);
      }
    }
    ctx.globalAlpha = 1;
  }

  let rafId = 0, lastFrame = 0;
  function loop(t) {
    rafId = requestAnimationFrame(loop);
    if (t - lastFrame < 33) return; // ~30fps là đủ, đỡ tốn pin
    lastFrame = t;
    draw(t);
  }

  addEventListener("pointermove", (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; mouse.last = performance.now();
    if (reduceMotion) draw(mouse.last);
  }, { passive: true });
  document.addEventListener("pointerleave", () => { mouse.active = false; });
  addEventListener("resize", () => { resize(); if (reduceMotion) draw(performance.now()); });
  document.addEventListener("visibilitychange", () => {
    if (reduceMotion) return;
    if (document.hidden) cancelAnimationFrame(rafId); else rafId = requestAnimationFrame(loop);
  });

  // Đổi theme (nút ◐ hoặc hệ điều hành) → đọc lại màu
  new MutationObserver(() => { readColors(); if (reduceMotion) draw(performance.now()); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", readColors);

  readColors();
  resize();
  if (reduceMotion) draw(0); else rafId = requestAnimationFrame(loop);
  // Font mono tải xong muộn → set lại font cho canvas
  document.fonts?.ready.then(() => { ctx.font = '500 13px "JetBrains Mono", ui-monospace, monospace'; });
})();

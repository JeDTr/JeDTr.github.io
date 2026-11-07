(function () {
  const projects = window.PROJECTS || [];
  const STATUS = {
    live: "Đang chạy",
    wip: "Đang làm",
    archived: "Lưu trữ",
  };

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const host = (url) => {
    try { const u = new URL(url); return (u.host + u.pathname).replace(/\/$/, ""); } catch { return url; }
  };

  function cover(p) {
    const c = p.cover || {};
    const from = c.from || "#334155", to = c.to || "#0f172a";
    // Ảnh chụp đặt trong khung "cửa sổ trình duyệt" nổi trên nền gradient
    if (c.image && c.frame) return `<div class="cover framed" style="--from:${esc(from)};--to:${esc(to)}">
      <div class="window"><div class="bar"><i></i><i></i><i></i><span>${esc(host(p.url || ""))}</span></div>
      <img src="${esc(c.image)}" alt="Ảnh chụp ${esc(p.name)}" loading="lazy" /></div>
    </div>`;
    if (c.image) return `<div class="cover photo"><img src="${esc(c.image)}" alt="Minh hoạ ${esc(p.name)}" loading="lazy" /></div>`;
    return `<div class="cover" style="--from:${esc(from)};--to:${esc(to)}" aria-hidden="true">
      <span class="glyph">${esc(c.glyph || p.name.charAt(0))}</span>
    </div>`;
  }

  function links(p) {
    const out = [];
    if (p.url) out.push(`<a class="btn primary" href="${esc(p.url)}" target="_blank" rel="noopener">Mở ${esc(host(p.url))} ↗</a>`);
    if (p.repo) out.push(`<a class="btn" href="${esc(p.repo)}" target="_blank" rel="noopener">Mã nguồn</a>`);
    return out.length ? `<div class="links">${out.join("")}</div>` : "";
  }

  function card(p, big) {
    const status = p.status && STATUS[p.status]
      ? `<span class="status s-${esc(p.status)}">${STATUS[p.status]}</span>` : "";
    const details = big && p.details?.length
      ? `<ul class="details">${p.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : "";
    const tags = p.tags?.length
      ? `<ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "";
    return `<article class="card${big ? " big" : ""}" data-status="${esc(p.status || "")}">
      ${cover(p)}
      <div class="body">
        <div class="meta">${status}${p.year ? `<span class="year">${esc(p.year)}</span>` : ""}</div>
        <h3>${esc(p.name)}</h3>
        <p class="tagline">${esc(p.tagline)}</p>
        ${details}
        ${tags}
        ${links(p)}
      </div>
    </article>`;
  }

  const featuredEl = document.getElementById("featured");
  const gridEl = document.getElementById("grid");
  const emptyEl = document.getElementById("empty");

  function render(filter) {
    const list = projects.filter((p) => filter === "all" || p.status === filter);
    featuredEl.innerHTML = list.filter((p) => p.featured).map((p) => card(p, true)).join("");
    gridEl.innerHTML = list.filter((p) => !p.featured).map((p) => card(p, false)).join("");
    emptyEl.hidden = list.length > 0;
  }

  document.querySelectorAll(".filters button").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".filters button").forEach((x) => x.classList.toggle("active", x === b));
      render(b.dataset.filter);
    });
  });

  document.querySelector(".theme-toggle").addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });

  // Vầng sáng theo con trỏ trên từng thẻ
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest?.(".card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
    const b = card.querySelector(".body").getBoundingClientRect();
    card.style.setProperty("--bx", e.clientX - b.left + "px");
    card.style.setProperty("--by", e.clientY - b.top + "px");
  }, { passive: true });

  // Hiệu ứng gõ chữ luân phiên ở dòng giới thiệu
  const typed = document.querySelector(".typed");
  if (typed && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let words = [];
    try { words = JSON.parse(typed.dataset.words); } catch (e) {}
    let w = 0, i = words[0]?.length || 0, deleting = true;
    const tick = () => {
      const word = words[w];
      i += deleting ? -1 : 1;
      typed.textContent = word.slice(0, i);
      let delay = deleting ? 35 : 70;
      if (!deleting && i === word.length) { deleting = true; delay = 2200; }
      else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
      setTimeout(tick, delay);
    };
    if (words.length > 1) setTimeout(tick, 2600);
  }

  document.getElementById("year").textContent = new Date().getFullYear();
  render("all");
})();

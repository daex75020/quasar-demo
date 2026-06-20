const http = require("http");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "content");
const ASSETS = path.join(__dirname, "assets");
const load = (site) =>
  JSON.parse(fs.readFileSync(path.join(DIR, site + ".json"), "utf8"));
const save = (site, data) =>
  fs.writeFileSync(
    path.join(DIR, site + ".json"),
    JSON.stringify(data, null, 2),
  );
const sites = () =>
  fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
const esc = (s) =>
  String(s == null ? "" : s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

// ---------- TEMPLATE AGENT IA (design VERROUILLÉ) ----------
function renderSite(site, d, lite) {
  const heroWords = String(d.heroTitle)
    .split(" ")
    .map((w) => `<span class="w"><span>${esc(w)}</span></span>`)
    .join(" ");

  const ic = {
    mail: '<path d="M3 6h18v12H3z"/><path d="m3 7 9 6 9-6"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/>',
    pen: '<path d="M12 19l7-7-4-4-7 7v4z"/><path d="M14 6l4 4"/>',
    plug: '<path d="M9 2v6M15 2v6M7 8h10v4a5 5 0 0 1-10 0z"/><path d="M12 17v5"/>',
  };
  const svg = (p) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const waLogo =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-label="WhatsApp"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>';
  const LOGOS = {
    WhatsApp: waLogo,
    Shopify: `<svg viewBox="0 0 256 292" xmlns="http://www.w3.org/2000/svg"><path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-1.703-1.703-5.029-1.185-6.32-.805-.19.056-3.388 1.043-8.678 2.68-5.18-14.906-14.322-28.604-30.405-28.604-.444 0-.901.018-1.358.044C129.31 3.407 123.644.779 118.75.779c-37.465 0-55.364 46.835-60.976 70.635-14.558 4.511-24.9 7.718-26.221 8.133-8.126 2.549-8.383 2.805-9.45 10.462C21.3 95.806.038 260.235.038 260.235l165.678 31.042 89.77-19.42S223.973 58.8 223.775 57.34zM156.49 40.848l-14.019 4.339c.005-.988.01-1.96.01-3.023 0-9.264-1.286-16.723-3.349-22.636 8.287 1.04 13.806 10.469 17.358 21.32zm-27.638-19.483c2.304 5.773 3.802 14.058 3.802 25.238 0 .572-.005 1.095-.01 1.624-9.117 2.824-19.024 5.89-28.953 8.966 5.575-21.516 16.025-31.908 25.161-35.828zm-11.131-10.537c1.617 0 3.246.549 4.805 1.622-12.007 5.65-24.877 19.88-30.312 48.297l-22.886 7.088C75.694 46.16 90.81 10.828 117.72 10.828z" fill="#95BF46"/><path d="M221.237 54.983c-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-.637-.634-1.496-.959-2.394-1.099l-12.527 256.233 89.762-19.418S223.972 58.8 223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357" fill="#5E8E3E"/><path d="M135.242 104.585l-11.069 32.926s-9.698-5.176-21.586-5.176c-17.428 0-18.305 10.937-18.305 13.693 0 15.038 39.2 20.8 39.2 56.024 0 27.713-17.577 45.558-41.277 45.558-28.44 0-42.984-17.7-42.984-17.7l7.615-25.16s14.95 12.835 27.565 12.835c8.243 0 11.596-6.49 11.596-11.232 0-19.616-32.16-20.491-32.16-52.724 0-27.129 19.472-53.382 58.778-53.382 15.145 0 22.627 4.338 22.627 4.338" fill="#FFF"/></svg>`,
    Stripe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="100 100 312 312"><path fill="#635bff" fill-rule="evenodd" d="m120 392 272-57.683V120l-272 58.357z" clip-rule="evenodd"/></svg>`,
    Messenger: `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="mg" cx="19.247%" cy="99.465%" r="108.96%"><stop offset="0%" stop-color="#09F"/><stop offset="60.975%" stop-color="#A033FF"/><stop offset="93.482%" stop-color="#FF5280"/><stop offset="100%" stop-color="#FF7061"/></radialGradient></defs><path fill="url(#mg)" d="M128 0C55.894 0 0 52.818 0 124.16c0 37.317 15.293 69.562 40.2 91.835 2.09 1.871 3.352 4.493 3.438 7.298l.697 22.77c.223 7.262 7.724 11.988 14.37 9.054L84.111 243.9a10.218 10.218 0 0 1 6.837-.501c11.675 3.21 24.1 4.92 37.052 4.92 72.106 0 128-52.818 128-124.16S200.106 0 128 0Z"/><path fill="#FFF" d="m51.137 160.47 37.6-59.653c5.98-9.49 18.788-11.853 27.762-5.123l29.905 22.43a7.68 7.68 0 0 0 9.252-.027l40.388-30.652c5.39-4.091 12.428 2.36 8.82 8.085l-37.6 59.654c-5.981 9.489-18.79 11.852-27.763 5.122l-29.906-22.43a7.68 7.68 0 0 0-9.25.027l-40.39 30.652c-5.39 4.09-12.427-2.36-8.818-8.085Z"/></svg>`,
    Notion: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 268"><path fill="#FFF" d="M16.092 11.538 164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188Z"/><path d="M69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095l-1.819.125Zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921ZM212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.044-4.68 1.55-11.439 8.826-11.965l38.426-2.585 52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404l35.84-2.087Z"/></svg>`,
    "Google Agenda": `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M390.736 121.264H121.264V390.736H390.736V121.264Z" fill="#fff"/><path d="M390.736 512 512 390.736l-60.632-10.344-60.632 10.344L379.67 446.196z" fill="#EA4335"/><path d="M0 390.736v80.842C0 493.912 18.088 512 40.42 512h80.844l12.45-60.632-12.45-60.632-66.066-10.344z" fill="#188038"/><path d="M512 121.264V40.42C512 18.088 493.912 0 471.58 0H390.736c-7.376 30.072-11.065 52.203-11.066 66.392 0 14.188 3.689 32.479 11.066 54.872 26.82 7.68 47.031 11.52 60.632 11.52s33.812-3.839 60.632-11.52z" fill="#1967D2"/><path d="M512 121.264H390.736V390.736H512z" fill="#FBBC04"/><path d="M390.736 390.736H121.264V512H390.736z" fill="#34A853"/><path d="M390.736 0H40.422C18.088 0 0 18.088 0 40.42V390.736H121.264V121.264H390.736z" fill="#4285F4"/></svg>`,
    Calendly: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="96" fill="#006BFF"/><path d="M138 117c-6 6-14 12-28 12h-8c-10 0-19-4-26-10-6-7-10-15-10-25v-11c0-9 4-18 10-25 7-6 16-10 26-10h8c14 0 22 7 28 12 6 6 12 10 27 10 2 0 5 0 7-1-1-2-2-4-3-6l-10-17c-9-15-26-25-44-25h-20c-18 0-35 9-44 25l-10 17c-9 15-9 34 0 49l10 17c9 15 26 25 44 25h20c18 0 35-9 44-25l10-17c1-2 2-4 3-6-2-1-5-1-7-1-15 0-21 5-27 11z" fill="#fff"/></svg>`,
    Slack: `<svg viewBox="0 0 2447.6 2452.5" xmlns="http://www.w3.org/2000/svg"><g clip-rule="evenodd" fill-rule="evenodd"><path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3zm0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" fill="#36c5f0"/><path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" fill="#2eb67d"/><path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" fill="#ecb22e"/><path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1z" fill="#e01e5a"/></g></svg>`,
  };

  const icons = ["mail", "target", "chart", "search", "plug", "pen"];
  const CAPS = [1, 2, 3, 4, 5, 6].map((n, i) => ({
    i: icons[i],
    t: d["capT" + n],
    b: d["capB" + n],
    q: d["capQ" + n],
    a: d["capA" + n],
  }));
  const services =
    d.showServices !== false
      ? `
  <section class="services wrap reveal" id="services">
    <div class="sec-head"><span class="kicker">Capacités</span><h2>${esc(d.servicesTitle)}</h2><p class="sec-sub">${esc(d.servicesSub)}</p></div>
    <div class="cap-grid">
      ${CAPS.map((c, n) => `<article class="gcard cap"><span class="beam"></span><div class="cap-chat">${c.q ? `<span class="cm them">${esc(c.q)}</span>` : ""}${c.a ? `<span class="cm me">${esc(c.a)}<i class="ck">✓✓</i></span>` : ""}</div><div class="gcard-in"><div class="cap-ic">${svg(ic[c.i])}</div><span class="cap-n">0${n + 1}</span><h3>${esc(c.t)}</h3><p>${esc(c.b)}</p></div></article>`).join("")}
    </div>
  </section>`
      : "";

  const STEPS = [1, 2, 3].map((n) => ({
    t: d["stepT" + n],
    b: d["stepB" + n],
  }));
  const steps = `
  <section class="steps wrap reveal" id="how">
    <div class="sec-head"><span class="kicker">Comment ça marche</span><h2>${esc(d.stepsTitle)}</h2><p class="sec-sub">${esc(d.stepsSub)}</p></div>
    <div class="steps-grid">
      ${STEPS.map((s, n) => `<article class="gcard step"><span class="beam"></span><div class="gcard-in"><span class="step-n">0${n + 1}</span><h3>${esc(s.t)}</h3><p>${esc(s.b)}</p></div></article>`).join("")}
    </div>
  </section>`;

  const check =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  const splitList = (s) =>
    String(s || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  const PLANS = [1, 2, 3].map((n) => ({
    nm: d["planN" + n],
    p: d["planP" + n],
    per: d["planPer" + n],
    dd: d["planD" + n],
    f: splitList(d["planF" + n]),
    cta: d["planCta" + n],
    pop: n === 2,
  }));
  const pricing = `
  <section class="pricing wrap reveal" id="prix">
    <div class="sec-head"><span class="kicker">Tarifs</span><h2>${esc(d.pricingTitle)}</h2><p class="sec-sub">${esc(d.pricingSub)}</p></div>
    <div class="price-grid">
      ${PLANS.map((pl) => `<article class="gcard tier${pl.pop ? " pop" : ""}"><span class="beam"></span><div class="gcard-in">${pl.pop ? '<span class="badge">Le plus choisi</span>' : ""}<div class="tier-n">${esc(pl.nm)}</div><div class="tier-p">${esc(pl.p)}${pl.per ? `<span>${esc(pl.per)}</span>` : ""}</div><p class="tier-d">${esc(pl.dd)}</p><ul class="feat">${pl.f.map((x) => `<li>${check}<span>${esc(x)}</span></li>`).join("")}</ul><a class="cta tier-cta" href="#contact">${esc(pl.cta)}</a></div></article>`).join("")}
    </div>
  </section>`;

  const av = (id) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=200`;
  const star =
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01z"/></svg>';
  const TESTI = [1, 2, 3, 4, 5, 6].map((n) => ({
    av: d["tAv" + n],
    nm: d["tName" + n],
    r: d["tRole" + n],
    q: d["tQuote" + n],
  }));
  const testimonials = `
  <section class="testi wrap reveal" id="avis">
    <div class="sec-head"><span class="kicker">Témoignages</span><h2>${esc(d.testiTitle)}</h2><p class="sec-sub">${esc(d.testiSub)}</p></div>
    <div class="testi-grid">
      ${TESTI.map((t) => `<article class="tcard"><div class="stars">${star.repeat(5)}</div><p class="tq">${esc(t.q)}</p><div class="tperson"><img src="${esc(t.av)}" alt="${esc(t.nm)}" loading="lazy"><div><b>${esc(t.nm)}</b><span>${esc(t.r)}</span></div></div></article>`).join("")}
    </div>
  </section>`;

  const caseIcons = ["mail", "chart", "target", "search"];
  const CASES = [1, 2, 3, 4].map((n, i) => ({
    i: caseIcons[i],
    t: d["caseT" + n],
    b: d["caseB" + n],
  }));
  const cases = `
  <section class="cases wrap reveal" id="cas">
    <div class="sec-head"><span class="kicker">Cas d'usage</span><h2>${esc(d.casesTitle)}</h2><p class="sec-sub">${esc(d.casesSub)}</p></div>
    <div class="cap-grid">
      ${CASES.map((c) => `<article class="gcard cap"><span class="beam"></span><div class="gcard-in"><div class="cap-ic">${svg(ic[c.i])}</div><h3>${esc(c.t)}</h3><p>${esc(c.b)}</p></div></article>`).join("")}
    </div>
  </section>`;

  const FAQ = [1, 2, 3, 4, 5, 6].map((n) => ({
    q: d["faqQ" + n],
    a: d["faqA" + n],
  }));
  const faq = `
  <section class="faq wrap reveal" id="faq">
    <div class="sec-head"><span class="kicker">Questions fréquentes</span><h2>${esc(d.faqTitle)}</h2></div>
    <div class="faq-list">
      ${FAQ.map((f) => `<details class="faq-item"><summary><span>${esc(f.q)}</span><i class="faq-x"></i></summary><div class="faq-a">${esc(f.a)}</div></details>`).join("")}
    </div>
  </section>`;

  const marquee = [...splitList(d.marquee), ...splitList(d.marquee)]
    .map(
      (t) =>
        `<span class="mq-item"><span class="mq-logo">${LOGOS[t] || ""}</span>${esc(t)}</span>`,
    )
    .join("");

  const chatBox = `<div class="wa">
        <div class="wa-top"><span class="wa-ava">${esc(String(d.brand).charAt(0))}</span><div class="wa-id"><b>${esc(d.brand)}</b><i>en ligne</i></div><span class="wa-logo">${waLogo}</span></div>
        <div class="wa-body" id="waBody"></div>
        <div class="wa-bar"><span class="wa-field">Écrivez un message</span><span class="wa-send"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 20l18-8L3 4v6l12 2-12 2z"/></svg></span></div>
      </div>`;
  const heroVisual = lite
    ? `<img src="/assets/robot.png" alt="" loading="lazy">`
    : d.heroChat
      ? chatBox
      : d.heroSpline
        ? `<spline-viewer url="${esc(d.heroSpline)}" events-target="global" loading-anim-type="none"></spline-viewer>`
        : d.heroVideo
          ? `<video autoplay muted loop playsinline preload="auto" poster="${esc(d.heroImage)}"><source src="${esc(d.heroVideo)}" type="video/mp4"></video>`
          : `<img src="${esc(d.heroImage)}" alt="">`;

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(d.brand)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
${d.heroSpline && !lite ? `<script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.59/build/spline-viewer.js"></script>` : ""}
<style>
  :root{ --accent:${esc(d.accent)}; --bg:${esc(d.colBg || "#ffffff")}; --panel:#f4f6f4; --text:${esc(d.colText || "#0b0b0c")}; --muted:#5c5c64; --line:rgba(0,0,0,.11); --dark:${esc(d.colDark || "#0b0b0c")} }
  @property --ba{syntax:'<angle>';inherits:false;initial-value:0deg}
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{font-family:'Inter',sans-serif;color:var(--text);background:var(--bg);-webkit-font-smoothing:antialiased;line-height:1.6}
  .wrap{max-width:1280px;margin:0 auto;padding:0 40px}
  h1,h2,h3,.disp{font-family:'Inter',sans-serif;font-weight:800;letter-spacing:-.025em;text-transform:none}

  /* NAV */
  .nav{position:absolute;top:0;left:0;right:0;z-index:20}
  .nav .row{display:flex;justify-content:space-between;align-items:center;padding:28px 0}
  .logo{font-family:'Inter',sans-serif;font-weight:800;font-size:30px;letter-spacing:.06em;color:var(--text);text-transform:uppercase}
  .logo b{color:var(--accent);font-weight:400}
  .nav .links{display:flex;gap:36px;align-items:center;font-size:14px;color:var(--text);font-weight:500}
  .nav .links a{color:inherit;text-decoration:none;opacity:.8;transition:.2s}
  .nav .links a:hover{opacity:1}
  .nav .links a.pill{padding:11px 22px;border-radius:2px;background:var(--accent);color:#fff;opacity:1;font-weight:700;letter-spacing:.01em}
  .burger{display:none;flex-direction:column;justify-content:center;gap:5px;width:42px;height:42px;background:none;border:none;cursor:pointer;padding:0;z-index:21}
  .burger span{display:block;width:22px;height:2px;background:var(--text);border-radius:2px;transition:.25s;margin:0 auto}
  .burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
  .burger.open span:nth-child(2){opacity:0}
  .burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}

  /* HERO split + spline */
  .hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;padding:120px 0 60px}
  .hero-glow{position:absolute;inset:0;z-index:0;background:
     radial-gradient(80% 70% at 92% 45%, color-mix(in srgb,var(--accent) 13%, transparent),transparent 55%),
     radial-gradient(60% 55% at 2% 2%, color-mix(in srgb,var(--accent) 6%, transparent),transparent 50%)}
  .hero-grid-lines{position:absolute;inset:0;z-index:0;opacity:.5;
     background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);
     background-size:64px 64px;mask-image:radial-gradient(circle at 50% 40%,#000,transparent 80%)}
  .hero-inner{position:relative;z-index:5;width:100%;display:grid;grid-template-columns:1.02fr .98fr;gap:40px;align-items:center}
  .hero .eyebrow{font-size:12.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);font-weight:600;opacity:0;animation:fadeUp .9s .15s forwards;display:inline-block}
  .hero h1{color:var(--text);font-size:clamp(46px,6.2vw,92px);line-height:1.02;letter-spacing:-.035em;margin:22px 0 0;max-width:16ch}
  .hero h1 .w{display:inline-block;overflow:hidden;vertical-align:top}
  .hero h1 .w>span{display:inline-block;transform:translateY(110%)}
  .hero .trust{display:flex;gap:18px;align-items:center;margin-top:22px;color:var(--muted);font-size:13px;opacity:0;animation:fadeUp 1s .8s forwards}
  .hero .trust b{color:var(--text);font-weight:600}
  .hero .lede{color:var(--muted);font-size:clamp(16px,1.3vw,19px);max-width:46ch;margin:26px 0 36px;opacity:0;animation:fadeUp 1s .5s forwards}
  .hero .actions{display:flex;gap:16px;align-items:center;opacity:0;animation:fadeUp 1s .65s forwards}
  @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}

  .cta{display:inline-block;padding:16px 34px;border-radius:2px;background:var(--accent);color:#fff;font-size:15px;font-weight:700;text-decoration:none;transition:transform .25s, box-shadow .25s;box-shadow:0 14px 40px -16px color-mix(in srgb,var(--accent) 60%, transparent)}
  .cta:hover{transform:translateY(-2px)}
  .ghost{font-size:15px;font-weight:600;color:var(--text);text-decoration:none;display:inline-flex;align-items:center;gap:9px;opacity:.85}
  .ghost::after{content:'→';transition:transform .25s}
  .ghost:hover::after{transform:translateX(5px)}

  .hero-visual{position:relative;height:90vh;min-height:640px;animation:floaty 5s ease-in-out infinite;z-index:10;overflow:visible}
  @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
  .hero-visual spline-viewer{position:absolute;top:0;bottom:0;left:50%;width:175%;transform:translateX(-50%);z-index:2;height:100%;display:block;background:transparent;pointer-events:none}
  .hero-visual video{position:relative;z-index:2;width:100%;height:100%;display:block;object-fit:cover;border-radius:18px}
  .hero-visual img{position:relative;z-index:2;width:100%;height:100%;display:block;object-fit:contain;object-position:center bottom}
  .hero-visual .robot-mob{display:none}
  .hero-poster{position:relative;z-index:2;width:100%;height:100%;border-radius:18px;border:1.5px dashed color-mix(in srgb,var(--accent) 40%,var(--line));background:color-mix(in srgb,var(--accent) 4%,transparent);display:flex;align-items:center;justify-content:center}
  .hero-poster span{font-size:13px;font-weight:500;color:var(--muted);padding:0 30px;text-align:center;max-width:75%;line-height:1.55}

  /* DEMO CHAT WHATSAPP */
  .wa{position:relative;z-index:2;width:100%;max-width:380px;height:74vh;max-height:600px;display:flex;flex-direction:column;background:#0b141a;border-radius:26px;overflow:hidden;box-shadow:0 44px 90px -42px rgba(0,0,0,.55);border:1px solid rgba(0,0,0,.1)}
  .wa-top{display:flex;align-items:center;gap:12px;padding:13px 16px;background:#1f2c33;color:#fff}
  .wa-ava{width:40px;height:40px;border-radius:12px;background:#25d366;color:#08120c;display:grid;place-items:center;font-family:'Inter',sans-serif;font-weight:800;font-size:22px}
  .wa-id b{font-weight:600;font-size:15px;display:block;line-height:1.15}
  .wa-id i{font-style:normal;font-size:12px;color:#8fd0a8}
  .wa-body{flex:1;overflow:hidden;padding:18px 14px;display:flex;flex-direction:column;gap:7px;justify-content:flex-end;background:#0b141a}
  .wa-msg{max-width:80%;padding:8px 11px 9px;border-radius:10px;font-size:13.5px;line-height:1.42;color:#e9edef;opacity:0;transform:translateY(12px) scale(.96);transition:opacity .3s, transform .3s;word-wrap:break-word}
  .wa-msg.in{opacity:1;transform:none}
  .wa-msg.them{align-self:flex-start;background:#202c33;border-top-left-radius:3px}
  .wa-msg.me{align-self:flex-end;background:#005c4b;border-top-right-radius:3px}
  .wa-typing{align-self:flex-start;background:#202c33;border-radius:10px;border-top-left-radius:3px;padding:0 14px;height:34px;display:flex;gap:4px;align-items:center;opacity:0;transform:translateY(12px);transition:.3s}
  .wa-typing.in{opacity:1;transform:none}
  .wa-typing i{width:3px;height:8px;background:#8696a0;border-radius:2px;animation:wt 1s ease-in-out infinite}
  .wa-typing i:nth-child(2){animation-delay:.16s}
  .wa-typing i:nth-child(3){animation-delay:.32s}
  @keyframes wt{0%,100%{height:6px;opacity:.6}50%{height:15px;opacity:1}}
  .wa-bar{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#1f2c33}
  .wa-field{flex:1;background:#2a3942;color:#8696a0;border-radius:20px;padding:9px 15px;font-size:13px}
  .wa-send{width:38px;height:38px;border-radius:8px;background:#25d366;color:#08120c;display:grid;place-items:center;flex-shrink:0}
  .wa-send svg{width:18px;height:18px}
  .wa-logo{margin-left:auto;color:#25d366;display:flex}
  .wa-logo svg{width:24px;height:24px}
  .wa-msg{position:relative;padding-bottom:17px;min-width:96px}
  .wmeta{position:absolute;right:9px;bottom:4px;font-size:10px;color:rgba(233,237,239,.5);display:flex;align-items:center;gap:3px}
  .wa-msg.me .wmeta{color:rgba(220,248,210,.55)}
  .wa-msg.me .wmeta i{color:#53bdeb;font-style:normal;letter-spacing:-1px}
  .eb-wa{display:inline-flex;color:var(--accent);vertical-align:-3px;margin-right:9px}
  .eb-wa svg{width:17px;height:17px}
  .mq-logo{display:inline-flex;align-items:center;color:#25d366;margin-right:12px}
  .mq-logo svg{width:30px;height:30px;display:block}

  /* MINI-CHAT WHATSAPP DANS LES CARTES */
  .cap-chat{position:relative;z-index:2;margin:0;padding:20px 16px;display:flex;flex-direction:column;gap:7px;min-height:128px;justify-content:center;border-radius:18px 18px 0 0;background:#e5ddd5;background-image:radial-gradient(rgba(0,0,0,.03) 1px,transparent 1px);background-size:14px 14px}
  .cm{position:relative;max-width:86%;padding:7px 10px 8px;border-radius:9px;font-size:12.5px;line-height:1.34;color:#111b21;box-shadow:0 1px 1px rgba(0,0,0,.1)}
  .cm.them{align-self:flex-start;background:#fff;border-top-left-radius:2px}
  .cm.me{align-self:flex-end;background:#d9fdd3;border-top-right-radius:2px;padding-right:30px}
  .cm .ck{position:absolute;right:9px;bottom:5px;font-style:normal;font-size:10px;color:#34b7f1;letter-spacing:-1px}
  .cap .gcard-in{padding-top:24px}

  /* MARQUEE LOGOS */
  .marquee{background:#fff;color:#0b0b0c;overflow:hidden;white-space:nowrap;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
  .mq-track{display:inline-flex;align-items:center;padding:22px 0;animation:scrollx 26s linear infinite}
  .mq-item{font-family:'Inter',sans-serif;font-weight:800;text-transform:uppercase;font-size:24px;letter-spacing:.03em;display:inline-flex;align-items:center;padding:0 34px;color:#1a1a1a}
  @keyframes scrollx{to{transform:translateX(-50%)}}

  /* STATS */
  .stats{border-bottom:1px solid var(--line)}
  .stats .row{display:grid;grid-template-columns:repeat(3,1fr)}
  .stat{padding:56px 0;text-align:center;border-right:1px solid var(--line)}
  .stat:last-child{border-right:none}
  .stat .v{font-family:'Inter',sans-serif;font-weight:800;font-size:64px;letter-spacing:.01em;color:var(--text);line-height:1}
  .stat .l{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-top:8px}

  /* EXPERIENCE split */
  .exp{padding:120px 0}
  .exp .grid{display:grid;grid-template-columns:${d.expImage || d.expChat ? "1fr 1fr" : "1fr"};gap:70px;align-items:center}
  .exp-chat{display:flex;justify-content:center}
  .exp-chat .wa{height:560px;max-height:560px;max-width:360px}
  .exp-img{border-radius:16px;overflow:hidden;aspect-ratio:4/5;border:1px solid var(--line)}
  .exp-img img{width:100%;height:100%;object-fit:cover}
  .kicker{font-size:12.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;color:var(--accent)}
  .exp h2{font-size:clamp(40px,4.6vw,68px);letter-spacing:.01em;line-height:.95;margin:16px 0 22px;color:var(--text);max-width:16ch}
  .exp p{color:var(--muted);font-size:17px;max-width:48ch}

  /* SECTION HEADERS */
  .sec-head{max-width:720px;margin-bottom:56px}
  .sec-head h2{font-size:clamp(42px,5vw,76px);letter-spacing:.01em;margin-top:14px;line-height:.92;color:var(--text)}
  .sec-sub{color:var(--muted);font-size:17px;margin-top:18px;max-width:60ch}

  /* GRADIENT CARDS (cadres colorés) */
  .gcard{position:relative;border-radius:18px;background:#ffffff;overflow:hidden;transition:transform .3s, box-shadow .3s;box-shadow:0 18px 44px -30px rgba(0,0,0,.28)}
  .gcard:hover{box-shadow:0 26px 56px -28px color-mix(in srgb,var(--accent) 40%, rgba(0,0,0,.3))}
  .gcard::before{content:'';position:absolute;inset:0;padding:1px;border-radius:18px;background:linear-gradient(145deg, color-mix(in srgb,var(--accent) 75%,transparent), transparent 38%, transparent 64%, color-mix(in srgb,var(--accent) 28%,transparent));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:.5;transition:opacity .3s;pointer-events:none}
  .gcard:hover::before{opacity:1}
  .gcard::after{content:'';position:absolute;inset:0;background:radial-gradient(240px circle at var(--mx,50%) var(--my,-20%), color-mix(in srgb,var(--accent) 16%,transparent), transparent 65%);opacity:0;transition:opacity .35s;pointer-events:none}
  .gcard:hover{transform:translateY(-5px)}
  .gcard:hover::after{opacity:1}
  .gcard-in{position:relative;z-index:2;padding:32px 30px 36px}
  .gcard .beam{position:absolute;inset:0;border-radius:18px;padding:1.5px;z-index:1;pointer-events:none;opacity:0;transition:opacity .35s;background:conic-gradient(from var(--ba), transparent 0deg 300deg, var(--accent) 342deg, transparent 360deg);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
  .gcard:hover .beam{opacity:1;animation:beam 3s linear infinite}
  .tier.pop .beam{opacity:1}
  @keyframes beam{to{--ba:360deg}}
  .cap .cap-ic{transition:transform .35s cubic-bezier(.2,.7,.2,1), background .3s}
  .cap:hover .cap-ic{transform:translateY(-4px) rotate(-7deg);background:color-mix(in srgb,var(--accent) 26%,transparent)}

  /* STEPS */
  .steps{padding:120px 0 40px}
  .steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
  .step .step-n{font-family:'Inter',sans-serif;font-weight:800;font-size:46px;color:var(--accent);line-height:1;letter-spacing:.02em}
  .step h3{font-size:30px;margin:8px 0 12px;letter-spacing:.01em;color:var(--text);line-height:1}
  .step p{color:var(--muted);font-size:15.5px}

  /* CAPABILITIES */
  .services{padding:100px 0 120px}
  .cap-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
  .cap .cap-ic{width:46px;height:46px;border-radius:4px;display:grid;place-items:center;background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--accent);margin-bottom:20px}
  .cap .cap-ic svg{width:23px;height:23px}
  .cap .cap-n{font-family:'Inter',sans-serif;font-weight:800;font-size:15px;color:var(--muted);letter-spacing:.1em}
  .cap h3{font-size:27px;margin:6px 0 12px;letter-spacing:.01em;color:var(--text);line-height:1.02}
  .cap p{color:var(--muted);font-size:15px;line-height:1.62}

  /* PRICING */
  .pricing{padding:120px 0}
  .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;align-items:stretch}
  .tier .gcard-in{display:flex;flex-direction:column;height:100%;padding:36px 32px 38px}
  .tier.pop{transform:translateY(-10px)}
  .tier.pop::before{opacity:1}
  .badge{align-self:flex-start;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:#fff;background:var(--accent);padding:5px 12px;border-radius:0;margin-bottom:18px}
  .tier-n{font-family:'Inter',sans-serif;font-weight:800;font-size:27px;letter-spacing:.04em;color:var(--text)}
  .tier-p{font-family:'Inter',sans-serif;font-weight:800;font-size:58px;color:var(--text);line-height:1;margin:8px 0 4px;display:flex;align-items:baseline;gap:10px}
  .tier-p span{font-family:'Inter',sans-serif;font-size:14px;font-weight:500;color:var(--muted);letter-spacing:0}
  .tier-d{color:var(--muted);font-size:15px;margin-bottom:22px}
  .feat{list-style:none;display:flex;flex-direction:column;gap:13px;margin-bottom:28px;flex:1}
  .feat li{display:flex;align-items:center;gap:11px;color:var(--text);font-size:14.5px}
  .feat li svg{width:18px;height:18px;color:var(--accent);flex-shrink:0}
  .tier-cta{text-align:center;width:100%;background:transparent;color:var(--text);border:1px solid rgba(0,0,0,.18);box-shadow:none}
  .tier.pop .tier-cta{background:var(--accent);color:#fff;border-color:var(--accent)}

  /* QUOTE band */
  .quote{position:relative;overflow:hidden;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
  .quote img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.32}
  .quote .ov{position:absolute;inset:0;background:radial-gradient(120% 100% at 0% 0%, color-mix(in srgb,var(--accent) 20%,transparent), transparent 50%),linear-gradient(90deg,#07070a,rgba(7,7,10,.4))}
  .quote .inner{position:relative;z-index:2;padding:120px 0;max-width:900px}
  .quote blockquote{font-family:'Inter',sans-serif;color:#fff;font-size:clamp(24px,3vw,40px);line-height:1.25;font-weight:600;letter-spacing:-.01em}
  .quote .who{color:var(--muted);margin-top:26px;font-size:15px;letter-spacing:.04em}

  /* CTA */
  .band{position:relative;background:var(--accent);color:#fff;overflow:hidden}
  .band .row{padding:100px 0;display:flex;justify-content:space-between;align-items:center;gap:40px;flex-wrap:wrap;position:relative;z-index:2}
  .band h2{font-size:clamp(44px,5vw,82px);max-width:16ch;letter-spacing:.01em;line-height:.9}
  .band .cta{background:#0a0a0c;color:#fff;box-shadow:none}
  /* EXP value */
  .exp-feat{list-style:none;display:flex;flex-direction:column;gap:11px;margin:24px 0 28px}
  .exp-feat li{display:flex;align-items:center;gap:11px;color:var(--text);font-size:15px}
  .exp-feat li svg{width:18px;height:18px;color:var(--accent);flex-shrink:0}
  .exp-metrics{display:flex;gap:36px;flex-wrap:wrap}
  .exp-metrics b{font-family:'Inter',sans-serif;font-weight:800;font-size:40px;color:var(--accent);line-height:1;display:block}
  .exp-metrics span{font-size:13px;color:var(--muted)}

  /* FOOTER */
  .footer{background:var(--dark);color:#fff;padding:74px 0 30px}
  .foot-top{display:grid;grid-template-columns:1.3fr 2fr;gap:60px;padding-bottom:46px;border-bottom:1px solid rgba(255,255,255,.1)}
  .foot-logo{font-family:'Inter',sans-serif;font-weight:800;font-size:30px;letter-spacing:.05em;display:flex;align-items:center}
  .foot-logo .eb-wa{color:#25d366;margin-right:10px}
  .foot-logo .eb-wa svg{width:24px;height:24px}
  .foot-brand p{color:#9a9aa6;font-size:15px;max-width:38ch;margin:16px 0 24px;line-height:1.6}
  .foot-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
  .foot-col h4{font-family:'Inter',sans-serif;font-weight:800;font-size:18px;letter-spacing:.05em;color:#fff;margin-bottom:14px}
  .foot-col a{display:block;color:#9a9aa6;text-decoration:none;font-size:14.5px;padding:6px 0;transition:color .2s}
  .foot-col a:hover{color:#25d366}
  .foot-bottom{display:flex;justify-content:space-between;padding-top:24px;font-size:13px;color:#7a7a82;flex-wrap:wrap;gap:10px}

  /* CAS D'USAGE */
  .cases{padding:110px 0 40px}

  /* TEMOIGNAGES */
  .testi{padding:110px 0}
  .sec-sub b{color:var(--text)}
  .sec-sub svg{width:16px;height:16px;vertical-align:-3px;margin:0 1px}
  .testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
  .tcard{background:#fff;border:1px solid var(--line);border-radius:4px;padding:28px 26px 24px;box-shadow:0 14px 34px -28px rgba(0,0,0,.3);display:flex;flex-direction:column;transition:transform .3s, box-shadow .3s}
  .tcard:hover{transform:translateY(-4px);box-shadow:0 22px 44px -28px color-mix(in srgb,var(--accent) 40%,rgba(0,0,0,.3))}
  .stars{display:flex;gap:3px;color:var(--accent);margin-bottom:16px}
  .stars svg{width:17px;height:17px}
  .tq{color:#2a2a2e;font-size:15.5px;line-height:1.6;flex:1;margin-bottom:22px}
  .tperson{display:flex;align-items:center;gap:13px}
  .tperson img{width:46px;height:46px;border-radius:8px;object-fit:cover;flex-shrink:0}
  .tperson b{display:block;font-size:15px;color:var(--text);line-height:1.2}
  .tperson span{font-size:13px;color:var(--muted)}

  /* PREUVE SOCIALE HERO */
  .social-proof{display:flex;align-items:center;gap:16px;margin-top:26px;opacity:0;animation:fadeUp 1s .9s forwards}
  .av-stack{display:flex}
  .av-stack img{width:38px;height:38px;border-radius:8px;object-fit:cover;border:2px solid var(--bg);margin-left:-10px}
  .av-stack img:first-child{margin-left:0}
  .sp-stars{display:flex;gap:2px;color:var(--accent);margin-bottom:3px}
  .sp-stars svg{width:14px;height:14px}
  .sp-text span{font-size:13.5px;color:var(--muted)}
  .sp-text b{color:var(--text)}
  @media(max-width:920px){.testi-grid{grid-template-columns:1fr}}

  /* FAQ */
  .faq{padding:110px 0}
  .faq-list{max-width:860px;border-top:1px solid var(--line)}
  .faq-item{border-bottom:1px solid var(--line)}
  .faq-item summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:24px;padding:24px 0;font-size:19px;font-weight:600;color:var(--text)}
  .faq-item summary::-webkit-details-marker{display:none}
  .faq-x{position:relative;width:16px;height:16px;flex-shrink:0}
  .faq-x::before,.faq-x::after{content:'';position:absolute;background:var(--accent);transition:transform .3s}
  .faq-x::before{left:0;top:7px;width:16px;height:2px}
  .faq-x::after{top:0;left:7px;width:2px;height:16px}
  .faq-item[open] .faq-x::after{transform:scaleY(0)}
  .faq-a{color:var(--muted);font-size:16px;line-height:1.62;max-width:68ch;padding:2px 0 26px}

  /* CTA FINAL */
  .cta-final{padding:96px 0;text-align:center;max-width:740px;margin:0 auto}
  .cta-final h2{font-size:clamp(40px,5vw,72px);letter-spacing:.01em;line-height:.94;color:#fff;max-width:none;margin:0 auto}
  .cta-final p{color:rgba(255,255,255,.88);font-size:18px;margin:20px 0 32px}
  .cta-final .cta{background:#0a0a0c;color:#fff;box-shadow:none}
  .cta-points{display:flex;gap:26px;justify-content:center;flex-wrap:wrap;margin-top:28px;color:rgba(255,255,255,.92);font-size:14px;font-weight:500}
  .cta-points span{display:inline-flex;align-items:center;gap:7px}
  .cta-points span svg{width:16px;height:16px;color:#fff}
  @media(max-width:760px){.foot-top{grid-template-columns:1fr;gap:36px}.foot-cols{grid-template-columns:1fr 1fr}}

  .reveal{opacity:0;transform:translateY(34px);transition:opacity 1s cubic-bezier(.2,.7,.2,1),transform 1s cubic-bezier(.2,.7,.2,1)}
  .reveal.in{opacity:1;transform:none}


  @media(max-width:920px){
    .nav .row{padding:18px 0}
    .burger{display:flex}
    .nav .links{position:absolute;top:calc(100% - 4px);left:22px;right:22px;flex-direction:column;align-items:stretch;gap:0;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:8px;box-shadow:0 34px 70px -34px rgba(0,0,0,.34);display:none}
    .nav .links.open{display:flex}
    .nav .links a{padding:14px 14px;opacity:1;border-radius:8px;font-size:15px}
    .nav .links a:not(.pill):hover{background:var(--panel)}
    .nav .links a.pill{margin-top:6px;text-align:center;border-radius:8px;padding:14px}
    .hero{min-height:auto;padding:100px 0 56px}
    .hero-inner{grid-template-columns:1fr;gap:20px}
    .hero-visual{height:auto;min-height:0;order:2;animation:none;overflow:hidden}
    .hero-visual spline-viewer{display:none}
    .hero-visual .robot-mob{display:block;position:relative;width:100%;height:360px;object-fit:contain;object-position:center}
    .exp .grid{grid-template-columns:1fr;gap:34px}
    .stats .row,.cap-grid,.steps-grid,.price-grid{grid-template-columns:1fr}
    .tier.pop{transform:none}
    .stat{border-right:none;border-bottom:1px solid var(--line)}
    .stat:last-child{border-bottom:none}
    .wrap{padding:0 22px}
  }
  @media(max-width:560px){
    .hero{padding:92px 0 48px}
    .hero .actions{flex-direction:column;align-items:stretch;gap:12px}
    .hero .cta{text-align:center;padding:15px 24px}
    .hero .ghost{justify-content:center}
    .hero-visual .robot-mob{height:290px}
    .social-proof{flex-wrap:wrap;gap:14px}
    .logo{font-size:26px}
  }
</style></head>
<body>
  <nav class="nav"><div class="wrap"><div class="row">
    <div class="logo">${esc(d.brand)}</div>
    <div class="links" id="navlinks"><a href="#how">Fonctionnement</a><a href="#services">Capacités</a><a href="#prix">Tarifs</a><a href="#contact">Contact</a><a class="pill" href="#contact">${esc(d.heroCta)}</a></div>
    <button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
  </div></div></nav>
  <script>(function(){var b=document.getElementById('burger'),l=document.getElementById('navlinks');if(!b)return;b.addEventListener('click',function(){var o=l.classList.toggle('open');b.classList.toggle('open',o);b.setAttribute('aria-expanded',o);});l.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){l.classList.remove('open');b.classList.remove('open');});});})();</script>

  <header class="hero">
    <div class="hero-glow"></div>
    <div class="hero-grid-lines"></div>
    <div class="hero-inner wrap">
      <div class="hero-text">
        <div class="eyebrow"><span class="eb-wa">${waLogo}</span>${esc(d.heroEyebrow)}</div>
        <h1>${heroWords}</h1>
        <p class="lede">${esc(d.heroSubtitle)}</p>
        <div class="actions">
          <a class="cta" href="#contact">${esc(d.heroCta)}</a>
          <a class="ghost" href="#how">Voir comment ça marche</a>
        </div>
        <div class="trust"><span>${esc(d.heroTrust)}</span></div>
        <div class="social-proof">
          <div class="av-stack">${[d.tAv1, d.tAv2, d.tAv3, d.tAv4, d.tAv5].map((u) => `<img src="${esc(u)}" alt="" loading="lazy">`).join("")}</div>
          <div class="sp-text"><div class="sp-stars">${star.repeat(5)}</div><span>${esc(d.heroSocial)}</span></div>
        </div>
      </div>
      <div class="hero-visual">${heroVisual}${d.heroSpline && !lite ? `<img class="robot-mob" src="/assets/robot.png" alt="">` : ""}</div>
    </div>
  </header>

  <div class="marquee"><div class="mq-track">${marquee}</div></div>

  <section class="stats"><div class="wrap"><div class="row">
    <div class="stat"><div class="v" data-val="${esc(d.statValue1)}">${esc(d.statValue1)}</div><div class="l">${esc(d.statLabel1)}</div></div>
    <div class="stat"><div class="v" data-val="${esc(d.statValue2)}">${esc(d.statValue2)}</div><div class="l">${esc(d.statLabel2)}</div></div>
    <div class="stat"><div class="v" data-val="${esc(d.statValue3)}">${esc(d.statValue3)}</div><div class="l">${esc(d.statLabel3)}</div></div>
  </div></div></section>

  <section class="exp wrap reveal" id="exp"><div class="grid">
    ${d.expChat ? `<div class="exp-chat">${chatBox}</div>` : d.expImage ? `<div class="exp-img"><img src="${esc(d.expImage)}" alt="" loading="lazy"></div>` : ""}
    <div class="exp-text">
      <span class="kicker">${esc(d.expEyebrow)}</span>
      <h2>${esc(d.expTitle)}</h2>
      <p>${esc(d.expBody)}</p>
      <ul class="exp-feat">
        <li>${check}<span>${esc(d.expFeat1)}</span></li>
        <li>${check}<span>${esc(d.expFeat2)}</span></li>
        <li>${check}<span>${esc(d.expFeat3)}</span></li>
      </ul>
      <div class="exp-metrics">
        <div><b>${esc(d.metricV1)}</b><span>${esc(d.metricL1)}</span></div>
        <div><b>${esc(d.metricV2)}</b><span>${esc(d.metricL2)}</span></div>
        <div><b>${esc(d.metricV3)}</b><span>${esc(d.metricL3)}</span></div>
      </div>
    </div>
  </div></section>

  ${steps}

  <div id="services">${services}</div>

  ${testimonials}

  ${pricing}

  ${cases}

  ${faq}

  <section class="band" id="contact"><div class="wrap"><div class="cta-final reveal">
    <h2>${esc(d.ctaTitle)}</h2>
    <p>${esc(d.ctaText)}</p>
    <a class="cta" href="#">${esc(d.heroCta)}</a>
    <div class="cta-points"><span>${check} ${esc(d.ctaP1)}</span><span>${check} ${esc(d.ctaP2)}</span><span>${check} ${esc(d.ctaP3)}</span></div>
  </div></div></section>

  <footer class="footer"><div class="wrap">
    <div class="foot-top">
      <div class="foot-brand">
        <div class="foot-logo"><span class="eb-wa">${waLogo}</span>${esc(d.brand)}</div>
        <p>${esc(d.footTagline)}</p>
        <a class="cta" href="#contact">${esc(d.heroCta)}</a>
      </div>
      <div class="foot-cols">
        ${[1, 2, 3]
          .map(
            (n) =>
              `<div class="foot-col"><h4>${esc(d["footColT" + n])}</h4>${splitList(
                d["footColL" + n],
              )
                .map((l) => `<a href="#">${esc(l)}</a>`)
                .join("")}</div>`,
          )
          .join("")}
      </div>
    </div>
    <div class="foot-bottom">
      <span>© ${esc(d.brand)}. Tous droits réservés.</span>
      <span>${esc(d.footBottom)}</span>
    </div>
  </div></footer>


  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
  <script>
  (function(){
    var hasG = window.gsap && window.ScrollTrigger;
    function revealFallback(){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.16});
      document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
    }
    if(!hasG){ revealFallback(); return; }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(function(el){
      ScrollTrigger.create({trigger:el,start:'top 84%',once:true,onEnter:function(){el.classList.add('in')}});
    });

    // Titre du hero : révélation mot par mot
    gsap.to('.hero h1 .w>span',{yPercent:-110,duration:.9,ease:'power3.out',stagger:.08,delay:.2});

    // Chiffres : count-up
    document.querySelectorAll('.stat .v').forEach(function(el){
      var raw=el.getAttribute('data-val')||'';
      var m=raw.match(/^(\\D*)(\\d+)(.*)$/);
      if(!m){return;}
      var pre=m[1],target=+m[2],suf=m[3],o={n:0};
      el.textContent=pre+'0'+suf;
      ScrollTrigger.create({trigger:el,start:'top 90%',once:true,onEnter:function(){
        gsap.to(o,{n:target,duration:1.4,ease:'power2.out',onUpdate:function(){el.textContent=pre+Math.round(o.n)+suf;}});
      }});
    });

    // Cartes : reveal + spotlight qui suit la souris
    ['.steps-grid .gcard','.cap-grid .gcard'].forEach(function(sel){
      gsap.from(sel,{opacity:0,y:36,stagger:.12,duration:.9,ease:'power3.out',scrollTrigger:{trigger:sel,start:'top 82%'}});
    });
    document.querySelectorAll('.gcard').forEach(function(c){
      c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');});
    });

    // Boutons magnétiques
    document.querySelectorAll('.cta').forEach(function(b){
      b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.35,y:(e.clientY-r.top-r.height/2)*.5,duration:.4,ease:'power3.out'})});
      b.addEventListener('mouseleave',function(){gsap.to(b,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'})});
    });

    // Retrait du badge "Built with Spline"
    var sv=document.querySelector('spline-viewer');
    if(sv){var k=0;var iv=setInterval(function(){try{var r=sv.shadowRoot;if(r){if(!r.getElementById('hidewm')){var st=document.createElement('style');st.id='hidewm';st.textContent='#logo,a[href*="spline"]{display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important}';r.appendChild(st);}var b=r.querySelector('#logo');if(b)b.style.setProperty('display','none','important');}}catch(e){}if(k++>100)clearInterval(iv);},150);}

    // Pause du robot 3D quand le hero sort de l'écran (libère le GPU)
    if(sv){var hero=document.querySelector('.hero');var io2=new IntersectionObserver(function(es){es.forEach(function(e){sv.style.visibility=e.isIntersecting?'visible':'hidden';})},{threshold:0});io2.observe(hero);}
  })();
  </script>
  <script>
  (function(){
    var body=document.getElementById('waBody'); if(!body) return;
    var convo=${JSON.stringify([
      { s: "them", tm: "09:41", t: d.dMsg1 },
      { s: "me", ty: 1200, tm: "09:41", t: d.dMsg2 },
      { s: "them", tm: "09:42", t: d.dMsg3 },
      { s: "me", ty: 1500, tm: "09:42", t: d.dMsg4 },
      { s: "them", tm: "09:43", t: d.dMsg5 },
      { s: "me", ty: 900, tm: "09:43", t: d.dMsg6 },
    ])};
    function add(cls,html){var d=document.createElement('div');d.className=cls;if(html)d.innerHTML=html;body.appendChild(d);requestAnimationFrame(function(){d.classList.add('in')});while(body.children.length>6)body.removeChild(body.firstChild);return d;}
    function bubble(m){var b=add('wa-msg '+(m.s==='me'?'me':'them'));b.textContent=m.t;var mt=document.createElement('span');mt.className='wmeta';if(m.s==='me'){mt.innerHTML=(m.tm||'')+' <i>✓✓</i>';}else{mt.textContent=m.tm||'';}b.appendChild(mt);return b;}
    var i=0;
    function step(){
      if(i>=convo.length){setTimeout(function(){body.innerHTML='';i=0;setTimeout(step,500);},2800);return;}
      var m=convo[i++];
      if(m.s==='me'&&m.ty){var tp=add('wa-typing','<i></i><i></i><i></i>');setTimeout(function(){tp.remove();bubble(m);setTimeout(step,750);},m.ty);}
      else{bubble(m);setTimeout(step,m.s==='them'?1000:750);}
    }
    setTimeout(step,900);
  })();
  </script>
</body></html>`;
}

// ---------- ÉDITEUR LIGHT (champs BRIDÉS uniquement) ----------
const F = (k, label, type) => ({ k, label, type: type || "text" });
const rep = (count, fn) =>
  Array.from({ length: count }, (_, i) => fn(i + 1)).flat();
const GROUPS = [
  {
    title: "Identité & couleurs",
    fields: [
      F("brand", "Nom de la marque"),
      F("accent", "Couleur d'accent", "color"),
      F("colBg", "Couleur de fond", "color"),
      F("colText", "Couleur du texte", "color"),
      F("colDark", "Sections sombres (footer)", "color"),
    ],
  },
  {
    title: "Bannière",
    fields: [
      F("heroEyebrow", "Sur-titre"),
      F("heroTitle", "Titre principal"),
      F("heroSubtitle", "Sous-titre", "textarea"),
      F("heroCta", "Bouton d'action"),
      F("heroTrust", "Ligne de réassurance"),
      F("heroSocial", "Preuve sociale (note)"),
      F("heroSpline", "Scène 3D (URL Spline)"),
    ],
  },
  {
    title: "Logos défilants",
    fields: [
      F("marquee", "Intégrations (séparées par des virgules)", "textarea"),
    ],
  },
  {
    title: "Chiffres clés",
    fields: rep(3, (n) => [
      F("statValue" + n, "Chiffre " + n),
      F("statLabel" + n, "Libellé " + n),
    ]),
  },
  {
    title: "Bloc démo",
    fields: [
      F("expEyebrow", "Sur-titre"),
      F("expTitle", "Titre"),
      F("expBody", "Texte", "textarea"),
      F("expFeat1", "Point 1"),
      F("expFeat2", "Point 2"),
      F("expFeat3", "Point 3"),
      ...rep(3, (n) => [
        F("metricV" + n, "Métrique " + n + " · chiffre"),
        F("metricL" + n, "Métrique " + n + " · libellé"),
      ]),
      ...rep(6, (n) => F("dMsg" + n, "Message démo " + n, "textarea")),
    ],
  },
  {
    title: "Étapes",
    fields: [
      F("stepsTitle", "Titre"),
      F("stepsSub", "Sous-titre", "textarea"),
      ...rep(3, (n) => [
        F("stepT" + n, "Étape " + n + " · titre"),
        F("stepB" + n, "Étape " + n + " · texte", "textarea"),
      ]),
    ],
  },
  {
    title: "Capacités",
    fields: [
      F("servicesTitle", "Titre"),
      F("servicesSub", "Sous-titre", "textarea"),
      ...rep(6, (n) => [
        F("capT" + n, "Capacité " + n + " · titre"),
        F("capB" + n, "Capacité " + n + " · texte", "textarea"),
        F("capQ" + n, "Capacité " + n + " · message client"),
        F("capA" + n, "Capacité " + n + " · réponse agent"),
      ]),
    ],
  },
  {
    title: "Témoignages",
    fields: [
      F("testiTitle", "Titre"),
      F("testiSub", "Sous-titre", "textarea"),
      ...rep(6, (n) => [
        F("tName" + n, "Avis " + n + " · nom"),
        F("tRole" + n, "Avis " + n + " · métier"),
        F("tQuote" + n, "Avis " + n + " · citation", "textarea"),
        F("tAv" + n, "Avis " + n + " · photo (URL)"),
      ]),
    ],
  },
  {
    title: "Tarifs",
    fields: [
      F("pricingTitle", "Titre"),
      F("pricingSub", "Sous-titre", "textarea"),
      ...rep(3, (n) => [
        F("planN" + n, "Offre " + n + " · nom"),
        F("planP" + n, "Offre " + n + " · prix"),
        F("planPer" + n, "Offre " + n + " · période"),
        F("planD" + n, "Offre " + n + " · description"),
        F("planF" + n, "Offre " + n + " · lignes (virgules)", "textarea"),
        F("planCta" + n, "Offre " + n + " · bouton"),
      ]),
    ],
  },
  {
    title: "Cas d'usage",
    fields: [
      F("casesTitle", "Titre"),
      F("casesSub", "Sous-titre", "textarea"),
      ...rep(4, (n) => [
        F("caseT" + n, "Cas " + n + " · titre"),
        F("caseB" + n, "Cas " + n + " · texte", "textarea"),
      ]),
    ],
  },
  {
    title: "FAQ",
    fields: [
      F("faqTitle", "Titre"),
      ...rep(6, (n) => [
        F("faqQ" + n, "Question " + n),
        F("faqA" + n, "Réponse " + n, "textarea"),
      ]),
    ],
  },
  {
    title: "Appel à l'action final",
    fields: [
      F("ctaTitle", "Titre"),
      F("ctaText", "Texte", "textarea"),
      F("ctaP1", "Point 1"),
      F("ctaP2", "Point 2"),
      F("ctaP3", "Point 3"),
    ],
  },
  {
    title: "Pied de page",
    fields: [
      F("footTagline", "Description", "textarea"),
      ...rep(3, (n) => [
        F("footColT" + n, "Colonne " + n + " · titre"),
        F("footColL" + n, "Colonne " + n + " · liens (virgules)"),
      ]),
      F("footBottom", "Mention bas de page"),
    ],
  },
];
const ALL_FIELDS = GROUPS.flatMap((g) => g.fields);

function renderEditor(site, d, host) {
  const fieldHtml = (f) => {
    const v = d[f.k];
    if (f.type === "textarea")
      return `<label class="fld"><span>${f.label}</span><textarea name="${f.k}" rows="3">${esc(v)}</textarea></label>`;
    if (f.type === "color")
      return `<label class="fld color"><span>${f.label}</span><span class="cwrap"><input type="color" name="${f.k}" value="${esc(v)}" oninput="this.nextElementSibling.textContent=this.value"><b>${esc(v)}</b></span></label>`;
    if (/^tAv\d/.test(f.k))
      return `<label class="fld"><span>${f.label}</span><span class="imgrow"><img src="${esc(v)}" alt="" onerror="this.classList.add('off')"><input type="text" name="${f.k}" value="${esc(v)}" oninput="var i=this.parentNode.querySelector('img');i.src=this.value;i.classList.remove('off')"></span></label>`;
    return `<label class="fld"><span>${f.label}</span><input type="text" name="${f.k}" value="${esc(v)}"></label>`;
  };
  const groups = GROUPS.map((g, gi) => {
    const rows = g.fields.map(fieldHtml).join("");
    return `<section class="grp${gi === 0 ? " open" : ""}"><button type="button" class="grp-h"><span>${g.title}</span><svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg></button><div class="grp-body">${rows}</div></section>`;
  }).join("");

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(d.brand)} · Éditeur</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root{--accent:${esc(d.accent || "#1a5c3a")};--bg:#0b0c0e;--chrome:#101215;--line:#1e2227;--line2:#262b31;--field:#16191d;--txt:#e8eaed;--mut:#8b929b;--mut2:#5f666e}
  *{margin:0;padding:0;box-sizing:border-box}
  ::selection{background:color-mix(in srgb,var(--accent) 45%,transparent)}
  body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--txt);height:100vh;display:flex;flex-direction:column;overflow:hidden;-webkit-font-smoothing:antialiased}
  /* TOP BAR */
  .bar{height:54px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 14px;background:var(--chrome);border-bottom:1px solid var(--line)}
  .bar-l,.bar-r{display:flex;align-items:center;gap:12px;flex:1}
  .bar-r{justify-content:flex-end}
  .logo{width:30px;height:30px;border-radius:7px;background:var(--accent);color:#fff;display:grid;place-items:center;font-weight:800;font-size:16px}
  .site{display:flex;align-items:center;gap:7px;font-size:13.5px;font-weight:600;color:var(--txt)}
  .site svg{width:13px;height:13px;color:var(--mut2)}
  .seg{display:flex;gap:2px;padding:3px;background:#16191d;border:1px solid var(--line);border-radius:9px}
  .seg button{width:34px;height:28px;display:grid;place-items:center;border:none;background:none;border-radius:6px;color:var(--mut2);cursor:pointer;transition:.13s}
  .seg button svg{width:16px;height:16px}
  .seg button:hover{color:var(--mut)}
  .seg button.on{background:#262b31;color:var(--txt)}
  .saved{font-size:12px;color:var(--mut2);transition:.3s;min-width:96px;text-align:right}
  .ghost{font-size:13px;font-weight:500;color:var(--mut);text-decoration:none;padding:8px 12px;border-radius:7px;transition:.13s}
  .ghost:hover{color:var(--txt);background:#16191d}
  .pub{padding:9px 18px;background:var(--accent);color:#fff;border:none;border-radius:7px;font:inherit;font-weight:600;font-size:13.5px;cursor:pointer;transition:.13s}
  .pub:hover{filter:brightness(1.1)}
  .pub:active{transform:translateY(1px)}
  /* WORKSPACE */
  .work{flex:1;display:flex;min-height:0}
  .panel{width:358px;flex-shrink:0;background:var(--chrome);border-right:1px solid var(--line);display:flex;flex-direction:column;min-height:0}
  .search{padding:12px 14px;border-bottom:1px solid var(--line)}
  .search input{width:100%;background:var(--field);border:1px solid var(--line2);border-radius:8px;padding:9px 12px 9px 34px;color:var(--txt);font:inherit;font-size:13px;transition:.14s;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%237a8089' stroke-width='2' viewBox='0 0 24 24'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='m21 21-4-4'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:12px center}
  .search input::placeholder{color:var(--mut2)}
  .search input:focus{outline:none;border-color:var(--accent);background-color:#181c20}
  .scroll{flex:1;overflow-y:auto;min-height:0}
  .scroll::-webkit-scrollbar{width:9px}
  .scroll::-webkit-scrollbar-thumb{background:#23272d;border-radius:9px;border:3px solid var(--chrome)}
  .grp{border-bottom:1px solid var(--line)}
  .grp-h{width:100%;display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:none;border:none;cursor:pointer;font:inherit;font-size:12.5px;font-weight:600;color:#c2c8cf;letter-spacing:.01em;transition:.13s}
  .grp-h:hover{color:var(--txt)}
  .chev{width:15px;height:15px;color:var(--mut2);transition:transform .22s ease}
  .grp.open .chev{transform:rotate(180deg)}
  .grp-body{display:none;padding:2px 16px 16px}
  .grp.open>.grp-body{display:block}
  .fld{display:block;margin-top:13px}
  .fld:first-child{margin-top:4px}
  .fld>span{display:block;font-size:11.5px;font-weight:500;color:var(--mut);margin-bottom:6px}
  .fld input[type=text],.fld textarea{width:100%;padding:10px 12px;border:1px solid var(--line2);border-radius:7px;font:inherit;font-size:13.5px;background:var(--field);resize:vertical;transition:.14s;color:var(--txt);line-height:1.45}
  .fld input[type=text]:focus,.fld textarea:focus{outline:none;border-color:var(--accent);background:#181c20;box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 22%,transparent)}
  .fld.color{display:flex;align-items:center;justify-content:space-between}
  .fld.color>span{margin:0}
  .cwrap{display:flex;align-items:center;gap:10px}
  .cwrap input{width:38px;height:30px;border:1px solid var(--line2);border-radius:7px;background:var(--field);cursor:pointer;padding:3px}
  .cwrap b{font-size:12.5px;font-weight:600;color:var(--mut);font-variant-numeric:tabular-nums}
  .imgrow{display:flex;align-items:center;gap:10px}
  .imgrow img{width:36px;height:36px;border-radius:8px;object-fit:cover;flex-shrink:0;background:var(--field);border:1px solid var(--line2)}
  .imgrow img.off{visibility:hidden}
  .imgrow input{flex:1}
  .foot{padding:13px 16px;border-top:1px solid var(--line);font-size:11px;line-height:1.45;color:var(--mut2);display:flex;gap:8px;align-items:flex-start}
  .foot svg{width:13px;height:13px;flex-shrink:0;margin-top:1px;color:var(--mut2)}
  /* STAGE */
  .stage{flex:1;position:relative;display:flex;align-items:stretch;justify-content:center;padding:50px 40px 40px;overflow:auto;background:radial-gradient(120% 120% at 50% 0%,#0e1013 0%,var(--bg) 60%)}
  .chip{position:absolute;top:14px;left:50%;transform:translateX(-50%);background:#16191d;border:1px solid var(--line);color:var(--mut);font-size:11.5px;font-weight:500;padding:5px 13px;border-radius:7px;letter-spacing:.02em}
  .frame{width:100%;height:100%;background:#fff;border-radius:12px;border:1px solid var(--line);box-shadow:0 50px 90px -40px rgba(0,0,0,.8);overflow:hidden;transition:width .32s cubic-bezier(.4,0,.2,1)}
  .frame iframe{width:100%;height:100%;border:none;background:#fff;display:block}
</style></head>
<body>
  <header class="bar">
    <div class="bar-l">
      <span class="logo">${esc(String(d.brand).charAt(0))}</span>
      <span class="site">${esc(site)}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg></span>
    </div>
    <div class="seg">
      <button data-dev="desk" class="on" title="Bureau"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></button>
      <button data-dev="tab" title="Tablette"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/></svg></button>
      <button data-dev="mob" title="Mobile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></svg></button>
    </div>
    <div class="bar-r">
      <span class="saved" id="saved">Enregistré</span>
      <a class="ghost" href="/?site=${esc(site)}" target="_blank" rel="noopener">Aperçu</a>
      <button class="pub" id="pub">Publier</button>
    </div>
  </header>
  <div class="work">
    <aside class="panel">
      <div class="search"><input id="search" type="text" placeholder="Rechercher un champ" autocomplete="off"></div>
      <div class="scroll"><form id="ed">${groups}</form></div>
    </aside>
    <main class="stage">
      <span class="chip" id="chip">Bureau</span>
      <div class="frame" id="frame"><iframe name="preview" src="/?site=${esc(site)}"></iframe></div>
    </main>
  </div>
  <script>
  (function(){
    var form=document.getElementById('ed'),iframe=document.querySelector('iframe[name=preview]'),saved=document.getElementById('saved'),pub=document.getElementById('pub'),t;
    function save(done){var fd=new URLSearchParams(new FormData(form));saved.textContent='Enregistrement';fetch('/save?site=${esc(site)}&autosave=1',{method:'POST',body:fd}).then(function(){saved.textContent='Enregistré';try{iframe.contentWindow.location.reload();}catch(e){iframe.src=iframe.src;}if(done)done();});}
    form.addEventListener('input',function(){saved.textContent='Modifié';clearTimeout(t);t=setTimeout(save,650);});
    pub.addEventListener('click',function(){clearTimeout(t);var o=pub.textContent;save(function(){pub.textContent='Publié';setTimeout(function(){pub.textContent=o;},1500);});});
    // device toggle
    var frame=document.getElementById('frame'),chip=document.getElementById('chip'),sizes={desk:['100%','Bureau'],tab:['834px','Tablette'],mob:['390px','Mobile']};
    document.querySelectorAll('.seg button').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.seg button').forEach(function(x){x.classList.remove('on');});b.classList.add('on');var s=sizes[b.dataset.dev];frame.style.width=s[0];chip.textContent=s[1];});});
    // accordion
    document.querySelectorAll('.grp-h').forEach(function(h){h.addEventListener('click',function(){h.parentNode.classList.toggle('open');});});
    // search
    document.getElementById('search').addEventListener('input',function(){var q=this.value.trim().toLowerCase();document.querySelectorAll('.grp').forEach(function(g){var any=false;g.querySelectorAll('.fld').forEach(function(fl){var sp=fl.querySelector('span'),tx=sp?sp.textContent.toLowerCase():'';var hit=!q||tx.indexOf(q)>=0;fl.style.display=hit?'':'none';if(hit)any=true;});g.style.display=any?'':'none';if(q&&any)g.classList.add('open');});});
  })();
  </script>
</body></html>`;
}

const TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function handler(req, res) {
  const url = new URL(req.url, "http://localhost");

  // static assets
  if (url.pathname.startsWith("/assets/")) {
    const fp = path.join(ASSETS, path.basename(url.pathname));
    if (fs.existsSync(fp)) {
      res.writeHead(200, {
        "Content-Type":
          TYPES[path.extname(fp).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      });
      fs.createReadStream(fp).pipe(res);
      return;
    }
    res.writeHead(404);
    res.end();
    return;
  }

  const site = url.searchParams.get("site") || sites()[0];

  if (req.method === "POST" && url.pathname === "/save") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const params = new URLSearchParams(body);
      const d = load(site);
      ALL_FIELDS.forEach((f) => {
        if (f.type === "bool") d[f.k] = params.has(f.k);
        else if (params.has(f.k)) d[f.k] = params.get(f.k);
      });
      save(site, d);
      if (url.searchParams.get("autosave") === "1") {
        res.writeHead(204);
        res.end();
      } else {
        res.writeHead(303, { Location: "/admin?site=" + site });
        res.end();
      }
    });
    return;
  }

  if (url.pathname === "/admin") {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(renderEditor(site, load(site), req.headers.host));
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(renderSite(site, load(site), url.searchParams.get("lite") === "1"));
}

module.exports = handler;

if (require.main === module) {
  http
    .createServer(handler)
    .listen(process.env.PORT || 4321, "0.0.0.0", () =>
      console.log(
        "Démo sur http://localhost:" + (process.env.PORT || 4321) + "/admin",
      ),
    );
}

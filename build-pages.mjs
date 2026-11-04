// Gera as páginas estáticas nos três idiomas (pt na raiz, /en e /es):
//   home (index.html: casca que carrega o app.js), /transformacao, /servicos,
//   /servicos/<slug>, 404.html e o sitemap.xml.
// Uso: npm run pages   (rodar depois de editar este arquivo ou i18n/pages.mjs)
//
// As páginas internas não carregam app.js: o conteúdo já vem no HTML,
// o que facilita a indexação e deixa o carregamento leve.
// Textos: i18n/pages.mjs (páginas estáticas) e i18n/home.jsx (home em React).
// Rotas de cada idioma e bandeiras: i18n/routes.mjs.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { LANGS, LANG_META, ROUTES, FLAGS, SWITCH_LABEL, route, svcRoute } from "./i18n/routes.mjs";
import { PAGES, SERVICE_ORDER } from "./i18n/pages.mjs";

const SITE = "https://agenciabyte.com";
const BRAND = "Agencia Byte";
const OG_IMAGE = `${SITE}/img/og-image.png`;
const WHATSAPP = "https://wa.me/5542984224363";
const EMAIL = "hello@agenciabyte.com";
const INSTAGRAM = "https://www.instagram.com/agenciabyte.ia";
const LINKEDIN = "https://www.linkedin.com/company/byte-agencia";
// Clientes citados na home (mesma lista de CLIENT_LOGOS em app-2.jsx).
const CASE_SLUGS = ["cargon"]; // casos de clientes com página própria (/clientes/<slug>)
const CLIENTS = [
  ["Divina Argila", "https://divinaargila.com.br/"],
  ["Bouwman", "https://bouwman.com.br/"],
  ["Oglee", "https://oglee.com.br/"],
  ["Nyl", "https://www.nylhairdesign.com.br/"],
  ["Aline Nail", "https://www.instagram.com/alinebukowski.naildesigner/"],
  ["StarTrade", "https://startrade.com.br/"],
  ["CargOn", "https://cargon.com.br/"],
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (path) => SITE + (path === "/" ? "/" : path);

// Serviços de um idioma, já com slug, código, URL e relacionados.
function servicesFor(lang) {
  return SERVICE_ORDER.map((o) => ({ ...o, ...PAGES[lang].services[o.slug], path: svcRoute(o.slug, lang) }));
}

function glyph(type) {
  const g = {
    sheet: '<path d="M5 4h12v15H5zM8 8h6M8 12h6M8 16h4"/><path d="M8 2h11v15"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m4 7 8 6 8-6"/>',
    gear: '<path d="m12 3 1.2 2.1 2.4.5 1.8-1.2 2.1 2.1-1.2 1.8.5 2.4L21 12l-2.2 1.2-.5 2.4 1.2 1.8-2.1 2.1-1.8-1.2-2.4.5L12 21l-1.2-2.2-2.4-.5-1.8 1.2-2.1-2.1 1.2-1.8-.5-2.4L3 12l2.2-1.2.5-2.4-1.2-1.8 2.1-2.1 1.8 1.2 2.4-.5L12 3Z"/><circle cx="12" cy="12" r="3"/>',
    chart: '<path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-7M20 16v-3"/>',
    plug: '<rect x="3" y="9" width="8" height="6" rx="1.5"/><rect x="13" y="9" width="8" height="6" rx="1.5"/><path d="M11 12h2M5 9V6M9 9V6M15 15v3M19 15v3"/>',
    ai: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${g[type] || g.ai}</svg>`;
}
const SYMPTOM_GLYPHS = ["sheet", "mail", "gear", "chart", "sheet"];
const BENEFIT_GLYPHS = ["gear", "plug", "ai", "chart", "gear", "ai"];

// GA e Apollo só carregam na primeira interação (ou após 4s ocioso),
// para não competir com o conteúdo no carregamento inicial.
const ANALYTICS = `<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-8SFBNK4KDQ');
  (function(){
    var done = false, evts = ['pointerdown','keydown','scroll','touchstart'];
    function load(){
      if (done) return; done = true;
      evts.forEach(function(e){ removeEventListener(e, load); });
      var g = document.createElement('script');
      g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=G-8SFBNK4KDQ';
      document.head.appendChild(g);
      var a = document.createElement('script');
      a.async = true; a.src = 'https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=' + Math.random().toString(36).substring(7);
      a.onload = function(){ window.trackingFunctions.onLoad({ appId: '6a5fc15502199500103f7f77' }); };
      document.head.appendChild(a);
    }
    evts.forEach(function(e){ addEventListener(e, load, { once: true, passive: true }); });
    addEventListener('load', function(){ setTimeout(load, 4000); });
  })();
</script>`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" media="print" onload="this.media='all'" />
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" /></noscript>`;

// <link rel="alternate" hreflang> para as versões da mesma página nos três idiomas.
function hreflangLinks(key) {
  const r = ROUTES[key];
  return [
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${LANG_META[l].hreflang}" href="${abs(r[l])}" />`),
    `<link rel="alternate" hreflang="x-default" href="${abs(r.pt)}" />`,
  ].join("\n");
}

function head({ lang, key, title, description, jsonld, noindex = false, extraHead = "" }) {
  const m = LANG_META[lang];
  const url = key ? abs(route(key, lang)) : "";
  return `<!doctype html>
<html lang="${m.html}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
${noindex ? '<meta name="robots" content="noindex, follow" />' : `<meta name="robots" content="index, follow" />
<link rel="canonical" href="${url}" />
${hreflangLinks(key)}

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:image" content="${OG_IMAGE}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="${m.og}" />
${LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${LANG_META[l].og}" />`).join("\n")}
<meta property="og:site_name" content="${BRAND}" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${OG_IMAGE}" />`}

<meta name="theme-color" content="#FF6A1A" />
<link rel="icon" href="/img/logo_byte_64.png" sizes="64x64" type="image/png" />
<link rel="apple-touch-icon" href="/img/logo_byte.png" sizes="180x180" />
${extraHead}${jsonld ? `\n<script type="application/ld+json">\n${JSON.stringify(jsonld, null, 2)}\n</script>\n` : ""}
${ANALYTICS}

${FONTS}
<link rel="stylesheet" href="/styles.css" />
<link rel="stylesheet" href="/pages.css" />
</head>
<body data-theme="light">`;
}

// Seletor de idioma (bandeira no topo). key = página atual; os links levam
// para a mesma página nos outros idiomas.
function langSwitch(lang, key) {
  const m = LANG_META[lang];
  const items = LANGS.map((l) => {
    const cur = l === lang ? ' aria-current="true"' : "";
    return `<li><a href="${ROUTES[key][l]}" hreflang="${LANG_META[l].hreflang}" lang="${LANG_META[l].html}"${cur}><span class="lang-flag">${FLAGS[l]}</span>${LANG_META[l].name}</a></li>`;
  }).join("\n          ");
  return `<details class="lang-switch">
        <summary aria-label="${SWITCH_LABEL[lang]}: ${m.name}"><span class="lang-flag">${FLAGS[lang]}</span><span class="lang-code">${m.short}</span><svg class="lang-chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></summary>
        <ul class="lang-menu">
          ${items}
        </ul>
      </details>`;
}

function nav(lang, key, current) {
  const u = PAGES[lang].ui;
  const home = route("home", lang);
  const anchor = (id) => (home === "/" ? `/#${id}` : `${home}#${id}`);
  const links = [
    [anchor("sobre"), u.nav.about],
    [route("transformation", lang), u.nav.transformation],
    [route("services", lang), u.nav.services],
    [anchor("processo"), u.nav.process],
    [anchor("clientes"), u.nav.clients],
  ];
  const cur = (href) => (href === current ? ' aria-current="page"' : "");
  const blog = '<a href="https://blog.agenciabyte.com/" class="nav-pill-link blog-link" target="_blank" rel="noopener noreferrer">Blog</a>';
  return `<a class="skip-link" href="#conteudo">${u.skip}</a>
<header class="nav">
  <div class="nav-inner">
    <a href="${home}" class="nav-brand-wrap" aria-label="${u.brandAria}">
      <span class="glyph">
        <picture>
          <source srcset="/img/logo_byte.webp" type="image/webp" />
          <img src="/img/logo_byte_64.png" alt="" width="32" height="32" />
        </picture>
      </span>
      <span>Agencia Byte</span>
    </a>
    <nav class="nav-pill" aria-label="${u.mainMenu}">
      ${links.map(([h, l]) => `<a href="${h}" class="nav-pill-link"${cur(h)}>${l}</a>`).join("\n      ")}
      ${blog}
    </nav>
    <div class="nav-cta">
      ${langSwitch(lang, key)}
      <a href="${anchor("contato")}" class="btn btn-accent nav-cta-desktop">${u.contact}</a>
      <button class="nav-burger" type="button" aria-label="${u.menuOpen}" aria-expanded="false" aria-controls="menu-mobile">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>
    </div>
  </div>
  <nav class="nav-mobile-menu" id="menu-mobile" aria-label="${u.mobileMenu}" hidden>
    ${links.map(([h, l]) => `<a href="${h}"${cur(h)}>${l}</a>`).join("\n    ")}
    <a href="https://blog.agenciabyte.com/" class="ul-link blog-link" target="_blank" rel="noopener noreferrer">Blog</a>
    <a href="${anchor("contato")}" class="nav-mobile-cta">${u.contact}</a>
  </nav>
</header>
<script>
  (function(){
    var b = document.querySelector('.nav-burger'), m = document.getElementById('menu-mobile');
    b.addEventListener('click', function(){
      var open = m.hidden;
      m.hidden = !open;
      b.setAttribute('aria-expanded', String(open));
      b.setAttribute('aria-label', open ? ${JSON.stringify(u.menuClose)} : ${JSON.stringify(u.menuOpen)});
    });
    // Fecha o seletor de idioma ao clicar fora ou apertar Esc.
    var d = document.querySelector('.lang-switch');
    document.addEventListener('pointerdown', function(e){ if (d.open && !d.contains(e.target)) d.open = false; });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && d.open){ d.open = false; d.querySelector('summary').focus(); } });
  })();
</script>`;
}

function footer(lang) {
  const u = PAGES[lang].ui;
  const home = route("home", lang);
  const anchor = (id) => (home === "/" ? `/#${id}` : `${home}#${id}`);
  const col = (title, items) => `<div>
          <div class="mono footer-title">${title}</div>
          <ul class="footer-list">
            ${items.map(([h, l]) => `<li><a href="${h}" class="ul-link">${l}</a></li>`).join("\n            ")}
          </ul>
        </div>`;
  return `<footer class="section-dark site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <div class="brand">Agencia Byte</div>
        <p class="muted footer-tagline">${u.footer.tagline}</p>
      </div>
      ${col(u.footer.services, servicesFor(lang).map((s) => [s.path, s.nav]))}
      ${col(u.footer.company, [[anchor("sobre"), u.footer.about], [anchor("processo"), u.footer.process], [route("transformation", lang), u.footer.transformation], ["https://blog.agenciabyte.com/", "Blog"]])}
      <div>
        <div class="mono footer-title">${u.footer.contact}</div>
        <ul class="footer-list">
          <li><a href="mailto:${EMAIL}" class="ul-link">${EMAIL}</a></li>
          <li><a href="${WHATSAPP}" target="_blank" rel="noopener noreferrer" class="ul-link">+55 42 98422-4363</a></li>
          <li><a href="${INSTAGRAM}" target="_blank" rel="noopener noreferrer" class="ul-link">Instagram</a></li>
          <li><a href="${LINKEDIN}" target="_blank" rel="noopener noreferrer" class="ul-link">LinkedIn</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="muted mono">${u.footer.rights}</div>
    </div>
  </div>
</footer>
</body>
</html>
`;
}

function crumbs(lang, items) {
  return `<nav class="crumbs mono" aria-label="${PAGES[lang].ui.crumbsLabel}">
        <ol>
          ${items.map(([h, l], i) => (i < items.length - 1 ? `<li><a href="${h}">${l}</a></li>` : `<li aria-current="page">${l}</li>`)).join("\n          ")}
        </ol>
      </nav>`;
}

function breadcrumbLd(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([h, l], i) => ({ "@type": "ListItem", position: i + 1, name: l, item: abs(h) })),
  };
}

function processSection(lang) {
  const p = PAGES[lang];
  return `<section class="page-section">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#EC4899"></span>${p.ui.process.eyebrow}</div>
        <h2 class="display">${p.ui.process.title}</h2>
      </div>
      <ol class="steps">
        ${p.process.map((s, i) => `<li class="card">
          <div class="display step-code">0${i + 1}</div>
          <h3>${s.t}</h3>
          <p class="muted">${s.d}</p>
          <div class="mono step-dur">${s.dur}</div>
        </li>`).join("\n        ")}
      </ol>
    </div>
  </section>`;
}

function faqSection(lang, faq) {
  const u = PAGES[lang].ui;
  return `<section class="page-section page-section-alt">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow"><span class="dot" style="--dot-color:#3B82F6"></span>${u.faq.eyebrow}</div>
        <h2 class="display">${u.faq.title}</h2>
      </div>
      <div class="faq">
        ${faq.map((f) => `<details>
          <summary>${esc(f.q)}</summary>
          <p class="muted">${esc(f.a)}</p>
        </details>`).join("\n        ")}
      </div>
    </div>
  </section>`;
}

function ctaButtons(lang) {
  const u = PAGES[lang].ui;
  const home = route("home", lang);
  return `<div class="cta-actions">
        <a href="${home === "/" ? "/" : home}#contato" class="btn btn-accent">${u.cta.start}</a>
        <a href="${WHATSAPP}" class="btn btn-ghost" target="_blank" rel="noopener noreferrer">${u.cta.whatsapp}</a>
      </div>`;
}

function ctaSection(lang, heading) {
  return `<section class="section-dark cta-band">
    <div class="wrap">
      <h2 class="display">${heading}</h2>
      <p>${PAGES[lang].ui.cta.text}</p>
      ${ctaButtons(lang)}
    </div>
  </section>`;
}

function relatedSection(lang, slugs) {
  const u = PAGES[lang].ui;
  const all = Object.fromEntries(servicesFor(lang).map((s) => [s.slug, s]));
  return `<section class="page-section">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#8B5CF6"></span>${u.related.eyebrow}</div>
        <h2 class="display">${u.related.title}</h2>
      </div>
      <div class="related-grid">
        ${slugs.map((slug) => {
          const s = all[slug];
          return `<a class="card related-card" href="${s.path}">
          <span class="mono muted">// ${s.code}</span>
          <h3>${s.name}</h3>
          <p class="muted">${s.description}</p>
          <span class="related-more mono">${u.related.more}</span>
        </a>`;
        }).join("\n        ")}
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* Páginas                                                             */
/* ------------------------------------------------------------------ */

// Home: casca HTML com SEO e conteúdo <noscript>; o conteúdo visível vem do app.js.
function homePage(lang) {
  const h = PAGES[lang].home;
  const m = LANG_META[lang];
  const url = abs(route("home", lang));
  const svcs = servicesFor(lang);
  // Markdown e llms.txt só existem em português.
  const ptExtras = lang === "pt" ? `<link rel="alternate" type="text/markdown" href="/index.html.md" />
<link rel="describedby" href="/llms.txt" />
` : "";
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: BRAND,
        url: SITE,
        logo: `${SITE}/img/logo_byte.png`,
        description: h.orgDescription,
        knowsAbout: ["Software Development", "Artificial Intelligence", "Process Automation", "System Integration", "Data Analytics", "Business Intelligence", "Power BI"],
        email: EMAIL,
        telephone: "+55-42-98422-4363",
        sameAs: [INSTAGRAM, LINKEDIN],
        areaServed: ["BR", "US", "ES"],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+55-42-98422-4363",
          contactType: "customer service",
          email: EMAIL,
          availableLanguage: ["Portuguese", "English", "Spanish"],
          contactOption: "TollFree",
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE}/#service`,
        name: BRAND,
        url: SITE,
        description: h.serviceDescription,
        provider: { "@id": `${SITE}/#organization` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: h.catalogName,
          itemListElement: h.catalog.map(([name, description]) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name, description } })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: BRAND,
        inLanguage: ["pt-BR", "en", "es"],
        publisher: { "@id": `${SITE}/#organization` },
      },
    ],
  };
  return `<!doctype html>
<html lang="${m.html}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

<!-- Primary SEO -->
<title>${esc(h.title)}</title>
<meta name="description" content="${esc(h.description)}" />
<meta name="keywords" content="${esc(h.keywords)}" />
<meta name="author" content="Agência Byte" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${url}" />
${hreflangLinks("home")}

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${esc(h.title)}" />
<meta property="og:description" content="${esc(h.description)}" />
<meta property="og:image" content="${OG_IMAGE}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="${m.og}" />
${LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${LANG_META[l].og}" />`).join("\n")}
<meta property="og:site_name" content="${BRAND}" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(h.title)}" />
<meta name="twitter:description" content="${esc(h.description)}" />
<meta name="twitter:image" content="${OG_IMAGE}" />

<!-- Theme -->
<meta name="theme-color" content="#FF6A1A" />
<link rel="icon" href="/img/logo_byte_64.png" sizes="64x64" type="image/png" />
<link rel="apple-touch-icon" href="/img/logo_byte.png" sizes="180x180" />
${ptExtras}
<!-- Structured Data: Organization + ProfessionalService + WebSite -->
<script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
</script>

<!-- Google Analytics + Apollo: carregam na primeira interação (ou 4s após o load). -->
${ANALYTICS}

<!-- Fontes carregadas sem bloquear a renderização -->
${FONTS}

<link rel="stylesheet" href="/styles.css" />

<!-- Bundle pré-compilado (React + app). Gerado por \`npm run build\`. O idioma vem do <html lang>. -->
<script defer src="/app.js"></script>
</head>
<body data-theme="light">
<div id="app"></div>

<!-- Conteúdo estático para indexação antes da execução do JavaScript -->
<noscript>
  <main>
    <h1>${esc(h.title)}</h1>
    <p>${h.noscriptLead}</p>
    <section>
      <h2>${h.whoTitle}</h2>
      <p>${h.who}</p>
    </section>
    <section>
      <h2><a href="${route("services", lang)}">${PAGES[lang].ui.nav.services}</a></h2>
${svcs.map((s, i) => `      <article>
        <h3><a href="${s.path}">${h.catalog[i][0]}</a></h3>
        <p>${h.catalog[i][1]}</p>
      </article>`).join("\n")}
    </section>
    <section>
      <h2>${h.casesTitle}</h2>
      <p>${h.casesIntro}</p>
${CASE_SLUGS.map((slug) => `      <article>
        <h3><a href="${route(`case:${slug}`, lang)}">${PAGES[lang].cases[slug].h1}</a></h3>
        <p>${PAGES[lang].cases[slug].summary}</p>
      </article>`).join("\n")}
${h.cases.map((c) => `      <article>
        <h3>${c.t}</h3>
        <p><strong>${h.caseProblem}:</strong> ${c.problem}</p>
        <p><strong>${h.caseSolution}:</strong> ${c.solution}</p>
        <p><strong>${h.caseResult}:</strong> ${c.result}</p>
      </article>`).join("\n")}
    </section>
    <section>
      <h2>${h.beforeAfterTitle}</h2>
      <p>${h.beforeAfterText} <a href="${route("transformation", lang)}">${h.beforeAfterLink}</a>.</p>
    </section>
    <section>
      <h2>${h.clientsTitle}</h2>
      <p>${h.clientsText} ${CLIENTS.map(([n, u]) => { const slug = CASE_SLUGS.find((x) => PAGES[lang].cases[x].name === n); return `<a href="${slug ? route(`case:${slug}`, lang) : u}">${n}</a>`; }).join(", ")}.</p>
    </section>
    <section>
      <h2>${h.faqTitle}</h2>
${h.faq.map((f) => `      <h3>${f.q}</h3>
      <p>${f.a}</p>`).join("\n")}
    </section>
    <section>
      <h2>${h.contactTitle}</h2>
      <p>Email: <a href="mailto:${EMAIL}">${EMAIL}</a></p>
      <p>WhatsApp: <a href="${WHATSAPP}">+55 (42) 98422-4363</a></p>
      <p>LinkedIn: <a href="${LINKEDIN}">Agencia Byte</a></p>
    </section>
    <p>${LANGS.filter((l) => l !== lang).map((l) => `<a href="${route("home", l)}" hreflang="${LANG_META[l].hreflang}" lang="${LANG_META[l].html}">${LANG_META[l].name}</a>`).join(" · ")}</p>
  </main>
</noscript>

</body>
</html>
`;
}

function servicePage(lang, s) {
  const p = PAGES[lang];
  const key = `svc:${s.slug}`;
  const trail = [[route("home", lang), p.ui.crumbHome], [route("services", lang), p.ui.nav.services], [s.path, s.name]];
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE}${s.path}#service`,
        name: s.name,
        serviceType: s.name,
        description: s.description,
        url: SITE + s.path,
        inLanguage: LANG_META[lang].html,
        provider: { "@id": `${SITE}/#organization` },
        areaServed: ["BR", "US", "ES"],
      },
      breadcrumbLd(trail),
    ],
  };
  return (
    head({ lang, key, title: s.title, description: s.description, jsonld }) +
    nav(lang, key, route("services", lang)) +
    `
<main id="conteudo">
  <section class="page-hero">
    <div class="grid-bg"></div>
    <div class="wrap">
      ${crumbs(lang, trail)}
      <div class="eyebrow"><span class="dot"></span>${p.ui.service.eyebrow} ${s.code}</div>
      <h1 class="display">${s.h1}</h1>
      <p class="lead muted">${s.lead}</p>
      ${ctaButtons(lang)}
    </div>
  </section>

  <section class="page-section">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow"><span class="dot" style="--dot-color:#F59E0B"></span>${p.ui.service.whenEyebrow}</div>
        <h2 class="display">${p.ui.service.whenTitle}</h2>
      </div>
      <ol class="signal-list">
        ${s.problems.map((x, i) => `<li><span class="mono">0${i + 1}</span><span>${x}</span></li>`).join("\n        ")}
      </ol>
    </div>
  </section>

  <section class="page-section page-section-alt">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#10B981"></span>${p.ui.service.delivEyebrow}</div>
        <h2 class="display">${p.ui.service.delivTitle}</h2>
      </div>
      <div class="deliv-grid">
        ${s.deliverables.map((d) => `<div class="card">
          <h3>${d.t}</h3>
          <p class="muted">${d.d}</p>
        </div>`).join("\n        ")}
      </div>
      <div class="stack">
        <div class="mono muted">${p.ui.service.stack}</div>
        <ul>
          ${s.stack.map((b) => `<li class="chip">${b}</li>`).join("\n          ")}
        </ul>
      </div>
    </div>
  </section>

  ${processSection(lang)}
  ${faqSection(lang, s.faq)}
  ${relatedSection(lang, s.related)}
  ${ctaSection(lang, p.ui.service.cta)}
</main>
` +
    footer(lang)
  );
}

function casePage(lang, slug) {
  const p = PAGES[lang];
  const c = p.cases[slug];
  const ui = p.caseUi;
  const key = `case:${slug}`;
  const path = route(key, lang);
  const home = route("home", lang);
  const clientsAnchor = home === "/" ? "/#clientes" : `${home}#clientes`;
  const clientUrl = Object.fromEntries(CLIENTS)[c.name];
  const trail = [[home, p.ui.crumbHome], [clientsAnchor, ui.clients], [path, c.name]];
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE}${path}#article`,
        headline: c.h1,
        description: c.description,
        url: SITE + path,
        mainEntityOfPage: SITE + path,
        inLanguage: LANG_META[lang].html,
        about: { "@type": "Organization", name: c.name, url: clientUrl },
        author: { "@id": `${SITE}/#organization` },
        publisher: { "@id": `${SITE}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: c.qa.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      breadcrumbLd(trail),
    ],
  };
  return (
    head({ lang, key, title: c.title, description: c.description, jsonld }) +
    nav(lang, key, "") +
    `
<main id="conteudo">
  <section class="page-hero">
    <div class="grid-bg"></div>
    <div class="wrap">
      ${crumbs(lang, trail)}
      <div class="eyebrow"><span class="dot" style="--dot-color:#3B82F6"></span>${ui.eyebrow}</div>
      <h1 class="display">${c.h1}</h1>
      <p class="lead muted">${c.lead}</p>
      <div class="case-stats" aria-label="${ui.statsEyebrow}">
        ${c.stats.map(([n, l]) => `<div class="card case-stat"><div class="display case-num">${n}</div><p class="muted">${l}</p></div>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow"><span class="dot" style="--dot-color:#10B981"></span>${ui.qaEyebrow}</div>
        <h2 class="display">${ui.qaTitle}</h2>
        <p class="muted case-visit"><a href="${clientUrl}" target="_blank" rel="noopener noreferrer" class="ul-link">${ui.visit} ${c.name} →</a></p>
      </div>
      <div class="case-qa">
        ${c.qa.map((f) => `<div>
          <h3>${esc(f.q)}</h3>
          <p class="muted">${esc(f.a)}</p>
        </div>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="page-section page-section-alt">
    <div class="wrap">
      <div class="stack">
        <div class="mono muted">${p.ui.service.stack}</div>
        <ul>
          ${c.stack.map((b) => `<li class="chip">${b}</li>`).join("\n          ")}
        </ul>
      </div>
    </div>
  </section>

  ${relatedSection(lang, c.related)}
  ${ctaSection(lang, ui.cta)}
</main>
` +
    footer(lang)
  );
}

function servicesHub(lang) {
  const p = PAGES[lang];
  const hub = p.hub;
  const path = route("services", lang);
  const svcs = servicesFor(lang);
  const trail = [[route("home", lang), p.ui.crumbHome], [path, p.ui.nav.services]];
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: hub.itemList,
        itemListElement: svcs.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: SITE + s.path })),
      },
      breadcrumbLd(trail),
    ],
  };
  return (
    head({ lang, key: "services", title: hub.title, description: hub.description, jsonld }) +
    nav(lang, "services", path) +
    `
<main id="conteudo">
  <section class="page-hero">
    <div class="grid-bg"></div>
    <div class="wrap">
      ${crumbs(lang, trail)}
      <div class="eyebrow"><span class="dot" style="--dot-color:#8B5CF6"></span>${hub.eyebrow}</div>
      <h1 class="display">${hub.h1}</h1>
      <p class="lead muted">${hub.lead}</p>
    </div>
  </section>

  <section class="page-section">
    <div class="wrap">
      <div class="related-grid related-grid-2">
        ${svcs.map((s) => `<a class="card related-card" href="${s.path}">
          <span class="mono muted">// ${s.code}</span>
          <h2>${s.name}</h2>
          <p class="muted">${s.lead}</p>
          <ul class="mini-list mono">
            ${s.stack.slice(0, 4).map((b) => `<li>› ${b}</li>`).join("\n            ")}
          </ul>
          <span class="related-more mono">${p.ui.related.more}</span>
        </a>`).join("\n        ")}
      </div>
    </div>
  </section>

  ${processSection(lang)}
  ${ctaSection(lang, hub.cta)}
</main>
` +
    footer(lang)
  );
}

function transformationPage(lang) {
  const p = PAGES[lang];
  const t = p.transformation;
  const path = route("transformation", lang);
  const all = Object.fromEntries(servicesFor(lang).map((s) => [s.slug, s]));
  const trail = [[route("home", lang), p.ui.crumbHome], [path, p.ui.nav.transformation]];
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}${path}#webpage`,
        url: SITE + path,
        name: t.title,
        description: t.description,
        inLanguage: LANG_META[lang].html,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#organization` },
      },
      breadcrumbLd(trail),
    ],
  };
  return (
    head({ lang, key: "transformation", title: t.title, description: t.description, jsonld }) +
    nav(lang, "transformation", path) +
    `
<main id="conteudo">
  <section class="page-hero">
    <div class="grid-bg"></div>
    <div class="wrap">
      ${crumbs(lang, trail)}
      <div class="eyebrow"><span class="dot" style="--dot-color:#F59E0B"></span>${t.eyebrow}</div>
      <h1 class="display">${t.h1}</h1>
      <p class="lead muted">${t.lead}</p>
    </div>
  </section>

  <section class="transformation-section section-dark">
    <div class="grid-bg"></div>
    <div class="wrap transformation-wrap">
      <div class="transformation-heading">
        <div>
          <div class="eyebrow"><span class="dot" style="--dot-color:#F59E0B"></span>${t.flowEyebrow}</div>
          <h2 class="display">${t.flowTitle}</h2>
        </div>
        <p>${t.flowSub}</p>
      </div>
      <div class="transformation-stage">
        <div class="transformation-panel transformation-before">
          <div class="transformation-kicker mono">${t.beforeKicker}</div>
          <h3 class="display">${t.beforeTitle}</h3>
          <ul class="fragment-timeline">
            ${t.symptoms.map((x, i) => `<li class="fragment-step"><span class="fragment-index mono">0${i + 1}</span><span class="fragment-node">${glyph(SYMPTOM_GLYPHS[i])}</span><span>${x}</span></li>`).join("\n            ")}
          </ul>
          <div class="transformation-note mono">${t.beforeNote}</div>
        </div>
        <div class="transformation-bridge">
          <div class="bridge-lines" aria-hidden="true"><span></span></div>
          <div class="bridge-core">${glyph("ai")}<span class="mono">BYTE<br/>ENGINE</span></div>
          <div class="bridge-output-line" aria-hidden="true"></div>
          <div class="bridge-label mono">${t.bridge}</div>
        </div>
        <div class="transformation-panel transformation-after">
          <div class="transformation-kicker mono">${t.afterKicker}</div>
          <h3 class="display">${t.afterTitle}</h3>
          <div class="order-flow"><div class="order-line" aria-hidden="true"></div>
            <ul class="benefit-list">
              ${t.benefits.map((x, i) => `<li class="benefit-step"><span class="benefit-node">${glyph(BENEFIT_GLYPHS[i])}</span><span>${x}</span><span class="benefit-check" aria-hidden="true">OK</span></li>`).join("\n              ")}
            </ul>
          </div>
          <div class="transformation-note mono">${t.afterNote}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#10B981"></span>${t.practiceEyebrow}</div>
        <h2 class="display">${t.practiceTitle}</h2>
      </div>
      <div class="ba-list">
        ${t.areas.map((b) => {
          const s = all[b.slug];
          return `<article class="ba-row">
          <h3>${b.area}</h3>
          <div class="ba-col">
            <div class="mono ba-tag ba-tag-before">${t.before}</div>
            <p>${b.before}</p>
          </div>
          <div class="ba-col">
            <div class="mono ba-tag ba-tag-after">${t.after}</div>
            <p>${b.after}</p>
            <a class="ul-link mono ba-link" href="${s.path}">${s.name} →</a>
          </div>
        </article>`;
        }).join("\n        ")}
      </div>
    </div>
  </section>

  ${processSection(lang)}
  ${ctaSection(lang, t.cta)}
</main>
` +
    footer(lang)
  );
}

function notFoundPage(lang) {
  const nf = PAGES[lang].notFound;
  // Na 404 o ícone da marca aparece "perdido": sai do lugar, olha em volta e pergunta.
  const lostMark = `<span class="glyph glyph-lost" aria-hidden="true">
        <svg class="nf-mark" viewBox="0 0 28 28"><path fill="currentColor" d="M0 4h4V0h20v4h4v20h-4v4H4v-4H0z"/><g class="nf-mark-eyes"><rect x="9" y="11" width="3" height="6" fill="var(--bg)"/><rect x="16" y="11" width="3" height="6" fill="var(--bg)"/></g></svg>
        <span class="nf-q">?</span>
      </span>`;
  // Na 404 o seletor de idioma leva para a home de cada idioma.
  const navHtml = nav(lang, "home", "").replace(/<span class="glyph">[\s\S]*?<\/picture>\s*<\/span>/, lostMark);
  const byte = (n) => `<div class="nf-byte nf-b${n}" aria-hidden="true"><i></i><i></i></div>`;
  return (
    head({ lang, title: nf.title, description: nf.description, noindex: true }) +
    navHtml +
    `
<main id="conteudo">
  <section class="nf">
    <div class="wrap">
      <div class="nf-card" id="nf-card">
        <canvas class="nf-dither" id="nf-dither" aria-hidden="true"></canvas>
        ${[1, 2, 3, 5, 4].map(byte).join("\n        ")}
        <div class="nf-copy">
          <div class="eyebrow mono"><span class="dot pulse-live"></span>${nf.eyebrow}</div>
          <h1 class="display"><span class="nf-code">NOT_FOUND</span>${nf.h1}</h1>
          <p class="lead">${nf.lead}</p>
          <div class="cta-actions">
            <a href="${route("home", lang)}" class="btn btn-accent">${nf.home}</a>
            <a href="${route("services", lang)}" class="btn btn-ghost">${nf.services}</a>
          </div>
          <div class="nf-trace" role="note">
            <span class="nf-dim">$</span> curl -I <b id="nf-path">${nf.samplePath}</b><br>
            <span>HTTP/2 404</span> <span class="nf-dim">${nf.route}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
<script src="/404.js" defer></script>
` +
    footer(lang)
  );
}

/* ------------------------------------------------------------------ */
/* Saída                                                               */
/* ------------------------------------------------------------------ */

// Caminho de URL -> arquivo (index.html dentro da pasta).
const fileFor = (path) => (path === "/" ? "index.html" : `${path.slice(1)}/index.html`);

const out = {};
for (const lang of LANGS) {
  const prefix = LANG_META[lang].prefix.slice(1); // "", "en", "es"
  out[fileFor(route("home", lang))] = homePage(lang);
  out[fileFor(route("transformation", lang))] = transformationPage(lang);
  out[fileFor(route("services", lang))] = servicesHub(lang);
  out[prefix ? `${prefix}/404.html` : "404.html"] = notFoundPage(lang);
  for (const s of servicesFor(lang)) out[fileFor(s.path)] = servicePage(lang, s);
  for (const slug of CASE_SLUGS) out[fileFor(route(`case:${slug}`, lang))] = casePage(lang, slug);
}

for (const [file, html] of Object.entries(out)) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log("✓", file);
}

// Sitemap com todas as páginas nos três idiomas, cada uma com suas alternativas (hreflang).
const today = new Date().toISOString().slice(0, 10);
const keys = ["home", "services", ...SERVICE_ORDER.map((s) => `svc:${s.slug}`), "transformation", ...CASE_SLUGS.map((x) => `case:${x}`)];
const entries = [];
for (const lang of LANGS) {
  for (const key of keys) {
    const alts = [
      ...LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${LANG_META[l].hreflang}" href="${abs(ROUTES[key][l])}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(ROUTES[key].pt)}"/>`,
    ].join("\n");
    entries.push(`  <url>\n    <loc>${abs(ROUTES[key][lang])}</loc>\n    <lastmod>${today}</lastmod>\n${alts}\n  </url>`);
  }
}
writeFileSync(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`
);
console.log("✓ sitemap.xml");

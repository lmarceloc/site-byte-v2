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
import { LANGS, LANG_META, ROUTES, FLAGS, SWITCH_LABEL, route, svcRoute, langsFor } from "./i18n/routes.mjs";
import { PAGES, SERVICE_ORDER } from "./i18n/pages.mjs";
import { USE_CASES, USE_CASE_ORDER } from "./i18n/use-cases.mjs";
import { CALC, CALC_CONFIG } from "./i18n/calculator.mjs";
import { BLING, BLING_CHANNELS } from "./i18n/bling.mjs";
import { PBI } from "./i18n/powerbi-logistica.mjs";
import { IA_PME } from "./i18n/blog-ia-pme.mjs";

const SITE = "https://agenciabyte.com";
const BRAND = "Agência Byte";
const OG_IMAGE = `${SITE}/img/og-image.png`;
const WHATSAPP = "https://wa.me/5542984224363";
const EMAIL = "hello@agenciabyte.com";
const INSTAGRAM = "https://www.instagram.com/agenciabyte.ia";
const LINKEDIN = "https://www.linkedin.com/company/byte-agencia";
// Clientes citados na home (mesma lista de CLIENT_LOGOS em app-2.jsx).
const CASE_SLUGS = ["divina-argila", "cargon"]; // casos de clientes com página própria (/clientes/<slug>)
// Serviço → caso cuja frase do cliente aparece na página do serviço.
const SERVICE_CASE = { "integracao-de-sistemas": "divina-argila", "dados-e-power-bi": "cargon" };
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
const abs = (path) => (/^https?:/.test(path) ? path : SITE + (path === "/" ? "/" : path));

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
// PostHog (analytics de produto): carregado pelo proxy /rb (worker.js) para não
// ser bloqueado por ad blocker. Só roda no domínio de produção (?ph=debug força).
// Antes do consentimento (aviso de cookies em /byte.js) usa persistence "memory":
// conta visitas e cliques sem gravar cookie nem localStorage. Depois de "Aceitar",
// passa a gravar cookie para reconhecer quem volta.
const POSTHOG_TOKEN = "phc_ox6NgnfM8qYQVLiWC2TTXsB8GU7X5E5xUvVefJdcbt3p";
const POSTHOG = `<script>
  (function(){
    if (!/(^|\\.)agenciabyte\\.com$/.test(location.hostname) && !/[?&]ph=debug/.test(location.search)) return;
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    var consent = null;
    try { consent = localStorage.getItem('byte_consent'); } catch (e) {}
    posthog.init('${POSTHOG_TOKEN}', {
      api_host: location.origin + '/rb',
      ui_host: 'https://us.posthog.com',
      defaults: '2026-08-30',
      person_profiles: 'identified_only',
      persistence: consent === 'yes' ? 'localStorage+cookie' : 'memory',
      capture_dead_clicks: true
    });
    posthog.register({ site_language: document.documentElement.lang });
  })();
</script>
<script src="/byte.js" defer></script>`;

const ANALYTICS = POSTHOG + `
<script>
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Elms+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" media="print" onload="this.media='all'" />
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Elms+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" /></noscript>`;

// <link rel="alternate" hreflang> para as versões da mesma página nos três idiomas.
function hreflangLinks(key) {
  const r = ROUTES[key];
  return [
    ...langsFor(key).map((l) => `<link rel="alternate" hreflang="${LANG_META[l].hreflang}" href="${abs(r[l])}" />`),
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
${langsFor(key).filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${LANG_META[l].og}" />`).join("\n")}
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
    return `<li><a href="${ROUTES[key][l] || route("home", l)}" hreflang="${LANG_META[l].hreflang}" lang="${LANG_META[l].html}"${cur}><span class="lang-flag">${FLAGS[l]}</span>${LANG_META[l].name}</a></li>`;
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
  const blog = '<a href="https://agenciabyte.com/blog" class="nav-pill-link blog-link" target="_blank" rel="noopener noreferrer">Blog</a>';
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
      <span>Agência Byte</span>
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
    <a href="https://agenciabyte.com/blog" class="ul-link blog-link" target="_blank" rel="noopener noreferrer">Blog</a>
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
        <div class="brand">Agência Byte</div>
        <p class="muted footer-tagline">${u.footer.tagline}</p>
      </div>
      ${col(u.footer.services, servicesFor(lang).map((s) => [s.path, s.nav]))}
      ${col(u.footer.company, [[anchor("sobre"), u.footer.about], [anchor("processo"), u.footer.process], [route("transformation", lang), u.footer.transformation], [route("calculator", lang), CALC[lang].nav], ...(USE_CASES[lang] ? [[route("usecases", lang), USE_CASES[lang].ui.nav]] : []), ["https://agenciabyte.com/blog", "Blog"]])}
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
      <div class="muted mono footer-legal">${u.footer.legal}</div>
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

// Frase do cliente (citação com autoria): ajuda IAs a citarem a página.
function caseQuote(lang, slug, { link = false } = {}) {
  const ui = PAGES[lang].caseUi;
  const c = PAGES[lang].cases[slug];
  const who = link ? `<a href="${route(`case:${slug}`, lang)}">${c.name}</a>` : c.name;
  return `<figure class="case-quote">
        <blockquote><p>“${esc(c.quote)}”</p></blockquote>
        <figcaption>— <cite>${who}</cite>, ${ui.quoteBy}</figcaption>
      </figure>`;
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

// Resposta da pergunta frequente em HTML. Com f.link = { text, key }, o trecho
// "text" da resposta vira link para a rota "key" (os dados estruturados levam só o texto).
function faqAnswer(lang, f) {
  const html = esc(f.a);
  if (!f.link) return html;
  const t = esc(f.link.text);
  if (!html.includes(t)) throw new Error(`Link da FAQ não encontrado na resposta: ${f.link.text}`);
  return html.replace(t, `<a href="${route(f.link.key, lang)}" class="ul-link">${t}</a>`);
}

function faqSection(lang, faq, title = null) {
  const u = PAGES[lang].ui;
  return `<section class="page-section page-section-alt">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow"><span class="dot" style="--dot-color:#3B82F6"></span>${u.faq.eyebrow}</div>
        <h2 class="display">${title || u.faq.title}</h2>
      </div>
      <div class="faq">
        ${faq.map((f) => `<details>
          <summary>${esc(f.q)}</summary>
          <p class="muted">${faqAnswer(lang, f)}</p>
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
        <blockquote><p>“${esc(PAGES[lang].cases[slug].quote)}”</p></blockquote>
        <p>— ${PAGES[lang].cases[slug].name}, ${PAGES[lang].caseUi.quoteBy}</p>
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
    </section>${USE_CASES[lang] ? `
    <section>
      <h2><a href="${route("usecases", lang)}">${USE_CASES[lang].hub.h1}</a></h2>
${useCaseList(lang).map((u) => `      <article>
        <h3><a href="${u.path}">${u.name}</a></h3>
        <p>${u.card}</p>
      </article>`).join("\n")}
    </section>` : ""}
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
      <p>LinkedIn: <a href="${LINKEDIN}">Agência Byte</a></p>
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
      // Perguntas frequentes como dados estruturados (por enquanto só nas páginas em português).
      ...(lang === "pt" ? [{
        "@type": "FAQPage",
        "@id": `${SITE}${s.path}#faq`,
        mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }] : []),
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

  ${SERVICE_CASE[s.slug] ? `<section class="page-section">
    <div class="wrap">
      <div class="eyebrow"><span class="dot" style="--dot-color:#3B82F6"></span>${p.caseUi.quoteEyebrow}</div>
      ${caseQuote(lang, SERVICE_CASE[s.slug], { link: true })}
    </div>
  </section>
  ` : ""}${s.slug === "automacao-com-ia" && lang === "pt" ? `<section class="page-section">
    <div class="wrap">
      <a class="card related-card pbi-promo" href="${route("blog:ia-pme", lang)}">
        <span class="mono muted">// Guia</span>
        <h2>${IA_PME.h1}</h2>
        <p class="muted">${IA_PME.lead}</p>
        <span class="related-more mono">Ler o guia →</span>
      </a>
    </div>
  </section>
  ` : ""}${s.slug === "dados-e-power-bi" && lang === "pt" ? `<section class="page-section">
    <div class="wrap">
      <a class="card related-card pbi-promo" href="${route("pbi-logistica", "blog:ia-pme", lang)}">
        <span class="mono muted">// Guia por setor</span>
        <h2>${PBI.h1}</h2>
        <p class="muted">${PBI.lead}</p>
        <span class="related-more mono">Ver o guia →</span>
      </a>
    </div>
  </section>
  ` : ""}${s.slug === "integracao-de-sistemas" && lang === "pt" ? blingChannelCards(null, { parentLink: true }) + "\n  " : ""}${s.slug === "automacao-com-ia" && USE_CASES[lang] ? useCaseCards(lang, { heading: true, title: USE_CASES[lang].ui.svcTitle, eyebrow: USE_CASES[lang].ui.svcEyebrow, all: true }) : ""}${processSection(lang)}
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
        "@type": "Review",
        "@id": `${SITE}${path}#review`,
        reviewBody: c.quote,
        inLanguage: LANG_META[lang].html,
        author: { "@type": "Organization", name: c.name, url: clientUrl },
        itemReviewed: { "@id": `${SITE}/#organization` },
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
      ${caseQuote(lang, slug)}${slug === "cargon" && lang === "pt" ? `\n      <p class="case-visit"><a href="${route("pbi-logistica", lang)}" class="ul-link">Guia: Power BI para distribuidoras e transportadoras →</a></p>` : ""}${slug === "divina-argila" && lang === "pt" ? `
      <p class="case-visit"><a href="${route("bling", lang)}" class="ul-link">Guia: integração Bling com Mercado Livre e TikTok Shop →</a></p>` : ""}
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

/* ---------- Casos de uso de IA (/casos-de-uso) ---------- */

function useCaseList(lang) {
  return USE_CASE_ORDER.map((slug, i) => ({ slug, num: String(i + 1).padStart(2, "0"), ...USE_CASES[lang].items[slug], path: route(`uc:${slug}`, lang) }));
}

// Grade de cards dos casos de uso. Com heading, vira uma seção com título (h3 nos cards);
// sem heading, é a lista principal da página de entrada (h2 nos cards).
function useCaseCards(lang, { heading = false, exclude = null, title = null, eyebrow = null, all = false, tight = false } = {}) {
  const U = USE_CASES[lang];
  const list = useCaseList(lang).filter((u) => u.slug !== exclude);
  const h = heading ? `<div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#10B981"></span>${eyebrow || U.hub.eyebrow}</div>
        <h2 class="display">${title || U.hub.h1}</h2>
      </div>
      ` : "";
  const tag = heading ? "h3" : "h2";
  return `<section class="page-section${tight ? " uc-tight" : ""}">
    <div class="wrap">
      ${h}<div class="uc-grid">
        ${list.map((u) => `<a class="card related-card uc-card" href="${u.path}">
          <span class="mono muted">// ${u.num}</span>
          <${tag}>${u.name}</${tag}>
          <p class="muted">${u.card}</p>
          <span class="related-more mono">${U.ui.more}</span>
        </a>`).join("\n        ")}
      </div>
      ${all ? `<p class="uc-all"><a href="${route("usecases", lang)}" class="ul-link">${U.ui.svcAll}</a></p>` : ""}
    </div>
  </section>
  `;
}

function useCasesHub(lang) {
  const p = PAGES[lang];
  const U = USE_CASES[lang];
  const path = route("usecases", lang);
  const list = useCaseList(lang);
  const trail = [[route("home", lang), p.ui.crumbHome], [path, U.ui.nav]];
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}${path}#page`,
        name: U.hub.h1,
        description: U.hub.description,
        url: SITE + path,
        inLanguage: LANG_META[lang].html,
        publisher: { "@id": `${SITE}/#organization` },
        mainEntity: {
          "@type": "ItemList",
          name: U.hub.itemList,
          itemListElement: list.map((u, i) => ({ "@type": "ListItem", position: i + 1, name: u.name, url: SITE + u.path })),
        },
      },
      breadcrumbLd(trail),
    ],
  };
  return (
    head({ lang, key: "usecases", title: U.hub.title, description: U.hub.description, jsonld }) +
    nav(lang, "usecases", "") +
    `
<main id="conteudo">
  <section class="page-hero">
    <div class="grid-bg"></div>
    <div class="wrap">
      ${crumbs(lang, trail)}
      <div class="eyebrow"><span class="dot" style="--dot-color:#10B981"></span>${U.hub.eyebrow}</div>
      <h1 class="display">${U.hub.h1}</h1>
      <p class="lead muted">${U.hub.lead}</p>
    </div>
  </section>

  ${useCaseCards(lang, { tight: true })}
  <section class="page-section page-section-alt">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow"><span class="dot" style="--dot-color:#F59E0B"></span>${U.hub.choose.eyebrow}</div>
        <h2 class="display">${U.hub.choose.title}</h2>
      </div>
      <div>
        <p class="uc-scenario">${esc(U.hub.choose.intro)}</p>
        <ol class="case-qa uc-criteria">
          ${U.hub.choose.items.map((x, i) => `<li>
            <h3><span class="mono">0${i + 1}</span> ${esc(x.t)}</h3>
            <p class="muted">${esc(x.d)}</p>
          </li>`).join("\n          ")}
        </ol>
      </div>
    </div>
  </section>

  ${ctaSection(lang, U.hub.cta)}
</main>
` +
    footer(lang)
  );
}

function useCasePage(lang, slug) {
  const p = PAGES[lang];
  const U = USE_CASES[lang];
  const c = U.items[slug];
  const key = `uc:${slug}`;
  const path = route(key, lang);
  const svc = route("svc:automacao-com-ia", lang);
  const trail = [[route("home", lang), p.ui.crumbHome], [route("usecases", lang), U.ui.nav], [path, c.name]];
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE}${path}#service`,
        name: c.name,
        serviceType: p.services["automacao-com-ia"].name,
        description: c.description,
        url: SITE + path,
        inLanguage: LANG_META[lang].html,
        provider: { "@id": `${SITE}/#organization` },
        isRelatedTo: { "@id": `${SITE}${svc}#service` },
        areaServed: "BR",
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
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
      <div class="eyebrow"><span class="dot" style="--dot-color:#10B981"></span>${U.ui.eyebrow}</div>
      <h1 class="display">${c.h1}</h1>
      <p class="lead muted">${c.lead}</p>
      ${ctaButtons(lang)}
    </div>
  </section>

  <section class="page-section">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow"><span class="dot" style="--dot-color:#F59E0B"></span>${U.ui.scenarioEyebrow}</div>
        <h2 class="display">${U.ui.scenarioTitle}</h2>
      </div>
      <div>
        <p class="uc-scenario">${esc(c.scenario.text)}</p>
        <ol class="signal-list">
          ${c.scenario.pains.map((x, i) => `<li><span class="mono">0${i + 1}</span><span>${esc(x)}</span></li>`).join("\n          ")}
        </ol>
      </div>
    </div>
  </section>

  <section class="page-section page-section-alt">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#10B981"></span>${U.ui.flowEyebrow}</div>
        <h2 class="display">${U.ui.flowTitle}</h2>
      </div>
      <ol class="uc-flow" aria-label="${U.ui.flowLabel}">
        ${c.flow.map((f, i) => `<li class="card uc-step">
          <span class="uc-step-num mono">${String(i + 1).padStart(2, "0")}</span>
          <h3>${esc(f.t)}</h3>
          <p class="muted">${esc(f.d)}</p>
        </li>`).join("\n        ")}
      </ol>
    </div>
  </section>

  <section class="page-section">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#8B5CF6"></span>${U.ui.proposalEyebrow}</div>
        <h2 class="display">${U.ui.proposalTitle}</h2>
      </div>
      <div class="uc-proposal">
        <div>
          <h3>${U.ui.deliverables}</h3>
          <ul class="uc-check">
            ${c.proposal.deliverables.map((d) => `<li>${esc(d)}</li>`).join("\n            ")}
          </ul>
          <div class="stack">
            <div class="mono muted">${U.ui.systems}</div>
            <ul>
              ${c.proposal.systems.map((b) => `<li class="chip">${esc(b)}</li>`).join("\n              ")}
            </ul>
          </div>
        </div>
        <div>
          <h3>${U.ui.stages}</h3>
          <ol class="uc-stages">
            ${c.proposal.stages.map((st) => `<li>
              <div><strong>${esc(st.t)}</strong><p class="muted">${esc(st.d)}</p></div>
              <span class="mono">${esc(st.dur)}</span>
            </li>`).join("\n            ")}
          </ol>
          <div class="card uc-deadline">
            <div class="mono muted">${U.ui.deadline}</div>
            <div class="display uc-deadline-num">${esc(c.proposal.deadline)}</div>
            <p class="muted">${U.ui.deadlineNote}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${c.proof ? `<section class="page-section">
    <div class="wrap">
      <div class="eyebrow"><span class="dot" style="--dot-color:#3B82F6"></span>${U.ui.proofEyebrow}</div>
      <p class="uc-proof">${esc(c.proof.text)}</p>
      ${caseQuote(lang, c.proof.slug, { link: true })}
    </div>
  </section>
  ` : ""}<section class="page-section page-section-alt">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow"><span class="dot" style="--dot-color:#3B82F6"></span>${p.ui.faq.eyebrow}</div>
        <h2 class="display">${U.ui.faqTitle}</h2>
      </div>
      <div class="faq">
        ${c.faq.map((f) => `<details>
          <summary>${esc(f.q)}</summary>
          <p class="muted">${esc(f.a)}</p>
        </details>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="section-dark cta-band">
    <div class="wrap">
      <h2 class="display">${U.ui.cta}</h2>
      <p>${p.ui.cta.text}</p>
      ${ctaButtons(lang)}
      <p class="uc-svc-link"><a href="${svc}" class="ul-link">${U.ui.serviceLink}</a></p>
    </div>
  </section>

  ${useCaseCards(lang, { heading: true, exclude: slug, title: U.ui.otherTitle, eyebrow: U.ui.otherEyebrow })}
</main>
` +
    footer(lang)
  );
}

function calculatorPage(lang) {
  const p = PAGES[lang];
  const C = CALC[lang];
  const path = route("calculator", lang);
  const trail = [[route("home", lang), p.ui.crumbHome], [path, C.nav]];
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: C.eyebrow,
        description: C.description,
        url: SITE + path,
        inLanguage: LANG_META[lang].html,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
        provider: { "@type": "Organization", name: BRAND, url: SITE },
      },
      breadcrumbLd(trail),
    ],
  };
  // Dados que o calc.js usa no navegador (textos do idioma + premissas e preços).
  const data = {
    lang: LANG_META[lang].html,
    whatsapp: WHATSAPP,
    cfg: CALC_CONFIG,
    t: C,
    useCases: Object.fromEntries(CALC_CONFIG.bottlenecks.map((b) => [b.id, route(`uc:${b.useCase}`, lang)])),
  };
  const d = CALC_CONFIG.defaults;
  const field = (id, [label, hint], attrs) => `<div class="calc-field">
            <div class="calc-field-head"><label for="calc-${id}">${label}<small>${hint}</small></label><output class="calc-val mono" id="calc-${id}-v" for="calc-${id}"></output></div>
            <input id="calc-${id}" type="range" ${attrs} />
          </div>`;
  return (
    head({ lang, key: "calculator", title: C.title, description: C.description, jsonld }) +
    nav(lang, "calculator", path) +
    `
<main id="conteudo">
  <section class="page-hero calc-hero">
    <div class="grid-bg"></div>
    <div class="wrap">
      ${crumbs(lang, trail)}
      <div class="eyebrow"><span class="dot"></span>${C.eyebrow}</div>
      <h1 class="display">${C.h1}</h1>
      <p class="lead muted">${C.lead}</p>
    </div>
  </section>

  <section class="page-section calc-section" id="calculadora">
    <div class="wrap calc">
      <form class="calc-panel" onsubmit="return false">
        <div class="calc-row">
          <div class="mono calc-label">${C.bottleneck}</div>
          <div class="calc-chips" id="calc-area" role="group" aria-label="${esc(C.bottleneck)}">
            ${CALC_CONFIG.bottlenecks.map((b, i) => `<button type="button" class="calc-chip" data-i="${i}" aria-pressed="${i === 0}">${C.names[b.id]}</button>`).join("\n            ")}
          </div>
          <a class="calc-case mono" id="calc-case" href="${data.useCases[CALC_CONFIG.bottlenecks[0].id]}"></a>
        </div>
        <div class="calc-row calc-pair">
          ${field("p", C.people, `min="1" max="30" value="${d.people}"`)}
          ${field("h", C.hours, `min="1" max="40" value="${d.hours}"`)}
        </div>
        <div class="calc-row">
          ${field("c", C.rate, `min="15" max="200" step="5" value="${d.rate}"`)}
        </div>
        <div class="calc-row calc-pair">
          ${field("e", C.rework, `min="0" max="200" step="5" value="${d.rework}"`)}
          ${field("m", C.fixMin, `min="5" max="240" step="5" value="${d.fixMin}"`)}
        </div>
        <div class="calc-row calc-premise">
          ${field("a", [`${C.auto[0]}<span class="calc-ptag mono">${C.premise}</span>`, `<span id="calc-a-hint"></span>`], `min="10" max="90" step="5" value="${Math.round(CALC_CONFIG.bottlenecks[0].auto * 100)}"`)}
        </div>
      </form>

      <aside class="calc-result" aria-live="polite">
        <div class="calc-block">
          <div class="calc-k mono">${C.costNow}</div>
          <div class="calc-n1" id="calc-cost-y"></div>
          <div class="calc-sub" id="calc-cost-sub"></div>
        </div>
        <div class="calc-block">
          <div class="calc-k mono" id="calc-addr-k"></div>
          <div class="calc-n2" id="calc-addr-y"></div>
          <div class="calc-sub" id="calc-addr-sub"></div>
        </div>
        <div class="calc-block">
          <div class="calc-k mono">${C.math}</div>
          <div class="calc-math mono" id="calc-math"></div>
        </div>
        <a class="btn btn-accent calc-cta" id="calc-cta" href="${WHATSAPP}" target="_blank" rel="noopener noreferrer">${C.cta}</a>
        <p class="calc-note">${C.note}</p>
      </aside>
    </div>
  </section>

  ${useCaseCards(lang, { heading: true })}
</main>
<script id="calc-data" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
<script src="/calc.js" defer></script>
` +
    footer(lang)
  );
}

/* ------------------------------------------------------------------ */
/* Integração Bling com marketplaces (só pt)                           */
/* ------------------------------------------------------------------ */

const blingFaqLd = (path, faq) => ({
  "@type": "FAQPage",
  "@id": `${SITE}${path}#faq`,
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

const blingServiceLd = (path, name, description) => ({
  "@type": "Service",
  "@id": `${SITE}${path}#service`,
  name,
  serviceType: "Integração de sistemas",
  description,
  url: SITE + path,
  inLanguage: "pt-BR",
  provider: { "@id": `${SITE}/#organization` },
  areaServed: "BR",
});

function blingTldr(text) {
  const B = BLING.ui;
  return `<aside class="bling-tldr" aria-label="${B.tldr}">
        <div class="mono bling-tldr-k">${B.tldr}</div>
        <p>${esc(text)}</p>
      </aside>`;
}

function blingCase(lang) {
  const B = BLING.ui;
  const c = PAGES[lang].cases["divina-argila"];
  return `<section class="page-section">
    <div class="wrap">
      <div class="eyebrow"><span class="dot" style="--dot-color:#3B82F6"></span>${B.caseEyebrow}</div>
      <h2 class="display">${c.h1}</h2>
      <div class="case-stats bling-stats">
        ${c.stats.map(([n, t]) => `<div class="card case-stat"><div class="display case-num">${n}</div><p class="muted">${t}</p></div>`).join("\n        ")}
      </div>
      ${caseQuote(lang, "divina-argila", { link: true })}
      <p class="case-visit"><a href="${route("case:divina-argila", lang)}" class="ul-link">${B.caseLink}</a></p>
    </div>
  </section>`;
}

function blingChannelCards(exclude = null, { parentLink = !!exclude } = {}) {
  const B = BLING.ui;
  return `<section class="page-section page-section-alt">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#10B981"></span>${B.channelsEyebrow}</div>
        <h2 class="display">${B.channelsTitle}</h2>
      </div>
      <div class="uc-grid">
        ${BLING_CHANNELS.filter((x) => x !== exclude).map((slug) => {
          const ch = BLING.channels[slug];
          return `<a class="card related-card uc-card" href="${route(`bling:${slug}`, "pt")}">
          <span class="mono muted">// Bling + ${ch.name}</span>
          <h3>Integração Bling com ${ch.name}</h3>
          <p class="muted">${ch.card}</p>
          <span class="related-more mono">${B.more}</span>
        </a>`;
        }).join("\n        ")}
      </div>
      ${parentLink ? `<p class="uc-all"><a href="${route("bling", "pt")}" class="ul-link">${B.parent}</a></p>` : ""}
    </div>
  </section>`;
}

function blingHub() {
  const lang = "pt";
  const p = PAGES[lang];
  const B = BLING.ui;
  const H = BLING.hub;
  const path = route("bling", lang);
  const trail = [[route("home", lang), p.ui.crumbHome], [route("services", lang), p.ui.nav.services], [path, B.crumb]];
  const jsonld = { "@context": "https://schema.org", "@graph": [blingServiceLd(path, B.crumb, H.description), blingFaqLd(path, H.faq), breadcrumbLd(trail)] };
  const native = H.sections[0];
  return (
    head({ lang, key: "bling", title: H.title, description: H.description, jsonld }) +
    nav(lang, "bling", route("services", lang)) +
    `
<main id="conteudo">
  <section class="page-hero bling-hero">
    <div class="grid-bg"></div>
    <div class="wrap">
      ${crumbs(lang, trail)}
      <div class="eyebrow"><span class="dot"></span>${B.eyebrow}</div>
      <h1 class="display">${H.h1}</h1>
      <p class="lead muted">${H.lead}</p>
      ${blingTldr(H.tldr)}
      ${ctaButtons(lang)}
    </div>
  </section>

  <section class="page-section" id="${native.id}">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow"><span class="dot" style="--dot-color:#10B981"></span>${native.eyebrow}</div>
        <h2 class="display">${native.h2}</h2>
      </div>
      <div class="bling-prose">
        <p>${native.intro}</p>
        <ul class="bling-check">
          ${native.list.map((x) => `<li>${x}</li>`).join("\n          ")}
        </ul>
        <p>${native.outro}</p>
      </div>
    </div>
  </section>

  <section class="page-section page-section-alt" id="limites">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#F59E0B"></span>${H.limitsEyebrow}</div>
        <h2 class="display">${H.limitsH2}</h2>
        <p class="muted bling-intro">${H.limitsIntro}</p>
      </div>
      <ol class="bling-limits">
        ${H.limits.map((l, i) => `<li class="card bling-limit" id="${l.id}">
          <div class="bling-limit-head"><span class="mono bling-n">0${i + 1}</span><h3>${l.h3}</h3></div>
          <dl>
            <div><dt class="mono">${B.native}</dt><dd>${l.native}</dd></div>
            <div><dt class="mono">${B.limit}</dt><dd>${l.limit}</dd></div>
            <div class="bling-api"><dt class="mono">${B.api}</dt><dd>${l.api}</dd></div>
          </dl>
        </li>`).join("\n        ")}
      </ol>
    </div>
  </section>

  <section class="page-section" id="quando-compensa">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow"><span class="dot" style="--dot-color:#8B5CF6"></span>${H.when.eyebrow}</div>
        <h2 class="display">${H.when.h2}</h2>
      </div>
      <div class="bling-prose">
        <p>${H.when.intro}</p>
        <ol class="signal-list">
          ${H.when.yes.map((x, i) => `<li><span class="mono">0${i + 1}</span><span>${x}</span></li>`).join("\n          ")}
        </ol>
        <h3>${H.when.noTitle}</h3>
        <p>${H.when.no}</p>
        <p><a href="${route("calculator", lang)}" class="ul-link">${H.when.calc}</a></p>
      </div>
    </div>
  </section>

  ${blingCase(lang)}

  <section class="page-section page-section-alt" id="prazo">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#EC4899"></span>${H.time.eyebrow}</div>
        <h2 class="display">${H.time.h2}</h2>
        <p class="muted bling-intro">${H.time.intro}</p>
      </div>
      <ol class="steps bling-steps">
        ${H.time.steps.map((st, i) => `<li class="card">
          <div class="display step-code">0${i + 1}</div>
          <h3>${st.t}</h3>
          <p class="muted">${st.d}</p>
          <div class="mono step-dur">${st.dur}</div>
        </li>`).join("\n        ")}
      </ol>
    </div>
  </section>

  ${blingChannelCards()}
  ${faqSection(lang, H.faq, "Perguntas frequentes")}
  ${relatedSection(lang, ["integracao-de-sistemas", "automacao-com-ia"])}
  ${ctaSection(lang, B.cta)}
</main>
` +
    footer(lang)
  );
}

function blingChannelPage(slug) {
  const lang = "pt";
  const p = PAGES[lang];
  const B = BLING.ui;
  const ch = BLING.channels[slug];
  const key = `bling:${slug}`;
  const path = route(key, lang);
  const trail = [[route("home", lang), p.ui.crumbHome], [route("services", lang), p.ui.nav.services], [route("bling", lang), B.crumb], [path, ch.name]];
  const jsonld = { "@context": "https://schema.org", "@graph": [blingServiceLd(path, `Integração Bling com ${ch.name}`, ch.description), blingFaqLd(path, ch.faq), breadcrumbLd(trail)] };
  return (
    head({ lang, key, title: ch.title, description: ch.description, jsonld }) +
    nav(lang, key, route("services", lang)) +
    `
<main id="conteudo">
  <section class="page-hero bling-hero">
    <div class="grid-bg"></div>
    <div class="wrap">
      ${crumbs(lang, trail)}
      <div class="eyebrow"><span class="dot"></span>${B.eyebrow} · ${ch.name}</div>
      <h1 class="display">${ch.h1}</h1>
      <p class="lead muted">${ch.lead}</p>
      ${blingTldr(ch.tldr)}
      ${ctaButtons(lang)}
    </div>
  </section>

  <section class="page-section">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow"><span class="dot" style="--dot-color:#10B981"></span>${B.native}</div>
        <h2 class="display">O que o Bling já faz com o ${ch.name}</h2>
      </div>
      <div class="bling-prose">
        <ul class="bling-check">
          ${ch.native.map((x) => `<li>${x}</li>`).join("\n          ")}
        </ul>
        <p>Para a maioria das lojas, isso basta. Os pontos abaixo são onde a integração nativa para.</p>
      </div>
    </div>
  </section>

  <section class="page-section page-section-alt">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#F59E0B"></span>${B.limit}</div>
        <h2 class="display">Quando Bling e ${ch.name} precisam de integração via API</h2>
      </div>
      <div class="deliv-grid">
        ${ch.limits.map((l) => `<div class="card">
          <h3>${l.h3}</h3>
          <p class="muted">${l.p}</p>
        </div>`).join("\n        ")}
      </div>
      <p class="uc-all"><a href="${route("bling", lang)}#limites" class="ul-link">Os 5 limites nativos do Bling, em detalhe →</a></p>
    </div>
  </section>

  ${blingCase(lang)}
  ${faqSection(lang, ch.faq, `Perguntas sobre Bling e ${ch.name}`)}
  ${blingChannelCards(slug)}
  ${ctaSection(lang, B.cta)}
</main>
` +
    footer(lang)
  );
}

/* ------------------------------------------------------------------ */
/* Power BI para distribuidoras e transportadoras (só pt)              */
/* ------------------------------------------------------------------ */

function cargonCase(lang, { eyebrow, link }) {
  const c = PAGES[lang].cases.cargon;
  return `<section class="page-section">
    <div class="wrap">
      <div class="eyebrow"><span class="dot" style="--dot-color:#3B82F6"></span>${eyebrow}</div>
      <h2 class="display">${c.h1}</h2>
      <p class="muted bling-intro">${c.summary}</p>
      <div class="case-stats bling-stats">
        ${c.stats.map(([n, t]) => `<div class="card case-stat"><div class="display case-num">${n}</div><p class="muted">${t}</p></div>`).join("\n        ")}
      </div>
      ${caseQuote(lang, "cargon", { link: true })}
      <p class="case-visit"><a href="${route("case:cargon", lang)}" class="ul-link">${link}</a></p>
    </div>
  </section>`;
}

function powerbiLogisticsPage() {
  const lang = "pt";
  const p = PAGES[lang];
  const P = PBI;
  const key = "pbi-logistica";
  const path = route(key, lang);
  const trail = [[route("home", lang), p.ui.crumbHome], [route("services", lang), p.ui.nav.services], [svcRoute("dados-e-power-bi", lang), p.services["dados-e-power-bi"].nav], [path, P.crumb]];
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE}${path}#service`,
        name: P.crumb,
        serviceType: "Business Intelligence",
        description: P.description,
        url: SITE + path,
        inLanguage: "pt-BR",
        provider: { "@id": `${SITE}/#organization` },
        areaServed: "BR",
      },
      blingFaqLd(path, P.faq),
      breadcrumbLd(trail),
    ],
  };
  const L = P.indicators.labels;
  let n = 0;
  return (
    head({ lang, key, title: P.title, description: P.description, jsonld }) +
    nav(lang, key, route("services", lang)) +
    `
<main id="conteudo">
  <section class="page-hero bling-hero">
    <div class="grid-bg"></div>
    <div class="wrap">
      ${crumbs(lang, trail)}
      <div class="eyebrow"><span class="dot" style="--dot-color:#F59E0B"></span>${P.eyebrow}</div>
      <h1 class="display">${P.h1}</h1>
      <p class="lead muted">${P.lead}</p>
      <aside class="bling-tldr" aria-label="${P.tldrLabel}">
        <div class="mono bling-tldr-k">${P.tldrLabel}</div>
        <p>${esc(P.tldr)}</p>
      </aside>
      ${ctaButtons(lang)}
    </div>
  </section>

  <section class="page-section" id="para-quem">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#10B981"></span>${P.audience.eyebrow}</div>
        <h2 class="display">${P.audience.h2}</h2>
        <p class="muted bling-intro">${P.audience.intro}</p>
      </div>
      <div class="deliv-grid">
        ${P.audience.cards.map((c) => `<div class="card">
          <h3>${c.h3}</h3>
          <p class="muted">${c.p}</p>
          <ul class="bling-check pbi-check">
            ${c.items.map((x) => `<li>${x}</li>`).join("\n            ")}
          </ul>
        </div>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="page-section page-section-alt" id="fontes">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#8B5CF6"></span>${P.sources.eyebrow}</div>
        <h2 class="display">${P.sources.h2}</h2>
        <p class="muted bling-intro">${P.sources.intro}</p>
      </div>
      <div class="deliv-grid">
        ${P.sources.cards.map((c) => `<div class="card">
          <h3>${c.h3}</h3>
          <p class="muted">${c.p}</p>
        </div>`).join("\n        ")}
      </div>
      <div class="stack">
        <div class="mono muted">// da fonte ao painel</div>
        <ul>
          ${P.sources.stack.map((b) => `<li class="chip">${b}</li>`).join("\n          ")}
        </ul>
      </div>
    </div>
  </section>

  <section class="page-section" id="indicadores">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#F59E0B"></span>${P.indicators.eyebrow}</div>
        <h2 class="display">${P.indicators.h2}</h2>
        <p class="muted bling-intro">${P.indicators.intro}</p>
      </div>
      ${P.indicators.groups.map((g) => `<h3 class="pbi-group mono">${g.name}</h3>
      <ol class="pbi-kpis" start="${n + 1}">
        ${g.items.map((k) => `<li class="card pbi-kpi">
          <div class="pbi-kpi-head"><span class="mono bling-n">${String(++n).padStart(2, "0")}</span><h4>${k.n}</h4></div>
          <dl>
            <div><dt class="mono">${L.what}</dt><dd>${k.what}</dd></div>
            <div><dt class="mono">${L.from}</dt><dd>${k.from}</dd></div>
            <div class="bling-api"><dt class="mono">${L.decision}</dt><dd>${k.decision}</dd></div>
          </dl>
        </li>`).join("\n        ")}
      </ol>`).join("\n      ")}
    </div>
  </section>

  <section class="page-section page-section-alt" id="previsao">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow"><span class="dot" style="--dot-color:#EC4899"></span>${P.forecast.eyebrow}</div>
        <h2 class="display">${P.forecast.h2}</h2>
      </div>
      <div class="bling-prose">
        <p>${P.forecast.intro}</p>
        <h3>${P.forecast.yesTitle}</h3>
        <ul class="bling-check">
          ${P.forecast.yes.map((x) => `<li>${x}</li>`).join("\n          ")}
        </ul>
        <p>${P.forecast.examples}</p>
        <h3>${P.forecast.noTitle}</h3>
        <p>${P.forecast.no}</p>
      </div>
    </div>
  </section>

  ${cargonCase(lang, { eyebrow: P.caseEyebrow, link: P.caseLink })}

  <section class="page-section page-section-alt" id="prazo">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#EC4899"></span>${P.time.eyebrow}</div>
        <h2 class="display">${P.time.h2}</h2>
        <p class="muted bling-intro">${P.time.intro}</p>
      </div>
      <ol class="steps bling-steps">
        ${P.time.steps.map((st, i) => `<li class="card">
          <div class="display step-code">0${i + 1}</div>
          <h3>${st.t}</h3>
          <p class="muted">${st.d}</p>
          <div class="mono step-dur">${st.dur}</div>
        </li>`).join("\n        ")}
      </ol>
    </div>
  </section>

  ${faqSection(lang, P.faq, "Perguntas frequentes")}
  ${relatedSection(lang, ["dados-e-power-bi", "integracao-de-sistemas"])}
  ${ctaSection(lang, P.cta)}
</main>
` +
    footer(lang)
  );
}

/* ------------------------------------------------------------------ */
/* Post pilar: Automação com IA para PME (só pt)                       */
/* ------------------------------------------------------------------ */

function iaPmePost() {
  const lang = "pt";
  const p = PAGES[lang];
  const A = IA_PME;
  const U = USE_CASES[lang];
  const key = "blog:ia-pme";
  const path = route(key, lang);
  const trail = [[route("home", lang), p.ui.crumbHome], ["https://agenciabyte.com/blog", "Blog"], [path, A.crumb]];
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE}${path}#article`,
        headline: A.h1,
        description: A.description,
        url: SITE + path,
        inLanguage: "pt-BR",
        datePublished: A.published,
        dateModified: A.published,
        image: OG_IMAGE,
        author: { "@id": `${SITE}/#organization` },
        publisher: { "@id": `${SITE}/#organization` },
        mainEntityOfPage: SITE + path,
        about: ["Automação com IA", "Automação de processos", "PME"],
      },
      breadcrumbLd(trail),
    ],
  };
  const C = A.checklist;
  const dataJson = JSON.stringify({ results: C.results, score: C.score, wa: C.wa, whatsapp: WHATSAPP, total: C.items.length }).replace(/</g, "\\u003c");
  const fmtDate = new Date(A.published + "T12:00:00Z").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  return (
    head({ lang, key, title: A.title, description: A.description, jsonld, extraHead: `<meta property="article:published_time" content="${A.published}" />\n` }) +
    nav(lang, key, "") +
    `
<main id="conteudo">
  <article class="post">
  <section class="page-hero post-hero">
    <div class="grid-bg"></div>
    <div class="wrap">
      ${crumbs(lang, trail)}
      <div class="eyebrow"><span class="dot" style="--dot-color:#10B981"></span>${A.eyebrow}</div>
      <h1 class="display">${A.h1}</h1>
      <p class="lead muted">${A.lead}</p>
      <p class="mono post-meta">Agência Byte · <time datetime="${A.published}">${fmtDate}</time> · ${A.readTime}</p>
    </div>
  </section>

  <section class="page-section post-body" id="resposta-curta">
    <div class="wrap post-wrap">
      <h2 class="display">${A.short.h2}</h2>
      <div class="bling-tldr post-short"><p>${esc(A.short.text)}</p></div>
      <ul class="post-criteria">
        ${A.short.criteria.map(([t, d]) => `<li class="card"><b>${t}</b><span class="muted">${d}</span></li>`).join("\n        ")}
      </ul>
    </div>
  </section>

  <section class="page-section page-section-alt post-body" id="os-7">
    <div class="wrap post-wrap">
      <h2 class="display">${A.pays.h2}</h2>
      <p class="post-p">${A.pays.intro}</p>
      <ol class="post-items">
        ${A.pays.items.map((it, i) => `<li class="card post-item">
          <div class="post-item-head"><span class="mono bling-n" aria-hidden="true">0${i + 1}</span><h3>${it.h3}</h3></div>
          <p>${it.why}</p>
          <dl>
            <div><dt class="mono">${A.pays.labels.does}</dt><dd>${it.does}</dd></div>
            <div class="bling-api"><dt class="mono">${A.pays.labels.human}</dt><dd>${it.human}</dd></div>
          </dl>
          ${it.useCase ? `<a class="related-more mono" href="${route(`uc:${it.useCase}`, lang)}">${U.items[it.useCase].name}: ${A.pays.labels.link}</a>` : `<a class="related-more mono" href="${svcRoute("automacao-com-ia", lang)}">Automação com IA: ver o serviço →</a>`}
        </li>`).join("\n        ")}
      </ol>
    </div>
  </section>

  <section class="page-section post-body" id="os-3">
    <div class="wrap post-wrap">
      <h2 class="display">${A.skip.h2}</h2>
      <p class="post-p">${A.skip.intro}</p>
      ${A.skip.items.map((it) => `<h3 class="post-h3 post-no">${it.h3}</h3>
      <p class="post-p">${it.p}</p>`).join("\n      ")}
    </div>
  </section>

  <section class="page-section page-section-alt post-body" id="antes-de-automatizar">
    <div class="wrap post-wrap">
      <h2 class="display">${A.before.h2}</h2>
      <p class="post-p">${A.before.intro}</p>
      <ol class="steps post-steps">
        ${A.before.steps.map(([t, d], i) => `<li class="card">
          <div class="display step-code">0${i + 1}</div>
          <h3>${t}</h3>
          <p class="muted">${d}</p>
        </li>`).join("\n        ")}
      </ol>
      <p class="post-p">${A.before.outro}</p>
    </div>
  </section>

  <section class="page-section post-body" id="quanto-custa">
    <div class="wrap post-wrap">
      <h2 class="display">${A.cost.h2}</h2>
      <p class="post-p">${A.cost.p1}</p>
      <p class="post-p">${A.cost.p2}</p>
      <p class="post-p"><a href="${route("calculator", lang)}" class="ul-link">${A.cost.calc}</a></p>
      <p class="post-p">${A.cost.p3}</p>
    </div>
  </section>

  <section class="page-section page-section-alt post-body" id="checklist">
    <div class="wrap post-wrap">
      <h2 class="display">${C.h2}</h2>
      <p class="post-p">${C.intro}</p>
      <form class="card post-checklist" id="ck" onsubmit="return false">
        <ul>
          ${C.items.map((t, i) => `<li><label><input type="checkbox" name="ck${i}" /><span>${t}</span></label></li>`).join("\n          ")}
        </ul>
        <div class="post-ck-result" id="ck-result" aria-live="polite" hidden>
          <div class="mono post-ck-score" id="ck-score"></div>
          <div class="post-ck-title" id="ck-title"></div>
          <p class="muted" id="ck-text"></p>
          <a class="btn btn-accent" id="ck-cta" href="${WHATSAPP}" target="_blank" rel="noopener noreferrer">${C.cta}</a>
        </div>
      </form>
      <noscript><p class="post-p">${C.results.map((r) => `<b>${r.min}+ itens:</b> ${r.title}. ${r.text}`).join("<br>")}</p></noscript>
    </div>
  </section>
  </article>

  ${useCaseCards(lang, { heading: true, all: true })}
  ${ctaSection(lang, A.cta)}
</main>
<script id="ck-data" type="application/json">${dataJson}</script>
<script src="/checklist.js" defer></script>
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
  out[fileFor(route("calculator", lang))] = calculatorPage(lang);
  out[prefix ? `${prefix}/404.html` : "404.html"] = notFoundPage(lang);
  for (const s of servicesFor(lang)) out[fileFor(s.path)] = servicePage(lang, s);
  for (const slug of CASE_SLUGS) out[fileFor(route(`case:${slug}`, lang))] = casePage(lang, slug);
  if (lang === "pt") {
    out[fileFor(route("bling", lang))] = blingHub();
    for (const slug of BLING_CHANNELS) out[fileFor(route(`bling:${slug}`, lang))] = blingChannelPage(slug);
    out[fileFor(route("pbi-logistica", lang))] = powerbiLogisticsPage();
    out[fileFor(route("blog:ia-pme", lang))] = iaPmePost();
  }
  if (USE_CASES[lang]) {
    out[fileFor(route("usecases", lang))] = useCasesHub(lang);
    for (const slug of USE_CASE_ORDER) out[fileFor(route(`uc:${slug}`, lang))] = useCasePage(lang, slug);
  }
}

for (const [file, html] of Object.entries(out)) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log("✓", file);
}

// Sitemap com todas as páginas nos três idiomas, cada uma com suas alternativas (hreflang).
const today = new Date().toISOString().slice(0, 10);
const keys = ["home", "services", ...SERVICE_ORDER.map((s) => `svc:${s.slug}`), "transformation", "calculator", "bling", ...BLING_CHANNELS.map((x) => `bling:${x}`), "pbi-logistica", ...CASE_SLUGS.map((x) => `case:${x}`), "usecases", ...USE_CASE_ORDER.map((x) => `uc:${x}`)];
const entries = [];
for (const lang of LANGS) {
  for (const key of keys) {
    if (!ROUTES[key][lang]) continue;
    const alts = [
      ...langsFor(key).map((l) => `    <xhtml:link rel="alternate" hreflang="${LANG_META[l].hreflang}" href="${abs(ROUTES[key][l])}"/>`),
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

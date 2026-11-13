// Idiomas do site e o mapa de rotas equivalentes entre eles.
// Usado pelo bundle da home (app.js, via esbuild) e por build-pages.mjs.
// Português fica na raiz (URLs atuais não mudam); inglês em /en e espanhol em /es.

export const LANGS = ["pt", "en", "es"];
export const DEFAULT_LANG = "pt";

export const LANG_META = {
  pt: { html: "pt-BR", hreflang: "pt-BR", og: "pt_BR", name: "Português", short: "PT", prefix: "" },
  en: { html: "en", hreflang: "en", og: "en_US", name: "English", short: "EN", prefix: "/en" },
  es: { html: "es", hreflang: "es", og: "es_ES", name: "Español", short: "ES", prefix: "/es" },
};

// Chave lógica de cada página -> caminho em cada idioma.
export const ROUTES = {
  home: { pt: "/", en: "/en", es: "/es" },
  services: { pt: "/servicos", en: "/en/services", es: "/es/servicios" },
  "svc:desenvolvimento-de-software": {
    pt: "/servicos/desenvolvimento-de-software",
    en: "/en/services/custom-software-development",
    es: "/es/servicios/desarrollo-de-software",
  },
  "svc:automacao-com-ia": {
    pt: "/servicos/automacao-com-ia",
    en: "/en/services/ai-automation",
    es: "/es/servicios/automatizacion-con-ia",
  },
  "svc:integracao-de-sistemas": {
    pt: "/servicos/integracao-de-sistemas",
    en: "/en/services/systems-integration",
    es: "/es/servicios/integracion-de-sistemas",
  },
  "svc:dados-e-power-bi": {
    pt: "/servicos/dados-e-power-bi",
    en: "/en/services/data-and-power-bi",
    es: "/es/servicios/datos-y-power-bi",
  },
  transformation: { pt: "/transformacao", en: "/en/transformation", es: "/es/transformacion" },
  "case:cargon": { pt: "/clientes/cargon", en: "/en/clients/cargon", es: "/es/clientes/cargon" },
  "case:divina-argila": { pt: "/clientes/divina-argila", en: "/en/clients/divina-argila", es: "/es/clientes/divina-argila" },
  // Post pilar no blog do site: só em português (ver i18n/blog-ia-pme.mjs).
  "blog:ia-pme": { pt: "/blog/automacao-com-ia-para-pme" },
  // Power BI para distribuidoras e transportadoras: só em português (ver i18n/powerbi-logistica.mjs).
  "pbi-logistica": { pt: "/servicos/power-bi-para-distribuidoras-e-transportadoras" },
  // Integração Bling com marketplaces: só em português (ver i18n/bling.mjs).
  bling: { pt: "/servicos/integracao-bling-marketplaces" },
  "bling:mercado-livre": { pt: "/servicos/integracao-bling-marketplaces/integracao-bling-mercado-livre" },
  "bling:tiktok-shop": { pt: "/servicos/integracao-bling-marketplaces/integracao-bling-tiktok-shop" },
  "bling:shopee": { pt: "/servicos/integracao-bling-marketplaces/integracao-bling-shopee" },
  calculator: { pt: "/calculadora", en: "/en/automation-calculator", es: "/es/calculadora" },
  usecases: { pt: "/casos-de-uso", en: "/en/use-cases", es: "/es/casos-de-uso" },
  "uc:atendimento-whatsapp-ia": {
    pt: "/casos-de-uso/atendimento-whatsapp-ia",
    en: "/en/use-cases/whatsapp-ai-customer-service",
    es: "/es/casos-de-uso/atencion-whatsapp-ia",
  },
  "uc:leitura-automatica-de-documentos": {
    pt: "/casos-de-uso/leitura-automatica-de-documentos",
    en: "/en/use-cases/ai-document-data-extraction",
    es: "/es/casos-de-uso/extraccion-de-datos-de-documentos",
  },
  "uc:triagem-de-pedidos-e-leads": {
    pt: "/casos-de-uso/triagem-de-pedidos-e-leads",
    en: "/en/use-cases/order-and-lead-triage",
    es: "/es/casos-de-uso/triaje-de-pedidos-y-leads",
  },
  "uc:automacao-de-processos-administrativos": {
    pt: "/casos-de-uso/automacao-de-processos-administrativos",
    en: "/en/use-cases/administrative-process-automation",
    es: "/es/casos-de-uso/automatizacion-de-procesos-administrativos",
  },
  "uc:assistente-documentos-da-empresa": {
    pt: "/casos-de-uso/assistente-documentos-da-empresa",
    en: "/en/use-cases/ai-assistant-company-documents",
    es: "/es/casos-de-uso/asistente-documentos-de-la-empresa",
  },
  "uc:relatorios-automaticos": {
    pt: "/casos-de-uso/relatorios-automaticos",
    en: "/en/use-cases/automated-reports",
    es: "/es/casos-de-uso/informes-automaticos",
  },
};

// Idiomas em que a página existe (toda página nova deve ter os três).
export const langsFor = (key) => LANGS.filter((l) => ROUTES[key][l]);

export const route = (key, lang) => ROUTES[key][lang];
export const svcRoute = (slug, lang) => ROUTES[`svc:${slug}`][lang];
export const caseRoute = (slug, lang) => ROUTES[`case:${slug}`][lang];

// Bandeiras em SVG (emoji de bandeira não aparece no Windows).
// Inglês usa a bandeira dos EUA; espanhol, a da Espanha.
export const FLAGS = {
  pt: '<svg viewBox="0 0 28 20" aria-hidden="true" focusable="false"><rect width="28" height="20" fill="#009C3B"/><path d="M14 2.6 25.4 10 14 17.4 2.6 10z" fill="#FFDF00"/><circle cx="14" cy="10" r="4.4" fill="#002776"/><path d="M9.8 9.2c2.9-.5 5.9.1 8.3 1.6" stroke="#fff" stroke-width=".9" fill="none"/></svg>',
  en: '<svg viewBox="0 0 28 20" aria-hidden="true" focusable="false"><rect width="28" height="20" fill="#fff"/><path d="M0 0h28v1.54H0zm0 3.08h28v1.54H0zm0 3.08h28v1.54H0zm0 3.08h28v1.54H0zm0 3.08h28v1.54H0zm0 3.08h28v1.54H0zm0 3.08h28V20H0z" fill="#B22234"/><rect width="12" height="10.77" fill="#3C3B6E"/><g fill="#fff"><circle cx="2" cy="1.8" r=".6"/><circle cx="6" cy="1.8" r=".6"/><circle cx="10" cy="1.8" r=".6"/><circle cx="4" cy="3.9" r=".6"/><circle cx="8" cy="3.9" r=".6"/><circle cx="2" cy="6" r=".6"/><circle cx="6" cy="6" r=".6"/><circle cx="10" cy="6" r=".6"/><circle cx="4" cy="8.1" r=".6"/><circle cx="8" cy="8.1" r=".6"/></g></svg>',
  es: '<svg viewBox="0 0 28 20" aria-hidden="true" focusable="false"><rect width="28" height="20" fill="#AA151B"/><rect y="5" width="28" height="10" fill="#F1BF00"/></svg>',
};

// Textos do seletor de idioma, no idioma da página atual.
export const SWITCH_LABEL = {
  pt: "Idioma",
  en: "Language",
  es: "Idioma",
};

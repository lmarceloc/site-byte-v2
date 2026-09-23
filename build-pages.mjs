// Gera as páginas internas estáticas (HTML completo, sem React):
//   /transformacao, /servicos, /servicos/<slug> e /404.html
// Uso: npm run pages   (rodar depois de editar este arquivo)
//
// As páginas internas não carregam app.js: o conteúdo já vem no HTML,
// o que facilita a indexação e deixa o carregamento leve.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const SITE = "https://agenciabyte.com";
const BRAND = "Agencia Byte";
const OG_IMAGE = `${SITE}/img/og-image.png`;
const WHATSAPP = "https://wa.me/5542984224363";
const EMAIL = "hello@agenciabyte.com";

/* ------------------------------------------------------------------ */
/* Conteúdo                                                            */
/* ------------------------------------------------------------------ */

const PROCESS = [
  { t: "Descoberta", d: "Entendemos o processo atual, os sistemas envolvidos e onde está o gargalo.", dur: "2 a 3 dias" },
  { t: "Estratégia", d: "Proposta técnica, stack, cronograma e investimento definidos por escrito.", dur: "2 a 4 dias" },
  { t: "Desenvolvimento", d: "Sprints curtas com entregas parciais em ambiente de homologação.", dur: "3 a 5 semanas" },
  { t: "Validação", d: "Testes, ajustes finais e aprovação. QA, segurança e performance.", dur: "1 semana" },
  { t: "Suporte", d: "Deploy, documentação, treinamento e evolução contínua.", dur: "contínuo" },
];

const SERVICES = [
  {
    slug: "desenvolvimento-de-software",
    code: "01",
    nav: "Desenvolvimento",
    name: "Desenvolvimento de Software Sob Medida",
    title: "Desenvolvimento de Software Sob Medida | Agencia Byte",
    description: "Sistemas web, portais, APIs e painéis internos sob medida para a sua operação. Next.js, TypeScript e PostgreSQL, com suporte contínuo.",
    h1: "Desenvolvimento de software sob medida",
    lead: "Quando o software pronto não cobre o seu processo, a gente constrói o que falta: sistemas web, portais, APIs e painéis internos desenhados para a forma como a sua empresa realmente trabalha.",
    problems: [
      "O processo roda em planilhas compartilhadas que ninguém mais confia.",
      "O sistema de mercado exige gambiarras para caber na sua operação.",
      "Cada área usa uma ferramenta diferente e a informação se perde no caminho.",
      "O sistema atual é lento, frágil ou ninguém mais sabe mantê-lo.",
      "Você precisa de um portal para clientes, fornecedores ou parceiros.",
    ],
    deliverables: [
      { t: "Sistemas internos", d: "Cadastros, fluxos de aprovação, controle de pedidos, estoque e operação, com permissões por perfil." },
      { t: "Portais e áreas logadas", d: "Portais para clientes, revendas ou fornecedores, com autenticação, histórico e autoatendimento." },
      { t: "APIs e back-end", d: "APIs documentadas para conectar o seu sistema a aplicativos, parceiros e outras plataformas." },
      { t: "Painéis de gestão", d: "Telas operacionais com os números que a equipe precisa ver todos os dias, sem exportar planilha." },
    ],
    stack: ["Next.js + TypeScript", "PostgreSQL · Supabase", "Auth, billing, multi-tenant", "Testes E2E + CI/CD", "Deploy com rollback", "Documentação técnica"],
    faq: [
      { q: "Quanto tempo leva um projeto?", a: "Um primeiro módulo em produção costuma levar de 3 a 6 semanas. Projetos maiores são divididos em entregas menores, para você usar o sistema antes do fim do projeto." },
      { q: "O código fica com a minha empresa?", a: "Sim. O código é escrito e mantido pelo nosso time, sem terceirização, e fica no repositório da sua empresa." },
      { q: "Vocês dão manutenção depois da entrega?", a: "Sim. Oferecemos suporte com SLA de até 4 horas úteis e seguimos evoluindo o sistema com você depois do go-live." },
    ],
    related: ["integracao-de-sistemas", "automacao-com-ia"],
  },
  {
    slug: "automacao-com-ia",
    code: "02",
    nav: "Automação IA",
    name: "Automação com Inteligência Artificial",
    title: "Automação com IA para Empresas | Agencia Byte",
    description: "Automação de processos com IA: agentes, triagem, extração de documentos e atendimento 24/7 integrados aos sistemas da sua empresa.",
    h1: "Automação com IA para empresas",
    lead: "Aplicamos inteligência artificial em tarefas repetitivas da operação: ler documentos, classificar solicitações, responder clientes e alimentar sistemas. Sempre com regras claras, aprovação humana onde importa e custo previsível.",
    problems: [
      "A equipe passa horas copiando dados de e-mails, PDFs e notas fiscais para o sistema.",
      "O atendimento para fora do horário comercial e os leads esfriam.",
      "Solicitações chegam por vários canais e alguém precisa triar tudo à mão.",
      "Relatórios e resumos são montados manualmente toda semana.",
      "Vocês já testaram IA, mas nada chegou a rodar em produção.",
    ],
    deliverables: [
      { t: "Agentes de atendimento", d: "Atendimento 24/7 no WhatsApp e em outros canais, consultando os seus dados e passando para um humano quando necessário." },
      { t: "Extração de documentos", d: "Leitura de PDFs, notas, contratos e comprovantes, com os dados já estruturados no seu sistema." },
      { t: "Triagem e classificação", d: "Solicitações, tickets e leads classificados e roteados automaticamente para a pessoa certa." },
      { t: "IA sobre os seus dados", d: "Busca e respostas com base nos documentos e na base de conhecimento da empresa (RAG)." },
    ],
    stack: ["LLM-ops com fallback", "RAG sobre seus dados", "Workflows com aprovação", "Custo por execução previsível", "Logs de cada decisão", "Integração com WhatsApp"],
    faq: [
      { q: "A IA vai tomar decisões sozinha?", a: "Só onde você definir. Etapas sensíveis passam por aprovação humana, e cada decisão da IA fica registrada para auditoria." },
      { q: "Meus dados ficam seguros?", a: "Os dados trafegam apenas entre os seus sistemas e os provedores escolhidos no projeto, com acesso restrito e registro de uso." },
      { q: "Quanto custa rodar uma automação com IA?", a: "O custo de execução é estimado antes de começar, por volume de tarefas, e monitorado depois do lançamento para não haver surpresa na fatura." },
    ],
    related: ["integracao-de-sistemas", "dados-e-power-bi"],
  },
  {
    slug: "integracao-de-sistemas",
    code: "03",
    nav: "Integrações",
    name: "Integração de Sistemas",
    title: "Integração de Sistemas: ERP, CRM e APIs | Agencia Byte",
    description: "Integramos ERP, CRM, e-commerce e APIs para sincronizar dados entre sistemas e acabar com a digitação manual e os erros de cadastro.",
    h1: "Integração de sistemas: ERP, CRM, e-commerce e APIs",
    lead: "Conectamos os sistemas que a sua empresa já usa para que pedidos, clientes, estoque e financeiro fiquem sincronizados sozinhos, sem redigitação e sem planilha no meio do caminho.",
    problems: [
      "Pedidos da loja virtual são digitados de novo no ERP.",
      "O estoque do site não bate com o estoque real.",
      "Vendas fechadas no CRM não chegam ao financeiro.",
      "Uma integração antiga para de funcionar e ninguém percebe.",
      "Cada sistema tem um cadastro de cliente diferente.",
    ],
    deliverables: [
      { t: "Integração ERP e e-commerce", d: "Pedidos, produtos, preços e estoque sincronizados entre a loja e o ERP." },
      { t: "CRM conectado à operação", d: "Negócios, clientes e propostas sincronizados entre o CRM, o ERP e o atendimento." },
      { t: "APIs e webhooks", d: "Conexões com APIs de terceiros e webhooks bidirecionais, com reprocessamento automático em caso de falha." },
      { t: "Monitoramento", d: "Alertas quando uma integração falha, e registro de cada sincronização para rastrear qualquer dado." },
    ],
    stack: ["CRM, ERP, e-commerce", "Webhooks bidirecionais", "Sync incremental", "Observabilidade nativa", "Filas e reprocessamento", "Idempotência"],
    faq: [
      { q: "Vocês integram qualquer sistema?", a: "Qualquer sistema que ofereça API, webhook, banco de dados ou exportação de arquivos. Na descoberta avaliamos o que cada sistema permite." },
      { q: "O que acontece se uma integração falhar?", a: "A falha é registrada, reprocessada automaticamente e, se persistir, gera um alerta. Nada se perde em silêncio." },
      { q: "Preciso trocar de sistema?", a: "Não. A ideia é justamente conectar o que você já usa e só substituir algo quando realmente fizer sentido." },
    ],
    related: ["automacao-com-ia", "dados-e-power-bi"],
  },
  {
    slug: "dados-e-power-bi",
    code: "04",
    nav: "Dados e Power BI",
    name: "Dados e Business Intelligence",
    title: "Dashboards Power BI e Engenharia de Dados | Agencia Byte",
    description: "Dashboards em Power BI, pipelines de dados e indicadores confiáveis. Dados unificados dos seus sistemas para decidir com rapidez.",
    h1: "Dashboards em Power BI e engenharia de dados",
    lead: "Reunimos os dados espalhados pelos seus sistemas em uma base única e confiável, e entregamos dashboards em Power BI com os indicadores que a gestão realmente usa para decidir.",
    problems: [
      "Cada área apresenta um número diferente para o mesmo indicador.",
      "Os relatórios são montados à mão, no fim do mês, a partir de exportações.",
      "Os dados estão presos no ERP, no CRM e em planilhas soltas.",
      "O dashboard existe, mas ninguém confia nos números.",
      "Os problemas só aparecem quando já viraram prejuízo.",
    ],
    deliverables: [
      { t: "Dashboards em Power BI", d: "Painéis de vendas, operação, financeiro e estoque, com os indicadores definidos junto com a gestão." },
      { t: "Pipelines de dados", d: "Extração e tratamento automáticos (ETL/ELT) dos dados do ERP, CRM, planilhas e APIs." },
      { t: "Base de dados única", d: "Um modelo de dados consistente, com definições únicas para cada métrica da empresa." },
      { t: "Alertas", d: "Avisos automáticos quando um indicador sai do esperado, antes de virar problema." },
    ],
    stack: ["ETL/ELT · dbt", "Power BI | Dashboards", "Métricas confiáveis", "Alertas que importam", "PostgreSQL", "Atualização automática"],
    faq: [
      { q: "Preciso ter licença do Power BI?", a: "Depende de como os dashboards serão compartilhados. Na descoberta indicamos a licença adequada ao número de usuários e ao uso." },
      { q: "De onde vêm os dados?", a: "Dos sistemas que você já usa: ERP, CRM, e-commerce, planilhas e APIs. Os pipelines atualizam tudo automaticamente." },
      { q: "E se os dados de origem estiverem bagunçados?", a: "É o cenário mais comum. Parte do trabalho é tratar, padronizar e validar os dados antes de chegarem ao dashboard." },
    ],
    related: ["integracao-de-sistemas", "automacao-com-ia"],
  },
];

const bySlug = Object.fromEntries(SERVICES.map((s) => [s.slug, s]));
const servicePath = (s) => `/servicos/${s.slug}`;

const TRANSFORMATION_SYMPTOMS = [
  ["sheet", "ERPs, WMS e planilhas isoladas"],
  ["mail", "Trabalho braçal e repetitivo"],
  ["gear", "Dados espalhados e sem confiança"],
  ["chart", "Pouca inteligência no dia a dia"],
  ["sheet", "Custos operacionais inflados"],
];
const TRANSFORMATION_BENEFITS = [
  ["gear", "Fluxos inteligentes e autônomos"],
  ["plug", "Sistemas totalmente sincronizados"],
  ["ai", "IA para conversão e triagem"],
  ["chart", "Dados unificados para decidir rápido"],
  ["gear", "Escala sem aumentar a equipe"],
  ["ai", "Tempo livre para a estratégia"],
];
const BEFORE_AFTER = [
  {
    area: "Vendas e atendimento",
    before: "Leads chegam por WhatsApp, formulário e e-mail, e alguém copia tudo para o CRM. Fora do horário comercial, ninguém responde.",
    after: "Um agente de IA atende 24/7, qualifica o contato e registra tudo no CRM. A equipe recebe o lead já triado.",
    slug: "automacao-com-ia",
  },
  {
    area: "Pedidos e estoque",
    before: "Pedidos da loja virtual são redigitados no ERP. O estoque do site não bate com o real e a venda de item sem estoque vira retrabalho.",
    after: "Loja, ERP e estoque sincronizados automaticamente. O pedido entra uma vez e percorre todos os sistemas sozinho.",
    slug: "integracao-de-sistemas",
  },
  {
    area: "Processos internos",
    before: "Aprovações por e-mail, controles em planilhas compartilhadas e nenhuma visibilidade de quem está com cada tarefa.",
    after: "Um sistema sob medida com fluxos de aprovação, permissões e histórico, desenhado para o seu processo.",
    slug: "desenvolvimento-de-software",
  },
  {
    area: "Gestão e indicadores",
    before: "Relatórios montados à mão no fim do mês, a partir de exportações. Cada área apresenta um número diferente.",
    after: "Dashboards em Power BI atualizados automaticamente, com uma definição única para cada indicador.",
    slug: "dados-e-power-bi",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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

function head({ title, description, path, jsonld, noindex = false }) {
  const url = SITE + path;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
${noindex ? '<meta name="robots" content="noindex, follow" />' : `<meta name="robots" content="index, follow" />
<link rel="canonical" href="${url}" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:image" content="${OG_IMAGE}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:site_name" content="${BRAND}" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${OG_IMAGE}" />`}

<meta name="theme-color" content="#FF6A1A" />
<link rel="icon" href="/img/logo_byte_64.png" sizes="64x64" type="image/png" />
<link rel="apple-touch-icon" href="/img/logo_byte.png" sizes="180x180" />
${jsonld ? `\n<script type="application/ld+json">\n${JSON.stringify(jsonld, null, 2)}\n</script>\n` : ""}
${ANALYTICS}

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" media="print" onload="this.media='all'" />
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" /></noscript>
<link rel="stylesheet" href="/styles.css" />
<link rel="stylesheet" href="/pages.css" />
</head>
<body data-theme="light">`;
}

function nav(current) {
  const links = [
    ["/#sobre", "Sobre"],
    ["/transformacao", "Antes e depois"],
    ["/servicos", "Serviços"],
    ["/#processo", "Processo"],
    ["/#clientes", "Clientes"],
  ];
  const cur = (href) => (href === current ? ' aria-current="page"' : "");
  const blog = '<a href="https://blog.agenciabyte.com/" class="nav-pill-link blog-link" target="_blank" rel="noopener noreferrer">Blog</a>';
  return `<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<header class="nav">
  <div class="nav-inner">
    <a href="/" class="nav-brand-wrap" aria-label="Agencia Byte, página inicial">
      <span class="glyph">
        <picture>
          <source srcset="/img/logo_byte.webp" type="image/webp" />
          <img src="/img/logo_byte_64.png" alt="" width="32" height="32" />
        </picture>
      </span>
      <span>Agencia Byte</span>
    </a>
    <nav class="nav-pill" aria-label="Menu principal">
      ${links.map(([h, l]) => `<a href="${h}" class="nav-pill-link"${cur(h)}>${l}</a>`).join("\n      ")}
      ${blog}
    </nav>
    <div class="nav-cta">
      <a href="/#contato" class="btn btn-accent nav-cta-desktop">Contato →</a>
      <button class="nav-burger" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu-mobile">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>
    </div>
  </div>
  <nav class="nav-mobile-menu" id="menu-mobile" aria-label="Menu de navegação" hidden>
    ${links.map(([h, l]) => `<a href="${h}"${cur(h)}>${l}</a>`).join("\n    ")}
    <a href="https://blog.agenciabyte.com/" class="ul-link blog-link" target="_blank" rel="noopener noreferrer">Blog</a>
    <a href="/#contato" class="nav-mobile-cta">Contato →</a>
  </nav>
</header>
<script>
  (function(){
    var b = document.querySelector('.nav-burger'), m = document.getElementById('menu-mobile');
    b.addEventListener('click', function(){
      var open = m.hidden;
      m.hidden = !open;
      b.setAttribute('aria-expanded', String(open));
      b.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
  })();
</script>`;
}

function footer() {
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
        <p class="muted footer-tagline">Código que funciona. Sistemas que crescem. Engenharia para empresas com pressa.</p>
      </div>
      ${col("Serviços", SERVICES.map((s) => [servicePath(s), s.nav]))}
      ${col("Empresa", [["/#sobre", "Sobre"], ["/#processo", "Processo"], ["/transformacao", "Antes e depois"], ["https://blog.agenciabyte.com/", "Blog"]])}
      <div>
        <div class="mono footer-title">Contato</div>
        <ul class="footer-list">
          <li><a href="mailto:${EMAIL}" class="ul-link">${EMAIL}</a></li>
          <li><a href="${WHATSAPP}" target="_blank" rel="noopener noreferrer" class="ul-link">+55 42 98422-4363</a></li>
          <li><a href="https://www.instagram.com/agenciabyte.ia" target="_blank" rel="noopener noreferrer" class="ul-link">Instagram</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="muted mono">© 2026 Agencia Byte · todos os direitos reservados</div>
    </div>
  </div>
</footer>
</body>
</html>
`;
}

function crumbs(items) {
  return `<nav class="crumbs mono" aria-label="Você está em">
        <ol>
          ${items.map(([h, l], i) => (i < items.length - 1 ? `<li><a href="${h}">${l}</a></li>` : `<li aria-current="page">${l}</li>`)).join("\n          ")}
        </ol>
      </nav>`;
}

function breadcrumbLd(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([h, l], i) => ({ "@type": "ListItem", position: i + 1, name: l, item: SITE + (h === "/" ? "/" : h) })),
  };
}

function processSection() {
  return `<section class="page-section">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#EC4899"></span>Como trabalhamos</div>
        <h2 class="display">5 etapas, do diagnóstico ao suporte.</h2>
      </div>
      <ol class="steps">
        ${PROCESS.map((p, i) => `<li class="card">
          <div class="display step-code">0${i + 1}</div>
          <h3>${p.t}</h3>
          <p class="muted">${p.d}</p>
          <div class="mono step-dur">${p.dur}</div>
        </li>`).join("\n        ")}
      </ol>
    </div>
  </section>`;
}

function faqSection(faq) {
  return `<section class="page-section page-section-alt">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow"><span class="dot" style="--dot-color:#3B82F6"></span>Perguntas frequentes</div>
        <h2 class="display">Dúvidas comuns.</h2>
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

function ctaSection(heading) {
  return `<section class="section-dark cta-band">
    <div class="wrap">
      <h2 class="display">${heading}</h2>
      <p>Você explica o problema. A gente constrói a solução. Resposta direta, sem proposta genérica.</p>
      <div class="cta-actions">
        <a href="/#contato" class="btn btn-accent">Começar um projeto →</a>
        <a href="${WHATSAPP}" class="btn btn-ghost" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
      </div>
    </div>
  </section>`;
}

function relatedSection(slugs, heading = "Serviços relacionados") {
  return `<section class="page-section">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#8B5CF6"></span>Veja também</div>
        <h2 class="display">${heading}</h2>
      </div>
      <div class="related-grid">
        ${slugs.map((slug) => {
          const s = bySlug[slug];
          return `<a class="card related-card" href="${servicePath(s)}">
          <span class="mono muted">// ${s.code}</span>
          <h3>${s.name}</h3>
          <p class="muted">${s.description}</p>
          <span class="related-more mono">Ver serviço →</span>
        </a>`;
        }).join("\n        ")}
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* Páginas                                                             */
/* ------------------------------------------------------------------ */

function servicePage(s) {
  const path = servicePath(s);
  const trail = [["/", "Início"], ["/servicos", "Serviços"], [path, s.name]];
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE}${path}#service`,
        name: s.name,
        serviceType: s.name,
        description: s.description,
        url: SITE + path,
        provider: { "@id": `${SITE}/#organization` },
        areaServed: ["BR", "US", "ES"],
      },
      breadcrumbLd(trail),
    ],
  };
  return (
    head({ title: s.title, description: s.description, path, jsonld }) +
    nav("/servicos") +
    `
<main id="conteudo">
  <section class="page-hero">
    <div class="grid-bg"></div>
    <div class="wrap">
      ${crumbs(trail)}
      <div class="eyebrow"><span class="dot"></span>Serviço ${s.code}</div>
      <h1 class="display">${s.h1}</h1>
      <p class="lead muted">${s.lead}</p>
      <div class="cta-actions">
        <a href="/#contato" class="btn btn-accent">Começar um projeto →</a>
        <a href="${WHATSAPP}" class="btn btn-ghost" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow"><span class="dot" style="--dot-color:#F59E0B"></span>Quando faz sentido</div>
        <h2 class="display">Sinais de que é hora.</h2>
      </div>
      <ol class="signal-list">
        ${s.problems.map((p, i) => `<li><span class="mono">0${i + 1}</span><span>${p}</span></li>`).join("\n        ")}
      </ol>
    </div>
  </section>

  <section class="page-section page-section-alt">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#10B981"></span>O que entregamos</div>
        <h2 class="display">Escopo do serviço.</h2>
      </div>
      <div class="deliv-grid">
        ${s.deliverables.map((d) => `<div class="card">
          <h3>${d.t}</h3>
          <p class="muted">${d.d}</p>
        </div>`).join("\n        ")}
      </div>
      <div class="stack">
        <div class="mono muted">// stack e práticas</div>
        <ul>
          ${s.stack.map((b) => `<li class="chip">${b}</li>`).join("\n          ")}
        </ul>
      </div>
    </div>
  </section>

  ${processSection()}
  ${faqSection(s.faq)}
  ${relatedSection(s.related)}
  ${ctaSection("Vamos olhar o seu processo?")}
</main>
` +
    footer()
  );
}

function servicesHub() {
  const path = "/servicos";
  const title = "Serviços de Software, IA, Integrações e Dados | Agencia Byte";
  const description = "Desenvolvimento de software sob medida, automação com IA, integração de sistemas e dashboards em Power BI para empresas.";
  const trail = [["/", "Início"], [path, "Serviços"]];
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Serviços da Agencia Byte",
        itemListElement: SERVICES.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: SITE + servicePath(s) })),
      },
      breadcrumbLd(trail),
    ],
  };
  return (
    head({ title, description, path, jsonld }) +
    nav("/servicos") +
    `
<main id="conteudo">
  <section class="page-hero">
    <div class="grid-bg"></div>
    <div class="wrap">
      ${crumbs(trail)}
      <div class="eyebrow"><span class="dot" style="--dot-color:#8B5CF6"></span>Serviços</div>
      <h1 class="display">Soluções de tecnologia para empresas</h1>
      <p class="lead muted">Software sob medida, automação com IA, integração de sistemas e dados. Do diagnóstico ao deploy, sem terceirização e sem revenda de ferramentas prontas.</p>
    </div>
  </section>

  <section class="page-section">
    <div class="wrap">
      <div class="related-grid related-grid-2">
        ${SERVICES.map((s) => `<a class="card related-card" href="${servicePath(s)}">
          <span class="mono muted">// ${s.code}</span>
          <h2>${s.name}</h2>
          <p class="muted">${s.lead}</p>
          <ul class="mini-list mono">
            ${s.stack.slice(0, 4).map((b) => `<li>› ${b}</li>`).join("\n            ")}
          </ul>
          <span class="related-more mono">Ver serviço →</span>
        </a>`).join("\n        ")}
      </div>
    </div>
  </section>

  ${processSection()}
  ${ctaSection("Não sabe por onde começar?")}
</main>
` +
    footer()
  );
}

function transformationPage() {
  const path = "/transformacao";
  const title = "Antes e Depois da Automação de Processos | Agencia Byte";
  const description = "Veja como a Agencia Byte transforma processos manuais e sistemas desconectados em operações integradas e automatizadas com IA.";
  const trail = [["/", "Início"], [path, "Antes e depois"]];
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}${path}#webpage`,
        url: SITE + path,
        name: title,
        description,
        inLanguage: "pt-BR",
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#organization` },
      },
      breadcrumbLd(trail),
    ],
  };
  return (
    head({ title, description, path, jsonld }) +
    nav(path) +
    `
<main id="conteudo">
  <section class="page-hero">
    <div class="grid-bg"></div>
    <div class="wrap">
      ${crumbs(trail)}
      <div class="eyebrow"><span class="dot" style="--dot-color:#F59E0B"></span>Antes e depois</div>
      <h1 class="display">De processos manuais a uma operação automatizada</h1>
      <p class="lead muted">Planilhas isoladas, redigitação entre sistemas e relatórios montados à mão custam tempo e dinheiro. Veja o que muda quando os sistemas passam a conversar e a IA assume o trabalho repetitivo.</p>
    </div>
  </section>

  <section class="transformation-section section-dark">
    <div class="grid-bg"></div>
    <div class="wrap transformation-wrap">
      <div class="transformation-heading">
        <div>
          <div class="eyebrow"><span class="dot" style="--dot-color:#F59E0B"></span>O fluxo</div>
          <h2 class="display">O processo agora flui.</h2>
        </div>
        <p>Da operação fragmentada a um ecossistema que conversa, decide e executa.</p>
      </div>
      <div class="transformation-stage">
        <div class="transformation-panel transformation-before">
          <div class="transformation-kicker mono">01 / cenário de partida</div>
          <h3 class="display">Processos 100%<br/>manuais e desconexos.</h3>
          <ul class="fragment-timeline">
            ${TRANSFORMATION_SYMPTOMS.map(([g, t], i) => `<li class="fragment-step"><span class="fragment-index mono">0${i + 1}</span><span class="fragment-node">${glyph(g)}</span><span>${t}</span></li>`).join("\n            ")}
          </ul>
          <div class="transformation-note mono">// cada etapa cria um novo retrabalho</div>
        </div>
        <div class="transformation-bridge">
          <div class="bridge-lines" aria-hidden="true"><span></span></div>
          <div class="bridge-core">${glyph("ai")}<span class="mono">BYTE<br/>ENGINE</span></div>
          <div class="bridge-output-line" aria-hidden="true"></div>
          <div class="bridge-label mono">Automação + IA aplicadas</div>
        </div>
        <div class="transformation-panel transformation-after">
          <div class="transformation-kicker mono">02 / cenário transformado</div>
          <h3 class="display">Operação integrada<br/>e automatizada.</h3>
          <div class="order-flow"><div class="order-line" aria-hidden="true"></div>
            <ul class="benefit-list">
              ${TRANSFORMATION_BENEFITS.map(([g, t]) => `<li class="benefit-step"><span class="benefit-node">${glyph(g)}</span><span>${t}</span><span class="benefit-check" aria-hidden="true">OK</span></li>`).join("\n              ")}
            </ul>
          </div>
          <div class="transformation-note mono">// dados confiáveis · decisão em ritmo real</div>
        </div>
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow"><span class="dot" style="--dot-color:#10B981"></span>Na prática</div>
        <h2 class="display">O que muda em cada área.</h2>
      </div>
      <div class="ba-list">
        ${BEFORE_AFTER.map((b) => {
          const s = bySlug[b.slug];
          return `<article class="ba-row">
          <h3>${b.area}</h3>
          <div class="ba-col">
            <div class="mono ba-tag ba-tag-before">antes</div>
            <p>${b.before}</p>
          </div>
          <div class="ba-col">
            <div class="mono ba-tag ba-tag-after">depois</div>
            <p>${b.after}</p>
            <a class="ul-link mono ba-link" href="${servicePath(s)}">${s.name} →</a>
          </div>
        </article>`;
        }).join("\n        ")}
      </div>
    </div>
  </section>

  ${processSection()}
  ${ctaSection("Qual processo você quer transformar?")}
</main>
` +
    footer()
  );
}

function notFoundPage() {
  return (
    head({ title: "Página não encontrada | Agencia Byte", description: "A página que você procurou não existe.", path: "/404", noindex: true }) +
    nav("") +
    `
<main id="conteudo">
  <section class="page-hero page-hero-404">
    <div class="grid-bg"></div>
    <div class="wrap">
      <div class="eyebrow mono"><span class="dot"></span>erro 404</div>
      <h1 class="display">Página não encontrada.</h1>
      <p class="lead muted">O endereço pode ter mudado ou nunca ter existido. Veja por onde continuar:</p>
      <div class="cta-actions">
        <a href="/" class="btn btn-accent">Ir para o início →</a>
        <a href="/servicos" class="btn btn-ghost">Ver serviços</a>
      </div>
    </div>
  </section>
</main>
` +
    footer()
  );
}

/* ------------------------------------------------------------------ */
/* Saída                                                               */
/* ------------------------------------------------------------------ */

const out = {
  "transformacao/index.html": transformationPage(),
  "servicos/index.html": servicesHub(),
  "404.html": notFoundPage(),
};
for (const s of SERVICES) out[`servicos/${s.slug}/index.html`] = servicePage(s);

for (const [file, html] of Object.entries(out)) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log("✓", file);
}

// Sitemap com a home + todas as páginas geradas.
const today = new Date().toISOString().slice(0, 10);
const urls = ["/", "/servicos", ...SERVICES.map(servicePath), "/transformacao"];
writeFileSync(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join("\n")}
</urlset>
`
);
console.log("✓ sitemap.xml");

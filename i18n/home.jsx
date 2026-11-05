// Textos da home (React) em português, inglês e espanhol.
// O idioma vem do <html lang> da página: / (pt-BR), /en (en), /es (es).
import React from "react";
import { LANGS, DEFAULT_LANG } from "./routes.mjs";

const Acc = ({ children }) => <span style={{ color: "var(--accent)" }}>{children}</span>;

const pt = {
  nav: {
    about: "Sobre", transformation: "Antes e depois", services: "Serviços", process: "Processo",
    clients: "Clientes", contact: "Contato →", menuOpen: "Abrir menu", menuClose: "Fechar menu",
    menuLabel: "Menu de navegação", home: "Agência Byte, página inicial",
  },
  hero: {
    titleA: ["Transforme processos manuais", "em operação inteligente"],
    titleB: ["Conecte sistemas, automatize tarefas", "e faça sua operação", "escalar"],
    lead: "Transformamos tarefas repetitivas e processos desconectados em operações inteligentes, integradas e previsíveis. Conectamos seus sistemas, desenhamos integrações sob medida e aplicamos IA diretamente nos fluxos de vendas e gestão. O próximo passo não é trabalhar mais. É automatizar para crescer.",
    cta: "Começar um projeto →",
    stats: [["Tempo médio", "3–6 semanas"], ["SLA suporte", "< 4h úteis"], ["Stack", "type-safe ponta a ponta"]],
  },
  transformation: {
    eyebrow: "Antes e depois",
    title: "O processo agora flui.",
    sub: "Da operação fragmentada a um ecossistema que conversa, decide e executa.",
    beforeKicker: "01 / cenário de partida",
    beforeTitle: <>Processos 100%<br />manuais e desconexos.</>,
    symptoms: ["ERPs, WMS e planilhas isoladas", "Trabalho braçal e repetitivo", "Dados espalhados e sem confiança", "Pouca inteligência no dia a dia", "Custos operacionais inflados"],
    beforeNote: "// cada etapa cria um novo retrabalho",
    bridgeAria: "A Engenharia da Agência Byte",
    bridgeLabel: "Automação + IA aplicadas",
    afterKicker: "02 / cenário transformado",
    afterTitle: <>Operação integrada<br />e automatizada.</>,
    benefits: ["Fluxos inteligentes e autônomos", "Sistemas totalmente sincronizados", "IA para conversão e triagem", "Dados unificados para decidir rápido", "Escala sem aumentar a equipe", "Tempo livre para a estratégia"],
    afterNote: "// dados confiáveis · decisão em ritmo real",
    more: "Ver o antes e depois de cada área →",
  },
  about: {
    eyebrow: "Quem Somos",
    title: <>Tecnologia<br />como vantagem<br />competitiva.</>,
    p1: <>Somos especialistas em <strong>desenvolvimento de sistemas</strong>, <strong>automações com IA</strong> e <strong>consultoria técnica</strong>. Trabalhamos com startups, PMEs e grandes empresas que têm pressa em crescer.</>,
    p2: "Não revendemos soluções prontas. Cada projeto é único — desenhamos a arquitetura certa, escolhemos a stack ideal e entregamos código de qualidade com suporte contínuo.",
    cards: [
      ["IA & Automação", "Inteligência que trabalha 24/7 — LLMs, agents, pipelines de dados."],
      ["Sem terceirização", "Código escrito e mantido pelo nosso time, do primeiro commit ao deploy."],
      ["Type-safe ponta a ponta", "TypeScript da API ao frontend — menos bugs, refactor com confiança."],
      ["Suporte contínuo", "SLA < 4h úteis. Evoluímos o sistema com você após o go-live."],
    ],
  },
  services: {
    eyebrow: "Serviços",
    title: "Soluções de tecnologia para empresas",
    note: ["// do diagnóstico ao deploy", "// sem terceirização, sem revenda"],
    items: {
      "desenvolvimento-de-software": {
        more: "Ver desenvolvimento sob medida",
        title: "Desenvolvimento de Software Sob Medida",
        desc: "Desenvolvemos soluções personalizadas que digitalizam processos específicos e se integram ao ecossistema da empresa, com entregas iterativas e foco em qualidade.",
        bullets: ["Next.js + TypeScript", "PostgreSQL · Supabase", "Auth, billing, multi-tenant", "Testes E2E + CI/CD"],
      },
      "automacao-com-ia": {
        more: "Ver automação com IA",
        title: "Automação com IA",
        desc: "Desenvolvemos automações de processos utilizando inteligência artificial para classificar documentos, automatizar tarefas repetitivas, conectar fluxos de trabalho e criar atendimentos inteligentes.",
        bullets: ["LLM-ops com fallback", "RAG sobre seus dados", "Workflows com aprovação", "Custo por execução previsível"],
      },
      "integracao-de-sistemas": {
        more: "Ver integração de sistemas",
        title: "Integração de Sistemas",
        desc: "Conectamos ERPs, CRMs e APIs para sincronizar sistemas, reduzir processos manuais e eliminar erros de integração.",
        bullets: ["CRM, ERP, e-commerce", "Webhooks bidirecionais", "Sync incremental", "Observabilidade nativa"],
      },
      "dados-e-power-bi": {
        more: "Ver dados e Power BI",
        title: "Dados e Dashboards",
        desc: "Implementamos pipelines de dados, dashboards e soluções de Business Intelligence, incluindo Power BI, para transformar dados operacionais em indicadores acionáveis.",
        bullets: ["ETL/ELT · dbt", "Power BI | Dashboards", "Métricas confiáveis", "Alertas que importam"],
      },
    },
  },
  process: {
    eyebrow: "Processo",
    title: "5 etapas.",
    sub: "Você acompanha cada etapa, cada decisão técnica, cada entrega. Sem surpresas no orçamento.",
    steps: [
      { t: "Descoberta", d: "Entendemos seu negócio, desafios, objetivos e visão de futuro. 1–2 sessões.", dur: "2 a 3 dias" },
      { t: "Estratégia", d: "Proposta técnica, stack recomendada, cronograma e investimento claro.", dur: "2 a 4 dias" },
      { t: "Desenvolvimento", d: "Sprints iterativas, entregas parciais, você acompanha tudo em ambiente staging.", dur: "3 a 5 semanas" },
      { t: "Validação", d: "Testes rigorosos, ajustes finais e aprovação. QA, segurança, performance.", dur: "1 semana" },
      { t: "Suporte", d: "Deploy, documentação, treinamento e evolução contínua.", dur: "contínuo" },
    ],
  },
  clients: { eyebrow: "Clientes", caseTag: "ver caso" },
  contact: {
    eyebrow: "Contato",
    title: <>Você explica o<br />problema<Acc>.</Acc><br />A gente constrói<br />a <Acc>solução</Acc>.</>,
    receivedTitle: "Recebido!",
    receivedText: <>Vamos te responder em breve.<br />Fique de olho no seu e-mail.</>,
    brief: "// BRIEF RÁPIDO",
    name: "Seu nome", namePh: "Maria da Silva",
    email: "E-mail", emailPh: "maria@empresa.com",
    whatsapp: "WhatsApp", whatsappPh: "+55 (11) 99999-9999",
    budget: "Orçamento estimado (R$ mil)",
    problem: "O problema que você quer resolver",
    problemPh: "Ex.: nosso onboarding leva 4h por cliente, queremos automatizar com IA…",
    hint: "↵ enviar · resposta em < 24h",
    send: "Enviar", sending: "Enviando…",
    error: "Não foi possível enviar agora. Tente de novo ou fale com a gente pelo WhatsApp.",
  },
  footer: {
    tagline: "Código que funciona. Sistemas que crescem. Engenharia para empresas com pressa.",
    services: "Serviços", company: "Empresa", contact: "Contato",
    svc: {
      "desenvolvimento-de-software": "Desenvolvimento",
      "automacao-com-ia": "Automação IA",
      "integracao-de-sistemas": "Integrações",
      "dados-e-power-bi": "Dados e Power BI",
    },
    about: "Sobre", process: "Processo", transformation: "Antes e depois",
    rights: "© 2026 Agência Byte · todos os direitos reservados",
    operational: "● operacional",
  },
};

const en = {
  nav: {
    about: "About", transformation: "Before & after", services: "Services", process: "Process",
    clients: "Clients", contact: "Contact →", menuOpen: "Open menu", menuClose: "Close menu",
    menuLabel: "Navigation menu", home: "Agência Byte, home page",
  },
  hero: {
    titleA: ["Turn manual processes", "into intelligent operations"],
    titleB: ["Connect systems, automate tasks", "and make your operation", "scale"],
    lead: "We turn repetitive tasks and disconnected processes into intelligent, integrated and predictable operations. We connect your systems, design custom integrations and apply AI directly to your sales and management workflows. The next step isn't working harder. It's automating to grow.",
    cta: "Start a project →",
    stats: [["Average time", "3–6 weeks"], ["Support SLA", "< 4 business hours"], ["Stack", "end-to-end type-safe"]],
  },
  transformation: {
    eyebrow: "Before and after",
    title: "Now the process flows.",
    sub: "From a fragmented operation to an ecosystem that talks, decides and executes.",
    beforeKicker: "01 / starting point",
    beforeTitle: <>100% manual,<br />disconnected processes.</>,
    symptoms: ["Isolated ERPs, WMS and spreadsheets", "Repetitive manual work", "Scattered, unreliable data", "Little intelligence day to day", "Inflated operating costs"],
    beforeNote: "// every step creates more rework",
    bridgeAria: "Agência Byte engineering",
    bridgeLabel: "Applied automation + AI",
    afterKicker: "02 / transformed",
    afterTitle: <>Integrated,<br />automated operation.</>,
    benefits: ["Smart, autonomous workflows", "Fully synchronized systems", "AI for conversion and triage", "Unified data for fast decisions", "Scale without growing the team", "Time freed up for strategy"],
    afterNote: "// reliable data · real-time decisions",
    more: "See the before and after for each area →",
  },
  about: {
    eyebrow: "About us",
    title: <>Technology<br />as a competitive<br />advantage.</>,
    p1: <>We specialize in <strong>systems development</strong>, <strong>AI automation</strong> and <strong>technical consulting</strong>. We work with startups, SMBs and large companies in a hurry to grow.</>,
    p2: "We don't resell off-the-shelf solutions. Every project is unique — we design the right architecture, choose the ideal stack and deliver quality code with ongoing support.",
    cards: [
      ["AI & Automation", "Intelligence that works 24/7 — LLMs, agents, data pipelines."],
      ["No outsourcing", "Code written and maintained by our own team, from first commit to deploy."],
      ["End-to-end type-safe", "TypeScript from API to frontend — fewer bugs, confident refactors."],
      ["Ongoing support", "SLA < 4 business hours. We keep evolving the system with you after go-live."],
    ],
  },
  services: {
    eyebrow: "Services",
    title: "Technology solutions for businesses",
    note: ["// from diagnosis to deploy", "// no outsourcing, no reselling"],
    items: {
      "desenvolvimento-de-software": {
        more: "See custom development",
        title: "Custom Software Development",
        desc: "We build custom solutions that digitize specific processes and integrate with your company's ecosystem, with iterative deliveries and a focus on quality.",
        bullets: ["Next.js + TypeScript", "PostgreSQL · Supabase", "Auth, billing, multi-tenant", "E2E tests + CI/CD"],
      },
      "automacao-com-ia": {
        more: "See AI automation",
        title: "AI Automation",
        desc: "We build process automations powered by artificial intelligence to classify documents, automate repetitive tasks, connect workflows and deliver intelligent customer service.",
        bullets: ["LLM-ops with fallback", "RAG over your data", "Workflows with approval", "Predictable cost per run"],
      },
      "integracao-de-sistemas": {
        more: "See systems integration",
        title: "Systems Integration",
        desc: "We connect ERPs, CRMs and APIs to sync your systems, reduce manual processes and eliminate integration errors.",
        bullets: ["CRM, ERP, e-commerce", "Bidirectional webhooks", "Incremental sync", "Built-in observability"],
      },
      "dados-e-power-bi": {
        more: "See data and Power BI",
        title: "Data and Dashboards",
        desc: "We implement data pipelines, dashboards and Business Intelligence solutions, including Power BI, to turn operational data into actionable metrics.",
        bullets: ["ETL/ELT · dbt", "Power BI | Dashboards", "Reliable metrics", "Alerts that matter"],
      },
    },
  },
  process: {
    eyebrow: "Process",
    title: "5 steps.",
    sub: "You follow every step, every technical decision, every delivery. No budget surprises.",
    steps: [
      { t: "Discovery", d: "We learn about your business, challenges, goals and vision for the future. 1–2 sessions.", dur: "2 to 3 days" },
      { t: "Strategy", d: "Technical proposal, recommended stack, timeline and a clear investment.", dur: "2 to 4 days" },
      { t: "Development", d: "Iterative sprints and partial deliveries — you follow everything in a staging environment.", dur: "3 to 5 weeks" },
      { t: "Validation", d: "Rigorous testing, final adjustments and sign-off. QA, security, performance.", dur: "1 week" },
      { t: "Support", d: "Deploy, documentation, training and continuous evolution.", dur: "ongoing" },
    ],
  },
  clients: { eyebrow: "Clients", caseTag: "see case" },
  contact: {
    eyebrow: "Contact",
    title: <>You explain the<br />problem<Acc>.</Acc><br />We build<br />the <Acc>solution</Acc>.</>,
    receivedTitle: "Received!",
    receivedText: <>We'll get back to you soon.<br />Keep an eye on your inbox.</>,
    brief: "// QUICK BRIEF",
    name: "Your name", namePh: "Jane Smith",
    email: "Email", emailPh: "jane@company.com",
    whatsapp: "WhatsApp", whatsappPh: "+1 (555) 123-4567",
    budget: "Estimated budget (thousand BRL)",
    problem: "The problem you want to solve",
    problemPh: "E.g.: our onboarding takes 4h per client and we want to automate it with AI…",
    hint: "↵ send · reply in < 24h",
    send: "Send", sending: "Sending…",
    error: "We couldn't send your message right now. Please try again or reach us on WhatsApp.",
  },
  footer: {
    tagline: "Code that works. Systems that grow. Engineering for companies in a hurry.",
    services: "Services", company: "Company", contact: "Contact",
    svc: {
      "desenvolvimento-de-software": "Development",
      "automacao-com-ia": "AI Automation",
      "integracao-de-sistemas": "Integrations",
      "dados-e-power-bi": "Data & Power BI",
    },
    about: "About", process: "Process", transformation: "Before and after",
    rights: "© 2026 Agência Byte · all rights reserved",
    operational: "● operational",
  },
};

const es = {
  nav: {
    about: "Nosotros", transformation: "Antes y después", services: "Servicios", process: "Proceso",
    clients: "Clientes", contact: "Contacto →", menuOpen: "Abrir menú", menuClose: "Cerrar menú",
    menuLabel: "Menú de navegación", home: "Agência Byte, página de inicio",
  },
  hero: {
    titleA: ["Transforma procesos manuales", "en una operación inteligente"],
    titleB: ["Conecta sistemas, automatiza tareas", "y haz que tu operación", "escale"],
    lead: "Transformamos tareas repetitivas y procesos desconectados en operaciones inteligentes, integradas y predecibles. Conectamos tus sistemas, diseñamos integraciones a medida y aplicamos IA directamente en los flujos de ventas y gestión. El próximo paso no es trabajar más. Es automatizar para crecer.",
    cta: "Empezar un proyecto →",
    stats: [["Tiempo medio", "3–6 semanas"], ["SLA de soporte", "< 4 h hábiles"], ["Stack", "type-safe de punta a punta"]],
  },
  transformation: {
    eyebrow: "Antes y después",
    title: "Ahora el proceso fluye.",
    sub: "De una operación fragmentada a un ecosistema que conversa, decide y ejecuta.",
    beforeKicker: "01 / punto de partida",
    beforeTitle: <>Procesos 100%<br />manuales y desconectados.</>,
    symptoms: ["ERPs, WMS y hojas de cálculo aisladas", "Trabajo manual y repetitivo", "Datos dispersos y poco confiables", "Poca inteligencia en el día a día", "Costos operativos inflados"],
    beforeNote: "// cada etapa genera más retrabajo",
    bridgeAria: "La ingeniería de Agência Byte",
    bridgeLabel: "Automatización + IA aplicadas",
    afterKicker: "02 / escenario transformado",
    afterTitle: <>Operación integrada<br />y automatizada.</>,
    benefits: ["Flujos inteligentes y autónomos", "Sistemas totalmente sincronizados", "IA para conversión y clasificación", "Datos unificados para decidir rápido", "Escalar sin aumentar el equipo", "Tiempo libre para la estrategia"],
    afterNote: "// datos confiables · decisiones en tiempo real",
    more: "Ver el antes y después de cada área →",
  },
  about: {
    eyebrow: "Quiénes somos",
    title: <>Tecnología<br />como ventaja<br />competitiva.</>,
    p1: <>Somos especialistas en <strong>desarrollo de sistemas</strong>, <strong>automatizaciones con IA</strong> y <strong>consultoría técnica</strong>. Trabajamos con startups, pymes y grandes empresas con prisa por crecer.</>,
    p2: "No revendemos soluciones genéricas. Cada proyecto es único: diseñamos la arquitectura correcta, elegimos el stack ideal y entregamos código de calidad con soporte continuo.",
    cards: [
      ["IA y Automatización", "Inteligencia que trabaja 24/7: LLMs, agentes, pipelines de datos."],
      ["Sin subcontratación", "Código escrito y mantenido por nuestro equipo, del primer commit al deploy."],
      ["Type-safe de punta a punta", "TypeScript de la API al frontend: menos bugs, refactors con confianza."],
      ["Soporte continuo", "SLA < 4 h hábiles. Seguimos evolucionando el sistema contigo después del go-live."],
    ],
  },
  services: {
    eyebrow: "Servicios",
    title: "Soluciones tecnológicas para empresas",
    note: ["// del diagnóstico al deploy", "// sin subcontratación, sin reventa"],
    items: {
      "desenvolvimento-de-software": {
        more: "Ver desarrollo a medida",
        title: "Desarrollo de Software a Medida",
        desc: "Desarrollamos soluciones personalizadas que digitalizan procesos específicos y se integran al ecosistema de la empresa, con entregas iterativas y foco en la calidad.",
        bullets: ["Next.js + TypeScript", "PostgreSQL · Supabase", "Auth, billing, multi-tenant", "Tests E2E + CI/CD"],
      },
      "automacao-com-ia": {
        more: "Ver automatización con IA",
        title: "Automatización con IA",
        desc: "Desarrollamos automatizaciones de procesos con inteligencia artificial para clasificar documentos, automatizar tareas repetitivas, conectar flujos de trabajo y crear atención inteligente.",
        bullets: ["LLM-ops con fallback", "RAG sobre tus datos", "Workflows con aprobación", "Costo por ejecución predecible"],
      },
      "integracao-de-sistemas": {
        more: "Ver integración de sistemas",
        title: "Integración de Sistemas",
        desc: "Conectamos ERPs, CRMs y APIs para sincronizar sistemas, reducir procesos manuales y eliminar errores de integración.",
        bullets: ["CRM, ERP, e-commerce", "Webhooks bidireccionales", "Sync incremental", "Observabilidad nativa"],
      },
      "dados-e-power-bi": {
        more: "Ver datos y Power BI",
        title: "Datos y Dashboards",
        desc: "Implementamos pipelines de datos, dashboards y soluciones de Business Intelligence, incluido Power BI, para transformar datos operativos en indicadores accionables.",
        bullets: ["ETL/ELT · dbt", "Power BI | Dashboards", "Métricas confiables", "Alertas que importan"],
      },
    },
  },
  process: {
    eyebrow: "Proceso",
    title: "5 etapas.",
    sub: "Acompañas cada etapa, cada decisión técnica, cada entrega. Sin sorpresas en el presupuesto.",
    steps: [
      { t: "Descubrimiento", d: "Entendemos tu negocio, desafíos, objetivos y visión de futuro. 1–2 sesiones.", dur: "2 a 3 días" },
      { t: "Estrategia", d: "Propuesta técnica, stack recomendado, cronograma e inversión clara.", dur: "2 a 4 días" },
      { t: "Desarrollo", d: "Sprints iterativos y entregas parciales: sigues todo en un entorno de staging.", dur: "3 a 5 semanas" },
      { t: "Validación", d: "Pruebas rigurosas, ajustes finales y aprobación. QA, seguridad, rendimiento.", dur: "1 semana" },
      { t: "Soporte", d: "Deploy, documentación, capacitación y evolución continua.", dur: "continuo" },
    ],
  },
  clients: { eyebrow: "Clientes", caseTag: "ver caso" },
  contact: {
    eyebrow: "Contacto",
    title: <>Tú explicas el<br />problema<Acc>.</Acc><br />Nosotros creamos<br />la <Acc>solución</Acc>.</>,
    receivedTitle: "¡Recibido!",
    receivedText: <>Te responderemos pronto.<br />Revisa tu correo.</>,
    brief: "// BRIEF RÁPIDO",
    name: "Tu nombre", namePh: "María García",
    email: "Correo electrónico", emailPh: "maria@empresa.com",
    whatsapp: "WhatsApp", whatsappPh: "+34 612 345 678",
    budget: "Presupuesto estimado (miles de R$)",
    problem: "El problema que quieres resolver",
    problemPh: "Ej.: nuestro onboarding tarda 4 h por cliente y queremos automatizarlo con IA…",
    hint: "↵ enviar · respuesta en < 24 h",
    send: "Enviar", sending: "Enviando…",
    error: "No pudimos enviar tu mensaje ahora. Inténtalo de nuevo o escríbenos por WhatsApp.",
  },
  footer: {
    tagline: "Código que funciona. Sistemas que crecen. Ingeniería para empresas con prisa.",
    services: "Servicios", company: "Empresa", contact: "Contacto",
    svc: {
      "desenvolvimento-de-software": "Desarrollo",
      "automacao-com-ia": "Automatización IA",
      "integracao-de-sistemas": "Integraciones",
      "dados-e-power-bi": "Datos y Power BI",
    },
    about: "Nosotros", process: "Proceso", transformation: "Antes y después",
    rights: "© 2026 Agência Byte · todos los derechos reservados",
    operational: "● operativo",
  },
};

const DICT = { pt, en, es };

function detectLang() {
  const l = (typeof document !== "undefined" && document.documentElement.lang || "").slice(0, 2).toLowerCase();
  return LANGS.includes(l) ? l : DEFAULT_LANG;
}

export const LANG = detectLang();
export const T = DICT[LANG];

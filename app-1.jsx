/* global React */
const { useState, useEffect, useRef, useMemo } = React;

/* -------------------- helpers -------------------- */

function useReveal(){
  useEffect(() => {
    const t = setTimeout(() => {
      const els = document.querySelectorAll('.reveal, .reveal-stagger');
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      els.forEach(el => io.observe(el));
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, []);
}

function useCounter(target, inView, duration=1400){
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return v;
}

function useInView(ref, opts={ threshold: 0.3 }){
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, opts);
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return v;
}

/* -------------------- Nav -------------------- */

function Nav(){
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-brand-wrap">
          <div className="glyph">
            <picture>
              <source srcSet="/img/logo_byte.webp" type="image/webp" />
              <img src="/img/logo_byte_64.png" alt="Agencia Byte" width="32" height="32" />
            </picture>
          </div>
          <span>Agencia Byte</span>
          {/* <span className="mono" style={{fontSize:11, opacity:.5, marginLeft:6}}>v2.0</span> */}
        </div>
        <nav className="nav-pill">
          <a href="#sobre" className="nav-pill-link">Sobre</a>
          <a href="#transformacao" className="nav-pill-link">Antes e depois</a>
          <a href="#servicos" className="nav-pill-link">Serviços</a>
          <a href="#processo" className="nav-pill-link">Processo</a>
          <a href="#clientes" className="nav-pill-link">Clientes</a>
          <a href="https://blog.agenciabyte.com/" className="nav-pill-link blog-link" target="_blank" rel="noopener noreferrer">Blog</a>
        </nav>
        <div className="nav-cta">
          <a href="#contato" className="btn btn-accent nav-cta-desktop" onClick={close}>Contato →</a>
          <button
            className="nav-burger"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            )}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="nav-mobile-menu" aria-label="Menu de navegação">
          <a href="#sobre" onClick={close}>Sobre</a>
          <a href="#transformacao" onClick={close}>Antes e depois</a>
          <a href="#servicos" onClick={close}>Serviços</a>
          <a href="#processo" onClick={close}>Processo</a>
          <a href="#clientes" onClick={close}>Clientes</a>
          <a href="https://blog.agenciabyte.com/" className="ul-link blog-link" target="_blank" rel="noopener noreferrer" onClick={close}>Blog</a>
          <a href="#contato" className="nav-mobile-cta" onClick={close}>Contato →</a>
        </nav>
      )}
    </header>
  );
}

/* -------------------- Hero -------------------- */

function Hero(){
  return (
    <section style={{paddingTop: 110, paddingBottom: 90, position:'relative', overflow:'hidden'}}>
      <div className="grid-bg" />
      <div className="wrap" style={{position:'relative'}}>
        <div style={{display:'grid', gridTemplateColumns:'minmax(0, 780px)', gap:'56px', alignItems:'center'}} className="hero-grid">
          <div>
            <h1 className="display reveal" style={{fontSize:'clamp(18px, 4.5vw, 52px)', margin:'12px 0 0'}}>
              Automatize o<br/>
              <span style={{color:'var(--accent)'}}>trabalho braçal</span>.<br/>
              Faça sua operação<br/>
              <span style={{position:'relative', display:'inline-block'}}>
                crescer<span style={{color:'var(--accent)'}}>.</span>
                <svg viewBox="0 0 100 7" preserveAspectRatio="none" style={{position:'absolute', left:0, right:0, bottom:'-3px', width:'100%', height:7, overflow:'visible'}}>
                  <path d="M1 5 Q 25 1, 50 4 T 100 6" stroke="var(--accent)" strokeWidth={1.5} fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="reveal muted" style={{fontSize:18, maxWidth:520, marginTop:32, lineHeight:1.55}}>
              Transformamos tarefas repetitivas e processos desconectados em operações inteligentes, integradas e previsíveis. Conectamos seus sistemas, desenhamos integrações sob medida e aplicamos IA diretamente nos fluxos de vendas e gestão. O próximo passo não é trabalhar mais. É automatizar para crescer.
            </p>
            <div className="reveal" style={{display:'flex', gap:12, marginTop:32, flexWrap:'wrap'}}>
              <a href="#contato" className="btn btn-accent">Começar um projeto →</a>
            </div>
            <div className="reveal" style={{marginTop:48, display:'flex', gap:32, flexWrap:'wrap', fontSize:13}}>
              <div><div className="muted mono" style={{fontSize:11, letterSpacing:'.08em', textTransform:'uppercase'}}>Tempo médio</div><div style={{fontWeight:600, fontSize:16, marginTop:4}}>3–6 semanas</div></div>
              <div><div className="muted mono" style={{fontSize:11, letterSpacing:'.08em', textTransform:'uppercase'}}>SLA suporte</div><div style={{fontWeight:600, fontSize:16, marginTop:4}}>&lt; 4h úteis</div></div>
              <div><div className="muted mono" style={{fontSize:11, letterSpacing:'.08em', textTransform:'uppercase'}}>Stack</div><div style={{fontWeight:600, fontSize:16, marginTop:4}}>type-safe ponta a ponta</div></div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 940px){
          .hero-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

const TRANSFORMATION_SYMPTOMS = [
  'ERPs, WMS e planilhas isoladas',
  'Trabalho braçal e repetitivo',
  'Dados espalhados e sem confiança',
  'Pouca inteligência no dia a dia',
  'Custos operacionais inflados',
];

const TRANSFORMATION_BENEFITS = [
  'Fluxos inteligentes e autônomos',
  'Sistemas totalmente sincronizados',
  'IA para conversão e triagem',
  'Dados unificados para decidir rápido',
  'Escala sem aumentar a equipe',
  'Tempo livre para a estratégia',
];

function FlowGlyph({ type }){
  if (type === 'sheet') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h12v15H5zM8 8h6M8 12h6M8 16h4"/><path d="M8 2h11v15"/></svg>;
  if (type === 'mail') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m4 7 8 6 8-6"/></svg>;
  if (type === 'gear') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.2 2.1 2.4.5 1.8-1.2 2.1 2.1-1.2 1.8.5 2.4L21 12l-2.2 1.2-.5 2.4 1.2 1.8-2.1 2.1-1.8-1.2-2.4.5L12 21l-1.2-2.2-2.4-.5-1.8 1.2-2.1-2.1 1.2-1.8-.5-2.4L3 12l2.2-1.2.5-2.4-1.2-1.8 2.1-2.1 1.8 1.2 2.4-.5L12 3Z"/><circle cx="12" cy="12" r="3"/></svg>;
  if (type === 'chart') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-7M20 16v-3"/></svg>;
  if (type === 'plug') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="9" width="8" height="6" rx="1.5"/><rect x="13" y="9" width="8" height="6" rx="1.5"/><path d="M11 12h2M5 9V6M9 9V6M15 15v3M19 15v3"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>;
}

function Transformation(){
  return (
    <section id="transformacao" className="transformation-section section-dark">
      <div className="grid-bg" />
      <div className="wrap transformation-wrap">
        <div className="transformation-heading reveal">
          <div className="eyebrow"><span className="dot pulse-live" style={{'--dot-color':'#F59E0B'}}/>Antes e depois</div>
          <h2 className="display">O processo agora flui.</h2>
          <p>Da operação fragmentada a um ecossistema que conversa, decide e executa.</p>
        </div>
        <div className="transformation-stage reveal-stagger">
          <div className="transformation-panel transformation-before">
            <div className="transformation-kicker mono">01 / cenário de partida</div>
            <h3 className="display">Processos 100%<br/>manuais e desconexos.</h3>
            <div className="fragment-timeline">
              {TRANSFORMATION_SYMPTOMS.map((symptom, index) => <div className="fragment-step" key={symptom}><span className="fragment-index mono">0{index + 1}</span><span className="fragment-node"><FlowGlyph type={['sheet','mail','gear','chart','sheet'][index]} /></span><span>{symptom}</span></div>)}
            </div>
            <div className="transformation-note mono">// cada etapa cria um novo retrabalho</div>
          </div>
          <div className="transformation-bridge" aria-label="A Engenharia da Agência Byte">
            <div className="bridge-lines" aria-hidden="true"><span/></div>
            <div className="bridge-core"><FlowGlyph type="ai" /><span className="mono">BYTE<br/>ENGINE</span></div>
            <div className="bridge-output-line" aria-hidden="true" />
            <div className="bridge-label mono">Automação + IA aplicadas</div>
          </div>
          <div className="transformation-panel transformation-after">
            <div className="transformation-kicker mono">02 / cenário transformado</div>
            <h3 className="display">Operação integrada<br/>e automatizada.</h3>
            <div className="order-flow"><div className="order-line" aria-hidden="true"/><div className="benefit-list">
              {TRANSFORMATION_BENEFITS.map((benefit, index) => <div className="benefit-step" key={benefit}><span className="benefit-node"><FlowGlyph type={['gear','plug','ai','chart','gear','ai'][index]} /></span><span>{benefit}</span><span className="benefit-check" aria-hidden="true">OK</span></div>)}
            </div></div>
            <div className="transformation-note mono">// dados confiáveis · decisão em ritmo real</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- About / Quem Somos -------------------- */

function About(){
  return (
    <section id="sobre" style={{borderTop:'1px solid var(--line)'}}>
      <div className="wrap">
        <div style={{display:'grid', gridTemplateColumns:'minmax(0, 380px) 1fr', gap: 80}} className="about-grid">
          <div>
            <div className="eyebrow"><span className="dot pulse-live" style={{'--dot-color': '#F59E0B'}}/>Quem Somos</div>
            <h2 className="display" style={{fontSize:'clamp(40px, 5vw, 64px)', marginTop:18}}>
              Tecnologia<br/>como vantagem<br/>competitiva.
            </h2>
          </div>
          <div className="reveal-stagger" style={{display:'grid', gap:24, alignContent:'start'}}>
            <p style={{fontSize:18, lineHeight:1.6, margin:0, maxWidth:640}}>
              Somos especialistas em <strong>desenvolvimento de sistemas</strong>, <strong>automações com IA</strong> e <strong>consultoria técnica</strong>. Trabalhamos com startups, PMEs e grandes empresas que têm pressa em crescer.
            </p>
            <p className="muted" style={{fontSize:16, lineHeight:1.65, margin:0, maxWidth:640}}>
              Não revendemos soluções prontas. Cada projeto é único — desenhamos a arquitetura certa, escolhemos a stack ideal e entregamos código de qualidade com suporte contínuo.
            </p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16, marginTop:12}} className="about-cards">
              <div className="card" style={{padding:22}}>
                <div style={{fontWeight:600, fontSize:18}}>IA & Automação</div>
                <div className="muted" style={{fontSize:14, marginTop:6}}>Inteligência que trabalha 24/7 — LLMs, agents, pipelines de dados.</div>
              </div>
              <div className="card" style={{padding:22}}>
                <div style={{fontWeight:600, fontSize:18}}>Sem terceirização</div>
                <div className="muted" style={{fontSize:14, marginTop:6}}>Código escrito e mantido pelo nosso time, do primeiro commit ao deploy.</div>
              </div>
              <div className="card" style={{padding:22}}>
                <div style={{fontWeight:600, fontSize:18}}>Type-safe ponta a ponta</div>
                <div className="muted" style={{fontSize:14, marginTop:6}}>TypeScript da API ao frontend — menos bugs, refactor com confiança.</div>
              </div>
              <div className="card" style={{padding:22}}>
                <div style={{fontWeight:600, fontSize:18}}>Suporte contínuo</div>
                <div className="muted" style={{fontSize:14, marginTop:6}}>SLA &lt; 4h úteis. Evoluímos o sistema com você após o go-live.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 880px){
          .about-grid{ grid-template-columns: 1fr !important; gap: 32px !important; }
          .about-cards{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* -------------------- Services -------------------- */

const SERVICES = [
  {
    code: '01',
    title: 'Desenvolvimento de Software Sob Medida',
    pitch: 'Web apps, dashboards internos, APIs e portais. Frontend e backend.',
    desc: 'Desenvolvemos soluções personalizadas que digitalizam processos específicos e se integram ao ecossistema da empresa, com entregas iterativas e foco em qualidade.',
    bullets: ['Next.js + TypeScript', 'PostgreSQL · Supabase', 'Auth, billing, multi-tenant', 'Testes E2E + CI/CD'],
    icon: 'code',
  },
  {
    code: '02',
    title: 'Automação com IA',
    pitch: 'Agents, classificação, extração de documentos, atendimento 24/7.',
    desc: 'Desenvolvemos automações de processos utilizando inteligência artificial para classificar documentos, automatizar tarefas repetitivas, conectar fluxos de trabalho e criar atendimentos inteligentes.',
    bullets: ['LLM-ops com fallback', 'RAG sobre seus dados', 'Workflows com aprovação', 'Custo por execução previsível'],
    icon: 'spark',
  },
  {
    code: '03',
    title: 'Integração de Sistemas',
    pitch: 'Conectar tudo o que sua empresa já usa. Sem retrabalho manual.',
    desc: 'Conectamos ERPs, CRMs e APIs para sincronizar sistemas, reduzir processos manuais e eliminar erros de integração.',
    bullets: ['CRM, ERP, e-commerce', 'Webhooks bidirecionais', 'Sync incremental', 'Observabilidade nativa'],
    icon: 'plug',
  },
  {
    code: '04',
    title: 'Dados e Dashboards',
    pitch: 'Pipelines, BI e modelos prontos para a próxima decisão.',
    desc: 'Implementamos pipelines de dados, dashboards e soluções de Business Intelligence, incluindo Power BI, para transformar dados operacionais em indicadores acionáveis.',
    bullets: ['ETL/ELT · dbt', 'Power BI | Dashboards', 'Métricas confiáveis', 'Alertas que importam'],
    icon: 'graph',
  },
];

function ServiceIcon({ name }){
  const c = 'var(--ink-2)';
  const stroke = 1.6;
  if (name === 'code') return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 8 4 12l5 4M15 8l5 4-5 4M13 5l-2 14" stroke={c} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/></svg>);
  if (name === 'spark') return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" stroke={c} strokeWidth={stroke} strokeLinecap="round"/><circle cx="12" cy="12" r="3" stroke={c} strokeWidth={stroke}/></svg>);
  if (name === 'plug') return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="9" width="8" height="6" rx="1.5" stroke={c} strokeWidth={stroke}/><rect x="13" y="9" width="8" height="6" rx="1.5" stroke={c} strokeWidth={stroke}/><path d="M11 12h2M5 9V6M9 9V6M15 15v3M19 15v3" stroke={c} strokeWidth={stroke} strokeLinecap="round"/></svg>);
  return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 20h18M5 20V10M11 20V4M17 20v-7" stroke={c} strokeWidth={stroke} strokeLinecap="round"/></svg>);
}

function Services(){
  return (
    <section id="servicos">
      <div className="wrap">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:32, flexWrap:'wrap', marginBottom:48}}>
          <div style={{maxWidth:680}}>
            <div className="eyebrow"><span className="dot pulse-live" style={{'--dot-color': '#8B5CF6'}}/>Serviços</div>
            <h2 className="display" style={{fontSize:'clamp(40px, 5vw, 64px)', marginTop:18}}>
              Soluções de tecnologia para empresas
            </h2>
          </div>
          <div className="muted mono" style={{fontSize:13, maxWidth:300}}>
            // do diagnóstico ao deploy<br/>
            // sem terceirização, sem revenda
          </div>
        </div>
        <div className="reveal-stagger" style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:20}}>
          {SERVICES.map(s => (
            <div key={s.code} className="card" style={{padding:'32px 32px 28px'}}>
              <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom: 18}}>
                <ServiceIcon name={s.icon}/>
                <span className="mono muted" style={{fontSize:12}}>// {s.code}</span>
              </div>
              <h3 style={{fontSize:24, fontFamily:'var(--font-display)', letterSpacing:'-0.01em', margin:'0 0 8px', fontWeight:600}}>{s.title}</h3>
              <p className="muted" style={{margin:0, fontSize:15, lineHeight: 1.55}}>{s.desc}</p>
              <ul style={{listStyle:'none', padding:0, margin:'18px 0 0', display:'grid', gap:8}}>
                {s.bullets.map(b => (
                  <li key={b} className="mono" style={{fontSize:13, color:'var(--ink-2)', display:'flex', gap:10}}>
                    <span style={{color:'var(--ink-3)'}}>›</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 880px){
          #servicos .reveal-stagger{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

window.AB = window.AB || {};
Object.assign(window.AB, { Nav, Hero, Transformation, About, Services, useReveal, useCounter, useInView });

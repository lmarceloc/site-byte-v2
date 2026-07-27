/* global React */
const { useState, useEffect, useRef, useMemo } = React;

/* -------------------- helpers -------------------- */

function useReveal(){
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-stagger');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
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

function Nav({ onContact }){
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">
          <div className="glyph">
            <picture>
              <source srcSet="img/logo_byte.webp" type="image/webp" />
              <img src="img/logo_byte_64.png" alt="Agencia Byte" width="32" height="32" />
            </picture>
          </div>
          <span>Agencia Byte</span>
          <span className="mono" style={{fontSize:11, opacity:.5, marginLeft:6}}>v2.0</span>
        </div>
        <nav className="nav-links">
          <a href="#sobre" className="ul-link">Sobre</a>
          <a href="#servicos" className="ul-link">Serviços</a>
          <a href="#processo" className="ul-link">Processo</a>
          <a href="#stack" className="ul-link">Stack</a>
          <a href="#clientes" className="ul-link">Clientes</a>
          <a href="https://blog.agenciabyte.com/" className="ul-link" target="_blank" rel="noopener noreferrer">Blog</a>
        </nav>
        <div className="nav-cta">
          <button className="btn btn-accent nav-cta-desktop" onClick={onContact}>Contato →</button>
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
          <a href="#servicos" onClick={close}>Serviços</a>
          <a href="#processo" onClick={close}>Processo</a>
          <a href="#stack" onClick={close}>Stack</a>
          <a href="#clientes" onClick={close}>Clientes</a>
          <a href="https://blog.agenciabyte.com/" target="_blank" rel="noopener noreferrer" onClick={close}>Blog</a>
          <a href="#contato" className="nav-mobile-cta" onClick={close}>Contato →</a>
        </nav>
      )}
    </header>
  );
}

/* -------------------- Hero — Terminal variant -------------------- */

function HeroTerminal(){
  const lines = [
    { t: 800,  html: '<span class="prompt">byte@agency</span> <span class="dim">~/projects</span> <span class="arrow">$</span> deploy --target=production' },
    { t: 600,  html: '<span class="dim">› compiling sistema...</span>' },
    { t: 700,  html: '<span class="dim">› running tests</span>     <span class="ok">✓ 247 passed</span>' },
    { t: 700,  html: '<span class="dim">› bundling</span>          <span class="ok">✓ 1.4 MB</span>' },
    { t: 700,  html: '<span class="dim">› deploying to edge</span> <span class="ok">✓ 12 regions</span>' },
    { t: 600,  html: '<span class="ok">✓</span> live in <span class="acc">2.8s</span> · 0 downtime' },
  ];
  const [shown, setShown] = useState([]);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [shown]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId;
    const step = (i, current) => {
      if (cancelled) return;
      if (i >= lines.length){
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          setShown([]);
          step(0, []);
        }, 4000);
        return;
      }
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        const next = [...current, lines[i].html];
        setShown(next);
        step(i + 1, next);
      }, lines[i].t);
    };
    step(0, []);
    return () => { cancelled = true; clearTimeout(timeoutId); };
  }, []);

  return (
    <div className="term" style={{height: 230, display:'flex', flexDirection:'column'}}>
      <div className="term-bar">
        <div className="dot d1" /><div className="dot d2" /><div className="dot d3" />
        <div className="title">~/agencia-byte/sistema · zsh</div>
      </div>
      <div ref={bodyRef} className="term-body">
        {shown.map((h, idx) => (
          <span key={idx} className="ln" dangerouslySetInnerHTML={{__html: h}} />
        ))}
        <span className="ln"><span className="prompt">byte@agency</span> <span className="arrow">$</span> <span className="cursor"/></span>
      </div>
    </div>
  );
}

/* -------------------- Hero -------------------- */

function Hero(){
  return (
    <section style={{paddingTop: 80, paddingBottom: 90, position:'relative', overflow:'hidden'}}>
      <div className="grid-bg" />
      <div className="wrap" style={{position:'relative'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.05fr 1fr', gap:'56px', alignItems:'center'}} className="hero-grid">
          <div>
            <h1 className="display reveal" style={{fontSize:'clamp(36px, 9vw, 104px)', margin:'24px 0 0'}}>
              Código que<br/>
              <span style={{color:'var(--accent)'}}>funciona</span>.<br/>
              Sistemas que<br/>
              <span style={{position:'relative', display:'inline-block'}}>
                crescem<span style={{color:'var(--accent)'}}>.</span>
                <svg viewBox="0 0 200 14" preserveAspectRatio="none" style={{position:'absolute', left:0, right:0, bottom:'-6px', width:'100%', height:14, overflow:'visible'}}>
                  <path d="M2 10 Q 50 2, 100 8 T 198 6" stroke="var(--accent)" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="reveal muted" style={{fontSize:18, maxWidth:520, marginTop:32, lineHeight:1.55}}>
              Somos a agência que transforma gargalos em eficiência através de IA e desenvolvimento sob medida de software de alta velocidade.
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
          <div className="reveal" style={{transitionDelay:'.15s'}}>
            <HeroTerminal/>
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

/* -------------------- About / Quem Somos -------------------- */

function About(){
  return (
    <section id="sobre" style={{borderTop:'1px solid var(--line)'}}>
      <div className="wrap">
        <div style={{display:'grid', gridTemplateColumns:'minmax(0, 380px) 1fr', gap: 80}} className="about-grid">
          <div>
            <div className="eyebrow"><span className="dot"/>01 · Quem Somos</div>
            <h2 className="display" style={{fontSize:'clamp(40px, 5vw, 64px)', marginTop:18}}>
              Engenharia<br/>como vantagem<br/>competitiva.
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
    title: 'Desenvolvimento sob medida',
    pitch: 'Web apps, dashboards internos, APIs e portais. Frontend e backend.',
    bullets: ['Next.js + TypeScript', 'PostgreSQL · Supabase', 'Auth, billing, multi-tenant', 'Testes E2E + CI/CD'],
    icon: 'code',
  },
  {
    code: '02',
    title: 'Automação com IA',
    pitch: 'Agents, classificação, extração de documentos, atendimento 24/7.',
    bullets: ['LLM-ops com fallback', 'RAG sobre seus dados', 'Workflows com aprovação', 'Custo por execução previsível'],
    icon: 'spark',
  },
  {
    code: '03',
    title: 'Integrações',
    pitch: 'Conectar tudo o que sua empresa já usa. Sem retrabalho manual.',
    bullets: ['CRM, ERP, e-commerce', 'Webhooks bidirecionais', 'Sync incremental', 'Observabilidade nativa'],
    icon: 'plug',
  },
  {
    code: '04',
    title: 'Dados',
    pitch: 'Pipelines, BI e modelos prontos para a próxima decisão.',
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
            <div className="eyebrow"><span className="dot"/>02 · Serviços</div>
            <h2 className="display" style={{fontSize:'clamp(40px, 5vw, 64px)', marginTop:18}}>
              Quatro frentes.<br/>Um problema por vez.
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
              <p className="muted" style={{margin:0, fontSize:15}}>{s.pitch}</p>
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
Object.assign(window.AB, { Nav, Hero, About, Services, useReveal, useCounter, useInView });

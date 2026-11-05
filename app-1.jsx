/* global React */
import { T, LANG } from "./i18n/home.jsx";
import { LANGS, LANG_META, ROUTES, FLAGS, SWITCH_LABEL, svcRoute } from "./i18n/routes.mjs";
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

/* -------------------- Seletor de idioma -------------------- */

const Flag = ({ lang }) => <span className="lang-flag" dangerouslySetInnerHTML={{ __html: FLAGS[lang] }} />;

function LangSwitch(){
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const onDown = (e) => { if (el && el.open && !el.contains(e.target)) el.open = false; };
    const onKey = (e) => { if (e.key === 'Escape' && el && el.open) { el.open = false; el.querySelector('summary').focus(); } };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);
  // As seções da home têm os mesmos ids nos três idiomas: leva o #âncora junto.
  const go = (e) => { if (location.hash) e.currentTarget.href += location.hash; };
  return (
    <details className="lang-switch" ref={ref}>
      <summary aria-label={`${SWITCH_LABEL[LANG]}: ${LANG_META[LANG].name}`}>
        <Flag lang={LANG} />
        <span className="lang-code">{LANG_META[LANG].short}</span>
        <svg className="lang-chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </summary>
      <ul className="lang-menu">
        {LANGS.map(l => (
          <li key={l}>
            <a href={ROUTES.home[l]} hrefLang={LANG_META[l].hreflang} lang={LANG_META[l].html} aria-current={l === LANG ? 'true' : undefined} onClick={go}>
              <Flag lang={l} />{LANG_META[l].name}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

/* -------------------- Nav -------------------- */

function Nav(){
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const n = T.nav;

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-brand-wrap">
          <div className="glyph">
            <picture>
              <source srcSet="/img/logo_byte.webp" type="image/webp" />
              <img src="/img/logo_byte_64.png" alt="Agência Byte" width="32" height="32" />
            </picture>
          </div>
          <span>Agência Byte</span>
        </div>
        <nav className="nav-pill">
          <a href="#sobre" className="nav-pill-link">{n.about}</a>
          <a href="#transformacao" className="nav-pill-link">{n.transformation}</a>
          <a href="#servicos" className="nav-pill-link">{n.services}</a>
          <a href="#processo" className="nav-pill-link">{n.process}</a>
          <a href="#clientes" className="nav-pill-link">{n.clients}</a>
          <a href="https://blog.agenciabyte.com/" className="nav-pill-link blog-link" target="_blank" rel="noopener noreferrer">Blog</a>
        </nav>
        <div className="nav-cta">
          <LangSwitch />
          <a href="#contato" className="btn btn-accent nav-cta-desktop" onClick={close}>{n.contact}</a>
          <button
            className="nav-burger"
            aria-label={menuOpen ? n.menuClose : n.menuOpen}
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
        <nav className="nav-mobile-menu" aria-label={n.menuLabel}>
          <a href="#sobre" onClick={close}>{n.about}</a>
          <a href="#transformacao" onClick={close}>{n.transformation}</a>
          <a href="#servicos" onClick={close}>{n.services}</a>
          <a href="#processo" onClick={close}>{n.process}</a>
          <a href="#clientes" onClick={close}>{n.clients}</a>
          <a href="https://blog.agenciabyte.com/" className="ul-link blog-link" target="_blank" rel="noopener noreferrer" onClick={close}>Blog</a>
          <a href="#contato" className="nav-mobile-cta" onClick={close}>{n.contact}</a>
        </nav>
      )}
    </header>
  );
}

/* -------------------- Hero -------------------- */

/* Teste A/B do título do hero. Variante fixa por visitante (localStorage);
   ?v=a|b força uma variante para pré-visualizar. Eventos vão para o GA4. */
const HERO_VARIANTS = ['a', 'b'];
function pickHeroVariant(){
  try {
    const forced = new URLSearchParams(location.search).get('v');
    if (HERO_VARIANTS.includes(forced)) return forced;
  } catch (e) {}
  try {
    const saved = localStorage.getItem('ab_hero');
    if (HERO_VARIANTS.includes(saved)) return saved;
  } catch (e) {}
  const v = HERO_VARIANTS[Math.floor(Math.random() * HERO_VARIANTS.length)];
  try { localStorage.setItem('ab_hero', v); } catch (e) {}
  return v;
}
function trackHero(name, variant){
  if (typeof window.gtag === 'function') window.gtag('event', name, { hero_variant: variant, language: LANG });
}

function HeroTitle({ variant }){
  if (variant === 'b') return (
    <>
      {T.hero.titleB[0]}<br/>
      {T.hero.titleB[1]}{' '}
      <span style={{position:'relative', display:'inline-block'}}>
        {T.hero.titleB[2]}<span style={{color:'var(--accent)'}}>.</span>
        <svg viewBox="0 0 100 7" preserveAspectRatio="none" style={{position:'absolute', left:0, right:0, bottom:'-3px', width:'100%', height:7, overflow:'visible'}}>
          <path d="M1 5 Q 25 1, 50 4 T 100 6" stroke="var(--accent)" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </svg>
      </span>
    </>
  );
  return (
    <>
      {T.hero.titleA[0]}<br/>
      <span style={{color:'var(--accent)'}}>{T.hero.titleA[1]}</span>.
    </>
  );
}

function Hero(){
  const [variant] = React.useState(pickHeroVariant);
  React.useEffect(() => { trackHero('hero_view', variant); }, [variant]);
  return (
    <section style={{paddingTop: 110, paddingBottom: 90, position:'relative', overflow:'hidden'}}>
      <div className="grid-bg" />
      <div className="wrap" style={{position:'relative'}}>
        <div style={{display:'grid', gridTemplateColumns:'minmax(0, 780px)', gap:'56px', alignItems:'center'}} className="hero-grid">
          <div>
            <h1 className="display reveal" style={{fontSize:'clamp(18px, 4.5vw, 52px)', margin:'12px 0 0'}}>
              <HeroTitle variant={variant} />
            </h1>
            <p className="reveal muted" style={{fontSize:18, maxWidth:520, marginTop:32, lineHeight:1.55}}>
              {T.hero.lead}
            </p>
            <div className="reveal" style={{display:'flex', gap:12, marginTop:32, flexWrap:'wrap'}}>
              <a href="#contato" className="btn btn-accent" onClick={() => trackHero('hero_cta_click', variant)}>{T.hero.cta}</a>
            </div>
            <div className="reveal" style={{marginTop:48, display:'flex', gap:32, flexWrap:'wrap', fontSize:13}}>
              {T.hero.stats.map(([label, value]) => (
                <div key={label}><div className="muted mono" style={{fontSize:11, letterSpacing:'.08em', textTransform:'uppercase'}}>{label}</div><div style={{fontWeight:600, fontSize:16, marginTop:4}}>{value}</div></div>
              ))}
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
          <div className="eyebrow"><span className="dot pulse-live" style={{'--dot-color':'#F59E0B'}}/>{T.transformation.eyebrow}</div>
          <h2 className="display">{T.transformation.title}</h2>
          <p>{T.transformation.sub}</p>
        </div>
        <div className="transformation-stage reveal-stagger">
          <div className="transformation-panel transformation-before">
            <div className="transformation-kicker mono">{T.transformation.beforeKicker}</div>
            <h3 className="display">{T.transformation.beforeTitle}</h3>
            <div className="fragment-timeline">
              {T.transformation.symptoms.map((symptom, index) => <div className="fragment-step" key={symptom}><span className="fragment-index mono">0{index + 1}</span><span className="fragment-node"><FlowGlyph type={['sheet','mail','gear','chart','sheet'][index]} /></span><span>{symptom}</span></div>)}
            </div>
            <div className="transformation-note mono">{T.transformation.beforeNote}</div>
          </div>
          <div className="transformation-bridge" aria-label={T.transformation.bridgeAria}>
            <div className="bridge-lines" aria-hidden="true"><span/></div>
            <div className="bridge-core"><FlowGlyph type="ai" /><span className="mono">BYTE<br/>ENGINE</span></div>
            <div className="bridge-output-line" aria-hidden="true" />
            <div className="bridge-label mono">{T.transformation.bridgeLabel}</div>
          </div>
          <div className="transformation-panel transformation-after">
            <div className="transformation-kicker mono">{T.transformation.afterKicker}</div>
            <h3 className="display">{T.transformation.afterTitle}</h3>
            <div className="order-flow"><div className="order-line" aria-hidden="true"/><div className="benefit-list">
              {T.transformation.benefits.map((benefit, index) => <div className="benefit-step" key={benefit}><span className="benefit-node"><FlowGlyph type={['gear','plug','ai','chart','gear','ai'][index]} /></span><span>{benefit}</span><span className="benefit-check" aria-hidden="true">OK</span></div>)}
            </div></div>
            <div className="transformation-note mono">{T.transformation.afterNote}</div>
          </div>
        </div>
        <div style={{marginTop:32, textAlign:'center'}}>
          <a href={ROUTES.transformation[LANG]} className="ul-link mono" style={{fontSize:14, textDecoration:'none', color:'var(--dark-ink)'}}>{T.transformation.more}</a>
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
            <div className="eyebrow"><span className="dot pulse-live" style={{'--dot-color': '#F59E0B'}}/>{T.about.eyebrow}</div>
            <h2 className="display" style={{fontSize:'clamp(40px, 5vw, 64px)', marginTop:18}}>
              {T.about.title}
            </h2>
          </div>
          <div className="reveal-stagger" style={{display:'grid', gap:24, alignContent:'start'}}>
            <p style={{fontSize:18, lineHeight:1.6, margin:0, maxWidth:640}}>
              {T.about.p1}
            </p>
            <p className="muted" style={{fontSize:16, lineHeight:1.65, margin:0, maxWidth:640}}>
              {T.about.p2}
            </p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16, marginTop:12}} className="about-cards">
              {T.about.cards.map(([title, text]) => (
                <div key={title} className="card" style={{padding:22}}>
                  <div style={{fontWeight:600, fontSize:18}}>{title}</div>
                  <div className="muted" style={{fontSize:14, marginTop:6}}>{text}</div>
                </div>
              ))}
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

const SERVICE_DEFS = [
  { code: '01', slug: 'desenvolvimento-de-software', icon: 'code' },
  { code: '02', slug: 'automacao-com-ia', icon: 'spark' },
  { code: '03', slug: 'integracao-de-sistemas', icon: 'plug' },
  { code: '04', slug: 'dados-e-power-bi', icon: 'graph' },
];
const SERVICES = SERVICE_DEFS.map(d => ({ ...d, href: svcRoute(d.slug, LANG), ...T.services.items[d.slug] }));

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
            <div className="eyebrow"><span className="dot pulse-live" style={{'--dot-color': '#8B5CF6'}}/>{T.services.eyebrow}</div>
            <h2 className="display" style={{fontSize:'clamp(40px, 5vw, 64px)', marginTop:18}}>
              {T.services.title}
            </h2>
          </div>
          <div className="muted mono" style={{fontSize:13, maxWidth:300}}>
            {T.services.note[0]}<br/>
            {T.services.note[1]}
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
              <a href={s.href} className="ul-link mono" style={{display:'inline-block', marginTop:22, fontSize:13, textDecoration:'none', color:'var(--ink)'}}>{s.more} →</a>
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
Object.assign(window.AB, { LangSwitch, Nav, Hero, Transformation, About, Services, useReveal, useCounter, useInView });

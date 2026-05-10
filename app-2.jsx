/* global React, AB */
const { useState: useState2, useEffect: useEffect2, useRef: useRef2 } = React;

/* -------------------- Live Demo (automation pipeline) -------------------- */

const PIPE_STAGES = [
  { key: 'webhook', label: 'Webhook', sub: 'POST /lead', color: '#5DD3A8' },
  { key: 'classify', label: 'IA · Classificar', sub: 'GPT-5 · score fit', color: '#8AB4F8' },
  { key: 'enrich',  label: 'Enriquecer', sub: 'Entender mais do Lead', color: '#C792EA' },
  { key: 'route',   label: 'Roteamento', sub: 'fit > 0.7 → hot', color: '#FFD79A' },
  { key: 'notify',  label: 'Notificar', sub: 'Slack · CRM · Email', color: '#FF8A4C' },
];

const SAMPLE_LEADS = [
  { name: 'Marina S.', co: 'Helio Studio', mrr: 'R$ 28k', fit: 0.82, hot: true },
  { name: 'João P.',   co: 'Núcleo Tech',  mrr: 'R$ 12k', fit: 0.61, hot: false },
  { name: 'Larissa V.',co: 'Quanta Lab',   mrr: 'R$ 84k', fit: 0.91, hot: true },
  { name: 'Rafa M.',   co: 'Onda PME',     mrr: 'R$  6k', fit: 0.42, hot: false },
  { name: 'Camila R.', co: 'Grão Foods',   mrr: 'R$ 36k', fit: 0.74, hot: true },
];

function Demo(){
  const [active, setActive] = useState2(0);
  const [leadIdx, setLeadIdx] = useState2(0);
  const [log, setLog] = useState2([]);
  const [counts, setCounts] = useState2({ runs: 12847, hot: 4291, latency: 178 });
  const lead = SAMPLE_LEADS[leadIdx];

  useEffect2(() => {
    const totalStages = PIPE_STAGES.length;
    const id = setInterval(() => {
      setActive(a => {
        const next = (a + 1) % (totalStages + 2);
        if (next === 0){
          setLeadIdx(li => (li + 1) % SAMPLE_LEADS.length);
          setCounts(c => ({
            runs: c.runs + 1,
            hot: c.hot + (SAMPLE_LEADS[(leadIdx+1) % SAMPLE_LEADS.length].hot ? 1 : 0),
            latency: 150 + Math.round(Math.random()*70),
          }));
        }
        if (next < totalStages){
          setLog(l => {
            const stage = PIPE_STAGES[next];
            const entry = { ts: nowStr(), stage: stage.label, lead: SAMPLE_LEADS[leadIdx].name };
            return [entry, ...l].slice(0, 8);
          });
        }
        return next;
      });
    }, 900);
    return () => clearInterval(id);
  }, [leadIdx]);

  return (
    <section id="demo" className="section-dark" style={{overflow:'hidden'}}>
      <div className="grid-bg" />
      <div className="wrap" style={{position:'relative'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:32, flexWrap:'wrap', marginBottom:48}}>
          <div style={{maxWidth:680}}>
            <div className="eyebrow"><span className="dot"/>03 · Demo ao vivo</div>
            <h2 className="display" style={{fontSize:'clamp(40px, 5vw, 64px)', marginTop:18}}>
              Uma automação<br/>rodando agora.
            </h2>
            <p className="muted" style={{fontSize:18, maxWidth:560, marginTop:18}}>
              Lead entra, IA classifica, sistema enriquece, roteia para o time certo. Em <span style={{color:'var(--accent)'}}>menos de 200ms</span>. Reduza horas de planilha em segundos de pipeline.
            </p>
          </div>
          <div className="chip" style={{background:'rgba(255,255,255,0.04)', borderColor:'rgba(255,255,255,0.12)'}}>
            <span className="pulse"/> live · processando lead #{counts.runs.toLocaleString('pt-BR')}
          </div>
        </div>

        <div className="card" style={{background:'rgba(255,255,255,0.025)', borderColor:'rgba(255,255,255,0.10)', padding:32}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:0, position:'relative'}} className="pipe-grid">
            {PIPE_STAGES.map((s, i) => {
              const isActive = active === i;
              const isPast = active > i;
              return (
                <div key={s.key} style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'8px 8px 0'}}>
                  {i < PIPE_STAGES.length - 1 && (
                    <div style={{position:'absolute', top:34, left:'60%', right:'-40%', height:2, background:'rgba(255,255,255,0.10)', overflow:'hidden'}} className="pipe-conn">
                      <div style={{
                        position:'absolute', top:0, left:0, height:'100%', width: '40%',
                        background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
                        transform: `translateX(${isActive ? '180%' : '-100%'})`,
                        transition: 'transform .8s ease-in-out',
                      }}/>
                    </div>
                  )}
                  <div style={{
                    width:64, height:64, borderRadius:14,
                    background: isActive ? s.color : (isPast ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)'),
                    border: `1px solid ${isActive ? s.color : 'rgba(255,255,255,0.10)'}`,
                    color: isActive ? '#0B1020' : (isPast ? s.color : 'rgba(255,255,255,0.5)'),
                    display:'grid', placeItems:'center',
                    fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600,
                    transition:'all .35s ease',
                    boxShadow: isActive ? `0 0 0 6px ${s.color}22, 0 0 24px ${s.color}66` : 'none',
                    zIndex: 2,
                  }}>
                    {String(i+1).padStart(2,'0')}
                  </div>
                  <div style={{fontWeight:600, fontSize:14, marginTop:14}}>{s.label}</div>
                  <div className="muted mono" style={{fontSize:11, marginTop:4}}>{s.sub}</div>
                </div>
              );
            })}
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:24, marginTop:40}} className="demo-bottom">
            <div style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'18px 20px'}}>
              <div className="mono muted" style={{fontSize:11, letterSpacing:'.08em'}}>// LEAD ATUAL</div>
              <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginTop:10}}>
                <div style={{fontWeight:600, fontSize:18}}>{lead.name}</div>
                <div className="mono" style={{fontSize:12, color: lead.hot ? '#5DD3A8' : 'rgba(255,255,255,0.5)'}}>
                  {lead.hot ? '● HOT' : '○ NURTURE'}
                </div>
              </div>
              <div className="muted" style={{fontSize:13, marginTop:2}}>{lead.co}</div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:14}}>
                <div>
                  <div className="muted mono" style={{fontSize:10, letterSpacing:'.08em'}}>RECEITA</div>
                  <div className="mono" style={{fontSize:14, fontWeight:600, marginTop:2}}>{lead.mrr}</div>
                </div>
                <div>
                  <div className="muted mono" style={{fontSize:10, letterSpacing:'.08em'}}>FIT SCORE</div>
                  <div style={{display:'flex', alignItems:'center', gap:8, marginTop:4}}>
                    <div style={{flex:1, height:5, background:'rgba(255,255,255,0.08)', borderRadius:4, overflow:'hidden'}}>
                      <div style={{width:`${lead.fit*100}%`, height:'100%', background:'var(--accent)', transition:'width .5s'}} />
                    </div>
                    <span className="mono" style={{fontSize:12, fontWeight:600}}>{lead.fit.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'14px 18px', minHeight: 192, fontFamily:'var(--font-mono)', fontSize:12, lineHeight:1.7}}>
              <div className="mono muted" style={{fontSize:11, letterSpacing:'.08em', marginBottom:8}}>// EVENT LOG</div>
              {log.length === 0 && <div className="muted">aguardando eventos…</div>}
              {log.map((l, i) => (
                <div key={i} style={{opacity: 1 - i*0.1}}>
                  <span style={{color:'rgba(255,255,255,0.4)'}}>{l.ts}</span>{' '}
                  <span style={{color:'var(--accent)'}}>›</span>{' '}
                  <span>{l.stage}</span>{' '}
                  <span className="muted">— {l.lead}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:0, marginTop:32, borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:24}}>
            <KPI label="execuções hoje" value={counts.runs.toLocaleString('pt-BR')} />
            <KPI label="leads hot identificados" value={counts.hot.toLocaleString('pt-BR')} />
            <KPI label="latência média" value={`${counts.latency}ms`} />
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 880px){
          .pipe-grid{ grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; }
          .pipe-conn{ display:none; }
          .demo-bottom{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function KPI({ label, value }){
  return (
    <div style={{padding:'0 12px'}}>
      <div className="mono" style={{fontSize:11, letterSpacing:'.08em', color:'rgba(255,255,255,0.5)'}}>{label}</div>
      <div className="display" style={{fontSize:36, marginTop:6, fontVariantNumeric:'tabular-nums'}}>{value}</div>
    </div>
  );
}

function nowStr(){
  const d = new Date();
  const p = (n) => String(n).padStart(2,'0');
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/* -------------------- Process -------------------- */

const PROCESS = [
  { code: '01', t: 'Descoberta', d: 'Entendemos seu negócio, desafios, objetivos e visão de futuro. 1–2 sessões.', dur: '2 a 3 dias' },
  { code: '02', t: 'Estratégia', d: 'Proposta técnica, stack recomendada, cronograma e investimento claro.', dur: '2 a 4 dias' },
  { code: '03', t: 'Desenvolvimento', d: 'Sprints iterativas, entregas parciais, você acompanha tudo em ambiente staging.', dur: '3 a 5 semanas' },
  { code: '04', t: 'Validação', d: 'Testes rigorosos, ajustes finais e aprovação. QA, segurança, performance.', dur: '1 semana' },
  { code: '05', t: 'Suporte', d: 'Deploy, documentação, treinamento e evolução contínua.', dur: 'contínuo' },
];

function Process(){
  return (
    <section id="processo" style={{overflow:'hidden'}}>
      <div className="wrap">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:32, flexWrap:'wrap', marginBottom:48}}>
          <div style={{maxWidth:680}}>
            <div className="eyebrow"><span className="dot"/>04 · Processo</div>
            <h2 className="display" style={{fontSize:'clamp(40px, 5vw, 64px)', marginTop:18}}>
              5 etapas.
            </h2>
            <p className="muted" style={{fontSize:18, maxWidth:560, marginTop:18}}>
              Você acompanha cada etapa, cada decisão técnica, cada entrega. Sem surpresas no orçamento.
            </p>
          </div>
        </div>

        <div className="reveal-stagger" style={{position:'relative', display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap: 16}} id="processGrid">
          {PROCESS.map((p, i) => (
            <div key={p.code} className="card" style={{padding:'24px 22px 26px', position:'relative'}}>
              <div className="display" style={{fontSize:48, color:'var(--accent)', lineHeight:1}}>{p.code}</div>
              <div style={{fontWeight:600, fontSize:18, marginTop:18, fontFamily:'var(--font-display)'}}>{p.t}</div>
              <div className="muted" style={{fontSize:14, marginTop:8, lineHeight:1.55}}>{p.d}</div>
              <div style={{marginTop:18, paddingTop:14, borderTop:'1px solid var(--line)'}}>
                <span className="mono" style={{fontSize:11, color:'var(--ink-3)', letterSpacing:'.06em'}}>⏱ {p.dur}</span>
              </div>
              {i < PROCESS.length - 1 && (
                <div className="proc-arrow" aria-hidden="true" style={{
                  position:'absolute', top:'50%', right:-14, transform:'translateY(-50%)',
                  color:'var(--accent)', fontFamily:'var(--font-mono)', fontSize:18, fontWeight:600,
                  zIndex:1, background:'var(--bg)', padding:'2px 4px',
                }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 980px){
          #processGrid{ grid-template-columns: repeat(2, 1fr) !important; }
          .proc-arrow{ display: none; }
        }
        @media (max-width: 540px){
          #processGrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* -------------------- Stack -------------------- */

const STACK = [
  ['Frontend', ['React','Next.js','Tailwind','Three.js']],
  ['Backend', ['Node.js','FastAPI','Postgres','Redis']],
  ['IA / ML', ['OpenAI','Anthropic','LangChain','pgvector']],
  ['Infra', ['Docker','Vercel','Cloudflare','Supabase']],
];

function Stack(){
  return (
    <section id="stack" style={{borderTop:'1px solid var(--line)'}}>
      <div className="wrap">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:32, flexWrap:'wrap', marginBottom:48}}>
          <div style={{maxWidth:680}}>
            <div className="eyebrow"><span className="dot"/>05 · Stack</div>
            <h2 className="display" style={{fontSize:'clamp(40px, 5vw, 64px)', marginTop:18}}>
              A ferramenta certa<br/>para cada problema.
            </h2>
          </div>
          <div className="muted mono" style={{fontSize:13, maxWidth:340}}>
            // tecnologia é meio, não fim<br/>
            // escolhemos pelo problema, não pela moda
          </div>
        </div>
        <div className="reveal-stagger" style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:1, background:'var(--line)', border:'1px solid var(--line)', borderRadius:14, overflow:'hidden'}} id="stackGrid">
          {STACK.map(([cat, items]) => (
            <div key={cat} style={{background:'var(--bg-elev)', padding:'24px 24px 26px'}}>
              <div className="mono" style={{fontSize:11, letterSpacing:'.08em', color:'var(--accent)'}}>// {cat.toUpperCase()}</div>
              <ul style={{listStyle:'none', padding:0, margin:'14px 0 0', display:'grid', gap:10}}>
                {items.map(x => (
                  <li key={x} style={{display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:15}}>
                    <span style={{fontWeight:500}}>{x}</span>
                    <span className="mono muted" style={{fontSize:11}}>v∞</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 540px){ #stackGrid{ grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}


/* -------------------- Clients (counters) -------------------- */

const CLIENT_LOGOS = [
  { name: 'Divina Argila', url: 'https://divinaargila.com.br/' },
  { name: 'Bouwman',       url: 'https://bouwman.com.br/' },
  { name: 'Oglee',         url: 'https://oglee.com.br/' },
  { name: 'Nyl',           url: 'https://www.nylhairdesign.com.br/' },
  { name: 'Aline Nail',   url: 'https://www.instagram.com/alinebukowski.naildesigner/' },
];


function Clients(){
  const ref = useRef2(null);

  return (
    <section id="clientes" ref={ref}>
      <div className="wrap">
        <div style={{marginBottom:48}}>
          <div className="eyebrow"><span className="dot"/>06 · Clientes</div>
        </div>

        <div style={{display:'flex', flexWrap:'wrap', gap:'40px 56px', justifyContent:'center', padding:'48px 0', borderBottom:'1px solid var(--line)'}}>
          {CLIENT_LOGOS.map(({ name, url }) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="client-logo-link display" style={{fontSize:24, letterSpacing:'-0.01em', color:'var(--ink-3)', opacity:.7, textDecoration:'none', transition:'opacity .2s, color .2s'}}>{name}<span style={{color:'var(--accent)'}}>·</span></a>
          ))}
        </div>

      </div>
      <style>{`
        .client-logo-link:hover { opacity: 1 !important; color: var(--ink) !important; }
      `}</style>
    </section>
  );
}


/* -------------------- Contact -------------------- */

function Contact(){
  const [budget, setBudget] = useState2('2-5');
  const sent = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('sent') === 'true';
  const redirectUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname + '?sent=true#contato' : '';

  return (
    <section id="contato" style={{paddingTop: 110, paddingBottom: 110, background:'var(--bg-elev)', borderTop:'1px solid var(--line)'}}>
      <div className="wrap">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'start'}} className="contact-grid">
          <div>
            <div className="eyebrow"><span className="dot"/>07 · Contato</div>
            <h2 className="display" style={{fontSize:'clamp(40px, 5vw, 72px)', marginTop:18}}>
              Conta o<br/>problema<span style={{color:'var(--accent)'}}>.</span><br/>Devolvemos<br/>uma <span style={{color:'var(--accent)'}}>arquitetura</span>.
            </h2>
            <div style={{marginTop:36, display:'grid', gap:14}}>
              <a href="mailto:hello@agenciabyte.com" className="ul-link mono" style={{fontSize:18, textDecoration:'none'}}>hello@agenciabyte.com</a>
              <a href="https://wa.me/5542984224363" target="_blank" rel="noopener noreferrer" className="ul-link mono" style={{fontSize:18, textDecoration:'none'}}>+55 (42) 98422-4363</a>
              <div className="muted mono" style={{fontSize:13, marginTop:12}}>resposta em até 1 dia útil</div>
            </div>
          </div>

          <div className="card" style={{padding:32, minHeight:320, borderColor:'#5DD3A8'}}>
            {sent ? (
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', padding:'40px 8px', textAlign:'center', animation:'fadeInUp .5s ease'}}>
                <div style={{width:64, height:64, borderRadius:'50%', background:'color-mix(in oklab, var(--accent) 15%, transparent)', border:'1px solid var(--accent)', display:'grid', placeItems:'center', fontSize:28, color:'var(--accent)', marginBottom:20}}>✓</div>
                <div className="display" style={{fontSize:28}}>Recebido!</div>
                <p className="muted" style={{marginTop:10, fontSize:15}}>Vamos te responder em breve.<br/>Fique de olho no seu e-mail.</p>
              </div>
            ) : (
              <form action="https://submit-form.com/YVwqwQ14y">
                <input type="hidden" name="_redirect" value={redirectUrl} />
                <div className="mono" style={{fontSize:11, letterSpacing:'.08em', color:'var(--accent)'}}>// BRIEF RÁPIDO</div>
                <div style={{display:'grid', gap:16, marginTop:18}}>
                  <Field label="Seu nome">
                    <input name="name" placeholder="Maria da Silva" required />
                  </Field>
                  <Field label="E-mail">
                    <input name="email" placeholder="maria@empresa.com" type="email" required />
                  </Field>
                  <Field label="WhatsApp">
                    <input name="whatsapp" placeholder="+55 (11) 99999-9999" type="tel" />
                  </Field>
                  <Field label="Orçamento estimado (R$ mil)">
                    <input type="hidden" name="budget" value={budget} />
                    <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                      {['<1','2-5','6-10','20>'].map(b => (
                        <button type="button" key={b} onClick={() => setBudget(b)} className="mono" style={{
                          padding:'8px 14px', borderRadius:8, fontSize:13, cursor:'pointer',
                          border: budget === b ? '1px solid var(--accent)' : '1px solid var(--line-strong)',
                          background: budget === b ? 'color-mix(in oklab, var(--accent) 15%, transparent)' : 'transparent',
                          color: 'inherit',
                        }}>{b}</button>
                      ))}
                    </div>
                  </Field>
                  <Field label="O problema que você quer resolver">
                    <textarea name="message" placeholder="Ex.: nosso onboarding leva 4h por cliente, queremos automatizar com IA…" rows={4} required />
                  </Field>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:20, gap:16, flexWrap:'wrap'}}>
                  <span className="muted mono" style={{fontSize:12}}>↵ enviar · resposta em &lt; 24h</span>
                  <button type="submit" className="btn btn-accent">Enviar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 880px){ .contact-grid{ grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function Field({ label, children }){
  return (
    <label style={{display:'grid', gap:6}}>
      <span className="mono muted" style={{fontSize:11, letterSpacing:'.06em', textTransform:'uppercase'}}>{label}</span>
      {children}
      <style>{`
        label input, label textarea{
          font-family: var(--font-body); font-size: 15px;
          padding: 12px 14px; border-radius: 10px;
          border: 1px solid var(--line-strong);
          background: var(--bg);
          color: inherit;
          outline: none;
          width: 100%;
          transition: border-color .15s, box-shadow .15s;
          resize: vertical;
        }
        body[data-theme="dark"] label input, body[data-theme="dark"] label textarea{
          background: var(--dark-bg-2); border-color: var(--dark-line);
        }
        label input:focus, label textarea:focus{
          border-color: var(--accent);
          box-shadow: 0 0 0 4px color-mix(in oklab, var(--accent) 18%, transparent);
        }
      `}</style>
    </label>
  );
}

/* -------------------- Footer -------------------- */

function Footer(){
  return (
    <footer className="section-dark" style={{padding:'64px 0 32px', borderTop:'1px solid rgba(255,255,255,0.05)'}}>
      <div className="wrap">
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr', gap:48}} className="footer-grid">
          <div>
            <div className="brand" style={{color:'var(--dark-ink)'}}>
              <span>Agencia Byte</span>
            </div>
            <p className="muted" style={{maxWidth:280, marginTop:16, fontSize:14}}>Código que funciona. Sistemas que crescem. Engenharia para empresas com pressa.</p>
            <div className="mono muted" style={{fontSize:12, marginTop:24}}>v2.0 · 2026.05</div>
          </div>
          <FooterCol title="Serviços" items={['Desenvolvimento','Automação IA','Integrações','Dados']} />
          <FooterCol title="Empresa" items={['Sobre','Processo','Stack']} />
          <div>
            <div className="mono" style={{fontSize:11, letterSpacing:'.08em', color:'var(--accent)', textTransform:'uppercase'}}>Contato</div>
            <ul style={{listStyle:'none', padding:0, margin:'14px 0 0', display:'grid', gap:10}}>
              <li style={{fontSize:14}}><a href="#" className="ul-link" style={{textDecoration:'none', opacity:.85}}>hello@agenciabyte.com</a></li>
              <li style={{fontSize:14}}><a href="https://wa.me/5542984224363" target="_blank" rel="noopener noreferrer" className="ul-link" style={{textDecoration:'none', opacity:.85}}>+55 42 98422-4363</a></li>
            </ul>
            <a href="https://www.instagram.com/agenciabyte.ia" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{marginTop:16, display:'inline-flex', alignItems:'center', justifyContent:'center', width:32, height:32, borderRadius:8, border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.5)', transition:'color .15s, border-color .15s'}} onMouseEnter={e=>{e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'}} onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,0.5)';e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </div>
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.08)', marginTop:48, paddingTop:24, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:16}}>
          <div className="muted mono" style={{fontSize:12}}>© 2026 Agencia Byte · todos os direitos reservados</div>
          <div className="mono" style={{fontSize:12, display:'flex', gap:14}}>
            <span><span className="muted">status:</span> <span style={{color:'#5DD3A8'}}>● operacional</span></span>
            <span className="muted">build #2.0.412</span>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 880px){ .footer-grid{ grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </footer>
  );
}

function FooterCol({ title, items }){
  return (
    <div>
      <div className="mono" style={{fontSize:11, letterSpacing:'.08em', color:'var(--accent)', textTransform:'uppercase'}}>{title}</div>
      <ul style={{listStyle:'none', padding:0, margin:'14px 0 0', display:'grid', gap:10}}>
        {items.map(i => {
          const label = typeof i === 'object' ? i.label : i;
          const href  = typeof i === 'object' ? i.href  : '#';
          const extra = typeof i === 'object' ? {target:'_blank', rel:'noopener noreferrer'} : {};
          return <li key={label} style={{fontSize:14}}><a href={href} className="ul-link" style={{textDecoration:'none', opacity:.85}} {...extra}>{label}</a></li>;
        })}
      </ul>
    </div>
  );
}

Object.assign(window.AB, { Demo, Process, Stack, Clients, Contact, Footer });

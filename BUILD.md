# Build

O site é estático, mas o JSX agora é **pré-compilado** (sem Babel no navegador).

## Fluxo

Depois de editar `app-1.jsx`, `app-2.jsx` ou `entry.jsx`:

```bash
npm install   # só na primeira vez
npm run build # gera app.js (minificado, com React embutido)
```

- `npm run watch` — recompila automaticamente ao salvar.
- `app.js` é o artefato servido em produção (commitado no repo).
- `index.html` carrega só `<script defer src="app.js">`.

## Arquivos

| Arquivo | Papel |
|---|---|
| `app-1.jsx`, `app-2.jsx` | Componentes (fonte) — registram em `window.AB`; textos em `i18n/home.jsx` |
| `entry.jsx` | Monta o `<App>` e faz o `createRoot().render()` |
| `react-shim.js` | Injeta `React` como global via esbuild (`--inject`) |
| `app.js` | Bundle final gerado pelo build |

## Páginas internas (estáticas)

`/transformacao`, `/servicos`, `/servicos/<slug>`, `/clientes/<slug>`, `/casos-de-uso`,
`/casos-de-uso/<slug>` e `404.html` são HTML puro,
sem React, gerados por `build-pages.mjs`. O `index.html` de cada idioma também
é gerado por ele (é a casca com SEO que carrega o `app.js`).

```bash
npm run pages # regenera as páginas (3 idiomas) e o sitemap.xml
```

## Idiomas (pt, en, es)

O site existe em português (raiz), inglês (`/en`) e espanhol (`/es`).
A bandeira no topo troca o idioma e leva para a mesma página no outro idioma.

| Arquivo | Papel |
|---|---|
| `i18n/routes.mjs` | Idiomas, URL de cada página em cada idioma, bandeiras (SVG) |
| `i18n/home.jsx` | Textos da home (React). O idioma vem do `<html lang>` |
| `i18n/pages.mjs` | Textos das páginas estáticas e metadados da home |
| `i18n/use-cases.mjs` | Textos dos casos de uso de IA (`/casos-de-uso`) e ordem dos cards |
| `i18n/bling.mjs` | Integração Bling com marketplaces (`/servicos/integracao-bling-marketplaces` + Mercado Livre, TikTok Shop e Shopee). Só em português |
| `i18n/powerbi-logistica.mjs` | Power BI para distribuidoras e transportadoras (`/servicos/power-bi-para-distribuidoras-e-transportadoras`). Só em português |
| `i18n/blog-ia-pme.mjs` | Post pilar `/blog/automacao-com-ia-para-pme` com checklist de prontidão (script `checklist.js`). Só em português. /blog é servido pelo Worker blog-proxy (rota agenciabyte.com/blog*), que repassa para o WordPress em wp-origin.agenciabyte.com; o site não deve ter nada em /blog |
| `i18n/calculator.mjs` | Calculadora (`/calculadora`): textos e premissas por gargalo (sem preço de projeto). O script da página é `calc.js` |

Ao mudar um texto, mude nos três idiomas e rode `npm run build && npm run pages`.
Para criar uma página nova, registre a rota dela nos três idiomas em `i18n/routes.mjs`.
Cada página sai com `hreflang` apontando para as outras versões, e o
`sitemap.xml` lista as três com as alternativas.

Estilos específicos em `pages.css` (reaproveita os tokens de `styles.css`).
Hospedagem e redirects: ver `CLOUDFLARE.md`.

## Analytics (PostHog)

- Snippet no `<head>` de todas as páginas (`POSTHOG` em `build-pages.mjs`). Só carrega em `agenciabyte.com`; para testar em outro host, abra com `?ph=debug`.
- Eventos passam pelo proxy `/rb/*` (`worker.js`) para não serem bloqueados.
- `byte.js`: aviso de cookies (sem aceite = `persistence: memory`, sem cookie) e eventos globais: `whatsapp_clicked`, `email_clicked`, `contact_cta_clicked`, `language_switched`, `blog_link_clicked`, `faq_opened`, `cookie_consent`.
- `calc.js`: `calculator_started`, `calculator_bottleneck_selected`, `calculator_cta_clicked`, `calculator_left`.
- `checklist.js`: `checklist_scored`, `checklist_cta_clicked`.
- Home (React): `hero_viewed`, `hero_cta_clicked` (com `hero_variant`), `contact_form_submitted`, `contact_form_failed`.

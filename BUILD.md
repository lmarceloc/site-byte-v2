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

`/transformacao`, `/servicos`, `/servicos/<slug>` e `404.html` são HTML puro,
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

Ao mudar um texto, mude nos três idiomas e rode `npm run build && npm run pages`.
Para criar uma página nova, registre a rota dela nos três idiomas em `i18n/routes.mjs`.
Cada página sai com `hreflang` apontando para as outras versões, e o
`sitemap.xml` lista as três com as alternativas.

Estilos específicos em `pages.css` (reaproveita os tokens de `styles.css`).
Hospedagem e redirects: ver `CLOUDFLARE.md`.

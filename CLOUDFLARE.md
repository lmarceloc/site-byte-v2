# Deploy na Cloudflare (Workers + Static Assets)

O site é estático, então roda como Worker **só de assets** (sem código, sem custo de request de Worker).
A Cloudflare hoje recomenda Workers Static Assets no lugar de Pages para projetos novos; o fluxo Git é o mesmo.

## Arquivos
| Arquivo | Papel |
|---|---|
| `wrangler.jsonc` | Config do Worker: pasta de assets, 404, sem barra final, domínios |
| `.assetsignore` | O que NÃO é publicado (node_modules, .jsx, .md internos, configs) |
| `_redirects` | `/sobre`, `/processo`, `/stack` |
| `_headers` | Headers de segurança e cache |

## Subir (conectado ao GitHub)
1. Dashboard → Workers & Pages → Create → **Import a repository** → `site-byte-v2`.
2. Build command: *(vazio)* — `app.js` e as páginas já vão commitados. Deploy command: `npx wrangler deploy`.
3. Pré-requisito: a zona `agenciabyte.com` precisa estar na **mesma conta Cloudflare** (DNS na Cloudflare).
   O deploy cria os Custom Domains `agenciabyte.com` e `www.agenciabyte.com` sozinho.
   Se houver registros A/CNAME antigos apontando pra Vercel nesses nomes, apague-os antes.
4. **www → apex**: Rules → Redirect Rules → template "Redirect from WWW to root" (301, preservar path e query).
   `_redirects` não suporta regra por host, por isso fica no painel.
5. Migração da Vercel concluída (out/2026); arquivos da Vercel removidos do repo.

## SEO
- URLs, canonicals, `sitemap.xml`, `robots.txt` e `llms.txt` não mudam → sem perda de ranking.
- `/servicos/` redireciona para `/servicos` (igual à Vercel); 404 real com `404.html`.
- `workers_dev: false` e `preview_urls: false` evitam cópias indexáveis em `*.workers.dev`.
- Na Cloudflare, deixe **desligado**: "Block AI bots"/"Managed robots.txt" se quiser manter o `llms.txt`
  e IAs citando o site; e confirme que Bot Fight Mode não bloqueia Googlebot (verificados passam por padrão).
- Pós-migração: Search Console → inspecionar URL e reenviar o sitemap.

## Local
`npm run preview` (wrangler dev) · `npm run deploy` (precisa de `CLOUDFLARE_API_TOKEN`).

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
| `app-1.jsx`, `app-2.jsx` | Componentes (fonte) — registram em `window.AB` |
| `entry.jsx` | Monta o `<App>` e faz o `createRoot().render()` |
| `react-shim.js` | Injeta `React` como global via esbuild (`--inject`) |
| `app.js` | Bundle final gerado pelo build |

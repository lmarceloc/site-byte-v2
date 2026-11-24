// Ponto de entrada do bundle (app.js).
// O index.html já vem com a home renderizada (build-pages.mjs + ssr.jsx), então o
// React só "hidrata": liga os eventos no HTML que já está na tela, sem trocá-lo.
// Isso faz o conteúdo aparecer antes de o app.js baixar.
import { createRoot, hydrateRoot } from "react-dom/client";
import React from "react";
import { App } from "./home-app.jsx";

const el = document.getElementById("app");
if (el.hasAttribute("data-ssr")) hydrateRoot(el, <App />);
else createRoot(el).render(<App />);

// Bloco só para buscadores sem JavaScript (ver build-pages.mjs); com o app no ar não é mais necessário.
const seo = document.getElementById("seo-fallback");
if (seo) seo.remove();

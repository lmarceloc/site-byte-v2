// Renderiza a home em HTML no build (usado por build-pages.mjs).
// O idioma vem de document.documentElement.lang, que o build-pages simula.
import React from "react";
import { renderToString } from "react-dom/server";
import { App } from "./home-app.jsx";

export function render() {
  return renderToString(<App />);
}

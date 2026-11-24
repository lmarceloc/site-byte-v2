// Árvore da home. Usada no navegador (entry.jsx) e no build (ssr.jsx, que gera
// o HTML pronto do index.html de cada idioma).
// app-1 e app-2 registram seus componentes em window.AB (ordem importa).
import "./app-1.jsx";
import "./app-2.jsx";
import React from "react";

const AB = window.AB;

function PageWrapper({ children }) {
  AB.useReveal();
  return (
    <>
      <AB.Nav />
      {children}
      <AB.Footer />
    </>
  );
}

export function App() {
  return (
    <PageWrapper>
      <AB.Hero />
      <AB.About />
      <AB.Transformation />
      <AB.Services />
      <AB.Process />
      <AB.Clients />
      <AB.Contact />
    </PageWrapper>
  );
}

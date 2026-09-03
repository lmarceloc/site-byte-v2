// Ponto de entrada do bundle. Substitui o <script type="text/babel"> inline.
// app-1 e app-2 registram seus componentes em window.AB (ordem importa).
import "./app-1.jsx";
import "./app-2.jsx";
import { createRoot } from "react-dom/client";
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

function App() {
  return (
    <>
      <PageWrapper>
        <AB.Hero />
        <AB.About />
        <AB.Transformation />
        <AB.Services />
        <AB.Process />
        <AB.Clients />
        <AB.Contact />
      </PageWrapper>
    </>
  );
}

createRoot(document.getElementById("app")).render(<App />);

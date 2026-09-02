// Ponto de entrada do bundle. Substitui o <script type="text/babel"> inline.
// app-1 e app-2 registram seus componentes em window.AB (ordem importa).
import "./app-1.jsx";
import "./app-2.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect } from "react";

const AB = window.AB;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageWrapper({ children }) {
  AB.useReveal();
  return (
    <>
      <AB.Nav />
      {children}
      <AB.Contact />
      <AB.Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PageWrapper><AB.Hero /><AB.Transformation /><AB.Clients /></PageWrapper>} />
        <Route path="/sobre" element={<PageWrapper><AB.About /></PageWrapper>} />
        <Route path="/servicos" element={<PageWrapper><AB.Services /></PageWrapper>} />
        <Route path="/processo" element={<PageWrapper><AB.Process /></PageWrapper>} />
        <Route path="/transformacao" element={<PageWrapper><AB.Transformation /></PageWrapper>} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("app")).render(<App />);

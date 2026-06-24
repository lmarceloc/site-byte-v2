// Ponto de entrada do bundle. Substitui o <script type="text/babel"> inline.
// app-1 e app-2 registram seus componentes em window.AB (ordem importa).
import "./app-1.jsx";
import "./app-2.jsx";
import { createRoot } from "react-dom/client";

const AB = window.AB;

function App() {
  AB.useReveal();

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: "smooth" });
  };

  return (
    <>
      <AB.Nav onContact={() => scrollTo("#contato")} />
      <AB.Hero />
      <AB.About />
      <AB.Services />
      <AB.Demo />
      <AB.Process />
      <AB.Stack />
      <AB.Clients />
      <AB.Contact />
      <AB.Footer />
    </>
  );
}

createRoot(document.getElementById("app")).render(<App />);

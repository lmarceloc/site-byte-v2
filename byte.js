// Aviso de cookies e eventos globais do site (PostHog).
// Carregado em todas as páginas pelo <head> (build-pages.mjs). Se o PostHog não
// estiver ativo (fora do domínio de produção), nada aqui envia dados.
(function () {
  var ph = function () { return window.posthog && typeof window.posthog.capture === "function" ? window.posthog : null; };
  var capture = function (name, props) { var p = ph(); if (p) p.capture(name, props || {}); };
  window.byteTrack = capture; // usado por calc.js, checklist.js e pela home (React)

  /* ---------------- Aviso de cookies ---------------- */
  var LANG = (document.documentElement.lang || "pt").slice(0, 2);
  var TXT = {
    pt: { text: "Usamos cookies para entender como o site é usado e melhorá-lo. Sem o seu aceite, contamos as visitas de forma anônima, sem cookies.", yes: "Aceitar", no: "Recusar" },
    en: { text: "We use cookies to understand how the site is used and improve it. Without your consent, we count visits anonymously, without cookies.", yes: "Accept", no: "Decline" },
    es: { text: "Usamos cookies para entender cómo se usa el sitio y mejorarlo. Sin su consentimiento, contamos las visitas de forma anónima, sin cookies.", yes: "Aceptar", no: "Rechazar" },
  }[LANG] || null;

  var choice = null;
  try { choice = localStorage.getItem("byte_consent"); } catch (e) {}

  function showBanner() {
    if (!TXT || !ph()) return;
    var css = document.createElement("style");
    css.textContent =
      ".ck-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:60;max-width:560px;margin:0 auto;background:var(--ink,#0B1020);color:var(--dark-ink,#F4F4ED);" +
      "border-radius:12px;padding:16px 18px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;box-shadow:0 12px 32px rgba(11,16,32,.25);font:400 14px/1.5 var(--font-body,system-ui)}" +
      ".ck-banner p{margin:0;flex:1 1 280px}.ck-actions{display:flex;gap:8px}" +
      ".ck-banner button{border:0;border-radius:8px;padding:9px 14px;font:600 14px var(--font-body,system-ui);cursor:pointer}" +
      ".ck-yes{background:var(--accent,#FF6A1A);color:var(--accent-ink,#1a0a00)}.ck-no{background:transparent;color:inherit;border:1px solid rgba(255,255,255,.25)!important}";
    document.head.appendChild(css);
    var box = document.createElement("div");
    box.className = "ck-banner";
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", "Cookies");
    box.innerHTML = '<p></p><div class="ck-actions"><button type="button" class="ck-no"></button><button type="button" class="ck-yes"></button></div>';
    box.querySelector("p").textContent = TXT.text;
    box.querySelector(".ck-yes").textContent = TXT.yes;
    box.querySelector(".ck-no").textContent = TXT.no;
    document.body.appendChild(box);
    function decide(v) {
      try { localStorage.setItem("byte_consent", v); } catch (e) {}
      var p = ph();
      if (p && v === "yes") p.set_config({ persistence: "localStorage+cookie" });
      capture("cookie_consent", { choice: v === "yes" ? "accepted" : "declined" });
      box.remove();
    }
    box.querySelector(".ck-yes").addEventListener("click", function () { decide("yes"); });
    box.querySelector(".ck-no").addEventListener("click", function () { decide("no"); });
  }
  if (!choice) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", showBanner);
    else showBanner();
  }

  /* ---------------- Eventos globais ---------------- */
  // Onde o clique aconteceu: id da seção, ou nav / rodapé.
  function where(el) {
    if (el.closest(".nav, header")) return "nav";
    if (el.closest("footer")) return "footer";
    if (el.closest(".ck-banner")) return "cookie_banner";
    var sec = el.closest("section[id], aside[id], section");
    if (sec && sec.id) return sec.id;
    var h = sec && sec.querySelector("h1, h2");
    return h ? h.textContent.trim().slice(0, 60) : "main";
  }
  var label = function (el) { return (el.textContent || el.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 80); };

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var props = { label: label(a), location: where(a), href: href.split("?")[0] };
    if (/wa\.me\//.test(href)) capture("whatsapp_clicked", props);
    else if (/^mailto:/.test(href)) capture("email_clicked", props);
    else if (/#contato$/.test(href)) capture("contact_cta_clicked", props);
    else if (a.closest(".lang-menu")) capture("language_switched", { to: a.getAttribute("lang"), from: document.documentElement.lang });
    else if (/blog\.agenciabyte\.com/.test(href)) capture("blog_link_clicked", props);
  }, true);

  // Perguntas frequentes abertas (o evento "toggle" não sobe, por isso a captura).
  document.addEventListener("toggle", function (e) {
    var d = e.target;
    if (!d.open || !d.closest || !d.closest(".faq")) return;
    var s = d.querySelector("summary");
    capture("faq_opened", { question: s ? s.textContent.trim().slice(0, 120) : "", location: where(d) });
  }, true);
})();

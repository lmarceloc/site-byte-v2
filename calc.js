// Calculadora de automação (/calculadora). Textos e premissas vêm do JSON
// #calc-data, gerado por build-pages.mjs a partir de i18n/calculator.mjs.
// Eventos (PostHog, via window.byteTrack de /byte.js): calculator_started,
// calculator_bottleneck_selected, calculator_cta_clicked e calculator_left.
(function () {
  var D = JSON.parse(document.getElementById("calc-data").textContent);
  var T = D.t, CFG = D.cfg, B = CFG.bottlenecks;
  var $ = function (id) { return document.getElementById("calc-" + id); };
  var brl = function (v) { return v.toLocaleString(D.lang, { style: "currency", currency: "BRL", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }); };
  var num = function (v) { return v.toLocaleString(D.lang); };
  var pct = function (v) { return Math.round(v * 100) + "%"; };
  var fill = function (s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return k in o ? o[k] : "{" + k + "}"; }); };
  var g = B[0];
  var track = function (name, props) { if (window.byteTrack) window.byteTrack(name, props); };
  var state = {}, started = false, converted = false;
  function snapshot() {
    return {
      bottleneck: g.id, people: state.p, hours_per_week: state.h, hourly_cost: state.c,
      rework_per_month: state.e, fix_minutes: state.m, automatable_pct: Math.round(state.a * 100),
      hours_total_month: state.hTot, hours_automatable_month: state.hEnd,
      monthly_cost: state.costM, monthly_savings: state.endM, annual_savings: state.endM * 12,
    };
  }
  function touch(how) {
    if (started) return;
    started = true;
    track("calculator_started", { first_interaction: how, bottleneck: g.id });
  }

  var chips = document.querySelectorAll("#calc-area .calc-chip");
  chips.forEach(function (b) {
    b.addEventListener("click", function () {
      chips.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      g = B[+b.dataset.i];
      $("a").value = Math.round(g.auto * 100);
      calc();
      touch("bottleneck");
      track("calculator_bottleneck_selected", { bottleneck: g.id });
    });
  });

  function calc() {
    var p = +$("p").value, h = +$("h").value, c = +$("c").value, e = +$("e").value, m = +$("m").value, a = +$("a").value / 100;
    $("p-v").textContent = p;
    $("h-v").textContent = h + " h";
    $("c-v").textContent = brl(c);
    $("e-v").textContent = e;
    $("m-v").textContent = m + " min";
    $("a-v").textContent = pct(a);
    $("a-hint").textContent = fill(T.auto[1], { short: T.short[g.id], pct: pct(g.auto) });
    $("case").href = D.useCases[g.id];
    $("case").textContent = fill(T.caseLink, { name: T.names[g.id] });

    // Horas inteiras antes de multiplicar: a conta mostrada fecha exatamente.
    var hTask = Math.round(p * h * CFG.weeksPerMonth), hRework = Math.round((e * m) / 60), hTot = hTask + hRework;
    var hEnd = Math.round(hTot * a), costM = hTot * c, endM = hEnd * c;
    state = { p: p, h: h, c: c, e: e, m: m, a: a, hTot: hTot, hEnd: hEnd, costM: costM, endM: endM };

    $("cost-y").textContent = brl(costM * 12) + T.perYear;
    $("cost-sub").textContent = brl(costM) + T.perMonth + " · " + hTot + " " + T.hMonth;
    $("addr-k").textContent = fill(T.addressable, { pct: pct(a) });
    $("addr-y").textContent = brl(endM * 12) + T.perYear;
    $("addr-sub").textContent = brl(endM) + T.perMonth + " · " + hEnd + " " + T.hFreed;


    $("math").innerHTML =
      "<div><span>" + fill(T.mathTask, { p: p, h: h, w: num(CFG.weeksPerMonth) }) + "</span><b>" + hTask + " h</b></div>" +
      "<div><span>" + fill(T.mathRework, { e: e, m: m }) + "</span><b>+ " + hRework + " h</b></div>" +
      "<div><span>" + fill(T.mathTotal, { rate: brl(c) }) + "</span><b>" + hTot + " h = " + brl(costM) + "</b></div>" +
      '<div class="calc-tot"><span>' + hTot + " h × " + pct(a) + " → " + hEnd + " h × " + brl(c) + "</span><b>" + brl(endM) + T.perMonth + "</b></div>";

    $("cta").href = D.whatsapp + "?text=" + encodeURIComponent(fill(T.wa, {
      name: T.names[g.id], hTot: hTot, hEnd: hEnd, value: brl(endM),
    }));
  }

  ["p", "h", "c", "e", "m", "a"].forEach(function (id) {
    $(id).addEventListener("input", calc);
    $(id).addEventListener("change", function () { touch(id); });
  });
  $("cta").addEventListener("click", function () { converted = true; track("calculator_cta_clicked", snapshot()); });
  // Quem mexeu e saiu sem clicar: guarda os últimos números para comparar com quem clicou.
  addEventListener("pagehide", function () {
    if (started && !converted && window.posthog && window.posthog.capture) {
      window.posthog.capture("calculator_left", snapshot(), { transport: "sendBeacon" });
    }
  });
  calc();
})();

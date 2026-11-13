// Calculadora de automação (/calculadora). Textos, premissas e preços vêm do
// JSON #calc-data, gerado por build-pages.mjs a partir de i18n/calculator.mjs.
(function () {
  var D = JSON.parse(document.getElementById("calc-data").textContent);
  var T = D.t, CFG = D.cfg, B = CFG.bottlenecks;
  var $ = function (id) { return document.getElementById("calc-" + id); };
  var brl = function (v) { return v.toLocaleString(D.lang, { style: "currency", currency: "BRL", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }); };
  var num = function (v) { return v.toLocaleString(D.lang); };
  var pct = function (v) { return Math.round(v * 100) + "%"; };
  var fill = function (s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return k in o ? o[k] : "{" + k + "}"; }); };
  var g = B[0], mode = "grow";

  var chips = document.querySelectorAll("#calc-area .calc-chip");
  chips.forEach(function (b) {
    b.addEventListener("click", function () {
      chips.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      g = B[+b.dataset.i];
      $("a").value = Math.round(g.auto * 100);
      calc();
    });
  });
  function setMode(m) {
    mode = m;
    $("grow").setAttribute("aria-pressed", String(m === "grow"));
    $("cut").setAttribute("aria-pressed", String(m === "cut"));
    calc();
  }
  $("grow").addEventListener("click", function () { setMode("grow"); });
  $("cut").addEventListener("click", function () { setMode("cut"); });

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

    $("cost-y").textContent = brl(costM * 12) + T.perYear;
    $("cost-sub").textContent = brl(costM) + T.perMonth + " · " + hTot + " " + T.hMonth;
    $("addr-k").textContent = fill(T.addressable, { pct: pct(a) });
    $("addr-y").textContent = brl(endM * 12) + T.perYear;
    $("addr-sub").textContent = brl(endM) + T.perMonth + " · " + hEnd + " " + T.hFreed;

    var fteN = hEnd / CFG.hoursPerFte;
    var fte = fteN.toLocaleString(D.lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " " + (Math.round(fteN * 10) === 10 ? T.person : T.persons);
    $("outcome").innerHTML = fill(mode === "grow" ? T.growText : T.cutText, { h: hEnd, fte: fte });

    $("math").innerHTML =
      "<div><span>" + fill(T.mathTask, { p: p, h: h, w: num(CFG.weeksPerMonth) }) + "</span><b>" + hTask + " h</b></div>" +
      "<div><span>" + fill(T.mathRework, { e: e, m: m }) + "</span><b>+ " + hRework + " h</b></div>" +
      "<div><span>" + fill(T.mathTotal, { rate: brl(c) }) + "</span><b>" + hTot + " h = " + brl(costM) + "</b></div>" +
      '<div class="calc-tot"><span>' + hTot + " h × " + pct(a) + " → " + hEnd + " h × " + brl(c) + "</span><b>" + brl(endM) + T.perMonth + "</b></div>";

    $("proj-k").textContent = fill(T.project, { short: T.short[g.id] });
    $("proj").textContent = brl(g.project[0]) + " – " + brl(g.project[1]);
    $("ops").textContent = brl(g.ops[0]) + " – " + brl(g.ops[1]);
    var netMin = endM - g.ops[1], netMax = endM - g.ops[0];
    if (netMax <= 0) {
      $("payback").innerHTML = '<span class="calc-warn">' + T.noPayback + "</span>";
      $("payback-sub").textContent = T.noPaybackSub;
    } else {
      var best = Math.max(1, Math.ceil(g.project[0] / netMax));
      var worst = netMin > 0 ? Math.ceil(g.project[1] / netMin) : null;
      $("payback").textContent = worst ? fill(T.paybackRange, { a: best, b: worst }) : fill(T.paybackFrom, { a: best });
      $("payback-sub").textContent = fill(T.paybackSub, { min: brl(Math.max(0, netMin)), max: brl(netMax) }) + (mode === "grow" ? T.paybackGrow : T.paybackCut);
    }

    $("cta").href = D.whatsapp + "?text=" + encodeURIComponent(fill(T.wa, {
      name: T.names[g.id], hTot: hTot, hEnd: hEnd, value: brl(endM), goal: mode === "grow" ? T.grow : T.cut,
    }));
  }

  ["p", "h", "c", "e", "m", "a"].forEach(function (id) { $(id).addEventListener("input", calc); });
  calc();
})();

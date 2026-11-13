// Checklist de prontidão do post /blog/automacao-com-ia-para-pme.
// Textos e faixas de resultado vêm do JSON #ck-data (gerado por build-pages.mjs).
(function () {
  var D = JSON.parse(document.getElementById("ck-data").textContent);
  var form = document.getElementById("ck");
  var boxes = form.querySelectorAll('input[type="checkbox"]');
  var $ = function (id) { return document.getElementById(id); };
  var fill = function (s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return k in o ? o[k] : ""; }); };
  function update() {
    var n = 0;
    boxes.forEach(function (b) { if (b.checked) n++; });
    var r = D.results.filter(function (x) { return n >= x.min; })[0];
    $("ck-result").hidden = n === 0;
    $("ck-result").dataset.level = String(D.results.indexOf(r));
    $("ck-score").textContent = fill(D.score, { n: n, total: D.total });
    $("ck-title").textContent = r.title;
    $("ck-text").textContent = r.text;
    $("ck-cta").href = D.whatsapp + "?text=" + encodeURIComponent(fill(D.wa, { n: n, total: D.total, title: r.title }));
  }
  form.addEventListener("change", update);
  update();
})();

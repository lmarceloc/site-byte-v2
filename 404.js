/* Página 404: fundo em dither (Bayer 4x4) e bytes que seguem o cursor. */
(function () {
  var cv = document.getElementById('nf-dither');
  var card = document.getElementById('nf-card');
  if (!cv || !card) return;
  var ctx = cv.getContext('2d');
  var PX = 4, W, H, t = 0;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(function (n) { return (n + 0.5) / 16; });
  var cs = getComputedStyle(card);
  var soft = cs.getPropertyValue('--nf-dot-soft').trim() || '#CBE8CC';
  var strong = cs.getPropertyValue('--nf-dot-strong').trim() || '#42AE48';

  function size() {
    var r = card.getBoundingClientRect();
    W = Math.ceil(r.width / PX); H = Math.ceil(r.height / PX);
    cv.width = W; cv.height = H;
  }
  function sstep(a, b, x) { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var y = 0; y < H; y++) {
      var fy = y / H;
      for (var x = 0; x < W; x++) {
        var fx = x / W;
        var base = sstep(0.62, 1.05, fy) * 0.9 + sstep(0.55, 1, fx) * 0.22 * sstep(0.5, 0.9, fy);
        var wave = Math.sin(fx * 7 + t * 0.6) * 0.06 + Math.sin(fy * 9 - t * 0.5 + fx * 3) * 0.05;
        var mask = 1 - (1 - sstep(0, 0.55, fx + fy * 0.5)) * 0.5;
        var v = Math.max(0, (base + wave) * mask);
        var th = bayer[(y & 3) * 4 + (x & 3)];
        if (fy > 0.9 && v - 0.38 > th) { ctx.fillStyle = strong; ctx.fillRect(x, y, 1, 1); }
        else if (v > th) { ctx.fillStyle = soft; ctx.fillRect(x, y, 1, 1); }
      }
    }
  }
  function loop() { t += 0.06; draw(); setTimeout(function () { requestAnimationFrame(loop); }, 90); }

  size(); draw();
  addEventListener('resize', function () { size(); draw(); });
  if (reduce) return;
  loop();

  var bytes = document.querySelectorAll('.nf-byte');
  addEventListener('pointermove', function (e) {
    bytes.forEach(function (b) {
      var r = b.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      var d = Math.hypot(dx, dy) || 1, k = r.width * 0.08;
      var ox = Math.round(dx / d * k), oy = Math.round(dy / d * k);
      b.querySelectorAll('i').forEach(function (i) { i.style.translate = ox + 'px ' + oy + 'px'; });
    });
  }, { passive: true });
})();

(function () {
  var el = document.getElementById('nf-path');
  if (el && location.pathname.length > 1) el.textContent = location.host + location.pathname;
})();

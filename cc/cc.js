// ConsensualCheck · Trinitas — landing behaviour (shared by EN and IT)
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // reveal on scroll
  var targets = document.querySelectorAll('.reveal, .chart');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  // count-up numbers
  var fmt = new Intl.NumberFormat(root.lang === 'it' ? 'it-IT' : 'en-US');
  function countUp(el) {
    var to = parseInt(el.getAttribute('data-to'), 10);
    if (reduce || to < 10) { el.textContent = fmt.format(to); return; }
    var start = null, dur = 1600;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.format(Math.round(to * eased / 1000) * 1000);
      if (p < 1) requestAnimationFrame(step); else el.textContent = fmt.format(to);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('.count');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  // chart tooltip
  var chart = document.getElementById('chart');
  var tip = document.getElementById('chart-tip');
  function show(bar, x, y) {
    tip.innerHTML = bar.getAttribute('data-tip');
    var box = chart.getBoundingClientRect();
    var left = Math.min(Math.max(x - box.left + 14, 0), box.width - tip.offsetWidth);
    tip.style.left = left + 'px';
    tip.style.top = (y - box.top - tip.offsetHeight - 12) + 'px';
    tip.style.opacity = 1;
  }
  function hide() { tip.style.opacity = 0; }
  chart.querySelectorAll('.bar').forEach(function (bar) {
    bar.addEventListener('mousemove', function (e) { show(bar, e.clientX, e.clientY); });
    bar.addEventListener('mouseleave', hide);
    bar.addEventListener('focus', function () {
      var r = bar.getBoundingClientRect();
      show(bar, r.left + Math.min(r.width / 2, 200), r.top);
    });
    bar.addEventListener('blur', hide);
  });
})();

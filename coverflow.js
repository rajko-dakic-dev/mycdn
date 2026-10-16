(function () {
  var css =
    '[data-coverflow]{position:relative;overflow:hidden;perspective:1200px;touch-action:pan-y;user-select:none;outline:none}' +
    '[data-coverflow]>*{position:absolute!important;left:50%;top:50%;margin:0!important;cursor:pointer;will-change:transform;' +
    'transition:transform .6s cubic-bezier(.2,.7,.2,1),opacity .6s}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function init(root) {
    var items = Array.prototype.slice.call(root.children);
    if (!items.length) return;

    var d = root.dataset;
    var angle = parseFloat(d.angle) || 50;
    var depth = parseFloat(d.depth) || 120;
    var visible = parseInt(d.visible, 10) || 3;
    var active = d.start ? parseInt(d.start, 10) : Math.floor(items.length / 2);
    var spacing, gap;

    function measure() {
      var w = items[0].offsetWidth || 240;
      var maxH = 0;
      items.forEach(function (el) { maxH = Math.max(maxH, el.offsetHeight); });
      spacing = parseFloat(d.spacing) || w * 0.35;
      gap = parseFloat(d.gap) || w * 0.45;
      root.style.minHeight = maxH + 80 + 'px';
    }

    function render() {
      items.forEach(function (el, i) {
        var off = i - active;
        var abs = Math.abs(off);
        var s = off < 0 ? -1 : off > 0 ? 1 : 0;
        var x = off * spacing + s * gap;
        var z = off === 0 ? 60 : -abs * depth;
        el.style.transform =
          'translate(-50%,-50%) translateX(' + x + 'px) translateZ(' + z + 'px) rotateY(' + (-s * angle) + 'deg)';
        el.style.zIndex = 100 - abs;
        el.style.opacity = abs > visible ? 0 : 1;
        el.style.pointerEvents = abs > visible ? 'none' : 'auto';
        el.classList.toggle('is-active', off === 0);
      });
    }

    function go(i) {
      active = Math.max(0, Math.min(items.length - 1, i));
      render();
    }

    items.forEach(function (el, i) {
      el.addEventListener('click', function () {
        if (!moved) go(i);
      });
    });

    var scope = root.parentElement || document;
    var prev = scope.querySelector('[data-coverflow-prev]');
    var next = scope.querySelector('[data-coverflow-next]');
    if (prev) prev.addEventListener('click', function () { go(active - 1); });
    if (next) next.addEventListener('click', function () { go(active + 1); });

    root.tabIndex = 0;
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(active - 1);
      if (e.key === 'ArrowRight') go(active + 1);
    });

    var startX = null, moved = false;
    root.addEventListener('pointerdown', function (e) { startX = e.clientX; moved = false; });
    root.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 40) { moved = true; go(active + (dx < 0 ? 1 : -1)); }
      startX = null;
      setTimeout(function () { moved = false; }, 0);
    });

    measure();
    render();
    window.addEventListener('load', function () { measure(); render(); });
    window.addEventListener('resize', function () { measure(); render(); });
  }

  function boot() {
    document.querySelectorAll('[data-coverflow]').forEach(init);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

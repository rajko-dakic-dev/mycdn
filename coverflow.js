(function () {
  var stage = document.getElementById('stage');
  var cards = Array.prototype.slice.call(stage.querySelectorAll('.card'));
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');

  var active = Math.floor(cards.length / 2);
  var ANGLE = 48;
  var DEPTH = 140;

  function render() {
    var w = cards[0].offsetWidth;
    var spacing = w * 0.3;
    var gap = w * 0.5;
    var visible = window.innerWidth < 600 ? 1 : 2;

    cards.forEach(function (el, i) {
      var off = i - active;
      var abs = Math.abs(off);
      var dir = off < 0 ? -1 : off > 0 ? 1 : 0;
      var x = off * spacing + dir * gap;
      var z = off === 0 ? 60 : -abs * DEPTH;
      el.style.transform =
        'translate(-50%,-50%) translateX(' + x + 'px) translateZ(' + z + 'px) rotateY(' + (-dir * ANGLE) + 'deg)';
      el.style.zIndex = 100 - abs;
      el.style.opacity = abs > visible ? 0 : 1;
      el.style.pointerEvents = abs > visible ? 'none' : 'auto';
      el.classList.toggle('is-active', off === 0);
      el.setAttribute('aria-hidden', off === 0 ? 'false' : 'true');
    });
    prev.disabled = active === 0;
    next.disabled = active === cards.length - 1;
  }

  function go(i) {
    active = Math.max(0, Math.min(cards.length - 1, i));
    render();
  }

  var startX = null;
  var dragged = false;

  stage.addEventListener('pointerdown', function (e) {
    startX = e.clientX;
    dragged = false;
  });
  stage.addEventListener('pointerup', function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) {
      dragged = true;
      go(active + (dx < 0 ? 1 : -1));
    }
  });
  stage.addEventListener('pointercancel', function () { startX = null; });

  cards.forEach(function (el, i) {
    el.addEventListener('click', function () {
      if (dragged) { dragged = false; return; }
      go(i);
    });
  });

  prev.addEventListener('click', function () { go(active - 1); });
  next.addEventListener('click', function () { go(active + 1); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') go(active - 1);
    if (e.key === 'ArrowRight') go(active + 1);
  });

  window.addEventListener('resize', render);
  render();
})();

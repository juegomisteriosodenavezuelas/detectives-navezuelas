/* Menú móvil y marcador de puntos del cabecero, común a todas las páginas. */
(function () {
  function actualizarBadge() {
    var badge = document.getElementById('header-points');
    if (!badge || !window.Progress) return;
    badge.textContent = '★ ' + window.Progress.totalPuntos() + ' pts';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('main-nav');

    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var abierto = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      });

      Array.prototype.forEach.call(nav.querySelectorAll('a'), function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    actualizarBadge();
  });

  window.addEventListener('progreso:actualizado', actualizarBadge);
})();

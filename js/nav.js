/* Menú móvil, marcador de puntos y foto de los detectives, comunes a
   todas las páginas. */
(function () {
  function actualizarBadge() {
    var badge = document.getElementById('header-points');
    if (!badge || !window.AcertijosStore) return;
    window.AcertijosStore.totalPuntos().then(function (puntos) {
      badge.textContent = '★ ' + puntos + ' pts';
    });
  }

  // Una vez identificados, la web muestra la foto real de los detectives
  // en vez del retrato misterioso, en cualquier página.
  function mostrarFotoReal() {
    if (sessionStorage.getItem('navezuelasAutenticado') !== 'true') return;
    Array.prototype.forEach.call(document.querySelectorAll('img[src="Detective.png"]'), function (img) {
      img.src = 'Detectives reales.png';
      img.alt = 'Héctor, Martín y Carlota, los detectives reales';
    });
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
    mostrarFotoReal();
  });

  window.addEventListener('progreso:actualizado', actualizarBadge);
  window.addEventListener('navezuelas:autenticado', mostrarFotoReal);
})();

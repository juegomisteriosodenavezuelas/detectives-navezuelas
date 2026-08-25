/* Menú móvil, marcador de puntos y foto de los detectives, comunes a
   todas las páginas. */
(function () {
  // Fuente única del menú principal: se genera aquí y se reutiliza en
  // todas las páginas, en vez de repetir el <ul> en cada HTML.
  var MENU_ITEMS = [
    { href: 'index.html', label: 'Inicio' },
    { href: 'acertijos.html', label: 'Acertijos' },
    { href: 'viajeros.html', label: 'Viajeros' },
    { href: 'contacto.html', label: 'Contacto' }
  ];

  function renderMenu(nav) {
    var activo = nav.getAttribute('data-active') || location.pathname.split('/').pop() || 'index.html';
    var ul = document.createElement('ul');
    MENU_ITEMS.forEach(function (item) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      if (item.href === activo) a.setAttribute('aria-current', 'page');
      li.appendChild(a);
      ul.appendChild(li);
    });
    nav.innerHTML = '';
    nav.appendChild(ul);
  }

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

    if (nav) renderMenu(nav);

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

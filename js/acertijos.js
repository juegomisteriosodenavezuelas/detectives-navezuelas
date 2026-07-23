/* Lista de acertijos: pinta las tarjetas y el resumen de progreso. */
(function () {
  function estaDesbloqueado(acertijo) {
    return new Date() >= new Date(acertijo.fecha);
  }

  function formatearFecha(fechaStr) {
    var opciones = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaStr).toLocaleString('es-ES', opciones);
  }

  function crearTarjeta(acertijo) {
    var desbloqueado = estaDesbloqueado(acertijo);
    var estadoBadge = acertijo.resuelto
      ? '<span class="badge badge-resuelto">Resuelto</span>'
      : desbloqueado
        ? '<span class="badge badge-nuevo">Nuevo</span>'
        : '<span class="badge badge-bloqueado">Bloqueado</span>';

    var estadoClase = acertijo.resuelto ? 'resuelto' : 'pendiente';

    var el = document.createElement(desbloqueado ? 'a' : 'div');
    el.className = 'acertijo-card ' + estadoClase + (desbloqueado ? '' : ' locked');
    if (desbloqueado) el.href = 'acertijo.html?id=' + encodeURIComponent(acertijo.id);

    el.innerHTML =
      '<span class="numero">Caso nº ' + acertijo.numero + '</span>' +
      '<h3>' + acertijo.titulo + '</h3>' +
      '<div class="meta">' +
        estadoBadge +
        '<span class="badge badge-puntos">' + acertijo.puntos + ' pts</span>' +
        '<span class="badge badge-puntos">' + acertijo.categoria + '</span>' +
      '</div>' +
      (desbloqueado ? '' : '<p style="margin:0;font-size:0.85rem;">Disponible el ' + formatearFecha(acertijo.fecha) + '</p>');

    return el;
  }

  function render() {
    var grid = document.getElementById('acertijos-grid');
    if (!grid) return;

    window.AcertijosStore.obtenerLista().then(function (lista) {
      grid.innerHTML = '';
      lista
        .slice()
        .sort(function (a, b) { return a.numero - b.numero; })
        .forEach(function (acertijo) { grid.appendChild(crearTarjeta(acertijo)); });

      var resueltos = lista.filter(function (a) { return a.resuelto; }).length;
      var total = lista.length;
      var puntos = lista.reduce(function (t, a) { return t + (a.resuelto ? a.puntos : 0); }, 0);
      var pct = total ? Math.round((resueltos / total) * 100) : 0;

      document.getElementById('resumen-resueltos').textContent = resueltos + ' / ' + total + ' resueltos';
      document.getElementById('resumen-puntos').textContent = puntos + ' puntos';
      document.getElementById('progress-fill').style.width = pct + '%';
    });
  }

  document.addEventListener('DOMContentLoaded', render);
  window.addEventListener('progreso:actualizado', render);
})();

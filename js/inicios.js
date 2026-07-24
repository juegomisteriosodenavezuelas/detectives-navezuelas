/* Página oculta (inicios.html): muestra el registro de accesos a la
   puerta de entrada. No está enlazada desde ningún sitio del menú. */
(function () {
  var REGISTRO_LOCAL_KEY = 'navezuelasAccesos';

  function formatearFecha(iso) {
    var opciones = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(iso).toLocaleString('es-ES', opciones);
  }

  function etiquetaResultado(resultado) {
    if (resultado === 'exito') return { texto: 'Éxito', clase: 'badge-resuelto' };
    if (resultado === 'fallo') return { texto: 'Fallo', clase: 'badge-bloqueado' };
    if (resultado === 'admin') return { texto: 'Admin', clase: 'badge-admin' };
    return { texto: resultado, clase: 'badge-puntos' };
  }

  function obtenerRegistrosLocales() {
    try {
      return JSON.parse(localStorage.getItem(REGISTRO_LOCAL_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function obtenerRegistros() {
    if (window.SUPABASE_ENABLED) {
      return import('./supabase-sync.mjs')
        .then(function (mod) { return mod.obtenerAccesos(200); })
        .then(function (datos) { return datos || obtenerRegistrosLocales(); })
        .catch(function () { return obtenerRegistrosLocales(); });
    }
    return Promise.resolve(obtenerRegistrosLocales());
  }

  function render() {
    var cuerpo = document.getElementById('accesos-cuerpo');
    var resumen = document.getElementById('accesos-resumen');
    if (!cuerpo) return;

    obtenerRegistros().then(function (registros) {
      registros = registros.slice().sort(function (a, b) {
        return new Date(b.creado_en) - new Date(a.creado_en);
      });

      var total = registros.length;
      var exitos = registros.filter(function (r) { return r.resultado === 'exito'; }).length;
      var fallos = registros.filter(function (r) { return r.resultado === 'fallo'; }).length;
      var admins = registros.filter(function (r) { return r.resultado === 'admin'; }).length;

      resumen.innerHTML =
        '<span class="badge badge-puntos">Total: ' + total + '</span>' +
        '<span class="badge badge-resuelto">Éxitos: ' + exitos + '</span>' +
        '<span class="badge badge-bloqueado">Fallos: ' + fallos + '</span>' +
        '<span class="badge badge-admin">Admin: ' + admins + '</span>';

      if (!total) {
        cuerpo.innerHTML = '<p>Todavía no hay accesos registrados.</p>';
        return;
      }

      cuerpo.innerHTML = '';
      var lista = document.createElement('div');
      lista.className = 'accesos-lista';

      registros.forEach(function (registro) {
        var etiqueta = etiquetaResultado(registro.resultado);
        var fila = document.createElement('div');
        fila.className = 'acceso-fila';
        fila.innerHTML =
          '<span class="acceso-fecha">' + formatearFecha(registro.creado_en) + '</span>' +
          '<span class="badge ' + etiqueta.clase + '">' + etiqueta.texto + '</span>';
        lista.appendChild(fila);
      });

      cuerpo.appendChild(lista);
    });
  }

  document.addEventListener('DOMContentLoaded', render);
})();

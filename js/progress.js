/* Progreso local: solo se usa como respaldo cuando Supabase está
   desactivado (window.SUPABASE_ENABLED = false). Con Supabase activado,
   el estado "resuelto" vive directamente en la tabla "acertijos" y no
   necesita fusionarse desde ningún sitio: todos los dispositivos leen la
   misma fila. Ver js/acertijos-store.js. */
(function () {
  var STORAGE_KEY = 'detectivesNavezuelasProgreso';

  function leerEstado() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var resueltos = raw ? JSON.parse(raw).resueltos || [] : [];
      return { resueltos: resueltos };
    } catch (e) {
      return { resueltos: [] };
    }
  }

  function guardarEstado(estado) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    window.dispatchEvent(new CustomEvent('progreso:actualizado', { detail: estado }));
  }

  function estaResuelto(id) {
    return leerEstado().resueltos.indexOf(id) !== -1;
  }

  function marcarResuelto(id) {
    var estado = leerEstado();
    if (estado.resueltos.indexOf(id) === -1) {
      estado.resueltos.push(id);
      guardarEstado(estado);
    }
    return estado;
  }

  window.Progress = {
    leerEstado: leerEstado,
    estaResuelto: estaResuelto,
    marcarResuelto: marcarResuelto
  };
})();

/* Progreso del equipo: qué acertijos se han resuelto.
   Se guarda en localStorage y, si Firebase está activado, se sincroniza
   con la colección "equipos" para que el progreso se comparta entre dispositivos. */
(function () {
  var STORAGE_KEY = 'detectivesNavezuelasProgreso';
  var TEAM_ID = 'navezuelas';

  function leerEstado() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var resueltos = raw ? JSON.parse(raw).resueltos || [] : [];
      return { resueltos: resueltos };
    } catch (e) {
      return { resueltos: [] };
    }
  }

  function guardarEstado(estado, sync) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    window.dispatchEvent(new CustomEvent('progreso:actualizado', { detail: estado }));
    if (sync !== false) sincronizarFirebase(estado);
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

  function totalPuntos(estadoActual) {
    var estado = estadoActual || leerEstado();
    var datos = window.ACERTIJOS || [];
    return estado.resueltos.reduce(function (total, id) {
      var acertijo = datos.filter(function (a) { return a.id === id; })[0];
      return total + (acertijo ? acertijo.puntos : 0);
    }, 0);
  }

  function sincronizarFirebase(estado) {
    if (!window.FIREBASE_ENABLED) return;
    import('./firebase-sync.mjs')
      .then(function (mod) { mod.guardarProgresoEquipo(TEAM_ID, estado); })
      .catch(function () {});
  }

  function cargarDesdeFirebase() {
    if (!window.FIREBASE_ENABLED) return Promise.resolve(null);
    return import('./firebase-sync.mjs')
      .then(function (mod) { return mod.leerProgresoEquipo(TEAM_ID); })
      .catch(function () { return null; });
  }

  function fusionarConFirebase() {
    cargarDesdeFirebase().then(function (remoto) {
      if (!remoto || !remoto.resueltos) return;
      var local = leerEstado();
      var combinados = local.resueltos.slice();
      remoto.resueltos.forEach(function (id) {
        if (combinados.indexOf(id) === -1) combinados.push(id);
      });
      if (combinados.length !== local.resueltos.length) {
        guardarEstado({ resueltos: combinados }, false);
      }
    });
  }

  window.Progress = {
    leerEstado: leerEstado,
    estaResuelto: estaResuelto,
    marcarResuelto: marcarResuelto,
    totalPuntos: totalPuntos,
    TEAM_ID: TEAM_ID
  };

  fusionarConFirebase();
})();

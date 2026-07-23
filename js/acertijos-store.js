/* Acceso a los acertijos, sea cual sea el origen de los datos:
   - Con Supabase activado: la tabla "acertijos" es la fuente de la verdad
     (contenido, puntos y si está resuelto), compartida por todos los
     dispositivos. La respuesta correcta se comprueba dentro de la base
     de datos, nunca se envía al navegador.
   - Sin Supabase: se usan los datos de ejemplo de acertijos-data.js y el
     progreso se guarda en localStorage (ver progress.js). */
(function () {
  function normalizar(texto) {
    return texto.toString().trim().replace(/\s+/g, ' ').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function listaEstatica() {
    return (window.ACERTIJOS || []).map(function (acertijo) {
      return Object.assign({}, acertijo, { resuelto: window.Progress.estaResuelto(acertijo.id) });
    });
  }

  function obtenerLista() {
    if (window.SUPABASE_ENABLED) {
      return import('./supabase-sync.mjs')
        .then(function (mod) { return mod.obtenerAcertijos(); })
        .then(function (datos) { return datos || listaEstatica(); })
        .catch(function () { return listaEstatica(); });
    }
    return Promise.resolve(listaEstatica());
  }

  function obtenerUno(id) {
    return obtenerLista().then(function (lista) {
      return lista.filter(function (a) { return a.id === id; })[0] || null;
    });
  }

  function compararLocal(acertijo, respuestaTexto) {
    var valor = normalizar(respuestaTexto);
    var esperadas = (acertijo.respuestas || []).map(normalizar);
    return esperadas.indexOf(valor) !== -1;
  }

  // Devuelve una promesa que resuelve a true/false.
  function comprobarRespuesta(acertijo, respuestaTexto) {
    if (window.SUPABASE_ENABLED) {
      return import('./supabase-sync.mjs')
        .then(function (mod) { return mod.comprobarRespuesta(acertijo.id, respuestaTexto); })
        .then(function (resultado) { return !!resultado.correcto; })
        .catch(function () { return compararLocal(acertijo, respuestaTexto); });
    }
    var correcto = compararLocal(acertijo, respuestaTexto);
    if (correcto) window.Progress.marcarResuelto(acertijo.id);
    return Promise.resolve(correcto);
  }

  function totalPuntos() {
    return obtenerLista().then(function (lista) {
      return lista.reduce(function (total, a) { return total + (a.resuelto ? a.puntos : 0); }, 0);
    });
  }

  window.AcertijosStore = {
    obtenerLista: obtenerLista,
    obtenerUno: obtenerUno,
    comprobarRespuesta: comprobarRespuesta,
    totalPuntos: totalPuntos
  };
})();

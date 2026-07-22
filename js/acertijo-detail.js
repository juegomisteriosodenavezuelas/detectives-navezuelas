/* Página de detalle de un acertijo (acertijo.html?id=...). */
(function () {
  function normalizar(texto) {
    return texto.toString().trim().toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function obtenerIdDeUrl() {
    return new URLSearchParams(window.location.search).get('id');
  }

  function plantillaFormulario() {
    return (
      '<form class="respuesta-form" id="form-respuesta">' +
        '<label for="input-respuesta"><strong>¿Cuál es la solución?</strong></label>' +
        '<input type="text" id="input-respuesta" autocomplete="off" required placeholder="Escribe tu respuesta">' +
        '<div class="feedback" id="feedback-respuesta"></div>' +
        '<button type="submit" class="btn btn-primary">Enviar respuesta</button>' +
      '</form>'
    );
  }

  function plantillaResuelto(acertijo) {
    return (
      '<div class="solved-panel">' +
        '<p style="margin:0;"><strong>¡Caso resuelto!</strong> Habéis ganado ' + acertijo.puntos + ' puntos.</p>' +
      '</div>'
    );
  }

  function render() {
    var contenedor = document.getElementById('acertijo-contenido');
    var acertijo = (window.ACERTIJOS || []).filter(function (a) { return a.id === obtenerIdDeUrl(); })[0];

    if (!acertijo) {
      contenedor.innerHTML = '<p>No hemos encontrado ese caso. <a href="acertijos.html">Volver a la lista de acertijos</a>.</p>';
      return;
    }

    var desbloqueado = new Date() >= new Date(acertijo.fecha);
    if (!desbloqueado) {
      contenedor.innerHTML =
        '<h1>' + acertijo.titulo + '</h1>' +
        '<p>Este caso todavía está sellado. Estará disponible a partir del ' +
        new Date(acertijo.fecha).toLocaleString('es-ES') + '.</p>' +
        '<p><a href="acertijos.html">Volver a la lista de acertijos</a></p>';
      return;
    }

    document.title = acertijo.titulo + ' — Detectives de Navezuelas';

    var resuelto = window.Progress.estaResuelto(acertijo.id);

    contenedor.innerHTML =
      '<p class="numero" style="font-family:\'Special Elite\',monospace;color:var(--color-accent);">' +
        'Caso nº ' + acertijo.numero + ' · ' + acertijo.categoria +
      '</p>' +
      '<h1>' + acertijo.titulo + '</h1>' +
      '<p class="enunciado">' + acertijo.enunciado + '</p>' +
      '<button type="button" class="pista-toggle" id="btn-pista">🔍 Ver pista</button>' +
      '<div class="pista-texto" id="texto-pista"><strong>Pista:</strong> ' + acertijo.pista + '</div>' +
      (resuelto ? plantillaResuelto(acertijo) : plantillaFormulario()) +
      '<p style="margin-top:1.2rem;"><a href="acertijos.html">← Volver a la lista de acertijos</a></p>';

    document.getElementById('btn-pista').addEventListener('click', function () {
      document.getElementById('texto-pista').classList.toggle('show');
    });

    if (!resuelto) {
      document.getElementById('form-respuesta').addEventListener('submit', function (e) {
        e.preventDefault();
        var input = document.getElementById('input-respuesta');
        var valor = normalizar(input.value);
        var esperadas = acertijo.respuestas.map(normalizar);
        var feedback = document.getElementById('feedback-respuesta');

        if (esperadas.indexOf(valor) !== -1) {
          window.Progress.marcarResuelto(acertijo.id);
          render();
        } else {
          feedback.textContent = 'No es correcto. Revisad la pista y volved a intentarlo.';
          feedback.className = 'feedback show error';
          input.focus();
          input.select();
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', render);
})();

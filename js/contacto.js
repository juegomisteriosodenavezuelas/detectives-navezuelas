/* Código de 9 símbolos de la página de Contacto.
   Sin Firebase activado, se compara contra un código de demostración local.
   Con Firebase activado, se consulta la colección "secretos" (ver README.md). */
(function () {
  var DEMO = {
    codigo: 'N4V3ZU3L4',
    mensaje: 'La línea ha cobrado vida. Alguien responde al otro lado del silencio...',
    telefono: '+34 000 000 000'
  };

  function normalizarCodigo(codigo) {
    return codigo.toUpperCase().replace(/\s+/g, '');
  }

  function configurarCajas() {
    var contenedor = document.getElementById('codigo-boxes');
    if (!contenedor) return [];
    var inputs = Array.prototype.slice.call(contenedor.querySelectorAll('input'));

    inputs.forEach(function (input, index) {
      input.addEventListener('input', function () {
        input.value = input.value.slice(-1);
        if (input.value && index < inputs.length - 1) inputs[index + 1].focus();
      });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !input.value && index > 0) inputs[index - 1].focus();
      });

      input.addEventListener('paste', function (e) {
        e.preventDefault();
        var texto = (e.clipboardData || window.clipboardData).getData('text').trim();
        texto.split('').slice(0, inputs.length).forEach(function (char, i) {
          if (inputs[i]) inputs[i].value = char;
        });
        var ultimo = Math.min(texto.length, inputs.length) - 1;
        if (ultimo >= 0) inputs[ultimo].focus();
      });
    });

    return inputs;
  }

  function verificar(codigo) {
    if (window.FIREBASE_ENABLED) {
      return import('./firebase-sync.mjs')
        .then(function (mod) { return mod.verificarCodigoContacto(codigo); })
        .catch(function () { return null; })
        .then(function (datos) { return datos || (codigo === DEMO.codigo ? DEMO : null); });
    }
    return Promise.resolve(codigo === DEMO.codigo ? DEMO : null);
  }

  function agitar(el) {
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var inputs = configurarCajas();
    var form = document.getElementById('form-codigo');
    var boxesWrap = document.getElementById('codigo-boxes');
    var reveal = document.getElementById('reveal-panel');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var codigo = normalizarCodigo(inputs.map(function (i) { return i.value; }).join(''));

      if (codigo.length < inputs.length) {
        agitar(boxesWrap);
        return;
      }

      verificar(codigo).then(function (datos) {
        if (datos) {
          reveal.innerHTML =
            '<p>' + datos.mensaje + '</p>' +
            '<p class="telefono">' + datos.telefono + '</p>';
          reveal.classList.add('show');
          reveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          agitar(boxesWrap);
          reveal.classList.remove('show');
        }
      });
    });
  });
})();

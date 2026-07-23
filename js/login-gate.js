/* Puerta de entrada falsa: simula un reconocimiento facial al abrir la web.
   - Si no se toca la pantalla, tras la "verificación" se revela la foto de
     los detectives reales y se entra en la página normalmente.
   - Un solo toque durante el escaneo se interpreta como un intento no
     autorizado: se muestra un aviso y se redirige a acceso-denegado.html.
   - Un doble toque rápido es la entrada de administrador: salta
     directamente a la página, sin aviso ni espera. */
(function () {
  var SESSION_KEY = 'navezuelasAutenticado';
  var overlay = document.getElementById('login-gate');
  if (!overlay) return;

  if (sessionStorage.getItem(SESSION_KEY) === 'true') {
    overlay.remove();
    return;
  }

  document.documentElement.classList.add('gate-lock');

  var estado = document.getElementById('gate-status');
  var visual = document.getElementById('gate-visual');
  var temporizadores = [];
  var escaneoActivo = true;
  var ultimoToque = 0;
  var temporizadorToqueUnico = null;

  var FASES = [
    { texto: 'Iniciando sesión…', retraso: 1400 },
    { texto: 'Reconocimiento facial…', retraso: 2800 },
    { texto: 'Esperando…', retraso: 4200 }
  ];

  function mostrarTexto(texto) {
    estado.classList.remove('gate-status-anim');
    void estado.offsetWidth;
    estado.textContent = texto;
    estado.classList.add('gate-status-anim');
  }

  function programar(fn, retraso) {
    temporizadores.push(setTimeout(fn, retraso));
  }

  function limpiarTemporizadores() {
    temporizadores.forEach(clearTimeout);
    temporizadores = [];
  }

  FASES.forEach(function (fase) {
    programar(function () { mostrarTexto(fase.texto); }, fase.retraso);
  });
  programar(concederAcceso, 5600);

  function concederAcceso() {
    if (!escaneoActivo) return;
    escaneoActivo = false;
    limpiarTemporizadores();
    overlay.classList.add('gate-exito');
    visual.innerHTML = '<img src="Detectives reales.png" alt="Héctor, Martín y Carlota, los detectives reales" class="gate-foto">';
    mostrarTexto('Acceso concedido.\nBienvenidos, detectives.');
    programar(cerrarPuerta, 3000);
  }

  function cerrarPuerta() {
    sessionStorage.setItem(SESSION_KEY, 'true');
    document.documentElement.classList.remove('gate-lock');
    overlay.classList.add('gate-oculto');
    setTimeout(function () { overlay.remove(); }, 600);
  }

  function accesoNoAutorizado() {
    if (!escaneoActivo) return;
    escaneoActivo = false;
    limpiarTemporizadores();
    overlay.classList.add('gate-alerta');
    mostrarTexto('Inicio de sesión no autorizado.\nSolo Héctor, Martín y Carlota pueden iniciar sesión.');
    setTimeout(function () {
      window.location.href = 'acceso-denegado.html';
    }, 1800);
  }

  function entradaAdmin() {
    if (!escaneoActivo) return;
    escaneoActivo = false;
    limpiarTemporizadores();
    document.documentElement.classList.remove('gate-lock');
    sessionStorage.setItem(SESSION_KEY, 'true');
    overlay.remove();
  }

  overlay.addEventListener('click', function () {
    if (!escaneoActivo) return;
    var ahora = Date.now();
    if (ahora - ultimoToque < 350) {
      clearTimeout(temporizadorToqueUnico);
      entradaAdmin();
    } else {
      ultimoToque = ahora;
      temporizadorToqueUnico = setTimeout(accesoNoAutorizado, 350);
    }
  });
})();

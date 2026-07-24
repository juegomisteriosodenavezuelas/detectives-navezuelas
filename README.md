# Los Detectives de Navezuelas

Sitio web del juego de verano para Héctor, Martín y Carlota. Es una web
estática (HTML + CSS + JS, sin build), pensada para publicarse directamente
con GitHub Pages.

## Estructura

```
index.html              Portada: introducción a la historia y puerta de acceso
acertijos.html          Lista de casos, con marcador de puntos
acertijo.html           Plantilla de detalle (se usa como acertijo.html?id=...)
contacto.html           Línea secreta con el código de 9 símbolos
acceso-denegado.html    Pantalla de acceso no autorizado (ver puerta de entrada)
inicios.html            Registro de accesos, oculta, no enlazada desde ningún menú

css/style.css           Estilos (mobile-first)

js/acertijos-data.js    Datos de ejemplo, solo se usan si Supabase está desactivado
js/acertijos-store.js   Acceso a los acertijos (Supabase si está activo, si no los datos de ejemplo)
js/progress.js          Progreso local de respaldo (localStorage), solo sin Supabase
js/nav.js               Menú móvil, marcador de puntos y foto real tras el login
js/login-gate.js        Puerta de entrada falsa (reconocimiento facial) en index.html
js/inicios.js           Lógica de la página oculta de registro de accesos
js/acertijos.js         Lógica de la página de lista
js/acertijo-detail.js   Lógica de la página de detalle
js/contacto.js          Lógica del código de 9 símbolos
js/supabase-config.js   Configuración de Supabase (rellenar cuando se active)
js/supabase-sync.mjs    Llamadas a Supabase, cargado solo si Supabase está activado

supabase/schema.sql     Tablas, políticas y funciones de la base de datos
SUPABASE-SETUP.md       Guía paso a paso para crear el proyecto y la base de datos
```

## Publicar en GitHub Pages

1. Sube esta carpeta a un repositorio de GitHub.
2. En el repositorio: **Settings → Pages → Source** → rama `main`, carpeta `/ (root)`.
3. La web quedará publicada en `https://<usuario>.github.io/<repositorio>/`.

No hace falta ningún paso de compilación: todo es HTML/CSS/JS plano.

## Añadir un acertijo nuevo

**Con Supabase activado** (recomendado, ver más abajo): añade una fila en
la tabla `acertijos` desde el Table Editor de Supabase. No hace falta tocar
código ni crear una página HTML por caso: `acertijo.html` es una plantilla
que carga el contenido según el `id` de la URL (`acertijo.html?id=tu-id`).
Detalles de cada columna en [`SUPABASE-SETUP.md`](SUPABASE-SETUP.md).

**Sin Supabase** (modo de demostración): edita `js/acertijos-data.js` y
añade un objeto al array `ACERTIJOS`, con la misma forma que los de
ejemplo (`id`, `numero`, `fecha`, `titulo`, `categoria`, `dificultad`,
`puntos`, `enunciado`, `pista`, `respuestas`).

## El código de contacto (9 símbolos)

Por defecto, `js/contacto.js` acepta el código de demostración `N4V3ZU3L4`
y muestra un mensaje y teléfono de ejemplo. Para cambiarlos sin usar Supabase,
edita el objeto `DEMO` al principio de `js/contacto.js`.

## Los acertijos y Supabase (opcional)

Sin configurar nada, la web funciona con los 4 casos de ejemplo de
`js/acertijos-data.js` y guarda el progreso en `localStorage` (por
dispositivo, no compartido).

Activando Supabase, el contenido de cada caso, sus puntos y si está
resuelto o no viven en la tabla `acertijos`, compartida por todos los
dispositivos: en cuanto alguien acierta un caso desde su móvil, aparece
resuelto en cualquier otro. Sigue la guía paso a paso de
[`SUPABASE-SETUP.md`](SUPABASE-SETUP.md) (el SQL para crear todo está en
[`supabase/schema.sql`](supabase/schema.sql)).

Resumen rápido una vez tengáis vuestro proyecto de Supabase:

1. Ejecutad `supabase/schema.sql` en el SQL Editor de Supabase.
2. Pegad la **Project URL** y la clave **anon/public** de vuestro proyecto
   en `js/supabase-config.js` (nunca la clave `service_role`/`secret`).
3. Cambiad `SUPABASE_ENABLED` a `true`.

Con `SUPABASE_ENABLED = false` (valor por defecto), nada de esto se usa y la
web funciona igualmente con los datos de ejemplo y el almacenamiento local.

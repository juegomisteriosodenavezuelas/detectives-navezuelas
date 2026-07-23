# Cómo crear la base de datos en Supabase

Esta guía explica, paso a paso, cómo crear un proyecto gratuito de Supabase
y conectarlo a la web para que el contenido de los acertijos, sus puntos y
si están resueltos o no vivan en una base de datos real, compartida entre
todos los dispositivos (el móvil de cada hermano verá el mismo progreso).

No hace falta tarjeta de crédito ni saber programar: el plan gratuito
("Free") de Supabase es más que suficiente para este juego.

## 1. Crear el proyecto

1. Entra en <https://supabase.com> y pulsa **Start your project** /
   **Sign in** (puedes entrar con tu cuenta de GitHub o Google).
2. Pulsa **New project**.
3. Elige una organización (o crea una, es gratis) y rellena:
   - **Name**: por ejemplo `detectives-navezuelas`.
   - **Database Password**: genera una y guárdala en algún sitio seguro
     (no la necesitarás para esta web, pero conviene conservarla).
   - **Region**: la más cercana a España, por ejemplo `West EU (London)`.
4. Pulsa **Create new project** y espera 1-2 minutos mientras se
   aprovisiona.

## 2. Crear las tablas

1. En el menú de la izquierda, entra en **SQL Editor**.
2. Pulsa **New query**.
3. Abre el archivo [`supabase/schema.sql`](supabase/schema.sql) de este
   repositorio, copia **todo** su contenido, pégalo en el editor y pulsa
   **Run**.

Ese script crea:

- **`acertijos`**: una fila por caso, con su contenido (`titulo`,
  `enunciado`, `pista`, `categoria`, `dificultad`), sus `puntos`, la fecha
  en la que se desbloquea (`fecha`) y si ya está `resuelto`. Incluye los 4
  casos de ejemplo que traía la web de serie — edítalos o bórralos según
  os convenga (ver "Añadir o editar un acertijo" más abajo).
- **`secretos`**: el código de Contacto de 9 símbolos y el mensaje/teléfono
  que se revela al acertarlo.
- Una función `comprobar_respuesta(id, respuesta)` que compara la
  respuesta **dentro** de la base de datos y marca el caso como resuelto
  si acierta. Gracias a esto, la respuesta correcta nunca se envía al
  navegador: solo se puede leer el contenido del acertijo, nunca su
  columna `respuestas`.

Esto es intencionadamente sencillo (sin usuarios ni contraseñas) porque es
un juego familiar, no una aplicación con datos sensibles: cualquiera con la
web puede leer los acertijos y marcar uno como resuelto acertando la
respuesta, pero nadie puede leer las respuestas directamente ni alterar
puntos o contenido desde el navegador.

## 3. Obtener la URL y la clave del proyecto

1. En el menú de la izquierda: **Project Settings** (icono de engranaje) →
   **API**.
2. Copia:
   - **Project URL**: algo como `https://abcdefghijk.supabase.co` — **no**
     es lo mismo que el host de la base de datos (`db.abcdefghijk.supabase.co`),
     ese es solo para conexiones directas a Postgres y no sirve aquí.
   - La clave **anon / public** (a veces con prefijo `sb_publishable_...`),
     en la sección **Project API keys**.

   **No uses la clave `service_role` / `sb_secret_...`.** Esa clave tiene
   acceso total a la base de datos saltándose todas las reglas de
   seguridad; si la pegas en un archivo que acaba en GitHub Pages, quedará
   visible para cualquiera que vea el código fuente de la web.

## 4. Conectar la web con tu proyecto

1. Abre `js/supabase-config.js` en el editor.
2. Pega la **Project URL** y la clave **anon** del paso 3.
3. Cambia `SUPABASE_ENABLED` de `false` a `true`.

Debería quedar así (con tus propios valores):

```js
window.SUPABASE_ENABLED = true;

window.SUPABASE_URL = 'https://abcdefghijk.supabase.co';
window.SUPABASE_ANON_KEY = 'sb_publishable_...........................';
```

Guarda el archivo y sube el cambio a GitHub (o pruébalo primero en local).
A partir de ahora, la lista de acertijos, sus puntos y su estado resuelto
se leen directamente de la tabla `acertijos`.

## 5. Añadir o editar un acertijo

Ya no hace falta tocar código para añadir un caso nuevo: en Supabase →
**Table Editor** → tabla `acertijos` → **Insert row**, rellena:

- `id`: identificador único en minúsculas, por ejemplo `caso-05` (se usa en
  la URL `acertijo.html?id=caso-05`).
- `numero`, `titulo`, `categoria`, `dificultad`, `puntos`.
- `fecha`: cuándo se desbloquea (con hora y zona horaria, por ejemplo
  `2026-07-24 15:30:00+02`).
- `enunciado`, `pista`.
- `respuestas`: un array de texto, por ejemplo `{"CANGURO"}` o
  `{"EL PAYASO","PAYASO"}` si quieres aceptar varias formas válidas.
- `resuelto`: déjalo en `false`.

## 6. Crear el código secreto de Contacto

Por defecto, la página de Contacto usa un código de demostración escrito en
`js/contacto.js`. Si prefieres guardar el código real (y el mensaje/teléfono
que se revela) en Supabase en vez de en el código fuente:

1. En el menú de la izquierda: **Table Editor** → tabla `secretos`.
2. Pulsa **Insert** → **Insert row**.
3. Rellena:
   - `codigo`: el código de 9 símbolos, por ejemplo `N4V3ZU3L4` (en
     mayúsculas, sin espacios).
   - `mensaje`: el texto que verán al acertar.
   - `telefono`: el número o mensaje final.
4. Pulsa **Save**.

La web comprueba primero Supabase y, si no encuentra la fila, usa el
código de demostración como respaldo — así nunca se queda "rota" mientras
configuras esto.

## 7. Comprobar que funciona

1. Abre la web (en local o ya publicada en GitHub Pages) y resuelve un
   caso en `acertijos.html`.
2. Vuelve a Supabase → **Table Editor** → tabla `acertijos`.
3. Deberías ver que la fila de ese caso tiene ahora `resuelto = true` y
   `resuelto_en` con la fecha y hora.
4. Prueba a abrir la web desde otro dispositivo o navegador: debería
   aparecer ya como resuelto, sin que ese dispositivo lo haya resuelto él
   mismo.

## Sobre los costes

El plan gratuito de Supabase incluye 500 MB de base de datos y 5 GB de
transferencia al mes. Con tres detectives resolviendo unos pocos casos al
día, este proyecto usará una fracción mínima de ese límite: no hace falta
añadir tarjeta de crédito ni preocuparse por facturación.

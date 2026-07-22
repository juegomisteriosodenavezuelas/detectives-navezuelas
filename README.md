# Los Detectives de Navezuelas

Sitio web del juego de verano para Héctor, Martín y Carlota. Es una web
estática (HTML + CSS + JS, sin build), pensada para publicarse directamente
con GitHub Pages.

## Estructura

```
index.html          Portada: introducción a la historia
acertijos.html       Lista de casos, con marcador de puntos
acertijo.html         Plantilla de detalle (se usa como acertijo.html?id=...)
contacto.html         Línea secreta con el código de 9 símbolos
css/style.css         Estilos (mobile-first)
js/acertijos-data.js   Datos de los acertijos (editar aquí para añadir casos)
js/progress.js         Progreso del equipo (localStorage + Firebase)
js/nav.js               Menú móvil y marcador de puntos del cabecero
js/acertijos.js          Lógica de la página de lista
js/acertijo-detail.js     Lógica de la página de detalle
js/contacto.js            Lógica del código de 9 símbolos
js/firebase-config.js      Configuración de Firebase (rellenar cuando se active)
js/firebase-sync.mjs        Llamadas a Firestore, cargado solo si Firebase está activado
```

## Publicar en GitHub Pages

1. Sube esta carpeta a un repositorio de GitHub.
2. En el repositorio: **Settings → Pages → Source** → rama `main`, carpeta `/ (root)`.
3. La web quedará publicada en `https://<usuario>.github.io/<repositorio>/`.

No hace falta ningún paso de compilación: todo es HTML/CSS/JS plano.

## Añadir un acertijo nuevo

Edita `js/acertijos-data.js` y añade un objeto al array `ACERTIJOS`:

```js
{
  id: 'identificador-unico',       // usado en la URL: acertijo.html?id=identificador-unico
  numero: 5,
  fecha: '2026-07-24T15:30:00',    // el caso se desbloquea automáticamente a partir de esta fecha
  titulo: 'Título del caso',
  categoria: 'Categoría',
  dificultad: 'Fácil',
  puntos: 15,
  enunciado: 'Texto del acertijo...',
  pista: 'Pista opcional...',
  respuestas: ['RESPUESTA', 'SINONIMO ACEPTADO']  // se comparan sin tildes y en mayúsculas
}
```

No se necesita crear una página HTML por acertijo: `acertijo.html` es una
plantilla que carga el contenido correspondiente según el `id` de la URL.

## El código de contacto (9 símbolos)

Por defecto, `js/contacto.js` acepta el código de demostración `N4V3ZU3L4`
y muestra un mensaje y teléfono de ejemplo. Para cambiarlos sin usar Firebase,
edita el objeto `DEMO` al principio de `js/contacto.js`.

## Progreso del equipo y Firebase (opcional)

El progreso (qué casos están resueltos) se guarda siempre en `localStorage`
del navegador, así que la web funciona sin configurar nada más. Si queréis
que el progreso se comparta entre varios dispositivos (por ejemplo, el móvil
de cada hermano), activad Firestore:

1. Cread un proyecto gratuito en <https://console.firebase.google.com>.
2. **Build → Firestore Database → Crear base de datos** (modo producción).
3. **Configuración del proyecto → Vuestras apps → Añadir app web**, copiad
   el objeto de configuración.
4. Pegad esos valores en `js/firebase-config.js` y cambiad
   `FIREBASE_ENABLED` a `true`.
5. En **Firestore → Reglas**, usad algo como:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /equipos/{equipoId} {
         allow read, write: if true;
       }
       match /secretos/{codigo} {
         allow read: if true;
         allow write: if false;
       }
     }
   }
   ```

   Esto es intencionadamente sencillo (sin autenticación) porque es un juego
   familiar, no una aplicación con datos sensibles. `allow write: if false`
   en `secretos` impide que cualquiera escriba códigos nuevos desde el
   navegador; esos documentos se crean a mano desde la consola de Firebase.

6. Para usar el código de contacto desde Firestore en vez del código de
   demostración, cread manualmente en la consola un documento en la colección
   `secretos` cuyo ID sea el código (por ejemplo `secretos/N4V3ZU3L4`) con
   los campos `mensaje` y `telefono`.

Con `FIREBASE_ENABLED = false` (valor por defecto), nada de esto se usa y la
web funciona igualmente con el almacenamiento local del navegador.

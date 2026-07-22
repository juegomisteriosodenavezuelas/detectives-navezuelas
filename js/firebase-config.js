/* Configuración de Firebase.
   1. Crea un proyecto gratuito en https://console.firebase.google.com
   2. Activa Firestore Database (modo producción) en el proyecto.
   3. Registra una "app web" y copia aquí los valores que te da la consola.
   4. Cambia FIREBASE_ENABLED a true.
   Ver README.md para las reglas de seguridad recomendadas. */
window.FIREBASE_ENABLED = false;

window.FIREBASE_CONFIG = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_PROYECTO.firebaseapp.com',
  projectId: 'TU_PROYECTO',
  storageBucket: 'TU_PROYECTO.appspot.com',
  messagingSenderId: 'TU_SENDER_ID',
  appId: 'TU_APP_ID'
};

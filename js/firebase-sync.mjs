// Módulo cargado dinámicamente solo cuando window.FIREBASE_ENABLED es true.
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

function obtenerApp() {
  return getApps().length ? getApp() : initializeApp(window.FIREBASE_CONFIG);
}

export async function guardarProgresoEquipo(teamId, estado) {
  const db = getFirestore(obtenerApp());
  await setDoc(doc(db, 'equipos', teamId), estado, { merge: true });
}

export async function leerProgresoEquipo(teamId) {
  const db = getFirestore(obtenerApp());
  const snap = await getDoc(doc(db, 'equipos', teamId));
  return snap.exists() ? snap.data() : null;
}

export async function verificarCodigoContacto(codigo) {
  const db = getFirestore(obtenerApp());
  const snap = await getDoc(doc(db, 'secretos', codigo));
  return snap.exists() ? snap.data() : null;
}

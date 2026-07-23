// Módulo cargado dinámicamente solo cuando window.SUPABASE_ENABLED es true.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.110.1';

let cliente;
function obtenerCliente() {
  if (!cliente) cliente = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  return cliente;
}

const COLUMNAS_PUBLICAS = 'id, numero, fecha, titulo, categoria, dificultad, puntos, enunciado, pista, resuelto, resuelto_en';

export async function obtenerAcertijos() {
  const supabase = obtenerCliente();
  const { data, error } = await supabase
    .from('acertijos')
    .select(COLUMNAS_PUBLICAS)
    .order('numero', { ascending: true });
  if (error) return null;
  return data;
}

// La respuesta correcta nunca sale de la base de datos: se comprueba
// dentro de una función de Postgres (ver supabase/schema.sql).
export async function comprobarRespuesta(id, respuesta) {
  const supabase = obtenerCliente();
  const { data, error } = await supabase.rpc('comprobar_respuesta', {
    p_id: id,
    p_respuesta: respuesta
  });
  if (error || !data || !data.length) return { correcto: false, ya_resuelto: false, puntos: 0 };
  return data[0];
}

export async function verificarCodigoContacto(codigo) {
  const supabase = obtenerCliente();
  const { data, error } = await supabase
    .from('secretos')
    .select('mensaje, telefono')
    .eq('codigo', codigo)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

/* Datos de ejemplo de los acertijos, usados solo cuando Supabase está
   desactivado (window.SUPABASE_ENABLED = false en js/supabase-config.js).
   Con Supabase activado, el contenido real vive en la tabla "acertijos"
   (ver supabase/schema.sql) y este archivo se ignora. */
window.ACERTIJOS = [
  {
    id: 'cifrado-cesar',
    numero: 1,
    fecha: '2026-07-15T15:30:00',
    titulo: 'El mensaje cifrado',
    categoria: 'Cifrado César',
    dificultad: 'Fácil',
    puntos: 10,
    enunciado:
      'Un sobre amarillento ha aparecido esta mañana bajo la puerta, sin remite. ' +
      'Dentro, una única frase, escrita con letras que no significan nada... a simple vista.\n\n' +
      '«QDYHCXHODV»\n\n' +
      'El detective ha dejado una nota junto al sobre: "Todo mensaje en clave esconde una regla. ' +
      'Buscad el patrón, contad las posiciones, y el nombre de vuestro pueblo os abrirá la primera puerta."\n\n' +
      '¿Qué palabra se esconde tras el cifrado?',
    pista:
      'Es un cifrado César: cada letra del mensaje original se ha desplazado 3 posiciones hacia delante ' +
      'en el abecedario. Para descifrarlo, retrocede 3 letras cada una (la Q se convierte en N...).',
    respuestas: ['NAVEZUELAS']
  },
  {
    id: 'misterio-circo',
    numero: 2,
    fecha: '2026-07-18T15:30:00',
    titulo: 'El misterio del circo',
    categoria: 'Misterio de circo',
    dificultad: 'Media',
    puntos: 15,
    enunciado:
      'El Circo Luna Roja ha llegado esta semana a Navezuelas. Pero anoche desapareció el sombrero de copa ' +
      'del Maestro de Ceremonias, justo antes del gran número final.\n\n' +
      'Solo tres artistas seguían entre bambalinas a esa hora:\n' +
      '– El malabarista jura que estaba ensayando con antorchas encendidas.\n' +
      '– La trapecista dice que llevaba puestos unos guantes blancos impecables.\n' +
      '– El payaso asegura que se pasó toda la noche puliendo sus zapatos negros.\n\n' +
      'Cuando el detective examinó el sombrero recuperado a la mañana siguiente, encontró en el ala ' +
      'interior una mancha de betún negro reciente.\n\n' +
      '¿Quién se llevó el sombrero?',
    pista: 'Piensa en qué actividad deja las manos manchadas de negro... y quién dijo estar hablando de zapatos.',
    respuestas: ['EL PAYASO', 'PAYASO']
  },
  {
    id: 'animales-mundo',
    numero: 3,
    fecha: '2026-07-21T15:30:00',
    titulo: 'La postal sin sello',
    categoria: 'Animales del mundo',
    dificultad: 'Fácil',
    puntos: 15,
    enunciado:
      'Una postal ha llegado desde muy lejos, sin sello ni matasellos. En ella, solo tres pistas sobre ' +
      'un animal misterioso:\n\n' +
      '1. Vivo en Australia y llevo a mis crías en una bolsa que tengo en la barriga.\n' +
      '2. Puedo dar saltos de más de 9 metros de un solo impulso.\n' +
      '3. Mis patas traseras son mucho más grandes y fuertes que las delanteras.\n\n' +
      '¿Qué animal soy?',
    pista: 'Es el animal símbolo de Australia que aparece boxeando en los dibujos animados.',
    respuestas: ['CANGURO']
  },
  {
    id: 'pistas-pueblo',
    numero: 4,
    fecha: '2026-07-23T15:30:00',
    titulo: 'La piedra tallada',
    categoria: 'Pistas del pueblo',
    dificultad: 'Media',
    puntos: 20,
    enunciado:
      'En la plaza de Navezuelas hay un lugar donde el agua lleva cayendo el mismo sonido desde hace ' +
      'generaciones. Los vecinos van allí a llenar sus cántaros, y los detectives más atentos han ' +
      'encontrado, tallada en la piedra, una fecha que no coincide con ninguna de las casas del pueblo.\n\n' +
      '¿Dónde debéis buscar la siguiente pista?',
    pista: 'Es el lugar del pueblo donde siempre se ha ido a por agua fresca.',
    respuestas: ['LA FUENTE', 'FUENTE']
  }
];

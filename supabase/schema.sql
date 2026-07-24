-- Los Detectives de Navezuelas — esquema de Supabase
-- Pega este archivo completo en Supabase → SQL Editor → New query → Run.

-- Necesaria para comparar respuestas sin importar tildes/mayúsculas.
create extension if not exists unaccent;

create table acertijos (
  id text primary key,
  numero integer not null,
  fecha timestamptz not null,
  titulo text not null,
  categoria text not null,
  dificultad text not null,
  puntos integer not null,
  enunciado text not null,
  pista text not null,
  respuestas text[] not null,
  resuelto boolean not null default false,
  resuelto_en timestamptz
);

create table secretos (
  codigo text primary key,
  mensaje text not null,
  telefono text not null
);

-- Registro de cada visita a la puerta de entrada (index.html): cuándo y
-- si fue un acceso normal ("exito"), un toque no autorizado ("fallo") o
-- la entrada de administrador con doble toque ("admin"). Lo consulta la
-- página oculta inicios.html.
create table accesos (
  id bigint generated always as identity primary key,
  creado_en timestamptz not null default now(),
  resultado text not null check (resultado in ('exito', 'fallo', 'admin'))
);

alter table acertijos enable row level security;
alter table secretos enable row level security;
alter table accesos enable row level security;

create policy "acertijos_lectura_publica" on acertijos
  for select using (true);

create policy "secretos_lectura_publica" on secretos
  for select using (true);

-- Cualquiera puede añadir un registro (lo hace la propia web al entrar),
-- y también se puede leer: no hay ninguna respuesta ni dato sensible
-- aquí, solo una marca de tiempo y un resultado.
create policy "accesos_insercion_publica" on accesos
  for insert with check (true);

create policy "accesos_lectura_publica" on accesos
  for select using (true);

grant select, insert on accesos to anon, authenticated;

-- El navegador solo puede leer las columnas públicas de "acertijos".
-- La columna "respuestas" queda oculta: la respuesta correcta nunca
-- se envía al navegador, se comprueba dentro de la base de datos
-- con la función comprobar_respuesta() de más abajo.
revoke all on acertijos from anon, authenticated;
grant select (
  id, numero, fecha, titulo, categoria, dificultad, puntos,
  enunciado, pista, resuelto, resuelto_en
) on acertijos to anon, authenticated;

-- "secretos" también es de solo lectura desde el navegador: no hay
-- política de insert/update/delete, así que Supabase las deniega.
grant select on secretos to anon, authenticated;

-- Comprueba una respuesta dentro de la base de datos y, si es correcta,
-- marca el caso como resuelto. Nunca revela el contenido de "respuestas".
create or replace function comprobar_respuesta(p_id text, p_respuesta text)
returns table(correcto boolean, ya_resuelto boolean, puntos integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  fila acertijos;
begin
  select * into fila from acertijos where id = p_id;

  if fila is null then
    return query select false, false, 0;
    return;
  end if;

  if upper(unaccent(regexp_replace(trim(p_respuesta), '\s+', ' ', 'g'))) = any (
    select upper(unaccent(regexp_replace(trim(r), '\s+', ' ', 'g'))) from unnest(fila.respuestas) as r
  ) then
    if not fila.resuelto then
      update acertijos set resuelto = true, resuelto_en = now() where id = p_id;
    end if;
    return query select true, true, fila.puntos;
  else
    return query select false, fila.resuelto, 0;
  end if;
end;
$$;

grant execute on function comprobar_respuesta(text, text) to anon, authenticated;

-- Datos de ejemplo (los mismos 4 casos que venían de serie en la web).
-- Bórralos o edítalos como queráis una vez tengáis vuestros propios casos.
insert into acertijos (id, numero, fecha, titulo, categoria, dificultad, puntos, enunciado, pista, respuestas) values
(
  'cifrado-cesar', 1, '2026-07-15T15:30:00+02:00', 'El mensaje cifrado', 'Cifrado César', 'Fácil', 10,
  E'Un sobre amarillento ha aparecido esta mañana bajo la puerta, sin remite. Dentro, una única frase, escrita con letras que no significan nada... a simple vista.\n\n«QDYHCXHODV»\n\nEl detective ha dejado una nota junto al sobre: "Todo mensaje en clave esconde una regla. Buscad el patrón, contad las posiciones, y el nombre de vuestro pueblo os abrirá la primera puerta."\n\n¿Qué palabra se esconde tras el cifrado?',
  'Es un cifrado César: cada letra del mensaje original se ha desplazado 3 posiciones hacia delante en el abecedario. Para descifrarlo, retrocede 3 letras cada una (la Q se convierte en N...).',
  ARRAY['NAVEZUELAS']
),
(
  'misterio-circo', 2, '2026-07-18T15:30:00+02:00', 'El misterio del circo', 'Misterio de circo', 'Media', 15,
  E'El Circo Luna Roja ha llegado esta semana a Navezuelas. Pero anoche desapareció el sombrero de copa del Maestro de Ceremonias, justo antes del gran número final.\n\nSolo tres artistas seguían entre bambalinas a esa hora:\n– El malabarista jura que estaba ensayando con antorchas encendidas.\n– La trapecista dice que llevaba puestos unos guantes blancos impecables.\n– El payaso asegura que se pasó toda la noche puliendo sus zapatos negros.\n\nCuando el detective examinó el sombrero recuperado a la mañana siguiente, encontró en el ala interior una mancha de betún negro reciente.\n\n¿Quién se llevó el sombrero?',
  'Piensa en qué actividad deja las manos manchadas de negro... y quién dijo estar hablando de zapatos.',
  ARRAY['EL PAYASO', 'PAYASO']
),
(
  'animales-mundo', 3, '2026-07-21T15:30:00+02:00', 'La postal sin sello', 'Animales del mundo', 'Fácil', 15,
  E'Una postal ha llegado desde muy lejos, sin sello ni matasellos. En ella, solo tres pistas sobre un animal misterioso:\n\n1. Vivo en Australia y llevo a mis crías en una bolsa que tengo en la barriga.\n2. Puedo dar saltos de más de 9 metros de un solo impulso.\n3. Mis patas traseras son mucho más grandes y fuertes que las delanteras.\n\n¿Qué animal soy?',
  'Es el animal símbolo de Australia que aparece boxeando en los dibujos animados.',
  ARRAY['CANGURO']
),
(
  'pistas-pueblo', 4, '2026-07-23T15:30:00+02:00', 'La piedra tallada', 'Pistas del pueblo', 'Media', 20,
  E'En la plaza de Navezuelas hay un lugar donde el agua lleva cayendo el mismo sonido desde hace generaciones. Los vecinos van allí a llenar sus cántaros, y los detectives más atentos han encontrado, tallada en la piedra, una fecha que no coincide con ninguna de las casas del pueblo.\n\n¿Dónde debéis buscar la siguiente pista?',
  'Es el lugar del pueblo donde siempre se ha ido a por agua fresca.',
  ARRAY['LA FUENTE', 'FUENTE']
);

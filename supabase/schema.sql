-- =====================================================================
-- Café de Especialidad El Salvador — esquema, RLS y datos de ejemplo
-- Ejecutar completo en: Supabase Dashboard → SQL Editor → New query
-- Es idempotente: se puede volver a ejecutar sin duplicar datos.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tablas
-- ---------------------------------------------------------------------
create table if not exists public.regiones (
  id            bigint generated always as identity primary key,
  slug          text not null unique,
  nombre        text not null,
  departamentos text not null,
  altitud_min   integer not null,
  altitud_max   integer not null,
  perfil        text not null,
  descripcion   text not null,
  color         text not null default '#7c4a2d',
  created_at    timestamptz not null default now(),
  constraint regiones_altitud_chk check (altitud_min < altitud_max)
);

create table if not exists public.cafes (
  id           bigint generated always as identity primary key,
  slug         text not null unique,
  nombre       text not null,
  finca        text not null,
  productor    text not null,
  region_id    bigint not null references public.regiones (id) on delete restrict,
  variedad     text not null,
  proceso      text not null,
  altitud_msnm integer not null,
  puntaje      numeric(4, 1) not null check (puntaje between 80 and 100),
  notas        text[] not null default '{}',
  descripcion  text not null,
  precio_usd   numeric(6, 2) not null check (precio_usd > 0),
  peso_g       integer not null default 340,
  destacado    boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists cafes_region_id_idx on public.cafes (region_id);

-- ---------------------------------------------------------------------
-- 2. Row Level Security
--    El sitio es público y de solo lectura: cualquiera puede leer
--    (anon / authenticated), nadie puede escribir con la clave pública.
--    Sin políticas de INSERT/UPDATE/DELETE, RLS las bloquea por defecto.
-- ---------------------------------------------------------------------
alter table public.regiones enable row level security;
alter table public.cafes    enable row level security;

drop policy if exists "Lectura pública de regiones" on public.regiones;
create policy "Lectura pública de regiones"
  on public.regiones for select
  to anon, authenticated
  using (true);

drop policy if exists "Lectura pública de cafés" on public.cafes;
create policy "Lectura pública de cafés"
  on public.cafes for select
  to anon, authenticated
  using (true);

-- Los proyectos nuevos con "RLS automático" traen la función
-- public.rls_auto_enable() (SECURITY DEFINER) expuesta en la API. Nadie
-- necesita llamarla por RPC, así que se le quita el permiso de ejecución.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 3. Datos de ejemplo
--    Las 6 regiones cafetaleras de El Salvador y 10 lotes ficticios.
-- ---------------------------------------------------------------------
insert into public.regiones (slug, nombre, departamentos, altitud_min, altitud_max, perfil, descripcion, color) values
  ('apaneca-ilamatepec', 'Apaneca-Ilamatepec', 'Santa Ana, Ahuachapán y Sonsonate', 500, 2300,
   'Dulzor de caramelo, cuerpo redondo y acidez cítrica brillante.',
   'La región cafetalera más grande del país. Se extiende sobre la cordillera de Apaneca y las faldas del volcán de Santa Ana (Ilamatepec), con suelos volcánicos jóvenes y una larga tradición de fincas familiares de Bourbon.',
   '#9a3412'),
  ('alotepec-metapan', 'Alotepec-Metapán', 'Chalatenango y Santa Ana', 1000, 2700,
   'Taza limpia y floral, acidez delicada y notas de frutos rojos.',
   'En el norte montañoso, cerca de la frontera con Guatemala y Honduras. Aquí está el punto más alto del país, el cerro El Pital, y los cafés crecen lentamente en microclimas fríos y nublados.',
   '#166534'),
  ('el-balsamo-quetzaltepec', 'El Bálsamo-Quetzaltepec', 'La Libertad y San Salvador', 500, 1950,
   'Chocolate con leche, nuez tostada y final dulce y prolongado.',
   'Entre la cordillera del Bálsamo y el volcán de San Salvador (Quetzaltepec). Su cercanía al Pacífico aporta brisas cálidas durante el día y noches frescas que concentran los azúcares del grano.',
   '#854d0e'),
  ('chichontepec', 'Chichontepec', 'San Vicente y La Paz', 500, 2180,
   'Panela, durazno y una acidez jugosa de manzana verde.',
   'Rodea el volcán de San Vicente (Chichontepec), de doble cráter. Es una región pequeña donde predominan productores de pequeña escala y cooperativas.',
   '#7c2d12'),
  ('tecapa-chinameca', 'Tecapa-Chinameca', 'Usulután y San Miguel', 500, 1600,
   'Cuerpo sedoso, notas de miel, cacao y especias suaves.',
   'En el oriente del país, sobre la sierra de Tecapa y el volcán de Chinameca. Sus suelos muy ricos en minerales y la laguna de Alegría marcan el carácter de la zona.',
   '#a16207'),
  ('cacahuatique', 'Cacahuatique', 'Morazán y San Miguel', 700, 1663,
   'Frutos secos, azúcar morena y acidez suave tipo mandarina.',
   'Alrededor del cerro Cacahuatique, en el nororiente. Es la región más pequeña y una de las de mayor crecimiento en cafés de especialidad, impulsada por productores jóvenes.',
   '#4d7c0f')
on conflict (slug) do nothing;

insert into public.cafes (slug, nombre, finca, productor, region_id, variedad, proceso, altitud_msnm, puntaje, notas, descripcion, precio_usd, peso_g, destacado)
select v.slug, v.nombre, v.finca, v.productor, r.id, v.variedad, v.proceso, v.altitud_msnm, v.puntaje, v.notas, v.descripcion, v.precio_usd, v.peso_g, v.destacado
from (values
  ('pacamara-lavado-la-cumbre', 'Pacamara Lavado', 'Finca La Cumbre', 'Familia Aguilar', 'apaneca-ilamatepec',
   'Pacamara', 'Lavado', 1650, 88.5, array['Mandarina', 'Jazmín', 'Caramelo'],
   'El Pacamara nació en El Salvador como cruce de Pacas y Maragogipe. Este lote lavado destaca por su grano grande y una taza compleja, floral y muy dulce.',
   18.50, 340, true),
  ('bourbon-rojo-el-mirador', 'Bourbon Rojo', 'Finca El Mirador', 'Cooperativa Los Naranjos', 'apaneca-ilamatepec',
   'Bourbon', 'Honey', 1450, 86.0, array['Panela', 'Ciruela', 'Cacao'],
   'Bourbon tradicional de cereza roja, procesado honey para conservar parte del mucílago. Taza equilibrada y dulce, ideal para métodos de filtrado.',
   15.00, 340, false),
  ('geisha-natural-el-pital', 'Geisha Natural', 'Finca Nubes del Pital', 'Ana Lucía Portillo', 'alotepec-metapan',
   'Geisha', 'Natural', 2050, 90.5, array['Bergamota', 'Fresa', 'Té negro'],
   'Cultivado a más de 2,000 msnm, secado en camas africanas durante 25 días. Un café expresivo, de perfil floral y afrutado, para ocasiones especiales.',
   32.00, 250, true),
  ('pacas-lavado-san-ignacio', 'Pacas Lavado', 'Finca San Ignacio', 'Hermanos Guardado', 'alotepec-metapan',
   'Pacas', 'Lavado', 1500, 85.5, array['Manzana roja', 'Almendra', 'Miel'],
   'El Pacas es una mutación natural del Bourbon descubierta en Santa Ana. Taza limpia, acidez media y un dulzor muy amable.',
   14.00, 340, false),
  ('bourbon-honey-quetzaltepec', 'Bourbon Honey', 'Finca Los Volcanes', 'Roberto Menjívar', 'el-balsamo-quetzaltepec',
   'Bourbon', 'Honey', 1300, 85.0, array['Chocolate con leche', 'Nuez', 'Caramelo'],
   'Café de cuerpo cremoso cultivado en las laderas del volcán de San Salvador. Perfecto para espresso y bebidas con leche.',
   13.50, 340, false),
  ('sl28-anaerobico-chichontepec', 'SL28 Anaeróbico', 'Finca El Rosario', 'Marta Elena Rivas', 'chichontepec',
   'SL28', 'Anaeróbico', 1550, 89.0, array['Durazno', 'Vino tinto', 'Cardamomo'],
   'Fermentación anaeróbica de 72 horas en tanques sellados. Una taza intensa y jugosa que muestra la innovación de los pequeños productores de San Vicente.',
   24.00, 250, true),
  ('caturra-lavado-chichontepec', 'Caturra Lavado', 'Finca Dos Cráteres', 'Cooperativa El Progreso', 'chichontepec',
   'Caturra', 'Lavado', 1250, 84.5, array['Manzana verde', 'Panela', 'Avellana'],
   'Un café de todos los días, brillante y limpio, producido por una cooperativa de 40 familias.',
   12.00, 340, false),
  ('pacamara-natural-alegria', 'Pacamara Natural', 'Finca Laguna de Alegría', 'Familia Hernández', 'tecapa-chinameca',
   'Pacamara', 'Natural', 1400, 87.5, array['Frutos rojos', 'Ron', 'Cacao'],
   'Pacamara secado en cereza junto a la laguna de Alegría. Cuerpo denso, dulzor de fruta madura y un final achocolatado.',
   21.00, 340, true),
  ('bourbon-lavado-chinameca', 'Bourbon Lavado', 'Finca La Esperanza', 'José Antonio Lazo', 'tecapa-chinameca',
   'Bourbon', 'Lavado', 1100, 84.0, array['Miel', 'Cacao', 'Canela'],
   'Bourbon clásico del oriente salvadoreño, de cuerpo sedoso y notas especiadas. Excelente en prensa francesa.',
   11.50, 340, false),
  ('pacas-honey-cacahuatique', 'Pacas Honey', 'Finca Cerro Verde', 'Daniel Argueta', 'cacahuatique',
   'Pacas', 'Honey', 1350, 86.5, array['Mandarina', 'Azúcar morena', 'Nuez'],
   'De un productor joven que transformó la finca familiar hacia el café de especialidad. Dulce, balanceado y con acidez cítrica suave.',
   16.00, 340, false)
) as v(slug, nombre, finca, productor, region_slug, variedad, proceso, altitud_msnm, puntaje, notas, descripcion, precio_usd, peso_g, destacado)
join public.regiones r on r.slug = v.region_slug
on conflict (slug) do nothing;

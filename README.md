# Origen Cuscatlán ☕ — Café de especialidad de El Salvador

Landing page y catálogo de cafés de especialidad salvadoreños, organizados por las **seis regiones cafetaleras** del país (Apaneca-Ilamatepec, Alotepec-Metapán, El Bálsamo-Quetzaltepec, Chichontepec, Tecapa-Chinameca y Cacahuatique).

Es un proyecto académico construido con **Next.js 16 (App Router)** y **Supabase**. Los datos se leen desde la base de datos en **Server Components**. Las fincas, productores y lotes son ficticios; las regiones y su geografía son reales.

## Funcionalidades

| Ruta | Tipo | Descripción |
| --- | --- | --- |
| `/` | Estática + streaming | Hero, cafés destacados y regiones (cada sección con `<Suspense>` y skeletons) |
| `/cafes` | Server Component | Catálogo completo ordenado por puntaje SCA |
| `/cafes/[slug]` | **Ruta dinámica** | Ficha del café: variedad, proceso, altitud, notas de cata y cafés relacionados |
| `/regiones` | Server Component | Las seis regiones con el conteo de cafés de cada una |
| `/regiones/[slug]` | **Ruta dinámica** | Detalle de la región, su perfil en taza y sus cafés |

**Buenas prácticas aplicadas**

- Lectura de datos solo en el servidor (`src/lib/data.ts`, marcado con `server-only`). Las credenciales nunca llegan al navegador.
- Estados de carga con `loading.tsx` en cada ruta y `<Suspense>` en la página de inicio.
- Manejo de errores con `error.tsx` (botón *Reintentar*) y `not-found.tsx` global y por cada ruta dinámica (slug inexistente → 404).
- `generateMetadata` dinámico para el SEO de cada café y región.
- `React.cache` para que la página y su metadata compartan una sola consulta por request.
- Diseño responsive con Tailwind CSS v4 (mobile first).

## Tecnologías

- [Next.js 16](https://nextjs.org) con App Router y Cache Components
- [React 19](https://react.dev)
- [Supabase](https://supabase.com) (PostgreSQL + Row Level Security) mediante `@supabase/supabase-js`
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript

## Estructura

```
├── supabase/
│   └── schema.sql          # Tablas, políticas RLS y datos de ejemplo
├── src/
│   ├── app/
│   │   ├── page.tsx        # Landing
│   │   ├── error.tsx       # Error boundary
│   │   ├── not-found.tsx
│   │   ├── cafes/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── [slug]/     # page, loading, not-found
│   │   └── regiones/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       └── [slug]/     # page, loading, not-found
│   ├── components/         # Header, Footer, tarjetas, skeletons…
│   └── lib/
│       ├── supabase.ts     # Cliente de Supabase (solo servidor)
│       ├── data.ts         # Consultas a la base de datos
│       ├── types.ts
│       └── format.ts
└── .env.example
```

## Base de datos

Dos tablas relacionadas (1 región → N cafés):

- **`regiones`**: `slug`, `nombre`, `departamentos`, `altitud_min`, `altitud_max`, `perfil`, `descripcion`, `color`
- **`cafes`**: `slug`, `nombre`, `finca`, `productor`, `region_id` (FK), `variedad`, `proceso`, `altitud_msnm`, `puntaje`, `notas` (`text[]`), `descripcion`, `precio_usd`, `peso_g`, `destacado`

**RLS:** las dos tablas tienen Row Level Security activado, con una única política `SELECT` para `anon` y `authenticated`. Como no hay políticas de `INSERT`, `UPDATE` ni `DELETE`, la clave pública solo permite leer.

Los datos de ejemplo son 6 regiones y 10 cafés.

## Instalación local

**Requisitos:** Node.js 20.9 o superior y una cuenta gratuita en Supabase.

1. **Instala las dependencias**

   ```bash
   npm install
   ```

2. **Crea la base de datos en Supabase**
   1. Crea un proyecto nuevo en [supabase.com/dashboard](https://supabase.com/dashboard).
   2. Ve a **SQL Editor → New query**, pega todo el contenido de [`supabase/schema.sql`](supabase/schema.sql) y presiona **Run**.
   3. En **Table Editor** comprueba que existan las tablas `regiones` (6 filas) y `cafes` (10 filas).

3. **Configura las variables de entorno**

   ```bash
   cp .env.example .env.local
   ```

   Completa `.env.local` con los valores de **Project Settings → API** (ver la tabla de abajo).

4. **Levanta el servidor de desarrollo**

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable | Descripción | Dónde obtenerla |
| --- | --- | --- |
| `SUPABASE_URL` | URL del proyecto de Supabase | Project Settings → API → *Project URL* |
| `SUPABASE_ANON_KEY` | Clave pública `anon` (o la nueva *publishable key*) | Project Settings → API Keys |

> Las variables **no** llevan el prefijo `NEXT_PUBLIC_` porque solo se usan en Server Components. `.env.local` está en `.gitignore`: nunca subas tus credenciales al repositorio. **No uses la `service_role` key**, porque ignora las políticas RLS.

## Despliegue en Vercel

1. Sube el repositorio a GitHub e impórtalo en [vercel.com/new](https://vercel.com/new).
2. En **Settings → Environment Variables** agrega `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
3. Despliega. Vercel detecta Next.js automáticamente.

## Scripts

| Comando | Acción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build de producción |
| `npm run lint` | ESLint |

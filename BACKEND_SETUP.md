# Backend & Supabase Setup — Quick Guide ✅

Follow these steps to create the Supabase database, run the backend, and connect it to the frontend.

## 1) Create a Supabase project

1. Go to https://app.supabase.com and create a new project.
2. Once created, open your project and go to `Settings → API` to copy the **Project URL** (SUPABASE_URL) and **Service Role Key** (SUPABASE_SERVICE_ROLE_KEY). Keep the service role key secret — use it only on the server.

## 2) Create the database table

1. In Supabase dashboard go to `SQL Editor` and run the SQL file located at `backend/sql/create_tables.sql` (or paste its contents from the repo). This will create the `complaints` table.

SQL creates `complaints` with columns:
- `id (uuid)` primary key
- `title`, `description`, `category`, `severity`, `status`
- `submitted_by`, `submitted_at`, `resolved_at`, `resolution`, `attachments (jsonb)`
- `support_count` (integer)

## 3) Configure the backend locally

1. Copy `.env.example` in `backend/` to a new file `backend/.env` and set values:

```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
PORT=3000
```

2. Install and run the backend:

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:3000`.

## 4) Connect the frontend

1. Create a `.env` (or `.env.local`) file in the frontend root and add:

```
VITE_API_URL=http://localhost:3000/api
```

2. Start the frontend dev server:

```bash
npm install
npm run dev
```

3. The frontend already uses `apiService` (in `src/services/api.ts`) and will call the new backend for complaints.

## 5) API Endpoints

- GET `/api/health`
- GET `/api/complaints`
- GET `/api/complaints/:id`
- POST `/api/complaints` — body: `{ title, description, category, severity?, submittedBy? }`
- PUT `/api/complaints/:id` — body: partial complaint fields (uses `supportCount` camelCase or DB fields)
- POST `/api/complaints/:id/support` — increments `support_count`

## Notes & Next Steps

- For authentication, consider using Supabase Auth and `profiles` table and adding Row Level Security.
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (server-only). For client-side calls, use the anon key and RLS policies.
- For production, deploy backend (e.g., render/railway/vercel) and set environment variables there.

If you want, I can:
- Add auth (register/login) using Supabase Auth
- Add tests and CI
- Add deployment configuration

Tell me which next step you'd like. 🔧
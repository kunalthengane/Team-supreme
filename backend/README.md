# Campus Voice Backend (Node.js + Supabase)

This backend provides simple CRUD for complaints and connects to a Supabase Postgres database.

## Quick Start

1. Copy `.env.example` to `.env` and set the values:
   - SUPABASE_URL (your supabase project url)
   - SUPABASE_SERVICE_ROLE_KEY (service role key from Supabase project - keep secret)
   - PORT (optional)

2. Install dependencies:

   npm install

3. Run the server locally:

   npm run dev

4. API endpoints:
   - GET /api/health
   - GET /api/complaints
   - GET /api/complaints/:id
   - POST /api/complaints
   - PUT /api/complaints/:id
   - POST /api/complaints/:id/support

## Supabase Setup (SQL)

Use the SQL in `sql/create_tables.sql` in Supabase SQL editor to create the `complaints` table.

Example SQL script (also in repo):

- `create extension if not exists pgcrypto;`
- Table creation for `complaints` with columns and defaults

## Security

- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret. Use it only server-side.
- Consider enabling Row Level Security and writing policies if you plan to use Supabase Auth for client-side operations.

> Note: Deployment configuration files (Docker and Render) were removed from this repository by request.

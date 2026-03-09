import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// If credentials are missing, provide a lightweight in-memory stub for local UI/dev testing.
function makeInMemoryStub() {
  console.warn('Supabase env vars missing — using in-memory stub (DEV ONLY)');

  const generateId = () => 'id_' + Math.random().toString(36).slice(2, 9);
  const clone = (v) => JSON.parse(JSON.stringify(v));

  const db = {
    complaints: [
      {
        id: generateId(),
        title: 'Example: Water cooler broken',
        description: 'The water cooler near the cafeteria has been broken for a week.',
        category: 'facilities',
        severity: 'low',
        status: 'open',
        submitted_by: 'Anonymous',
        submitted_at: new Date().toISOString(),
        resolved_at: null,
        resolution: null,
        attachments: null,
        support_count: 0,
      },
    ],
  };

  function applyFilters(rows, filters) {
    return rows.filter((r) => {
      return filters.every((f) => {
        return r[f.field] === f.value;
      });
    });
  }

  function tableHandler(table) {
    const state = { filters: [], order: null, updates: null };

    const chain = {
      select(selectArg) {
        // return an object with chainable methods
        return {
          eq(field, value) {
            state.filters.push({ field, value });
            return this;
          },
          order: async (field, { ascending = true } = {}) => {
            let rows = (db[table] || []).slice();
            if (state.filters.length) rows = applyFilters(rows, state.filters);
            rows.sort((a, b) => {
              const A = a[field];
              const B = b[field];
              if (A == null && B == null) return 0;
              if (A == null) return 1;
              if (B == null) return -1;
              if (A < B) return ascending ? -1 : 1;
              if (A > B) return ascending ? 1 : -1;
              return 0;
            });
            return { data: clone(rows), error: null };
          },
          maybeSingle: async () => {
            let rows = (db[table] || []).slice();
            if (state.filters.length) rows = applyFilters(rows, state.filters);
            return { data: clone(rows[0] ?? null), error: null };
          },
          single: async () => {
            let rows = (db[table] || []).slice();
            if (state.filters.length) rows = applyFilters(rows, state.filters);
            if (!rows[0]) return { data: null, error: new Error('No rows') };
            return { data: clone(rows[0]), error: null };
          },
        };
      },
      eq(field, value) {
        state.filters.push({ field, value });
        return this;
      },
      async maybeSingle() {
        let rows = (db[table] || []).slice();
        if (state.filters.length) rows = applyFilters(rows, state.filters);
        return { data: clone(rows[0] ?? null), error: null };
      },
      async order(field, { ascending = true } = {}) {
        let rows = (db[table] || []).slice();
        if (state.filters.length) rows = applyFilters(rows, state.filters);
        rows.sort((a, b) => {
          const A = a[field];
          const B = b[field];
          if (A == null && B == null) return 0;
          if (A == null) return 1;
          if (B == null) return -1;
          if (A < B) return ascending ? -1 : 1;
          if (A > B) return ascending ? 1 : -1;
          return 0;
        });
        return { data: clone(rows), error: null };
      },
      insert(rows) {
        // rows: array
        if (!Array.isArray(db[table])) db[table] = [];
        const toInsert = rows.map((r) => ({
          id: generateId(),
          support_count: 0,
          submitted_at: new Date().toISOString(),
          ...r,
        }));
        db[table].push(...toInsert);
        return {
          select() {
            return {
              single: async () => ({ data: clone(toInsert[0]), error: null }),
            };
          },
        };
      },
      update(updates) {
        state.updates = updates;
        return {
          eq: (field, value) => {
            state.filters.push({ field, value });
            return this;
          },
          select: () => ({
            maybeSingle: async () => {
              if (!Array.isArray(db[table])) db[table] = [];
              let rows = db[table];
              if (state.filters.length) rows = applyFilters(rows, state.filters);
              if (!rows[0]) return { data: null, error: null };
              // apply updates to first matched row
              Object.assign(rows[0], state.updates);
              return { data: clone(rows[0]), error: null };
            },
          }),
        };
      },
    };

    return chain;
  }

  return { from: (table) => tableHandler(table) };
}

const NODE_ENV = process.env.NODE_ENV || 'development';

let supabaseClient;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  if (NODE_ENV === 'production') {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment (production) - aborting');
    process.exit(1);
  } else {
    // Use in-memory stub only in non-production for local dev/testing
    supabaseClient = makeInMemoryStub();
  }
} else {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { "x-server": "campus-voice-backend" } },
  });
}

export const supabase = supabaseClient;
export default supabaseClient;

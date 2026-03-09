// scripts/dev-all.cjs
const { spawn } = require('child_process');

function start(name, cmd, args = [], opts = {}) {
  const p = spawn(cmd, args, { shell: true, stdio: ['ignore', 'pipe', 'pipe'], ...opts });
  p.stdout.on('data', (d) => process.stdout.write(`[${name}] ${d}`));
  p.stderr.on('data', (d) => process.stderr.write(`[${name} ERROR] ${d}`));
  p.on('exit', (code) => console.log(`[${name}] exited (${code})`));
  return p;
}

(async () => {
  console.log('Starting dev environment: Supabase (optional), backend, frontend');

  // Try start supabase local (if CLI installed). It's optional.
  let supabaseProc = null;
  try {
    supabaseProc = start('supabase', 'supabase', ['start']);
  } catch (e) {
    console.log('Supabase CLI not available; skipping local Supabase.');
  }

  // Start backend (runs `npm run dev` inside ./backend)
  const backendProc = start('backend', 'npm', ['run', 'dev'], { cwd: './backend' });

  // Start frontend (root `npm run dev`)
  const frontendProc = start('frontend', 'npm', ['run', 'dev']);

  // Cleanup on exit
  const procs = [supabaseProc, backendProc, frontendProc].filter(Boolean);
  function shutdown() {
    console.log('Shutting down child processes...');
    procs.forEach((p) => p && p.kill('SIGINT'));
    process.exit();
  }
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})();
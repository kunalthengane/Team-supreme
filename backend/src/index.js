import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import complaintsRouter from './routes/complaints.js';

dotenv.config();

const app = express();
// Allow configuring CORS origin via env var to restrict production access
const allowedOrigin = process.env.CORS_ORIGIN || '*';
console.log(`CORS origin set to: ${allowedOrigin}`);
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/complaints', complaintsRouter);

const desiredPort = parseInt(process.env.PORT, 10) || 3000;
const maxRetries = 5;

function startServer(port, attemptsLeft) {
  const server = http.createServer(app);

  server.listen(port);

  server.on('listening', () => {
    console.log(`Campus Voice Backend listening on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      console.warn(`Port ${port} in use — retrying on ${port + 1} (${attemptsLeft - 1} attempts left)`);
      setTimeout(() => startServer(port + 1, attemptsLeft - 1), 200);
      return;
    }
    console.error('Server failed to start:', err);
    process.exit(1);
  });
}

startServer(desiredPort, maxRetries);

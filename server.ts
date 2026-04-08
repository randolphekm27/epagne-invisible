import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import jwt from 'jsonwebtoken';

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Mock Login with JWT
  app.post('/api/auth/login', (req, res) => {
    const { phone, password } = req.body;
    // Mock verification
    if (phone === '22997000000' && password === 'password') {
      const token = jwt.sign({ id: '1', phone }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
      res.json({ token, user: { id: '1', name: 'Koffi', phone } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // Mock Mobile Money Webhook
  app.post('/api/webhooks/mobile-money', (req, res) => {
    const { transactionId, amount, type, status } = req.body;
    console.log(`Received webhook for transaction ${transactionId}`);
    
    // Emit event to connected clients
    io.emit('transaction_update', {
      transactionId,
      amount,
      type,
      status,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({ received: true });
  });

  // WebSocket connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

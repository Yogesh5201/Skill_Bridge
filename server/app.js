require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const pool = require('./db/pool');
const initDb = require('./db/initDb');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const messageRoutes = require('./routes/messageRoutes');
const skillRoutes = require('./routes/skillRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Socket.io
const io = new Server(server, {
  cors: { origin: FRONTEND_URL, methods: ['GET', 'POST'] }
});

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Expose socket.io instance to controllers via app
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/documents', documentRoutes);

// Health check
app.get('/', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', message: 'Skill Bridge API v2' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─────── Socket.io ────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[WS] ${socket.id} connected`);

  // Join personal room
  socket.on('join', (userId) => {
    socket.join(userId);
    socket.data.userId = userId;
    console.log(`[WS] ${userId} joined room`);
  });

  // ── Chat Messages ──
  socket.on('send_message', (data) => {
    // data: { senderId, receiverId, content, createdAt }
    io.to(data.receiverId).emit('receive_message', data);
  });

  // ── WebRTC Signaling ──────────────────────────────────────────────────────
  socket.on('webrtc:call-user', ({ to, from, fromName, offer }) => {
    io.to(to).emit('webrtc:incoming-call', { from, fromName, offer });
  });

  socket.on('webrtc:accept-call', ({ to, answer }) => {
    io.to(to).emit('webrtc:call-accepted', { answer });
  });

  socket.on('webrtc:reject-call', ({ to }) => {
    io.to(to).emit('webrtc:call-rejected');
  });

  socket.on('webrtc:ice-candidate', ({ to, candidate }) => {
    io.to(to).emit('webrtc:ice-candidate', { candidate });
  });

  socket.on('webrtc:end-call', ({ to }) => {
    io.to(to).emit('webrtc:call-ended');
  });

  // ── Notifications ──
  socket.on('send_notification', ({ userId, content, type }) => {
    io.to(userId).emit('receive_notification', { content, type });
  });

  socket.on('disconnect', () => {
    console.log(`[WS] ${socket.id} disconnected`);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  try {
    await pool.query('SELECT 1');
    console.log(`✅  Server running on port ${PORT}`);
    console.log(`✅  Database connected`);
    await initDb(); // Create tables & seed skills
  } catch (err) {
    console.error(`❌  Startup error:`, err.message);
  }
});

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const conversationRoutes = require('./routes/conversations');
const healthRoutes = require('./routes/health');
const subscriptionRoutes = require('./routes/subscriptions');

app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export io for use in routes
app.set('io', io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

module.exports = { app, io };

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Update CORS to allow the frontend hosted on Vercel
app.use(cors({
  origin: 'https://notification-web-opal.vercel.app', // Vercel URL of your frontend
  methods: ['GET', 'POST'],
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://notification-web-opal.vercel.app', // Same Vercel URL here
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendNotification', (data) => {
    io.emit('receiveNotification', data); // Send to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Use the port provided by Vercel or default to 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

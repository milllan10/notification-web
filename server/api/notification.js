import { Server } from 'socket.io';
import http from 'http';

export default function handler(req, res) {
  const server = http.createServer((req, res) => {});
  
  const io = new Server(server, {
    cors: {
      origin: 'https://notification-web-opal.vercel.app',  // Frontend URL
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('sendNotification', (data) => {
      io.emit('receiveNotification', data);  // Send to all connected clients
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Start WebSocket server
  server.listen(5000, () => {
    console.log('WebSocket server running');
  });

  res.status(200).send('WebSocket server is running');
}

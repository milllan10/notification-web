import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const App = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(
      process.env.NODE_ENV === 'production'
        ? 'https://notification-backend-web-yg1v111.vercel.app'  // Deployed backend URL
        : 'http://localhost:5000',  // Local backend URL for development
      {
        transports: ['polling', 'websocket'], // Fallback to polling if websocket fails
        reconnectionAttempts: 5, // Retry connection attempts
      }
    );

    // Event listeners for socket events
    socketInstance.on('connect', () => {
      console.log('Connected to socket server:', socketInstance.id);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketInstance.on('receiveNotification', (data) => {
      console.log('Notification received:', data);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Notification', {
          body: data.message,
          icon: 'https://via.placeholder.com/128', // Optional icon
        });
      }
    });

    // Set socket instance in state
    setSocket(socketInstance);

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const requestPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          alert('Notifications enabled!');
        } else {
          alert('Notifications disabled.');
        }
      });
    }
  };

  const sendNotification = () => {
    const message = prompt('Enter a notification message:');
    if (message && socket) {
      socket.emit('sendNotification', { message });
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={requestPermission}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Enable Notifications
      </button>
      <button
        onClick={sendNotification}
        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Send Notification
      </button>
    </div>
  );
};

export default App;

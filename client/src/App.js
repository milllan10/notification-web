import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

// Dynamically set the socket connection URL based on environment
const socket = io(
  process.env.NODE_ENV === 'production'
    ? 'https://notification-backend-web-yg1v111.vercel.app/'  // Replace with your deployed backend URL
    : 'http://localhost:5000'  // Use localhost in development
);

const App = () => {
  useEffect(() => {
    // Listen for notifications from the server
    socket.on('receiveNotification', (data) => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Notification', {
          body: data.message,
          icon: 'https://via.placeholder.com/128', // Optional icon
        });
      }
    });

    return () => socket.off('receiveNotification');
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
    if (message) {
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

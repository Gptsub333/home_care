// lib/socket.js
import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (token) => {
  if (socket) {
    return socket;
  }

  const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('/api', '') || 'http://localhost:5000';

  socket = io(SOCKET_URL, {
    auth: {
      token: token
    },
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"],
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('✅ WebSocket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ WebSocket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Event Emitters
export const joinRoom = (roomId) => {
  if (socket) {
    socket.emit('room:join', { roomId });
  }
};

export const leaveRoom = (roomId) => {
  if (socket) {
    socket.emit('room:leave', { roomId });
  }
};

export const sendMessage = (roomId, content, messageType = 'TEXT') => {
  if (socket) {
    socket.emit('message:send', {
      roomId,
      content,
      messageType
    });
  }
};

export const startTyping = (roomId) => {
  if (socket) {
    socket.emit('typing:start', { roomId });
  }
};

export const stopTyping = (roomId) => {
  if (socket) {
    socket.emit('typing:stop', { roomId });
  }
};

export const markAsRead = (roomId) => {
  if (socket) {
    socket.emit('message:mark-read', { roomId });
  }
};
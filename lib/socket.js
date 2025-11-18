// // lib/socket.js
// import { io } from 'socket.io-client';

// let socket = null;

// export const initializeSocket = (token) => {
//   if (socket) {
//     return socket;
//   }

//   const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('/api', '') || 'http://localhost:5000';

//   socket = io(SOCKET_URL, {
//     auth: {
//       token: token
//     },
//     autoConnect: true,
//     reconnection: true,
//     reconnectionDelay: 1000,
//     reconnectionAttempts: 5,
//     transports: ["websocket", "polling"],
//     withCredentials: true,
//   });

//   socket.on('connect', () => {
//     console.log('✅ WebSocket connected:', socket.id);
//   });

//   socket.on('disconnect', (reason) => {
//     console.log('❌ WebSocket disconnected:', reason);
//   });

//   socket.on('connect_error', (error) => {
//     console.error('Connection error:', error.message);
//   });

//   socket.on('error', (error) => {
//     console.error('Socket error:', error);
//   });

//   return socket;
// };

// export const getSocket = () => {
//   return socket;
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };

// // Event Emitters
// export const joinRoom = (roomId) => {
//   if (socket) {
//     socket.emit('room:join', { roomId });
//   }
// };

// export const leaveRoom = (roomId) => {
//   if (socket) {
//     socket.emit('room:leave', { roomId });
//   }
// };

// export const sendMessage = (roomId, content, messageType = 'TEXT') => {
//   if (socket) {
//     socket.emit('message:send', {
//       roomId,
//       content,
//       messageType
//     });
//   }
// };

// export const startTyping = (roomId) => {
//   if (socket) {
//     socket.emit('typing:start', { roomId });
//   }
// };

// export const stopTyping = (roomId) => {
//   if (socket) {
//     socket.emit('typing:stop', { roomId });
//   }
// };

// export const markAsRead = (roomId) => {
//   if (socket) {
//     socket.emit('message:mark-read', { roomId });
//   }
// };

// lib/socket.js
// lib/socket.js
import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (token) => {
  if (socket && socket.connected) {
    console.log('♻️ Socket already connected, reusing existing connection');
    return socket;
  }

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
  const SOCKET_URL = BACKEND_URL.replace('/api', '');

  console.log('🔌 Initializing socket connection to:', SOCKET_URL);

  socket = io(SOCKET_URL, {
    path: '/socket.io/',
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"],
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('✅ WebSocket connected:', socket.id);
    console.log('   Transport:', socket.io.engine.transport.name);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ WebSocket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error.message);
  });

  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
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

// ============================================
// MESSAGING EVENTS
// ============================================

export const joinRoom = (roomId) => {
  if (socket) {
    console.log('💬 Joining room:', roomId);
    socket.emit('room:join', { roomId });
  } else {
    console.error('❌ Socket not initialized');
  }
};

export const leaveRoom = (roomId) => {
  if (socket) {
    console.log('💬 Leaving room:', roomId);
    socket.emit('room:leave', { roomId });
  }
};

export const sendMessage = (roomId, content, messageType = 'TEXT') => {
  if (socket) {
    console.log('💬 Sending message to room:', roomId, '- Content:', content);
    socket.emit('message:send', {
      roomId,
      content,
      messageType
    });
  } else {
    console.error('❌ Socket not initialized, cannot send message');
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

// ============================================
// TRACKING EVENTS
// ============================================

export const joinTracking = (appointmentId) => {
  if (socket) {
    console.log('📍 Joining tracking for appointment:', appointmentId);
    socket.emit('tracking:join', { appointmentId });
  }
};

export const leaveTracking = (appointmentId) => {
  if (socket) {
    console.log('📍 Leaving tracking for appointment:', appointmentId);
    socket.emit('tracking:leave', { appointmentId });
  }
};
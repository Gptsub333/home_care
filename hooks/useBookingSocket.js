// hooks/useBookingSocket.js - FIXED VERSION
// Custom hook for booking socket connection

import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

// ✅ FIXED: Use correct backend URL without /api
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('/api', '') || 'https://home-care-backend.onrender.com';

console.log('Socket URL:', SOCKET_URL); // Debug

export function useBookingSocket() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, skipping socket connection');
      return;
    }

    console.log('Creating socket connection to:', SOCKET_URL);

    // ✅ FIXED: Create socket connection with correct configuration
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected successfully');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      console.log('Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, []);

  // Join user room
  const joinUserRoom = useCallback((userId) => {
    if (!socket || !connected) {
      console.log('Cannot join user room - socket not ready');
      return;
    }
    socket.emit('booking:join_user_room', userId);
    console.log(`Joined user room: ${userId}`);
  }, [socket, connected]);

  // Join provider room
  const joinProviderRoom = useCallback((providerId) => {
    if (!socket || !connected) {
      console.log('Cannot join provider room - socket not ready');
      return;
    }
    socket.emit('booking:join_provider_room', providerId);
    console.log(`Joined provider room: ${providerId}`);
  }, [socket, connected]);

  // Join tracking room for live location
  const joinTrackingRoom = useCallback((bookingId) => {
    if (!socket || !connected) {
      console.log('Cannot join tracking room - socket not ready');
      return;
    }
    socket.emit('booking:join_tracking_room', bookingId);
    console.log(`Joined tracking room: ${bookingId}`);
  }, [socket, connected]);

  // Leave tracking room
  const leaveTrackingRoom = useCallback((bookingId) => {
    if (!socket || !connected) return;
    socket.emit('booking:leave_tracking_room', bookingId);
    console.log(`Left tracking room: ${bookingId}`);
  }, [socket, connected]);

  // Subscribe to booking events
  const onBookingEvent = useCallback((event, callback) => {
    if (!socket) return;
    socket.on(event, callback);
    return () => socket.off(event, callback);
  }, [socket]);

  // Add notification to list
  const addNotification = useCallback((notification) => {
    setNotifications(prev => [...prev, notification]);
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    socket,
    connected,
    notifications,
    joinUserRoom,
    joinProviderRoom,
    joinTrackingRoom,
    leaveTrackingRoom,
    onBookingEvent,
    addNotification,
    clearNotifications
  };
}

// Separate hook for user-specific booking events
export function useUserBookingEvents(userId) {
  const { socket, connected, joinUserRoom, onBookingEvent, addNotification } = useBookingSocket();

  useEffect(() => {
    if (!connected || !userId) {
      console.log('User booking events - not ready:', { connected, userId });
      return;
    }
    
    console.log('Setting up user booking events for:', userId);
    
    // Join user's booking room
    joinUserRoom(userId);

    // Listen for booking events
    const cleanupFns = [];

    // New booking request accepted
    cleanupFns.push(onBookingEvent('booking:accepted', (data) => {
      console.log('Booking accepted:', data);
      addNotification({
        type: 'success',
        title: 'Booking Accepted',
        message: data.message || 'Your booking has been accepted'
      });
    }));

    // Booking declined
    cleanupFns.push(onBookingEvent('booking:declined', (data) => {
      console.log('Booking declined:', data);
      addNotification({
        type: 'error',
        title: 'Booking Declined',
        message: data.message || 'Your booking was declined'
      });
    }));

    // Provider is on the way
    cleanupFns.push(onBookingEvent('booking:provider_on_the_way', (data) => {
      console.log('Provider on the way:', data);
      addNotification({
        type: 'info',
        title: 'Provider On The Way',
        message: data.message || 'Your provider is on the way!'
      });
    }));

    // Provider location update
    cleanupFns.push(onBookingEvent('booking:location_update', (data) => {
      console.log('Location update:', data);
      // This is for real-time tracking - handle in tracking component
    }));

    // Provider arrived
    cleanupFns.push(onBookingEvent('booking:provider_arrived', (data) => {
      console.log('Provider arrived:', data);
      addNotification({
        type: 'success',
        title: 'Provider Arrived',
        message: data.message || 'Your provider has arrived!'
      });
    }));

    // Service started
    cleanupFns.push(onBookingEvent('booking:service_started', (data) => {
      console.log('Service started:', data);
    }));

    // Service completed
    cleanupFns.push(onBookingEvent('booking:service_completed', (data) => {
      console.log('Service completed:', data);
      addNotification({
        type: 'success',
        title: 'Service Completed',
        message: data.message || 'Service completed! Please rate your experience.'
      });
    }));

    return () => {
      cleanupFns.forEach(cleanup => cleanup && cleanup());
    };
  }, [connected, userId]);

  return { socket, connected };
}

// Separate hook for provider-specific booking events
export function useProviderBookingEvents(providerId) {
  const { socket, connected, joinProviderRoom, onBookingEvent, addNotification } = useBookingSocket();

  useEffect(() => {
    if (!connected || !providerId) {
      console.log('Provider booking events - not ready:', { connected, providerId });
      return;
    }
    
    console.log('Setting up provider booking events for:', providerId);
    
    // Join provider's booking room
    joinProviderRoom(providerId);

    // Listen for provider events
    const cleanupFns = [];

    // New booking request
    cleanupFns.push(onBookingEvent('booking:new_request', (data) => {
      console.log('New booking request:', data);
      addNotification({
        type: 'info',
        title: 'New Booking Request',
        message: `New booking from ${data.user?.name || 'a user'}`
      });
    }));

    // Booking cancelled by user
    cleanupFns.push(onBookingEvent('booking:cancelled', (data) => {
      console.log('Booking cancelled:', data);
      addNotification({
        type: 'warning',
        title: 'Booking Cancelled',
        message: data.message || 'A booking was cancelled'
      });
    }));

    // New rating received
    cleanupFns.push(onBookingEvent('booking:new_rating', (data) => {
      console.log('New rating:', data);
      addNotification({
        type: 'success',
        title: 'New Rating',
        message: `You received a ${data.rating}-star rating!`
      });
    }));

    return () => {
      cleanupFns.forEach(cleanup => cleanup && cleanup());
    };
  }, [connected, providerId]);

  return { socket, connected };
}

export default useBookingSocket;
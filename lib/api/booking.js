// lib/api/booking.js
// API utility functions for booking operations

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://home-care-backend.onrender.com/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// ============ USER BOOKING APIs ============

/**
 * Create a new booking
 */
export const createBooking = async (bookingData) => {
  const response = await fetch(`${API_URL}/bookings/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to create booking');
  return data;
};

/**
 * Get user's bookings
 * @param {string} status - Optional filter by status (PENDING, CONFIRMED, etc.)
 */
export const getUserBookings = async (status = null) => {
  const url = status 
    ? `${API_URL}/bookings/user/bookings?status=${status}`
    : `${API_URL}/bookings/user/bookings`;

  const response = await fetch(url, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch bookings');
  return data;
};

/**
 * Get specific booking details
 */
export const getBookingDetails = async (bookingId) => {
  const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch booking details');
  return data;
};

/**
 * Get live tracking for a booking
 */
export const getLiveTracking = async (bookingId) => {
  const response = await fetch(`${API_URL}/bookings/${bookingId}/tracking`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch tracking');
  return data;
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId, reason) => {
  const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to cancel booking');
  return data;
};

/**
 * Rate a completed booking
 */
export const rateBooking = async (bookingId, ratingData) => {
  const response = await fetch(`${API_URL}/bookings/${bookingId}/rate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(ratingData)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to submit rating');
  return data;
};

// ============ PROVIDER BOOKING APIs ============

/**
 * Get provider's bookings
 * @param {string} status - Optional filter by status
 * @param {string} date - Optional filter by date (YYYY-MM-DD)
 */
export const getProviderBookings = async (status = null, date = null) => {
  let url = `${API_URL}/bookings/provider/bookings`;
  const params = new URLSearchParams();
  
  if (status) params.append('status', status);
  if (date) params.append('date', date);
  
  if (params.toString()) url += `?${params.toString()}`;

  const response = await fetch(url, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch provider bookings');
  return data;
};

/**
 * Accept a booking request
 */
export const acceptBooking = async (bookingId) => {
  const response = await fetch(`${API_URL}/bookings/${bookingId}/accept`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to accept booking');
  return data;
};

/**
 * Decline a booking request
 */
export const declineBooking = async (bookingId, reason) => {
  const response = await fetch(`${API_URL}/bookings/${bookingId}/decline`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to decline booking');
  return data;
};

/**
 * Start trip to user location
 */
export const startTrip = async (bookingId, latitude, longitude) => {
  const response = await fetch(`${API_URL}/bookings/${bookingId}/start-trip`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ latitude, longitude })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to start trip');
  return data;
};

/**
 * Update provider location during trip
 */
export const updateProviderLocation = async (bookingId, latitude, longitude) => {
  const response = await fetch(`${API_URL}/bookings/${bookingId}/update-location`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ latitude, longitude })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update location');
  return data;
};

/**
 * Mark as arrived at user location
 */
export const markArrived = async (bookingId) => {
  const response = await fetch(`${API_URL}/bookings/${bookingId}/arrived`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to mark as arrived');
  return data;
};

/**
 * Start service (optional)
 */
export const startService = async (bookingId) => {
  const response = await fetch(`${API_URL}/bookings/${bookingId}/start-service`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to start service');
  return data;
};

/**
 * Complete a booking
 */
export const completeBooking = async (bookingId, finalPrice) => {
  const response = await fetch(`${API_URL}/bookings/${bookingId}/complete`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ finalPrice })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to complete booking');
  return data;
};

export default {
  // User functions
  createBooking,
  getUserBookings,
  getBookingDetails,
  getLiveTracking,
  cancelBooking,
  rateBooking,
  
  // Provider functions
  getProviderBookings,
  acceptBooking,
  declineBooking,
  startTrip,
  updateProviderLocation,
  markArrived,
  startService,
  completeBooking
};
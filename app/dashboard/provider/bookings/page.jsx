"use client";

import ProviderBookings from '@/components/ProviderBookings';

export default function ProviderBookingsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>
      <ProviderBookings />
    </div>
  );
}
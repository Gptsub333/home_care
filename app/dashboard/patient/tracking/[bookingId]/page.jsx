"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getBookingDetails } from '@/lib/api/booking';
// import LiveTrackingMap from '@/components/LiveTrackingMap';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import with SSR disabled
const LiveTrackingMap = dynamic(
  () => import('@/components/LiveTrackingMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px] bg-gray-100 rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    )
  }
);

export default function TrackingPage() {
  const params = useParams();
  const bookingId = params.bookingId;
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingDetails(bookingId);
        setBooking(data.booking);
      } catch (error) {
        console.error('Fetch booking error:', error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!booking) {
    return <div className="p-6 text-center">Booking not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Link href="/dashboard/patient/bookings">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>
      </Link>

      <h1 className="text-3xl font-bold">Track Your Provider</h1>

      <LiveTrackingMap
        bookingId={bookingId}
        userLocation={{
          latitude: booking.latitude,
          longitude: booking.longitude
        }}
      />
    </div>
  );
}
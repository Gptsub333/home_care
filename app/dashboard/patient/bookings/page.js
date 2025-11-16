"use client";

import { useEffect, useState } from 'react';
import { getUserBookings, cancelBooking } from '@/lib/api/booking';
import { useUserBookingEvents } from '@/hooks/useBookingSocket';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Get user from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // Setup real-time connection
  useUserBookingEvents(user?.id);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getUserBookings();
        setBookings(data.bookings);
      } catch (error) {
        console.error('Fetch bookings error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBookings();
  }, [user]);

  const handleCancel = async (bookingId) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    try {
      await cancelBooking(bookingId, reason);
      alert('Booking cancelled successfully');
      const data = await getUserBookings();
      setBookings(data.bookings);
    } catch (error) {
      alert(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'ON_THE_WAY': return 'bg-blue-100 text-blue-700';
      case 'ARRIVED': return 'bg-purple-100 text-purple-700';
      case 'COMPLETED': return 'bg-gray-100 text-gray-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6 text-center">Loading bookings...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Bookings</h1>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No bookings yet</p>
            <Link href="/search">
              <Button>Find a Provider</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={booking.provider?.user?.profileImage || '/default-provider.png'}
                      alt={booking.provider?.user?.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {booking.provider?.user?.name}
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        {booking.serviceType}
                      </p>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(booking.scheduledDate), 'MMMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {booking.scheduledTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {booking.address}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-3">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                    
                    <div className="space-y-2">
                      {booking.status === 'ON_THE_WAY' && (
                        <Link href={`/dashboard/patient/tracking/${booking.id}`}>
                          <Button size="sm" className="w-full">
                            <Navigation className="h-4 w-4 mr-2" />
                            Track Provider
                          </Button>
                        </Link>
                      )}
                      
                      {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleCancel(booking.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
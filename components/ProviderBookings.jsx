// components/ProviderBookings.jsx - FIXED VERSION
"use client";

import { useEffect, useState } from 'react';
import { getProviderBookings, acceptBooking, declineBooking } from '@/lib/api/booking';
import { useProviderBookingEvents } from '@/hooks/useBookingSocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, User, Phone, Navigation2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providerId, setProviderId] = useState(null); // ✅ Changed from provider to providerId
  const [declineDialog, setDeclineDialog] = useState({ open: false, booking: null });
  const [declineReason, setDeclineReason] = useState('');

  // ✅ FIXED: Get provider ID correctly
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      // Extract providerId correctly based on your data structure
      const extractedProviderId = user.provider?.id || user.provider?.providerId || user.providerId;
      
      console.log('Full user object:', user);
      console.log('Extracted provider ID:', extractedProviderId);
      
      setProviderId(extractedProviderId);
    }
  }, []);

  // Setup socket connection for real-time updates
  useProviderBookingEvents(providerId);

  // Fetch bookings
  const fetchBookings = async (status = null) => {
    if (!providerId) {
      console.log('No provider ID yet, skipping fetch');
      return;
    }

    try {
      setLoading(true);
      const data = await getProviderBookings(status);
      setBookings(data.bookings);
    } catch (error) {
      console.error('Fetch bookings error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (providerId) {
      console.log('Provider ID is ready, fetching bookings:', providerId);
      fetchBookings();
    }
  }, [providerId]);

  // Accept booking
  const handleAccept = async (bookingId) => {
    try {
      await acceptBooking(bookingId);
      alert('Booking accepted successfully');
      fetchBookings();
    } catch (error) {
      alert(error.message);
    }
  };

  // Decline booking
  const handleDecline = async () => {
    if (!declineReason.trim()) {
      alert('Please provide a reason');
      return;
    }

    try {
      await declineBooking(declineDialog.booking.id, declineReason);
      alert('Booking declined');
      setDeclineDialog({ open: false, booking: null });
      setDeclineReason('');
      fetchBookings();
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

  // Filter bookings by tab
  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const activeBookings = bookings.filter(b => ['CONFIRMED', 'ON_THE_WAY', 'ARRIVED'].includes(b.status));
  const completedBookings = bookings.filter(b => ['COMPLETED', 'CANCELLED'].includes(b.status));

  // Show loading if no provider ID yet
  if (!providerId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading provider information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="pending">
            Pending ({pendingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedBookings.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Bookings */}
        <TabsContent value="pending" className="space-y-4 mt-6">
          {loading ? (
            <p className="text-center py-8">Loading bookings...</p>
          ) : pendingBookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No pending bookings</p>
              </CardContent>
            </Card>
          ) : (
            pendingBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    {/* User Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {booking.user?.name}
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
                          {booking.user?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {booking.user.phone}
                            </div>
                          )}
                        </div>

                        {booking.description && (
                          <p className="mt-3 text-sm p-3 bg-gray-50 rounded">
                            {booking.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleAccept(booking.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setDeclineDialog({ open: true, booking })}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Active Bookings */}
        <TabsContent value="active" className="space-y-4 mt-6">
          {activeBookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No active bookings</p>
              </CardContent>
            </Card>
          ) : (
            activeBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    {/* User Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">
                            {booking.user?.name}
                          </h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
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

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {booking.status === 'CONFIRMED' && (
                        <Link href={`/dashboard/provider/navigate/${booking.id}`}>
                          <Button className="w-full">
                            <Navigation2 className="h-4 w-4 mr-2" />
                            Start Trip
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = `tel:${booking.user?.phone}`}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call User
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Completed Bookings */}
        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedBookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No completed bookings</p>
              </CardContent>
            </Card>
          ) : (
            completedBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {booking.user?.name}
                        </h3>
                        <p className="text-muted-foreground mb-2">
                          {booking.serviceType}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(booking.scheduledDate), 'MMMM dd, yyyy')}
                        </p>
                        {booking.finalPrice && (
                          <p className="text-sm font-semibold text-green-600 mt-2">
                            Earned: ${booking.finalPrice}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Decline Dialog */}
      <Dialog open={declineDialog.open} onOpenChange={(open) => setDeclineDialog({ open, booking: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please provide a reason for declining this booking:
            </p>
            <Textarea
              placeholder="e.g., Not available at that time"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeclineDialog({ open: false, booking: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDecline}
            >
              Decline Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
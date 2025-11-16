// app/provider/navigate/[bookingId]/page.jsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBookingDetails, startTrip, updateProviderLocation, markArrived, completeBooking } from '@/lib/api/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { MapPin, Navigation, Phone, CheckCircle, DollarSign, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProviderNavigationPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [completeDialog, setCompleteDialog] = useState(false);
  const [finalPrice, setFinalPrice] = useState('');

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingDetails(bookingId);
        setBooking(data.booking);
        setFinalPrice(data.booking.estimatedPrice || '');
      } catch (error) {
        console.error('Fetch booking error:', error);
        alert(error.message);
        router.push('/dashboard/provider');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  // Start trip and begin location tracking
  const handleStartTrip = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    try {
      // Get current location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });

          try {
            // Call API to start trip
            await startTrip(bookingId, latitude, longitude);
            alert('Trip started! Location sharing is now active.');
            setTracking(true);

            // Start watching location
            const id = navigator.geolocation.watchPosition(
              handleLocationUpdate,
              handleLocationError,
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              }
            );
            setWatchId(id);

            // Refresh booking data
            const data = await getBookingDetails(bookingId);
            setBooking(data.booking);
          } catch (error) {
            alert(error.message);
          }
        },
        (error) => {
          console.error('Get location error:', error);
          alert('Failed to get your location. Please enable location services.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000
        }
      );
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle location updates during trip
  const handleLocationUpdate = async (position) => {
    const { latitude, longitude } = position.coords;
    setCurrentLocation({ latitude, longitude });

    try {
      await updateProviderLocation(bookingId, latitude, longitude);
      console.log('Location updated:', latitude, longitude);
    } catch (error) {
      console.error('Location update error:', error);
    }
  };

  // Handle location errors
  const handleLocationError = (error) => {
    console.error('Location error:', error);
  };

  // Stop tracking
  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTracking(false);
  };

  // Mark as arrived
  const handleMarkArrived = async () => {
    try {
      await markArrived(bookingId);
      alert('Marked as arrived!');
      stopTracking();
      
      // Refresh booking data
      const data = await getBookingDetails(bookingId);
      setBooking(data.booking);
    } catch (error) {
      alert(error.message);
    }
  };

  // Complete booking
  const handleComplete = async () => {
    if (!finalPrice) {
      alert('Please enter the final price');
      return;
    }

    try {
      await completeBooking(bookingId, parseFloat(finalPrice));
      alert('Booking completed successfully!');
      setCompleteDialog(false);
      router.push('/dashboard/provider');
    } catch (error) {
      alert(error.message);
    }
  };

  // Open navigation app
  const openNavigation = () => {
    if (!booking) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.latitude},${booking.longitude}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!booking) {
    return <div className="p-6 text-center">Booking not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/provider">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <Badge className={
          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
          booking.status === 'ON_THE_WAY' ? 'bg-blue-100 text-blue-700' :
          booking.status === 'ARRIVED' ? 'bg-purple-100 text-purple-700' :
          'bg-gray-100 text-gray-700'
        }>
          {booking.status}
        </Badge>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-teal-600">
                {booking.user?.name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{booking.user?.name}</h3>
              <p className="text-muted-foreground">{booking.serviceType}</p>
            </div>
            {booking.user?.phone && (
              <Button
                variant="outline"
                onClick={() => window.location.href = `tel:${booking.user.phone}`}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            )}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Destination</p>
                <p className="text-sm text-muted-foreground">{booking.address}</p>
                {booking.locationNotes && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Note: {booking.locationNotes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {booking.description && (
            <div className="border-t pt-4">
              <p className="font-medium mb-2">Service Description</p>
              <p className="text-sm text-muted-foreground">{booking.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location Tracking Status */}
      {tracking && currentLocation && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="font-medium text-blue-900">Location Sharing Active</span>
              </div>
              <Badge className="bg-blue-100 text-blue-700">
                Live
              </Badge>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              Your location is being shared with the user
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className="p-6 space-y-3">
          {/* Start Trip */}
          {booking.status === 'CONFIRMED' && (
            <Button
              className="w-full h-12 bg-gradient-to-r from-teal-500 to-blue-500"
              onClick={handleStartTrip}
              disabled={tracking}
            >
              <Navigation className="h-5 w-5 mr-2" />
              Start Trip & Share Location
            </Button>
          )}

          {/* Open Navigation */}
          {['CONFIRMED', 'ON_THE_WAY'].includes(booking.status) && (
            <Button
              variant="outline"
              className="w-full h-12"
              onClick={openNavigation}
            >
              <MapPin className="h-5 w-5 mr-2" />
              Open in Maps
            </Button>
          )}

          {/* Mark Arrived */}
          {booking.status === 'ON_THE_WAY' && (
            <Button
              className="w-full h-12 bg-purple-600 hover:bg-purple-700"
              onClick={handleMarkArrived}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Mark as Arrived
            </Button>
          )}

          {/* Complete Booking */}
          {booking.status === 'ARRIVED' && (
            <Button
              className="w-full h-12 bg-green-600 hover:bg-green-700"
              onClick={() => setCompleteDialog(true)}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Complete Service
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-teal-50 border-teal-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-teal-900 mb-2">Instructions</h4>
          <ul className="text-sm text-teal-700 space-y-1">
            {booking.status === 'CONFIRMED' && (
              <li>• Tap "Start Trip" when you're ready to head to the user's location</li>
            )}
            {booking.status === 'ON_THE_WAY' && (
              <>
                <li>• Your location is being shared with the user in real-time</li>
                <li>• Tap "Mark as Arrived" when you reach the location</li>
              </>
            )}
            {booking.status === 'ARRIVED' && (
              <li>• Complete the service and tap "Complete Service" when done</li>
            )}
            <li>• You can call the user anytime if needed</li>
          </ul>
        </CardContent>
      </Card>

      {/* Complete Booking Dialog */}
      <Dialog open={completeDialog} onOpenChange={setCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Final Price ($)
              </label>
              <Input
                type="number"
                placeholder="Enter final price"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Estimated: ${booking.estimatedPrice || 0}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleComplete}>
              <DollarSign className="h-4 w-4 mr-2" />
              Complete & Charge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
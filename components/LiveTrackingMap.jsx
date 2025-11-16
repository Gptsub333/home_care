// components/LiveTrackingMap.jsx
"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock, Phone } from 'lucide-react';
import { useBookingSocket } from '@/hooks/useBookingSocket';
import { getLiveTracking } from '@/lib/api/booking';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


// Fix Leaflet icon issue in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});



export default function LiveTrackingMap({ bookingId, userLocation }) {
  const { socket, connected, joinTrackingRoom, leaveTrackingRoom, onBookingEvent } = useBookingSocket();
  
  const [trackingData, setTrackingData] = useState(null);
  const [providerLocation, setProviderLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial tracking data
  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        const data = await getLiveTracking(bookingId);
        
        if (data.trackingAvailable) {
          setTrackingData(data);
          setProviderLocation({
            lat: parseFloat(data.tracking.currentLatitude),
            lng: parseFloat(data.tracking.currentLongitude)
          });

          // Parse location history
          if (data.tracking.locationHistory) {
            const history = JSON.parse(data.tracking.locationHistory);
            setLocationHistory(history.map(h => ({
              lat: parseFloat(h.lat),
              lng: parseFloat(h.lng)
            })));
          }
        } else {
          setError(data.message || 'Tracking not available yet');
        }
      } catch (err) {
        console.error('Fetch tracking error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, [bookingId]);

  // Join tracking room and listen for updates
  useEffect(() => {
    if (!connected || !bookingId) return;

    joinTrackingRoom(bookingId);

    // Listen for real-time location updates
    const cleanup = onBookingEvent('booking:location_update', (data) => {
      console.log('Real-time location update:', data);
      
      const newLocation = {
        lat: parseFloat(data.currentLocation.latitude),
        lng: parseFloat(data.currentLocation.longitude)
      };

      setProviderLocation(newLocation);
      
      // Add to location history
      setLocationHistory(prev => [...prev, newLocation].slice(-50)); // Keep last 50 points

      // Update tracking data
      setTrackingData(prev => ({
        ...prev,
        tracking: {
          ...prev?.tracking,
          currentLatitude: data.currentLocation.latitude,
          currentLongitude: data.currentLocation.longitude,
          distanceToUser: data.distanceToUser,
          estimatedArrival: data.estimatedArrival
        }
      }));
    });

    return () => {
      cleanup && cleanup();
      leaveTrackingRoom(bookingId);
    };
  }, [connected, bookingId]);

  // Calculate map center
  const getMapCenter = () => {
    if (providerLocation) {
      return [providerLocation.lat, providerLocation.lng];
    }
    if (userLocation) {
      return [parseFloat(userLocation.latitude), parseFloat(userLocation.longitude)];
    }
    return [23.0225, 72.5714]; // Default center
  };

  // Format ETA
  const formatETA = (etaString) => {
    if (!etaString) return 'Calculating...';
    const eta = new Date(etaString);
    const now = new Date();
    const diffMs = eta - now;
    const diffMins = Math.ceil(diffMs / 60000);
    
    if (diffMins < 1) return 'Arriving now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''}`;
    
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours} hr${hours > 1 ? 's' : ''} ${mins} min`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tracking data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tracking Not Available</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tracking Info Card */}
      <Card className="border-teal-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-teal-600" />
            Live Tracking
            <Badge className="ml-auto bg-green-500/10 text-green-700">
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Provider Info */}
          <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                <img
                  src={trackingData?.provider?.profileImage || '/default-provider.png'}
                  alt={trackingData?.provider?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">{trackingData?.provider?.name}</h4>
                <p className="text-sm text-muted-foreground">On the way</p>
              </div>
            </div>
            {trackingData?.provider?.phone && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = `tel:${trackingData.provider.phone}`}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            )}
          </div>

          {/* Distance & ETA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-teal-100 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Distance</span>
              </div>
              <p className="text-2xl font-bold text-teal-600">
                {parseFloat(trackingData?.tracking?.distanceToUser || 0).toFixed(2)} km
              </p>
            </div>
            <div className="p-4 border border-teal-100 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">ETA</span>
              </div>
              <p className="text-2xl font-bold text-teal-600">
                {formatETA(trackingData?.tracking?.estimatedArrival)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card className="overflow-hidden">
        <div className="h-[400px] relative">
          <MapContainer
            center={getMapCenter()}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* User Location Marker */}
            {userLocation && (
              <Marker
                position={[
                  parseFloat(userLocation.latitude),
                  parseFloat(userLocation.longitude)
                ]}
              >
                <Popup>
                  <div className="text-center">
                    <p className="font-semibold">Your Location</p>
                    <p className="text-sm text-muted-foreground">
                      {trackingData?.booking?.address}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Provider Location Marker */}
            {providerLocation && (
              <Marker
                position={[providerLocation.lat, providerLocation.lng]}
                icon={L.icon({
                  iconUrl: '/provider-marker.png',
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                  popupAnchor: [0, -32]
                })}
              >
                <Popup>
                  <div className="text-center">
                    <p className="font-semibold">{trackingData?.provider?.name}</p>
                    <p className="text-sm text-muted-foreground">Provider Location</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Route Polyline */}
            {locationHistory.length > 1 && (
              <Polyline
                positions={locationHistory.map(loc => [loc.lat, loc.lng])}
                color="#14b8a6"
                weight={3}
                opacity={0.7}
              />
            )}
          </MapContainer>

          {/* Connection Status */}
          <div className="absolute top-4 right-4 z-[1000]">
            <Badge
              className={
                connected
                  ? 'bg-green-500/90 text-white'
                  : 'bg-red-500/90 text-white'
              }
            >
              {connected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
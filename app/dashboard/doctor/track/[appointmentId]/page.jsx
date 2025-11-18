"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Car, MapPin, ArrowLeft, CheckCircle, Navigation } from "lucide-react";

export default function ProviderTrackingPage() {
  const { appointmentId } = useParams();
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://home-care-backend.onrender.com/api";

  // Fetch appointment details
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${BACKEND_URL}/appointments/provider/appointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        const apt = data.appointments?.find((a) => a.id === appointmentId);
        setAppointment(apt);

        // Check if tracking is already active
        if (apt?.status === "ON_THE_WAY" || apt?.status === "ARRIVED") {
          setIsTracking(true);
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
        setError("Failed to load appointment");
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  // Get current location
  useEffect(() => {
    if (!isTracking) return;

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          heading: position.coords.heading,
        });
        setError(null);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError(`Location error: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isTracking]);

  // Send location updates every 5 seconds
  useEffect(() => {
    if (!location || !isTracking) return;

    const updateLocation = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BACKEND_URL}/location/update/${appointmentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              latitude: location.latitude,
              longitude: location.longitude,
              accuracy: location.accuracy,
              speed: location.speed,
              heading: location.heading,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Location update failed:", errorData);
          
          // If tracking not found, try to restart it
          if (errorData.error === "No active tracking found") {
            console.log("Attempting to restart tracking...");
            await restartTracking();
          }
        } else {
          console.log("✅ Location updated successfully");
        }
      } catch (error) {
        console.error("Error updating location:", error);
      }
    };

    // Update immediately
    updateLocation();

    // Then update every 5 seconds
    const interval = setInterval(updateLocation, 5000);

    return () => clearInterval(interval);
  }, [location, isTracking, appointmentId]);

  const restartTracking = async () => {
    if (!location) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/location/start/${appointmentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        }
      );

      if (response.ok) {
        console.log("✅ Tracking restarted successfully");
        setIsTracking(true);
      }
    } catch (error) {
      console.error("Error restarting tracking:", error);
    }
  };

  const handleMarkArrived = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BACKEND_URL}/location/arrived/${appointmentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        alert("Marked as arrived!");
        router.push("/dashboard/doctor/appointments");
      }
    } catch (error) {
      console.error("Error marking arrived:", error);
      alert("Failed to mark as arrived");
    }
  };

  const openInGoogleMaps = () => {
    if (!appointment?.serviceLat || !appointment?.serviceLng) {
      alert("Destination coordinates not available");
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${appointment.serviceLat},${appointment.serviceLng}`;
    window.open(url, "_blank");
  };

  if (!appointment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Trip Status Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Trip in Progress</h1>
                <p className="text-gray-600">
                  Heading to {appointment.user?.name}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Tracking Status:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isTracking
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {isTracking ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Location Info */}
              <div className="flex items-start gap-2 pt-3 border-t">
                <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Destination</p>
                  <p className="text-sm text-gray-600">
                    {appointment.serviceAddress}
                  </p>
                </div>
              </div>

              {location && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    Your current location:
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    Lat: {location.latitude.toFixed(6)}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    Lng: {location.longitude.toFixed(6)}
                  </p>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Location updating every 5 seconds
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={openInGoogleMaps}
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
            >
              <Navigation className="w-5 h-5 mr-2" />
              Open in Google Maps
            </Button>

            <Button
              onClick={handleMarkArrived}
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-base"
              disabled={!isTracking}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Mark as Arrived
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              📍 Trip Instructions
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your location is being shared with the patient</li>
              <li>• Use Google Maps for turn-by-turn navigation</li>
              <li>• Mark as "Arrived" when you reach the destination</li>
              <li>• Keep the app open for continuous tracking</li>
              <li>
                • If tracking stops, it will automatically restart when location
                updates
              </li>
            </ul>
          </div>

          {/* Debug Info (Remove in production) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-gray-100 rounded-lg p-4 text-xs font-mono">
              <p className="font-bold mb-2">Debug Info:</p>
              <p>Appointment ID: {appointmentId}</p>
              <p>Status: {appointment.status}</p>
              <p>Tracking: {isTracking ? "Yes" : "No"}</p>
              <p>
                Location: {location ? "Available" : "Waiting for location..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
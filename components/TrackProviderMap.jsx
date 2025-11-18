import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import io from "socket.io-client";

const TrackProviderMap = ({ appointmentId, serviceLocation }) => {
  const [providerLocation, setProviderLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [status, setStatus] = useState("SCHEDULED");
  const [showProviderInfo, setShowProviderInfo] = useState(false);
  const [map, setMap] = useState(null);
  const [isLoadingDirections, setIsLoadingDirections] = useState(false);
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  // CRITICAL: Separate Socket URL from API URL
  const SOCKET_URL = "ws://localhost:5000";
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

  const mapContainerStyle = {
    width: "100%",
    height: "500px",
    borderRadius: "12px",
  };

  const center = serviceLocation || { lat: 23.0225, lng: 72.5714 };

  // Initialize Socket.IO
  useEffect(() => {
    console.log("🔌 Connecting to Socket.IO...");
    console.log("📍 Socket URL:", SOCKET_URL);
    console.log("📍 API URL:", API_URL);
    console.log("📍 Appointment ID:", appointmentId);

    const token = localStorage.getItem("token");

    // Initialize socket with explicit configuration
    const socketInstance = io(SOCKET_URL, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("✅ Socket connected successfully!");
      console.log("   Socket ID:", socketInstance.id);
      console.log("   Transport:", socketInstance.io.engine.transport.name);
      setConnectionStatus("Connected");
      
      // Join tracking room after connection
      console.log("📍 Joining tracking room for appointment:", appointmentId);
      socketInstance.emit("tracking:join", { appointmentId });
    });

    socketInstance.on("tracking:joined", (data) => {
      console.log("✅ Successfully joined tracking room:", data);
      setConnectionStatus("Tracking Active");
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setConnectionStatus("Disconnected: " + reason);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      console.error("   Error message:", error.message);
      console.error("   Error type:", error.type);
      console.error("   Description:", error.description);
      setConnectionStatus("Connection Error");
    });

    socketInstance.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
      setConnectionStatus("Reconnected");
      socketInstance.emit("tracking:join", { appointmentId });
    });

    socketInstance.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 Reconnection attempt", attemptNumber);
      setConnectionStatus("Reconnecting...");
    });

    socketInstance.on("reconnect_error", (error) => {
      console.error("❌ Reconnection error:", error);
    });

    socketInstance.on("reconnect_failed", () => {
      console.error("❌ Reconnection failed");
      setConnectionStatus("Reconnection Failed");
    });

    // Listen for tracking events
    socketInstance.on("tracking:started", (data) => {
      console.log("🚗 Tracking started event received:", data);
      if (data.location) {
        setProviderLocation(data.location);
        setStatus("ON_THE_WAY");
      }
    });

    socketInstance.on("location:update", (data) => {
      console.log("📍 Location update event received:", data);
      if (data.location) {
        setProviderLocation(data.location);
        setDistance(data.distanceRemaining);
        setEta(data.estimatedArrival);
        setStatus("ON_THE_WAY");
      }
    });

    socketInstance.on("provider:arrived", (data) => {
      console.log("🎯 Provider arrived event received:", data);
      setStatus("ARRIVED");
    });

    socketInstance.on("appointment:status-changed", (data) => {
      console.log("📊 Status changed event received:", data);
      setStatus(data.status);
    });

    setSocket(socketInstance);

    // Fetch initial tracking status
    fetchInitialStatus();

    return () => {
      console.log("🔌 Cleaning up socket connection");
      if (socketInstance) {
        socketInstance.emit("tracking:leave", { appointmentId });
        socketInstance.disconnect();
      }
    };
  }, [appointmentId, SOCKET_URL, API_URL]);

  // Fetch initial tracking status
  const fetchInitialStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔍 Fetching initial tracking status...");
      
      const response = await fetch(
        `${API_URL}/location/track/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("📊 Initial tracking data received:", data);
        
        if (data.data?.isActive && data.data?.currentLocation) {
          setProviderLocation(data.data.currentLocation);
          setStatus(data.data.status || "ON_THE_WAY");
          setDistance(data.data.distanceRemaining);
          setEta(data.data.estimatedArrival);
          setConnectionStatus("Tracking Active");
        }
      } else {
        console.log("⏳ Tracking not started yet (this is normal)");
      }
    } catch (error) {
      console.log("⏳ Waiting for provider to start trip");
    }
  };

  const calculateRoute = useCallback(() => {
    if (
      !providerLocation ||
      !serviceLocation ||
      !window.google?.maps ||
      isLoadingDirections
    )
      return;

    console.log("🗺️ Calculating route...");
    setIsLoadingDirections(true);

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: providerLocation,
        destination: serviceLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setIsLoadingDirections(false);

        if (status === "OK") {
          console.log("✅ Route calculated successfully");
          setDirections(result);

          if (result.routes[0]?.legs[0]) {
            const leg = result.routes[0].legs[0];
            setDistance(leg.distance.value);

            const durationSeconds = leg.duration.value;
            const newEta = new Date(Date.now() + durationSeconds * 1000);
            setEta(newEta);
          }
        } else {
          console.error("❌ Directions request failed:", status);
        }
      }
    );
  }, [providerLocation, serviceLocation, isLoadingDirections]);

  useEffect(() => {
    if (providerLocation && serviceLocation && window.google?.maps) {
      const debounceTimer = setTimeout(() => {
        calculateRoute();
      }, 1000);

      return () => clearTimeout(debounceTimer);
    }
  }, [providerLocation, serviceLocation, calculateRoute]);

  // Auto-center map
  useEffect(() => {
    if (map && providerLocation && serviceLocation && window.google?.maps) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(providerLocation);
      bounds.extend(serviceLocation);
      map.fitBounds(bounds);
    }
  }, [map, providerLocation, serviceLocation]);

  const formatDistance = (meters) => {
    if (!meters) return "Calculating...";
    const km = (meters / 1000).toFixed(1);
    return `${km} km`;
  };

  const formatETA = (etaDate) => {
    if (!etaDate) return "Calculating...";
    const minutes = Math.ceil((new Date(etaDate) - new Date()) / 60000);
    return `${minutes} min`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ON_THE_WAY":
        return "bg-blue-500";
      case "ARRIVED":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const getConnectionStatusColor = () => {
    if (connectionStatus.includes("Connected") || connectionStatus.includes("Active")) {
      return "bg-green-100 text-green-700";
    } else if (connectionStatus.includes("Connecting") || connectionStatus.includes("Reconnecting")) {
      return "bg-yellow-100 text-yellow-700";
    } else {
      return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="tracking-container space-y-4">
      {/* Debug Connection Status */}
      <div className="bg-gray-100 rounded-lg p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium">Connection Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConnectionStatusColor()}`}>
            {connectionStatus}
          </span>
        </div>
        <div className="mt-2 text-xs space-y-1">
          <p className="text-gray-600">Socket URL: {SOCKET_URL}</p>
          <p className="text-gray-600">API URL: {API_URL}</p>
          <p className="text-gray-600">Socket ID: {socket?.id || 'Not connected'}</p>
          {providerLocation && (
            <p className="text-gray-600">
              Provider: Lat {providerLocation.lat?.toFixed(4)}, Lng{" "}
              {providerLocation.lng?.toFixed(4)}
            </p>
          )}
        </div>
      </div>

      {/* Status Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Track Your Provider</h2>
          <span
            className={`px-4 py-2 rounded-full text-white font-semibold ${getStatusColor(
              status
            )}`}
          >
            {status.replace("_", " ")}
          </span>
        </div>

        {status === "ON_THE_WAY" && providerLocation && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Distance</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatDistance(distance)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Estimated Arrival</p>
              <p className="text-2xl font-bold text-green-600">
                {formatETA(eta)}
              </p>
            </div>
          </div>
        )}

        {status === "ARRIVED" && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-800">
                  Provider has arrived!
                </h3>
                <p className="text-sm text-green-600">
                  Your service provider is at your location
                </p>
              </div>
            </div>
          </div>
        )}

        {(status === "SCHEDULED" || status === "CONFIRMED") && !providerLocation && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-center">
              🕒 Tracking will begin when provider starts the trip
            </p>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={providerLocation || center}
          zoom={14}
          onLoad={(map) => setMap(map)}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {/* User Location Marker - Red */}
          {serviceLocation && (
            <Marker
              position={serviceLocation}
              icon={{
                path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                scale: 12,
                fillColor: "#EA4335",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 3,
              }}
              title="Your Location"
            />
          )}

          {/* Provider Location Marker - Blue */}
          {providerLocation && (
            <>
              <Marker
                position={providerLocation}
                icon={{
                  path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                  scale: 12,
                  fillColor: "#4285F4",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 3,
                }}
                title="Provider Location"
                onClick={() => setShowProviderInfo(true)}
              />

              {showProviderInfo && (
                <InfoWindow
                  position={providerLocation}
                  onCloseClick={() => setShowProviderInfo(false)}
                >
                  <div className="p-2">
                    <h3 className="font-bold mb-1">Provider Location</h3>
                    <p className="text-sm text-gray-600">
                      {formatDistance(distance)} away
                    </p>
                    <p className="text-sm text-gray-600">ETA: {formatETA(eta)}</p>
                  </div>
                </InfoWindow>
              )}
            </>
          )}

          {/* Route */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#4285F4",
                  strokeWeight: 5,
                  strokeOpacity: 0.8,
                },
                suppressMarkers: true,
              }}
            />
          )}
        </GoogleMap>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-around">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Provider</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm">Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500"></div>
            <span className="text-sm">Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackProviderMap;
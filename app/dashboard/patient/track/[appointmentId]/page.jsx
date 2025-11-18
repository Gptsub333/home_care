"use client";

// import React, { useState, useEffect, useCallback } from "react";
// import {
//   GoogleMap,
//   Marker,
//   DirectionsRenderer,
//   InfoWindow,
// } from "@react-google-maps/api";
// import socketService from "../../../../../lib/services/socketService";
// import axios from "axios";

// const TrackProviderMap = ({ appointmentId, serviceLocation }) => {
//   const [providerLocation, setProviderLocation] = useState(null);
//   const [directions, setDirections] = useState(null);
//   const [eta, setEta] = useState(null);
//   const [distance, setDistance] = useState(null);
//   const [status, setStatus] = useState("SCHEDULED");
//   const [showProviderInfo, setShowProviderInfo] = useState(false);
//   const [map, setMap] = useState(null);
//   const [isLoadingDirections, setIsLoadingDirections] = useState(false);

//   const mapContainerStyle = {
//     width: "100%",
//     height: "500px",
//     borderRadius: "12px",
//   };

//   const center = serviceLocation || { lat: 23.0225, lng: 72.5714 };

//   // Custom marker icons
//   const providerIcon = {
//     url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMzQjgyRjYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjgiIGZpbGw9IiMzQjgyRjYiLz4KPC9zdmc+",
//     scaledSize:
//       typeof window !== "undefined" && window.google
//         ? new window.google.maps.Size(40, 40)
//         : { width: 40, height: 40 },
//     anchor:
//       typeof window !== "undefined" && window.google
//         ? new window.google.maps.Point(20, 20)
//         : { x: 20, y: 20 },
//   };

//   const userIcon = {
//     url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFQTQzMzUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjgiIGZpbGw9IiNFQTQzMzUiLz4KPC9zdmc+",
//     scaledSize:
//       typeof window !== "undefined" && window.google
//         ? new window.google.maps.Size(40, 40)
//         : { width: 40, height: 40 },
//     anchor:
//       typeof window !== "undefined" && window.google
//         ? new window.google.maps.Point(20, 20)
//         : { x: 20, y: 20 },
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     socketService.connect(token);
//     socketService.joinTrackingRoom(appointmentId);

//     socketService.onTrackingStarted((data) => {
//       console.log("Tracking started:", data);
//       setProviderLocation(data.location);
//       setStatus("ON_THE_WAY");
//     });

//     socketService.onLocationUpdate((data) => {
//       console.log("Location update:", data);
//       setProviderLocation(data.location);
//       setDistance(data.distanceRemaining);
//       setEta(data.estimatedArrival);
//     });

//     socketService.onProviderArrived(() => {
//       setStatus("ARRIVED");
//     });

//     fetchProviderLocation();

//     return () => {
//       socketService.leaveTrackingRoom(appointmentId);
//       socketService.offTrackingEvents();
//     };
//   }, [appointmentId]);

//   const fetchProviderLocation = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/location/track/${appointmentId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.data.isActive) {
//         setProviderLocation(response.data.data.currentLocation);
//         setStatus(response.data.data.status);
//         setDistance(response.data.data.distanceRemaining);
//         setEta(response.data.data.estimatedArrival);
//       }
//     } catch (error) {
//       console.error("Error fetching location:", error);
//     }
//   };

//   const calculateRoute = useCallback(() => {
//     if (
//       !providerLocation ||
//       !serviceLocation ||
//       !window.google ||
//       isLoadingDirections
//     )
//       return;

//     setIsLoadingDirections(true);

//     const directionsService = new window.google.maps.DirectionsService();

//     directionsService.route(
//       {
//         origin: providerLocation,
//         destination: serviceLocation,
//         travelMode: window.google.maps.TravelMode.DRIVING,
//         drivingOptions: {
//           departureTime: new Date(),
//           trafficModel: "bestguess",
//         },
//       },
//       (result, status) => {
//         setIsLoadingDirections(false);
        
//         if (status === "OK") {
//           setDirections(result);

//           // Update ETA from directions if available
//           if (result.routes[0]?.legs[0]) {
//             const leg = result.routes[0].legs[0];
//             setDistance(leg.distance.value);

//             // Calculate ETA based on current time + duration
//             const durationSeconds = leg.duration.value;
//             const newEta = new Date(Date.now() + durationSeconds * 1000);
//             setEta(newEta);
//           }
//         } else {
//           console.error("Directions request failed:", status);
//         }
//       }
//     );
//   }, [providerLocation, serviceLocation, isLoadingDirections]);

//   useEffect(() => {
//     if (providerLocation && serviceLocation && window.google) {
//       const debounceTimer = setTimeout(() => {
//         calculateRoute();
//       }, 1000); // Debounce for 1 second

//       return () => clearTimeout(debounceTimer);
//     }
//   }, [providerLocation, serviceLocation, calculateRoute]);

//   // Auto-center map when locations update
//   useEffect(() => {
//     if (map && providerLocation && serviceLocation && window.google) {
//       const bounds = new window.google.maps.LatLngBounds();
//       bounds.extend(providerLocation);
//       bounds.extend(serviceLocation);
//       map.fitBounds(bounds);
//     }
//   }, [map, providerLocation, serviceLocation]);

//   const formatDistance = (meters) => {
//     if (!meters) return "Calculating...";
//     const km = (meters / 1000).toFixed(1);
//     return `${km} km`;
//   };

//   const formatETA = (etaDate) => {
//     if (!etaDate) return "Calculating...";
//     const minutes = Math.ceil((new Date(etaDate) - new Date()) / 60000);
//     return `${minutes} min`;
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "ON_THE_WAY":
//         return "bg-blue-500";
//       case "ARRIVED":
//         return "bg-green-500";
//       default:
//         return "bg-gray-400";
//     }
//   };

//   return (
//     <div className="tracking-container space-y-4">
//       {/* Status Header */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-2xl font-bold">Track Your Provider</h2>
//           <span
//             className={`px-4 py-2 rounded-full text-white font-semibold ${getStatusColor(
//               status
//             )}`}
//           >
//             {status.replace("_", " ")}
//           </span>
//         </div>

//         {status === "ON_THE_WAY" && (
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-blue-50 rounded-lg p-4">
//               <p className="text-sm text-gray-600 mb-1">Distance</p>
//               <p className="text-2xl font-bold text-blue-600">
//                 {formatDistance(distance)}
//               </p>
//             </div>
//             <div className="bg-green-50 rounded-lg p-4">
//               <p className="text-sm text-gray-600 mb-1">Estimated Arrival</p>
//               <p className="text-2xl font-bold text-green-600">
//                 {formatETA(eta)}
//               </p>
//             </div>
//           </div>
//         )}

//         {status === "ARRIVED" && (
//           <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
//                 <svg
//                   className="w-6 h-6 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="text-lg font-bold text-green-800">
//                   Provider has arrived!
//                 </h3>
//                 <p className="text-sm text-green-600">
//                   Your service provider is at your location
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {status === "SCHEDULED" && (
//           <div className="bg-gray-50 rounded-lg p-4">
//             <p className="text-gray-600 text-center">
//               🕒 Tracking will begin when provider starts the trip
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Map */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <GoogleMap
//           mapContainerStyle={mapContainerStyle}
//           center={providerLocation || center}
//           zoom={14}
//           onLoad={(map) => setMap(map)}
//           options={{
//             zoomControl: true,
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: true,
//           }}
//         >
//           {/* User Location Marker */}
//           {serviceLocation && (
//             <Marker position={serviceLocation} icon={userIcon} title="Your Location" />
//           )}

//           {/* Provider Location Marker */}
//           {providerLocation && (
//             <>
//               <Marker
//                 position={providerLocation}
//                 icon={providerIcon}
//                 title="Provider"
//                 onClick={() => setShowProviderInfo(true)}
//               />

//               {showProviderInfo && (
//                 <InfoWindow
//                   position={providerLocation}
//                   onCloseClick={() => setShowProviderInfo(false)}
//                 >
//                   <div className="p-2">
//                     <h3 className="font-bold mb-1">Provider Location</h3>
//                     <p className="text-sm text-gray-600">
//                       {formatDistance(distance)} away
//                     </p>
//                     <p className="text-sm text-gray-600">ETA: {formatETA(eta)}</p>
//                   </div>
//                 </InfoWindow>
//               )}
//             </>
//           )}

//           {/* Route */}
//           {directions && (
//             <DirectionsRenderer
//               directions={directions}
//               options={{
//                 polylineOptions: {
//                   strokeColor: "#3B82F6",
//                   strokeWeight: 5,
//                   strokeOpacity: 0.8,
//                 },
//                 suppressMarkers: true, // We're using custom markers
//               }}
//             />
//           )}
//         </GoogleMap>
//       </div>

//       {/* Legend */}
//       <div className="bg-white rounded-lg shadow-md p-4">
//         <div className="flex items-center justify-around">
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
//             <span className="text-sm">Provider</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//             <span className="text-sm">Your Location</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 bg-blue-500"></div>
//             <span className="text-sm">Route</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrackProviderMap;




import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Dynamically import the map component to avoid SSR issues
const TrackProviderMap = dynamic(() => import("@/components/TrackProviderMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px] bg-white rounded-lg shadow-md">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map component...</p>
      </div>
    </div>
  ),
});

const libraries = ["places"];

export default function TrackAppointmentPage() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://home-care-backend.onrender.com/api";

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Please login to view this page");
          setLoading(false);
          return;
        }

        const res = await fetch(`${BACKEND_URL}/appointments/my-appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await res.json();
        const apt = data.appointments?.find((a) => a.id === appointmentId);

        if (!apt) {
          setError("Appointment not found");
        } else {
          setAppointment(apt);
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
        setError("Failed to load appointment details");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, BACKEND_URL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointment...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">{error || "Appointment not found"}</p>
        <Link href="/dashboard/patient/appointments">
          <Button>Back to Appointments</Button>
        </Link>
      </div>
    );
  }

  const serviceLocation =
    appointment.serviceLat && appointment.serviceLng
      ? {
          lat: parseFloat(appointment.serviceLat),
          lng: parseFloat(appointment.serviceLng),
        }
      : null;

  if (!serviceLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">
          Location information not available for this appointment
        </p>
        <Link href="/dashboard/patient/appointments">
          <Button>Back to Appointments</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard/patient/appointments">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Appointments
          </Button>
        </Link>

        {/* Appointment Info Card */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-bold mb-2">
            Tracking: {appointment.provider?.user?.name || "Provider"}
          </h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Service:</span>{" "}
              {appointment.serviceType}
            </p>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {new Date(appointment.appointmentDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Time:</span> {appointment.startTime}{" "}
              - {appointment.endTime}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span className="font-semibold text-blue-600">
                {appointment.status.replace("_", " ")}
              </span>
            </p>
          </div>
        </div>

        {/* Map with LoadScript */}
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          libraries={libraries}
          loadingElement={
            <div className="flex items-center justify-center h-[500px] bg-white rounded-lg shadow-md">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Google Maps...</p>
              </div>
            </div>
          }
        >
          <TrackProviderMap
            appointmentId={appointmentId}
            serviceLocation={serviceLocation}
          />
        </LoadScript>
      </div>
    </div>
  );
}
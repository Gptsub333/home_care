// "use client";

// import { useState, useEffect } from "react";
// import { Calendar, Clock, MapPin, Stethoscope, Mail, Phone } from "lucide-react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { format } from "date-fns";
// import Link from "next/link";

// export default function ProviderAppointments({ role = "provider" }) {
//   const BACKEND_URL =
//     process.env.NEXT_PUBLIC_BACKEND_URL ||
//     "https://home-care-backend.onrender.com/api";

//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchAppointments = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(
//         `${BACKEND_URL}/appointments/my-appointments`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await res.json();
//       if (!res.ok)
//         throw new Error(data.message || "Failed to load appointments");
//       setAppointments(data.appointments || data.data || []);
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, [role]);

//   const upcoming = appointments.filter(
//     (a) =>
//       a.status === "PENDING" ||
//       a.status === "CONFIRMED" ||
//       a.status === "UPCOMING"
//   );
//   const past = appointments.filter((a) => a.status === "COMPLETED");

//   const renderAppointmentRow = (apt) => (
//     <div
//       key={apt.id}
//       className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all p-5"
//     >
//       {/* Left - Appointment Info */}
//       <div className="flex-1 w-full space-y-2">
//         <h3 className="text-lg font-semibold text-gray-800">
//           {role === "provider"
//             ? apt.user?.name || "Patient"
//             : apt.provider?.name || "Provider"}
//         </h3>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 text-sm text-gray-600">
//           <div className="flex items-center gap-2">
//             <Mail className="h-4 w-4 text-blue-500" />
//             {apt.user?.email || "No email"}
//           </div>
//           <div className="flex items-center gap-2">
//             <Phone className="h-4 w-4 text-teal-500" />
//             {apt.user?.phone || "No phone"}
//           </div>
//           <div className="flex items-center gap-2">
//             <Calendar className="h-4 w-4 text-blue-500" />
//             {format(new Date(apt.appointmentDate), "dd MMM yyyy")}
//           </div>
//           <div className="flex items-center gap-2">
//             <Clock className="h-4 w-4 text-teal-500" />
//             {apt.startTime} - {apt.endTime}
//           </div>
//           <div className="flex items-center gap-2">
//             <MapPin className="h-4 w-4 text-gray-400" />
//             {apt.location || "Online / Clinic Visit"}
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-4 text-sm text-gray-700">
//           <span>
//             <span className="font-medium">Service:</span> {apt.serviceType}
//           </span>
//           <span>
//             <span className="font-medium">Price:</span> ₹{apt.price}
//           </span>
//         </div>

//         <div className="text-sm">
//           <span className="font-medium text-gray-500">Status:</span>{" "}
//           <span
//             className={`font-semibold px-2 py-1 rounded-md ${
//               apt.status === "PENDING"
//                 ? "bg-yellow-100 text-yellow-700"
//                 : apt.status === "CONFIRMED"
//                 ? "bg-green-100 text-green-700"
//                 : apt.status === "COMPLETED"
//                 ? "bg-blue-100 text-blue-700"
//                 : "bg-gray-100 text-gray-700"
//             }`}
//           >
//             {apt.status}
//           </span>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       {/* Header */}
//       <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <Link
//               href="/"
//               className="text-2xl font-serif font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
//             >
//               MediLux
//             </Link>
//             <nav className="hidden md:flex items-center gap-6">
//               <Link
//                 href="/"
//                 className="text-sm hover:text-primary transition-colors"
//               >
//                 Home
//               </Link>
//               <Link
//                 href="/search"
//                 className="text-sm hover:text-primary transition-colors"
//               >
//                 Find Care
//               </Link>
//               <Link
//                 href="/messages"
//                 className="text-sm hover:text-primary transition-colors"
//               >
//                 Messages
//               </Link>
//               <Link
//                 href="/dashboard/patient/appointments"
//                 className="text-sm font-semibold text-teal-600 transition-colors"
//               >
//                 Appointments
//               </Link>
//               <Link
//                 href="/dashboard/patient"
//                 className="text-sm hover:text-primary transition-colors"
//               >
//                 Dashboard
//               </Link>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Main Section */}
//       <main className="container mx-auto px-4 py-10">
//         <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
//           My Appointments
//         </h2>

//         <Tabs defaultValue="upcoming" className="w-full">
//           <div className="flex justify-center mb-8">
//             <TabsList className="bg-white border shadow-sm rounded-full p-1">
//               <TabsTrigger
//                 value="upcoming"
//                 className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
//               >
//                 Upcoming
//               </TabsTrigger>
//               <TabsTrigger
//                 value="past"
//                 className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
//               >
//                 Past
//               </TabsTrigger>
//             </TabsList>
//           </div>

//           {/* Upcoming */}
//           <TabsContent value="upcoming">
//             {loading ? (
//               <p className="text-center text-gray-500">
//                 Loading appointments...
//               </p>
//             ) : upcoming.length === 0 ? (
//               <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-inner">
//                 No upcoming appointments
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {upcoming.map(renderAppointmentRow)}
//               </div>
//             )}
//           </TabsContent>

//           {/* Past */}
//           <TabsContent value="past">
//             {past.length === 0 ? (
//               <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-inner">
//                 No past appointments
//               </div>
//             ) : (
//               <div className="space-y-4">{past.map(renderAppointmentRow)}</div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Mail, Phone, Navigation } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function UnifiedAppointmentsPage({ role = "provider" }) {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://home-care-backend.onrender.com/api";

  const [appointments, setAppointments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateLong = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get user from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BACKEND_URL}/appointments/my-appointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to load appointments");
      setAppointments(data.appointments || data.data || []);
    } catch (err) {
      console.error('Fetch appointments error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/bookings/user/bookings`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch bookings');
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Fetch bookings error:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    if (user) fetchBookings();
  }, [role, user]);

  const handleCancelBooking = async (bookingId) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel booking');
      
      alert('Booking cancelled successfully');
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
      case 'UPCOMING': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Merge appointments with their corresponding booking data
  const mergedAppointments = appointments.map(apt => {
    // Find matching booking by provider and date/time
    const matchingBooking = bookings.find(booking => 
      booking.provider?.id === apt.provider?.id && 
      booking.scheduledDate === apt.appointmentDate
    );

    return {
      ...apt,
      bookingId: matchingBooking?.id,
      bookingStatus: matchingBooking?.status,
      bookingAddress: matchingBooking?.address,
      hasBooking: !!matchingBooking,
      canTrack: matchingBooking?.status === 'ON_THE_WAY',
      canCancel: matchingBooking && ['PENDING', 'CONFIRMED'].includes(matchingBooking.status)
    };
  });

  const upcomingAppointments = mergedAppointments.filter(
    (a) =>
      a.status === "PENDING" ||
      a.status === "CONFIRMED" ||
      a.status === "UPCOMING" ||
      (a.bookingStatus && ['PENDING', 'CONFIRMED', 'ON_THE_WAY', 'ARRIVED'].includes(a.bookingStatus))
  );
  
  const pastAppointments = mergedAppointments.filter((a) => 
    a.status === "COMPLETED" || a.bookingStatus === "COMPLETED"
  );

  const renderUnifiedAppointment = (apt) => (
    <div
      key={apt.id}
      className="flex flex-col lg:flex-row justify-between items-start bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all p-6"
    >
      {/* Left Side - Main Info */}
      <div className="flex items-start gap-4 flex-1 w-full">
        {/* Provider Image */}
        <img
          src={apt.provider?.user?.profileImage || apt.provider?.profileImage || '/default-provider.png'}
          alt={apt.provider?.user?.name || apt.provider?.name}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-teal-100"
        />
        
        {/* Details */}
        <div className="flex-1 space-y-3">
          {/* Provider Name */}
          <h3 className="text-lg font-semibold text-gray-800">
            {role === "provider"
              ? apt.user?.name || "Patient"
              : apt.provider?.user?.name || apt.provider?.name || "Provider"}
          </h3>

          {/* Contact Info */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
            {/* <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="truncate">{apt.user?.email || apt.provider?.email || "No email"}</span>
            </div> 
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-teal-500 flex-shrink-0" />
              <span>{apt.user?.phone || apt.provider?.phone || "No phone"}</span>
            </div>
          </div> */}

          {/* Date, Time, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span>{formatDateLong(apt.appointmentDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal-500 flex-shrink-0" />
              <span>{apt.startTime} - {apt.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">
                {apt.bookingAddress || apt.location || "Clinic Visit"}
              </span>
            </div>
          </div>

          {/* Service and Price */}
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-gray-700">
              <span className="font-medium">Service:</span> {apt.serviceType}
            </span>
            <span className="text-gray-700">
              <span className="font-medium">Price:</span> ₹{apt.price}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Status and Actions */}
      <div className="flex flex-col items-end gap-3 mt-4 lg:mt-0 w-full lg:w-auto">
        {/* Status Badge - Use booking status if available */}
        <Badge className={getStatusColor(apt.bookingStatus || apt.status)}>
          {apt.bookingStatus || apt.status}
        </Badge>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full lg:w-auto">
          {/* Track Provider Button */}
          {apt.canTrack && (
            <a href={`/dashboard/patient/tracking/${apt.bookingId}`}>
              <Button size="sm" className="w-full lg:w-auto min-w-[140px]">
                <Navigation className="h-4 w-4 mr-2" />
                Track Provider
              </Button>
            </a>
          )}
          
          {/* Cancel Button */}
          {apt.canCancel && (
            <Button
              size="sm"
              variant="outline"
              className="w-full lg:w-auto min-w-[140px] border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => handleCancelBooking(apt.bookingId)}
            >
              Cancel Booking
            </Button>
          )}
        </div>

        {/* Booking Info Label */}
        {apt.hasBooking && (
          <span className="text-xs text-gray-500 italic">
            Service Booking Active
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="text-2xl font-serif font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
            >
              MediLux
            </a>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-sm hover:text-primary transition-colors">
                Home
              </a>
              <a href="/search" className="text-sm hover:text-primary transition-colors">
                Find Care
              </a>
              <a href="/messages" className="text-sm hover:text-primary transition-colors">
                Messages
              </a>
              <a
                href="/dashboard/patient/appointments"
                className="text-sm font-semibold text-teal-600 transition-colors"
              >
                My Schedule
              </a>
              <a href="/dashboard/patient" className="text-sm hover:text-primary transition-colors">
                Dashboard
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
            My Healthcare Schedule
          </h2>
          <p className="text-center text-gray-600">
            All your appointments and service bookings in one place
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white border shadow-sm rounded-full p-1">
              <TabsTrigger
                value="upcoming"
                className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all"
              >
                Past
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Upcoming Tab */}
          <TabsContent value="upcoming">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <p className="text-gray-500 mt-4">Loading your schedule...</p>
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No upcoming appointments</p>
                  <a href="/search">
                    <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600">
                      Find a Provider
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map(renderUnifiedAppointment)}
              </div>
            )}
          </TabsContent>

          {/* Past Tab */}
          <TabsContent value="past">
            {pastAppointments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No past appointments</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastAppointments.map(renderUnifiedAppointment)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

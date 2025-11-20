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
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Mail,
  Phone,
  Navigation,
  Eye,
  Star,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PatientAppointments() {
  const router = useRouter();
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://home-care-backend.onrender.com/api";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewingAppointment, setReviewingAppointment] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/appointments/my-appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to load appointments");
      setAppointments(data.appointments || data.data || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openReviewModal = (appointment) => {
    setReviewingAppointment(appointment);
    setReviewRating(0);
    setReviewComment("");
    setReviewError("");
    setReviewDialogOpen(true);
  };

  const closeReviewModal = () => {
    setReviewDialogOpen(false);
    setReviewRating(0);
    setReviewComment("");
    setReviewError("");
    setReviewingAppointment(null);
  };

  const handleSubmitReview = async () => {
    if (!reviewRating || !reviewComment.trim()) {
      alert("Please provide both rating and comment");
      return;
    }

    setReviewSubmitting(true);
    setReviewError("");

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };

    const token = localStorage.getItem("token") || getCookie("token");

    if (!token) {
      alert("You must be logged in to submit a review. Please login first.");
      setReviewSubmitting(false);
      return;
    }

    try {
      if (!reviewingAppointment || !reviewingAppointment.provider) {
        throw new Error("Missing appointment or provider information");
      }

      const providerId =
        reviewingAppointment.provider.providerId ||
        reviewingAppointment.provider.id;

      if (!providerId) {
        throw new Error("Provider ID not found");
      }

      const res = await fetch(
        `${BACKEND_URL}/providers/${providerId}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: reviewRating,
            comment: reviewComment,
            appointmentId: reviewingAppointment.id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === reviewingAppointment.id ? { ...apt, hasReview: true } : apt
        )
      );

      closeReviewModal();
    } catch (err) {
      console.error(err);
      setReviewError(err.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

 const upcoming = appointments.filter((a) => {
  const appointmentDate = new Date(a.appointmentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Show in upcoming if:
  // 1. Status is active (not completed/cancelled)
  // 2. Date is today or future
  const isActiveStatus = [
    "PENDING",
    "CONFIRMED",
    "SCHEDULED",
    "ON_THE_WAY",
    "ARRIVED",
    "IN_PROGRESS"  // ✅ Added this!
  ].includes(a.status);
  
  const isFutureOrToday = appointmentDate >= today;
  
  return isActiveStatus && isFutureOrToday;
});

const past = appointments.filter((a) => {
  const appointmentDate = new Date(a.appointmentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Show in past if:
  // 1. Status is completed/cancelled OR
  // 2. Date is in the past (regardless of status)
  const isCompletedStatus = ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(a.status);
  const isPastDate = appointmentDate < today;
  
  return isCompletedStatus || isPastDate;
});

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
      case "SCHEDULED":
        return "bg-green-100 text-green-700";
      case "ON_THE_WAY":
        return "bg-blue-100 text-blue-700";
      case "ARRIVED":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const renderAppointmentRow = (apt) => (
    <div
      key={apt.id}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all p-5"
    >
      {/* Left - Appointment Info */}
      <div className="flex-1 w-full space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {apt.provider?.user?.name || "Provider"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-teal-500" />
            {apt.provider?.specialty || "General"}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            {format(new Date(apt.appointmentDate), "dd MMM yyyy")}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-teal-500" />
            {apt.startTime} - {apt.endTime}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            {apt.serviceAddress || "Address not set"}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <span>
            <span className="font-medium">Service:</span> {apt.serviceType}
          </span>
          <span>
            <span className="font-medium">Price:</span> ${apt.price}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm">
            <span className="font-medium text-gray-500">Status:</span>{" "}
            <span
              className={`font-semibold px-2 py-1 rounded-md ${getStatusStyle(
                apt.status
              )}`}
            >
              {apt.status.replace("_", " ")}
            </span>
          </span>

          {/* TRACK PROVIDER BUTTON */}
          {(apt.status === "ON_THE_WAY" || apt.status === "ARRIVED") && (
            <Button
              size="sm"
              onClick={() => router.push(`/dashboard/patient/track/${apt.id}`)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
            >
              <Navigation className="w-4 h-4" />
              Track Provider
            </Button>
          )}

          {(apt.status === "CONFIRMED" || apt.status === "SCHEDULED") && (
            <span className="text-xs text-blue-600 font-medium">
              🕒 Tracking will start when provider begins trip
            </span>
          )}

          {apt.status === "COMPLETED" && !apt.hasReview && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openReviewModal(apt)}
              className="flex items-center gap-1"
            >
              <Star className="w-4 h-4" />
              Review provider
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-serif font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
            >
              MediLux
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="text-sm hover:text-primary transition-colors"
              >
                Find Care
              </Link>
              <Link
                href="/messages"
                className="text-sm hover:text-primary transition-colors"
              >
                Messages
              </Link>
              <Link
                href="/dashboard/patient/appointments"
                className="text-sm font-semibold text-teal-600 transition-colors"
              >
                Appointments
              </Link>
              <Link
                href="/dashboard/patient"
                className="text-sm hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          My Appointments
        </h2>

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
                className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                Past
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Upcoming */}
          <TabsContent value="upcoming">
            {loading ? (
              <p className="text-center text-gray-500">
                Loading appointments...
              </p>
            ) : upcoming.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-inner">
                No upcoming appointments
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map(renderAppointmentRow)}
              </div>
            )}
          </TabsContent>

          {/* Past */}
          <TabsContent value="past">
            {past.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-inner">
                No past appointments
              </div>
            ) : (
              <div className="space-y-4">{past.map(renderAppointmentRow)}</div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog
          open={reviewDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              closeReviewModal();
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Rate your experience</DialogTitle>
              <DialogDescription>
                Share your feedback about your recent visit so we can improve
                your care.
              </DialogDescription>
            </DialogHeader>

            {reviewingAppointment && (
              <div className="space-y-4">
                <div className="text-sm text-gray-700">
                  <p className="font-semibold">
                    {reviewingAppointment.provider?.user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {reviewingAppointment.serviceType}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(
                      new Date(reviewingAppointment.appointmentDate),
                      "dd MMM yyyy"
                    )}{" "}
                    {reviewingAppointment.startTime} -{" "}
                    {reviewingAppointment.endTime}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= reviewRating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {reviewRating ? `${reviewRating} / 5` : "Select rating"}
                  </span>
                </div>

                <Textarea
                  placeholder="Share your experience with this provider..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                />

                {reviewError && (
                  <p className="text-sm text-red-600">{reviewError}</p>
                )}
              </div>
            )}

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={closeReviewModal}
                disabled={reviewSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
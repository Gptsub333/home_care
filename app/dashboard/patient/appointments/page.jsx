"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Stethoscope, Mail, Phone } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";
import Link from "next/link";

export default function ProviderAppointments({ role = "provider" }) {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://home-care-backend.onrender.com/api";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BACKEND_URL}/appointments/provider/appointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
  }, [role]);

  const upcoming = appointments.filter(
    (a) =>
      a.status === "PENDING" ||
      a.status === "CONFIRMED" ||
      a.status === "UPCOMING"
  );
  const past = appointments.filter((a) => a.status === "COMPLETED");

  const renderAppointmentRow = (apt) => (
    <div
      key={apt.id}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all p-5"
    >
      {/* Left - Appointment Info */}
      <div className="flex-1 w-full space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {role === "provider"
            ? apt.user?.name || "Patient"
            : apt.provider?.name || "Provider"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-500" />
            {apt.user?.email || "No email"}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-teal-500" />
            {apt.user?.phone || "No phone"}
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
            {apt.location || "Online / Clinic Visit"}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <span>
            <span className="font-medium">Service:</span> {apt.serviceType}
          </span>
          <span>
            <span className="font-medium">Price:</span> ₹{apt.price}
          </span>
        </div>

        <div className="text-sm">
          <span className="font-medium text-gray-500">Status:</span>{" "}
          <span
            className={`font-semibold px-2 py-1 rounded-md ${
              apt.status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : apt.status === "CONFIRMED"
                ? "bg-green-100 text-green-700"
                : apt.status === "COMPLETED"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {apt.status}
          </span>
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
      </main>
    </div>
  );
}

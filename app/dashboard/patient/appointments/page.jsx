"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";

export default function ProviderAppointments({ role = "provider" }) {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://home-care-backend.onrender.com/api";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `${BACKEND_URL}/appointments/provider/appointments`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to load appointments");

      // Some APIs return {appointments: [...]}, others {data: [...]}
      setAppointments(data.appointments || data.data || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [role]);

  // Update Appointment Status (confirm, complete, cancel)
  const updateAppointmentStatus = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      let url = `${BACKEND_URL}/appointments/${id}`;
      let body = {};

      if (action === "cancel") {
        url += `/cancel`;
        body = { cancelReason: "Provider unavailable" };
      } else if (action === "confirm") {
        url += `/status`;
        body = { status: "CONFIRMED" };
      } else if (action === "complete") {
        url += `/status`;
        body = { status: "COMPLETED" };
      }

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      alert(`Appointment ${action} successful`);
      fetchAppointments();
    } catch (err) {
      alert(err.message);
    }
  };

  // Separate upcoming and past appointments
  const upcoming = appointments.filter(
    (a) =>
      a.status === "PENDING" ||
      a.status === "CONFIRMED" ||
      a.status === "UPCOMING"
  );
  const past = appointments.filter((a) => a.status === "COMPLETED");

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">My Appointments</h2>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        {/* Upcoming Appointments */}
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading appointments...</p>
          ) : upcoming.length === 0 ? (
            <p className="text-center text-gray-500">
              No upcoming appointments
            </p>
          ) : (
            upcoming.map((apt) => (
              <Card
                key={apt.id}
                className="shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <CardContent className="p-6 flex justify-between items-center">
                  {/* Appointment Info */}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {role === "provider"
                        ? apt.user?.name || "Patient"
                        : apt.provider?.name || "Provider"}
                    </h3>

                    <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-500 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(
                          new Date(apt.appointmentDate),
                          "dd MMM yyyy"
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {apt.startTime} - {apt.endTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Online / Clinic Visit
                      </div>
                    </div>

                    <p className="mt-2 text-sm">
                      <span className="font-medium">Service:</span>{" "}
                      {apt.serviceType} |{" "}
                      <span className="font-medium">Price:</span> ₹{apt.price}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Status:{" "}
                      <span className="font-semibold text-gray-600">
                        {apt.status}
                      </span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {apt.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateAppointmentStatus(apt.id, "confirm")
                          }
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateAppointmentStatus(apt.id, "cancel")
                          }
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    {apt.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateAppointmentStatus(apt.id, "complete")
                        }
                      >
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Past Appointments */}
        <TabsContent value="past" className="space-y-4 mt-4">
          {past.length === 0 ? (
            <p className="text-center text-gray-500">No past appointments</p>
          ) : (
            past.map((apt) => (
              <Card
                key={apt.id}
                className="shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {role === "provider"
                        ? apt.user?.name || "Patient"
                        : apt.provider?.name || "Provider"}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-500 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(
                          new Date(apt.appointmentDate),
                          "dd MMM yyyy"
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {apt.startTime} - {apt.endTime}
                      </div>
                    </div>
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Service:</span>{" "}
                      {apt.serviceType} |{" "}
                      <span className="font-medium">Price:</span> ₹{apt.price}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Status:{" "}
                      <span className="font-semibold text-green-600">
                        {apt.status}
                      </span>
                    </p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

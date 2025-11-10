"use client";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Appointments({ role = "user" }) {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://home-care-backend.onrender.com/api";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Appointments (User or Provider)
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
      setAppointments(data.data || data.appointments || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    setLoading(false);
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
        body = {
          cancelReason:
            "Patient requested cancellation due to schedule conflict",
        };
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
      fetchAppointments(); // 🔁 Refresh after action
    } catch (err) {
      alert(err.message);
    }
  };

  const upcoming = appointments.filter(
    (a) =>
      a.status === "PENDING" ||
      a.status === "CONFIRMED" ||
      a.status === "UPCOMING"
  );
  const past = appointments.filter((a) => a.status === "COMPLETED");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        {/* Upcoming Appointments */}
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {loading ? (
            <p>Loading appointments...</p>
          ) : upcoming.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No upcoming appointments
            </p>
          ) : (
            upcoming.map((apt) => (
              <Card key={apt._id}>
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      {role === "provider"
                        ? apt.patient?.name || "Patient"
                        : apt.provider?.name || "Provider"}
                    </h3>
                    <div className="flex gap-3 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />{" "}
                        {apt.appointmentDate || apt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {apt.startTime} -{" "}
                        {apt.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />{" "}
                        {apt.location || "Online"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {apt.status === "PENDING" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateAppointmentStatus(apt._id, "confirm")
                        }
                      >
                        Confirm
                      </Button>
                    )}
                    {apt.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateAppointmentStatus(apt._id, "complete")
                        }
                      >
                        Complete
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
            <p className="text-muted-foreground text-center">
              No past appointments
            </p>
          ) : (
            past.map((apt) => (
              <Card key={apt._id}>
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      {role === "provider"
                        ? apt.patient?.name || "Patient"
                        : apt.provider?.name || "Provider"}
                    </h3>
                    <div className="flex gap-3 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />{" "}
                        {apt.appointmentDate || apt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {apt.startTime} -{" "}
                        {apt.endTime}
                      </span>
                    </div>
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

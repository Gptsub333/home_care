"use client";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { format } from "date-fns";

export default function Appointments({ role = "user" }) {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://home-care-backend.onrender.com/api";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status, cancelReason = null) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          cancelReason ? { cancelReason, status } : { status }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      setCancelDialogOpen(false);
      setCancelReason("");
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const confirmAppointment = (id) => handleStatusUpdate(id, "CONFIRMED");
  const completeAppointment = (id) => handleStatusUpdate(id, "COMPLETED");

  const openCancelDialog = (apt) => {
    setSelectedAppointment(apt);
    setCancelDialogOpen(true);
  };

  const submitCancel = () => {
    if (!cancelReason.trim()) {
      alert("Please enter a reason for cancellation.");
      return;
    }
    handleStatusUpdate(selectedAppointment.id, "CANCELLED", cancelReason);
  };

  const upcoming = appointments.filter(
    (a) => a.status === "PENDING" || a.status === "CONFIRMED"
  );
  const past = appointments.filter(
    (a) => a.status === "COMPLETED" || a.status === "CANCELLED"
  );

  const formatDate = (date) =>
    date ? format(new Date(date), "MMMM dd, yyyy") : "N/A";

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">My Appointments</h1>

      <Tabs defaultValue="upcoming">
        <TabsList className="w-full justify-center">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        {/* UPCOMING */}
        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading appointments...</p>
          ) : upcoming.length === 0 ? (
            <p className="text-center text-gray-500">
              No upcoming appointments.
            </p>
          ) : (
            upcoming.map((apt) => (
              <Card
                key={apt.id}
                className="rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                <CardContent className="p-5 flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={apt.provider?.profileImage || "/default-doctor.png"}
                      alt={apt.provider?.user?.name || "Doctor"}
                      width={80}
                      height={80}
                      className="rounded-full border object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start flex-wrap">
                      <h3 className="font-semibold text-lg">
                        {apt.provider?.user?.name || "Unknown Provider"}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                          apt.status
                        )}`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {apt.provider?.specialty || "General Practitioner"} •{" "}
                      {apt.provider?.credentials}
                    </p>

                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(apt.appointmentDate)}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {apt.startTime} - {apt.endTime}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {apt.provider?.practiceAddress || "Online Consultation"}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="font-medium text-sm">
                        Fee: ₹{apt.price}
                      </span>
                      <div className="flex gap-2">
                        {apt.status === "PENDING" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => confirmAppointment(apt.id)}
                            >
                              Confirm
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openCancelDialog(apt)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {apt.status === "CONFIRMED" && (
                          <Button
                            size="sm"
                            onClick={() => completeAppointment(apt.id)}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* PAST */}
        <TabsContent value="past" className="space-y-4 mt-6">
          {past.length === 0 ? (
            <p className="text-center text-gray-500">No past appointments.</p>
          ) : (
            past.map((apt) => (
              <Card
                key={apt.id}
                className="rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <CardContent className="p-5 flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Image
                      src={apt.provider?.profileImage || "/default-doctor.png"}
                      alt={apt.provider?.user?.name || "Doctor"}
                      width={80}
                      height={80}
                      className="rounded-full border object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start flex-wrap">
                      <h3 className="font-semibold text-lg">
                        {apt.provider?.user?.name || "Unknown Provider"}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                          apt.status
                        )}`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {apt.provider?.specialty} • {apt.provider?.credentials}
                    </p>

                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(apt.appointmentDate)}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {apt.startTime} - {apt.endTime}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {apt.provider?.practiceAddress || "Online Consultation"}
                      </p>
                    </div>

                    {apt.cancelReason && (
                      <p className="mt-3 text-sm italic text-red-600">
                        Cancellation Reason: {apt.cancelReason}
                      </p>
                    )}
                  </div>

                  {apt.status === "COMPLETED" && (
                    <CheckCircle className="w-6 h-6 text-green-500 self-center" />
                  )}
                  {apt.status === "CANCELLED" && (
                    <XCircle className="w-6 h-6 text-red-500 self-center" />
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-2">
            Please provide a reason for cancelling this appointment:
          </p>
          <Textarea
            placeholder="Type your reason here..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Close
            </Button>
            <Button variant="destructive" onClick={submitCancel}>
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

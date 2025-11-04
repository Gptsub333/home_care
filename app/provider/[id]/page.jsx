"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

const StarIcon = ({ className, filled }) => (
  <svg
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const AwardIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const MessageCircleIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>
);

const HeartIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const Share2Icon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>
);

const ChevronLeftIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const mockProvider = {
  id: 1,
  name: "Dr. Sarah Johnson",
  specialty: "General Physician",
  rating: 4.9,
  reviewCount: 234,
  experience: 15,
  price: 150,
  location: "Manhattan, NY",
  image: "/professional-female-doctor.png",
  about:
    "Dr. Sarah Johnson is a board-certified general physician with over 15 years of experience in providing comprehensive healthcare services. She specializes in preventive care, chronic disease management, and acute illness treatment. Dr. Johnson is known for her compassionate approach and dedication to patient wellness.",
  education: [
    "MD - Harvard Medical School",
    "Residency - Johns Hopkins Hospital",
    "Board Certified - Internal Medicine",
  ],
  services: [
    { name: "General Consultation", price: 150, duration: "30 min" },
    { name: "Comprehensive Physical", price: 250, duration: "60 min" },
    { name: "Follow-up Visit", price: 100, duration: "20 min" },
    { name: "Urgent Care", price: 200, duration: "45 min" },
  ],
  reviews: [
    {
      id: 1,
      patient: "John D.",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Dr. Johnson is exceptional! She took the time to listen to all my concerns and provided thorough explanations. Highly recommend!",
    },
    {
      id: 2,
      patient: "Maria S.",
      rating: 5,
      date: "1 month ago",
      comment:
        "Very professional and caring. The home visit was convenient and she made me feel comfortable throughout the consultation.",
    },
    {
      id: 3,
      patient: "David L.",
      rating: 4,
      date: "2 months ago",
      comment:
        "Great experience overall. Dr. Johnson is knowledgeable and friendly. Would definitely book again.",
    },
  ],
};

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

export default function ProviderProfilePage() {
  const { id } = useParams();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [notes, setNotes] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    async function fetchProvider() {
      setLoading(true);
      try {
        const res = await fetch(`https://home-care-backend.onrender.com/api/providers/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch provider");
        }

        setLoading(false);
        const data = await res.json();
        setProvider(data);
      } catch (err) {
        setError("Failed to load provider details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProvider();
  }, [id]);

  console.log("userId---", id);

  const handleBooking = () => {
    console.log("[v0] Booking:", {
      date,
      selectedTime,
      selectedService,
      notes,
    });
    setIsBookingOpen(false);
    // Reset form
    setSelectedTime("");
    setSelectedService("");
    setNotes("");
  };

  const selectedServiceDetails = mockProvider.services.find(
    (s) => s.name === selectedService
  );

  if (loading)
    return <div className="p-10 text-center text-lg">Loading provider...</div>;
  if (error)
    return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!provider) return <div>No provider found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
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
                className="text-sm hover:text-teal-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="text-sm hover:text-teal-600 transition-colors"
              >
                Find Care
              </Link>
              <Link
                href="/dashboard/patient"
                className="text-sm hover:text-teal-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-teal-200 hover:bg-teal-50 bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-teal-600 mb-6 transition-colors"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to search
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Header */}
            <Card className="border-teal-100 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0 ring-4 ring-teal-100">
                    <Image
                      src={provider.image || "/placeholder.svg"}
                      alt={provider.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-3xl font-serif font-bold mb-2 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                          {provider.name}
                        </h1>
                        <p className="text-lg text-muted-foreground mb-3">
                          {mockProvider.specialty}
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                          <div className="flex items-center gap-1">
                            <StarIcon
                              className="h-5 w-5 text-yellow-400"
                              filled
                            />
                            <span className="font-semibold">
                              {provider.rating}
                            </span>
                            <span className="text-muted-foreground">
                              ({provider.totalReviews} reviews)
                            </span>
                          </div>
                          {/* <div className="flex items-center gap-1 text-muted-foreground">
                            <AwardIcon className="h-5 w-5 text-teal-600" />
                            <span>{mockProvider.experience} years exp.</span>
                          </div> */}
                        </div>
                      </div>
                      <div className="flex gap-2 justify-center md:justify-start">
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-teal-200 hover:bg-teal-50 bg-transparent"
                        >
                          <HeartIcon className="h-4 w-4 text-teal-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-teal-200 hover:bg-teal-50 bg-transparent"
                        >
                          <Share2Icon className="h-4 w-4 text-teal-600" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                      <MapPinIcon className="h-4 w-4 text-teal-600" />
                      <span>{provider.location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start bg-white border border-teal-100">
                {/* <TabsTrigger
                  value="about"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                >
                  Services
                </TabsTrigger> */}
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* <TabsContent value="about" className="mt-6">
                <Card className="border-teal-100 shadow-lg">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-teal-700">
                        About
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {mockProvider.about}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-teal-700">
                        Education & Credentials
                      </h3>
                      <ul className="space-y-2">
                        {mockProvider.education.map((edu, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AwardIcon className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> */}

              {/* <TabsContent value="services" className="mt-6">
                <Card className="border-teal-100 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-teal-700">
                      Services Offered
                    </h3>
                    <div className="space-y-4">
                      {mockProvider.services.map((service, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 border border-teal-100 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                          <div>
                            <h4 className="font-semibold mb-1">
                              {service.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              <ClockIcon className="h-3 w-3 inline mr-1 text-teal-600" />
                              {service.duration}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent">
                              ${service.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> */}

              <TabsContent value="reviews" className="mt-6">
                <Card className="border-teal-100 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-teal-700">
                        Patient Reviews
                      </h3>
                      <div className="flex items-center gap-2">
                        <StarIcon className="h-5 w-5 text-yellow-400" filled />
                        <span className="text-2xl font-bold">
                          {provider.rating}
                        </span>
                        <span className="text-muted-foreground">
                          ({provider.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {provider.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-teal-100 last:border-0 pb-6 last:pb-0"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center font-semibold text-white">
                                {review.patient.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold">
                                  {review.patient}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {review.createdAt}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map(
                                (_, i) => (
                                  <StarIcon
                                    key={i}
                                    className="h-4 w-4 text-yellow-400"
                                    filled
                                  />
                                )
                              )}
                            </div>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-24 border-teal-100 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    Starting from
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent mb-1">
                    ${mockProvider.price}
                  </p>
                  <p className="text-sm text-muted-foreground">per visit</p>
                </div>

                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full mb-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                      size="lg"
                    >
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Book Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        Book Appointment
                      </DialogTitle>
                      <DialogDescription>
                        Schedule your visit with {mockProvider.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {/* Service Selection */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Select Service
                        </label>
                        <Select
                          value={selectedService}
                          onValueChange={setSelectedService}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockProvider.services.map((service) => (
                              <SelectItem
                                key={service.name}
                                value={service.name}
                              >
                                {service.name} - ${service.price} (
                                {service.duration})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Date Selection */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Select Date
                        </label>
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="rounded-md border"
                          disabled={(date) => date < new Date()}
                        />
                      </div>

                      {/* Time Selection */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Select Time
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              onClick={() => setSelectedTime(time)}
                              className={
                                selectedTime === time
                                  ? "bg-gradient-to-r from-teal-500 to-blue-500"
                                  : ""
                              }
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Additional Notes (Optional)
                        </label>
                        <Textarea
                          placeholder="Any specific concerns or requirements..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                        />
                      </div>

                      {/* Summary */}
                      {selectedService && selectedTime && (
                        <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-4 rounded-lg space-y-2 border border-teal-100">
                          <h4 className="font-semibold mb-2">
                            Booking Summary
                          </h4>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Service:
                            </span>
                            <span className="font-medium">
                              {selectedService}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-medium">
                              {date?.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Time:</span>
                            <span className="font-medium">{selectedTime}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Duration:
                            </span>
                            <span className="font-medium">
                              {selectedServiceDetails?.duration}
                            </span>
                          </div>
                          <div className="border-t border-teal-200 pt-2 mt-2">
                            <div className="flex justify-between">
                              <span className="font-semibold">Total:</span>
                              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent">
                                ${selectedServiceDetails?.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                        size="lg"
                        onClick={handleBooking}
                        disabled={!selectedService || !selectedTime}
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Link href={`/messages/${mockProvider.id}`} className="block">
                  <Button
                    variant="outline"
                    className="w-full border-teal-200 hover:bg-teal-50 bg-transparent"
                  >
                    <MessageCircleIcon className="h-4 w-4 mr-2 text-teal-600" />
                    Send Message
                  </Button>
                </Link>

                <div className="mt-6 pt-6 border-t border-teal-100 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-muted-foreground">
                      Instant confirmation
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span className="text-muted-foreground">
                      Free cancellation
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    </div>
                    <span className="text-muted-foreground">
                      Verified professional
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

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
import { format, addMinutes } from "date-fns";

// -------------------------------------------------------------------
// Icons
// -------------------------------------------------------------------

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

// -------------------------------------------------------------------
// Main Component
// -------------------------------------------------------------------

export default function ProviderProfilePage() {
  const { id } = useParams();
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://home-care-backend.onrender.com/api";

  const [token, setToken] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [notes, setNotes] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [endTime, setEndTime] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  // Fetch provider details
  const fetchProvider = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/providers/${id}`);
      if (!res.ok) throw new Error("Failed to fetch provider");
      const data = await res.json();
      setProvider(data);
    } catch (err) {
      setError("Failed to load provider details");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/providers/${id}/reviews?page=${currentPage}&limit=5`
      );
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch reviews");
      setReviews(data.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProvider();
      fetchReviews();
    }
  }, [id]);

  // Review submission
  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) {
      alert("Please provide both rating and comment");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/providers/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      setSuccessMessage("Review submitted successfully!");
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      if (!token) {
        alert("Please login first");
        window.location.href = "/login";
        return;
      }
      const res = await fetch(`${BACKEND_URL}/messages/room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ providerId: provider.providerId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to create chat room");
      window.location.href = `/messages/${data.room.id}`;
    } catch (err) {
      alert("Failed to start chat");
    }
  };

  if (loading)
    return <div className="p-10 text-center text-lg">Loading provider...</div>;
  if (error)
    return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!provider) return <div>No provider found</div>;

  // -------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-teal-600 mb-6 transition-colors"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to search
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-teal-100 shadow-lg">
              <CardContent className="p-6 flex flex-col md:flex-row gap-6">
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
                        {provider.specialty}
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
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center md:justify-start">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-teal-200 hover:bg-teal-50"
                      >
                        <HeartIcon className="h-4 w-4 text-teal-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-teal-200 hover:bg-teal-50"
                      >
                        <Share2Icon className="h-4 w-4 text-teal-600" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                    <MapPinIcon className="h-4 w-4 text-teal-600" />
                    <span>
                      {provider.city}, {provider.state}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start bg-white border border-teal-100">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* About */}
              <TabsContent value="about" className="mt-6">
                <Card className="border-teal-100 shadow-lg">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-teal-700">
                        About
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {provider.bio}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-teal-700">
                        Education & Credentials
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {provider.qualifications}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Services */}
              <TabsContent value="services" className="mt-6">
                <Card className="border-teal-100 shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold mb-4 text-teal-700">
                      Services Offered
                    </h3>
                    {provider?.servicesOffered
                      ?.split(",")
                      .map((service, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 border border-teal-100 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                          <h4 className="font-semibold mb-1">{service}</h4>
                          <p className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent">
                            ${provider.consultationFee}
                          </p>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews */}
              <TabsContent value="reviews" className="mt-6">
                <Card className="border-teal-100 shadow-lg">
                  <CardContent className="p-6 space-y-8">
                    <div className="border border-teal-100 rounded-lg p-6 bg-gradient-to-br from-teal-50 to-blue-50">
                      <h3 className="text-xl font-semibold text-teal-700 mb-4">
                        Submit Your Review
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none cursor-pointer"
                          >
                            <StarIcon
                              className={`h-6 w-6 ${
                                star <= rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              filled={star <= rating}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {rating ? `${rating} / 5` : "Select rating"}
                        </span>
                      </div>
                      <Textarea
                        placeholder="Share your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        className="mb-4"
                      />
                      <Button
                        onClick={handleSubmitReview}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 cursor-pointer"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                      {successMessage && (
                        <p className="text-green-600 mt-3 text-sm">
                          {successMessage}
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-teal-700 mb-4">
                        Recent Reviews
                      </h3>
                      {reviewsLoading ? (
                        <p>Loading reviews...</p>
                      ) : reviews.length > 0 ? (
                        <div className="space-y-4">
                          {reviews.map((review, index) => (
                            <div
                              key={index}
                              className="border border-teal-100 rounded-lg p-4 bg-white shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                      filled={i < review.rating}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(review.createdAt), "PPP")}
                                </span>
                              </div>
                              <p className="text-muted-foreground">
                                {review.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No reviews yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Booking / Contact */}
          <div className="space-y-6">
            <Card className="border-teal-100 shadow-lg sticky top-20">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <h3>Book Appointment</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    Consultation Fee
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    ${provider.consultationFee}
                  </p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 cursor-pointer">
                      Book Appointment
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-4 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                          Book an Appointment
                        </DialogTitle>
                        <DialogDescription className="text-white/80">
                          Choose a convenient date, time, and service to meet
                          with {provider?.name}.
                        </DialogDescription>
                      </DialogHeader>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Date */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          📅 Date
                        </label>
                        <div className="rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md"
                          />
                        </div>
                      </div>

                      {/* Time */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          ⏰ Time
                        </label>
                        <Select
                          value={selectedTime}
                          onValueChange={setSelectedTime}
                        >
                          <SelectTrigger className="rounded-lg border-gray-300 focus:ring-teal-500">
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "09:00 AM",
                              "10:00 AM",
                              "11:00 AM",
                              "12:00 PM",
                              "03:00 PM",
                              "05:00 PM",
                            ].map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Service */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          💼 Service
                        </label>
                        <Select
                          value={selectedService}
                          onValueChange={setSelectedService}
                        >
                          <SelectTrigger className="rounded-lg border-gray-300 focus:ring-teal-500">
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            {provider?.servicesOffered
                              ?.split(",")
                              .map((service, idx) => (
                                <SelectItem key={idx} value={service.trim()}>
                                  {service}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          📝 Notes
                        </label>
                        <Textarea
                          placeholder="Add any notes (optional)"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="rounded-lg border-gray-300 focus:ring-teal-500"
                        />
                      </div>

                      {/* Confirm Button */}
                      <div className="pt-4">
                        <Button
                          className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold hover:from-teal-600 hover:to-blue-600 transition-all cursor-pointer"
                          onClick={() =>
                            alert("Appointment booked successfully!")
                          }
                        >
                          Confirm Booking
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
                  onClick={handleSendMessage}
                >
                  Message Provider
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

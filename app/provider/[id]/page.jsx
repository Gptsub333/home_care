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

// ... (keep all your icon components - StarIcon, MapPinIcon, etc.)

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
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChevronLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MessageCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const HeartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const Share2Icon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const mockProvider = {
  id: 1,
  name: "Dr. Sarah Johnson",
  price: 150,
  services: [
    { name: "General Consultation", price: 150, duration: "30 min" },
    { name: "Comprehensive Physical", price: 250, duration: "60 min" },
    { name: "Follow-up Visit", price: 100, duration: "20 min" },
    { name: "Urgent Care", price: 200, duration: "45 min" },
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

  // Provider details state
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Booking state
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [notes, setNotes] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Review submission state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Reviews list state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsPagination, setReviewsPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch provider details
  const fetchProvider = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://home-care-backend.onrender.com/api/providers/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch provider");
      }

      const data = await res.json();
      setProvider(data);
    } catch (err) {
      setError("Failed to load provider details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    if (!id) return;

    setReviewsLoading(true);
    try {
      const res = await fetch(
        `https://home-care-backend.onrender.com/api/providers/${id}/reviews?page=${currentPage}&limit=5`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await res.json();
      setReviews(data.reviews);
      setReviewsPagination(data.pagination);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch provider on mount
  useEffect(() => {
    if (id) fetchProvider();
  }, [id]);

  // Fetch reviews when page changes
  useEffect(() => {
    fetchReviews();
  }, [id, currentPage]);

  // Submit review
  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) {
      alert("Please provide both rating and comment");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };

    const token = getCookie("token");

    if (!token) {
      alert("You must be logged in to submit a review. Please login first.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(
        `https://home-care-backend.onrender.com/api/providers/${id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      const result = await res.json();
      setSuccessMessage("Thank you! Your review has been submitted.");
      setRating(0);
      setComment("");

      // Refresh both provider data and reviews
      fetchProvider();
      setCurrentPage(1); // Reset to first page
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong while submitting your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBooking = () => {
    console.log("Booking:", {
      date,
      selectedTime,
      selectedService,
      notes,
    });
    setIsBookingOpen(false);
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
              <Link href="/" className="text-sm hover:text-teal-600 transition-colors">
                Home
              </Link>
              <Link href="/search" className="text-sm hover:text-teal-600 transition-colors">
                Find Care
              </Link>
              <Link href="/dashboard/patient" className="text-sm hover:text-teal-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-teal-200 hover:bg-teal-50 bg-transparent cursor-pointer"
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
            {/* Provider Header Card - Keep your existing code */}
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
                          {provider?.specialty}
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-5 w-5 text-yellow-400" filled />
                            <span className="font-semibold">{provider.rating}</span>
                            <span className="text-muted-foreground">
                              ({provider.totalReviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-center md:justify-start">
                        <Button variant="outline" size="icon" className="border-teal-200 hover:bg-teal-50 bg-transparent">
                          <HeartIcon className="h-4 w-4 text-teal-600" />
                        </Button>
                        <Button variant="outline" size="icon" className="border-teal-200 hover:bg-teal-50 bg-transparent">
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
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start bg-white border border-teal-100">
                <TabsTrigger
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
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* About Tab - Keep your existing code */}
              <TabsContent value="about" className="mt-6">
                <Card className="border-teal-100 shadow-lg">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-teal-700">About</h3>
                      <p className="text-muted-foreground leading-relaxed">{provider.bio}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-teal-700">
                        Education & Credentials
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">{provider.qualifications}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Services Tab - Keep your existing code */}
              <TabsContent value="services" className="mt-6">
                <Card className="border-teal-100 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-teal-700">Services Offered</h3>
                    <div className="space-y-4">
                      {provider?.servicesOffered?.split(",").map((service, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 border border-teal-100 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                          <div>
                            <h4 className="font-semibold mb-1">{service}</h4>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent">
                              ${provider.consultationFee}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab - UPDATED */}
              <TabsContent value="reviews" className="mt-6">
                <Card className="border-teal-100 shadow-lg">
                  <CardContent className="p-6 space-y-8">
                    {/* Submit Review Section */}
                    <div className="border border-teal-100 rounded-lg p-6 bg-gradient-to-br from-teal-50 to-blue-50">
                      <h3 className="text-xl font-semibold text-teal-700 mb-4">
                        Submit Your Review
                      </h3>

                      {/* Star Rating */}
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
                                star <= rating ? "text-yellow-400" : "text-gray-300"
                              }`}
                              filled={star <= rating}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {rating ? `${rating} / 5` : "Select rating"}
                        </span>
                      </div>

                      {/* Comment Box */}
                      <Textarea
                        placeholder="Share your experience with this provider..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        className="mb-4"
                      />

                      {/* Submit Button */}
                      <Button
                        onClick={handleSubmitReview}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 cursor-pointer"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>

                      {successMessage && (
                        <p className="text-green-600 mt-3 text-sm">{successMessage}</p>
                      )}
                    </div>

                    {/* Reviews List */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-teal-700">Patient Reviews</h3>
                        <div className="flex items-center gap-2">
                          <StarIcon className="h-5 w-5 text-yellow-400" filled />
                          <span className="text-2xl font-bold">{provider.rating}</span>
                          <span className="text-muted-foreground">
                            ({provider.totalReviews} reviews)
                          </span>
                        </div>
                      </div>

                      {reviewsLoading ? (
                        <div className="text-center py-8">Loading reviews...</div>
                      ) : reviews.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No reviews yet. Be the first to review!
                        </div>
                      ) : (
                        <>
                          <div className="space-y-6">
                            {reviews.map((review) => (
                              <div
                                key={review.id}
                                className="border-b border-teal-100 last:border-0 pb-6 last:pb-0"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    {review.patientImage ? (
                                      <img
                                        src={review.patientImage}
                                        alt={review.patient}
                                        className="w-10 h-10 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center font-semibold text-white">
                                        {review.patient.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-semibold">{review.patient}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {review.timeAgo}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                      <StarIcon
                                        key={i}
                                        className="h-4 w-4 text-yellow-400"
                                        filled
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                  {review.comment}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Pagination */}
                          {reviewsPagination && reviewsPagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="cursor-pointer"
                              >
                                Previous
                              </Button>
                              <span className="text-sm text-muted-foreground">
                                Page {currentPage} of {reviewsPagination.totalPages}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.min(reviewsPagination.totalPages, prev + 1)
                                  )
                                }
                                disabled={currentPage === reviewsPagination.totalPages}
                                className="cursor-pointer"
                              >
                                Next
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Keep your existing booking card */}
          <div className="space-y-6">
            <Card className="sticky top-24 border-teal-100 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Starting from</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent mb-1">
                    ${mockProvider.price}
                  </p>
                  <p className="text-sm text-muted-foreground">per visit</p>
                </div>

                {/* ... rest of your booking dialog and sidebar content ... */}
                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full mb-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 cursor-pointer"
                      size="lg"
                    >
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Book Appointment
                    </Button>
                  </DialogTrigger>
                  {/* ... rest of dialog content ... */}
                </Dialog>

                <Link href={`/messages/${mockProvider.id}`} className="block">
                  <Button
                    variant="outline"
                    className="w-full border-teal-200 hover:bg-teal-50 bg-transparent cursor-pointer"
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
                    <span className="text-muted-foreground">Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span className="text-muted-foreground">Free cancellation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    </div>
                    <span className="text-muted-foreground">Verified professional</span>
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
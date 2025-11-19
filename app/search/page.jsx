"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Star,
  Clock,
  DollarSign,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const specialties = [
  "Physical Therapist",
  "Family Medics",
  "Registered Nurse",
  "Pediatrician",
  "Occupational Therapist",
  "Dentist",
  "Psychiatry",
];
const allServices = [
  "Home Visit",
  "Consultation",
  "Follow-up",
  "IV Therapy",
  "Wound Care",
  "Medication",
  "Child Care",
  "Vaccination",
  "Skin Treatment",
  "Cosmetic",
  "Dental Checkup",
  "Therapy sessions",
];
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [minRating, setMinRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minExperience, setMinExperience] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const specialtyParam = searchParams.get("specialty") || "";
  const locationParam = searchParams.get("location") || "";

  // ✅ Fetch providers
  const fetchProviders = async ({ specialty, location, page = 1 }) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        specialty: specialty || "",
        location: location || "",
        page,
        limit: 9,
      }).toString();

      const res = await fetch(
        `${BACKEND_URL}/providers/search?${query}`
      );
      const data = await res.json();

      setProviders(data.providers || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching providers:", err);
    }
    setLoading(false);
  };

  // Fetch when URL params change
  useEffect(() => {
    fetchProviders({
      specialty: specialtyParam,
      location: locationParam,
      page,
    });
  }, [specialtyParam, locationParam, page]);

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchProviders({
        specialty: searchTerm,
        location: location,
        page: 1,
      });
    }, 600);
    return () => clearTimeout(delay);
  }, [searchTerm, location]);

  // Filtering logic
  useEffect(() => {
    let results = [...providers];

    if (searchTerm) {
      results = results.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (location) {
      results = results.filter((p) =>
        p.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (selectedSpecialties.length > 0) {
      results = results.filter((p) =>
        selectedSpecialties.includes(p.specialty)
      );
    }

    results = results.filter(
      (p) => p.charges >= priceRange[0] && p.charges <= priceRange[1]
    );

    if (minRating > 0) {
      results = results.filter((p) => (p.rating || 0) >= minRating);
    }

    if (availableOnly) {
      results = results.filter((p) => p.availableToday);
    }

    if (minExperience > 0) {
      results = results.filter(
        (p) => (p.yearsOfExperience || 0) >= minExperience
      );
    }

    if (selectedServices.length > 0) {
      results = results.filter((p) => {
        const serviceList =
          typeof p.services === "string"
            ? p.services.split(",").map((s) => s.trim())
            : [];
        return selectedServices.some((s) => serviceList.includes(s));
      });
    }

    // Sorting
    if (sortBy === "rating") {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "price-low") {
      results.sort((a, b) => a.charges - b.charges);
    } else if (sortBy === "price-high") {
      results.sort((a, b) => b.charges - a.charges);
    } else if (sortBy === "experience") {
      results.sort(
        (a, b) => (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0)
      );
    }

    setFilteredProviders(results);
  }, [
    providers,
    searchTerm,
    location,
    sortBy,
    selectedSpecialties,
    priceRange,
    minRating,
    availableOnly,
    minExperience,
    selectedServices,
  ]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setLocation("");
    setSelectedSpecialties([]);
    setPriceRange([0, 300]);
    setMinRating(0);
    setAvailableOnly(false);
    setMinExperience(0);
    setSelectedServices([]);
  };

  const toggleSpecialty = (specialty) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };
  console.log("filteredProviders---", providers);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold text-primary">
            MediLux
          </Link>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="experience">Most Experienced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside
          className={`${
            showFilters ? "block" : "hidden"
          } md:block w-full md:w-80 flex-shrink-0`}
        >
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Clear All
                </Button>
              </div>

              {/* Specialty Filter */}
              <div className="space-y-2 mb-6">
                <h3 className="font-medium mb-3">Specialty</h3>
                {specialties.map((s) => (
                  <div key={s} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSpecialties.includes(s)}
                      onCheckedChange={() => toggleSpecialty(s)}
                    />
                    <Label className="text-sm cursor-pointer">{s}</Label>
                  </div>
                ))}
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <Slider
                  min={0}
                  max={300}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between text-sm mt-2 text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Minimum Rating</h3>
                <Select
                  value={minRating.toString()}
                  onValueChange={(val) => setMinRating(Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="4.5">4.5+</SelectItem>
                    <SelectItem value="4.8">4.8+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Availability */}
              <div className="mb-6 flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={availableOnly}
                  onCheckedChange={setAvailableOnly}
                />
                <Label htmlFor="available" className="text-sm">
                  Available Today Only
                </Label>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Minimum Experience</h3>
                <Select
                  value={minExperience.toString()}
                  onValueChange={(val) => setMinExperience(Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="5">5+ years</SelectItem>
                    <SelectItem value="10">10+ years</SelectItem>
                    <SelectItem value="15">15+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Services */}
              <div>
                <h3 className="font-medium mb-3">Services</h3>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {allServices.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedServices.includes(service)}
                        onCheckedChange={() => toggleService(service)}
                      />
                      <Label className="text-sm cursor-pointer">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-serif font-bold mb-2">
              Healthcare Providers
            </h1>
            <p className="text-muted-foreground">
              {filteredProviders.length} providers found
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-center text-muted-foreground">Loading...</p>
          )}

          {/* Providers Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <Link key={provider.providerId} href={`/provider/${provider.providerId}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden">
                        <Image
                          src={provider.image || "/doctor-placeholder.png"}
                          alt={provider.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {provider.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {provider.specialty}
                        </p>
                        <div className="flex items-center gap-2 text-sm mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{provider.rating || 0}</span>
                          <span className="text-muted-foreground">
                            ({provider.totalReviews || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {provider.yearsOfExperience} years experience
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold">
                          ${provider.charges}
                        </span>
                        <span>per visit</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {provider.services?.split(",").map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {s.trim()}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      {provider.availableToday ? (
                        <Badge className="bg-green-500/10 text-green-700">
                          Available Today
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Not Available</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {filteredProviders.length > 0 && (
            <div className="flex justify-center mt-8 gap-4">
              <Button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                variant="outline"
                className="cursor-pointer"
              >
                Previous
              </Button>

              <span className="py-2 px-4 border rounded">
                Page {page} of {totalPages}
              </span>

              <Button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                variant="outline"
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          )}

          {!loading && filteredProviders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No providers found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4 cursor-pointer"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

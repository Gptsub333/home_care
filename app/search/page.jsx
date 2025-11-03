"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Star, Clock, DollarSign, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import Image from "next/image"

const mockProviders = [
  {
    id: 1,
    name: " Sarah Johnson",
    specialty: "General Physician",
    rating: 4.9,
    reviews: 234,
    experience: 15,
    price: 150,
    location: "Manhattan, NY",
    distance: "2.3 miles",
    available: true,
    image: "/professional-female-doctor.png",
    services: ["Home Visit", "Consultation", "Follow-up"],
  },
  {
    id: 2,
    name: " Michael Chen",
    specialty: "Family Medics",
    rating: 4.8,
    reviews: 189,
    experience: 12,
    price: 200,
    location: "Brooklyn, NY",
    distance: "3.1 miles",
    available: true,
    image: "/male-cardiologist.jpg",
    services: ["Heart Checkup", "ECG", "Consultation"],
  },
  {
    id: 3,
    name: "Emily Davis",
    specialty: "Registered Nurse",
    rating: 4.9,
    reviews: 312,
    experience: 8,
    price: 80,
    location: "Queens, NY",
    distance: "1.8 miles",
    available: false,
    image: "/professional-female-nurse.png",
    services: ["IV Therapy", "Wound Care", "Medication"],
  },
  {
    id: 4,
    name: "James Wilson",
    specialty: "Pediatrician",
    rating: 4.7,
    reviews: 156,
    experience: 10,
    price: 120,
    location: "Manhattan, NY",
    distance: "2.7 miles",
    available: true,
    image: "/male-pediatrician.png",
    services: ["Child Care", "Vaccination", "Consultation"],
  },
  {
    id: 5,
    name: "Lisa Anderson",
    specialty: "Dermatologist",
    rating: 4.9,
    reviews: 278,
    experience: 14,
    price: 180,
    location: "Manhattan, NY",
    distance: "1.5 miles",
    available: true,
    image: "/female-dermatologist.png",
    services: ["Skin Treatment", "Consultation", "Cosmetic"],
  },
  {
    id: 6,
    name: " Robert Martinez",
    specialty: "Dentist",
    rating: 4.8,
    reviews: 201,
    experience: 11,
    price: 140,
    location: "Bronx, NY",
    distance: "4.2 miles",
    available: true,
    image: "/male-dentist.png",
    services: ["Dental Checkup", "Cleaning", "Emergency"],
  },
]

const specialties = [
  "physical therapist ",
  "Family Medics",
  "Registered Nurse",
  "Pediatrician",
  "Occupational Theripist",
  "Dentist",
]
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
]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [filteredProviders, setFilteredProviders] = useState(mockProviders)
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [selectedSpecialties, setSelectedSpecialties] = useState([])
  const [priceRange, setPriceRange] = useState([0, 300])
  const [minRating, setMinRating] = useState(0)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [minExperience, setMinExperience] = useState(0)
  const [selectedServices, setSelectedServices] = useState([])

  useEffect(() => {
    let results = [...mockProviders]

    // Filter by search term
    if (searchTerm) {
      results = results.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by location
    if (location) {
      results = results.filter((provider) => provider.location.toLowerCase().includes(location.toLowerCase()))
    }

    if (selectedSpecialties.length > 0) {
      results = results.filter((provider) => selectedSpecialties.includes(provider.specialty))
    }

    results = results.filter((provider) => provider.price >= priceRange[0] && provider.price <= priceRange[1])

    if (minRating > 0) {
      results = results.filter((provider) => provider.rating >= minRating)
    }

    if (availableOnly) {
      results = results.filter((provider) => provider.available)
    }

    if (minExperience > 0) {
      results = results.filter((provider) => provider.experience >= minExperience)
    }

    if (selectedServices.length > 0) {
      results = results.filter((provider) => selectedServices.some((service) => provider.services.includes(service)))
    }

    // Sort results
    if (sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "price-low") {
      results.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      results.sort((a, b) => b.price - a.price)
    } else if (sortBy === "experience") {
      results.sort((a, b) => b.experience - a.experience)
    }

    setFilteredProviders(results)
  }, [
    searchTerm,
    location,
    sortBy,
    selectedSpecialties,
    priceRange,
    minRating,
    availableOnly,
    minExperience,
    selectedServices,
  ])

  const clearAllFilters = () => {
    setSearchTerm("")
    setLocation("")
    setSelectedSpecialties([])
    setPriceRange([0, 300])
    setMinRating(0)
    setAvailableOnly(false)
    setMinExperience(0)
    setSelectedServices([])
  }

  const toggleSpecialty = (specialty) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty],
    )
  }

  const toggleService = (service) => {
    setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-serif font-bold text-primary">
              MediLux
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/search" className="text-sm hover:text-primary transition-colors">
                Find Care
              </Link>
              <Link href="/dashboard/patient" className="text-sm hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
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
            <Button variant="outline" className="md:hidden bg-transparent" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-80 flex-shrink-0`}>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Specialty Filter */}
                  <div>
                    <h3 className="font-medium mb-3">Specialty</h3>
                    <div className="space-y-2">
                      {specialties.map((specialty) => (
                        <div key={specialty} className="flex items-center space-x-2">
                          <Checkbox
                            id={specialty}
                            checked={selectedSpecialties.includes(specialty)}
                            onCheckedChange={() => toggleSpecialty(specialty)}
                          />
                          <Label htmlFor={specialty} className="text-sm font-normal cursor-pointer">
                            {specialty}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h3 className="font-medium mb-3">Price Range</h3>
                    <div className="space-y-4">
                      <Slider
                        min={0}
                        max={300}
                        step={10}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h3 className="font-medium mb-3">Minimum Rating</h3>
                    <Select value={minRating.toString()} onValueChange={(val) => setMinRating(Number(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any rating</SelectItem>
                        <SelectItem value="4">4+ stars</SelectItem>
                        <SelectItem value="4.5">4.5+ stars</SelectItem>
                        <SelectItem value="4.8">4.8+ stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="available" checked={availableOnly} onCheckedChange={setAvailableOnly} />
                      <Label htmlFor="available" className="text-sm font-medium cursor-pointer">
                        Available Today Only
                      </Label>
                    </div>
                  </div>

                  {/* Experience Filter */}
                  <div>
                    <h3 className="font-medium mb-3">Minimum Experience</h3>
                    <Select value={minExperience.toString()} onValueChange={(val) => setMinExperience(Number(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any experience</SelectItem>
                        <SelectItem value="5">5+ years</SelectItem>
                        <SelectItem value="10">10+ years</SelectItem>
                        <SelectItem value="15">15+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Services Filter */}
                  <div>
                    <h3 className="font-medium mb-3">Services</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {allServices.map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={service}
                            checked={selectedServices.includes(service)}
                            onCheckedChange={() => toggleService(service)}
                          />
                          <Label htmlFor={service} className="text-sm font-normal cursor-pointer">
                            {service}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-serif font-bold mb-2">Healthcare Providers</h1>
              <p className="text-muted-foreground">{filteredProviders.length} providers found</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <Link key={provider.id} href={`/provider/${provider.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={provider.image || "/placeholder.svg"}
                            alt={provider.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 truncate">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{provider.specialty}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{provider.rating}</span>
                            </div>
                            <span className="text-muted-foreground">({provider.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{provider.experience} years experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {provider.location} • {provider.distance}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">${provider.price}</span>
                          <span className="text-muted-foreground">per visit</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {provider.services.slice(0, 3).map((service, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        {provider.available ? (
                          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
                            Available Today
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Next Available: Tomorrow</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredProviders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No providers found matching your criteria</p>
                <Button variant="outline" className="mt-4 bg-transparent" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

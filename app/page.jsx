'use client';

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AutocompleteInput } from "@/components/autocomplete-input"
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";


export default function HomePage() {
  const [specialty, setSpecialty] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [token, setToken] = React.useState(null);
  const [role, setRole] = React.useState(null);
  const router = useRouter();

  const providerTypes = [
    'Physical Therapist',
    'Registered Nurse',
    'Family Medic',
    'Pediatrician',
    'Occupational Therapist',
    'Dentist',
  ];

  const californiaCities = [
    'Los Angeles',
    'San Francisco',
    'San Diego',
    'San Jose',
    'Sacramento',
    'Fresno',
    'Long Beach',
    'Oakland',
    'Bakersfield',
    'Anaheim',
    'Santa Ana',
    'Riverside',
    'Stockton',
    'Irvine',
    'Fremont',
  ];

  const categories = [
    { name: 'Physical Therapist', icon: '💪', count: '80+ Therapists' },
    { name: 'Registered Nurse', icon: '👨‍⚕️', count: '200+ Nurses' },
    { name: 'Family Medic', icon: '🩺', count: '120+ Medics' },
    { name: 'Pediatrician', icon: '👶', count: '90+ Specialists' },
    { name: 'Occupational Therapist', icon: '🧠', count: '65+ Therapists' },
    { name: 'Dentist', icon: '🦷', count: '60+ Dentists' },
  ];

  const featuredProviders = [
    {
      id: 1,
      name: 'Emily Roberts',
      specialty: 'Registered Nurse',
      rating: 5.0,
      reviews: 312,
      experience: '8 years',
      price: '$80',
      image: '/professional-female-nurse.png',
    },
    {
      id: 2,
      name: 'James Wilson',
      specialty: 'Pediatrician',
      rating: 4.9,
      reviews: 234,
      experience: '15 years',
      price: '$150',
      image: '/male-pediatrician.png',
    },
    {
      id: 3,
      name: 'Robert Martinez',
      specialty: 'Dentist',
      rating: 4.8,
      reviews: 189,
      experience: '12 years',
      price: '$140',
      image: '/male-dentist.png',
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (specialty) params.set('specialty', specialty);
    if (location) params.set('location', location);
    window.location.href = `/search?${params.toString()}`;
  };
  const handleLogout = async () => {
    const res = await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      alert('Logged out successfully');
      router.push('/login');
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setToken(token);
    }
    if (role) {
      setRole(role);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-gradient-to-r from-primary/5 via-card to-secondary/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span className="text-2xl font-serif font-bold text-foreground">MediLux</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/search" className="text-muted-foreground hover:text-primary transition-colors">
              Find Care
            </Link>
            <Link href="/messages" className="text-muted-foreground hover:text-primary transition-colors">
              Messages
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <LogoutButton />
          </nav>

          <div className="flex items-center gap-3">
            {token ? (
              <Link href={`${role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient'}`}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-accent py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-medical-pattern.png')] opacity-5 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-secondary/90 to-accent/95"></div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 text-balance leading-tight">
              Healthcare at Your Doorstep
            </h1>
            <p className="text-lg md:text-xl text-white/95 mb-8 text-pretty max-w-2xl mx-auto">
              Connect with verified healthcare professionals for premium in-home care
            </p>

            <Card className="max-w-3xl mx-auto shadow-2xl border-white/20 bg-white/95 backdrop-blur">
              <CardContent className="p-4 md:p-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                  <AutocompleteInput
                    name="specialty"
                    placeholder="Select provider type..."
                    options={providerTypes}
                    value={specialty}
                    onChange={setSpecialty}
                    icon={
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    }
                  />
                  <AutocompleteInput
                    name="location"
                    placeholder="Select city..."
                    options={californiaCities}
                    value={location}
                    onChange={setLocation}
                    icon={
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    }
                  />
                  <Button
                    type="submit"
                    className="h-12 px-8 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg w-full md:w-auto font-semibold"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-8 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>500+ Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>24/7 Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gradient-to-b from-background via-accent/5 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-foreground">
            Browse by Specialty
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link href={`/search?specialty=${encodeURIComponent(category.name)}`} key={index}>
                <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-primary/50 bg-gradient-to-br from-card to-primary/5">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-card-foreground mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-16 bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Top Rated Professionals</h2>
            <Link href="/search">
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                View All
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProviders.map((provider) => (
              <Link href={`/provider/${provider.id}`} key={provider.id}>
                <Card className="hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer overflow-hidden border-border bg-card">
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <img
                      src={provider.image || '/placeholder.svg'}
                      alt={provider.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-card-foreground">{provider.name}</h3>
                        <p className="text-muted-foreground text-sm">{provider.specialty}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
                        <svg className="w-4 h-4 fill-primary text-primary" viewBox="0 0 24 24">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span className="font-semibold text-sm text-primary">{provider.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{provider.experience}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span>{provider.reviews} reviews</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-lg font-semibold text-primary">{provider.price}/visit</span>
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-b from-primary/5 via-accent/10 to-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-foreground">
            Why Choose MediLux
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-primary/20 bg-gradient-to-br from-card to-primary/5 hover:shadow-xl transition-all hover:scale-105">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Verified Professionals</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All healthcare providers are thoroughly vetted and licensed professionals with verified credentials.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-secondary/20 bg-gradient-to-br from-card to-secondary/5 hover:shadow-xl transition-all hover:scale-105">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/70 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">24/7 Availability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Book appointments anytime, anywhere. Healthcare professionals available around the clock.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-accent/20 bg-gradient-to-br from-card to-accent/5 hover:shadow-xl transition-all hover:scale-105">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Premium Care</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Experience luxury healthcare with personalized attention in the comfort of your home.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-primary via-secondary to-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="text-xl font-serif font-bold">MediLux</span>
              </div>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                Premium healthcare delivered to your doorstep with verified healthcare professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Patients</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>
                  <Link href="/search" className="hover:text-primary-foreground">
                    Find a Provider
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-primary-foreground">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-primary-foreground">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Professionals</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>
                  <Link href="/doctor/register" className="hover:text-primary-foreground">
                    Join as Provider
                  </Link>
                </li>
                <li>
                  <Link href="/doctor/login" className="hover:text-primary-foreground">
                    Provider Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>
                  <Link href="/about" className="hover:text-primary-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/80">
            <p>&copy; 2025 MediLux. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

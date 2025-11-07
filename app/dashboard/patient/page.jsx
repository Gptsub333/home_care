"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Heart,
  FileText,
  MessageCircle,
  Settings,
  LogOut,
  Home,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"

const mockAppointments = [
  {
    id: 1,
    provider: "Dr. Sarah Johnson",
    specialty: "General Physician",
    date: "2024-01-25",
    time: "10:00 AM",
    status: "upcoming",
    image: "/professional-female-doctor.png",
    location: "Home Visit - 123 Main St",
  },
  {
    id: 2,
    provider: "Dr. Michael Chen",
    specialty: "Cardiologist",
    date: "2024-01-28",
    time: "2:00 PM",
    status: "upcoming",
    image: "/male-cardiologist.jpg",
    location: "Home Visit - 123 Main St",
  },
]

const mockPastAppointments = [
  {
    id: 3,
    provider: "Nurse Emily Davis",
    specialty: "Registered Nurse",
    date: "2024-01-15",
    time: "3:00 PM",
    status: "completed",
    image: "/professional-female-nurse.png",
    location: "Home Visit - 123 Main St",
  },
]

const mockFavorites = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "General Physician",
    rating: 4.9,
    image: "/professional-female-doctor.png",
  },
  {
    id: 2,
    name: "Dr. Lisa Anderson",
    specialty: "Dermatologist",
    rating: 4.9,
    image: "/female-dermatologist.png",
  },
]

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const handleLogout = async () => {
    // await fetch(`${NEXT_PUBLIC_SERVER_URL}/auth/logout`, {
    //   method: 'POST',
    //   credentials: 'include',
    // });
    const role = localStorage.getItem('role');

    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // if you store token separately
    localStorage.removeItem('role');

    // Clear cookie
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';

    // Redirect to login
    if (role === 'doctor') {
      window.location.href = '/doctor/login';
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card min-h-screen p-6 hidden lg:block">
          <Link href="/" className="text-2xl font-serif font-bold text-primary mb-8 block">
            MediLux
          </Link>
          <nav className="space-y-2">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('overview')}
            >
              <Home className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === 'appointments' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('appointments')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
            </Button>
            <Button
              variant={activeTab === 'favorites' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('favorites')}
            >
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </Button>
            <Button
              variant={activeTab === 'records' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('records')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Medical Records
            </Button>
            <Button
              variant={activeTab === 'messages' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('messages')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </nav>
          <div className="mt-auto pt-6 border-t">
            <Link href="/search">
              <Button variant="outline" className="w-full mb-2 bg-transparent">
                <Search className="h-4 w-4 mr-2" />
                Find Providers
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-muted-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Patient Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, John</p>
              </div>
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Upcoming</p>
                          <p className="text-3xl font-bold">2</p>
                        </div>
                        <Calendar className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Completed</p>
                          <p className="text-3xl font-bold">12</p>
                        </div>
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Favorites</p>
                          <p className="text-3xl font-bold">5</p>
                        </div>
                        <Heart className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Upcoming Appointments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockAppointments.map((apt) => (
                      <div key={apt.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={apt.image || '/placeholder.svg'}
                            alt={apt.provider}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{apt.provider}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{apt.specialty}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {apt.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {apt.time}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <Tabs defaultValue="upcoming">
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upcoming" className="mt-6 space-y-4">
                    {mockAppointments.map((apt) => (
                      <Card key={apt.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={apt.image || '/placeholder.svg'}
                                alt={apt.provider}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-1">{apt.provider}</h3>
                              <p className="text-muted-foreground mb-3">{apt.specialty}</p>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {apt.date}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  {apt.time}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  {apt.location}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button>View Details</Button>
                              <Button variant="outline">Message</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  <TabsContent value="past" className="mt-6 space-y-4">
                    {mockPastAppointments.map((apt) => (
                      <Card key={apt.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={apt.image || '/placeholder.svg'}
                                alt={apt.provider}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-1">{apt.provider}</h3>
                              <p className="text-muted-foreground mb-3">{apt.specialty}</p>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {apt.date}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  {apt.time}
                                </span>
                                <Badge variant="secondary">Completed</Badge>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button>Leave Review</Button>
                              <Button variant="outline">Book Again</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Favorite Providers</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    {mockFavorites.map((fav) => (
                      <div key={fav.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <Image src={fav.image || '/placeholder.svg'} alt={fav.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{fav.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{fav.specialty}</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{fav.rating}</span>
                          </div>
                        </div>
                        <Button size="sm">Book</Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Medical Records Tab */}
            {activeTab === 'records' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">Your medical records will appear here</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">No messages yet</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name</label>
                      <input type="text" defaultValue="John Doe" className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Address</label>
                      <input
                        type="text"
                        defaultValue="123 Main St, New York, NY 10001"
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

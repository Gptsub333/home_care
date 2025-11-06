'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  Users,
  TrendingUp,
  MessageCircle,
  Settings,
  LogOut,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

const mockTodayAppointments = [
  {
    id: 1,
    patient: 'John Doe',
    service: 'General Consultation',
    time: '10:00 AM',
    status: 'confirmed',
    address: '123 Main St, Manhattan',
  },
  {
    id: 2,
    patient: 'Maria Smith',
    service: 'Follow-up Visit',
    time: '2:00 PM',
    status: 'confirmed',
    address: '456 Park Ave, Brooklyn',
  },
];

const mockUpcomingAppointments = [
  {
    id: 3,
    patient: 'David Lee',
    service: 'Comprehensive Physical',
    date: '2024-01-26',
    time: '11:00 AM',
    status: 'pending',
  },
  {
    id: 4,
    patient: 'Sarah Johnson',
    service: 'Urgent Care',
    date: '2024-01-27',
    time: '3:00 PM',
    status: 'confirmed',
  },
];

const mockReviews = [
  {
    id: 1,
    patient: 'John D.',
    rating: 5,
    date: '2 days ago',
    comment: 'Excellent service! Very professional and caring.',
  },
  {
    id: 2,
    patient: 'Maria S.',
    rating: 5,
    date: '1 week ago',
    comment: 'Great experience. Highly recommend!',
  },
];

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

    const handleLogout = () => {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // if you store token separately
      localStorage.removeItem('role');
      // Redirect to login
      window.location.href = '/doctor/login';
      // Clear cookie
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
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
                variant={activeTab === 'earnings' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('earnings')}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Earnings
              </Button>
              <Button
                variant={activeTab === 'reviews' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('reviews')}
              >
                <Star className="h-4 w-4 mr-2" />
                Reviews
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
                  <h1 className="text-3xl font-serif font-bold mb-2">Doctor Dashboard</h1>
                  <p className="text-muted-foreground">Welcome back, Dr. Johnson</p>
                </div>
                <Link href="/profile">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/professional-female-doctor.png" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                </Link>
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid md:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Today</p>
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
                            <p className="text-sm text-muted-foreground mb-1">This Month</p>
                            <p className="text-3xl font-bold">45</p>
                          </div>
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Earnings</p>
                            <p className="text-3xl font-bold">$6.8K</p>
                          </div>
                          <DollarSign className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Rating</p>
                            <p className="text-3xl font-bold">4.9</p>
                          </div>
                          <Star className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Today's Schedule */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Today's Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockTodayAppointments.map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                              {apt.patient
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">{apt.patient}</h4>
                              <p className="text-sm text-muted-foreground">{apt.service}</p>
                              <p className="text-xs text-muted-foreground mt-1">{apt.address}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold mb-2">{apt.time}</p>
                            <Badge className="bg-green-500/10 text-green-700">{apt.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Recent Reviews */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockReviews.map((review) => (
                        <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary text-sm">
                                {review.patient.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{review.patient}</p>
                                <p className="text-xs text-muted-foreground">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockUpcomingAppointments.map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                              {apt.patient
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">{apt.patient}</h4>
                              <p className="text-sm text-muted-foreground">{apt.service}</p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
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
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm">Accept</Button>
                            <Button size="sm" variant="outline">
                              Decline
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Earnings Tab */}
              {activeTab === 'earnings' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-2">This Week</p>
                        <p className="text-3xl font-bold mb-1">$1,850</p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          +12% from last week
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-2">This Month</p>
                        <p className="text-3xl font-bold mb-1">$6,800</p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          +8% from last month
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-2">Total Earnings</p>
                        <p className="text-3xl font-bold mb-1">$42,500</p>
                        <p className="text-sm text-muted-foreground">All time</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Patient Reviews</CardTitle>
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-2xl font-bold">4.9</span>
                          <span className="text-muted-foreground">(234 reviews)</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {mockReviews.map((review) => (
                        <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                                {review.patient.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold">{review.patient}</p>
                                <p className="text-sm text-muted-foreground">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
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
                        <input
                          type="text"
                          defaultValue="Dr. Sarah Johnson"
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Specialty</label>
                        <input
                          type="text"
                          defaultValue="General Physician"
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email</label>
                        <input
                          type="email"
                          defaultValue="sarah.johnson@medilux.com"
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Phone</label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 987-6543"
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Availability Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">Manage your availability and working hours</p>
                      <Button variant="outline">Manage Schedule</Button>
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

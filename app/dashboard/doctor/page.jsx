'use client';

import React from 'react';
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
  // Avatar,
  // AvatarFallback,
  // AvatarImage,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
export default function CompleteSettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [userData, setUserData] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('overview');
  const [formData, setFormData] = React.useState({
    // User fields
    name: '',
    email: '',
    phone: '',
    address: '',

    // Provider fields
    specialty: '',
    licenseId: '',
    npiNumber: '',
    credentials: '',
    county: '',
    city: '',
    state: '',
    zipCode: '',
    yearsOfExperience: '',
    qualifications: '',
    bio: '',
    servicesOffered: '',
    consultationFee: '',
    practiceAddress: '',
    isAvailableToday: false,
    profileImage: '',
    profileImageKey: '',
  });
  const [imageUpload, setImageUpload] = React.useState({
    loading: false,
    preview: null,
    error: null,
  });

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Get user from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        window.location.href = '/login';
        return;
      }

      const user = JSON.parse(storedUser);
      // const userId = user.id;

      // // Fetch complete provider data
      // const response = await fetch(`https://home-care-backend.onrender.com/api/providers/${userId}`);
      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error('Failed to fetch user data');
      // }
      const data = user;
      setUserData(data);

      // Populate form with existing data
      setFormData({
        // User fields
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',

        // Provider fields
        specialty: data.provider?.specialty || '',
        licenseId: data.provider?.licenseId || '',
        npiNumber: data.provider?.npiNumber || '',
        credentials: data.provider?.credentials || '',
        county: data.provider?.county || '',
        city: data.provider?.city || '',
        state: data.provider?.state || '',
        zipCode: data.provider?.zipCode || '',
        yearsOfExperience: data.provider?.yearsOfExperience || '',
        qualifications: data.provider?.qualifications || '',
        bio: data.provider?.bio || '',
        servicesOffered: data.provider?.servicesOffered || '',
        consultationFee: data.provider?.consultationFee || '',
        practiceAddress: data.provider?.practiceAddress || '',
        isAvailableToday: data.provider?.isAvailableToday || false,
        profileImage: data.provider?.profileImage || '',
        profileImageKey: data.provider?.profileImageKey || '',
      });

      if (data.provider?.profileImage) {
        setImageUpload((prev) => ({ ...prev, preview: data.provider.profileImage }));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Failed to load user data');
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageUpload((prev) => ({ ...prev, error: 'Please select a valid image file' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageUpload((prev) => ({ ...prev, error: 'Image size should be less than 5MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUpload((prev) => ({ ...prev, preview: reader.result }));
    };
    reader.readAsDataURL(file);

    setImageUpload((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await fetch('https://home-care-backend.onrender.com/api/upload/image', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Image upload failed');
      }

      console.log(data);
      if (data.data.url && data.data.key) {
        setFormData((prev) => ({
          ...prev,
          profileImage: data.data.url,
          profileImageKey: data.data.key,
        }));
        setImageUpload((prev) => ({
          ...prev,
          loading: false,
          error: null,
        }));
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setImageUpload((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to upload image',
        preview: formData.profileImage || null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const userId = userData.id;

      // Update user data
      const response = await fetch(`https://home-care-backend.onrender.com/api/providers/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update localStorage
      const updatedUser = { ...userData, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert('Profile updated successfully!');
      setSaving(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
      setSaving(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-teal-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 p-4 py-8">
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
                <p className="text-muted-foreground">Welcome back, {formData.name}</p>
              </div>
              <Link href="/profile">
                {/* <Avatar className="h-12 w-12">
                  <AvatarImage src="/professional-female-doctor.png" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar> */}
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
              // <div className="space-y-6">
              //   <Card>
              //     <CardHeader>
              //       <CardTitle>Upcoming Appointments</CardTitle>
              //     </CardHeader>
              //     <CardContent className="space-y-4">
              //       {mockUpcomingAppointments.map((apt) => (
              //         <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg">
              //           <div className="flex items-center gap-4">
              //             <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
              //               {apt.patient
              //                 .split(' ')
              //                 .map((n) => n[0])
              //                 .join('')}
              //             </div>
              //             <div>
              //               <h4 className="font-semibold mb-1">{apt.patient}</h4>
              //               <p className="text-sm text-muted-foreground">{apt.service}</p>
              //               <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              //                 <span className="flex items-center gap-1">
              //                   <Calendar className="h-3 w-3" />
              //                   {apt.date}
              //                 </span>
              //                 <span className="flex items-center gap-1">
              //                   <Clock className="h-3 w-3" />
              //                   {apt.time}
              //                 </span>
              //               </div>
              //             </div>
              //           </div>
              //           <div className="flex gap-2">
              //             <Button size="sm">Accept</Button>
              //             <Button size="sm" variant="outline">
              //               Decline
              //             </Button>
              //           </div>
              //         </div>
              //       ))}
              //     </CardContent>
              //   </Card>
              // </div>
              <Appointments role="doctor" />
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
                {/* Profile Image */}
                <Card className="shadow-xl border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Profile Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-teal-100 bg-gray-100">
                        {imageUpload.preview ? (
                          <img src={imageUpload.preview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-12 h-12 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        )}

                        {imageUpload.loading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="w-full max-w-xs">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>{imageUpload.loading ? 'Uploading...' : 'Change Profile Image'}</span>
                          </div>
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={imageUpload.loading}
                        />
                      </div>

                      {imageUpload.error && <p className="text-red-600 text-sm">{imageUpload.error}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card className="shadow-xl border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="h-12"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Information */}
                <Card className="shadow-xl border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Professional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialty">Specialty *</Label>
                        <Input
                          id="specialty"
                          value={formData.specialty}
                          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="credentials">Credentials *</Label>
                        <Input
                          id="credentials"
                          value={formData.credentials}
                          onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                          className="h-12"
                          placeholder="e.g., MD, PhD"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="licenseId">License ID *</Label>
                        <Input
                          id="licenseId"
                          value={formData.licenseId}
                          onChange={(e) => setFormData({ ...formData, licenseId: e.target.value })}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="npiNumber">NPI Number *</Label>
                        <Input
                          id="npiNumber"
                          value={formData.npiNumber}
                          onChange={(e) => setFormData({ ...formData, npiNumber: e.target.value })}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                        <Input
                          id="yearsOfExperience"
                          type="number"
                          value={formData.yearsOfExperience}
                          onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="consultationFee">Consultation Fee ($) *</Label>
                        <Input
                          id="consultationFee"
                          type="number"
                          value={formData.consultationFee}
                          onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qualifications">Qualifications *</Label>
                      <Textarea
                        id="qualifications"
                        value={formData.qualifications}
                        onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="resize-none"
                        placeholder="Tell patients about yourself..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="servicesOffered">Services Offered</Label>
                      <Textarea
                        id="servicesOffered"
                        value={formData.servicesOffered}
                        onChange={(e) => setFormData({ ...formData, servicesOffered: e.target.value })}
                        rows={3}
                        className="resize-none"
                        placeholder="List your services..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Location Information */}
                <Card className="shadow-xl border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Location Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="practiceAddress">Practice Address *</Label>
                      <Input
                        id="practiceAddress"
                        value={formData.practiceAddress}
                        onChange={(e) => setFormData({ ...formData, practiceAddress: e.target.value })}
                        className="h-12"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="county">County *</Label>
                        <Input
                          id="county"
                          value={formData.county}
                          onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          className="h-12"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Availability */}
                <Card>
                  <CardHeader>
                    <CardTitle>Availability Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Manage your availability and working hours</p>
                    <Button variant="outline">Manage Schedule</Button>
                  </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex-1 h-12 bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => (window.location.href = '/')}
                    className="h-12 px-8"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
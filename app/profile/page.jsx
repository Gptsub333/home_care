'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React from 'react';

export default function ProfileDetailPage() {
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      // Get user data from localStorage
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        // No user data found, redirect to login
        window.location.href = '/login';
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      window.location.href = '/login';
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // if you store token separately

    // Redirect to login
    window.location.href = '/login';
    // Clear cookie
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
  };

  const navigateHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 p-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={navigateHome}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </button>

          <Button onClick={handleLogout} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card className="shadow-xl border-gray-200 bg-white mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={userData?.provider?.profileImage || 'https://via.placeholder.com/150'}
                  alt={userData?.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-teal-100"
                />
                {userData?.provider?.isVerified && (
                  <div className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-3xl font-serif font-bold text-gray-900">{userData?.name}</h1>
                  <Badge className="bg-gradient-to-r from-teal-500 to-blue-500 text-white w-fit mx-auto md:mx-0">
                    {userData?.role}
                  </Badge>
                </div>

                {userData?.provider && (
                  <div className="space-y-2 mb-4">
                    <p className="text-xl text-teal-600 font-medium">{userData.provider.specialty}</p>
                    <p className="text-gray-600">{userData.provider.credentials}</p>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {userData.provider.rating} ({userData.provider.totalReviews} reviews)
                      </span>
                      <span>•</span>
                      <span>{userData.provider.yearsOfExperience} years experience</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {userData?.provider?.isAvailableToday && (
                    <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                      Available Today
                    </Badge>
                  )}
                  {userData?.provider?.isVerified && (
                    <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                      Verified Provider
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card className="shadow-xl border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{userData?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{userData?.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-900">{userData?.address || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          {userData?.provider && (
            <Card className="shadow-xl border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">License ID</p>
                    <p className="text-gray-900 font-medium">{userData.provider.licenseId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">NPI Number</p>
                    <p className="text-gray-900 font-medium">{userData.provider.npiNumber}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Consultation Fee</p>
                  <p className="text-gray-900 text-2xl font-bold text-teal-600">${userData.provider.consultationFee}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">County</p>
                  <p className="text-gray-900">{userData.provider.county}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900">
                    {userData.provider.city}, {userData.provider.state} {userData.provider.zipCode}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* About & Qualifications */}
          {userData?.provider && (
            <Card className="shadow-xl border-gray-200 bg-white md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  About & Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Bio</p>
                  <p className="text-gray-900 leading-relaxed">{userData.provider.bio}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Qualifications</p>
                  <p className="text-gray-900">{userData.provider.qualifications}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Services Offered</p>
                  <p className="text-gray-900">{userData.provider.servicesOffered}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Practice Address</p>
                  <p className="text-gray-900">{userData.provider.practiceAddress}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 text-center">
          <Button className="bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 px-8">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

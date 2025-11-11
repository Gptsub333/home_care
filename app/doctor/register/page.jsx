'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function DoctorRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Professional Info
    specialty: '',
    licenseId: '',
    npiNumber: '',
    credentials: '',
    county: '',
    yearsOfExperience: '',
    qualifications: '',
    // Additional Info
    bio: '',
    servicesOffered: '',
    consultationFee: '',
    address: '',
    profileImage: '',
    profileImageKey: '',
  });
  const [imageUpload, setImageUpload] = useState({
    loading: false,
    preview: null,
    error: null,
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setImageUpload((prev) => ({ ...prev, error: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageUpload((prev) => ({ ...prev, error: 'Image size should be less than 5MB' }));
      return;
    }

    // Set preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUpload((prev) => ({ ...prev, preview: reader.result }));
    };
    reader.readAsDataURL(file);

    // Upload to server
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
      // Check if we got the required data
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
        preview: null,
      }));
      setFormData((prev) => ({
        ...prev,
        profileImage: '',
        profileImageKey: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (step < 3) {
      if (step === 1 && !formData.profileImage) {
        setImageUpload((prev) => ({
          ...prev,
          error: 'Please upload a profile image before proceeding',
        }));
        return;
      }
      setStep(step + 1);
    } else {
      try {
        if (!formData.profileImage || !formData.profileImageKey) {
          setImageUpload((prev) => ({
            ...prev,
            error: 'Please select and upload an image before submitting',
          }));
          return;
        }
        const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/register/provider`, formData);
        if (res.status === 201) {
          router.push('/doctor/login');
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
      }finally {  
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to home</span>
        </Link>

        <Card className="shadow-xl border-gray-200 bg-white">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-3xl font-serif text-gray-900">Provider Registration</CardTitle>
            <CardDescription className="text-gray-600">
              Join our network of verified healthcare professionals
            </CardDescription>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= s ? 'bg-gradient-to-br from-blue-500 to-teal-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && <div className={`w-12 h-1 ${step > s ? 'bg-teal-500' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2 px-4">
              <span>Personal</span>
              <span>Professional</span>
              <span>Details</span>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Image Upload Section */}
                  <div className="space-y-2">
                    <Label className="text-gray-900">Profile Image *</Label>
                    <div className="flex flex-col items-center gap-4">
                      {/* Image Preview or Placeholder */}
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-teal-100 bg-gray-100">
                        {imageUpload.preview ? (
                          <img src={imageUpload.preview} alt="Preview" className="w-full h-full object-cover" />
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

                        {/* Loading Overlay */}
                        {imageUpload.loading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>

                      {/* Upload Button */}
                      <div className="w-full">
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
                            <span>{imageUpload.loading ? 'Uploading...' : 'Choose Profile Image'}</span>
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

                      {/* Success Message */}
                      {formData.profileImage && !imageUpload.error && (
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Image uploaded successfully</span>
                        </div>
                      )}

                      {/* Error Message */}
                      {imageUpload.error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{imageUpload.error}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-900">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
                      <Input
                        id="name"
                        type="text"
                        placeholder="Dr. John Smith"
                        className="pl-10 h-12 bg-white border-gray-300"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Professional Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-900">
                      Professional Email *
                    </Label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <Input
                        id="email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        className="pl-10 h-12 bg-white border-gray-300"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-900">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="h-12 bg-white border-gray-300"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  {/* Password Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-900">
                        Password *
                      </Label>
                      <div className="relative">
                        <svg
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-12 bg-white border-gray-300"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-900">
                        Confirm Password *
                      </Label>
                      <div className="relative">
                        <svg
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-12 bg-white border-gray-300"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Step 2: Professional Credentials */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="text-gray-900">
                      Medical Specialty *
                    </Label>
                    <Input
                      id="specialty"
                      type="text"
                      placeholder="e.g., Cardiologist, General Physician, Dentist"
                      className="h-12 bg-white border-gray-300"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseId" className="text-gray-900">
                      Medical License ID *
                    </Label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <Input
                        id="licenseId"
                        type="text"
                        placeholder="Enter your medical license number"
                        className="pl-10 h-12 bg-white border-gray-300"
                        value={formData.licenseId}
                        onChange={(e) => setFormData({ ...formData, licenseId: e.target.value })}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">This will be verified by our team</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="npiNumber" className="text-gray-900">
                      NPI Number *
                    </Label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                      <Input
                        id="npiNumber"
                        type="text"
                        placeholder="Enter your National Provider Identifier"
                        className="pl-10 h-12 bg-white border-gray-300"
                        value={formData.npiNumber}
                        onChange={(e) => setFormData({ ...formData, npiNumber: e.target.value })}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">10-digit National Provider Identifier number</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credentials" className="text-gray-900">
                      Credentials *
                    </Label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 01-2.827 0l-4.244-4.243a8 8 0 11-11.314 0z"
                        />
                      </svg>
                      <Input
                        id="credentials"
                        type="text"
                        placeholder="e.g., RN, LNP, MD, DO, PA"
                        className="pl-10 h-12 bg-white border-gray-300"
                        value={formData.credentials}
                        onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">Professional credentials (e.g., RN, LNP, MD, etc.)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="county" className="text-gray-900">
                      County *
                    </Label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
                      <Input
                        id="county"
                        type="text"
                        placeholder="e.g., Jefferson, (Illinois)"
                        className="pl-10 h-12 bg-white border-gray-300"
                        value={formData.county}
                        onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">County and state where you practice</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience" className="text-gray-900">
                      Years of Experience *
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      placeholder="e.g., 10"
                      className="h-12 bg-white border-gray-300"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                      required
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualifications" className="text-gray-900">
                      Qualifications & Certifications *
                    </Label>
                    <Textarea
                      id="qualifications"
                      placeholder="e.g., MBBS, MD (Cardiology), Board Certified"
                      className="min-h-24 bg-white border-gray-300"
                      value={formData.qualifications}
                      onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Additional Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-900">
                      Professional Bio
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell patients about yourself, your approach to care, and what makes you unique..."
                      className="min-h-32 bg-white border-gray-300"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="servicesOffered" className="text-gray-900">
                      Services Offered *
                    </Label>
                    <Textarea
                      id="servicesOffered"
                      placeholder="e.g., General Consultation, Home Visits, Emergency Care, Follow-up Consultations"
                      className="min-h-24 bg-white border-gray-300"
                      value={formData.servicesOffered}
                      onChange={(e) => setFormData({ ...formData, servicesOffered: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="consultationFee" className="text-gray-900">
                        Consultation Fee (USD) *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <Input
                          id="consultationFee"
                          type="number"
                          placeholder="150"
                          className="pl-8 h-12 bg-white border-gray-300"
                          value={formData.consultationFee}
                          onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                          required
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-gray-900">
                        Practice Address *
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        placeholder="City, State"
                        className="h-12 bg-white border-gray-300"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Verification Process</p>
                        <p className="text-blue-800">
                          Your application will be reviewed by our team within 2-3 business days. We'll verify your
                          credentials and contact you via email.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1 rounded border-gray-300" required />
                    <p className="text-sm text-gray-600">
                      I certify that all information provided is accurate and I agree to the{' '}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Provider Terms of Service
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 border-gray-300 text-gray-900 hover:bg-gray-50 bg-transparent"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  className={`h-12 bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 ${
                    step === 1 ? 'w-full' : 'flex-1'
                  }`}
                >
                  {step < 3 ? 'Continue' : 'Submit Application'}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have a provider account?{' '}
              <Link href="/doctor/login" className="text-blue-600 font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

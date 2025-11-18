"use client";

import React, { useState, useCallback, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  Autocomplete,
} from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Search } from 'lucide-react';

const LocationPicker = ({ onLocationSelect, initialLocation = null, isLoaded }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(
    initialLocation || {
      lat: 23.0225, // Default: Ahmedabad
      lng: 72.5714,
    }
  );
  const [address, setAddress] = useState('');
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);
  const autocompleteRef = useRef(null);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px',
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
  };

  // Handle map click
  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    setMarker({ lat, lng });
    
    // Reverse geocode to get address
    reverseGeocode(lat, lng);
  }, []);

  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat, lng) => {
    if (!window.google) {
      console.error('Google Maps not loaded');
      return;
    }

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng },
      });

      if (response.results[0]) {
        const formattedAddress = response.results[0].formatted_address;
        setAddress(formattedAddress);
        
        // Callback to parent component
        onLocationSelect({
          address: formattedAddress,
          lat,
          lng,
        });
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingCurrentLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setMarker({ lat, lng });
        map?.panTo({ lat, lng });
        map?.setZoom(15);
        
        reverseGeocode(lat, lng);
        setIsLoadingCurrentLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your current location');
        setIsLoadingCurrentLocation(false);
      }
    );
  };

  // Handle place selection from autocomplete
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        setMarker({ lat, lng });
        setAddress(place.formatted_address);
        map?.panTo({ lat, lng });
        map?.setZoom(15);
        
        onLocationSelect({
          address: place.formatted_address,
          lat,
          lng,
        });
      }
    }
  };

  // Handle autocomplete load
  const onAutocompleteLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  if (!isLoaded) {
    return <div className="text-center py-8">Loading map...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={onPlaceChanged}
          >
            <Input
              type="text"
              placeholder="Search for a location..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="pl-10"
            />
          </Autocomplete>
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          disabled={isLoadingCurrentLocation}
          className="flex items-center gap-2"
        >
          <Navigation className="h-4 w-4" />
          {isLoadingCurrentLocation ? 'Locating...' : 'Use Current'}
        </Button>
      </div>

      {/* Map */}
      <div className="relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={marker}
          zoom={13}
          onClick={onMapClick}
          onLoad={(map) => setMap(map)}
          options={mapOptions}
        >
          {marker && (
            <Marker
              position={marker}
              draggable={true}
              onDragEnd={(e) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                setMarker({ lat, lng });
                reverseGeocode(lat, lng);
              }}
            />
          )}
        </GoogleMap>
        
        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md text-sm">
          <p className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 text-teal-600" />
            Click on map or drag marker to select location
          </p>
        </div>
      </div>

      {/* Selected Address Display */}
      {address && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <p className="text-sm font-medium text-teal-900 mb-1">Selected Location:</p>
          <p className="text-sm text-teal-700">{address}</p>
          <div className="flex gap-4 mt-2 text-xs text-teal-600">
            <span>Lat: {marker.lat.toFixed(6)}</span>
            <span>Lng: {marker.lng.toFixed(6)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
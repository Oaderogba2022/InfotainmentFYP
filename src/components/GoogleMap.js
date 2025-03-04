import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useLoadScript } from '@react-google-maps/api';

// Container style for the map
const containerStyle = {
  width: '90%',
  height: '400px',
  margin: '20px auto',
  borderRadius: '15px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
};

// Default center (e.g., San Francisco)
const defaultCenter = { lat: 37.7749, lng: -122.4194 };

function GoogleMapComponent({ onGesture }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'], // For geolocation and autocomplete
  });

  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);

  // Get current location (front-end only, no backend)
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(pos);
        },
        () => {
          console.error('Geolocation failed, using default location');
          setCurrentLocation(defaultCenter);
        }
      );
    } else {
      console.error('Geolocation not supported');
      setCurrentLocation(defaultCenter);
    }
  }, []);

  // Handle setting destination via gesture (simulated front-end only)
  const handleGestureDestination = useCallback((gesture) => {
    if (!currentLocation || !onGesture) return;

    // Simulate setting a destination based on gesture (front-end logic only)
    let newDestination = { ...currentLocation };
    switch (gesture) {
      case 'Swipe Right':
        newDestination.lat += 0.05; // Move north (adjust as needed)
        break;
      case 'Swipe Left':
        newDestination.lat -= 0.05; // Move south (adjust as needed)
        break;
      case 'Swipe Up':
        newDestination.lng += 0.05; // Move east (adjust as needed)
        break;
      case 'Swipe Down':
        newDestination.lng -= 0.05; // Move west (adjust as needed)
        break;
      default:
        return;
    }
    setDestination(newDestination);
  }, [currentLocation, onGesture]);

  // Pass gesture to parent for music control as well
  React.useEffect(() => {
    if (onGesture) {
      onGesture(handleGestureDestination);
    }
  }, [onGesture, handleGestureDestination]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation || defaultCenter}
        zoom={12}
        options={{
          styles: [
            { featureType: 'all', stylers: [{ saturation: -80 }] }, // Darker, futuristic style
          ],
          disableDefaultUI: true,
          gestureHandling: 'greedy',
        }}
      >
        {currentLocation && <Marker position={currentLocation} label="You" />}
        {destination && <Marker position={destination} label="Destination" />}
      </GoogleMap>
      <div className="gesture-controls">
        <button onClick={() => handleGestureDestination('Swipe Right')} className="map-gesture-btn">
          Set Destination (Swipe Right)
        </button>
        <button onClick={() => handleGestureDestination('Swipe Left')} className="map-gesture-btn">
          Set Destination (Swipe Left)
        </button>
        <button onClick={() => handleGestureDestination('Swipe Up')} className="map-gesture-btn">
          Set Destination (Swipe Up)
        </button>
        <button onClick={() => handleGestureDestination('Swipe Down')} className="map-gesture-btn">
          Set Destination (Swipe Down)
        </button>
      </div>
    </div>
  );
}

export default GoogleMapComponent;
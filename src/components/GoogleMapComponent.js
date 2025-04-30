import React, { useEffect } from 'react';
import { GoogleMap, Marker, TrafficLayer, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';
import '../styles/GoogleMapComponent.css';

const containerStyle = {
  width: '90%',
  height: '400px',
  margin: '20px auto', 
  borderRadius: '15px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
};

const defaultCenter = { lat: 53.3498, lng: -6.2603 }; 

function GoogleMapComponent({ destination, currentLocation, setCurrentLocation, showTraffic, directions }) {
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries: ['places'],
  });

  useEffect(() => {
    console.log('API Key loaded:', googleMapsApiKey);
  }, [googleMapsApiKey]);

  useEffect(() => {
    if (navigator.geolocation && !currentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(pos);
        },
        () => {
          console.error('Geolocation failed, using default location (Dublin)');
          setCurrentLocation(defaultCenter);
        }
      );
    }
  }, [currentLocation, setCurrentLocation]);

  if (loadError) return <div>Error loading maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation || defaultCenter}
        zoom={12}
        options={{
          styles: [{ featureType: 'all', stylers: [{ saturation: -80 }] }],
          disableDefaultUI: true,
          gestureHandling: 'greedy',
        }}
      >
        {currentLocation && <Marker position={currentLocation} label="You" />}
        {destination && <Marker position={destination} label="Destination" />}
        {showTraffic && <TrafficLayer />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
}

export default GoogleMapComponent;
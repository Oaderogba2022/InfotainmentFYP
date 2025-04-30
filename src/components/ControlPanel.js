// src/components/ControlPanel.js
import React, { useState, useEffect, useRef } from 'react';
import VoiceControl from './VoiceControl';
import MusicPlayer from './MusicPlayer';
import GestureControl from './GestureControl';
import '../styles/ControlPanel.css';

function ControlPanel({ 
  setDestination, 
  setCurrentLocation, 
  toggleTrafficLayer, 
  setTrafficOff, 
  setDirections, 
  currentLocation, 
  destination 
}) {
  const [currentGesture, setCurrentGesture] = useState(null);
  const voiceControlRef = useRef(null);

  const handleGesture = (gesture) => {
    setCurrentGesture(gesture);
    console.log('ControlPanel gesture:', gesture);

    if (gesture === 'Thumbs Up') {
      if (voiceControlRef.current) {
        voiceControlRef.current.openAI();
      }
    }

    if (gesture === 'L Shape') {
      setDestination({ lat: 53.0340, lng: -7.2998 }); 
    } else if (gesture === 'Three Fingers') {
      setTrafficOff();
      setDestination(null);
      setDirections(null); 
      if (voiceControlRef.current) {
        voiceControlRef.current.closeAI();
      }
    } else if (gesture === 'Four Fingers') {
      setDestination({ lat: 53.2734, lng: -8.9308 });
    } else if (gesture === 'Shaka') {
      toggleTrafficLayer();
    } else if (gesture === 'Peace Sign' && currentLocation && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: currentLocation,
          destination: destination,
          travelMode: 'DRIVING',
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result);
            console.log('Directions set:', result);
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
    }
  };

  useEffect(() => {
    const handleToggleTraffic = () => toggleTrafficLayer();
    const handleTurnOffTraffic = () => setTrafficOff();
    const handleGetDirections = () => {
      if (currentLocation && destination) {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: currentLocation,
            destination: destination,
            travelMode: 'DRIVING',
          },
          (result, status) => {
            if (status === 'OK') {
              setDirections(result);
              console.log('Directions set:', result);
            } else {
              console.error('Directions request failed:', status);
            }
          }
        );
      }
    };
    const handleClearDirections = () => setDirections(null);

    window.addEventListener('toggleTraffic', handleToggleTraffic);
    window.addEventListener('turnOffTraffic', handleTurnOffTraffic);
    window.addEventListener('getDirections', handleGetDirections);
    window.addEventListener('clearDirections', handleClearDirections);

    return () => {
      window.removeEventListener('toggleTraffic', handleToggleTraffic);
      window.removeEventListener('turnOffTraffic', handleTurnOffTraffic);
      window.removeEventListener('getDirections', handleGetDirections);
      window.removeEventListener('clearDirections', handleClearDirections);
    };
  }, [currentLocation, destination, toggleTrafficLayer, setTrafficOff, setDirections]);

  return (
    <div className="control-panel">
      <div className="control-section left-section">
        <MusicPlayer gesture={currentGesture} />
      </div>
      <div className="control-section right-section">
        <h2>Assistant</h2>
        <VoiceControl 
          ref={voiceControlRef}
          setDestination={setDestination} 
          setCurrentLocation={setCurrentLocation} 
        />
        <GestureControl onGesture={handleGesture} />
      </div>
    </div>
  );
}

export default ControlPanel;
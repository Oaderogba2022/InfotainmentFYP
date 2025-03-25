import React, { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import GoogleMapComponent from './components/GoogleMap';
import './styles/App.css';

function App() {
  const [destination, setDestination] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  return (
    <div className="app">
      <header className="header">
        <h1>Car Infotainment System</h1>
      </header>
      <GoogleMapComponent destination={destination} currentLocation={currentLocation} setCurrentLocation={setCurrentLocation} />
      <ControlPanel setDestination={setDestination} setCurrentLocation={setCurrentLocation} />
    </div>
  );
}

export default App;
import React from 'react';
import GoogleMapComponent from './components/GoogleMapComponent';
import ControlPanel from './components/ControlPanel';
import './styles/App.css';

function App() {
  const [destination, setDestination] = React.useState(null);
  const [currentLocation, setCurrentLocation] = React.useState(null);
  const [showTraffic, setShowTraffic] = React.useState(false);
  const [directions, setDirections] = React.useState(null);

  const toggleTrafficLayer = () => {
    setShowTraffic((prev) => !prev);
    console.log('Traffic layer toggled:', !showTraffic);
  };

  const setTrafficOff = () => {
    setShowTraffic(false);
    console.log('Traffic layer turned off');
  };

  return (
    <div className="app">
      <header className="header">
        <img src="/FYPLOGO.PNG" alt="Car Logo" className="logo" />
      </header>
      <div className="map-container">
        <GoogleMapComponent
          destination={destination}
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          showTraffic={showTraffic}
          directions={directions}
        />
      </div>
      <ControlPanel
        setDestination={setDestination}
        setCurrentLocation={setCurrentLocation}
        toggleTrafficLayer={toggleTrafficLayer}
        setTrafficOff={setTrafficOff}
        setDirections={setDirections}
        currentLocation={currentLocation} 
        destination={destination}         
      />
    </div>
  );
}

export default App;
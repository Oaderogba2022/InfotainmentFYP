import React from 'react';
import GoogleMap from './components/GoogleMap';
import ControlPanel from './components/ControlPanel';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Car Infotainment System</h1>
      </header>
      <GoogleMap />
      <ControlPanel />
    </div>
  );
}

export default App;
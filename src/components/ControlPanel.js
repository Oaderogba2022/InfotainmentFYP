import React from 'react';
import VoiceControl from './VoiceControl';

function ControlPanel({ setDestination, setCurrentLocation }) {
  return (
    <div className="control-panel">
      <div className="control-section">
        <h2>Voice Commands</h2>
        <VoiceControl setDestination={setDestination} setCurrentLocation={setCurrentLocation} />
      </div>
    </div>
  );
}

export default ControlPanel;
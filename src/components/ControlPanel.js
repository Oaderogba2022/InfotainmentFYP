import React, { useState } from 'react';
import GestureControl from './GestureControl';
import VoiceControl from './VoiceControl';
import MusicApp from './MusicApp';

function ControlPanel() {
  const [gestureHandler, setGestureHandler] = useState(null);

  const handleGesture = (gesture) => {
    if (gestureHandler) {
      gestureHandler(gesture);
    }
  };

  return (
    <div className="control-panel">
      <div className="control-section">
        <h2>Hand Gestures</h2>
        <GestureControl onGesture={handleGesture} />
      </div>
      <div className="control-section">
        <h2>Voice Commands</h2>
        <VoiceControl />
      </div>
      <div className="control-section">
        <h2>Music Control</h2>
        <MusicApp onGesture={handleGesture} />
      </div>
    </div>
  );
}

export default ControlPanel;
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../styles/GestureControl.css';

function GestureControl({ onGesture }) {
  const [currentGesture, setCurrentGesture] = useState('Unknown');
  const [confidence, setConfidence] = useState(0);
  const [frame, setFrame] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5000') ; 

    socket.on('gesture_update', (data) => {
      setCurrentGesture(data.gesture);
      setConfidence(data.confidence);
      setFrame(`data:image/jpeg;base64,${data.frame}`);
      if (data.confidence > 0.7) {
        console.log('Gesture detected:', data.gesture, 'Confidence:', data.confidence); 
        onGesture(data.gesture);
      }
    });

    return () => socket.disconnect();
  }, [onGesture]);

  return (
    <div className="gesture-control">
      <div className="control-card">
        <h3>Gesture Control</h3>
        <p>Current Gesture: {currentGesture}</p>
        <p>Confidence: {(confidence * 100).toFixed(2)}%</p>
      </div>
      {frame && (
        <div className="camera-feed">
          <img src={frame} alt="Live Camera Feed" />
        </div>
      )}
    </div>
  );
}

export default GestureControl;
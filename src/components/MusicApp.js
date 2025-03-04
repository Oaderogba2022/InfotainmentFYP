import React, { useState } from 'react';

function MusicApp({ onGesture }) {
  const [volume, setVolume] = useState(50); // Initial volume (0-100)
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle gesture for volume control (front-end only)
  const handleGesture = (gesture) => {
    if (onGesture) onGesture(gesture); // Notify parent for map destination
    switch (gesture) {
      case 'Swipe Up':
        setVolume((prev) => Math.min(prev + 10, 100));
        break;
      case 'Swipe Down':
        setVolume((prev) => Math.max(prev - 10, 0));
        break;
      default:
        break;
    }
  };

  // Simulate music playback (front-end only, no backend)
  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="music-app">
      <h2>Music Player</h2>
      <p>Volume: {volume}%</p>
      <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
      <div className="gesture-controls">
        <button onClick={() => handleGesture('Swipe Up')} className="gesture-btn">
          Increase Volume (Swipe Up)
        </button>
        <button onClick={() => handleGesture('Swipe Down')} className="gesture-btn">
          Decrease Volume (Swipe Down)
        </button>
      </div>
    </div>
  );
}

export default MusicApp;
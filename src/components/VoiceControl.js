// src/components/VoiceControl.js
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import AIInterface from './AIInterface';
import '../styles/VoiceControl.css';

const VoiceControl = forwardRef(({ setDestination, setCurrentLocation }, ref) => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [openedByGesture, setOpenedByGesture] = useState(false); 

  const handleAssistantClick = () => {
    setOpenedByGesture(false); 
    setIsAIOpen(true);
  };

  const handleCloseAI = () => {
    setIsAIOpen(false);
    setOpenedByGesture(false); 
  };

  useImperativeHandle(ref, () => ({
    openAI: () => {
      setOpenedByGesture(true); 
      setIsAIOpen(true);
    },
    closeAI: () => {
      setIsAIOpen(false);
      setOpenedByGesture(false); 
    },
  }));

  return (
    <div className="voice-control">
      <div className="control-card">
        <button onClick={handleAssistantClick}>
          AI Car Assistant
        </button>
      </div>
      {isAIOpen && <AIInterface 
        onClose={handleCloseAI} 
        setDestination={setDestination} 
        setCurrentLocation={setCurrentLocation}
        openedByGesture={openedByGesture} 
      />}
    </div>
  );
});

export default VoiceControl;
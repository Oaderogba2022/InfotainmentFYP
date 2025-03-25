import React, { useState } from 'react';
import AIInterface from './AIInterface';

function VoiceControl({ setDestination, setCurrentLocation }) {
  const [isAIOpen, setIsAIOpen] = useState(false);

  const commands = [
    { command: 'Turn Up Volume', response: 'Volume increased.' },
    { command: 'Navigate Home', response: 'Setting route to home...' },
    { command: 'Call Mom', response: 'Dialing Mom...' },
    { command: 'Go to Location 1', response: 'Setting route to Location 1...' },
    { command: 'Go to Location 2', response: 'Setting route to Location 2...' },
    { command: 'Go to Location 3', response: 'Setting route to Location 3...' },
  ];

  const testLocations = {
    'location 1': { lat: 53.3498, lng: -6.2603, name: 'Dublin, Ireland' },
  };

  const handleSpeakClick = () => {
    setIsAIOpen(true);
  };

  const handleCloseAI = () => {
    setIsAIOpen(false);
  };

  const handleTestLocation = () => {
    setDestination(testLocations['location 1']); // Sets to Dublin, Ireland
    console.log('Test Location 1 Set:', testLocations['location 1']);
  };

  return (
    <div className="voice-control">
      <button className="test-btn" onClick={handleTestLocation}>
        Test Route to Dublin, Ireland
      </button>
      {commands.map((item, index) => (
        <div key={index} className="control-card">
          <h3>{item.command}</h3>
          <p>Response: {item.response}</p>
          <button onClick={handleSpeakClick}>Speak</button>
        </div>
      ))}
      {isAIOpen && <AIInterface onClose={handleCloseAI} setDestination={setDestination} setCurrentLocation={setCurrentLocation} />}
    </div>
  );
}

export default VoiceControl;
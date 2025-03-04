import React, { useState } from 'react';
import AIInterface from './AIInterface';

function VoiceControl() {
  const [isAIOpen, setIsAIOpen] = useState(false);

  const commands = [
    { command: 'Play Music', response: 'Playing your favorite playlist...' },
    { command: 'Turn Up Volume', response: 'Volume increased.' },
    { command: 'Navigate Home', response: 'Setting route to home...' },
    { command: 'Call Mom', response: 'Dialing Mom...' },
  ];

  const handleSpeakClick = () => {
    setIsAIOpen(true);
  };

  const handleCloseAI = () => {
    setIsAIOpen(false);
  };

  return (
    <div className="voice-control">
      {commands.map((item, index) => (
        <div key={index} className="control-card">
          <h3>{item.command}</h3>
          <p>Response: {item.response}</p>
          <button onClick={handleSpeakClick}>Speak</button>
        </div>
      ))}
      {isAIOpen && <AIInterface onClose={handleCloseAI} />}
    </div>
  );
}

export default VoiceControl;
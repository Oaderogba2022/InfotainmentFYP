import React, { useState, useEffect } from 'react';

function AIInterface({ onClose, setDestination, setCurrentLocation }) {
  const [isListening, setIsListening] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [response, setResponse] = useState('Ready to listen...');

  const defaultLocations = {
    'location 1': { lat: 53.3498, lng: -6.2603, name: 'Dublin, Ireland' },
    'location 2': { lat: 34.0522, lng: -118.2437, name: 'Los Angeles' },
    'location 3': { lat: 40.7128, lng: -74.0060, name: 'New York' },
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'ai-overlay') {
      onClose();
    }
  };

  const speakResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.volume = 2.0;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => voice.name.includes('Google') || voice.name.includes('Samantha')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakClick = () => {
    setIsListening(true);
    setResponse('Listening...');
    speakResponse('Please say your command.');

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setResponse(`Heard: "${transcript}"`);
      speakResponse(`I heard: ${transcript}`);

      try {
        const res = await fetch('http://localhost:5000/voice-command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: transcript }),
        });
        const data = await res.json();
        setResponse(data.message);
        speakResponse(data.message);

        const lowerTranscript = transcript.toLowerCase();
        if (lowerTranscript.includes('go to location')) {
          const locationKey = Object.keys(defaultLocations).find(key => lowerTranscript.includes(key));
          if (locationKey && setDestination) {
            setDestination(defaultLocations[locationKey]);
          }
        }
      } catch (error) {
        setResponse('Error processing command.');
        speakResponse('Sorry, there was an error.');
      }

      setIsListening(false);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 500);
    };

    recognition.onerror = () => {
      setResponse('Error: Could not recognize voice.');
      speakResponse('Sorry, I couldn’t understand you.');
      setIsListening(false);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 500);
    };

    recognition.onend = () => {
      if (isListening) setIsListening(false);
    };

    recognition.start();
  };

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  return (
    <div className="ai-overlay" onClick={handleOverlayClick}>
      <div className={`ai-interface ${isListening ? 'listening' : ''} ${isTransitioning ? 'transitioning' : ''}`}>
        <button className="close-btn" onClick={onClose}>X</button>
        <div className="controls-bottom">
          <button className="speak-btn" onClick={handleSpeakClick} disabled={isListening}>
            {isListening ? 'Listening...' : 'Speak'}
          </button>
          <p className="status">{response}</p>
        </div>
      </div>
    </div>
  );
}

export default AIInterface;
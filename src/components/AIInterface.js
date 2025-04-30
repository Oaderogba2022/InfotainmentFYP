import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AIInterface.css';

const defaultLocations = {
  'dublin': { lat: 53.3498, lng: -6.2603, name: 'Dublin, Ireland' },
  'location 2': { lat: 34.0522, lng: -118.2437, name: 'Los Angeles' },
  'location 3': { lat: 40.7128, lng: -74.0060, name: 'New York' },
  'portlaoise': { lat: 53.0340, lng: -7.2998, name: 'Portlaoise, Ireland' },
  'galway': { lat: 53.2734, lng: -8.9308, name: 'Galway, Ireland' },
  'waterford': { lat: 52.2567, lng: -7.1119, name: 'Waterford, Ireland' },
  'belfast': { lat: 54.5973, lng: -5.9301, name: 'Belfast, Northern Ireland' },
  'mayo': { lat: 53.9000, lng: -9.2500, name: 'Mayo, Ireland' }, 
  'cork': { lat: 51.8985, lng: -8.4756, name: 'Cork, Ireland' },
  'newbridge': { lat: 53.1819, lng: -6.7975, name: 'Newbridge, Ireland' },
  'limerick': { lat: 52.6638, lng: -8.6267, name: 'Limerick, Ireland' },
  'sligo': { lat: 54.2766, lng: -8.4761, name: 'Sligo, Ireland' }
};

function AIInterface({ onClose, setDestination, setCurrentLocation, openedByGesture }) {
  const [isListening, setIsListening] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [response, setResponse] = useState('Ready to listen...');
  const [hasAutoListened, setHasAutoListened] = useState(false);

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

  const handleSpeakClick = useCallback(() => {
    setIsListening(true);
    setResponse('Listening...');
    speakResponse('Please say your command.');

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Recognised transcript:', transcript);
      setResponse(`Heard: "${transcript}"`);
      speakResponse(`I heard: ${transcript}`);

      try {
        let actionResponse = 'Command processed.';
        const commands = {
          'thumbs up': () => { window.dispatchEvent(new Event('volumeUp')); },
          'fist': () => { window.dispatchEvent(new Event('stopMusic')); },
          'play music': () => { window.dispatchEvent(new Event('playMusic')); },
          'pointing': () => { window.dispatchEvent(new Event('togglePlay')); },
          'open hand': () => { window.dispatchEvent(new Event('nextSong')); },
          'ok sign': () => { window.dispatchEvent(new Event('prevSong')); },
          'go to portlaoise': () => { setDestination(defaultLocations['portlaoise']); },
          'go to galway': () => { setDestination(defaultLocations['galway']); },
          'go to waterford': () => { setDestination(defaultLocations['waterford']); },
          'go to belfast': () => { setDestination(defaultLocations['belfast']); },
          'go to mayo': () => { setDestination(defaultLocations['mayo']); },
          'go to cork': () => { setDestination(defaultLocations['cork']); },
          'go to newbridge': () => { setDestination(defaultLocations['newbridge']); },
          'go to limerick': () => { setDestination(defaultLocations['limerick']); },
          'go to sligo': () => { setDestination(defaultLocations['sligo']); },
          'navigate to galway': () => { setDestination(defaultLocations['galway']); },
          'set destination to galway': () => { setDestination(defaultLocations['galway']); },
          'go to dublin': () => { setDestination(defaultLocations['dublin']); },
          'go to location 2': () => { setDestination(defaultLocations['location 2']); },
          'go to location 3': () => { setDestination(defaultLocations['location 3']); },
          'three fingers': () => { 
            setDestination(null);
            window.dispatchEvent(new Event('clearDirections'));
            window.dispatchEvent(new Event('turnOffTraffic'));
          },
          'shaka': () => { window.dispatchEvent(new Event('toggleTraffic')); },
          'four fingers': () => { setDestination(defaultLocations['galway']); },
          'get directions': () => { window.dispatchEvent(new Event('getDirections')); },
        };

        let matched = false;
        for (const [command, action] of Object.entries(commands)) {
          if (transcript.includes(command)) {
            action();
            matched = true;
            break;
          }
        }

        if (!matched) {
          if (transcript.includes('galway')) {
            actionResponse = 'Did you mean "go to Galway"? Please say "go to Galway", "navigate to Galway", or "set destination to Galway".';
          } else {
            const res = await fetch('http://localhost:5000/voice-command', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ command: transcript }),
            });
            const data = await res.json();
            actionResponse = data.message;
          }
        }

        setResponse(actionResponse);
        speakResponse(actionResponse);
      } catch (error) {
        setResponse('Error processing command.');
        speakResponse('Sorry, there was an error.');
      }

      setIsListening(false);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 500);
    };

    recognition.onerror = () => {
      setResponse('Error: Could not recognise voice.');
      speakResponse('Sorry, I couldn’t understand you.');
      setIsListening(false);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 500);
    };

    recognition.onend = () => {
      if (isListening) setIsListening(false);
    };

    recognition.start();
  }, [setDestination, isListening]);

  useEffect(() => {
    if (openedByGesture && !isListening && !hasAutoListened) {
      handleSpeakClick();
      setHasAutoListened(true);
    }
  }, [openedByGesture, isListening, handleSpeakClick, hasAutoListened]);

  useEffect(() => {
    return () => {
      setHasAutoListened(false);
    };
  }, []);

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };

    const handleVolumeUp = () => {
      window.postMessage({ type: 'volumeUp' }, '*');
    };
    const handleStopMusic = () => {
      window.postMessage({ type: 'stopMusic' }, '*');
    };
    const handlePlayMusic = () => {
      window.postMessage({ type: 'playMusic' }, '*');
    };
    const handleTogglePlay = () => {
      window.postMessage({ type: 'togglePlay' }, '*');
    };
    const handleNextSong = () => {
      window.postMessage({ type: 'nextSong' }, '*');
    };
    const handlePrevSong = () => {
      window.postMessage({ type: 'prevSong' }, '*');
    };
    const handleToggleTraffic = () => {
      window.postMessage({ type: 'toggleTraffic' }, '*');
    };
    const handleTurnOffTraffic = () => {
      window.postMessage({ type: 'turnOffTraffic' }, '*');
    };
    const handleGetDirections = () => {
      window.postMessage({ type: 'getDirections' }, '*');
    };
    const handleClearDirections = () => {
      window.postMessage({ type: 'clearDirections' }, '*');
    };

    window.addEventListener('volumeUp', handleVolumeUp);
    window.addEventListener('stopMusic', handleStopMusic);
    window.addEventListener('playMusic', handlePlayMusic);
    window.addEventListener('togglePlay', handleTogglePlay);
    window.addEventListener('nextSong', handleNextSong);
    window.addEventListener('prevSong', handlePrevSong);
    window.addEventListener('toggleTraffic', handleToggleTraffic);
    window.addEventListener('turnOffTraffic', handleTurnOffTraffic);
    window.addEventListener('getDirections', handleGetDirections);
    window.addEventListener('clearDirections', handleClearDirections);

    return () => {
      window.removeEventListener('volumeUp', handleVolumeUp);
      window.removeEventListener('stopMusic', handleStopMusic);
      window.removeEventListener('playMusic', handlePlayMusic);
      window.removeEventListener('togglePlay', handleTogglePlay);
      window.removeEventListener('nextSong', handleNextSong);
      window.removeEventListener('prevSong', handlePrevSong);
      window.removeEventListener('toggleTraffic', handleToggleTraffic);
      window.removeEventListener('turnOffTraffic', handleTurnOffTraffic);
      window.removeEventListener('getDirections', handleGetDirections);
      window.removeEventListener('clearDirections', handleClearDirections);
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'volumeUp') {
        window.dispatchEvent(new Event('volumeUp'));
      } else if (event.data.type === 'stopMusic') {
        window.dispatchEvent(new Event('stopMusic'));
      } else if (event.data.type === 'playMusic') {
        window.dispatchEvent(new Event('playMusic'));
      } else if (event.data.type === 'togglePlay') {
        window.dispatchEvent(new Event('togglePlay'));
      } else if (event.data.type === 'nextSong') {
        window.dispatchEvent(new Event('nextSong'));
      } else if (event.data.type === 'prevSong') {
        window.dispatchEvent(new Event('prevSong'));
      } else if (event.data.type === 'toggleTraffic') {
        window.dispatchEvent(new Event('toggleTraffic'));
      } else if (event.data.type === 'turnOffTraffic') {
        window.dispatchEvent(new Event('turnOffTraffic'));
      } else if (event.data.type === 'getDirections') {
        window.dispatchEvent(new Event('getDirections'));
      } else if (event.data.type === 'clearDirections') {
        window.dispatchEvent(new Event('clearDirections'));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
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
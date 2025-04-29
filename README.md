# AutoSync Car Infotainment System

This project is a gesture and voice-controlled car infotainment system built with Create React App and Python, integrating Google Maps for navigation, music playback, and real-time user interaction.

![image](https://github.com/user-attachments/assets/4567eb28-cdba-4009-91e9-59d7d7390db0)


![image](https://github.com/user-attachments/assets/7216edda-d502-49b1-a53c-97fe8be5bb6a)


![image](https://github.com/user-attachments/assets/5057ade5-7e98-4349-a5b4-3f009ad5b2ca)

## Project Overview

This car infotainment system enhances the driving experience through hands-free interaction. It uses hand gestures (via webcam) and voice commands to control navigation on Google Maps, toggle traffic layers, and manage music playback. The system features a React frontend for the user interface and a Python backend for gesture recognition.

### Key Features

- Gesture-based navigation and music control (e.g., "Shaka" to toggle traffic layer, "Open Hand" to play/pause music).
- Voice commands for navigation (e.g., "Navigate to Dublin").
- Google Maps integration for real-time navigation and traffic display.
- Accessibility with keyboard shortcuts and ARIA labels.
- Toast notifications for gesture feedback.

### Getting Started
## Prerequisites

- Node.js (v18.x) and npm (v9.x)
- Python (v3.x)
- A Google Maps API Key from Google Cloud Console (with Maps JavaScript API and Places API enabled)

### Installation

git clone https://github.com/your-username/car-infotainment-system.git
cd car-infotainment-system

cd car-infotainment
npm install

pip install opencv-python mediapipe numpy python-socketio

REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

### Interact with the System

### Using Gestures

- "L Shape": Sets destination to Portlaoise.
- "Three Fingers": Clears the destination.
- "Shaka": Toggles the traffic layer on the map.
- "Pointing": Starts navigation to the destination.
- "Fist": Stops navigation.
- "Open Hand": Plays/pauses music.

### Using Voice Commands
Click the "AI Assistant" button and say commands like:

- "Navigate to Dublin"
- "Set current location"

## Technologies Used

### Frontend 

•	React(v2.19.3)
•	Socket.IO Client (v4.7)
•	@react-google-maps/api (v2.19.3)

### Backend 

•	Python (v3.12)
•	MediaPipe (v0.10.14): 
•	OpenCV (v4.10)
•	Socket.IO (Python, v3.0): 

### API's

• Google Maps JavaScript API
• Google Maps Places API
• Web Speech API
• Geolocation API

## Project Structure
### Frontend
car-infotainment/src/App.js
car-infotainment/src/components/GoogleMapComponent.js
car-infotainment/src/components/ControlPanel.js
car-infotainment/src/components/GestureControl.js
car-infotainment/src/components/VoiceControl.js
car-infotainment/src/components/MusicPlayer.js
car-infotainment/src/components/Server.js

## Backend
gesture_server.py


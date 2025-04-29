# Car Infotainment System

This project is a gesture and voice-controlled car infotainment system built with Create React App and Python, integrating Google Maps for navigation, music playback, and real-time user interaction.

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

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.


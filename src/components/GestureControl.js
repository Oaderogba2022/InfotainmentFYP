import React from 'react';

function GestureControl({ onGesture }) {
  const gestures = [
    { action: 'Increase Volume', gesture: 'Swipe Up' },
    { action: 'Decrease Volume', gesture: 'Swipe Down' },
    { action: 'Set Destination (North)', gesture: 'Swipe Right' },
    { action: 'Set Destination (South)', gesture: 'Swipe Left' },
    { action: 'Next Track', gesture: 'Custom Gesture (e.g., Circle)' },
    { action: 'Previous Track', gesture: 'Custom Gesture (e.g., Circle)' },
  ];

  return (
    <div className="gesture-control">
      {gestures.map((item, index) => (
        <div key={index} className="control-card">
          <h3>{item.action}</h3>
          <p>Gesture: {item.gesture}</p>
          <button onClick={() => onGesture(item.gesture)}>Try It</button>
        </div>
      ))}
    </div>
  );
}

export default GestureControl;
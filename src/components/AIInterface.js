import React from 'react';

function AIInterface({ onClose }) {
  const handleOverlayClick = (e) => {
    if (e.target.className === 'ai-overlay') {
      onClose();
    }
  };

  return (
    <div className="ai-overlay" onClick={handleOverlayClick}>
      <div className="ai-interface">
        <button className="close-btn" onClose={onClose}>X</button>
      </div>
    </div>
  );
}

export default AIInterface;
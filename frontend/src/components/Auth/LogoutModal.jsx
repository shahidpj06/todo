import React from 'react';

const LogoutModal = ({ onClose, onConfirm }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>Are you sure you want to logout?</p>
        <div>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

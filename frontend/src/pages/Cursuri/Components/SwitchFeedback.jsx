import React from 'react';
import './Component.css'; // Vezi mai jos stilurile

const SwitchFeedback = ({ label, isOn, onToggle }) => {
    return (
        <div className="switch-container">
            <span>{label}</span>
            <label className="switch">
                <input type="checkbox" checked={isOn} onChange={onToggle} />
                <span className="slider round"></span>
            </label>
        </div>
    );
};

export default SwitchFeedback;
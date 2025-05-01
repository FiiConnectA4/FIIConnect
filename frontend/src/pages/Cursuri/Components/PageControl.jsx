import React, { useState } from 'react';
import Optiuni from './Optiuni';
import './Component.css';

const PageControl = ({ onDelete, ariaLabel = "Menu" }) => {
    console.log("✅ PageControl: onDelete primit:", onDelete);
    
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(prev => !prev);

    return (
        <div className="page-control-container">
            <button
                className="dots-button"
                onClick={toggleVisibility}
                aria-label={ariaLabel}
            >
                <span className="dots"></span>
            </button>
            {isVisible && <Optiuni onDelete={onDelete} />}
        </div>
    );
};


export default PageControl;
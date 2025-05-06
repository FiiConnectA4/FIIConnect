import React from 'react';
import './Component.css';

const Buton = ({ text, onNavigate, className }) => {
    const handleClick = () => {
        onNavigate();
    };

    return (
        <button
            className={`buton-curs ${className || ''}`}
            onClick={handleClick}
        >
            {text}
        </button>
    );
};

export default Buton;
import React from 'react';
import './Component.css';

const Buton = ({ text, onNavigate }) => {
    const handleClick = () => {
        onNavigate();
    };

    return (
        <button
            className="buton-curs"
            onClick={handleClick}
        >
            {text}
        </button>
    );
};

export default Buton;
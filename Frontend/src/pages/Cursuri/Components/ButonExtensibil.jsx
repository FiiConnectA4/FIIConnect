import React, { useState } from 'react';
import './Component.css';

const ButonExtensibil = ({ text, onNavigate, className, professors }) => {
    const [expanded, setExpanded] = useState(false);

    professors = [
        'Popa Tudor',
        'Alexandru Nechifor',
        'Danila George',
        'Sebastian Nechifor',
        'Iancu Stefan Teodor',
    ];

    const handleClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="buton-container">
            <button
                className={`buton-curs ${className || ''}`}
                onClick={handleClick}
            >
                {text}
            </button>
            {expanded && (
                <div className="buton-submenu">
                    {professors.map((profesor, index) => (
                        <button key={index} className="buton-submenu-item">
                            {profesor}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ButonExtensibil;
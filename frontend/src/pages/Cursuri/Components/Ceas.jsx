import React from 'react';
import './Component.css';

const Ceas = ({ onClick }) => {
    return (
        <button className="buton-icon" onClick={onClick}>
            <img
                src="/Clock.png"
                alt="Ceas curs"
                className="icon-curs"
            />
        </button>
    );
};

export default Ceas;
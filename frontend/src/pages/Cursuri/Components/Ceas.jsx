import React from 'react';
import './Component.css';

const Ceas = ({ onClick, style }) => {
    return (
        <button className="buton-icon" onClick={onClick} style={style}>
            <img
                src="/Clock.png"
                alt="Ceas curs"
                className="icon-curs"
            />
        </button>
    );
};

export default Ceas;
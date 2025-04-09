import React from 'react';
import './Component.css';

const Edit = (className) => {
    return (
        < button className="buton-edit">
            <img
                src="/Modificare.png"
                alt="Modificare"
                className="modificare-element"
            />
        </button >
    );
}

export default Edit;
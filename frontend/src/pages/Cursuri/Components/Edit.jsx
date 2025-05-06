import React, { useState } from 'react';
import './Component.css';

const Edit = ({ value, onChange }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="edit-container">
            <button onClick={() => setIsEditing((prev) => !prev)} className="buton-edit">
                <img
                    src="/Modificare.png"
                    alt="Modificare"
                    className="modificare-element"
                />
            </button>
            {isEditing && (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </div>
    );
};

export default Edit;
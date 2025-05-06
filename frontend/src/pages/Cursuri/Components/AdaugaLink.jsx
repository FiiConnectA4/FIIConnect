import React from 'react';

const AdaugaLink = ({ newMaterial, setNewMaterial, onAdd }) => {
    return (
        <div className="add-material">
            <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setNewMaterial(e.target.files[0])}
            />
            <button onClick={onAdd}>Adaugă</button>
        </div>
    );
};

export default AdaugaLink;
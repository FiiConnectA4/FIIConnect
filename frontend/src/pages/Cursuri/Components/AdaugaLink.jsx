import React from 'react';

const AdaugaLink = ({ newMaterial, setNewMaterial, onAdd }) => {
    return (
        <div className="add-material">
            <input
                type="text"
                placeholder="Link nou material"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
            />
            <button onClick={onAdd}>Adaugă</button>
        </div>
    );
};

export default AdaugaLink;
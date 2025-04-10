import React from 'react';
import { useState, useEffect } from 'react';
import './../Student/DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import Edit from './../Components/Edit';

import ButonExtensibil from './../Components/ButonExtensibil';
import Optiuni from './../Components/Optiuni';

const PDetaliiCurs = ({ curs, onBack }) => {
    const [materials, setMaterials] = useState([]);
    const [gradingMethod, setGradingMethod] = useState('');
    const [description, setDescription] = useState('');
    const [newMaterial, setNewMaterial] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/didactic/course/material/${curs.id}`)
            .then((res) => res.json())
            .then((data) => {
                setMaterials(data);
                setGradingMethod(curs.gradingMethod || '');
                setDescription(curs.description || '');
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error loading materials', err);
                setLoading(false);
            });
    }, [curs.id]);

    const saveCourseChanges = () => {
        fetch(`/didactic/course/${curs.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gradingMethod,
                description
            })
        })
            .then(() => alert('Course updated!'))
            .catch(err => console.error('Failed to update course', err));
    };

    const addMaterial = () => {
        if (!newMaterial) return;
        fetch(`/didactic/course/material`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                courseId: curs.id,
                name: `Material`,
                link: newMaterial
            })
        })
            .then(() => {
                setMaterials(prev => [...prev, { name: 'Material', link: newMaterial }]);
                setNewMaterial('');
            })
            .catch(err => console.error('Failed to add material', err));
    };

    const deleteMaterial = (materialId) => {
        fetch(`/didactic/course/material/${materialId}`, { method: 'DELETE' })
            .then(() => {
                setMaterials(prev => prev.filter(m => m.id !== materialId));
            })
            .catch(err => console.error('Failed to delete material', err));
    };

    if (loading) return <div>Loading course...</div>;

    return (
        <div className="detalii-container">
            <button className="buton-inapoi" onClick={onBack}>&lt; Înapoi</button>
            <div className="titlu-curs">
                <h1><u>{curs.title}</u></h1>
                <Ceas />
            </div>

            <div className="sectiune">
                <h2>Descriere:</h2>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="sectiune">
                <h2>Metoda de notare:</h2>
                <textarea
                    value={gradingMethod}
                    onChange={(e) => setGradingMethod(e.target.value)}
                />
            </div>

            <div className="sectiune bibliografie">
                <h2>Materiale (Resurse):</h2>
                {materials.map((m) => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <a href={m.link} target="_blank" rel="noreferrer">{m.name}</a>
                        <button onClick={() => deleteMaterial(m.id)}>Șterge</button>
                    </div>
                ))}
                <input
                    type="text"
                    placeholder="Link nou material"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                />
                <button onClick={addMaterial}>Adaugă</button>
            </div>

            <button className="save-button" onClick={saveCourseChanges}>Salvează modificările</button>
        </div>
    );
};

export default PDetaliiCurs;

import React from 'react';
import { useState, useEffect } from 'react';
import './../Student/DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import Edit from './../Components/Edit';
import AdaugaLink from './../Components/AdaugaLink';

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
                console.log('Răspuns API pentru materiale:', data); // Debugging
                setMaterials(Array.isArray(data) ? data : []); // Asigură-te că materials este un array
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
                <Edit
                    value={description}
                    onChange={(newDescription) => setDescription(newDescription)}
                />
            </div>

            <div className="sectiune">
                <h2>Metoda de notare:</h2>
                <Edit
                    value={gradingMethod}
                    onChange={(newGradingMethod) => setGradingMethod(newGradingMethod)}
                />
            </div>

            <div className="sectiune bibliografie">
                <h2>Materiale (Resurse):</h2>
                {materials.map((m) => (
                    <div className='link' key={m.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <a href={m.link} target="_blank" rel="noreferrer">{m.name}</a>
                        <button className='stergere' onClick={() => deleteMaterial(m.id)}>Șterge</button>
                    </div>
                ))}
                <AdaugaLink
                    newMaterial={newMaterial}
                    setNewMaterial={setNewMaterial} // Transmite funcția setNewMaterial
                    onAdd={addMaterial} />
            </div>

            <button className="save-button" onClick={saveCourseChanges}>Salvează modificările</button>
        </div>
    );
};

export default PDetaliiCurs;

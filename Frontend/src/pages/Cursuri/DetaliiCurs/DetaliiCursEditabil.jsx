import React, { useState, useEffect } from 'react';
import './DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import Edit from './../Components/Edit';
import ButonExtensibil from '../Components/ButonExtensibil';
import AdaugaLink from './../Components/AdaugaLink';

const PDetaliiCurs = ({ curs, onBack }) => {
    const [materials, setMaterials] = useState([]);
    const [gradingMethod, setGradingMethod] = useState('');
    const [description, setDescription] = useState('');
    const [newMaterial, setNewMaterial] = useState('');
    const [profesori, setProfesori] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formula, setFormula] = useState(null);
    const [isEditingFormula, setIsEditingFormula] = useState(false);
    const [formulaText, setFormulaText] = useState('');

    useEffect(() => {
        // Fetch materials
        fetch(`/didactic/course/material/${curs.id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log('Răspuns API pentru materiale:', data);
                setMaterials(Array.isArray(data) ? data : []);
                setDescription(curs.description || '');
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error loading materials', err);
                setLoading(false);
            });

        // Fetch professors
        fetch(`/didactic/course/${curs.id}`)
            .then(response => {
                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}`);
                    setProfesori([]);
                    return [];
                }
                return response.json();
            })
            .then(data => {
                console.log('Răspuns API profesori:', data);
                const professorsArray = data.professors || [];
                console.log('Array profesori:', professorsArray);
                if (Array.isArray(professorsArray)) {
                    const profList = professorsArray.map(prof => ({
                        name: `${prof.professor.firstName} ${prof.professor.lastName}`,
                    }));
                    setProfesori(profList);
                } else {
                    console.error('Răspuns invalid: nu conține un array de profesori.', data);
                    setProfesori([]);
                }
            })
            .catch(error => {
                console.error('Error fetching professors:', error);
                setProfesori([]);
            });

        // Fetch formula
        fetch(`/didactic/course/${curs.id}/formula`)
            .then(response => {
                if (!response.ok) {
                    console.error(`No formula found for course ${curs.id}`);
                    setFormula(null);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                console.log('Răspuns API formula:', data);
                setFormula(data);
                setFormulaText(data?.text || '');
                setGradingMethod(data?.text || '');
            })
            .catch(error => {
                console.error('Error fetching formula:', error);
                setFormula(null);
            });
    }, [curs.id]);

    const saveCourseChanges = () => {
        fetch(`/didactic/course/${curs.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description
            })
        })
            .then(() => alert('Course updated!'))
            .catch(err => console.error('Failed to update course', err));
    };

    const saveFormula = () => {
        const requestBody = {
            idCourse: curs.id,
            text: formulaText
        };
        const isExistingFormula = formula && formula.id;

        fetch(isExistingFormula ? `/didactic/formula/${formula.id}` : `/didactic/formula`, {
            method: isExistingFormula ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log('Formula saved:', data);
                setFormula(data);
                setGradingMethod(data.text);
                setIsEditingFormula(false);
                alert('Formula saved!');
            })
            .catch(err => {
                console.error('Failed to save formula:', err);
                alert('Failed to save formula: ' + err.message);
            });
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
            <button className="buton-inapoi" onClick={onBack}>{'< Înapoi'}</button>
            <div className="titlu-curs">
                <h1><u>{curs.title}</u></h1>
                <Ceas />
            </div>
            <ButonExtensibil
                text="Profesori"
                professors={profesori}
            />

            <div className="sectiune">
                <h2>Descriere:</h2>
                <Edit
                    value={description}
                    onChange={(newDescription) => setDescription(newDescription)}
                />
            </div>

            <div className="sectiune">
                <h2>Metoda de notare:</h2>
                {isEditingFormula ? (
                    <div>
                        <input
                            type="text"
                            value={formulaText}
                            onChange={(e) => setFormulaText(e.target.value)}
                            placeholder="e.g., Final grade=lab note + test"
                        />
                        <button onClick={saveFormula}>Save Formula</button>
                        <button onClick={() => setIsEditingFormula(false)}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <p>{formula?.text || 'No formula defined'}</p>
                        {formula?.components?.length > 0 && (
                            <ul>
                                {formula.components.map(comp => (
                                    <li key={comp.id}>{comp.name}</li>
                                ))}
                            </ul>
                        )}
                        <button onClick={() => setIsEditingFormula(true)}>Edit Formula</button>
                    </div>
                )}
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
                    setNewMaterial={setNewMaterial}
                    onAdd={addMaterial}
                />
            </div>

            <button className="save-button" onClick={saveCourseChanges}>Salvează modificările</button>
        </div>
    );
};

export default PDetaliiCurs;
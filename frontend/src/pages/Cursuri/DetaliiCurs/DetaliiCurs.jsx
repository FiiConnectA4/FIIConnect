import React, { useState, useEffect } from 'react';
import './DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import ButonExtensibil from '../Components/ButonExtensibil';
import Buton from '../Components/Buton';

// Backend base URL (remove if using package.json proxy)
const API_BASE_URL = ''; // Set to 'http://localhost:8080' if no proxy, or leave empty with proxy

const DetaliiCurs = ({ curs, onBack }) => {
    const [profesori, setProfesori] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [formula, setFormula] = useState(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        console.log('ID-ul cursului:', curs.id);

        // Fetch materials
        fetch(`${API_BASE_URL}/didactic/course/material`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log('Răspuns API pentru materiale:', data);
                setMaterials(Array.isArray(data) ? data.filter(m => m.idCourse === curs.id) : []);
            })
            .catch(error => {
                console.error('Eroare la încărcarea materialelor:', error);
                alert('Eroare la încărcarea materialelor: ' + error.message);
                setMaterials([]);
            });

        // Fetch professors and description
        fetch(`${API_BASE_URL}/didactic/course/${curs.id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}`);
                    setProfesori([]);
                    setDescription('');
                    return {};
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
                setDescription(data.description || 'Fără descriere');
            })
            .catch(error => {
                console.error('Eroare la încărcarea profesorilor:', error);
                alert('Eroare la încărcarea profesorilor: ' + error.message);
                setProfesori([]);
                setDescription('Fără descriere');
            });

        // Fetch formula
        fetch(`${API_BASE_URL}/didactic/course/${curs.id}/formula`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    console.error(`Nicio formulă găsită pentru cursul ${curs.id}`);
                    setFormula(null);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                console.log('Răspuns API formula:', data);
                setFormula(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Eroare la încărcarea formulei:', error);
                alert('Eroare la încărcarea formulei: ' + error.message);
                setFormula(null);
                setLoading(false);
            });
    }, [curs.id]);

    const downloadMaterial = (materialId, filename) => {
        fetch(`${API_BASE_URL}/didactic/course/material/${materialId}/file`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error! Status: ${response.status}, Message: ${text}`);
                    });
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch(err => {
                console.error('Eroare la descărcarea materialului:', err);
                alert('Eroare la descărcarea materialului: ' + err.message);
            });
    };

    if (loading) {
        return <div>Se încarcă detaliile cursului...</div>;
    }

    return (
        <div className="detalii-container">
            <button className="buton-inapoi" onClick={onBack}>{'< Înapoi'}</button>
            <div className="titlu-curs">
                <h1><u>{curs.title}</u></h1>
                <Ceas />
            </div>
            <div className="butoane-container">
                <ButonExtensibil text="Profesori" professors={profesori} />
                <Buton text="Feedback" className="feedback" />
            </div>
            <div className="sectiune">
                <h2>Descriere curs:</h2>
                <p>{description}</p>
            </div>
            <div className="sectiune">
                <h2>Metoda de notare (componente):</h2>
                {formula ? (
                    <div>
                        <p>{formula.text}</p>
                        {formula.components?.length > 0 && (
                            <ul>
                                {formula.components.map(comp => (
                                    <li key={comp.id}>{comp.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ) : (
                    <p>Fără formulă definită</p>
                )}
            </div>
            <div className="sectiune bibliografie">
                <h2>Materiale de curs:</h2>
                {materials.length > 0 ? (
                    <div>
                        {materials.map(material => (
                            <div
                                key={material.id}
                                style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ flex: 1 }}>{material.filename}</span>
                                    <button
                                        style={{ marginLeft: '10px' }}
                                        onClick={() => downloadMaterial(material.id, material.filename)}
                                    >
                                        Descarcă
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Nu sunt materiale disponibile</p>
                )}
            </div>
        </div>
    );
};

export default DetaliiCurs;

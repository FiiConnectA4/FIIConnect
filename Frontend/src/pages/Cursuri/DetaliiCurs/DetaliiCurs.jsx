import { useState, useEffect } from 'react';
import './DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import ButonExtensibil from '../Components/ButonExtensibil';

const DetaliiCurs = ({ curs, onBack }) => {
    const [profesori, setProfesori] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [formula, setFormula] = useState(null);
    const [description, setDescription] = useState(''); // New state for description
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('ID-ul cursului:', curs.id);

        // Fetch materials
        fetch(`/didactic/course/material/${curs.id}`)
            .then(response => response.json())
            .then(data => {
                setMaterials(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching materials:', error);
                setLoading(false);
            });

        // Fetch professors and description
        fetch(`/didactic/course/${curs.id}`)
            .then(response => {
                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}`);
                    setProfesori([]);
                    setDescription('');
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
                setDescription(data.description || 'Fara descriere');
            })
            .catch(error => {
                console.error('Error fetching professors:', error);
                setProfesori([]);
                setDescription('');
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
            })
            .catch(error => {
                console.error('Error fetching formula:', error);
                setFormula(null);
            });
    }, [curs.id]);

    if (loading) {
        return <div>Loading course details...</div>;
    }

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
                <h2>DESCRIERE CURS:</h2>
                <p>{description}</p>
            </div>
            <div className="sectiune">
                <h2>Metoda notare:(componente)</h2>
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
                    <p>No formula defined</p>
                )}
            </div>
            <div className="sectiune bibliografie">
                <h2>Materiale de curs:</h2>
                {materials.length > 0 ? (
                    <ul>
                        {materials.map(material => (
                            <li key={material.id}>
                                <a href={material.link} target="_blank" rel="noopener noreferrer">
                                    {material.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nu sunt materiale disponibile</p>
                )}
            </div>
        </div>
    );
};

export default DetaliiCurs;
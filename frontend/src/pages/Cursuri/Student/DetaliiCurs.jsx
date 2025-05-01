import { useState, useEffect } from 'react';
import './DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import ButonExtensibil from '../Components/ButonExtensibil';

const DetaliiCurs = ({ curs, onBack }) => {
    const [profesori, setProfesori] = useState([]); // Array pentru profesori
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('ID-ul cursului:', curs.id); // Verificăm ID-ul cursului

        // Fetch materials for the selected course
        fetch(`/didactic/course/material/${curs.id}`)
            .then(response => response.json())
            .then(data => {
                setMaterials(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching materials:', error);
                setLoading(false);
            });

        // Fetch professors for the selected course
        fetch(`/didactic/course/${curs.id}`)
            .then(response => {
                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}`);
                    setProfesori([]); // Setăm lista ca fiind goală
                    return [];
                }
                return response.json();
            })
            .then(data => {
                console.log('Răspuns API profesori:', data); // Verificăm structura răspunsului
                const professorsArray = data.professors || []; // Accesăm array-ul din răspuns
                console.log('Array profesori:', professorsArray); // Verificăm array-ul de profesori
                if (Array.isArray(professorsArray)) {
                    const profList = professorsArray.map(prof => ({
                        name: `${prof.professor.firstName} ${prof.professor.lastName}`,
                    }));
                    setProfesori(profList);
                } else {
                    console.error('Răspuns invalid: nu conține un array de profesori.', data);
                    setProfesori([]); // Setăm lista ca fiind goală
                }
            })
            .catch(error => {
                console.error('Error fetching professors:', error);
                setProfesori([]); // Setăm lista ca fiind goală în caz de eroare
            });
    }, [curs.id]);

    if (loading) {
        return <div>Loading course details...</div>;
    }

    return (
        <div className="detalii-container">
            <button className="buton-inapoi" onClick={onBack}>&lt; Înapoi</button>
            <div className="titlu-curs">
                <h1><u>{curs.title}</u></h1>
                <Ceas />
            </div>
            <ButonExtensibil
                text="Profesori"
                professors={profesori} // Transmitem lista de profesori
            />
            <div className="sectiune">
                <h2>DESCRIERE CURS:</h2>
                <a href={curs.descriptionLink} target="_blank" rel="noopener noreferrer">Click here</a>
            </div>
            <div className="sectiune">
                <h2>Metoda notare:(componente)</h2>
            </div>
            <div className="sectiune bibliografie">
                <h2>Resurse bibliografice:</h2>
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
                    <p>No materials available</p>
                )}
            </div>
        </div>
    );
};

export default DetaliiCurs;
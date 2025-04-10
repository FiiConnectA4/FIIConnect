import { useState, useEffect } from 'react';
import './DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import ButonExtensibil from '../Components/ButonExtensibil';
import Edit from './../Components/Edit';

const DetaliiCurs = ({ curs, onBack }) => {
    const [profesor, setProfesor] = useState('');
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        // Fetch professor details for the selected course
        fetch(`/didactic/professor/${curs.professorId}`)
            .then(response => response.json())
            .then(data => {
                setProfesor(data.name);
            })
            .catch(error => {
                console.error('Error fetching professor:', error);
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
            <ButonExtensibil text={`Profesor: ${profesor}`} />
            <div className="sectiune">
                <h2>DESCRIERE CURS:</h2>
                <a href={curs.descriptionLink} target="_blank" rel="noopener noreferrer">Click here</a>
                <Edit />
            </div>
            <div className="sectiune">
                <h2>Metoda notare:(componente)</h2>
                <Edit />
            </div>
            <div className="sectiune bibliografie">
                <h2>Resurse bibliografice:</h2>
                <Edit />
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

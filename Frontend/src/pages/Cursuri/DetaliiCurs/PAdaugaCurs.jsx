import React, { useState } from 'react';
import './DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import Edit from './../Components/Edit';

const PAdaugaCurs = ({ professorId, onBack, onCreated }) => {
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [credits, setCredits] = useState('');

    const handleCreate = () => {
        const newCourse = {
            title,
            code,
            year,
            semester,
            credits,
            archived: false
        };

        fetch('/didactic/course?professorId=' + professorId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCourse)
        })
            .then(res => {
                if (!res.ok) throw new Error('Eroare la creare curs');
                alert('Curs creat cu succes!');
                if (onCreated) onCreated();
            })
            .catch(err => {
                console.error('Eroare la creare curs:', err);
                alert('Eroare la salvare!');
            });
    };

    return (
        <div className="detalii-container">
            <button className="buton-inapoi" onClick={onBack}>&lt; Înapoi</button>
            <div className="titlu-curs">
                <h1><u>Adaugă curs nou</u></h1>
                <Ceas />
            </div>

            <div className="sectiune">
                <h2>Titlu:</h2>
                <Edit value={title} onChange={setTitle} />
            </div>

            <div className="sectiune">
                <h2>Cod curs:</h2>
                <Edit value={code} onChange={setCode} />
            </div>

            <div className="sectiune">
                <h2>Anul:</h2>
                <Edit value={year} onChange={setYear} />
            </div>

            <div className="sectiune">
                <h2>Semestrul:</h2>
                <Edit value={semester} onChange={setSemester} />
            </div>

            <div className="sectiune">
                <h2>Credite:</h2>
                <Edit value={credits} onChange={setCredits} />
            </div>

            <button className="save-button" onClick={handleCreate}>Creează cursul</button>
        </div>
    );
};

export default PAdaugaCurs;
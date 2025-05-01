import React, { useState } from 'react';
import './PAdaugaCurs.css';

const AdaugaCurs = ({onBack, onCreated }) => {
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [credits, setCredits] = useState('');
    const [academicYear, setAcademicYear] = useState('');

    const handleCreate = () => {
        const newCourse = {
            title,
            code,
            year: parseInt(year),
            semester: parseInt(semester),
            credits: parseInt(credits),
            archived: 0,
            academicYear
        };

        console.log("📤 Trimitem JSON:", newCourse);

        fetch('/didactic/course', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCourse)
        })
            .then(res => {
                if (!res.ok) throw new Error("Eroare la creare curs");
                alert("✅ Curs adăugat cu succes!");
                if (onCreated) onCreated(); // dacă ai o funcție care revine la lista de cursuri
            })
            .catch(err => {
                console.error("⛔ Eroare la adăugare curs:", err);
                alert("Eroare la salvare!");
            });
    };

    return (
        <div className="detalii-container">
            <button className="buton-inapoi" onClick={onBack}>&lt; Înapoi</button>
            <div className="titlu-curs">
                <h1><u>Adaugă curs nou</u></h1>
            </div>

            <div className="sectiune">
                <h2>Titlu:</h2>
                <input className="input-curs" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div className="sectiune">
                <h2>Cod curs:</h2>
                <input className="input-curs" value={code} onChange={e => setCode(e.target.value)} />
            </div>

            <div className="sectiune">
                <h2>Anul:</h2>
                <input className="input-curs" value={year} onChange={e => setYear(e.target.value)} />
            </div>

            <div className="sectiune">
                <h2>Semestrul:</h2>
                <input className="input-curs" value={semester} onChange={e => setSemester(e.target.value)} />
            </div>

            <div className="sectiune">
                <h2>Credite:</h2>
                <input className="input-curs" value={credits} onChange={e => setCredits(e.target.value)} />
            </div>

            <div className="sectiune">
                <h2>An universitar:</h2>
                <input
                    className="input-curs"
                    type="date"
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                />
            </div>

            <button className="save-button" onClick={handleCreate}>Creează cursul</button>
        </div>
    );
};

export default AdaugaCurs;
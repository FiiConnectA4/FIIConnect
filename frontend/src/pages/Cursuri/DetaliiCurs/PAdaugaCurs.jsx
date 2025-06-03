import React, { useState } from 'react';
import './PAdaugaCurs.css';

const PAdaugaCurs = ({ professorId, onBack, onCreated }) => {
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [credits, setCredits] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const token = localStorage.getItem('token');

    const handleCreate = async () => {
        const newCourse = {
            title,
            code,
            year: parseInt(year),
            semester: parseInt(semester),
            credits: parseInt(credits),
            archived: 0,
            academicYear
        };

        try {
            console.log("📤 Trimitem JSON:", newCourse);

            const res = await fetch('/didactic/course', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' ,
                    Authorization: `Bearer ${token}`},
                body: JSON.stringify(newCourse)
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error("❌ Eroare creare curs: " + errText);
            }

            const location = res.headers.get('Location');
            const courseId = location ? parseInt(location.split('/').pop()) : null;

            if (!courseId || isNaN(courseId)) throw new Error("ID-ul cursului este invalid!");
            console.log("🆕 Curs creat cu id =", courseId);

            alert("✅ Curs creat și asociat cu succes!");
            if (onCreated) onCreated();

        } catch (err) {
            console.error("⛔ Eroare finală:", err);
            alert(err.message || "Eroare necunoscută");
        }
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

export default PAdaugaCurs;
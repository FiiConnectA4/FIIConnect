// src/components/TrimiteFeedback.js

import React, { useState, useEffect } from 'react';
import './TrimiteFeedback.css';
import ButonExtensibil from '../Components/ButonExtensibil';

// Dacă folosești proxy în package.json, lasă API_BASE_URL = ''
const API_BASE_URL = ''; // Setează aici baza URL-ului către backend, dacă nu folosești proxy

const TrimiteFeedback = ({ onBack, cursId }) => {
    const [formData, setFormData] = useState({
        message: ''
    });
    const [profesori, setProfesori] = useState([]);          // lista de profesori preluată
    const [selectedProfesor, setSelectedProfesor] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingProfesori, setLoadingProfesori] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        // Când componenta se montează, preluăm profesorii din backend
        const fetchProfesori = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/didactic/course/${cursId}`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                if (!res.ok) {
                    console.error(`HTTP error fetching profesori! Status: ${res.status}`);
                    setProfesori([]);
                    setLoadingProfesori(false);
                    return;
                }
                const data = await res.json();
                // Presupunem că data.professors are structura:
                // [
                //   { professor: { id: 10, firstName: "...", lastName: "..." }, ... },
                //   ...
                // ]
                const professorsArray = data.professors || [];
                if (Array.isArray(professorsArray)) {
                    const profList = professorsArray.map(prof => ({
                        id: prof.professor.id,
                        name: `${prof.professor.firstName} ${prof.professor.lastName}`
                    }));
                    setProfesori(profList);
                } else {
                    console.error('Răspuns invalid la fetch profesori:', data);
                    setProfesori([]);
                }
            } catch (err) {
                console.error('Eroare la încărcarea profesorilor:', err);
                setProfesori([]);
            } finally {
                setLoadingProfesori(false);
            }
        };

        fetchProfesori();
    }, [cursId, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfesorSelect = (profesor) => {
        setSelectedProfesor(profesor);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { message } = formData;

        if (!selectedProfesor) {
            setStatus({ type: 'error', message: 'Te rog selectează mai întâi un profesor.' });
            return;
        }
        if (!message.trim()) {
            setStatus({ type: 'error', message: 'Mesajul nu poate fi gol.' });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                professorId: selectedProfesor.id,
                courseId: cursId    // dacă backend-ul vrea și ID-ul cursului
            };

            const res = await fetch(`${API_BASE_URL}/didactic/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                // Citește textul de eroare, în caz că backend-ul returnează detaliat
                const text = await res.text();
                throw new Error(`Eroare la trimiterea feedback-ului. Status: ${res.status}. ${text}`);
            }

            setStatus({ type: 'success', message: 'Feedback-ul a fost trimis cu succes!' });
            setFormData({ message: '' });
            setSelectedProfesor(null);
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: err.message });
        } finally {
            setLoading(false);
        }
    };

    // Dacă lista de profesori nu a fost încă încărcată, afișăm un loading simplu
    if (loadingProfesori) {
        return <div className="loading">Se încarcă profesorii...</div>;
    }

    return (
        <div className="trimite-feedback-container">
            <button className="trimite-feedback-buton-inapoi" onClick={onBack}>
                ← Înapoi la detaliile cursului
            </button>

            <div className="trimite-feedback-header">
                <h1>Trimite Feedback</h1>
            </div>

            {/* Secțiunea de selectare a profesorului */}
            <div className="trimite-feedback-select-profesor">
                <label className="label-select-profesor"></label>
                <ButonExtensibil
                    text={selectedProfesor ? selectedProfesor.name : 'Selectează profesorul'}
                    professors={profesori}
                    onSelect={handleProfesorSelect}
                    selectedId={selectedProfesor ? selectedProfesor.id : null}
                />
            </div>

            <form onSubmit={handleSubmit} className="trimite-feedback-form">
                <textarea
                    name="message"
                    placeholder="Scrie aici mesajul tău..."
                    rows="6"
                    className="trimite-feedback-textarea"
                    value={formData.message}
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="trimite-feedback-btn-primary trimite-feedback-submit"
                    disabled={loading}
                >
                    {loading ? 'Se trimite...' : 'Trimite'}
                </button>

                {status && (
                    <div className={`trimite-feedback-status ${status.type}`}>
                        {status.message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default TrimiteFeedback;

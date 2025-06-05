import React, { useState } from 'react';
import './TrimiteFeedback.css';

const TrimiteFeedback = ({ onBack, curs, studentId }) => {
    const [formData, setFormData] = useState({
        feedbackText: '',
        teachingGrade: '',
        materialsGrade: '',
        evaluationGrade: ''
    });

    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const { feedbackText, teachingGrade, materialsGrade, evaluationGrade } = formData;
        const trimmedText = feedbackText.trim();

        if (!trimmedText || !teachingGrade || !materialsGrade || !evaluationGrade) {
            setStatus({ type: 'error', message: 'Completați toate câmpurile și notele.' });
            return;
        }

        if (!curs?.professorId || !studentId) {
            setStatus({ type: 'error', message: 'ID profesor sau student lipsă. Nu se poate trimite feedback.' });
            return;
        }

        const payload = {
            id: {
                idProf: curs.professorId,
                idStud: studentId
            },
            feedbackText: trimmedText,
            teachingGrade: parseInt(teachingGrade),
            materialsGrade: parseInt(materialsGrade),
            evaluationGrade: parseInt(evaluationGrade)
        };

        console.log("📤 Trimitem feedback:", payload);

        setLoading(true);
        setStatus(null);

        try {
            const response = await fetch('/didactic/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Eroare la trimiterea feedback-ului.');
            }

            setStatus({ type: 'success', message: '✅ Feedback-ul a fost trimis cu succes!' });
            setFormData({
                feedbackText: '',
                teachingGrade: '',
                materialsGrade: '',
                evaluationGrade: ''
            });
        } catch (err) {
            console.error("❌ Eroare trimis feedback:", err);
            setStatus({ type: 'error', message: err.message || 'A apărut o eroare.' });
        } finally {
            setLoading(false);
        }
    };

    const renderGradeDropdown = (label, name) => (
        <div className="trimite-feedback-dropdown">
            <label htmlFor={name} className="sr-only">{label}</label>
            <select
                id={name}
                name={name}
                className="trimite-feedback-select"
                value={formData[name]}
                onChange={handleChange}
                required
            >
                <option value="">Selectează nota</option>
                {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="trimite-feedback-container">
            <button className="trimite-feedback-buton-inapoi" onClick={onBack}>
                ← Înapoi la detalii curs
            </button>

            <div className="trimite-feedback-header">
                <h1>Trimite Feedback</h1>
            </div>

            <form onSubmit={handleSubmit} className="trimite-feedback-form">
                <textarea
                    id="feedbackText"
                    name="feedbackText"
                    placeholder="Scrie aici mesajul tău..."
                    rows="6"
                    className="trimite-feedback-textarea"
                    value={formData.feedbackText}
                    onChange={handleChange}
                />

                {renderGradeDropdown("Nota pentru predare:", "teachingGrade")}
                {renderGradeDropdown("Nota pentru materiale:", "materialsGrade")}
                {renderGradeDropdown("Nota pentru evaluare:", "evaluationGrade")}

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
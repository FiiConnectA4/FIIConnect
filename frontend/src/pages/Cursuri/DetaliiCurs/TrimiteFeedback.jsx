import React, { useState } from 'react';
import './TrimiteFeedback.css';

const TrimiteFeedback = ({ onBack }) => {
    const [formData, setFormData] = useState({
        message: ''
    });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { message } = formData;

        if (!message.trim()) {
            setStatus({ type: 'error', message: 'Mesajul nu poate fi gol.' });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Eroare la trimiterea feedback-ului.');

            setStatus({ type: 'success', message: 'Feedback-ul a fost trimis cu succes!' });
            setFormData({ message: '' });
        } catch (err) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="trimite-feedback-container">
            <button className="trimite-feedback-buton-inapoi" onClick={onBack}>
                ← Înapoi la detaliile cursului
            </button>

            <div className="trimite-feedback-header">
                <h1>Trimite Feedback</h1>
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

                <button type="submit" className="trimite-feedback-btn-primary trimite-feedback-submit" disabled={loading}>
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

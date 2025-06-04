import React, { useState } from 'react';

const PAdaugaCurs = ({ professorId, onBack, onCreated }) => {
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [credits, setCredits] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const token = localStorage?.getItem('token') || 'demo-token';

    const handleCreate = async () => {
        // Validation
        if (!title.trim() || !code.trim() || !year || !semester || !credits || !academicYear.trim()) {
            alert('❌ Te rog să completezi toate câmpurile obligatorii!');
            return;
        }

        setIsLoading(true);

        const newCourse = {
            title: title,
            code: code.trim().toUpperCase(),
            year: parseInt(year),
            semester: parseInt(semester),
            credits: parseInt(credits),
            archived: 0,
            academicYear: academicYear.trim()
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleCreate();
        }
    };

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    return (
        <div className="modern-course-form" data-theme={isDarkTheme ? "dark" : "light"}>
            <div className="form-header">
                <div className="header-top">
                    <button className="back-button" onClick={onBack} disabled={isLoading}>
                        <span className="back-icon">←</span>
                        Înapoi
                    </button>
                </div>
                <div className="form-title">
                    <h1>Adaugă curs nou</h1>
                    <p className="form-subtitle">Completează informațiile pentru noul curs</p>
                </div>
            </div>

            <div className="form-content">
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            <span className="label-text">Titlu curs</span>
                            <span className="required">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="ex: Programare Orientată pe Obiecte"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="code" className="form-label">
                            <span className="label-text">Cod curs</span>
                            <span className="required">*</span>
                        </label>
                        <input
                            id="code"
                            type="text"
                            className="form-input"
                            value={code}
                            onChange={e => setCode(e.target.value.toUpperCase())}
                            onKeyPress={handleKeyPress}
                            placeholder="ex: POO2024"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="year" className="form-label">
                                <span className="label-text">Anul de studiu</span>
                                <span className="required">*</span>
                            </label>
                            <select
                                id="year"
                                className="form-select"
                                value={year}
                                onChange={e => setYear(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="">Selectează anul</option>
                                <option value="1">Anul I</option>
                                <option value="2">Anul II</option>
                                <option value="3">Anul III</option>
                                <option value="4">Anul IV</option>
                                <option value="5">Anul V</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="semester" className="form-label">
                                <span className="label-text">Semestrul</span>
                                <span className="required">*</span>
                            </label>
                            <select
                                id="semester"
                                className="form-select"
                                value={semester}
                                onChange={e => setSemester(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="">Selectează semestrul</option>
                                <option value="1">Semestrul I</option>
                                <option value="2">Semestrul II</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="credits" className="form-label">
                                <span className="label-text">Credite</span>
                                <span className="required">*</span>
                            </label>
                            <select
                                id="credits"
                                className="form-select"
                                value={credits}
                                onChange={e => setCredits(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="">Selectează creditele</option>
                                {[...Array(6)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? 'credit' : 'credite'}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="academicYear" className="form-label">
                            <span className="label-text">An universitar</span>
                            <span className="required">*</span>
                        </label>
                        <input
                            id="academicYear"
                            type="text"
                            className="form-input"
                            value={academicYear}
                            onChange={e => setAcademicYear(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="ex: 2024-2025"
                            disabled={isLoading}
                        />
                        <span className="input-hint">Format: YYYY-YYYY (ex: 2024-2025)</span>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        className={`create-button ${isLoading ? 'loading' : ''}`}
                        onClick={handleCreate}
                        disabled={isLoading || !title.trim() || !code.trim() || !year || !semester || !credits || !academicYear.trim()}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Se creează...
                            </>
                        ) : (
                            <>
                                <span className="create-icon">+</span>
                                Creează cursul
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PAdaugaCurs;
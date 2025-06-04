// src/DetaliiCurs/AssignUsersToCourses.jsx

import React, { useState, useEffect } from 'react';
import './AssignUsersToCourses.css';

const AssignUsersToCourses = ({ onBack }) => {
    // State pentru tipul de utilizator ales (student/profesor)
    const [userType, setUserType] = useState('student');
    // Listele de studenți, profesori și cursuri
    const [students, setStudents] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [courses, setCourses] = useState([]);
    // Set-uri pentru ID-urile selectate
    const [selectedUserIds, setSelectedUserIds] = useState(new Set());
    const [selectedCourseIds, setSelectedCourseIds] = useState(new Set());
    // Loading și mesaje de status
    const [loading, setLoading] = useState(true);
    const [assignmentLoading, setAssignmentLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch studenți
                const studentsRes = await fetch('/didactic/student', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const studentsData = await studentsRes.json();
                setStudents(studentsData._embedded?.studentList || []);

                // Fetch profesori
                const professorsRes = await fetch('/didactic/professor', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const professorsData = await professorsRes.json();
                setProfessors(professorsData._embedded?.professorList || []);

                // Fetch cursuri ne-arhivate
                const coursesRes = await fetch('/didactic/course', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const coursesData = await coursesRes.json();
                setCourses(
                    coursesData._embedded?.courseList.filter((c) => c.archived === 0) ||
                    []
                );
            } catch (error) {
                console.error('Error fetching data:', error);
                setStatus({
                    type: 'error',
                    message: 'Eroare la încărcarea datelor.',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
        setSelectedUserIds(new Set());
    };

    const handleUserSelection = (userId) => {
        setSelectedUserIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    };

    const handleCourseSelection = (courseId) => {
        setSelectedCourseIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(courseId)) {
                newSet.delete(courseId);
            } else {
                newSet.add(courseId);
            }
            return newSet;
        });
    };

    const handleAssign = async () => {
        if (selectedUserIds.size === 0 || selectedCourseIds.size === 0) {
            setStatus({
                type: 'error',
                message: 'Vă rugăm să selectați cel puțin un utilizator și un curs.',
            });
            return;
        }

        setAssignmentLoading(true);
        setStatus(null);

        try {
            const payload = {
                userIds: Array.from(selectedUserIds),
                courseIds: Array.from(selectedCourseIds),
                userType: userType,
            };

            const res = await fetch('/didactic/assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                const errorMessage =
                    errorData.message ||
                    'Eroare la atribuire. Vă rugăm să încercați din nou.';
                throw new Error(errorMessage);
            }

            setStatus({
                type: 'success',
                message: 'Atribuirea a fost realizată cu succes!',
            });
            setSelectedUserIds(new Set());
            setSelectedCourseIds(new Set());
        } catch (error) {
            console.error('Assignment error:', error);
            setStatus({
                type: 'error',
                message:
                    error.message ||
                    'A apărut o eroare neașteptată la atribuire.',
            });
        } finally {
            setAssignmentLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="trimite-feedback-container">
                Se încarcă datele pentru atribuire...
            </div>
        );
    }

    return (
        <div className="trimite-feedback-container">
            {/* Buton Înapoi */}
            <button
                onClick={onBack}
                className="trimite-feedback-buton-inapoi"
            >
                ← Înapoi la Administrare
            </button>

            <div className="trimite-feedback-header">
                <h1>Atribuire Utilizatori la Cursuri</h1>
            </div>

            <form
                className="trimite-feedback-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAssign();
                }}
            >
                {/* Select tip utilizator */}
                <select
                    className="trimite-feedback-select"
                    value={userType}
                    onChange={handleUserTypeChange}
                >
                    <option value="student">Studenti</option>
                    <option value="professor">Profesori</option>
                </select>

                {/* Lista de utilizatori */}
                <div className="trimite-feedback-lista-users">
                    {userType === 'student' ? (
                        students.length > 0 ? (
                            students.map((student) => (
                                <label
                                    key={student.id}
                                    className="trimite-feedback-user-item"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedUserIds.has(student.id)}
                                        onChange={() => handleUserSelection(student.id)}
                                    />
                                    {student.name} {student.surname} (Grupa:{' '}
                                    {student.group})
                                </label>
                            ))
                        ) : (
                            <p>Nu există studenți disponibili.</p>
                        )
                    ) : professors.length > 0 ? (
                        professors.map((prof) => (
                            <label
                                key={prof.id}
                                className="trimite-feedback-user-item"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedUserIds.has(prof.id)}
                                    onChange={() => handleUserSelection(prof.id)}
                                />
                                {prof.name} {prof.surname}
                            </label>
                        ))
                    ) : (
                        <p>Nu există profesori disponibili.</p>
                    )}
                </div>

                {/* Lista de cursuri */}
                <div className="trimite-feedback-lista-cursuri">
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <label
                                key={course.id}
                                className="trimite-feedback-course-item"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCourseIds.has(course.id)}
                                    onChange={() => handleCourseSelection(course.id)}
                                />
                                {course.title}
                            </label>
                        ))
                    ) : (
                        <p>Nu există cursuri ne-arhivate disponibile.</p>
                    )}
                </div>

                {/* Buton de submit */}
                <div className="text-right">
                    <button
                        type="submit"
                        className="trimite-feedback-btn-primary trimite-feedback-submit"
                        disabled={
                            assignmentLoading ||
                            selectedUserIds.size === 0 ||
                            selectedCourseIds.size === 0
                        }
                    >
                        {assignmentLoading
                            ? 'Se Atribuie...'
                            : 'Atribuie Selectate'}
                    </button>
                </div>

                {/* Mesaj de status */}
                {status && (
                    <div
                        className={`trimite-feedback-status ${status.type === 'success' ? 'success' : 'error'
                            }`}
                    >
                        {status.message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default AssignUsersToCourses;

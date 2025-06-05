import React, { useState, useEffect } from 'react';
import './AssignUsersToCourses.css'; // CSS unificat pentru ambele moduri

const AssignEntitiesToCourses = ({ onBack }) => {
    // --- STATE PENTRU DATE ---
    const [mode, setMode] = useState('student'); // 'student' sau 'professor'
    const [students, setStudents] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [courses, setCourses] = useState([]);

    const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
    const [selectedProfessorIds, setSelectedProfessorIds] = useState(new Set());
    const [professorRoles, setProfessorRoles] = useState({});
    // { [profId]: 'titular' | 'seminar' | 'laborator' }

    const [selectedCourseIds, setSelectedCourseIds] = useState(new Set());

    const [loading, setLoading] = useState(true);
    const [assignLoading, setAssignLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const token = localStorage.getItem('token');

    // --- FETCH AL DATELOR: studenți, profesori și cursuri NE-ARHIVATE ---
    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                console.log('--- fetchAll: începe încărcarea datelor ---');
                console.log('Token folosit:', token);

                // 1. Fetch studenți
                console.log('📡 Fetching students from /didactic/student...');
                const studentsRes = await fetch('/didactic/student', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('↩️ Students response status:', studentsRes.status);
                if (!studentsRes.ok) {
                    let errMsg = `Studenți HTTP ${studentsRes.status}`;
                    try {
                        const errJson = await studentsRes.json();
                        console.log('📨 Students error body:', errJson);
                        errMsg += ` – ${errJson.message || JSON.stringify(errJson)}`;
                    } catch { }
                    throw new Error(errMsg);
                }
                const studentsData = await studentsRes.json();
                console.log('✅ Students data primită:', studentsData);
                setStudents(Array.isArray(studentsData) ? studentsData : []);

                // 2. Fetch profesori
                console.log('📡 Fetching professors from /didactic/professor...');
                const profRes = await fetch('/didactic/professor', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('↩️ Professors response status:', profRes.status);
                if (!profRes.ok) {
                    let errMsg = `Profesori HTTP ${profRes.status}`;
                    try {
                        const errJson = await profRes.json();
                        console.log('📨 Professors error body:', errJson);
                        errMsg += ` – ${errJson.message || JSON.stringify(errJson)}`;
                    } catch { }
                    throw new Error(errMsg);
                }
                const profData = await profRes.json();
                console.log('✅ Professors data primită:', profData);
                setProfessors(Array.isArray(profData) ? profData : []);

                // 3. Fetch cursuri ne-arhivate
                console.log('📡 Fetching courses from /didactic/course...');
                const coursesRes = await fetch('/didactic/course', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('↩️ Courses response status:', coursesRes.status);
                if (!coursesRes.ok) {
                    let errMsg = `Cursuri HTTP ${coursesRes.status}`;
                    try {
                        const errJson = await coursesRes.json();
                        console.log('📨 Courses error body:', errJson);
                        errMsg += ` – ${errJson.message || JSON.stringify(errJson)}`;
                    } catch { }
                    throw new Error(errMsg);
                }
                const coursesData = await coursesRes.json();
                console.log('✅ Courses data brută:', coursesData);
                const allCourses = Array.isArray(coursesData)
                    ? coursesData
                    : coursesData._embedded?.courseList || [];
                const filtered = allCourses.filter((c) => c.archived === 0);
                console.log('👉 Cursuri ne-arhivate (filtered):', filtered);
                setCourses(filtered);
            } catch (error) {
                console.error('❌ Error fetchAll:', error);
                setStatus({
                    type: 'error',
                    message: 'Eroare la încărcarea datelor.',
                });
            } finally {
                console.log('--- fetchAll: s-a încheiat încărcarea datelor ---');
                setLoading(false);
            }
        };

        fetchAll();
    }, [token]);

    // --- HANDLERE PENTRU SELECTAREA CU CHECKBOX-URI ---
    const handleStudentSelection = (studentId) => {
        setSelectedStudentIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(studentId)) newSet.delete(studentId);
            else newSet.add(studentId);
            return newSet;
        });
    };

    const handleProfessorSelection = (professorId) => {
        setSelectedProfessorIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(professorId)) {
                // dacă deselectăm profesor, îl scoatem și din professorRoles
                newSet.delete(professorId);
                setProfessorRoles((old) => {
                    const copy = { ...old };
                    delete copy[professorId];
                    return copy;
                });
            } else {
                newSet.add(professorId);
                // inițial, rol-ul implicit este 'titular'
                setProfessorRoles((old) => ({
                    ...old,
                    [professorId]: 'titular',
                }));
            }
            return newSet;
        });
    };

    const handleCourseSelection = (courseId) => {
        setSelectedCourseIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(courseId)) newSet.delete(courseId);
            else newSet.add(courseId);
            return newSet;
        });
    };

    const handleRoleChange = (professorId, newRole) => {
        setProfessorRoles((old) => ({
            ...old,
            [professorId]: newRole,
        }));
    };

    // --- HANDLER PENTRU TRIMITERE (Student sau Profesor) ---
    const handleSubmit = async () => {
        // Verificăm că s-a selectat măcar o entitate (în funcție de modul curent)
        if (
            (mode === 'student' && selectedStudentIds.size === 0) ||
            (mode === 'professor' && selectedProfessorIds.size === 0) ||
            selectedCourseIds.size === 0
        ) {
            setStatus({
                type: 'error',
                message:
                    mode === 'student'
                        ? 'Selectează cel puțin un student și un curs.'
                        : 'Selectează cel puțin un profesor și un curs.',
            });
            return;
        }

        // Dacă suntem la profesor, ne asigurăm că pentru fiecare profesor există un rol
        if (mode === 'professor') {
            for (let profId of selectedProfessorIds) {
                if (!professorRoles[profId]) {
                    setStatus({
                        type: 'error',
                        message: 'Te rugăm să alegi rolul pentru fiecare profesor selectat.',
                    });
                    return;
                }
            }
        }

        setAssignLoading(true);
        setStatus(null);
        console.log(
            `--- handleSubmit (${mode}): începe procesul de ${mode === 'student' ? 'înscriere' : 'asignare'
            } ---`
        );
        console.log(
            mode === 'student' ? 'Studenți selectați:' : 'Profesori selectați:',
            mode === 'student'
                ? Array.from(selectedStudentIds)
                : Array.from(selectedProfessorIds)
        );
        console.log('Cursuri selectate:', Array.from(selectedCourseIds));
        if (mode === 'professor') console.log('Roluri selectate:', professorRoles);

        try {
            const promises = [];

            if (mode === 'student') {
                // 1. STUDENT: pentru fiecare studId și fiecare courseId, construim payload-ul
                Array.from(selectedStudentIds).forEach((studId) => {
                    const student = students.find((s) => s.id === studId);
                    // extracem facultyGroup (poate fi sub numele student.group sau student.facultyGroup)
                    const facultyGroup = student?.facultyGroup ?? student?.group ?? '';
                    Array.from(selectedCourseIds).forEach((courseId) => {
                        const payload = {
                            id: {
                                idStud: studId,
                                idCourse: courseId,
                            },
                            facultyGroup: facultyGroup,
                        };
                        console.log('📨 Trimitem STUDENT payload spre /didactic/enroll:', payload);

                        const p = fetch('/didactic/enroll', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(payload),
                        }).then(async (res) => {
                            console.log(`↩️ enroll(${studId}, ${courseId}) status:`, res.status);
                            if (!res.ok) {
                                let errorMessage = `Enroll HTTP ${res.status}`;
                                try {
                                    const errJson = await res.json();
                                    console.log('📨 enroll error body:', errJson);
                                    errorMessage += ` – ${errJson.message || JSON.stringify(errJson)}`;
                                } catch { }
                                throw new Error(errorMessage);
                            }
                            return res;
                        });

                        promises.push(p);
                    });
                });
            } else {
                // 2. PROFESSOR: pentru fiecare profId și fiecare courseId, construim payload-ul cu rol,
                //        dar trimitem către endpoint-ul nou /didactic/teach
                Array.from(selectedProfessorIds).forEach((profId) => {
                    Array.from(selectedCourseIds).forEach((courseId) => {
                        const payload = {
                            id: {
                                idProf: profId,
                                idCourse: courseId,
                            },
                            role: professorRoles[profId],
                        };
                        console.log('📨 Trimitem PROFESSOR payload spre /didactic/teach:', payload);

                        const p = fetch('/didactic/teach', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(payload),
                        }).then(async (res) => {
                            console.log(
                                `↩️ teach(prof ${profId}, curs ${courseId}) status:`,
                                res.status
                            );
                            if (!res.ok) {
                                let errorMessage = `Teach HTTP ${res.status}`;
                                try {
                                    const errJson = await res.json();
                                    console.log('📨 teach error body:', errJson);
                                    errorMessage += ` – ${errJson.message || JSON.stringify(errJson)}`;
                                } catch { }
                                throw new Error(errorMessage);
                            }
                            return res;
                        });

                        promises.push(p);
                    });
                });
            }

            const responses = await Promise.all(promises);
            console.log('✅ Toate răspunsurile ok:', responses.map((r) => r.status));

            setStatus({
                type: 'success',
                message:
                    mode === 'student'
                        ? 'Înscrierea studenților la cursuri a fost realizată cu succes!'
                        : 'Asignarea profesorilor la cursuri a fost realizată cu succes!',
            });
            // Resetăm selecțiile
            setSelectedStudentIds(new Set());
            setSelectedProfessorIds(new Set());
            setSelectedCourseIds(new Set());
            setProfessorRoles({});
        } catch (error) {
            console.error(
                `❌ ${mode === 'student' ? 'Enroll' : 'Teach'} error:`,
                error
            );
            setStatus({
                type: 'error',
                message: error.message || 'A apărut o eroare neașteptată.',
            });
        } finally {
            console.log(
                `--- handleSubmit (${mode}): s-a încheiat procesul de ${mode === 'student' ? 'înscriere' : 'asignare'
                } ---`
            );
            setAssignLoading(false);
        }
    };

    // --- RENDER: loading, switch de mod, liste + formular ---
    if (loading) {
        return (
            <div className="trimite-feedback-container">
                Se încarcă datele (studenți, profesori, cursuri)…
            </div>
        );
    }

    return (
        <div className="trimite-feedback-container">
            {/* Buton Înapoi */}
            <button onClick={onBack} className="trimite-feedback-buton-inapoi">
                ← Înapoi la Administrare
            </button>

            <div className="trimite-feedback-header">
                <h1>
                    {mode === 'student'
                        ? 'Înscriere Studenți la Cursuri'
                        : 'Asignare Profesori la Cursuri'}
                </h1>
            </div>

            {/* Switch de mod: Student vs Profesor */}
            <div className="mode-switch">
                <label>
                    <input
                        type="radio"
                        name="mode"
                        value="student"
                        checked={mode === 'student'}
                        onChange={() => {
                            setMode('student');
                            setStatus(null);
                            setSelectedProfessorIds(new Set());
                            setSelectedCourseIds(new Set());
                            setSelectedStudentIds(new Set());
                            setProfessorRoles({});
                        }}
                    />
                    Student
                </label>
                <label>
                    <input
                        type="radio"
                        name="mode"
                        value="professor"
                        checked={mode === 'professor'}
                        onChange={() => {
                            setMode('professor');
                            setStatus(null);
                            setSelectedStudentIds(new Set());
                            setSelectedCourseIds(new Set());
                            setSelectedProfessorIds(new Set());
                            setProfessorRoles({});
                        }}
                    />
                    Profesor
                </label>
            </div>

            <form
                className="trimite-feedback-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                {/* Dacă suntem în modul “student”: afișăm lista de studenți */}
                {mode === 'student' && (
                    <div className="trimite-feedback-lista-users">
                        {students.length > 0 ? (
                            students.map((student) => (
                                <label
                                    key={student.id}
                                    className="trimite-feedback-user-item"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedStudentIds.has(student.id)}
                                        onChange={() => handleStudentSelection(student.id)}
                                    />
                                    <span className="user-text">
                                        {student.firstName} {student.lastName}{' '}
                                        {student.group || student.facultyGroup
                                            ? `(Grupa: ${student.group ?? student.facultyGroup})`
                                            : '(Grupa: –)'}
                                    </span>
                                </label>
                            ))
                        ) : (
                            <p>Nu există studenți disponibili.</p>
                        )}
                    </div>
                )}

                {/* Dacă suntem în modul “professor”: afișăm lista de profesori + dropdown-uri per profesor */}
                {mode === 'professor' && (
                    <div className="trimite-feedback-lista-users">
                        {professors.length > 0 ? (
                            professors.map((prof) => (
                                <div
                                    key={prof.id}
                                    className="professor-item"
                                >
                                    <label className="trimite-feedback-user-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedProfessorIds.has(prof.id)}
                                            onChange={() => handleProfessorSelection(prof.id)}
                                        />
                                        <span className="user-text">
                                            {prof.firstName} {prof.lastName}{' '}
                                            {prof.title ? `(${prof.title})` : ''}
                                        </span>
                                    </label>
                                    {selectedProfessorIds.has(prof.id) && (
                                        <select
                                            className="role-dropdown"
                                            value={professorRoles[prof.id] || 'titular'}
                                            onChange={(e) =>
                                                handleRoleChange(prof.id, e.target.value)
                                            }
                                        >
                                            <option value="titular">titular</option>
                                            <option value="seminar">seminar</option>
                                            <option value="laborator">laborator</option>
                                        </select>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>Nu există profesori disponibili.</p>
                        )}
                    </div>
                )}

                {/* Lista de cursuri este comună pentru ambele moduri */}
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
                                <span className="course-text">{course.title}</span>
                            </label>
                        ))
                    ) : (
                        <p>Nu există cursuri ne-arhivate disponibile.</p>
                    )}
                </div>

                {/* Buton de submit */}
                <div className="submit-container">
                    <button
                        type="submit"
                        className="trimite-feedback-btn-primary trimite-feedback-submit"
                        disabled={
                            assignLoading ||
                            (mode === 'student'
                                ? selectedStudentIds.size === 0 || selectedCourseIds.size === 0
                                : selectedProfessorIds.size === 0 || selectedCourseIds.size === 0)
                        }
                    >
                        {assignLoading
                            ? mode === 'student'
                                ? 'Se înscriu studenții...'
                                : 'Se înscriu profesorii...'
                            : mode === 'student'
                                ? 'Înregistrează Studenți'
                                : 'Înregistrează Profesori'}
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

export default AssignEntitiesToCourses;

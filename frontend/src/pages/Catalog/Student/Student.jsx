import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Student.css';

const API_BASE_URL = '';

async function getStudentId(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/person/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.role !== 'ROLE_STUDENT' || !data.student?.id) {
            throw new Error('Utilizatorul nu este student sau lipsește ID-ul');
        }

        return data.student.id;
    } catch (error) {
        console.error('Error fetching student ID:', error);
        return null;
    }
}

const StudentCatalog = () => {
    const [semestre, setSemestre] = useState([]);
    const [selectedSem, setSelectedSem] = useState('');
    const [bySem, setBySem] = useState({});
    const [curCatalog, setCurCatalog] = useState([]);
    const [points, setPoints] = useState(0);
    const [avg, setAvg] = useState(0);
    const [loading, setLoading] = useState(true);
    const [studentId, setStudentId] = useState(null);

    // Modal state for PDF download
    const [showModal, setShowModal] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [downloadLoading, setDownloadLoading] = useState(false);

    // Modal state for transfer request
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [transferReason, setTransferReason] = useState('');
    const [transferLoading, setTransferLoading] = useState(false);
    const [availableGroups, setAvailableGroups] = useState([]);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        getStudentId(token).then(id => {
            if (id) {
                setStudentId(id);
            } else {
                setLoading(false);
            }
        });
    }, [token]);

    useEffect(() => {
        if (!studentId) return;

        (async () => {
            try {
                const res = await fetch('/didactic/course', { headers:{ Authorization: `Bearer ${token}` } });
                const body = await res.json();
                const courses = body._embedded?.courseList ?? [];

                if (!courses.length) {
                    setLoading(false);
                    return;
                }

                const detailPromises = courses.map(async c => {
                    const [gradesRes, detailRes] = await Promise.all([
                        fetch(`/didactic/course/${c.id}/grades`, { headers:{ Authorization: `Bearer ${token}` }}),
                        fetch(`/didactic/course/${c.id}`, {headers:{ Authorization: `Bearer ${token}` } })
                    ]);

                    const grades = await gradesRes.json();
                    const det = await detailRes.json();

                    var myGrade = grades.find(g => Number(g.student?.id) === studentId);
                    if (!myGrade)
                        myGrade = { value: '' };

                    const teaching = det.professors?.[0];
                    const profObj = teaching?.professor;
                    const profName = profObj ? `${profObj.firstName} ${profObj.lastName}` : '—';

                    return {
                        courseId: c.id,
                        semestru: `Semestrul ${det.semester}`,
                        curs: det.title,
                        profesor: profName,
                        credite: det.credits,
                        nota: myGrade.value
                    };
                });

                const raw = (await Promise.all(detailPromises)).filter(Boolean);

                const grouped = raw.reduce((acc, row) => {
                    (acc[row.semestru] = acc[row.semestru] || []).push(row);
                    return acc;
                }, {});
                const semKeys = Object.keys(grouped);

                setSemestre(semKeys);
                setSelectedSem(semKeys[0] || '');
                setBySem(grouped);
                setLoading(false);
            } catch (err) {
                console.error('⛔  Eroare catalog student:', err);
                setLoading(false);
            }
        })();
    }, [studentId]);

    useEffect(() => {
        const cursuri = bySem[selectedSem] || [];
        setCurCatalog(cursuri);

        const p = cursuri.reduce((s, c) => s + c.credite * c.nota, 0);
        const cr = cursuri.reduce((s, c) => s + c.credite, 0);
        setPoints(p);
        setAvg(cr ? (p / cr).toFixed(2) : 0);
    }, [selectedSem, bySem]);

    // Fetch available groups when a course is selected for transfer
    const fetchAvailableGroups = async (courseId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/didactic/course/${courseId}/groups`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const groups = await response.json();
                setAvailableGroups(groups);
            } else {
                // If no specific endpoint exists, provide default group options
                setAvailableGroups([
                    { id: 'A', name: 'Grupa A' },
                    { id: 'B', name: 'Grupa B' },
                    { id: 'C', name: 'Grupa C' },
                    { id: 'D', name: 'Grupa D' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
            // Fallback to default groups
            setAvailableGroups([
                { id: 'A', name: 'Grupa A' },
                { id: 'B', name: 'Grupa B' },
                { id: 'C', name: 'Grupa C' },
                { id: 'D', name: 'Grupa D' }
            ]);
        }
    };

    const handleCourseSelection = (courseId) => {
        setSelectedCourse(courseId);
        setSelectedGroup('');
        if (courseId) {
            fetchAvailableGroups(courseId);
        } else {
            setAvailableGroups([]);
        }
    };

    const submitTransferRequest = async () => {
        if (!selectedCourse || !selectedGroup || !transferReason.trim()) {
            alert('Vă rugăm să completați toate câmpurile obligatorii.');
            return;
        }

        if (transferReason.length > 300) {
            alert('Motivul nu poate depăși 300 de caractere.');
            return;
        }

        setTransferLoading(true);

        try {
            const transferRequest = {
                id: {
                    idStud: studentId,
                    idCourse: parseInt(selectedCourse)
                },
                targetGroup: selectedGroup,
                reasonText: transferReason,
                requestDate: new Date().toISOString()
            };

            const response = await fetch(`${API_BASE_URL}/didactic/transfer`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transferRequest)
            });

            if (response.ok) {
                alert('Cererea de transfer a fost trimisă cu succes!');
                handleTransferModalClose();
            } else {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 409) {
                    alert('Există deja o cerere de transfer pentru acest curs.');
                } else {
                    alert(`Eroare la trimiterea cererii: ${errorData.message || 'Eroare necunoscută'}`);
                }
            }
        } catch (error) {
            console.error('Error submitting transfer request:', error);
            alert('Eroare la trimiterea cererii de transfer. Vă rugăm să încercați din nou.');
        } finally {
            setTransferLoading(false);
        }
    };

    const handleTransferModalClose = () => {
        setShowTransferModal(false);
        setSelectedCourse('');
        setSelectedGroup('');
        setTransferReason('');
        setAvailableGroups([]);
    };

    const downloadPDF = async () => {
        if (!studentId) {
            alert('ID student nu este disponibil');
            return;
        }

        setDownloadLoading(true);

        try {
            // Build query parameters
            const params = new URLSearchParams();
            if (selectedYear) params.append('year', selectedYear);
            if (selectedSemester) params.append('semester', selectedSemester);

            const queryString = params.toString();
            const url = `${API_BASE_URL}/didactic/student/${studentId}/grades/pdf${queryString ? `?${queryString}` : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Get the PDF blob
            const blob = await response.blob();

            // Create download link
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            // Extract filename from response headers or use default
            const contentDisposition = response.headers.get('content-disposition');
            let filename = 'catalog_note.pdf'; // Default filename
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename=["']?([^"']+)["']?/i);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/\.pdf_$/i, '.pdf'); // Clean up trailing underscore
                }
            }

            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            // Close modal
            setShowModal(false);
            setSelectedYear('');
            setSelectedSemester('');

        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Eroare la descărcarea PDF-ului. Vă rugăm să încercați din nou.');
        } finally {
            setDownloadLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedYear('');
        setSelectedSemester('');
    };

    // Generate year options (current year and previous years)
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = currentYear; year >= currentYear - 10; year--) {
        yearOptions.push(year);
    }

    // Get all courses for transfer dropdown
    const allCourses = Object.values(bySem).flat();

    if (loading) return <div className="container-catalog">Se încarcă catalogul…</div>;

    return (
        <div className="container-catalog">
            <div className="catalog-header">
                <h1>CATALOG</h1>
                <div className="select-controls">
                    <select
                        value={selectedSem}
                        onChange={e => setSelectedSem(e.target.value)}
                    >
                        {semestre.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="catalog-table">
                <table>
                    <thead>
                    <tr className="titlu">
                        <th>Curs</th><th>Profesor</th><th>Credite</th><th>Notă</th><th>Fișa</th>
                    </tr>
                    </thead>
                    <tbody>
                    {curCatalog.length === 0 && (
                        <tr><td colSpan="5">Nu există note pentru semestrul selectat.</td></tr>
                    )}
                    {curCatalog.map((c, i) => (
                        <tr key={i}>
                            <td>{c.curs}</td>
                            <td>{c.profesor}</td>
                            <td>{c.credite}</td>
                            <td>{c.nota}</td>
                            <td>
                                <button onClick={() => navigate(`/app/catalog/activity-sheet/${c.courseId}`)}>
                                    <img src="/icons/edit-icon.png" alt="Fișa" className="icon-img" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="catalog-footer">
                <div className="catalog-buttons">
                    <button className="buton-catalog" onClick={() => setShowModal(true)}>
                        Descarcă PDF
                    </button>
                    <button className="buton-catalog" onClick={() => setShowTransferModal(true)}>
                        Cerere Transfer
                    </button>
                </div>
                <div className="stats">
                    <p><strong>Punctaj final:</strong> {points}</p>
                    <p><strong>Media finală:</strong> {avg}</p>
                </div>
            </div>

            {/* Modal for PDF download options */}
            {showModal && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Descarcă Catalog PDF</h3>
                            <button className="modal-close" onClick={handleModalClose}>×</button>
                        </div>

                        <div className="modal-body">
                            <p>Selectează criteriile pentru descărcarea catalogului:</p>

                            <div className="filter-group">
                                <label htmlFor="year-select">An academic:</label>
                                <select
                                    id="year-select"
                                    value={selectedYear}
                                    onChange={e => setSelectedYear(e.target.value)}
                                >
                                    <option value="">Toti anii </option>
                                    <option value="1">Anul 1</option>
                                    <option value="2">Anul 2</option>
                                    <option value="3">Anul 3</option>
                                    <option value="4">Anul 4</option>
                                    <option value="5">Anul 5</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label htmlFor="semester-select">Semestru:</label>
                                <select
                                    id="semester-select"
                                    value={selectedSemester}
                                    onChange={e => setSelectedSemester(e.target.value)}
                                >
                                    <option value="">Toate semestrele</option>
                                    <option value="1">Semestrul 1</option>
                                    <option value="2">Semestrul 2</option>
                                </select>
                            </div>

                            {!selectedYear && !selectedSemester && (
                                <p className="info-text">
                                    <em>Fără selecții, se vor descărca toate notele.</em>
                                </p>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn-cancel"
                                onClick={handleModalClose}
                                disabled={downloadLoading}
                            >
                                Anulează
                            </button>
                            <button
                                className="btn-download"
                                onClick={downloadPDF}
                                disabled={downloadLoading}
                            >
                                {downloadLoading ? 'Se descarcă...' : 'Descarcă PDF'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for transfer request */}
            {showTransferModal && (
                <div className="modal-overlay" onClick={handleTransferModalClose}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Cerere de Transfer</h3>
                            <button className="modal-close" onClick={handleTransferModalClose}>×</button>
                        </div>

                        <div className="modal-body">
                            <p>Completează detaliile pentru cererea de transfer:</p>

                            <div className="filter-group">
                                <label htmlFor="course-select">Cursul pentru care solicitați transferul: *</label>
                                <select
                                    id="course-select"
                                    value={selectedCourse}
                                    onChange={e => handleCourseSelection(e.target.value)}
                                    required
                                >
                                    <option value="">Selectează cursul</option>
                                    {allCourses.map(course => (
                                        <option key={course.courseId} value={course.courseId}>
                                            {course.curs} - {course.semestru}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label htmlFor="group-select">Grupa țintă: *</label>
                                <select
                                    id="group-select"
                                    value={selectedGroup}
                                    onChange={e => setSelectedGroup(e.target.value)}
                                    disabled={!selectedCourse}
                                    required
                                >
                                    <option value="">Selectează grupa</option>
                                    {availableGroups.map(group => (
                                        <option key={group.id} value={group.id}>
                                            {group.name || group.id}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label htmlFor="reason-textarea">Motivul transferului: *</label>
                                <textarea
                                    id="reason-textarea"
                                    value={transferReason}
                                    onChange={e => setTransferReason(e.target.value)}
                                    placeholder="Explicați motivul pentru care solicitați transferul..."
                                    maxLength={300}
                                    rows={4}
                                    required
                                />
                                <small className="character-count">
                                    {transferReason.length}/300 caractere
                                </small>
                            </div>

                            <p className="info-text">
                                <em>* Câmpuri obligatorii</em>
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn-cancel"
                                onClick={handleTransferModalClose}
                                disabled={transferLoading}
                            >
                                Anulează
                            </button>
                            <button
                                className="btn-download"
                                onClick={submitTransferRequest}
                                disabled={transferLoading || !selectedCourse || !selectedGroup || !transferReason.trim()}
                            >
                                {transferLoading ? 'Se trimite...' : 'Trimite Cererea'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentCatalog;
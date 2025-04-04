import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Student.css';

const Student = () => {
    const navigate = useNavigate();
    const [cursuri] = useState([
        { id: 1, nume: 'Technologii Web', bifat: false },
        { id: 2, nume: 'Ingineria Programării', bifat: false },
        { id: 3, nume: 'Introducere în programare', bifat: false },
        { id: 4, nume: 'Sisteme de operare', bifat: false },
    ]);

    const handleClick = (idCurs) => {
        navigate(`/cursuri/${idCurs}`);
    };

    const an = 2;
    const semestru = 2;

    return (
        <div className="container-cursuri">
            <div className="cursuri-titlu">
                <h1>Cursuri</h1>
                <h2>Anul {an} semestrul {semestru}</h2>
            </div>
            <div className="lista-cursuri">
                {cursuri.map((curs) => (
                    <div key={curs.id} className="rand-curs">
                        <div id="carte">
                            <img
                                src="/Book open.png"
                                alt="Carte curs"

                            />
                        </div>
                        <button className="buton-icon">
                            <img
                                src="/Clock.png"
                                alt="Ceas curs"
                                className="icon-curs"
                            />
                        </button>
                        <button
                            className={`buton-curs`}
                            onClick={() => handleClick(curs.id)}
                        >
                            {curs.nume}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Student;
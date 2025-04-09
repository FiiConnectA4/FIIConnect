import React from 'react';
import './DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import Buton from '../Components/Buton';

const DetaliiCurs = ({ curs, onBack }) => {
    curs.profesor = 'Popa Tudor';
    return (
        <div className="detalii-container">
            <button className="buton-inapoi" onClick={onBack}>&lt; Înapoi</button>

            <div className="titlu-curs">
                <h1><u>{curs.nume}</u></h1>
                <Ceas></Ceas>
            </div>
            <Buton text={`Profesor: ${curs.profesor}`}></Buton>
            <div className="sectiune">
                <a href='https://www.youtube.com/watch?v=YH5RAUKRn8s&t=145s'><h2>DESCRIERE CURS:</h2></a>
            </div>

            <div className="sectiune">
                <a href='https://www.youtube.com/watch?v=YH5RAUKRn8s&t=145s'><h2>Metoda notare:(componente)</h2></a>
            </div>

            <div className="sectiune bibliografie">
                <a href='https://www.youtube.com/watch?v=YH5RAUKRn8s&t=145s'> <h2>Resurse bibliografice:</h2></a>
            </div>
        </div>
    );
};

export default DetaliiCurs;

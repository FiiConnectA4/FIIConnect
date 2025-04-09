import React from 'react';
import './../Student/DetaliiCurs.css';
import Ceas from './../Components/Ceas';
import ButonExtensibil from '../Components/ButonExtensibil';
import Edit from '../Components/Edit';
import Optiuni from '../Components/Optiuni';

const PDetaliiCurs = ({ curs, onBack }) => {
    curs.profesor = 'Popa Tudor';
    return (
        <div className="detalii-container">
            <button className="buton-inapoi" onClick={onBack}>&lt; Înapoi</button>
            <div className="titlu-curs">
                <h1><u>{curs.nume}</u></h1>
                <Ceas></Ceas>
            </div>
            <ButonExtensibil text="Profesor:"></ButonExtensibil>
            <div className="sectiune">
                <a href='https://www.youtube.com/watch?v=YH5RAUKRn8s&t=145s'><h2>DESCRIERE CURS:</h2></a>
                <Edit></Edit>
            </div>

            <div className="sectiune">
                <a href='https://www.youtube.com/watch?v=YH5RAUKRn8s&t=145s'><h2>Metoda notare:(componente)</h2></a>
                <Edit></Edit>
            </div>

            <div className="sectiune bibliografie">
                <a href='https://www.youtube.com/watch?v=YH5RAUKRn8s&t=145s'> <h2>Resurse bibliografice:</h2></a>
                <Edit></Edit>
            </div>
        </div>
    );
};

export default PDetaliiCurs;

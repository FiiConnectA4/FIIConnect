import React from "react";
import "./CerereDecontari.css";

const CerereDecontari = ({ onBack }) => {
  return (
    <div className="cerere-decontari-container">
      <h1>Cerere Decontări</h1>
      <form className="cerere-decontari-form">
        <label>
          Nume:
          <input type="text" name="nume" placeholder="Introdu numele" />
        </label>
        <label>
          Prenume:
          <input type="text" name="prenume" placeholder="Introdu prenumele" />
        </label>
        <label>
          IBAN:
          <input type="text" name="iban" placeholder="Introdu IBAN-ul" />
        </label>
        <label>
          Suma solicitată:
          <input type="number" name="suma" placeholder="Introdu suma" />
        </label>
        <button type="submit" className="submit-button">Trimite Cererea</button>
      </form>
      <button onClick={onBack} className="back-button">Înapoi</button>
    </div>
  );
};

export default CerereDecontari;
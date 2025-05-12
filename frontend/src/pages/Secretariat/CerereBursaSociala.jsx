import React from "react";
import "./CerereBursaSociala.css";

const CerereBursaSociala = ({ onBack }) => {
  return (
    <div className="cerere-bursa-container">
      <h1>Cerere Bursă Socială</h1>
      <form className="cerere-bursa-form">
        <label>
          Nume:
          <input type="text" name="nume" placeholder="Introdu numele" />
        </label>
        <label>
          Prenume:
          <input type="text" name="prenume" placeholder="Introdu prenumele" />
        </label>
        <label>
          Venit Lunar:
          <input type="number" name="venit" placeholder="Introdu venitul lunar" />
        </label>
        <label>
          Motivație:
          <textarea name="motivatie" placeholder="Scrie motivația ta"></textarea>
        </label>
        <button type="submit" className="submit-button">Trimite Cererea</button>
      </form>
      <button onClick={onBack} className="back-button">Înapoi</button>
    </div>
  );
};

export default CerereBursaSociala;
import React, { useState } from "react";
import "./CerereAdeverintaStudent.css";

const CerereAdeverintaCamin = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    numarMatricol: "",
    camin: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Cererea pentru Adeverință Cămin a fost trimisă cu succes!");
    console.log("Datele trimise:", formData);
    // Resetare formular
    setFormData({
      nume: "",
      prenume: "",
      numarMatricol: "",
      camin: "",
    });
    onBack(); // Revine la meniul anterior
  };

  return (
    <div className="cerere-decontari-container">
      <h1>Cerere Adeverință Cămin</h1>
      <form className="cerere-decontari-form" onSubmit={handleSubmit}>
        <label>
          Nume:
          <input
            type="text"
            name="nume"
            placeholder="Introdu numele"
            value={formData.nume}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Prenume:
          <input
            type="text"
            name="prenume"
            placeholder="Introdu prenumele"
            value={formData.prenume}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Număr Matricol:
          <input
            type="text"
            name="numarMatricol"
            placeholder="Introdu numărul matricol"
            value={formData.numarMatricol}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Cămin:
          <input
            type="text"
            name="camin"
            placeholder="Introdu numele căminului"
            value={formData.camin}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit" className="submit-button">
          Trimite Cererea
        </button>
      </form>
      <button onClick={onBack} className="back-button">
        Înapoi
      </button>
    </div>
  );
};

export default CerereAdeverintaCamin;
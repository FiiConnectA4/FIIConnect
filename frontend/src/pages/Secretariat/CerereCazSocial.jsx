import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importăm useNavigate
import "./CerereDecontari.css"; // Reutilizăm stilurile existente

const CerereCazSocial = () => {
  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    numarMatricol: "",
    justificare: "",
    documente: null,
  });

  const navigate = useNavigate(); // Inițializăm useNavigate

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      documente: event.target.files[0],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Cererea pentru Caz Social a fost trimisă cu succes!");
    console.log("Datele trimise:", formData);
    // Resetare formular
    setFormData({
      nume: "",
      prenume: "",
      numarMatricol: "",
      justificare: "",
      documente: null,
    });
    navigate(-1); // Navighează înapoi la pagina anterioară
  };

  return (
    <div className="cerere-decontari-container">
      <h1>Cerere Caz Social</h1>
      <form className="cerere-decontari-form" onSubmit={handleSubmit}>
        <label>
          Nume:
          <input
            type="text"
            name="nume"
            value={formData.nume}
            onChange={handleInputChange}
            placeholder="Introdu numele"
            required
          />
        </label>
        <label>
          Prenume:
          <input
            type="text"
            name="prenume"
            value={formData.prenume}
            onChange={handleInputChange}
            placeholder="Introdu prenumele"
            required
          />
        </label>
        <label>
          Număr Matricol:
          <input
            type="text"
            name="numarMatricol"
            value={formData.numarMatricol}
            onChange={handleInputChange}
            placeholder="Introdu numărul matricol"
            required
          />
        </label>
        <label>
          Justificare:
          <textarea
            name="justificare"
            value={formData.justificare}
            onChange={handleInputChange}
            placeholder="Introdu justificarea"
            rows="4"
            required
          />
        </label>
        <label>
          Atașament Documente:
          <input
            type="file"
            name="documente"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            required
          />
        </label>
        <button type="submit" className="submit-button">Trimite Cererea</button>
      </form>
      <button onClick={() => navigate(-1)} className="back-button">Înapoi</button>
    </div>
  );
};

export default CerereCazSocial;
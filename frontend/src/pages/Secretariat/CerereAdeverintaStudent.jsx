import React, { useState } from "react";
import "./CerereAdeverintaStudent.css";

const CerereAdeverintaStudent = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    numarMatricol: "",
    adresa: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 const handleSubmit = async (event) => {
  event.preventDefault();

  const studentId = 7; // hardcodat pentru test

  const cerereDto = {
    studentId: studentId,
    status: "Trimis",
    dataTrimitere: new Date().toISOString(),
    comentariu: "",
    adresa: formData.adresa,
  };

  try {
    const response = await fetch("http://localhost:34101/cereri/adeverinta-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Adaugă token-ul aici
      },
      body: JSON.stringify(cerereDto),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert("Eroare la trimiterea cererii: " + errorText);
      return;
    }

    alert("Cererea pentru Adeverință Student a fost trimisă cu succes!");
    setFormData({
      nume: "",
      prenume: "",
      numarMatricol: "",
      adresa: "",
    });
    onBack();
  } catch (error) {
    alert("Eroare la trimiterea cererii: " + error.message);
  }
};


  return (
    <div className="cerere-decontari-container">
      <h1>Cerere Adeverință Student</h1>
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
          Adresă:
          <input
            type="text"
            name="adresa"
            placeholder="Introdu adresa"
            value={formData.adresa}
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

export default CerereAdeverintaStudent;
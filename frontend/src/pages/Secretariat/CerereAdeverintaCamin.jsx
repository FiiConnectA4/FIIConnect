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

  const payload = {
    studentId: 7, // sau îl iei din context, localStorage, etc.
    status: "trimisa",
    dataTrimitere: new Date().toISOString().split("T")[0], // format YYYY-MM-DD
    comentariu: `Cerere cazare în ${formData.camin}`,
    camin: formData.camin
  };

  fetch("/cereri/adeverinta-camin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Adaugă token-ul aici
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Eroare la trimiterea cererii");
      return res.json();
    })
    .then((data) => {
      alert("Cererea pentru Adeverință Cămin a fost trimisă cu succes!");
      console.log("Datele trimise:", data);

      setFormData({
        nume: "",
        prenume: "",
        numarMatricol: "",
        camin: "",
      });

      onBack(); // Revine la meniul anterior
    })
    .catch((err) => {
      console.error("Eroare:", err);
      alert("Trimiterea cererii a eșuat.");
    });
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
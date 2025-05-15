import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CerereDecontari.css";

const CerereBursaSociala = () => {
  // PENTRU TEST: setează manual studentId, de ex 7
  const studentId = 7;

  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    numarMatricol: "",
    an: "",
    facultate: "",
    comentariu: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const jsonData = {
      studentId: studentId,
      status: "Asteptare",
      dataTrimitere: new Date().toISOString().split("T")[0], // format yyyy-MM-dd
      comentariu: formData.comentariu || "",
      anStudent: parseInt(formData.an, 10),
      facultate: formData.facultate,
      // dacă backend vrea și dosarPath, poți pune null sau ""
      dosarPath: null,
    };

    console.log("Trimitem JSON:", jsonData);

    fetch("/cereri/bursa-sociala", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error(text || "Eroare la trimiterea cererii");
        alert("Cererea pentru Bursă Socială a fost trimisă cu succes!");
        setFormData({
          nume: "",
          prenume: "",
          numarMatricol: "",
          an: "",
          facultate: "",
          comentariu: "",
        });
        navigate(-1);
      })
      .catch((err) => {
        console.error("Eroare la fetch:", err);
        alert("A apărut o eroare la trimiterea cererii.");
      });
  };

  return (
    <div className="cerere-decontari-container">
      <h1>Cerere Bursă Socială</h1>
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
          An:
          <input
            type="number"
            name="an"
            value={formData.an}
            onChange={handleInputChange}
            placeholder="Introdu anul de studiu"
            required
          />
        </label>
        <label>
          Facultate:
          <input
            type="text"
            name="facultate"
            value={formData.facultate}
            onChange={handleInputChange}
            placeholder="Introdu facultatea"
            required
          />
        </label>
        <label>
          Comentariu (opțional):
          <input
            type="text"
            name="comentariu"
            value={formData.comentariu}
            onChange={handleInputChange}
            placeholder="Comentariu"
          />
        </label>
        <button type="submit" className="submit-button">
          Trimite Cererea
        </button>
      </form>
      <button onClick={() => navigate(-1)} className="back-button">
        Înapoi
      </button>
    </div>
  );
};

export default CerereBursaSociala;

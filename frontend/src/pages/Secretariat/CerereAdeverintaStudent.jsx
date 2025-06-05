import React, { useState, useEffect } from "react";

const CerereAdeverintaStudent = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    numarMatricol: "",
    adresa: "",
  });

  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    // Aici faci fetch la /person/me ca să preiei studentId și datele de baza
    fetch("http://localhost:34101/person/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Nu s-a putut prelua persoana");
        return res.json();
      })
      .then((data) => {
        if (data.student) {
          setStudentId(data.student.id);
          setFormData({
            nume: data.student.firstName || "",
            prenume: data.student.lastName || "",
            numarMatricol: data.student.regNumber || "",
            adresa: "",
          });
        } else {
          alert("Studentul nu este identificat în răspuns");
        }
      })
      .catch((err) => {
        alert("Eroare la preluarea persoanei: " + err.message);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!studentId) {
      alert("Studentul nu este identificat!");
      return;
    }

    const cerereDto = {
      studentId,
      status: "Asteptare",
      dataTrimitere: new Date().toISOString(),
      comentariu: "",
      adresa: formData.adresa,
    };

    try {
      const response = await fetch("http://localhost:34101/cereri/adeverinta-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

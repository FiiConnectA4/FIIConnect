import React, { useState, useEffect } from "react";

const CerereAdeverintaCamin = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    numarMatricol: "",
    camin: "",
  });
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
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
            camin: "",
          });
        } else {
          alert("Studentul nu este identificat în răspuns");
        }
      })
      .catch((err) => {
        alert("Eroare la preluarea persoanei: " + err.message);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) {
      alert("Studentul nu este identificat!");
      return;
    }

    const cerereDto = {
      studentId,
      status: "Asteptare",
      dataTrimitere: new Date().toISOString(),
      comentariu: "",
      camin: formData.camin,
    };

    try {
      const response = await fetch("http://localhost:34101/cereri/adeverinta-camin", {
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

      alert("Cererea pentru Adeverință Cămin a fost trimisă cu succes!");
      setFormData({
        nume: "",
        prenume: "",
        numarMatricol: "",
        camin: "",
      });
      onBack();
    } catch (error) {
      alert("Eroare la trimiterea cererii: " + error.message);
    }
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

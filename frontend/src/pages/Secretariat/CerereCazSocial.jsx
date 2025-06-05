import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CerereDecontari.css";

const CerereCazSocial = () => {
  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    numarMatricol: "",
    justificare: "",
    documente: null,
  });

  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Nu ești autentificat");
      navigate("/", { replace: true });
      return;
    }

    fetch("http://localhost:34101/person/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Nu s-a putut prelua info utilizator");
        return res.json();
      })
      .then((data) => {
        setStudentId(data.id);
        // Presupunem că API-ul returnează și nume, prenume și nr matricol
        setFormData((prev) => ({
          ...prev,
          nume: data.nume || "",
          prenume: data.prenume || "",
          numarMatricol: data.numarMatricol || "",
        }));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Eroare la preluarea informațiilor");
        navigate("/", { replace: true });
      });
  }, [navigate]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!studentId) {
      alert("ID student invalid");
      return;
    }

    const fd = new FormData();
    fd.append("file", formData.documente);
    fd.append("studentId", studentId);
    fd.append("status", "Asteptare");
    fd.append("dataTrimitere", new Date().toISOString().split("T")[0]);
    fd.append("comentariu", "");
    fd.append("justificare", formData.justificare);

    fetch("http://localhost:34101/cereri/caz-social/cereri-cu-upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: fd,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        alert("Cererea a fost trimisă cu succes!");
        navigate(-1);
      })
      .catch((err) => {
        console.error(err);
        alert("A apărut o eroare la trimiterea cererii.");
      });
  };

  if (loading) {
    return <div>Se încarcă...</div>;
  }

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

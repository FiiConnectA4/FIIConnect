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
const studentId = 7;
  const handleSubmit = (event) => {
  event.preventDefault();

  // Construiește payload-ul, adaptat la ce backend așteaptă
  const payload = {
    nume: formData.nume,
    prenume: formData.prenume,
    numarMatricol: formData.numarMatricol,
    justificare: formData.justificare,
    // aici studentId trebuie să fie luat de undeva, de ex din context sau props
    studentId: studentId, // presupunem că îl ai definit în componentă
    documentePath: formData.documente ? formData.documente.name : null,
    status: "Asteptare",
    dataTrimitere: new Date().toISOString(),
  };

  fetch("/cereri/caz-social", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Eroare la trimiterea cererii");
      alert("Cererea pentru Caz Social a fost trimisă cu succes!");
      setFormData({
        nume: "",
        prenume: "",
        numarMatricol: "",
        justificare: "",
        documente: null,
      });
      navigate(-1);
    })
    .catch((err) => {
      console.error("Eroare la trimiterea cererii:", err);
      alert("A apărut o eroare la trimiterea cererii.");
    });
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
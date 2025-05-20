import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";

const SecretariatAdeverinteStudent = () => {
  const [cereri, setCereri] = useState([]);
   const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/cereri/adeverinta-student/toate", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => res.json())
      .then(setCereri)
      .catch(console.error);
  }, []);

const veziPdf = (cerere) => {
  const doc = new jsPDF();

  const text = `
      Catre: Secretariatul Facultatii

      Subsemnatul(a), ${cerere.nume} ${cerere.prenume}, student(a) in anul ${cerere.an},
      grupa ${cerere.grupa}, cu numarul matricol ${cerere.regNumber},
      va rog sa-mi eliberati o adeverinta de student.

      Data trimiterii cererii: ${cerere.dataTrimitere}

      Va multumesc!
  `;

  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 10, 20);

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};


  const valideazaCerere = (id) => {
    const token = localStorage.getItem("token");
    fetch(`/cereri/adeverinta-student/${id}?status=aprobat`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Eroare validare");
      setCereri(prev => prev.map(c => c.id === id ? {...c, status: 'aprobat'} : c));
    })
    .catch(console.error);
};

  const respingeCerere = (id) => {
    const token = localStorage.getItem("token");
    fetch(`/cereri/adeverinta-student/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Eroare ștergere");
        setCereri((prev) => prev.filter((c) => c.id !== id));
      })
      .catch((err) => {
        console.error("Eroare ștergere:", err);
        alert("Eroare la respingere!");
      });
  };

  return (
    <div>
      <h2>Cereri Adeverință Student</h2>

<button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
      ← Înapoi
    </button>

      <table>
        <thead>
          <tr>
            <th>ID Cerere</th>
            <th>Nume Student</th>
            <th>Status</th>
            <th>Data Trimitere</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {cereri.map((cerere) => (
            <tr key={cerere.id}>
              <td>{cerere.id}</td>
              <td>{cerere.nume} {cerere.prenume}</td>
              <td>{cerere.status}</td>
              <td>{cerere.dataTrimitere}</td>
              <td>
                <button onClick={() => veziPdf(cerere)}>Vezi PDF</button>
                {cerere.status !== "validat" && (
                  <>
                    <button onClick={() => valideazaCerere(cerere.id)}>Validează</button>
                    <button onClick={() => respingeCerere(cerere.id)}>Respinge</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecretariatAdeverinteStudent;

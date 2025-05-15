import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";

const SecretariatCazSocial = () => {
  const [cereri, setCereri] = useState([]);
   const navigate = useNavigate();

  useEffect(() => {
    fetch("/cereri/caz-social/toate")
      .then((res) => res.json())
      .then(setCereri)
      .catch(console.error);
  }, []);

  const veziPdf = (cerere) => {
    const doc = new jsPDF();

    const text = `
      Către: Secretariatul Facultății

      Subsemnatul(a), ${cerere.nume} ${cerere.prenume}, student(ă) anul ${cerere.an},
      grupa ${cerere.grupa}, cu numărul matricol ${cerere.regNumber},
      solicit ajutor pentru caz social.

      Justificare:
      ${cerere.justificare || "Nicio justificare"}

      Comentarii: ${cerere.comentariu || "Niciun comentariu"}

      Data trimiterii cererii: ${cerere.dataTrimitere}

      Mulțumesc anticipat pentru analiza cererii!
    `;

    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, 20);

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const veziDocument = (cerere) => {
    if (!cerere.documentePath) {
      alert("Nu există document atașat.");
      return;
    }
    // Deschide fișierul PDF trimis de student
    const url = `/cereri/caz-social/${cerere.id}/document`;
    window.open(url, "_blank");
  };

  const valideazaCerere = (id) => {
    fetch(`/cereri/caz-social/${id}?status=aprobat`, {
      method: "PUT",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Eroare validare");
        setCereri((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "aprobat" } : c))
        );
      })
      .catch(console.error);
  };

  const respingeCerere = (id) => {
    fetch(`/cereri/caz-social/${id}`, {
      method: "DELETE",
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
      <h2>Cereri Caz Social</h2>

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
          {cereri.length ? (
            cereri.map((cerere) => (
              <tr key={cerere.id}>
                <td>{cerere.id}</td>
                <td>{cerere.nume} {cerere.prenume}</td>
                <td>{cerere.status}</td>
                <td>{cerere.dataTrimitere}</td>
                <td>
                  <button onClick={() => veziPdf(cerere)}>Vezi PDF generat</button>{" "}
                  <button onClick={() => veziDocument(cerere)}>Vezi Document atașat</button>{" "}
                  {cerere.status !== "aprobat" && (
                    <>
                      <button onClick={() => valideazaCerere(cerere.id)}>Validează</button>{" "}
                      <button onClick={() => respingeCerere(cerere.id)}>Respinge</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>Nu există cereri înregistrate.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SecretariatCazSocial;

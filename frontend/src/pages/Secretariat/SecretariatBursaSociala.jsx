import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";


const SecretariatBursaSociala = () => {
  const [cereri, setCereri] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/cereri/bursa-sociala/toate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) 
      .then((res) => {
        if (!res.ok) throw new Error("Eroare la încărcarea cererilor");
        return res.json();
      })
      .then(setCereri)
      .catch((err) => {
        console.error("Eroare fetch cereri:", err);
        alert("Nu s-au putut încărca cererile.");
      });
  }, []);

  const veziPdf = (cerere) => {
    const doc = new jsPDF();

    const text = `
Catre: Secretariatul Facultatii

Subsemnatul(a), ${cerere.nume} ${cerere.prenume}, student(a) anul ${cerere.anStudent || cerere.an},
grupa ${cerere.grupa || "-"}, cu numarul matricol ${cerere.numarMatricol || cerere.regNumber || "-"},
solicit acordarea bursei sociale pentru anul universitar curent.

Facultate: ${cerere.facultate || "-"}
An student: ${cerere.anStudent || cerere.an || "-"}
Comentarii: ${cerere.comentariu || "Niciun comentariu"}

Data trimiterii cererii: ${cerere.dataTrimitere || "-"}

Multumesc anticipat pentru analiza cererii!
    `;

    const lines = doc.splitTextToSize(text.trim(), 180);
    doc.text(lines, 10, 20);

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const valideazaCerere = (id) => {
    const token = localStorage.getItem("token");
    fetch(`/cereri/bursa-sociala/${id}?status=aprobat`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Eroare validare cerere");
        setCereri((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "aprobat" } : c))
        );
      })
      .catch((err) => {
        console.error("Eroare validare:", err);
        alert("Nu s-a putut valida cererea.");
      });
  };

  const respingeCerere = (id) => {
    const token = localStorage.getItem("token");
    fetch(`/cereri/bursa-sociala/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Eroare ștergere cerere");
        setCereri((prev) => prev.filter((c) => c.id !== id));
      })
      .catch((err) => {
        console.error("Eroare ștergere:", err);
        alert("Eroare la respingere cererii.");
      });
  };

  return (
    <div>
      <h2>Cereri Bursa Socială</h2>

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
            <th>An</th>
            <th>Facultate</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {cereri.length === 0 ? (
            <tr>
              <td colSpan={7}>Nu există cereri înregistrate.</td>
            </tr>
          ) : (
            cereri.map((cerere) => (
              <tr key={cerere.id}>
                <td>{cerere.id}</td>
                <td>
                  {cerere.nume} {cerere.prenume}
                </td>
                <td>{cerere.status}</td>
                <td>{cerere.dataTrimitere}</td>
                <td>{cerere.an}</td>
                <td>{cerere.facultate}</td>
                <td>
                  <button onClick={() => veziPdf(cerere)}>Vezi PDF</button>
                  {cerere.status !== "aprobat" && (
                    <>
                      <button onClick={() => valideazaCerere(cerere.id)}>Validează</button>
                      <button onClick={() => respingeCerere(cerere.id)}>Respinge</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SecretariatBursaSociala;

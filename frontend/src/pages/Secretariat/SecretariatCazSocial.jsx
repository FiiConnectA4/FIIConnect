import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";

const SecretariatCazSocial = () => {
  const [cereri, setCereri] = useState([]);
   const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/cereri/caz-social/toate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setCereri)
      .catch(console.error);
  }, []);

  const veziPdf = (cerere) => {
    const doc = new jsPDF();

    const text = `
      Catre: Secretariatul Facultatii

      Subsemnatul(a), ${cerere.nume} ${cerere.prenume}, student(a) anul ${cerere.an},
      grupa ${cerere.grupa}, cu numarul matricol ${cerere.regNumber},
      solicit ajutor pentru caz social.

      Justificare:
      ${cerere.justificare || "Nicio justificare"}

      Data trimiterii cererii: ${cerere.dataTrimitere}

      Multumesc anticipat pentru analiza cererii!
    `;

    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, 20);

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

const veziDocument = async (cerere) => {
  if (!cerere.documentePath) {
    alert("Nu există document atașat.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:34101/cereri/caz-social/${cerere.id}/document`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Fișierul nu poate fi deschis.");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (err) {
    alert("Eroare la deschiderea fișierului.");
    console.error(err);
  }
};


  const valideazaCerere = (id) => {
    fetch(`/cereri/caz-social/${id}?status=aprobat`, {
      method: "PUT",
       headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
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
       headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
       },
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

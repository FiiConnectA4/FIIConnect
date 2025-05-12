import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importăm useNavigate
import "./CerereDecontari.css";

const CerereDecontari = () => {
  const [procentSolicitat, setProcentSolicitat] = useState("");
  const [durataAbonament, setDurataAbonament] = useState("");
  const [sumaDecontata, setSumaDecontata] = useState("");
  const [tipAbonament, setTipAbonament] = useState("");
  const navigate = useNavigate(); // Inițializăm useNavigate

  const handleProcentChange = (event) => {
    const procent = event.target.value;
    setProcentSolicitat(procent);
    calculateSumaDecontata(durataAbonament, procent);
  };

  const handleDurataChange = (event) => {
    const durata = event.target.value;
    setDurataAbonament(durata);
    calculateSumaDecontata(durata, procentSolicitat);
  };

  const handleTipAbonamentChange = (event) => {
    setTipAbonament(event.target.value);
  };

  const calculateSumaDecontata = (durata, procent) => {
    let suma = "";
    if (durata === "30 zile" && procent === "90") {
      suma = "117 RON";
    } else if (durata === "30 zile" && procent === "100") {
      suma = "130 RON";
    } else if (durata === "7 zile" && procent === "90") {
      suma = "31,5 RON";
    } else if (durata === "7 zile" && procent === "100") {
      suma = "35 RON";
    }
    setSumaDecontata(suma);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logica pentru trimiterea cererii
    alert("Cererea a fost trimisă cu succes!");
  };

  return (
    <div className="cerere-decontari-container">
      <h1>Cerere Decontare CTP</h1>
      <form className="cerere-decontari-form" onSubmit={handleSubmit}>
        <label>
          Nume:
          <input type="text" name="nume" placeholder="Introdu numele" />
        </label>
        <label>
          Prenume:
          <input type="text" name="prenume" placeholder="Introdu prenumele" />
        </label>
        <label>
          Număr matricol:
          <input type="text" name="matricol" placeholder="Introdu numărul matricol" />
        </label>
        <label>
          IBAN:
          <input type="text" name="iban" placeholder="Introdu IBAN-ul" />
        </label>
        <label>
          Data achiziție abonament:
          <input type="date" name="data_achizitie" className="date-input" />
        </label>
        <label>
          Tip abonament:
          <select
            name="tip_abonament"
            className="dropdown"
            defaultValue=""
            onChange={handleTipAbonamentChange}
          >
            <option value="" disabled hidden>Alege tip abonament</option>
            <option value="fizic">Fizic</option>
            <option value="online">Online</option>
          </select>
        </label>
        {tipAbonament === "fizic" && (
          <>
            <label>
              Introdu serie card transport:
              <input type="text" name="serie_card_transport" placeholder="Introdu seria cardului" />
            </label>
            <label>
              Introdu număr card transport:
              <input type="text" name="numar_card_transport" placeholder="Introdu numărul cardului" />
            </label>
            <label>
              Introdu seria bonului fiscal:
              <input type="text" name="serie_bon_fiscal" placeholder="Introdu seria bonului fiscal" />
            </label>
            <label>
              Introdu numărul bonului fiscal:
              <input type="text" name="numar_bon_fiscal" placeholder="Introdu numărul bonului fiscal" />
            </label>
          </>
        )}
        {tipAbonament !== "fizic" && (
          <>
            <label>
              Încarcă chitanță abonament (PDF/JPG):
              <input type="file" name="chitanta_abonament" accept=".pdf, .jpg, .jpeg" />
            </label>
            <label>
              Încarcă dovadă plată (extras de cont) (PDF/JPG):
              <input type="file" name="extras_cont" accept=".pdf, .jpg, .jpeg" />
            </label>
          </>
        )}
        <label>
          Durată abonament:
          <select
            name="durata_abonament"
            className="dropdown"
            defaultValue=""
            onChange={handleDurataChange}
          >
            <option value="" disabled hidden>Alege durată abonament</option>
            <option value="30 zile">30 zile</option>
            <option value="7 zile">7 zile</option>
          </select>
        </label>
        <label>
          Procent solicitat:
          <select
            name="procent_solicitat"
            className="dropdown"
            defaultValue=""
            onChange={handleProcentChange}
          >
            <option value="" disabled hidden>Alege procent solicitat</option>
            <option value="90">90%</option>
            <option value="100">100%</option>
          </select>
        </label>
        {sumaDecontata && (
          <p className="suma-decontata">Suma decontată: {sumaDecontata}</p>
        )}
        <button type="submit" className="submit-button">Trimite Cererea</button>
      </form>
      <button onClick={() => navigate(-1)} className="back-button">Înapoi</button>
    </div>
  );
};

export default CerereDecontari;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DotariSala = ({ isSecretariat = false }) => {
  const { sala } = useParams(); 
  const navigate = useNavigate(); 
  const [dotari, setDotari] = useState(null);

  useEffect(() => {
    // Preia dotările sălii din API
    fetch(`http://localhost:34101/sali/nume/${sala}`)
      .then(res => res.json())
      .then(data => setDotari(data[0])) 
      .catch(err => console.error('Eroare la preluarea dotărilor:', err));
  }, [sala]);

  const handleBackClick = () => {
    const basePath = isSecretariat ? "/app/orar-secretariat/sali" : "/app/orar/sali";
    navigate(`${basePath}/${sala}`);
  };

  return (
    <div className="dotari-container">
      <h2>Dotări pentru {sala}</h2>
      {dotari ? (
        <div className="dotari-details">
          <ul>
            <li><strong>Dotări:</strong> {dotari.dotari}</li>
            <li><strong>Capacitate:</strong> {dotari.capacitate}</li>
            <li><strong>Observații:</strong> {dotari.observatii}</li>
            {dotari.imagine_url && (
              <li><img src={dotari.imagine_url} alt={`Imagine pentru sala ${sala}`} /></li>
            )}
          </ul>
        </div>
      ) : (
        <p>Se încarcă dotările...</p>
      )}
      <button className="dotari-back-button" onClick={handleBackClick}>
        🔙 Înapoi
      </button>
    </div>
  );
};

export default DotariSala;
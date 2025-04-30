// src/components/ProfileButton.jsx
import { useNavigate } from 'react-router-dom';

const ProfileButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/app/profil')}
      style={{
        border: 'none',
        background: 'transparent',
        padding: 0,
        cursor: 'pointer',
      }}
    >
      <img
        src="/avatar.jpg"
        alt="Profil"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #003087',
        }}
      />
    </button>
  );
};

export default ProfileButton;

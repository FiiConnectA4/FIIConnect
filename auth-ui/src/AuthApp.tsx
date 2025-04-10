import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const AuthApp = () => {
  const [page, setPage] = useState('login');

  return (
    <div className="auth-app-background">
      <div className="auth-page-wrapper">
        {page === 'login' && <LoginForm onSwitch={setPage} />}
        {page === 'register' && <RegisterForm onSwitch={setPage} />}
        {page === 'reset' && <ResetPassword onSwitch={setPage} />}
        {page === 'dashboard' && <Dashboard onSwitch={setPage} />}
      </div>
    </div>
  );
};

const LoginForm = ({ onSwitch }: { onSwitch: (page: string) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = () => {
    if (!emailOrPhone || !password) {
      alert('Please fill in all fields');
      return;
    }
    onSwitch('dashboard');
  };

  return (
    <div className="page-content">
      <div className="login-logo-container">
        <img
          src="/FiiConnect-removebg-preview.png"
          alt="FIIConnect"
          className="login-logo-image"
        />
      </div>

      <p className="login-greeting-text">Nice to see you again</p>

      <div className="form-container">
        <input
          className="auth-input"
          placeholder=" Email or phone number"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
        />
        <div className="relative w-full">
          <input
            className="auth-input pr-10"
            type={showPassword ? 'text' : 'password'}
            placeholder=" Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="login-password-toggle"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </span>
        </div>
        <div className="w-full text-right">
          <span className="auth-link" onClick={() => onSwitch('reset')}>
            Forgot password?
          </span>
        </div>
        <button className="auth-button" onClick={handleSignIn}>
          Sign in
        </button>
        <hr className="border-[#E5E5E5] w-full my-4" />
        <div className="text-sm text-gray-600">
          Don't have an account?{' '}
          <span className="auth-link" onClick={() => onSwitch('register')}>
            Sign up now
          </span>
        </div>
        <div className="footer-text">© FIIConnect</div>
      </div>
    </div>
  );
};

const RegisterForm = ({ onSwitch }: { onSwitch: (page: string) => void }) => (
  <div className="page-content">
    <h2 className="register-title">Creare cont</h2>
    <div className="form-container">
      <input className="auth-input" placeholder="Username" />
      <input className="auth-input" placeholder="Email" />
      <input className="auth-input" type="password" placeholder="Parola" />
      <input className="auth-input" type="password" placeholder="Repetare parola" />
      <button className="auth-button" onClick={() => onSwitch('dashboard')}>
        Înregistrează-te
      </button>
      <hr className="border-[#E5E5E5] w-full my-4" />
      <div className="text-sm text-gray-600">
        Ai deja cont?{' '}
        <span className="auth-link" onClick={() => onSwitch('login')}>
          Login
        </span>
      </div>
    </div>
  </div>
);

const ResetPassword = ({ onSwitch }: { onSwitch: (page: string) => void }) => (
  <div className="page-content">
    <h2 className="reset-password-title">Resetare Parolă</h2>
    <div className="form-container">
      <input className="auth-input" placeholder="Email sau username" />
      <button className="auth-button" onClick={() => onSwitch('login')}>
        Trimite link resetare
      </button>
      <hr className="border-[#E5E5E5] w-full my-4" />
      <div className="text-sm text-gray-600">
        <span className="auth-link" onClick={() => onSwitch('login')}>
          Înapoi la login
        </span>
      </div>
    </div>
  </div>
);

const Dashboard = ({ onSwitch }: { onSwitch: (page: string) => void }) => (
  <div className="page-content">
    <h2 className="dashboard-title">Dashboard</h2>
    <p className="dashboard-text">Bun venit! Aceasta este o pagină mock-uită de dashboard.</p>
    <button className="auth-button" onClick={() => onSwitch('login')}>
      Logout
    </button>
  </div>
);

export default AuthApp;

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

  const handleSignIn = async () => {
    if (!emailOrPhone || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:34101/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: emailOrPhone, password })  // Assuming you use `username` here
      });

      const result = await response.json();
      if (response.ok) {
        alert('Login successful');
        onSwitch('dashboard');
      } else {
        alert('Login failed: ' + result.message); // ✅ FIXED
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('Connection error: ' + err.message);  // Access `err.message` only if `err` is an instance of `Error`
      } else {
        alert('An unknown error occurred');
      }
    }
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
          placeholder="Enter username "
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

const RegisterForm = ({ onSwitch }: { onSwitch: (page: string) => void }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:34101/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password })
      });

      const result = await response.json();
      if (response.ok) {
        alert('Account created successfully');
        onSwitch('login');
      } else {
        alert('Registration failed: ' + result.message); // ✅ FIXED
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('Connection error: ' + err.message);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  return (
      <div className="page-content">
        <h2 className="register-title">Creare cont</h2>
        <div className="form-container">
          <input
              className="auth-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
          />
          <input
              className="auth-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
          <input
              className="auth-input"
              type="password"
              placeholder="Parola"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
          <input
              className="auth-input"
              type="password"
              placeholder="Repetare parola"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="auth-button" onClick={handleRegister}>
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
};


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

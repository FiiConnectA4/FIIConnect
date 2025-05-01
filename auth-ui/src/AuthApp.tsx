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
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [errorMessage, setErrorMessage] = useState('');


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSignIn = async () => {
        const newErrors: { [key: string]: string } = {};
        if (!emailOrPhone) newErrors.emailOrPhone = 'Email or phone is required';
        if (!password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch('http://localhost:34101/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: emailOrPhone, password })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Login successful');
                onSwitch('dashboard');
            } else {
                setErrorMessage(result.message || 'Login failed');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorMessage('Connection error: ' + err.message);
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
                    placeholder="Enter username"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                />
                {errors.emailOrPhone && <span className="error">{errors.emailOrPhone}</span>}

                <div className="password-wrapper">
                    <input
                        className="auth-input"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
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
                {errors.password && <span className="error">{errors.password}</span>}


                {errorMessage && <p className="error-message">{errorMessage}</p>}

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
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleRegister = async () => {
        const newErrors: { [key: string]: string } = {};
        if (!username) newErrors.username = 'Username is required';
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch('http://localhost:34101/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, is2FAEnabled })
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
            <h2 className="register-title">Create Account</h2>

            <div className="form-container">
                <input
                    className="auth-input"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <span className="error">{errors.username}</span>}

                <input
                    className="auth-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <span className="error">{errors.email}</span>}

                <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <span className="error">{errors.password}</span>}

                <input
                    className="auth-input"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

                <div className="w-full">
                    <label>
                        Enable 2FA
                        <input
                            type="checkbox"
                            checked={is2FAEnabled}
                            onChange={(e) => setIs2FAEnabled(e.target.checked)}
                        />
                    </label>
                </div>

                <button className="auth-button" onClick={handleRegister}>
                    Register
                </button>

                <hr className="border-[#E5E5E5] w-full my-4" />

                <div className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <span className="auth-link" onClick={() => onSwitch('login')}>
            Login
          </span>
                </div>
            </div>
        </div>
    );
};

const ResetPassword = ({ onSwitch }: { onSwitch: (page: string) => void }) => {
    const [email, setEmailOrUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleResetPassword = async () => {
        if (!email) {
            setErrorMessage('Email or username is required');
            return;
        }

        try {
            const formData = new URLSearchParams();
            formData.append('email', email); // Parametrul pe care îl așteaptă serverul

            const response = await fetch('http://localhost:34101/users/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // Schimbă tipul de conținut
                },
                body: formData.toString(), // Trimiți datele în formatul x-www-form-urlencoded
            });

            // Verificăm dacă răspunsul este JSON și îl parsăm corect
            const result = await response.text();  // Folosește `text` în loc de `json`, pentru a evita eroarea

            if (response.ok) {
                setSuccessMessage('Reset link sent successfully');
                setErrorMessage('');
            } else {
                setErrorMessage(result || 'An error occurred');
                setSuccessMessage('');
            }
        } catch (err) {
            setErrorMessage('Connection error: ' + (err instanceof Error ? err.message : 'Unknown error'));
            setSuccessMessage('');
        }
    };

    return (
        <div className="page-content">
            <h2 className="reset-password-title">Reset Password</h2>
            <div className="form-container">
                <input
                    className="auth-input"
                    placeholder="Email or username"
                    value={email}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                />

                {errorMessage && <div className="error-message text-red-500">{errorMessage}</div>}
                {successMessage && <div className="success-message text-green-500">{successMessage}</div>}

                <button className="auth-button" onClick={handleResetPassword}>
                    Send Reset Link
                </button>

                <hr className="border-[#E5E5E5] w-full my-4" />

                <div className="text-sm text-gray-600">
                    <span className="auth-link" onClick={() => onSwitch('login')}>
                        Back to login
                    </span>
                </div>
            </div>
        </div>
    );
};

const Dashboard = ({ onSwitch }: { onSwitch: (page: string) => void }) => (
    <div className="page-content">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-text">Welcome! This is a mock dashboard page.</p>
        <button className="auth-button" onClick={() => onSwitch('login')}>
            Logout
        </button>
    </div>
);

export default AuthApp;
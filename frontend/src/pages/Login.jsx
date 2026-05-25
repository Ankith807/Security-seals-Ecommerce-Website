import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [loginType, setLoginType] = useState('user');

  const { login, isAuthenticated, user, loading } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get('redirect') || '';

  useEffect(() => {
    if (isAuthenticated) {
      if (redirect) {
        navigate(`/${redirect}`);
      } else if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate, redirect]);

const handleLoginSubmit = async (e) => {
  e.preventDefault();

  setErrMessage('');

  if (!email || !password) {
    setErrMessage('Please enter both email and password.');
    return;
  }

  // Prevent user login in admin mode
  if (
    loginType === 'admin' &&
    email !== 'admin@raibex.com'
  ) {
    setErrMessage('Only admin can login here.');
    return;
  }

  // Prevent admin login in user mode
  if (
    loginType === 'user' &&
    email === 'admin@raibex.com'
  ) {
    setErrMessage('Admin cannot login from user portal.');
    return;
  }

  const res = await login(email, password);

  if (!res.success) {
    setErrMessage(
      res.message || 'Invalid email or password credentials.'
    );
  }
};
  const handleAutoFill = (roleType) => {
    if (roleType === 'admin') {
      setEmail('admin@raibex.com');
      setPassword('admin123');
    } else {
      setEmail('user@raibex.com');
      setPassword('user123');
    }
  };

  return (
    <div>
      <section
        className="section"
        style={{
          display: 'flex',
          alignItems: 'center',
          minHeight: 'calc(100vh - 160px)',
        }}
      >
        <div className="container">
          <div className="form-card animate-slide">
            
            {/* HEADER */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <svg
                className="svg-icon"
                style={{
                  color: 'var(--accent)',
                  width: '48px',
                  height: '48px',
                  marginBottom: '8px',
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="11"
                  rx="2"
                  ry="2"
                />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>

              <h2
                className="form-title"
                style={{ marginBottom: '6px' }}
              >
                Raibex Lock-in
              </h2>

              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--gray-dark)',
                  fontWeight: '600',
                }}
              >
                Executive Access Terminal
              </span>
            </div>

            {/* LOGIN TYPE BUTTONS */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '24px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setLoginType('user');
                  // handleAutoFill('user');
                }}
                className={
                  loginType === 'user'
                    ? 'btn btn-primary'
                    : 'btn btn-outline'
                }
                style={{ flex: 1 }}
              >
                User Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginType('admin');
                  // handleAutoFill('admin');
                }}
                className={
                  loginType === 'admin'
                    ? 'btn btn-primary'
                    : 'btn btn-outline'
                }
                style={{ flex: 1 }}
              >
                Admin Login
              </button>
            </div>

            {/* ERROR MESSAGE */}
            {errMessage && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  color: 'var(--error)',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                {errMessage}
              </div>
            )}

            {/* LOGIN FORM */}
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Registered Email Address</label>

                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div
                className="form-group"
                style={{ marginBottom: '24px' }}
              >
                <label>Security Password</label>

                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px 0',
                }}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            {/* REGISTER LINK ONLY FOR USER */}
            {loginType === 'user' && (
              <div className="form-footer">
                Don't have a corporate account?{' '}
                <Link to="/register">
                  Register Here
                </Link>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
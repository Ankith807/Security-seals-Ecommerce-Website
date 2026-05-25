import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  
  const [errMessage, setErrMessage] = useState('');
  
  const { register, isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrMessage('');

    if (!username || !email || !password) {
      setErrMessage('Username, email, and password are required fields.');
      return;
    }

    if (password.length < 6) {
      setErrMessage('Password must be at least 6 characters.');
      return;
    }

    const res = await register(username, email, password, contactNumber, address);
    if (!res.success) {
      setErrMessage(res.message || 'Registration failed. Email might already exist.');
    } else {
      alert('Registration Successful! Secure token generated.');
      navigate('/');
    }
  };

  return (
    <div>

      <section className="section" style={{ display: 'flex', alignItems: 'center', minHeight: 'calc(100vh - 160px)', padding: '50px 0' }}>
        <div className="container">
          <div className="form-card animate-slide" style={{ maxWidth: '520px' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <svg className="svg-icon" style={{ color: 'var(--accent)', width: '48px', height: '48px', marginBottom: '8px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" />
              </svg>
              <h2 className="form-title" style={{ marginBottom: '6px' }}>Corporate Sign Up</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-dark)', fontWeight: '600' }}>Register Security Requisition Profile</span>
            </div>

            {errMessage && (
              <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: 'var(--error)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>
                {errMessage}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label>Company / Representative Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Logistics Ltd"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Corporate Email *</label>
                <input
                  type="email"
                  required
                  placeholder="name@acmelogistics.com"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Security Password (Min 6 chars) *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Customs Contact Number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 99887 76655"
                  className="form-control"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Default Shipping Address / Port Destination</label>
                <textarea
                  rows={2}
                  placeholder="Warehouse details, industrial area, city, pincode"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px 0' }}>
                {loading ? 'Registering profile...' : 'Create Account'}
              </button>
            </form>

            <div className="form-footer">
              Already have an account? <Link to="/login">Sign In Here</Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Register;

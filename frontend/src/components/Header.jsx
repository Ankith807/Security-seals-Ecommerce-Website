import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogoClick = () => {
    setSearchQuery('');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container nav-container">
        {/* Logo */}
        <div className="logo" onClick={handleLogoClick}>
          <svg className="svg-icon" style={{ color: 'var(--accent)', width: '32px', height: '32px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          RAIBEX<span>SEALS</span>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>
            Products
          </Link>
          <Link to="/feedback" className={`nav-link ${location.pathname === '/feedback' ? 'active' : ''}`}>
            Contact & Feedback
          </Link>
          {isAuthenticated && (
            <Link to="/orders/myorders" className={`nav-link ${location.pathname.startsWith('/orders') ? 'active' : ''}`}>
              My Orders
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`} style={{ color: 'var(--accent)', fontWeight: '700' }}>
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="nav-actions">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="search-box">
            <svg className="svg-icon search-icon" style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search security seals..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Cart Icon */}
          <Link to="/cart" className="badge-container">
            <button className="icon-btn" title="View Shopping Cart">
              <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </button>
            {getCartCount() > 0 && (
              <span className="badge">{getCartCount()}</span>
            )}
          </Link>

          {/* User Account / Session Controls */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary)' }}>
                Hi, {user.username}
              </span>
              <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="nav-link" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                Register
              </Link>
          
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

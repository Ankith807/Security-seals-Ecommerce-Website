import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--white)', fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: '700' }}>
          ADMIN CONTROL
        </h3>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Raibex Executive
        </span>
      </div>

      {/* Navigation Options */}
      <NavLink
        to="/admin"
        end
        className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
      >
        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
        Dashboard
      </NavLink>

      <NavLink
        to="/admin/products"
        className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
      >
        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        Manage Products
      </NavLink>

      <NavLink
        to="/admin/categories"
        className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
      >
        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        Manage Categories
      </NavLink>

      <NavLink
        to="/admin/orders"
        className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
      >
        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        Manage Orders
      </NavLink>

      <NavLink
        to="/admin/payments"
        className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
      >
        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        Manage Payments
      </NavLink>

      <NavLink
        to="/admin/users"
        className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
      >
        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        View Users
      </NavLink>

      <NavLink
        to="/admin/feedback"
        className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
      >
        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        View Feedback
      </NavLink>

      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--gray)', padding: '10px 16px', transition: 'var(--transition)' }} className="sidebar-store-btn">
          <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 10 4 15 9 20" />
            <path d="M20 4v7a4 4 0 0 1-4 4H4" />
          </svg>
          Back To Store
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--primary)', color: 'var(--light)', padding: '60px 0 20px', borderTop: '4px solid var(--accent)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        
        {/* Company Info */}
        <div>
          <div className="logo" style={{ color: 'var(--white)', marginBottom: '16px' }}>
            <svg className="svg-icon" style={{ color: 'var(--accent)', width: '28px', height: '28px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            RAIBEX<span>SEALS</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '20px', lineHeight: '1.6' }}>
            Raibex is a premier manufacturer and global exporter of high-security tamper-evident seals. Engineered to withstand extreme physical forces and provide immediate visual proof of unauthorized entry.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--white)' }}>
            <span style={{ color: 'var(--accent)' }}>✓</span> ISO 17712 CERTIFIED
          </div>
        </div>

        {/* Categories Link */}
        <div>
          <h4 style={{ color: 'var(--white)', marginBottom: '20px', fontSize: '1.1rem' }}>Our Products</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <li><Link to="/products?category=bolt" style={{ color: 'var(--gray)' }} hover={{ color: 'var(--white)' }}>High Security Bolt Seals</Link></li>
            <li><Link to="/products?category=cable" style={{ color: 'var(--gray)' }}>Adjustable Cable Seals</Link></li>
            <li><Link to="/products?category=plastic" style={{ color: 'var(--gray)' }}>Pull-Tight Plastic Seals</Link></li>
            <li><Link to="/products?category=padlock" style={{ color: 'var(--gray)' }}>Utility Padlock Seals</Link></li>
            <li><Link to="/products?category=metal" style={{ color: 'var(--gray)' }}>Metal Strip Cargo Seals</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'var(--white)', marginBottom: '20px', fontSize: '1.1rem' }}>Quick Links</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <li><Link to="/" style={{ color: 'var(--gray)' }}>Home</Link></li>
            <li><Link to="/products" style={{ color: 'var(--gray)' }}>Products Catalog</Link></li>
            <li><Link to="/feedback" style={{ color: 'var(--gray)' }}>Write Feedback</Link></li>
            <li><Link to="/login" style={{ color: 'var(--gray)' }}>Login Portal</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ color: 'var(--white)', marginBottom: '20px', fontSize: '1.1rem' }}>Contact Details</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: 'var(--gray)' }}>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <svg className="svg-icon" style={{ width: '18px', height: '18px', flexShrink: 0, marginTop: '3px', color: 'var(--accent)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Raibex HQ, Sector 4 Industrial Area,<br />Mangalore,575006, India</span>
            </li>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <svg className="svg-icon" style={{ width: '18px', height: '18px', flexShrink: 0, color: 'var(--accent)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 96328652288</span>
            </li>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <svg className="svg-icon" style={{ width: '18px', height: '18px', flexShrink: 0, color: 'var(--accent)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>sales@raibex.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--gray)' }}>
        <p>© {new Date().getFullYear()} Raibex Security Seals Pvt. Ltd. All rights reserved. Simulating High Security Lock Protection.</p>
      </div>
    </footer>
  );
};

export default Footer;

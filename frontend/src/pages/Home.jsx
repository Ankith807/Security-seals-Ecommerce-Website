import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (data.success) {
          // Take first 3 products as featured
          setFeaturedProducts(data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  const categories = [
    { name: 'Bolt Seals', icon: '🔒', desc: 'Container lock pins' },
    { name: 'Cable Seals', icon: '⛓️', desc: 'Adjustable steel wire' },
    { name: 'Plastic Seals', icon: '🏷️', desc: 'Pull-tight indicative' },
    { name: 'Padlock Seals', icon: '🗝️', desc: 'Utility padlock hasps' },
    { name: 'Metal Strip Seals', icon: '🎟️', desc: 'Cargo truck tin plates' }
  ];

  return (
    <div className="animate-fade">

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
              High-Security Logistics Protection
            </span>
            <h1>ISO 17712 Tamper-Evident <span>Security Seals</span></h1>
            <p>
              Protect your bulk cargo shipments, containers, valves, and utility meters with heavy-duty locks. Engineered to deliver quick inspection and absolute proof of security.
            </p>
            <div className="hero-buttons">
              <button onClick={() => navigate('/products')} className="btn btn-primary">
                Explore Catalog
                <svg className="svg-icon" style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              <button onClick={() => navigate('/feedback')} className="btn btn-outline">
                Request Quote
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="seal-art-container">
              <div className="security-badge-sticker">C-TPAT COMPLIANT</div>
              <div className="seal-graphic-bolt" style={{ transform: 'scale(1.2)' }}>
                <div className="bolt-pin">
                  <div className="bolt-pin-cap" style={{ backgroundColor: 'var(--accent)' }}></div>
                </div>
                <div className="bolt-lock-body"></div>
                <div className="bolt-serial-tag" style={{ fontSize: '0.5rem' }}>RAIBEX-002</div>
              </div>
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '4px' }}>Raibex RX-Bolt 177</h4>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--gray-dark)' }}>Tensile Strength: &gt; 20 kN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Value Propositions */}
      <section className="section" style={{ backgroundColor: 'var(--white)', borderBottom: '1px solid var(--gray-light)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(242, 100, 25, 0.1)', color: 'var(--accent)', fontSize: '1.5rem', fontWeight: 'bold' }}>✓</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px' }}>ISO 17712 Certified</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-dark)' }}>Passed highest international security grades for marine containers and customs audits worldwide.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(11, 37, 69, 0.1)', color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>★</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px' }}>Custom Laser Marking</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-dark)' }}>Laser-engrave your corporate initials, custom logos, barcodes, and consecutive numbering tracking.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', fontSize: '1.5rem', fontWeight: 'bold' }}>🔒</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px' }}>Anti-Spin Mechanics</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-dark)' }}>Hexagonal lock bushes block high-speed rotation friction entries, securing goods absolutely.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="section" style={{ backgroundColor: 'var(--light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Product Categories</h2>
            <p style={{ color: 'var(--gray-dark)', maxWidth: '600px', margin: '0 auto' }}>
              Explore our diverse security seals range, customized to secure containers, transport fleets, pharmaceutical warehouses, and utility calibration meters.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="category-card"
                onClick={() => handleCategoryClick(cat.name)}
              >
                <div className="category-icon-wrapper">
                  <span style={{ fontSize: '2.2rem' }}>{cat.icon}</span>
                </div>
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Featured Seals</h2>
              <p style={{ color: 'var(--gray-dark)' }}>Order C-TPAT approved security seals directly off our digital storefront.</p>
            </div>
            <button onClick={() => navigate('/products')} className="btn btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              View Full Catalog
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div className="pulse-loader" style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary)' }}>Loading premium seals...</div>
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;

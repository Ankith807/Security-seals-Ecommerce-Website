import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated, token } = useContext(AuthContext);

  // Buy variables
  const [qty, setQty] = useState(1);
  const [customPrint, setCustomPrint] = useState('');
  
  // Review form variables
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleQtyChange = (val) => {
    if (!product) return;
    const newQty = qty + val;
    if (newQty >= 1 && newQty <= product.stock) {
      setQty(newQty);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty, customPrint);
    alert(`${qty} units of ${product.name} added to cart!${customPrint ? ` Custom print: "${customPrint}"` : ''}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await res.json();

      if (data.success) {
        setReviewMessage('Review submitted successfully!');
        setComment('');
        setRating(5);
        // Refresh product details
        fetchProduct();
      } else {
        setReviewMessage(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewMessage('Error submitting review. Please try again.');
    }
  };

  if (loading) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '150px 0' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary)' }}>Retrieving security seal technical parameters...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 0' }}>
          <span style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</span>
          <h2>Security Seal Not Found</h2>
          <p style={{ margin: '12px 0 24px', color: 'var(--gray-dark)' }}>The product ID is invalid or has been decommissioned from our catalogs.</p>
          <Link to="/products" className="btn btn-primary">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="animate-fade">

      <section className="section" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container">
          
          {/* Back link */}
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--secondary)', marginBottom: '24px' }}>
            ← Back to products
          </Link>

          <div className="product-detail-grid">
            
            {/* Left: Images */}
            <div className="product-gallery">
              <div className="product-gallery-inner">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ width: '100%', height: 'auto', borderRadius: 'var(--border-radius)', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentNode.querySelector('.custom-seal-fallback').style.display = 'flex';
                    }}
                  />
                ) : null}

                {/* Fallback CSS Draw */}
                <div
                  className="custom-seal-fallback"
                  style={{
                    display: (!product.images || product.images.length === 0) ? 'flex' : 'none',
                    width: '100%',
                    height: '350px',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <div className="seal-graphic-bolt" style={{ transform: 'scale(1.4)' }}>
                    <div className="bolt-pin">
                      <div className="bolt-pin-cap" style={{ backgroundColor: 'var(--accent)' }}></div>
                    </div>
                    <div className="bolt-lock-body"></div>
                    <div className="bolt-serial-tag">RX-B17</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right: Metadata & Actions */}
            <div>
              <span className="product-category" style={{ fontSize: '0.9rem' }}>{product.category?.name}</span>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '12px', marginTop: '6px' }}>{product.name}</h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <StarRating rating={product.rating || 0} size="16px" />
                <span style={{ fontSize: '0.9rem', color: 'var(--gray-dark)' }}>{product.numReviews || 0} reviews</span>
                
                {isOutOfStock ? (
                  <span className="status-indicator error">Out of stock</span>
                ) : isLowStock ? (
                  <span className="status-indicator warning">Low stock ({product.stock})</span>
                ) : (
                  <span className="status-indicator success">In stock</span>
                )}
              </div>

              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '20px' }}>
                ₹{product.price.toFixed(2)} <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--gray-dark)' }}>/ unit (Incl. standard marking)</span>
              </div>

              <p style={{ color: 'var(--gray-dark)', fontSize: '1.05rem', marginBottom: '28px', lineHeight: '1.7' }}>
                {product.description}
              </p>

              {/* CUSTOM PRINT FORM (RAIBEX SPECIALTY) */}
              {!isOutOfStock && (
                <div className="customization-box">
                  <h4>
                    <svg className="svg-icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Custom Seal Identification Marking
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-dark)' }}>
                    Add sequential numbers or custom company text to be laser-engraved onto your seals locking cylinder body (Free of charge).
                  </p>
                  
                  <div className="customization-field">
                    <label>Laser Engraving Text (e.g. Logo Initials or Batch Code)</label>
                    <input
                      type="text"
                      className="customization-input"
                      placeholder="e.g. LOGISTICS CORP (Max 24 chars)"
                      maxLength={24}
                      value={customPrint}
                      onChange={(e) => setCustomPrint(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Qty & Add to Cart Action */}
              {!isOutOfStock ? (
                <div className="action-bar">
                  <div className="quantity-selector">
                    <button onClick={() => handleQtyChange(-1)} disabled={qty <= 1} className="qty-btn" title="Decrease Quantity">-</button>
                    <span className="qty-value">{qty}</span>
                    <button onClick={() => handleQtyChange(1)} disabled={qty >= product.stock} className="qty-btn" title="Increase Quantity">+</button>
                  </div>
                  <button onClick={handleAddToCart} className="btn btn-primary" style={{ flexGrow: 1, padding: '14px 28px' }}>
                    Add To Shipping Cart
                  </button>
                </div>
              ) : (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid var(--error)', color: '#b91c1c', padding: '16px', borderRadius: 'var(--border-radius)', marginBottom: '28px', fontWeight: '600', fontSize: '0.9rem' }}>
                  This high-security seal is currently sold out. Please contact sales@raibex.com for production scheduling estimates.
                </div>
              )}

              {/* Technical Specifications */}
              <h3 style={{ fontSize: '1.2rem', marginTop: '40px', borderBottom: '2px solid var(--light)', paddingBottom: '8px' }}>
                Technical Specification Sheet
              </h3>
              <table className="detail-specs-table">
                <tbody>
                  {product.specifications?.material && (
                    <tr>
                      <td className="spec-name">Locking Material</td>
                      <td>{product.specifications.material}</td>
                    </tr>
                  )}
                  {product.specifications?.tensileStrength && (
                    <tr>
                      <td className="spec-name">Tensile Strength Resistance</td>
                      <td>
                        <span className="spec-badge">{product.specifications.tensileStrength}</span>
                      </td>
                    </tr>
                  )}
                  {product.specifications?.lockingMechanism && (
                    <tr>
                      <td className="spec-name">Security Lock Structure</td>
                      <td>{product.specifications.lockingMechanism}</td>
                    </tr>
                  )}
                  {product.specifications?.stripLength && (
                    <tr>
                      <td className="spec-name">Operational Length</td>
                      <td>{product.specifications.stripLength}</td>
                    </tr>
                  )}
                  {product.specifications?.customPrinting && (
                    <tr>
                      <td className="spec-name">Default Laser Markings</td>
                      <td>{product.specifications.customPrinting}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="spec-name">Barcode Compliant</td>
                    <td>{product.specifications?.barcodeSupport ? 'Yes (Barcode 128 / QR Code Support)' : 'Custom engraving only'}</td>
                  </tr>
                </tbody>
              </table>

            </div>

          </div>

          {/* Customer Reviews & Feedback Section */}
          <div style={{ marginTop: '80px', backgroundColor: 'var(--white)', borderRadius: 'var(--border-radius)', padding: '40px', border: '1px solid var(--gray-light)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--primary)' }}>Customer Reviews</h3>

            {/* List Reviews */}
            {product.reviews.length === 0 ? (
              <p style={{ color: 'var(--gray)', fontStyle: 'italic', marginBottom: '40px' }}>No reviews have been written for this security seal yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                {product.reviews.map((rev) => (
                  <div key={rev._id} style={{ borderBottom: '1px solid var(--light)', paddingBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{rev.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <StarRating rating={rev.rating} size="12px" />
                    </div>
                    <p style={{ color: 'var(--gray-dark)', fontSize: '0.95rem' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Write a review */}
            <div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Submit Operational Feedback</h4>
              
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
                  
                  {reviewMessage && (
                    <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: reviewMessage.includes('successfully') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: reviewMessage.includes('successfully') ? 'var(--success)' : 'var(--error)', fontWeight: '600', fontSize: '0.9rem' }}>
                      {reviewMessage}
                    </div>
                  )}

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Performance Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      style={{ padding: '10px 14px', border: '1px solid var(--gray-light)', borderRadius: 'var(--border-radius-sm)', width: '150px' }}
                    >
                      <option value={5}>5 - Excellent Guard</option>
                      <option value={4}>4 - High security</option>
                      <option value={3}>3 - Good indicative</option>
                      <option value={2}>2 - Weak locking</option>
                      <option value={1}>1 - Easily tampered</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Detailed Evaluation Comment</label>
                    <textarea
                      rows={4}
                      className="form-control"
                      placeholder="Comment on locking strength, tamper evidence tags, material durability..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-secondary" style={{ width: 'fit-content' }}>
                    Submit Seal Review
                  </button>

                </form>
              ) : (
                <div style={{ backgroundColor: 'var(--light)', padding: '16px', borderRadius: 'var(--border-radius-sm)', fontSize: '0.9rem', color: 'var(--gray-dark)' }}>
                  Please <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '700' }}>Login</Link> to submit security reviews and evaluate locking performance.
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default ProductDetail;

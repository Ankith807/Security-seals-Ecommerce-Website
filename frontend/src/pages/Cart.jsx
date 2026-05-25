import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckoutRedirect = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  const subtotal = getCartTotal();
  // Simulated logistics parameters
  const shipping = subtotal > 100 || subtotal === 0 ? 0.0 : 15.0; 
  const tax = subtotal * 0.18; // 18% standard GST / customs excise
  const total = subtotal + shipping + tax;

  return (
    <div className="animate-fade">
      <section className="section" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container">
          
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Your Shipping Cart</h2>
            <p style={{ color: 'var(--gray-dark)' }}>
              Manage your batch orders and customize laser marking parameters.
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--border-radius)', border: '1px solid var(--gray-light)', padding: '80px 24px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🛒</span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '8px' }}>Your Cart is Empty</h3>
              <p style={{ color: 'var(--gray-dark)', maxWidth: '420px', margin: '0 auto 24px' }}>
                You have not added any security seals to your shipment requisition yet. Browse our catalog to secure your containers.
              </p>
              <Link to="/products" className="btn btn-primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              
              {/* Left Side: Cart Items List */}
              <div className="cart-items">
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px 40px', paddingBottom: '12px', borderBottom: '2px solid var(--light)', fontSize: '0.85rem', fontWeight: '700', color: 'var(--gray-dark)', textTransform: 'uppercase' }}>
                  <span>Seal</span>
                  <span>Description & Customs</span>
                  <span style={{ textAlign: 'center' }}>Quantity</span>
                  <span style={{ textAlign: 'right' }}>Total Price</span>
                  <span></span>
                </div>

                {cartItems.map((item, index) => (
                  <div key={`${item.product}-${index}`} className="cart-item-row">
                    
                    {/* Seal Image or Fallback */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentNode.querySelector('.custom-seal-fallback').style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    <div
                      className="custom-seal-fallback"
                      style={{
                        display: !item.image ? 'flex' : 'none',
                        width: '80px',
                        height: '80px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--light)',
                        borderRadius: 'var(--border-radius-sm)'
                      }}
                    >
                      <div className="seal-graphic-bolt" style={{ transform: 'scale(0.5)' }}>
                        <div className="bolt-pin">
                          <div className="bolt-pin-cap" style={{ backgroundColor: 'var(--accent)' }}></div>
                        </div>
                        <div className="bolt-lock-body"></div>
                      </div>
                    </div>

                    {/* Metadata & Custom marking details */}
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      {item.customPrintText ? (
                        <div className="cart-item-print" title="Laser engraving request">
                          Custom mark: "{item.customPrintText}"
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Standard serial engraving</span>
                      )}
                    </div>

                    {/* Quantity selectors */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div className="quantity-selector" style={{ height: '36px' }}>
                        <button
                          onClick={() => updateQuantity(item.product, item.customPrintText, item.quantity - 1)}
                          className="qty-btn"
                          style={{ width: '32px', height: '32px', fontSize: '1rem' }}
                        >
                          -
                        </button>
                        <span className="qty-value" style={{ width: '32px', fontSize: '0.95rem' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product, item.customPrintText, item.quantity + 1)}
                          className="qty-btn"
                          style={{ width: '32px', height: '32px', fontSize: '1rem' }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div style={{ textAlign: 'right', fontWeight: '800', color: 'var(--primary)' }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Delete button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => removeFromCart(item.product, item.customPrintText)}
                        style={{ background: 'none', border: 'none', color: 'var(--error)', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '50%' }}
                        title="Remove seal batch"
                      >
                        🗑️
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Right Side: Requisition Summary */}
              <div className="cart-summary">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '2px solid var(--light)', paddingBottom: '8px', color: 'var(--primary)' }}>
                  Requisition Summary
                </h3>

                <div className="summary-row">
                  <span style={{ color: 'var(--gray-dark)' }}>Batch Subtotal ({getCartCount()} items)</span>
                  <span style={{ fontWeight: '600' }}>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span style={{ color: 'var(--gray-dark)' }}>Freight Logistics</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                </div>

                <div className="summary-row">
                  <span style={{ color: 'var(--gray-dark)' }}>Excise Duty / GST (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <div className="summary-row total">
                  <span>Grand Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckoutRedirect}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', marginTop: '24px', borderRadius: 'var(--border-radius)' }}
                >
                  Proceed to Checkout
                </button>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <Link to="/products" style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: '600' }}>
                    ← Add more seals to cargo
                  </Link>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default Cart;

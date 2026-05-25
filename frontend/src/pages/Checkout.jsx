import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import GpayQR from '../assets/Gpay.jpeg';

const Checkout = () => {
  const { cartItems, getCartTotal, getCartCount, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Steps: 1 = Address, 2 = Payment & Confirm
  const [step, setStep] = useState(1);

  // Form Fields
  const [fullName, setFullName] = useState(user?.username || '');
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Payment States
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [upiId, setUpiId] = useState('');
  
  // Simulated Card Details
  const [cardNumInput, setCardNumInput] = useState('');
  const [cardNameInput, setCardNameInput] = useState('');
  const [cardExpiryInput, setCardExpiryInput] = useState('');
  const [cardCvvInput, setCardCvvInput] = useState('');
  const [cardBrand, setCardBrand] = useState('Visa');

  // Loading / Submit State
  const [submitting, setSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Format Card Number
  const handleCardNumChange = (e) => {
    let input = e.target.value.replace(/\D/g, ''); // numbers only
    if (input.length > 16) input = input.slice(0, 16);
    
    // Auto-detect brand
    if (input.startsWith('4')) {
      setCardBrand('Visa');
    } else if (input.startsWith('5')) {
      setCardBrand('Mastercard');
    } else {
      setCardBrand('SecureCard');
    }

    // Format with spaces
    let formatted = input.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumInput(formatted);
  };

  // Format Expiry
  const handleExpiryChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 4) input = input.slice(0, 4);
    if (input.length > 2) {
      input = `${input.slice(0, 2)}/${input.slice(2)}`;
    }
    setCardExpiryInput(input);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !contactNumber.trim() || !address.trim() || !city.trim() || !zipCode.trim()) {
      alert('Please fill out all shipping fields.');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Validate Payments
    if (paymentMethod === 'card') {
      if (cardNumInput.replace(/\s/g, '').length < 16 || cardExpiryInput.length < 5 || cardCvvInput.length < 3) {
        alert('Please fill out valid credit card details.');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        alert('Please enter a valid UPI address.');
        return;
      }
    }

    setSubmitting(true);

    try {
      const orderItems = cartItems.map(item => ({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        customPrintText: item.customPrintText
      }));

      const fullShippingDetails = `${address}, ${city}, ZIP: ${zipCode}, Country: India`;
      const subtotal = getCartTotal();
      const shipping = subtotal > 100 ? 0.0 : 15.0; 
      const tax = subtotal * 0.18;
      const totalAmount = subtotal + shipping + tax;

      // Mock transaction details
      const paymentDetails = paymentMethod === 'cod' ? {} : {
        transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        cardBrand: paymentMethod === 'card' ? cardBrand : 'UPI',
        paymentDate: new Date()
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress: fullShippingDetails,
          contactNumber,
          totalAmount,
          paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
          paymentDetails
        })
      });

      const data = await res.json();

      if (data.success) {
        alert('Order Placed Successfully! Simulated transaction approved.');
        clearCart();
        navigate(`/orders/track/${data.data._id}`);
      } else {
        alert(data.message || 'Error placing order');
      }
    } catch (err) {
      console.error('Error during checkout process:', err);
      alert('Server connection error during checkout. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0.0 : 15.0; 
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <div className="animate-fade">
      <section className="section" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          
          {/* Progress Steps Indicators */}
          <div className="checkout-steps">
            <div className={`step-indicator ${step === 1 ? 'active' : 'completed'}`}>
              <div className="step-num">1</div>
              <span>Port Requisition Destination</span>
            </div>
            <div style={{ color: 'var(--gray)' }}>➔</div>
            <div className={`step-indicator ${step === 2 ? 'active' : ''}`}>
              <div className="step-num">2</div>
              <span>Transaction Settlement</span>
            </div>
          </div>

          <div className="cart-layout" style={{ gridTemplateColumns: '1fr 340px', gap: '32px' }}>
            
            {/* Left: Interactive Multi-step Forms */}
            <div>
              {step === 1 ? (
                // Step 1: Address
                <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--gray-light)', borderRadius: 'var(--border-radius)', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', borderBottom: '2px solid var(--light)', paddingBottom: '12px', marginBottom: '24px' }}>
                    Shipping Logistics Requisition Address
                  </h3>
                  <form onSubmit={handleNextStep}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label>Consignee Company / Full Name</label>
                        <input
                          type="text"
                          required
                          className="form-control"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Customs Contact Phone</label>
                        <input
                          type="text"
                          required
                          className="form-control"
                          value={contactNumber}
                          onChange={(e) => {const value = e.target.value;
                          if(/^\d*$/.test(value)){setContactNumber(value)}}}
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Delivery Warehouse / Street Address</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="Warehouse number, industrial district, street name"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label>Logistics Port City</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. New Delhi"
                          className="form-control"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Postal/ZIP Code</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 110015"
                          className="form-control"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '20px' }}>
                      Proceed to Transaction Settlement
                    </button>
                  </form>
                </div>
              ) : (
                // Step 2: Payment & Placement
                <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--gray-light)', borderRadius: 'var(--border-radius)', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', borderBottom: '2px solid var(--light)', paddingBottom: '12px', marginBottom: '24px' }}>
                    Corporate Transaction Settlement Portal
                  </h3>

                  {/* Payment Choices */}
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
                    <label style={{ flexGrow: 1, padding: '16px', borderRadius: 'var(--border-radius)', border: `2px solid ${paymentMethod === 'card' ? 'var(--accent)' : 'var(--gray-light)'}`, backgroundColor: paymentMethod === 'card' ? 'rgba(242,100,25,0.03)' : 'transparent', display: 'flex', gap: '10px', cursor: 'pointer', fontWeight: '600' }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                      />
                      Credit/Debit Card
                    </label>

                    <label style={{ flexGrow: 1, padding: '16px', borderRadius: 'var(--border-radius)', border: `2px solid ${paymentMethod === 'upi' ? 'var(--accent)' : 'var(--gray-light)'}`, backgroundColor: paymentMethod === 'upi' ? 'rgba(242,100,25,0.03)' : 'transparent', display: 'flex', gap: '10px', cursor: 'pointer', fontWeight: '600' }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                      />
                      UPI / QR Scan
                    </label>

                    <label style={{ flexGrow: 1, padding: '16px', borderRadius: 'var(--border-radius)', border: `2px solid ${paymentMethod === 'cod' ? 'var(--accent)' : 'var(--gray-light)'}`, backgroundColor: paymentMethod === 'cod' ? 'rgba(242,100,25,0.03)' : 'transparent', display: 'flex', gap: '10px', cursor: 'pointer', fontWeight: '600' }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      Cash on Delivery
                    </label>
                  </div>

                  <form onSubmit={handlePlaceOrder}>
                    {paymentMethod === 'card' && (
                      <div className="animate-fade">
                        {/* Interactive Simulated Card Preview */}
                        <div className="credit-card-preview">
                          <div className="card-logo-row">
                            <div className="chip"></div>
                            <span style={{ fontSize: '1.1rem', fontWeight: '800', fontStyle: 'italic' }}>
                              {cardBrand}
                            </span>
                          </div>
                          <div className="card-num">
                            {cardNumInput || '•••• •••• •••• ••••'}
                          </div>
                          <div className="card-meta">
                            <div>
                              <div style={{ fontSize: '0.55rem', color: 'var(--gray)' }}>Cardholder</div>
                              <div>{cardNameInput || 'CARDHOLDER NAME'}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.55rem', color: 'var(--gray)' }}>Expires</div>
                              <div>{cardExpiryInput || 'MM/YY'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Card Entry Fields */}
                        <div className="form-group">
                          <label>Cardholder Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. John Doe"
                            className="form-control"
                            value={cardNameInput}
                            onChange={(e) => setCardNameInput(e.target.value.toUpperCase())}
                          />
                        </div>

                        <div className="form-group">
                          <label>Credit Card Number</label>
                          <input
                            type="text"
                            required
                            placeholder="4000 1234 5678 9010"
                            className="form-control"
                            value={cardNumInput}
                            onChange={handleCardNumChange}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                          <div className="form-group">
                            <label>Expiration Date</label>
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              className="form-control"
                              value={cardExpiryInput}
                              onChange={handleExpiryChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>CVV / CVC Code</label>
                            <input
                              type="password"
                              required
                              placeholder="•••"
                              maxLength={3}
                              className="form-control"
                              value={cardCvvInput}
                              onChange={(e) => setCardCvvInput(e.target.value.replace(/\D/g, ''))}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'upi' && (
                      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '10px 0' }}>
                        <div style={{ padding: '16px', border: '1px solid var(--gray-light)', borderRadius: 'var(--border-radius)', textAlign: 'center', backgroundColor: 'var(--light)' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--gray-dark)', display: 'block', marginBottom: '8px' }}>Scan simulated UPI invoice QR code</span>
                          {/* Visual CSS-drawn QR placeholder */}
                          <img
                              src={GpayQR}
                              alt="GPay QR Code"
                              style={{
                                width: '200px',
                                height: '200px',
                                objectFit: 'contain',
                                borderRadius: '12px',
                                backgroundColor: '#fff',
                                padding: '10px',
                                border: '1px solid var(--gray-light)'}}
                          />
                        </div>
                        <div className="form-group" style={{ width: '100%' }}>
                          <label>Enter Corporate Virtual Payment Address (VPA)</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. raibex@ybl"
                            className="form-control"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'cod' && (
                      <div className="animate-fade" style={{ backgroundColor: 'rgba(19,64,116,0.05)', border: '1px solid var(--secondary)', color: 'var(--secondary)', padding: '16px', borderRadius: 'var(--border-radius)', marginBottom: '24px', fontSize: '0.9rem' }}>
                        <strong>Cash / Purchase Requisition Settlement on Delivery (COD)</strong>
                        <p style={{ marginTop: '6px', fontSize: '0.85rem' }}>
                          Our logistics agent will verify and collect payment inside the cargo terminal during seal delivery. Payment is required in full before seals are unbundled.
                        </p>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '16px', marginTop: '28px' }}>
                      <button type="button" onClick={() => setStep(1)} className="btn btn-outline" style={{ padding: '12px 24px' }}>
                        ← Back to Address
                      </button>
                      <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flexGrow: 1, padding: '12px' }}>
                        {submitting ? 'Approving transaction...' : `Approve & Place Requisition (₹${total.toFixed(2)})`}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right: Cart Requisition Brief Review */}
            <div className="cart-summary" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '16px', borderBottom: '2px solid var(--light)', paddingBottom: '8px' }}>
                Batch Order Review
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
                {cartItems.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <div style={{ maxWidth: '70%' }}>
                      <strong style={{ color: 'var(--primary)' }}>{item.quantity}x</strong> {item.name}
                      {item.customPrintText && <div style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>"{item.customPrintText}"</div>}
                    </div>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--light)', paddingTop: '12px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray)' }}>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray)' }}>Freight Cost</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray)' }}>GST Duty (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary)', borderTop: '2px dashed var(--light)', paddingTop: '10px', marginTop: '4px' }}>
                  <span>Final Bill</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Checkout;

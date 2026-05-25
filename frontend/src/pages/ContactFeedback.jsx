import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ContactFeedback = () => {
  const { user, token } = useContext(AuthContext);
  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('General Inquiry');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  
  const [statusMessage, setStatusMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    setStatusMessage('');

    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, email, subject, message, rating })
      });

      const data = await res.json();

      if (data.success) {
        setStatusMessage('Your feedback inquiry has been submitted successfully! An administrative officer will review it soon.');
        setMessage('');
        setSubject('General Inquiry');
        setRating(5);
      } else {
        setStatusMessage(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setStatusMessage('Connection failed. Please check backend server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade">
      <section className="section" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Write Feedback & Contact Us</h2>
            <p style={{ color: 'var(--gray-dark)', maxWidth: '600px', margin: '0 auto' }}>
              Have custom marking requests? Interested in bulk distribution or want to report website experiences? Get in touch with our Delhi HQ.
            </p>
          </div>

          <div className="cart-layout" style={{ gridTemplateColumns: '320px 1fr', gap: '40px' }}>
            
            {/* Left: Contact Coordinates Card */}
            <div>
              <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--gray-light)', borderRadius: 'var(--border-radius)', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', borderBottom: '2px solid var(--light)', paddingBottom: '8px' }}>
                  Headquarters
                </h3>

                <div style={{ fontSize: '0.9rem', color: 'var(--gray-dark)' }}>
                  <strong>Raibex Security Seals Pvt. Ltd.</strong>
                  <p style={{ marginTop: '8px' }}>
                    Plot 12A, Industrial Sector 4,<br />
                    Mangalore Port <br />
                    Mangalore , 575006 , India
                  </p>
                </div>

                <div style={{ fontSize: '0.9rem', color: 'var(--gray-dark)' }}>
                  <strong>Production Enquiries</strong>
                  <p style={{ marginTop: '4px' }}>+91 9632865288</p>
                  <p>sales@raibex.com</p>
                </div>

                <div style={{ fontSize: '0.9rem', color: 'var(--gray-dark)' }}>
                  <strong>ISO Audit Compliance</strong>
                  <p style={{ marginTop: '4px' }}>audit@raibex.com</p>
                </div>
              </div>
            </div>

            {/* Right: Feedback submission form */}
            <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--gray-light)', borderRadius: 'var(--border-radius)', padding: '36px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', borderBottom: '2px solid var(--light)', paddingBottom: '12px', marginBottom: '24px' }}>
                Operational & General Inquiry Form
              </h3>

              {statusMessage && (
                <div style={{ padding: '16px', borderRadius: 'var(--border-radius-sm)', backgroundColor: statusMessage.includes('successfully') ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', color: statusMessage.includes('successfully') ? 'var(--success)' : 'var(--error)', fontWeight: '600', fontSize: '0.9rem', marginBottom: '24px' }}>
                  {statusMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Full Name / Company Representative *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Corporate Email *</label>
                    <input
                      type="email"
                      required
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Inquiry Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Evaluation Experience Rating</label>
                    <select
                      className="form-control"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ (Good)</option>
                      <option value={3}>⭐⭐⭐ (Average)</option>
                      <option value={2}>⭐⭐ (Weak)</option>
                      <option value={1}>⭐ (Poor)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Message *</label>
                  <textarea
                    required
                    rows={6}
                    className="form-control"
                    placeholder="Enter message details, e.g. custom logo engraving, wholesale price requisitions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '14px 28px', width: 'fit-content' }}>
                  {submitting ? 'Submitting query...' : 'Send Inquiry Message'}
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default ContactFeedback;

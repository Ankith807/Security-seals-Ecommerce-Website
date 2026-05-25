import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import StarRating from '../components/StarRating';

const AdminFeedback = () => {
  const { token, isAdmin, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!authLoading && (!token || !isAdmin)) {
      navigate('/login?redirect=admin/feedback');
    }
  }, [token, isAdmin, authLoading, navigate]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/feedback`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackList(data.data);
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isAdmin) {
      fetchFeedback();
    }
  }, [token, isAdmin]);

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary)' }}>Accessing Executive Terminal...</span>
      </div>
    );
  }

  // Calculate Metrics
  const averageRating = feedbackList.length > 0 
    ? feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / feedbackList.length 
    : 0;

  // Filter
  const filteredFeedback = feedbackList.filter(f => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = ratingFilter === 'all' || f.rating === Number(ratingFilter);

    return matchesSearch && matchesRating;
  });

  return (
    <div className="admin-layout animate-fade">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-header-row">
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary)' }}>Logistics Support Desk</h1>
            <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginTop: '4px' }}>
              Moderate active corporate client feedback, technical requests, and support communications.
            </p>
          </div>
        </div>

        {/* Feedback Metrics */}
        <div className="admin-grid-metrics" style={{ marginBottom: '28px', gridTemplateColumns: '1fr 1fr' }}>
          <div className="metric-card sales" style={{ borderLeft: '4px solid var(--success)' }}>
            <span className="metric-label">Average Satisfaction Rating</span>
            <div className="metric-value">{averageRating.toFixed(1)} / 5.0</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-dark)' }}>Computed across all client inquiries</span>
          </div>

          <div className="metric-card orders" style={{ borderLeft: '4px solid var(--primary)' }}>
            <span className="metric-label">Total Inquiries Logged</span>
            <div className="metric-value">{feedbackList.length}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-dark)' }}>Feedback records in database</span>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-header-row" style={{ backgroundColor: 'var(--white)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--gray-light)', gap: '16px', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input 
              type="text"
              placeholder="Search feedback content, author names, topics, or email logs..."
              className="form-control"
              style={{ margin: 0 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select 
              className="form-control"
              style={{ margin: 0, minWidth: '180px' }}
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="all">All Service Ratings</option>
              <option value="5">5 Stars (Excellent)</option>
              <option value="4">4 Stars (Good)</option>
              <option value="3">3 Stars (Satisfactory)</option>
              <option value="2">2 Stars (Poor)</option>
              <option value="1">1 Star (Critical)</option>
            </select>
          </div>
        </div>

        {/* Feedback List */}
        {filteredFeedback.length === 0 ? (
          <div style={{ backgroundColor: 'var(--white)', borderRadius: '12px', border: '1px solid var(--gray-light)', padding: '40px', textAlign: 'center', color: 'var(--gray-dark)' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>No active customer queries or reviews logged under these filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {filteredFeedback.map((f) => (
              <div 
                key={f._id} 
                style={{ 
                  backgroundColor: 'var(--white)', 
                  borderRadius: '12px', 
                  border: '1px solid var(--gray-light)', 
                  padding: '24px', 
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--light)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '700' }}>{f.subject}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-dark)', marginTop: '4px' }}>
                      From: <strong style={{ color: 'var(--secondary)' }}>{f.name}</strong> ({f.email}) 
                      <span style={{ margin: '0 8px', color: 'var(--gray)' }}>|</span> 
                      Logged: {new Date(f.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <StarRating rating={f.rating} />
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary)' }}>({f.rating}/5)</span>
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--primary)', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 16px 0', whiteSpace: 'pre-line' }}>
                  {f.message}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <a 
                    href={`mailto:${f.email}?subject=Re: Raibex Security Support - ${f.subject}`}
                    className="btn btn-outline"
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '0.8rem', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Respond to Consignee
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminFeedback;

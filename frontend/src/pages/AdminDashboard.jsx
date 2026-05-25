import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
  const { user, token, isAdmin, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Metrics states
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalOrdersCount: 0,
    productsCount: 0,
    usersCount: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // If auth state is verified and user is not an admin, block access
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login?redirect=admin');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!token || !isAdmin) return;

      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Fetch products, orders, users, feedback in parallel
        const [prodRes, orderRes, userRes, feedRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/orders`, { headers }),
          fetch(`${API_URL}/auth/users`, { headers }),
          fetch(`${API_URL}/feedback`, { headers })
        ]);

        const productsData = await prodRes.json();
        const ordersData = await orderRes.json();
        const usersData = await userRes.json();
        const feedbackData = await feedRes.json();

        if (ordersData.success && productsData.success && usersData.success) {
          const orders = ordersData.data || [];
          
          // Calculate total sales revenue (from completed orders)
          const totalSales = orders
            .filter(o => o.paymentStatus === 'completed')
            .reduce((acc, curr) => acc + curr.totalAmount, 0);

          setMetrics({
            totalSales,
            totalOrdersCount: orders.length,
            productsCount: productsData.count || 0,
            usersCount: usersData.count || 0
          });

          setRecentOrders(orders.slice(0, 5));
        }

        if (feedbackData.success) {
          setRecentFeedback(feedbackData.data.slice(0, 3));
        }

      } catch (err) {
        console.error('Error fetching administrative statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token && isAdmin) {
      fetchDashboardStats();
    }
  }, [token, isAdmin]);

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary)' }}>Accessing Executive Terminal...</span>
      </div>
    );
  }

  return (
    <div className="admin-layout animate-fade">
      <AdminSidebar />
      
      <main className="admin-main">
        {/* Header Row */}
        <div className="admin-header-row">
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary)' }}>Operations Terminal</h1>
            <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginTop: '4px' }}>
              Welcome back, administrator. Monitoring live logistics security consignments.
            </p>
          </div>
          <div style={{ padding: '8px 16px', backgroundColor: 'var(--white)', border: '1px solid var(--gray-light)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)' }}>
            System Status: <span style={{ color: 'var(--success)' }}>● ONLINE</span>
          </div>
        </div>

        {/* Grid Metrics Row */}
        <div className="admin-grid-metrics">
          <div className="metric-card sales">
            <span className="metric-label">Total Revenue</span>
            <div className="metric-value">${metrics.totalSales.toFixed(2)}</div>
          </div>
          
          <div className="metric-card orders">
            <span className="metric-label">Requisitions Placed</span>
            <div className="metric-value">{metrics.totalOrdersCount}</div>
          </div>

          <div className="metric-card">
            <span className="metric-label">Active Catalog Items</span>
            <div className="metric-value">{metrics.productsCount}</div>
          </div>

          <div className="metric-card users">
            <span className="metric-label">Registered Consignees</span>
            <div className="metric-value">{metrics.usersCount}</div>
          </div>
        </div>

        {/* Dashboard Split Logs */}
        <div className="cart-layout" style={{ gridTemplateColumns: '1fr 340px', gap: '32px', marginTop: 0 }}>
          
          {/* Left: Recent Consignments */}
          <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--border-radius)', border: '1px solid var(--gray-light)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid var(--light)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>Recent Consignments</h3>
              <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600' }}>
                View All
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p style={{ color: 'var(--gray)', fontStyle: 'italic', textAlign: 'center', padding: '30px 0' }}>
                No active logistics consignments have been registered yet.
              </p>
            ) : (
              <div className="admin-table-container" style={{ boxShadow: 'none', border: 'none' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ padding: '10px 14px' }}>Consignee</th>
                      <th style={{ padding: '10px 14px' }}>Date</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Total</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center' }}>Milestone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => (
                      <tr key={o._id}>
                        <td style={{ padding: '12px 14px', fontWeight: '600' }}>{o.user?.username || 'Guest'}</td>
                        <td style={{ padding: '12px 14px', fontSize: '0.85rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '800' }}>${o.totalAmount.toFixed(2)}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <span className={`status-indicator ${o.orderStatus === 'delivered' ? 'success' : o.orderStatus === 'shipped' ? 'info' : o.orderStatus === 'cancelled' ? 'error' : 'warning'}`} style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                            {o.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right: Recent Inquiries */}
          <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--border-radius)', border: '1px solid var(--gray-light)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid var(--light)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>Logistics Inbox</h3>
              <Link to="/admin/feedback" style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600' }}>
                View All
              </Link>
            </div>

            {recentFeedback.length === 0 ? (
              <p style={{ color: 'var(--gray)', fontStyle: 'italic', textAlign: 'center', padding: '30px 0' }}>
                No active client feedback or inquiries in ledger.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentFeedback.map((feed) => (
                  <div key={feed._id} style={{ borderBottom: '1px solid var(--light)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--gray-dark)', fontWeight: '600', marginBottom: '4px' }}>
                      <span>{feed.name}</span>
                      <span>Rating: {feed.rating}/5</span>
                    </div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>{feed.subject}</strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-dark)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {feed.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;

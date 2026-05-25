import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const MyOrders = () => {
  const { token, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!authLoading && !token) {
      navigate('/login?redirect=orders/myorders');
    }
  }, [authLoading, token, navigate]);

  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/orders/myorders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.message || 'Unable to fetch your orders.');
      }
    } catch (err) {
      console.error('Error fetching user orders:', err);
      setError('Network error while retrieving your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary)' }}>Loading your order registry...</span>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      <section className="section" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div>
              <h2 style={{ fontSize: '2.1rem', marginBottom: '8px', color: 'var(--primary)' }}>My Orders</h2>
              <p style={{ color: 'var(--gray-dark)', maxWidth: '650px' }}>
                Track your recent consignments and view the live status of each order placed with Raibex.
              </p>
            </div>
            <Link to="/products" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }}>
              Continue Shopping
            </Link>
          </div>

          {error && (
            <div style={{ padding: '18px', marginBottom: '24px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: 'var(--error)' }}>
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-dark)' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px' }}>No orders found in your account.</p>
              <p style={{ maxWidth: '520px', margin: '0 auto 24px' }}>
                Place your first order or return to the product catalog to choose premium security seals.
              </p>
              <Link to="/products" className="btn btn-primary">Browse Products</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {orders.map((order) => (
                <div key={order._id} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--gray-light)', borderRadius: 'var(--border-radius)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Order Ref
                      </div>
                      <h3 style={{ fontFamily: 'monospace', margin: 0, color: 'var(--primary)' }}>
                        {order._id.toUpperCase()}
                      </h3>
                      <div style={{ marginTop: '8px', color: 'var(--gray-dark)', fontSize: '0.9rem' }}>
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '190px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px 12px', borderRadius: '999px', backgroundColor: order.orderStatus === 'delivered' ? 'rgba(16, 185, 129, 0.1)' : order.orderStatus === 'shipped' ? 'rgba(59, 130, 246, 0.1)' : order.orderStatus === 'processing' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(248, 113, 113, 0.1)', color: order.orderStatus === 'delivered' ? 'var(--success)' : order.orderStatus === 'shipped' ? 'var(--accent)' : order.orderStatus === 'processing' ? 'var(--warning)' : 'var(--error)', fontWeight: '700', textTransform: 'capitalize', fontSize: '0.85rem' }}>
                        {order.orderStatus}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px 12px', borderRadius: '999px', backgroundColor: 'rgba(243, 244, 246, 0.8)', color: 'var(--gray-dark)', fontSize: '0.85rem', fontWeight: '600' }}>
                        ₹{order.totalAmount.toFixed(2)} • {order.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginTop: '22px' }}>
                    <div>
                      <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--gray-dark)' }}>Shipping Address</strong>
                      <p style={{ margin: 0, color: 'var(--gray-dark)', lineHeight: '1.6' }}>{order.shippingAddress}</p>
                    </div>
                    <div>
                      <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--gray-dark)' }}>Contact Number</strong>
                      <p style={{ margin: 0, color: 'var(--gray-dark)' }}>{order.contactNumber}</p>
                    </div>
                    <div>
                      <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--gray-dark)' }}>Tracking Code</strong>
                      <p style={{ margin: 0, color: order.trackingNumber ? 'var(--primary)' : 'var(--gray)' }}>{order.trackingNumber || 'Pending assignment'}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <Link to={`/orders/track/${order._id}`} className="btn btn-primary" style={{ minWidth: '160px' }}>
                      Track Order
                    </Link>
                    <button className="btn btn-outline" style={{ minWidth: '160px' }} type="button" disabled>
                      Items: {order.items.length}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyOrders;

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || 'Unable to retrieve order details.');
      }
    } catch (err) {
      console.error('Error fetching order for tracking:', err);
      setError('Network error while fetching order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !token) {
      navigate(`/login?redirect=orders/track/${id}`);
      return;
    }

    if (token) {
      fetchOrderDetails();
    }
  }, [id, token, authLoading, navigate]);

  if (loading) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '150px 0' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary)' }}>Querying port tracking systems...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 0' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>⚠️</span>
          <h2>{error ? 'Unable to Load Order' : 'Requisition Ledger Not Found'}</h2>
          <p style={{ margin: '12px 0 24px', color: 'var(--gray-dark)', maxWidth: '520px', textAlign: 'center' }}>
            {error || 'We could not locate an order matching the specified ID on this account.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
            <Link to="/orders/myorders" className="btn btn-outline">My Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  const milestones = [
    { status: 'placed', label: 'Placed', desc: 'Registered in ledger' },
    { status: 'processing', label: 'Processing', desc: 'Laser marking specs' },
    { status: 'shipped', label: 'Shipped', desc: 'Dispatched from terminal' },
    { status: 'delivered', label: 'Delivered', desc: 'Received & secured' }
  ];

  // Helper to resolve milestone state (completed, active, pending)
  const getMilestoneClass = (mStatus, currentStatus) => {
    const statusOrder = ['placed', 'processing', 'shipped', 'delivered'];
    const targetIdx = statusOrder.indexOf(mStatus);
    const currentIdx = statusOrder.indexOf(currentStatus);

    if (currentStatus === 'cancelled') {
      return 'pending';
    }

    if (targetIdx < currentIdx) {
      return 'completed';
    } else if (targetIdx === currentIdx) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  // Helper to resolve timeline progress line width percentage
  const getProgressWidth = (currentStatus) => {
    switch (currentStatus) {
      case 'placed': return '0%';
      case 'processing': return '33%';
      case 'shipped': return '66%';
      case 'delivered': return '100%';
      default: return '0%';
    }
  };

  return (
    <div className="animate-fade">

      <section className="section" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          
          {/* Order Meta Header Card */}
          <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--gray-light)', borderRadius: 'var(--border-radius)', padding: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '32px', boxShadow: 'var(--shadow-sm)' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: '600', textTransform: 'uppercase' }}>Consignment ID</span>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'monospace', color: 'var(--primary)', marginTop: '4px' }}>
                {order._id.toUpperCase()}
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: '600', textTransform: 'uppercase' }}>Placed Date</span>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary)', marginTop: '4px' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: '600', textTransform: 'uppercase' }}>Settlement</span>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: order.paymentStatus === 'completed' ? 'var(--success)' : 'var(--warning)', marginTop: '4px', textTransform: 'uppercase' }}>
                  {order.paymentStatus}
                </div>
              </div>
            </div>

            <button onClick={fetchOrderDetails} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Sync Tracker 
            </button>
          </div>

          {/* Dynamic Milestones Section */}
          <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--gray-light)', borderRadius: 'var(--border-radius)', padding: '40px 32px', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '12px' }}>
              Live Security Requisition Status
            </h3>
            
            {order.orderStatus === 'cancelled' ? (
              <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid var(--error)', borderRadius: '8px', color: 'var(--error)', fontWeight: '600', textAlign: 'center' }}>
                Requisition Cancelled: This order has been voided and custom markings have been cancelled.
              </div>
            ) : (
              <div>
                {/* Visual timeline progress bar */}
                <div className="timeline">
                  <div className="timeline-progress" style={{ width: getProgressWidth(order.orderStatus) }}></div>
                  
                  {milestones.map((m, index) => {
                    const mClass = getMilestoneClass(m.status, order.orderStatus);
                    return (
                      <div key={index} className={`timeline-step ${mClass}`}>
                        <div className="timeline-circle">
                          {mClass === 'completed' ? '✓' : index + 1}
                        </div>
                        <span className="timeline-label">{m.label}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--gray)', marginTop: '4px', textAlign: 'center' }}>
                          {m.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Logistics details based on status */}
                {order.orderStatus === 'shipped' && order.trackingNumber && (
                  <div style={{ marginTop: '40px', padding: '16px', backgroundColor: 'rgba(242, 100, 25, 0.04)', border: '1px dashed var(--accent)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>DHL Global Cargo Dispatch Active</strong>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-dark)', marginTop: '2px' }}>Your parcel is in transit to the seaport depot.</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray)', textTransform: 'uppercase', display: 'block', textAlign: 'right' }}>Logistics Tracking Code</span>
                      <strong style={{ fontSize: '1rem', fontFamily: 'monospace', color: 'var(--primary)' }}>{order.trackingNumber}</strong>
                    </div>
                  </div>
                )}

                {order.orderStatus === 'delivered' && (
                  <div style={{ marginTop: '40px', padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--success)', borderRadius: '8px', color: 'var(--success)', fontWeight: '600', fontSize: '0.9rem', textAlign: 'center' }}>
                    ✓ Consignment Delivered: Handed over and secured inside warehousing facilities.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Consignment Items Details List */}
          <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--gray-light)', borderRadius: 'var(--border-radius)', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', borderBottom: '2px solid var(--light)', paddingBottom: '12px', marginBottom: '20px' }}>
              Consignment Ledger Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {order.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--light)', paddingBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--primary)' }}>{item.name}</h4>
                    {item.customPrintText ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent)', backgroundColor: 'rgba(242,100,25,0.05)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                        Laser Marking: "{item.customPrintText}"
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Standard sequential printing</span>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary)' }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-dark)' }}>
                      Qty: {item.quantity} @ ₹{item.price.toFixed(2)}/unit
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sum receipt */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', marginLeft: 'auto', borderTop: '2px solid var(--light)', paddingTop: '16px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--gray)' }}>Subtotal</span>
                <span>₹{(order.totalAmount / 1.18 - (order.totalAmount / 1.18 > 100 ? 0 : 15)).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--gray)' }}>Freight Cost</span>
                <span>{order.totalAmount / 1.18 > 100 ? 'FREE' : '₹15.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)', borderTop: '1px dashed var(--light)', paddingTop: '8px', marginTop: '4px' }}>
                <span>Grand Total</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Consignee Address */}
            <div style={{ borderTop: '2px solid var(--light)', paddingTop: '20px', marginTop: '32px' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '6px' }}>Consignee Destination Warehouse</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-dark)', lineHeight: '1.6' }}>{order.shippingAddress}</p>
              <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--gray-dark)', marginTop: '8px' }}>
                <strong>Warehouse Contact:</strong> {order.contactNumber}
              </span>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default OrderTracking;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

const AdminOrders = () => {
  const { token, isAdmin, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!authLoading && (!token || !isAdmin)) {
      navigate('/login?redirect=admin/orders');
    }
  }, [token, isAdmin, authLoading, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isAdmin) {
      fetchOrders();
    }
  }, [token, isAdmin]);

  const handleOpenInspectModal = (order) => {
    setSelectedOrder(order);
    setStatus(order.orderStatus);
    setTrackingNumber(order.trackingNumber || '');
    setShowModal(true);
  };

  const handleStatusUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const res = await fetch(`${API_URL}/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderStatus: status,
          trackingNumber: trackingNumber
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('Order status and tracking credentials updated successfully.');
        setShowModal(false);
        fetchOrders();
      } else {
        alert(data.message || 'Error updating order status');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Network error while updating order.');
    }
  };

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
        <div className="admin-header-row">
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary)' }}>Manage Consignments</h1>
            <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginTop: '4px' }}>
              Track logistics shipments, inspect laser engravings, and dispatch secure packages.
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="admin-table-container">
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-dark)' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>No consignments found in active registry.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Consignee</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                  <th style={{ textAlign: 'center' }}>Method</th>
                  <th style={{ textAlign: 'center' }}>Payment</th>
                  <th style={{ textAlign: 'center' }}>Milestone</th>
                  {/* <th style={{ textAlign: 'center' }}>Tracking</th> */}
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '0.85rem' }}>
                      {o._id.substring(o._id.length - 8).toUpperCase()}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
                        {o.user?.username || 'Guest'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-dark)' }}>
                        {o.user?.email || ''}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--accent)' }}>
                      ₹{o.totalAmount.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>
                      {o.paymentMethod}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-indicator ${o.paymentStatus === 'completed' ? 'success' : o.paymentStatus === 'refunded' ? 'info' : o.paymentStatus === 'failed' ? 'error' : 'warning'}`} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-indicator ${o.orderStatus === 'delivered' ? 'success' : o.orderStatus === 'shipped' ? 'info' : o.orderStatus === 'cancelled' ? 'error' : 'warning'}`} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                        {o.orderStatus}
                      </span>
                    </td>
                    {/* <td style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {o.trackingNumber ? o.trackingNumber : <span style={{ color: 'var(--gray)', fontStyle: 'italic' }}>Pending</span>}
                    </td> */}
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => handleOpenInspectModal(o)} 
                        className="btn btn-outline" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Inspect & Status Update Modal */}
        {showModal && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal-content animate-slide" style={{ maxWidth: '700px' }}>
              <button onClick={() => setShowModal(false)} className="modal-close">×</button>

              <h3 style={{ fontSize: '1.4rem', borderBottom: '2px solid var(--light)', paddingBottom: '12px', marginBottom: '20px', color: 'var(--primary)' }}>
                Consignment Details: #{selectedOrder._id.toUpperCase()}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Consignee & Shipping</h4>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Name:</strong> {selectedOrder.user?.username || 'Guest'}</p>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Phone:</strong> {selectedOrder.contactNumber}</p>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem', lineHeight: '1.4' }}><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Payment Summary</h4>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Method:</strong> <span style={{ textTransform: 'uppercase' }}>{selectedOrder.paymentMethod}</span></p>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedOrder.paymentStatus}</span></p>
                  {selectedOrder.paymentDetails?.transactionId && (
                    <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Txn ID:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedOrder.paymentDetails.transactionId}</span></p>
                  )}
                  {selectedOrder.paymentDetails?.cardBrand && (
                    <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Card Brand:</strong> {selectedOrder.paymentDetails.cardBrand}</p>
                  )}
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Items Table */}
              <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Manifest Items</h4>
              <div style={{ border: '1px solid var(--gray-light)', borderRadius: '8px', padding: '12px', marginBottom: '24px', backgroundColor: 'var(--light)' }}>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: index < selectedOrder.items.length - 1 ? '1px solid var(--gray-light)' : 'none' }}>
                    <div>
                      <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{item.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-dark)', marginTop: '4px' }}>
                        Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                        {item.customPrintText && (
                          <span style={{ marginLeft: '12px', padding: '2px 6px', backgroundColor: 'var(--white)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                            Laser Print: "{item.customPrintText}"
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ fontWeight: '800', color: 'var(--primary)' }}>
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', marginTop: '8px', borderTop: '2px solid var(--gray-light)', fontWeight: '800', color: 'var(--accent)', fontSize: '1.05rem' }}>
                  <span>Grand Total:</span>
                  <span>₹{selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Status Update Form */}
              <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>Shipment Dispatch Terminal</h4>
              <form onSubmit={handleStatusUpdateSubmit} style={{ borderTop: '1px solid var(--gray-light)', paddingTop: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Logistics Milestone Status</label>
                    <select 
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="placed">Placed (Pending Review)</option>
                      <option value="processing">Processing (In Production)</option>
                      <option value="shipped">Shipped (In Transit)</option>
                      <option value="delivered">Delivered (Handover Complete)</option>
                      <option value="cancelled">Cancelled (Voided)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Cargo Waybill / Tracking Number</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="e.g. RBX-927481-US"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      disabled={status !== 'shipped' && status !== 'delivered'}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ padding: '10px 20px' }}>
                    Close Details
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flexGrow: 1, padding: '10px' }}>
                    Confirm Shipment Milestones
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrders;

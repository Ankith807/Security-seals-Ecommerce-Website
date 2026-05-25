import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

const AdminPayments = () => {
  const { token, isAdmin, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!authLoading && (!token || !isAdmin)) {
      navigate('/login?redirect=admin/payments');
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
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isAdmin) {
      fetchOrders();
    }
  }, [token, isAdmin]);

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    const confirmationMsg = newPaymentStatus === 'refunded' 
      ? 'Are you sure you want to issue a mock refund for this transaction?'
      : 'Are you sure you want to manually settle this payment as COMPLETED?';

    if (!window.confirm(confirmationMsg)) return;

    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentStatus: newPaymentStatus
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(`Payment status successfully marked as ${newPaymentStatus.toUpperCase()}.`);
        fetchOrders();
      } else {
        alert(data.message || 'Error updating payment status');
      }
    } catch (err) {
      console.error('Error updating payment:', err);
      alert('Network error while processing payment update.');
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary)' }}>Accessing Executive Terminal...</span>
      </div>
    );
  }

  // Calculate Metrics
  const totalSettledRevenue = orders
    .filter(o => o.paymentStatus === 'completed')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const pendingSettlement = orders
    .filter(o => o.paymentStatus === 'pending')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalRefunded = orders
    .filter(o => o.paymentStatus === 'refunded')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  // Filter and Search
  const filteredOrders = orders.filter(o => {
    const txnId = o.paymentDetails?.transactionId || '';
    const email = o.user?.email || '';
    const username = o.user?.username || '';
    const orderId = o._id;

    const matchesSearch = 
      txnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-layout animate-fade">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-header-row">
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary)' }}>Transaction Ledger</h1>
            <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginTop: '4px' }}>
              Track settlement receipts, credit card authorization logs, and approve refunds.
            </p>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="admin-grid-metrics" style={{ marginBottom: '28px' }}>
          <div className="metric-card sales" style={{ borderLeft: '4px solid var(--success)' }}>
            <span className="metric-label">Settled Revenue</span>
            <div className="metric-value">₹{totalSettledRevenue.toFixed(2)}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-dark)' }}>From completed transactions</span>
          </div>

          <div className="metric-card orders" style={{ borderLeft: '4px solid var(--warning)' }}>
            <span className="metric-label">Unsettled / COD Pending</span>
            <div className="metric-value">₹{pendingSettlement.toFixed(2)}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-dark)' }}>Awaiting delivery completion</span>
          </div>

          <div className="metric-card" style={{ borderLeft: '4px solid var(--accent)' }}>
            <span className="metric-label">Total Refunded</span>
            <div className="metric-value" style={{ color: 'var(--accent)' }}>₹{totalRefunded.toFixed(2)}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-dark)' }}>Returned consignments</span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="admin-header-row" style={{ backgroundColor: 'var(--white)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--gray-light)', gap: '16px', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input 
              type="text"
              placeholder="Search by Txn ID, Order ID, User email..."
              className="form-control"
              style={{ margin: 0 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select 
              className="form-control"
              style={{ margin: 0, minWidth: '160px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Payment Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Payments Ledger Table */}
        <div className="admin-table-container">
          {filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-dark)' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>No matching transaction logs found.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Transaction Date</th>
                  <th>Order Ref</th>
                  <th>Consignee</th>
                  <th>Method</th>
                  <th>Transaction ID / Brand</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'center' }}>Settlement</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => {
                  const txnId = o.paymentDetails?.transactionId;
                  const cardBrand = o.paymentDetails?.cardBrand;
                  
                  return (
                    <tr key={o._id}>
                      <td style={{ fontSize: '0.85rem' }}>
                        {new Date(o.createdAt).toLocaleString()}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '0.8rem' }}>
                        #{o._id.substring(o._id.length - 8).toUpperCase()}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.9rem' }}>
                          {o.user?.username || 'Guest'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-dark)' }}>
                          {o.user?.email || ''}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700', color: 'var(--secondary)' }}>
                        {o.paymentMethod}
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {txnId ? (
                          <div>
                            <span style={{ fontFamily: 'monospace', fontWeight: '600', display: 'block' }}>{txnId}</span>
                            {cardBrand && <span style={{ fontSize: '0.7rem', color: 'var(--gray-dark)' }}>Brand: {cardBrand}</span>}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--gray)', fontStyle: 'italic' }}>None (Cash Record)</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--primary)' }}>
                        ₹{o.totalAmount.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`status-indicator ${o.paymentStatus === 'completed' ? 'success' : o.paymentStatus === 'refunded' ? 'info' : o.paymentStatus === 'failed' ? 'error' : 'warning'}`} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {o.paymentStatus === 'completed' && (
                          <button
                            onClick={() => handleUpdatePaymentStatus(o._id, 'refunded')}
                            className="btn btn-danger"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          >
                            Refund
                          </button>
                        )}
                        {o.paymentStatus === 'pending' && (
                          <button
                            onClick={() => handleUpdatePaymentStatus(o._id, 'completed')}
                            className="btn btn-outline"
                            style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: 'var(--success)', color: 'var(--success)' }}
                          >
                            Mark Paid
                          </button>
                        )}
                        {o.paymentStatus === 'refunded' && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--gray)', fontStyle: 'italic' }}>Refunded</span>
                        )}
                        {o.paymentStatus === 'failed' && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--error)', fontWeight: '600' }}>Failed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPayments;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

const AdminUsers = () => {
  const { token, isAdmin, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!authLoading && (!token || !isAdmin)) {
      navigate('/login?redirect=admin/users');
    }
  }, [token, isAdmin, authLoading, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isAdmin) {
      fetchUsers();
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
  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;

  // Filter
  const filteredUsers = users.filter(u => {
    if(u.role ==='admin')return false
    return (
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.contactNumber || '').includes(searchTerm) ||
      (u.address || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="admin-layout animate-fade">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-header-row">
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary)' }}>Consignee Directory</h1>
            <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginTop: '4px' }}>
              View and manage registered logistic clients, purchasing accounts, and administrative clearings.
            </p>
          </div>
        </div>

        {/* User Stats Card */}
        <div className="admin-grid-metrics" style={{ marginBottom: '28px', gridTemplateColumns: '1fr 1fr' }}>
          <div className="metric-card users" style={{ borderLeft: '4px solid var(--primary)' }}>
            <span className="metric-label">Registered Purchasing Consignees</span>
            <div className="metric-value">{userCount}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-dark)' }}>Standard buyer accounts</span>
          </div>

          <div className="metric-card" style={{ borderLeft: '4px solid var(--accent)' }}>
            <span className="metric-label">Administrative Clearance Officers</span>
            <div className="metric-value" style={{ color: 'var(--accent)' }}>{adminCount}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-dark)' }}>Platform operations handlers</span>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ backgroundColor: 'var(--white)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--gray-light)', marginBottom: '20px' }}>
          <input 
            type="text"
            placeholder="Search users by username, email, phone, or corporate dispatch address..."
            className="form-control"
            style={{ margin: 0 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users Table */}
        <div className="admin-table-container">
          {filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-dark)' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>No consignee matches found in active registers.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Registration Date</th>
                  <th>Username</th>
                  <th>Email Address</th>
                  <th style={{ textAlign: 'center' }}>Clearance / Role</th>
                  <th>Contact Number</th>
                  <th>Corporate Dispatch Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontSize: '0.85rem' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--primary)' }}>
                      {u.username}
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      {u.email}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-indicator ${u.role === 'admin' ? 'success' : 'info'}`} style={{ fontSize: '0.75rem', padding: '2px 8px', textTransform: 'uppercase' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {u.contactNumber ? u.contactNumber : <span style={{ color: 'var(--gray)', fontStyle: 'italic' }}>Not Provided</span>}
                    </td>
                    <td style={{ fontSize: '0.85rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={u.address}>
                      {u.address ? u.address : <span style={{ color: 'var(--gray)', fontStyle: 'italic' }}>Not Provided</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;

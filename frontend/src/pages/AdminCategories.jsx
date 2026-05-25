import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

const AdminCategories = () => {
  const { token, isAdmin, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal control
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [targetId, setTargetId] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!authLoading && (!token || !isAdmin)) {
      navigate('/login?redirect=admin/categories');
    }
  }, [token, isAdmin, authLoading, navigate]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isAdmin) {
      fetchCategories();
    }
  }, [token, isAdmin]);

  const handleOpenAddModal = () => {
    setEditMode(false);
    setTargetId('');
    setName('');
    setDescription('');
    setImage('');
    setShowModal(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditMode(true);
    setTargetId(cat._id);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image || '');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const endpoint = editMode ? `${API_URL}/categories/${targetId}` : `${API_URL}/categories`;
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, image })
      });

      const data = await res.json();

      if (data.success) {
        alert(editMode ? 'Category updated!' : 'Category created!');
        setShowModal(false);
        fetchCategories();
      } else {
        alert(data.message || 'Error processing category');
      }
    } catch (err) {
      console.error('Error submitting category:', err);
      alert('Network error submitting category details.');
    }
  };

  const handleDeleteCategory = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete ${catName} category?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        alert('Category deleted successfully.');
        fetchCategories();
      } else {
        // Displays validation block if products are still associated
        alert(data.message || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Network error during category deletion.');
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
            <h1 style={{ fontSize: '2rem', color: 'var(--primary)' }}>Manage Categories</h1>
            <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginTop: '4px' }}>
              Define industrial seals classifications inside active catalog configurations.
            </p>
          </div>
          
          <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ padding: '12px 24px' }}>
            + Add New Category
          </button>
        </div>

        {/* Categories Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Image Code / Graphic Tag</th>
                <th>Technical Scope Description</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{cat.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    <span className="spec-badge">{cat.image || 'no_image_code'}</span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--gray-dark)', maxWidth: '400px' }}>
                    {cat.description}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id, cat.name)}
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content animate-slide">
              <button onClick={() => setShowModal(false)} className="modal-close">×</button>
              
              <h3 style={{ fontSize: '1.4rem', borderBottom: '2px solid var(--light)', paddingBottom: '12px', marginBottom: '20px', color: 'var(--primary)' }}>
                {editMode ? 'Update Seals Classification' : 'Add Seals Classification'}
              </h3>

              <form onSubmit={handleFormSubmit}>
                
                <div className="form-group">
                  <label>Category Label Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bolt Seals"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Image/Graphic Identifier Code</label>
                  <input
                    type="text"
                    placeholder="e.g. bolt_seals"
                    className="form-control"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Technical Scope & Application Description *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe typical applications e.g. cargo containers, tanker valves, airline trolleys..."
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '28px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ padding: '12px 24px' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flexGrow: 1, padding: '12px' }}>
                    {editMode ? 'Update Category' : 'Create Category'}
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

export default AdminCategories;

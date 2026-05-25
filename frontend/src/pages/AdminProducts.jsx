import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

const AdminProducts = () => {
  const { token, isAdmin, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Control
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [targetId, setTargetId] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Specs Form Fields
  const [material, setMaterial] = useState('');
  const [tensileStrength, setTensileStrength] = useState('');
  const [lockingMechanism, setLockingMechanism] = useState('');
  const [stripLength, setStripLength] = useState('');
  const [barcodeSupport, setBarcodeSupport] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!authLoading && (!token || !isAdmin)) {
      navigate('/login?redirect=admin/products');
    }
  }, [token, isAdmin, authLoading, navigate]);

  const fetchCatalogData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`)
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.success) setProducts(prodData.data);
      if (catData.success) {
        setCategories(catData.data);
        if (catData.data.length > 0) setCategory(catData.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching catalog data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isAdmin) {
      fetchCatalogData();
    }
  }, [token, isAdmin]);

  const handleOpenAddModal = () => {
    setEditMode(false);
    setTargetId('');
    setName('');
    setDescription('');
    if (categories.length > 0) setCategory(categories[0]._id);
    setPrice('');
    setStock('');
    setImageUrl('');
    setMaterial('');
    setTensileStrength('');
    setLockingMechanism('');
    setStripLength('');
    setBarcodeSupport(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditMode(true);
    setTargetId(prod._id);
    setName(prod.name);
    setDescription(prod.description);
    setCategory(prod.category?._id || '');
    setPrice(prod.price);
    setStock(prod.stock);
    setImageUrl(prod.images?.[0] || '');
    setMaterial(prod.specifications?.material || '');
    setTensileStrength(prod.specifications?.tensileStrength || '');
    setLockingMechanism(prod.specifications?.lockingMechanism || '');
    setStripLength(prod.specifications?.stripLength || '');
    setBarcodeSupport(!!prod.specifications?.barcodeSupport);
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !price || !stock) {
      alert('Please fill out all required fields.');
      return;
    }

    const payload = {
      name,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      images: imageUrl ? [imageUrl] : [],
      specifications: {
        material,
        tensileStrength,
        lockingMechanism,
        stripLength,
        barcodeSupport
      }
    };

    try {
      const endpoint = editMode ? `${API_URL}/products/${targetId}` : `${API_URL}/products`;
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        alert(editMode ? 'Seal updated successfully!' : 'Seal created successfully!');
        setShowModal(false);
        fetchCatalogData();
      } else {
        alert(data.message || 'Error processing product.');
      }
    } catch (err) {
      console.error('Error submitting product form:', err);
      alert('Network error while processing product form.');
    }
  };

  const handleDeleteProduct = async (id, prodName) => {
    if (!window.confirm(`Are you absolutely sure you want to delete ${prodName} from the security catalogs?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        alert('Product deleted successfully.');
        fetchCatalogData();
      } else {
        alert(data.message || 'Error deleting product.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Network error during product deletion.');
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
        
        {/* Title and Controls */}
        <div className="admin-header-row">
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary)' }}>Manage Security Seals</h1>
            <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginTop: '4px' }}>
              Create, update and delete products inside active warehouse registers.
            </p>
          </div>
          
          <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ padding: '12px 24px' }}>
            + Create New Seal
          </button>
        </div>

        {/* Products Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Seal Name</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Price</th>
                <th style={{ textAlign: 'center' }}>Stock (Units)</th>
                <th>Marking Style</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod._id}>
                  <td style={{ fontWeight: '700', color: 'var(--primary)' }}>
                    {prod.name}
                  </td>
                  <td>{prod.category?.name || 'Unassigned'}</td>
                  <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--accent)' }}>
                    ₹{prod.price.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '600' }}>
                    <span style={{ color: prod.stock <= 0 ? 'var(--error)' : prod.stock <= 10 ? 'var(--warning)' : 'inherit' }}>
                      {prod.stock}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--gray-dark)' }}>
                    {prod.specifications?.tensileStrength || 'Indicative'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod._id, prod.name)}
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

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content animate-slide">
              <button onClick={() => setShowModal(false)} className="modal-close">×</button>
              
              <h3 style={{ fontSize: '1.4rem', borderBottom: '2px solid var(--light)', paddingBottom: '12px', marginBottom: '20px', color: 'var(--primary)' }}>
                {editMode ? 'Update Security Seal Parameters' : 'Register New Security Seal'}
              </h3>

              <form onSubmit={handleFormSubmit}>
                
                <div className="form-group">
                  <label>Seal Model Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Raibex RX-Cable Max"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Description & Scope *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe lock body materials, anti-spin properties, customs certifications..."
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Seal Category *</label>
                    <select
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Image URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://example.com/seal.jpg"
                      className="form-control"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Price (₹ INR) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="form-control"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity (Units) *</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>

                {/* Technical Specifications Subform */}
                <h4 style={{ fontSize: '1rem', color: 'var(--secondary)', borderTop: '2px solid var(--light)', paddingTop: '16px', marginTop: '16px', marginBottom: '12px' }}>
                  Technical Parameters Spec Sheet
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Core Material</label>
                    <input
                      type="text"
                      placeholder="e.g. Q235 Steel pin & ABS plastic"
                      className="form-control"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tensile strength</label>
                    <input
                      type="text"
                      placeholder="e.g. Over 20 kN (ISO 17712)"
                      className="form-control"
                      value={tensileStrength}
                      onChange={(e) => setTensileStrength(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Locking Mechanism Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Hexagonal socket hex washer"
                      className="form-control"
                      value={lockingMechanism}
                      onChange={(e) => setLockingMechanism(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tail / Pin Length</label>
                    <input
                      type="text"
                      placeholder="e.g. 80 mm"
                      className="form-control"
                      value={stripLength}
                      onChange={(e) => setStripLength(e.target.value)}
                    />
                  </div>
                </div>

                <label style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '16px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={barcodeSupport}
                    onChange={(e) => setBarcodeSupport(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  Barcode 128 / QR Code support available on lock bodies
                </label>

                <div style={{ display: 'flex', gap: '16px', marginTop: '28px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ padding: '12px 24px' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flexGrow: 1, padding: '12px' }}>
                    {editMode ? 'Update Security Seal' : 'Add Security Seal'}
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

export default AdminProducts;

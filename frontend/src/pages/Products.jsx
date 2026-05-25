import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // States mirroring URL filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Sync state with URL parameter changes (e.g. searching from Header)
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        // Resolve Category ObjectId if filtering by category name
        let categoryId = '';
        if (selectedCategory) {
          const matchedCat = categories.find(cat => cat.name.toLowerCase().includes(selectedCategory.toLowerCase()));
          if (matchedCat) categoryId = matchedCat._id;
        }

        let queryParams = new URLSearchParams();
        if (categoryId) queryParams.append('category', categoryId);
        if (searchQuery) queryParams.append('search', searchQuery);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        
        // Map sortOption
        if (sortOption === 'priceAsc') queryParams.append('sort', 'priceAsc');
        else if (sortOption === 'priceDesc') queryParams.append('sort', 'priceDesc');
        else if (sortOption === 'rating') queryParams.append('sort', 'rating');

        const res = await fetch(`${API_URL}/products?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only query after categories have loaded (or if categories are not yet empty) to ensure matching ID resolution
    if (categories.length > 0 || !selectedCategory) {
      fetchFilteredProducts();
    }
  }, [selectedCategory, searchQuery, minPrice, maxPrice, sortOption, categories]);

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    // Update URL param
    if (catName) {
      setSearchParams({ category: catName, search: searchQuery });
    } else {
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSortOption('newest');
    setSearchParams({});
  };

  return (
    <div className="animate-fade">
      <section className="section" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container">
          
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Security Seals Catalog</h2>
            <p style={{ color: 'var(--gray-dark)' }}>
              {products.length} heavy-duty security seals matching your operational requirements.
            </p>
          </div>

          <div className="products-layout">
            
            {/* Left Sidebar Filter Section */}
            <aside className="filter-sidebar">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>Filters</h3>
                <button onClick={handleResetFilters} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                  Reset All
                </button>
              </div>

              {/* Category Filter */}
              <div className="filter-group">
                <h4 className="filter-title">Seal Categories</h4>
                <div className="filter-list">
                  <div
                    onClick={() => handleCategorySelect('')}
                    className={`filter-item ${!selectedCategory ? 'active' : ''}`}
                    style={{ fontWeight: !selectedCategory ? '700' : '400' }}
                  >
                    All Categories
                  </div>
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`filter-item ${selectedCategory === cat.name ? 'active' : ''}`}
                      style={{ fontWeight: selectedCategory === cat.name ? '700' : '400' }}
                    >
                      {cat.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="filter-group">
                <h4 className="filter-title">Price Range (₹)</h4>
                <div className="price-slider-group">
                  <div className="price-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      className="price-input"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span style={{ color: 'var(--gray)' }}>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="price-input"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Certifications indicator */}
              <div className="filter-group" style={{ marginBottom: 0 }}>
                <h4 className="filter-title">Quality Standard</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--gray-dark)' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>✓ <span>C-TPAT High Security</span></div>
                  <div style={{ display: 'flex', gap: '6px' }}>✓ <span>ISO 17712 Compliant</span></div>
                  <div style={{ display: 'flex', gap: '6px' }}>✓ <span>Anti-Spin Locking Pin</span></div>
                </div>
              </div>
            </aside>

            {/* Catalog Grid Section */}
            <main>
              {/* Top bar controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--white)', padding: '16px 24px', borderRadius: 'var(--border-radius)', border: '1px solid var(--gray-light)', marginBottom: '24px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-dark)' }}>
                  Showing <strong style={{ color: 'var(--primary)' }}>{products.length}</strong> items
                  {searchQuery && <span> for "<strong style={{ color: 'var(--primary)' }}>{searchQuery}</strong>"</span>}
                </div>
                
                {/* Sort Option Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-dark)' }}>Sort By:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid var(--gray-light)', borderRadius: 'var(--border-radius-sm)', fontSize: '0.85rem', backgroundColor: 'var(--white)', cursor: 'pointer' }}
                  >
                    <option value="newest">Newest Released</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {/* Grid content */}
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary)' }}>Filtering logistics security catalog...</span>
                </div>
              ) : products.length === 0 ? (
                <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--border-radius)', border: '1px solid var(--gray-light)', padding: '80px 24px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🔍</span>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '8px' }}>No Security Seals Found</h3>
                  <p style={{ color: 'var(--gray-dark)', maxWidth: '420px', margin: '0 auto 24px' }}>
                    We could not locate any seals matching your current search parameters. Please try adjusting your filters or search keywords.
                  </p>
                  <button onClick={handleResetFilters} className="btn btn-primary">
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="product-grid">
                  {products.map((prod) => (
                    <ProductCard key={prod._id} product={prod} />
                  ))}
                </div>
              )}
            </main>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Products;

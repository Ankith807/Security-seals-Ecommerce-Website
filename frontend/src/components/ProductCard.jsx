import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import StarRating from './StarRating';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1, '');
      alert(`${product.name} added to cart!`);
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      {/* Stock status indicator badge */}
      {isOutOfStock ? (
        <span className="product-badge out-of-stock">Out Of Stock</span>
      ) : isLowStock ? (
        <span className="product-badge" style={{ backgroundColor: 'var(--warning)' }}>Low Stock ({product.stock})</span>
      ) : (
        <span className="product-badge">In Stock</span>
      )}

      {/* Product Image Wrapper */}
      <div className="product-img-wrapper">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.querySelector('.custom-seal-fallback').style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback Beautiful CSS Draw of a Bolt Seal */}
        <div
          className="custom-seal-fallback"
          style={{
            display: (!product.images || product.images.length === 0) ? 'flex' : 'none',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--light)'
          }}
        >
          <div className="seal-graphic-bolt">
            <div className="bolt-pin">
              <div className="bolt-pin-cap" style={{ backgroundColor: product.category?.name === 'Bolt Seals' ? 'var(--accent)' : 'var(--secondary)' }}></div>
            </div>
            <div className="bolt-lock-body" style={{ backgroundColor: 'var(--primary)' }}></div>
            <div className="bolt-serial-tag">RX-{product.price > 1 ? '177' : 'PL'}</div>
          </div>
        </div>
      </div>

      {/* Info Details */}
      <div className="product-info">
        <span className="product-category">{product.category?.name || 'Security Seal'}</span>
        <h3 className="product-title">{product.name}</h3>

        {/* Ratings */}
        <div className="product-rating">
          <StarRating rating={product.rating || 0} size="14px" />
          <span>({product.numReviews || 0})</span>
        </div>

        {/* Price Row */}
        <div className="product-price-row">
          <span className="product-price">₹{product.price.toFixed(2)}</span>
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="btn btn-primary"
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: '0.8rem',
              backgroundColor: isOutOfStock ? 'var(--gray)' : 'var(--accent)',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

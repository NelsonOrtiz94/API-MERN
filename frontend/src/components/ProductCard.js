import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  return (
    <Link to={`/product/${product._id}`}>
      <div className="product-card">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="product-image"
        />
        <div className="product-info">
          <h3 className="product-name">{product.nombre}</h3>
          <div className="product-rating">
            {renderStars(product.rating)}
            <span>({product.numReviews})</span>
          </div>
          <p className="product-price">${product.precio.toFixed(2)}</p>
          <p style={{ color: product.stock > 0 ? '#27ae60' : '#e74c3c', fontSize: '0.9rem' }}>
            {product.stock > 0 ? `En stock: ${product.stock}` : 'Sin stock'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

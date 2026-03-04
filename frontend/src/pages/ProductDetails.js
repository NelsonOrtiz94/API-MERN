import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';
import Message from '../components/Message';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el producto');
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, cantidad);
    toast.success('Producto agregado al carrito');
  };

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

  if (loading) return <Loading />;
  if (error) return <Message variant="error">{error}</Message>;
  if (!product) return <Message>Producto no encontrado</Message>;

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="btn btn-secondary"
        style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <FaArrowLeft /> Volver
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <div>
          <img
            src={product.imagen}
            alt={product.nombre}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </div>

        <div>
          <h1 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
            {product.nombre}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ color: '#f39c12', fontSize: '1.2rem', display: 'flex' }}>
              {renderStars(product.rating)}
            </div>
            <span style={{ color: '#7f8c8d' }}>
              {product.numReviews} reseñas
            </span>
          </div>

          <h2 style={{ color: '#27ae60', marginBottom: '1rem' }}>
            ${product.precio.toFixed(2)}
          </h2>

          <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: '#555' }}>
            {product.descripcion}
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Categoría:</strong> {product.categoria}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Marca:</strong> {product.marca}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Estado:</strong>{' '}
            <span style={{ color: product.stock > 0 ? '#27ae60' : '#e74c3c' }}>
              {product.stock > 0 ? `En stock (${product.stock})` : 'Sin stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <>
              <div className="form-group">
                <label className="form-label">Cantidad:</label>
                <select
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="form-control"
                >
                  {[...Array(Math.min(product.stock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-block"
                style={{ marginTop: '1rem' }}
              >
                Agregar al Carrito
              </button>
            </>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Reseñas</h2>
        {product.reviews.length === 0 ? (
          <Message>No hay reseñas aún</Message>
        ) : (
          <div>
            {product.reviews.map((review) => (
              <div
                key={review._id}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              >
                <strong>{review.nombre}</strong>
                <div style={{ color: '#f39c12', margin: '0.5rem 0', display: 'flex' }}>
                  {renderStars(review.rating)}
                </div>
                <p style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p>{review.comentario}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

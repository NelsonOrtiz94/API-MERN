import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import Message from '../components/Message';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div>
        <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>
          Carrito de Compras
        </h1>
        <Message>
          Tu carrito está vacío.{' '}
          <Link to="/" style={{ color: '#3498db', textDecoration: 'underline' }}>
            Ir a comprar
          </Link>
        </Message>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>
        Carrito de Compras
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={item.imagen}
                alt={item.nombre}
                className="cart-item-image"
              />
              <div style={{ flex: 1 }}>
                <Link
                  to={`/product/${item._id}`}
                  style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50' }}
                >
                  {item.nombre}
                </Link>
                <p style={{ color: '#27ae60', fontSize: '1.2rem', marginTop: '0.5rem' }}>
                  ${item.precio.toFixed(2)}
                </p>
              </div>
              <div>
                <select
                  value={item.cantidad}
                  onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                  className="form-control"
                  style={{ width: '80px' }}
                >
                  {[...Array(Math.min(item.stock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="btn btn-danger"
                style={{ padding: '0.5rem 1rem' }}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
            Resumen de Compra
          </h2>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal:</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </p>
            <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Items:</span>
              <strong>{cart.reduce((acc, item) => acc + item.cantidad, 0)}</strong>
            </p>
          </div>
          <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #ddd' }} />
          <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            <strong>Total:</strong>
            <strong style={{ color: '#27ae60' }}>${subtotal.toFixed(2)}</strong>
          </p>
          <button
            onClick={handleCheckout}
            className="btn btn-primary btn-block"
          >
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

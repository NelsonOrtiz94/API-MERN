import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Loading from '../components/Loading';
import Message from '../components/Message';

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrder();
  }, [id, user, navigate]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/orders/${id}`, config);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar la orden');
      setLoading(false);
    }
  };

  if (!user) return null;
  if (loading) return <Loading />;
  if (error) return <Message variant="error">{error}</Message>;
  if (!order) return <Message>Orden no encontrada</Message>;

  return (
    <div>
      <button
        onClick={() => navigate('/myorders')}
        className="btn btn-secondary"
        style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <FaArrowLeft /> Volver a Mis Órdenes
      </button>

      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>
        Orden #{order._id}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          {/* Dirección de envío */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
              Dirección de Envío
            </h2>
            <p>
              <strong>Nombre:</strong> {order.usuario.nombre}
            </p>
            <p>
              <strong>Email:</strong> {order.usuario.email}
            </p>
            <p>
              <strong>Dirección:</strong> {order.direccionEnvio.calle},{' '}
              {order.direccionEnvio.ciudad}, {order.direccionEnvio.codigoPostal},{' '}
              {order.direccionEnvio.pais}
            </p>
            {order.isEnviado ? (
              <Message variant="success">
                Enviado el {new Date(order.fechaEnvio).toLocaleDateString()}
              </Message>
            ) : (
              <Message variant="error">No enviado</Message>
            )}
          </div>

          {/* Método de pago */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
              Método de Pago
            </h2>
            <p>
              <strong>Método:</strong> {order.metodoPago}
            </p>
            {order.isPagado ? (
              <Message variant="success">
                Pagado el {new Date(order.fechaPago).toLocaleDateString()}
              </Message>
            ) : (
              <Message variant="error">No pagado</Message>
            )}
          </div>

          {/* Items de la orden */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px' }}>
            <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
              Productos
            </h2>
            {order.items.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderBottom: '1px solid #eee',
                }}
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <strong>{item.nombre}</strong>
                </div>
                <div>
                  {item.cantidad} x ${item.precio.toFixed(2)} = $
                  {(item.cantidad * item.precio).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen */}
        <div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', position: 'sticky', top: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
              Resumen de la Orden
            </h2>
            <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Productos:</span>
              <span>${order.precioItems.toFixed(2)}</span>
            </div>
            <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Envío:</span>
              <span>${order.precioEnvio.toFixed(2)}</span>
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Impuestos:</span>
              <span>${order.precioImpuestos.toFixed(2)}</span>
            </div>
            <div
              style={{
                borderTop: '2px solid #2c3e50',
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.3rem',
                fontWeight: 'bold',
              }}
            >
              <span>Total:</span>
              <span style={{ color: '#27ae60' }}>${order.precioTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

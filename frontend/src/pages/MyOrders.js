import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Loading from '../components/Loading';
import Message from '../components/Message';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('/api/orders/myorders', config);
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar las órdenes');
      setLoading(false);
    }
  };

  if (!user) return null;
  if (loading) return <Loading />;
  if (error) return <Message variant="error">{error}</Message>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>
        Mis Órdenes
      </h1>

      {orders.length === 0 ? (
        <Message>
          No tienes órdenes aún.{' '}
          <Link to="/" style={{ color: '#3498db', textDecoration: 'underline' }}>
            Ir a comprar
          </Link>
        </Message>
      ) : (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#2c3e50', color: 'white' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>FECHA</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>TOTAL</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>PAGADO</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>ENVIADO</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>
                    {order._id.substring(0, 8)}...
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#27ae60' }}>
                    ${order.precioTotal.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {order.isPagado ? (
                      <span style={{ color: '#27ae60' }}>
                        ✓ {new Date(order.fechaPago).toLocaleDateString()}
                      </span>
                    ) : (
                      <span style={{ color: '#e74c3c' }}>✗ No pagado</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {order.isEnviado ? (
                      <span style={{ color: '#27ae60' }}>
                        ✓ {new Date(order.fechaEnvio).toLocaleDateString()}
                      </span>
                    ) : (
                      <span style={{ color: '#e74c3c' }}>✗ No enviado</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link to={`/order/${order._id}`}>
                      <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        Detalles
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;

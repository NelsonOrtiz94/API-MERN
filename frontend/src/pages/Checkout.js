import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [calle, setCalle] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [pais, setPais] = useState('');
  const [metodoPago, setMetodoPago] = useState('Tarjeta de crédito');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [user, cart, navigate]);

  const precioItems = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const precioEnvio = precioItems > 100 ? 0 : 10;
  const precioImpuestos = precioItems * 0.16;
  const precioTotal = precioItems + precioEnvio + precioImpuestos;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!calle || !ciudad || !codigoPostal || !pais) {
      toast.error('Por favor completa todos los campos de dirección');
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const orderData = {
        items: cart.map((item) => ({
          producto: item._id,
          nombre: item.nombre,
          cantidad: item.cantidad,
          imagen: item.imagen,
          precio: item.precio,
        })),
        direccionEnvio: {
          calle,
          ciudad,
          codigoPostal,
          pais,
        },
        metodoPago,
        precioItems,
        precioEnvio,
        precioImpuestos,
        precioTotal,
      };

      const { data } = await axios.post('/api/orders', orderData, config);
      clearCart();
      toast.success('Orden creada exitosamente');
      navigate(`/order/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.length === 0) return null;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>
        Finalizar Compra
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
              Dirección de Envío
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Calle y número:</label>
                <input
                  type="text"
                  value={calle}
                  onChange={(e) => setCalle(e.target.value)}
                  className="form-control"
                  placeholder="Calle Principal 123"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ciudad:</label>
                <input
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="form-control"
                  placeholder="Ciudad"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Código Postal:</label>
                <input
                  type="text"
                  value={codigoPostal}
                  onChange={(e) => setCodigoPostal(e.target.value)}
                  className="form-control"
                  placeholder="12345"
                />
              </div>

              <div className="form-group">
                <label className="form-label">País:</label>
                <input
                  type="text"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  className="form-control"
                  placeholder="México"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Método de Pago:</label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="form-control"
                >
                  <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                  <option value="Tarjeta de débito">Tarjeta de débito</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Transferencia">Transferencia bancaria</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Realizar Pedido'}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', position: 'sticky', top: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
              Resumen del Pedido
            </h2>

            <div style={{ marginBottom: '1rem' }}>
              {cart.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <span>
                    {item.nombre} x {item.cantidad}
                  </span>
                  <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '2px solid #eee', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal:</span>
                <span>${precioItems.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Envío:</span>
                <span>${precioEnvio.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>Impuestos (16%):</span>
                <span>${precioImpuestos.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  borderTop: '2px solid #2c3e50',
                  paddingTop: '1rem',
                }}
              >
                <span>Total:</span>
                <span style={{ color: '#27ae60' }}>${precioTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

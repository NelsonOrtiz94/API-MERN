import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          E-Commerce
        </Link>
        <div className="navbar-menu">
          <Link to="/cart" className="navbar-link">
            <FaShoppingCart />
            Carrito
            {cartItemsCount > 0 && (
              <span
                style={{
                  background: '#e74c3c',
                  borderRadius: '50%',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.8rem',
                }}
              >
                {cartItemsCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/myorders" className="navbar-link">
                Mis Órdenes
              </Link>
              <Link to="/profile" className="navbar-link">
                <FaUser />
                {user.nombre}
              </Link>
              <button
                onClick={handleLogout}
                className="navbar-link"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                <FaSignOutAlt />
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar-link">
              <FaUser />
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

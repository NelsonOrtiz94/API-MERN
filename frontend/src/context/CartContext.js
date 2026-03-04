import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Cargar carrito del localStorage al iniciar
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      setCart(JSON.parse(cartItems));
    }
  }, []);

  useEffect(() => {
    // Guardar carrito en localStorage cada vez que cambie
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, cantidad) => {
    const existItem = cart.find((item) => item._id === product._id);

    if (existItem) {
      setCart(
        cart.map((item) =>
          item._id === existItem._id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, cantidad }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, cantidad) => {
    setCart(
      cart.map((item) =>
        item._id === productId ? { ...item, cantidad } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cartItems');
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import Message from '../components/Message';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (searchKeyword = '') => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/products${searchKeyword ? `?keyword=${searchKeyword}` : ''}`
      );
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar productos');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(keyword);
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>
        Productos Destacados
      </h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="form-control"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary">
            Buscar
          </button>
        </div>
      </form>

      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <>
          {products.length === 0 ? (
            <Message>No se encontraron productos</Message>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

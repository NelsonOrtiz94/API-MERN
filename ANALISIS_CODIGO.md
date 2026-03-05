# 🔍 Análisis del Código del Proyecto E-commerce

## 📖 Índice
1. [Backend - Análisis Detallado](#backend-análisis)
2. [Frontend - Análisis Detallado](#frontend-análisis)
3. [Ejemplos Prácticos](#ejemplos-prácticos)
4. [Patrones y Buenas Prácticas](#patrones-y-buenas-prácticas)

---

## 🔧 Backend - Análisis Detallado

### 1. server.js - El Corazón del Backend

```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// 1. Cargar variables de entorno del archivo .env
dotenv.config();

// 2. Conectar a MongoDB
connectDB();

// 3. Crear aplicación Express
const app = express();

// 4. Middleware - Funciones que procesan las peticiones
app.use(cors());              // Permite peticiones desde otros dominios
app.use(express.json());       // Parsea JSON del body de las peticiones

// 5. Rutas - Endpoints de la API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// 6. Middleware de errores (debe ir al final)
app.use(notFound);
app.use(errorHandler);

// 7. Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

**¿Qué hace cada parte?**

- **dotenv:** Lee las variables de `.env` (como el puerto, conexión a DB, secretos)
- **express:** Framework que facilita crear el servidor y manejar rutas
- **cors:** Permite que el frontend (puerto 3000) haga peticiones al backend (puerto 5000)
- **express.json():** Convierte el JSON del body de las peticiones en objetos JavaScript

---

### 2. models/Product.js - Esquema de Producto

```javascript
import mongoose from 'mongoose';

// Schema de Review (subesquema)
const reviewSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al modelo User
    required: true,
    ref: 'User',
  },
  nombre: { type: String, required: true },
  rating: { 
    type: Number, 
    required: true,
    min: 1,    // Mínimo 1 estrella
    max: 5,    // Máximo 5 estrellas
  },
  comentario: { type: String, required: true },
}, { timestamps: true }); // Agrega createdAt y updatedAt

// Schema de Product
const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Por favor ingrese el nombre'],
    trim: true,  // Elimina espacios al inicio y fin
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
    default: 0,
  },
  imagen: {
    type: String,
    default: '/images/sample.jpg',
  },
  categoria: {
    type: String,
    required: true,
    enum: ['Electrónica', 'Ropa', 'Hogar', ...], // Solo estos valores
  },
  marca: String,
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  reviews: [reviewSchema],  // Array de reseñas
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
```

**¿Cómo funciona?**

Cuando haces:
```javascript
const producto = await Product.create({
  nombre: 'iPhone 14',
  precio: 999.99
});
```

MongoDB guarda:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "iPhone 14",
  "precio": 999.99,
  "descripcion": "",
  "imagen": "/images/sample.jpg",
  "stock": 0,
  "rating": 0,
  "numReviews": 0,
  "reviews": [],
  "createdAt": "2026-03-02T10:30:00.000Z",
  "updatedAt": "2026-03-02T10:30:00.000Z"
}
```

---

### 3. controllers/productController.js - Lógica de Negocio

```javascript
export const getProducts = async (req, res) => {
  try {
    // 1. Configurar paginación
    const pageSize = 12;              // 12 productos por página
    const page = Number(req.query.pageNumber) || 1;  // Página actual

    // 2. Crear filtro de búsqueda
    const keyword = req.query.keyword
      ? {
          nombre: {
            $regex: req.query.keyword,   // Búsqueda con regex
            $options: 'i',                // Case insensitive
          },
        }
      : {};

    // 3. Contar total de productos (para paginación)
    const count = await Product.countDocuments({ ...keyword });

    // 4. Obtener productos con filtro y paginación
    const products = await Product.find({ ...keyword })
      .limit(pageSize)                    // Limitar resultados
      .skip(pageSize * (page - 1))        // Saltar páginas anteriores
      .sort({ createdAt: -1 });           // Ordenar por más recientes

    // 5. Enviar respuesta
    res.json({ 
      products, 
      page, 
      pages: Math.ceil(count / pageSize)  // Total de páginas
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Ejemplo de uso:**

```javascript
// Sin búsqueda, página 1
GET /api/products
→ Devuelve primeros 12 productos

// Con búsqueda
GET /api/products?keyword=iPhone
→ Devuelve productos que contengan "iPhone"

// Página 2
GET /api/products?pageNumber=2
→ Devuelve productos 13-24
```

---

### 4. routes/productRoutes.js - Definición de Rutas

```javascript
import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas (cualquiera puede acceder)
router.route('/')
  .get(getProducts)                    // GET /api/products
  .post(protect, admin, createProduct); // POST /api/products (solo admin)

router.get('/top', getTopProducts);     // GET /api/products/top

// Rutas con parámetro :id
router.route('/:id')
  .get(getProductById)                  // GET /api/products/123
  .put(protect, admin, updateProduct)   // PUT /api/products/123 (solo admin)
  .delete(protect, admin, deleteProduct); // DELETE /api/products/123 (solo admin)

// Ruta para crear reseña (usuario autenticado)
router.route('/:id/reviews')
  .post(protect, createProductReview);

export default router;
```

**Middleware en acción:**

```javascript
// Ruta sin protección
GET /api/products
→ Cualquiera puede acceder

// Ruta protegida
POST /api/products/123/reviews
→ 1. Middleware 'protect' verifica token JWT
→ 2. Si válido, ejecuta createProductReview
→ 3. Si inválido, devuelve 401 Unauthorized

// Ruta admin
DELETE /api/products/123
→ 1. Middleware 'protect' verifica token
→ 2. Middleware 'admin' verifica si es administrador
→ 3. Si es admin, ejecuta deleteProduct
→ 4. Si no, devuelve 401 Unauthorized
```

---

### 5. middleware/authMiddleware.js - Autenticación

```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Verificar si hay token en los headers
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      // 2. Extraer token (formato: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificar y decodificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // decoded = { id: '507f1f77bcf86cd799439011', iat: 1234567890 }

      // 4. Buscar usuario en DB (sin password)
      req.user = await User.findById(decoded.id).select('-password');

      // 5. Pasar al siguiente middleware o controlador
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token inválido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No hay token' });
  }
};

export const admin = (req, res, next) => {
  // req.user ya existe gracias al middleware 'protect'
  if (req.user && req.user.isAdmin) {
    next(); // Es admin, continuar
  } else {
    res.status(401).json({ message: 'No es administrador' });
  }
};
```

**Flujo completo:**

```javascript
// Cliente hace petición
fetch('/api/products/123', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...'
  }
});

// Servidor procesa:
// 1. Llega a la ruta DELETE /api/products/:id
// 2. Ejecuta middleware 'protect':
//    - Extrae token
//    - Verifica con JWT
//    - Busca usuario
//    - Agrega req.user
// 3. Ejecuta middleware 'admin':
//    - Verifica req.user.isAdmin
// 4. Ejecuta deleteProduct
// 5. Responde al cliente
```

---

## ⚛️ Frontend - Análisis Detallado

### 1. index.js - Punto de Entrada

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import App from './App';

// 1. Crear el root de React
const root = ReactDOM.createRoot(document.getElementById('root'));

// 2. Renderizar la aplicación
root.render(
  <React.StrictMode>
    <BrowserRouter>          {/* Habilita el routing */}
      <AuthProvider>         {/* Contexto de autenticación */}
        <CartProvider>       {/* Contexto del carrito */}
          <App />            {/* Componente principal */}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

**Orden de los Providers:**

```
BrowserRouter (más externo)
  └─ AuthProvider
      └─ CartProvider
          └─ App (tiene acceso a todo)
```

---

### 2. App.js - Componente Principal con Rutas

```javascript
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <>
      <Navbar />  {/* Siempre visible */}
      
      <div className="container">
        <Routes>
          {/* Cada Route define una URL y su componente */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </>
  );
}
```

**¿Cómo funciona el routing?**

```
URL: http://localhost:3000/
→ Renderiza <Home />

URL: http://localhost:3000/product/123
→ Renderiza <ProductDetails /> con params.id = "123"

URL: http://localhost:3000/cart
→ Renderiza <Cart />
```

---

### 3. pages/Home.js - Página Principal

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  // 1. Estado local del componente
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');

  // 2. useEffect - Se ejecuta al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []); // Array vacío = solo al montar

  // 3. Función para obtener productos
  const fetchProducts = async (searchKeyword = '') => {
    try {
      setLoading(true);
      
      // Petición al backend
      const { data } = await axios.get(
        `/api/products${searchKeyword ? `?keyword=${searchKeyword}` : ''}`
      );
      
      setProducts(data.products);  // Actualizar estado
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
      setLoading(false);
    }
  };

  // 4. Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(keyword);
  };

  // 5. Renderizar UI
  return (
    <div>
      <h1>Productos Destacados</h1>

      {/* Formulario de búsqueda */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {/* Conditional rendering */}
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
```

**Flujo de datos:**

```
1. Componente se monta
   ↓
2. useEffect ejecuta fetchProducts()
   ↓
3. axios.get('/api/products') → Backend
   ↓
4. Backend responde con JSON
   ↓
5. setProducts(data.products) → Actualiza estado
   ↓
6. React re-renderiza el componente
   ↓
7. Muestra los productos en la UI
```

---

### 4. context/AuthContext.js - Estado Global de Autenticación

```javascript
import { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el contexto
const AuthContext = createContext();

// 2. Hook personalizado para acceder al contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// 3. Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 4. Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  // 5. Funciones del contexto
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
  };

  // 6. Proveer valores a los componentes hijos
  const value = {
    user,      // Estado
    login,     // Función
    logout,    // Función
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Usando el contexto:**

```javascript
// En cualquier componente
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth(); // Acceso al contexto
  
  return (
    <nav>
      {user ? (
        <>
          <span>Hola, {user.nombre}</span>
          <button onClick={logout}>Salir</button>
        </>
      ) : (
        <Link to="/login">Iniciar Sesión</Link>
      )}
    </nav>
  );
}
```

---

### 5. pages/Login.js - Formulario de Login

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  // 1. Estados del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 2. Hooks
  const { login } = useAuth();          // Context
  const navigate = useNavigate();       // Navegación

  // 3. Manejar submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevenir recarga de página

    // Validación
    if (!email || !password) {
      toast.error('Completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      
      // Petición al backend
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });
      
      // Guardar usuario en contexto
      login(data);
      
      // Notificación de éxito
      toast.success('Inicio de sesión exitoso');
      
      // Redireccionar
      navigate('/');
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  // 4. Renderizar formulario
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};
```

---

## 🎯 Ejemplos Prácticos

### Ejemplo 1: Agregar Producto al Carrito

**Frontend:**
```javascript
// pages/ProductDetails.js
import { useCart } from '../context/CartContext';

function ProductDetails() {
  const { addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);
  
  const handleAddToCart = () => {
    addToCart(product, cantidad);
    toast.success('Producto agregado');
  };

  return (
    <button onClick={handleAddToCart}>
      Agregar al Carrito
    </button>
  );
}
```

**Context:**
```javascript
// context/CartContext.js
const addToCart = (product, cantidad) => {
  const existItem = cart.find((item) => item._id === product._id);

  if (existItem) {
    // Si ya existe, actualizar cantidad
    setCart(
      cart.map((item) =>
        item._id === existItem._id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      )
    );
  } else {
    // Si no existe, agregar al carrito
    setCart([...cart, { ...product, cantidad }]);
  }
};
```

---

### Ejemplo 2: Crear Orden de Compra

**Frontend:**
```javascript
// pages/Checkout.js
const handleSubmit = async (e) => {
  e.preventDefault();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`, // Token JWT
    },
  };

  const orderData = {
    items: cart.map((item) => ({
      producto: item._id,
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio: item.precio,
    })),
    direccionEnvio: { calle, ciudad, codigoPostal, pais },
    metodoPago,
    precioTotal,
  };

  // POST al backend
  const { data } = await axios.post('/api/orders', orderData, config);
  
  clearCart();           // Limpiar carrito
  navigate(`/order/${data._id}`); // Ver orden
};
```

**Backend:**
```javascript
// controllers/orderController.js
export const addOrderItems = async (req, res) => {
  const { items, direccionEnvio, metodoPago, precioTotal } = req.body;

  if (items && items.length === 0) {
    return res.status(400).json({ message: 'No hay items' });
  }

  // Crear orden en DB
  const order = new Order({
    usuario: req.user._id,  // Del middleware 'protect'
    items,
    direccionEnvio,
    metodoPago,
    precioTotal,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};
```

---

## 📋 Patrones y Buenas Prácticas

### 1. Separación de Responsabilidades

```
✅ BIEN:
routes/      → Define rutas
controllers/ → Lógica de negocio
models/      → Esquemas de datos
middleware/  → Funciones intermedias

❌ MAL:
Todo en server.js
```

### 2. Manejo de Errores Consistente

```javascript
// ✅ BIEN: try/catch en cada función asíncrona
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ MAL: Sin manejo de errores
export const getProducts = async (req, res) => {
  const products = await Product.find({}); // Puede fallar!
  res.json({ products });
};
```

### 3. Validación de Datos

```javascript
// ✅ BIEN: Validar antes de procesar
if (!email || !password) {
  return res.status(400).json({ message: 'Campos requeridos' });
}

// ✅ BIEN: Validación en el modelo
nombre: {
  type: String,
  required: [true, 'El nombre es obligatorio'],
  minlength: [3, 'Mínimo 3 caracteres'],
}
```

### 4. Variables de Entorno

```javascript
// ✅ BIEN: Usar variables de entorno
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

// ❌ MAL: Hardcodear valores sensibles
const JWT_SECRET = 'mi_secreto_123'; // ¡NUNCA!
```

### 5. Hooks en Orden

```javascript
function Component() {
  // ✅ BIEN: Hooks siempre en el mismo orden
  const [state1, setState1] = useState();
  const [state2, setState2] = useState();
  useEffect(() => {}, []);
  const navigate = useNavigate();

  // ❌ MAL: Hooks condicionales
  if (condition) {
    const [state, setState] = useState(); // ERROR!
  }
}
```

---

¡Esta guía complementa la teoría con ejemplos reales del proyecto! 🚀

# 📚 Guía Completa de Teoría MERN Stack

## 📖 Índice
1. [¿Qué es MERN Stack?](#qué-es-mern-stack)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Backend con Node.js y Express](#backend-nodejs-express)
4. [Base de Datos con MongoDB](#base-de-datos-mongodb)
5. [Frontend con React](#frontend-react)
6. [Comunicación Frontend-Backend](#comunicación-frontend-backend)
7. [Autenticación y Seguridad](#autenticación-y-seguridad)
8. [Estado Global en React](#estado-global-react)
9. [Conceptos Clave](#conceptos-clave)

---

## 🎯 ¿Qué es MERN Stack?

MERN es un stack de tecnologías JavaScript para crear aplicaciones web completas:

```
M = MongoDB    (Base de Datos NoSQL)
E = Express    (Framework de Backend)
R = React      (Librería de Frontend)
N = Node.js    (Entorno de ejecución de JavaScript)
```

### ✨ Ventajas de MERN

1. **Un solo lenguaje:** JavaScript en todo el stack
2. **JSON en todos lados:** MongoDB guarda JSON, Express/Node lo procesan, React lo consume
3. **Rápido desarrollo:** Componentes reutilizables y ecosistema rico
4. **Escalable:** Fácil de escalar horizontalmente
5. **Gran comunidad:** Muchísimas librerías y recursos

---

## 🏗️ Arquitectura del Proyecto

### Vista General

```
┌─────────────────────────────────────────────────────────────┐
│                         USUARIO                              │
│                    (Navegador Web)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Componentes │  │   Context   │  │   Páginas   │        │
│  │   (UI)      │  │  (Estado)   │  │  (Rutas)    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                   Puerto 3000                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP Requests (Axios)
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Rutas   │→│ Middleware│→│Controller│→│  Models  │      │
│  │ (Routes) │ │  (Auth)   │ │ (Lógica) │ │ (Schema) │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                   Puerto 5000                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Mongoose (ODM)
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              BASE DE DATOS (MongoDB)                         │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐              │
│  │  Users    │  │ Products  │  │  Orders   │              │
│  │Collection │  │Collection │  │Collection │              │
│  └───────────┘  └───────────┘  └───────────┘              │
│                   Puerto 27017                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Backend (Node.js + Express)

### ¿Qué es Node.js?

**Node.js** es un entorno que permite ejecutar JavaScript fuera del navegador, en el servidor.

```javascript
// JavaScript tradicional (solo en navegador)
console.log('Hola desde el navegador');

// Node.js (en el servidor)
const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Hola desde el servidor');
});
```

### ¿Qué es Express?

**Express** es un framework minimalista para crear APIs y servidores web con Node.js.

### Estructura del Backend en tu Proyecto

```
backend/
├── server.js              # Punto de entrada del servidor
├── config/
│   └── db.js             # Configuración de MongoDB
├── models/               # Esquemas de datos
│   ├── User.js           # Modelo de Usuario
│   ├── Product.js        # Modelo de Producto
│   └── Order.js          # Modelo de Orden
├── controllers/          # Lógica de negocio
│   ├── userController.js
│   ├── productController.js
│   └── orderController.js
├── routes/               # Definición de rutas
│   ├── userRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
└── middleware/           # Funciones intermedias
    ├── authMiddleware.js # Autenticación
    └── errorMiddleware.js # Manejo de errores
```

### 📌 Ejemplo: Flujo de una Petición

**1. Cliente hace petición:**
```javascript
GET http://localhost:5000/api/products
```

**2. Ruta recibe la petición:**
```javascript
// routes/productRoutes.js
router.route('/').get(getProducts); // Llama al controlador
```

**3. Controlador procesa la lógica:**
```javascript
// controllers/productController.js
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // Consulta DB
    res.json({ products }); // Responde con JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**4. Modelo interactúa con MongoDB:**
```javascript
// models/Product.js
const productSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  // ...
});
```

**5. Respuesta se envía al cliente:**
```json
{
  "products": [
    { "nombre": "iPhone 14", "precio": 999.99 },
    { "nombre": "Samsung Galaxy", "precio": 899.99 }
  ]
}
```

---

## 🗄️ Base de Datos (MongoDB)

### ¿Qué es MongoDB?

**MongoDB** es una base de datos **NoSQL** que guarda datos en formato similar a JSON (BSON).

### SQL vs NoSQL

```sql
-- SQL (MySQL, PostgreSQL)
CREATE TABLE users (
  id INT PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100)
);

INSERT INTO users VALUES (1, 'Juan', 'juan@email.com');
```

```javascript
// NoSQL (MongoDB)
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Juan",
  "email": "juan@email.com"
}
```

### Mongoose: ODM para MongoDB

**Mongoose** es un ODM (Object Document Mapper) que facilita trabajar con MongoDB.

```javascript
// Definir un Schema (estructura de datos)
const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true  // Campo obligatorio
  },
  email: {
    type: String,
    required: true,
    unique: true    // No puede haber duplicados
  },
  password: {
    type: String,
    required: true,
    minlength: 6    // Mínimo 6 caracteres
  },
  isAdmin: {
    type: Boolean,
    default: false  // Valor por defecto
  }
}, {
  timestamps: true  // Agrega createdAt y updatedAt
});

// Crear el Modelo
const User = mongoose.model('User', userSchema);

// Usar el Modelo
const nuevoUsuario = await User.create({
  nombre: 'María',
  email: 'maria@email.com',
  password: 'contraseña123'
});
```

### Operaciones CRUD en MongoDB

```javascript
// CREATE (Crear)
const producto = await Product.create({
  nombre: 'iPhone 14',
  precio: 999.99
});

// READ (Leer)
const productos = await Product.find({}); // Todos
const producto = await Product.findById(id); // Por ID
const iphones = await Product.find({ marca: 'Apple' }); // Filtrado

// UPDATE (Actualizar)
await Product.findByIdAndUpdate(id, { precio: 899.99 });

// DELETE (Eliminar)
await Product.findByIdAndDelete(id);
```

---

## ⚛️ Frontend (React)

### ¿Qué es React?

**React** es una librería de JavaScript para construir interfaces de usuario mediante **componentes**.

### Conceptos Clave de React

#### 1. Componentes

Los componentes son piezas reutilizables de UI:

```javascript
// Componente Funcional
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.imagen} alt={product.nombre} />
      <h3>{product.nombre}</h3>
      <p>${product.precio}</p>
    </div>
  );
}

// Uso del componente
<ProductCard product={miProducto} />
```

#### 2. Props (Propiedades)

Props son datos que se pasan de un componente padre a un hijo:

```javascript
// Componente Padre
function App() {
  const producto = { nombre: 'iPhone', precio: 999 };
  return <ProductCard product={producto} />;
}

// Componente Hijo recibe las props
function ProductCard({ product }) {
  return <h3>{product.nombre}</h3>; // Accede a las props
}
```

#### 3. State (Estado)

El state es información que puede cambiar y causar re-renderizado:

```javascript
import { useState } from 'react';

function Counter() {
  // Declarar state
  const [count, setCount] = useState(0); // valor inicial = 0

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
    </div>
  );
}
```

#### 4. Hooks

Hooks son funciones especiales de React:

```javascript
// useState - Manejar estado
const [nombre, setNombre] = useState('');

// useEffect - Ejecutar código al montar/actualizar componente
useEffect(() => {
  // Se ejecuta cuando el componente se monta
  fetchProducts();
}, []); // Array vacío = solo al montar

// useEffect con dependencias
useEffect(() => {
  // Se ejecuta cuando 'id' cambia
  fetchProduct(id);
}, [id]); // Se ejecuta cuando id cambia
    
// useContext - Acceder a contexto global
const { user } = useAuth();

// useNavigate - Navegar entre páginas
const navigate = useNavigate();
navigate('/login');
```

### Estructura del Frontend en tu Proyecto

```
frontend/src/
├── index.js              # Punto de entrada
├── App.js               # Componente principal con rutas
├── index.css            # Estilos globales
├── components/          # Componentes reutilizables
│   ├── Navbar.js        # Barra de navegación
│   ├── ProductCard.js   # Tarjeta de producto
│   ├── Loading.js       # Spinner de carga
│   └── Message.js       # Mensajes de error/éxito
├── pages/               # Páginas de la aplicación
│   ├── Home.js          # Página principal
│   ├── ProductDetails.js
│   ├── Cart.js
│   ├── Login.js
│   ├── Register.js
│   ├── Checkout.js
│   └── MyOrders.js
└── context/             # Estado global
    ├── AuthContext.js   # Autenticación
    └── CartContext.js   # Carrito de compras
```

---

## 🔄 Comunicación Frontend-Backend

### ¿Cómo se comunican?

El frontend hace peticiones HTTP al backend usando **Axios**:

```javascript
// Frontend hace petición
import axios from 'axios';

const fetchProducts = async () => {
  try {
    // GET request al backend
    const { data } = await axios.get('/api/products');
    console.log(data); // Recibe la respuesta
  } catch (error) {
    console.error(error);
  }
};
```

### Tipos de Peticiones HTTP

```javascript
// GET - Obtener datos
const { data } = await axios.get('/api/products');

// POST - Crear datos
const { data } = await axios.post('/api/users/register', {
  nombre: 'Juan',
  email: 'juan@email.com',
  password: '123456'
});

// PUT - Actualizar datos
const { data } = await axios.put('/api/products/123', {
  precio: 899.99
});

// DELETE - Eliminar datos
await axios.delete('/api/products/123');
```

### Flujo Completo: Login de Usuario

**1. Usuario llena formulario:**
```javascript
// pages/Login.js
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 2. Hacer petición al backend
  const { data } = await axios.post('/api/users/login', {
    email,
    password
  });
  
  // 5. Guardar token y redireccionar
  login(data); // Guarda en Context
  navigate('/'); // Vuelve al home
};
```

**3. Backend recibe y valida:**
```javascript
// controllers/userController.js
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  // Buscar usuario en DB
  const user = await User.findOne({ email });
  
  // Verificar contraseña
  if (user && await user.matchPassword(password)) {
    // 4. Generar token y responder
    res.json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      token: generateToken(user._id) // JWT
    });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
};
```

---

## 🔐 Autenticación y Seguridad

### JWT (JSON Web Tokens)

JWT es un estándar para transmitir información de forma segura.

```
Estructura de un JWT:
eyJhbGci.eyJ1c2VySW.SflKxwRJSM
  │        │           │
Header   Payload    Signature
```

### Flujo de Autenticación

**1. Usuario hace login:**
```javascript
POST /api/users/login
Body: { email: 'juan@email.com', password: '123456' }
```

**2. Backend verifica y genera token:**
```javascript
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign(
    { id },                    // Payload (datos del usuario)
    process.env.JWT_SECRET,    // Clave secreta
    { expiresIn: '30d' }       // Token válido por 30 días
  );
};

// Respuesta al cliente
res.json({
  _id: user._id,
  nombre: user.nombre,
  email: user.email,
  token: 'eyJhbGci...' // JWT generado
});
```

**3. Frontend guarda el token:**
```javascript
// context/AuthContext.js
const login = (userData) => {
  setUser(userData);
  localStorage.setItem('userInfo', JSON.stringify(userData));
};
```

**4. Frontend envía token en peticiones protegidas:**
```javascript
const config = {
  headers: {
    Authorization: `Bearer ${user.token}`
  }
};

const { data } = await axios.get('/api/orders/myorders', config);
```

**5. Backend verifica el token:**
```javascript
// middleware/authMiddleware.js
export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  
  try {
    // Verificar y decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario por ID del token
    req.user = await User.findById(decoded.id);
    next(); // Permitir acceso
  } catch (error) {
    res.status(401).json({ message: 'No autorizado' });
  }
};
```

### Encriptación de Contraseñas

**NUNCA** guardes contraseñas en texto plano. Usa **bcrypt**:

```javascript
import bcrypt from 'bcryptjs';

// Al crear usuario (antes de guardar)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Al hacer login (comparar contraseñas)
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

---

## 🌐 Estado Global con Context API

### ¿Por qué Context API?

Sin contexto, pasarías props por muchos niveles:

```javascript
// ❌ Sin Context (Prop Drilling)
<App user={user}>
  <Navbar user={user}>
    <UserMenu user={user}>
      <Username user={user} /> {/* Mucho anidamiento! */}
    </UserMenu>
  </Navbar>
</App>

// ✅ Con Context
<App>
  <Navbar>
    <UserMenu>
      <Username /> {/* Accede directamente al contexto */}
    </UserMenu>
  </Navbar>
</App>
```

### Crear un Context

```javascript
// context/AuthContext.js
import { createContext, useContext, useState } from 'react';

// 1. Crear el contexto
const AuthContext = createContext();

// 2. Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Provider que envuelve la app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };
  
  // 4. Proveer el valor a los componentes hijos
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Usar el Context

```javascript
// index.js - Envolver la app
import { AuthProvider } from './context/AuthContext';

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

// Cualquier componente - Usar el context
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth(); // Acceso directo!
  
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

## 💡 Conceptos Clave

### REST API

**REST** (Representational State Transfer) es un estilo de arquitectura para APIs.

```javascript
// Principios REST:
GET    /api/products      // Obtener todos
GET    /api/products/123  // Obtener uno
POST   /api/products      // Crear
PUT    /api/products/123  // Actualizar
DELETE /api/products/123  // Eliminar
```

### Middleware

Funciones que se ejecutan **entre** la petición y la respuesta:

```javascript
// Flujo con middleware
Request → Middleware 1 → Middleware 2 → Controller → Response

// Ejemplo
app.use(cors());               // Middleware 1: CORS
app.use(express.json());       // Middleware 2: Parse JSON
app.use('/api/users', protect); // Middleware 3: Auth
```

### Async/Await

Forma moderna de manejar código asíncrono:

```javascript
// ❌ Callbacks (antiguo)
fetchProducts((products) => {
  fetchUser((user) => {
    fetchOrders((orders) => {
      // Callback hell!
    });
  });
});

// ✅ Async/Await (moderno)
const products = await fetchProducts();
const user = await fetchUser();
const orders = await fetchOrders();
```

### Try/Catch

Manejo de errores en código asíncrono:

```javascript
try {
  const { data } = await axios.get('/api/products');
  setProducts(data.products);
} catch (error) {
  setError(error.response?.data?.message || 'Error al cargar');
}
```

### Destructuring

Extraer valores de objetos/arrays:

```javascript
// Objetos
const user = { nombre: 'Juan', email: 'juan@email.com' };
const { nombre, email } = user;

// Arrays
const [first, second] = ['Producto 1', 'Producto 2'];

// En parámetros de función
function ProductCard({ nombre, precio }) {
  return <h3>{nombre}: ${precio}</h3>;
}
```

### Spread Operator

Copiar y combinar objetos/arrays:

```javascript
// Arrays
const products = [product1, product2];
const newProducts = [...products, product3]; // Copia y agrega

// Objetos
const user = { nombre: 'Juan', email: 'juan@email.com' };
const updatedUser = { ...user, nombre: 'María' }; // Copia y modifica
```

---

## 📊 Diagrama de Flujo Completo

### Agregar Producto al Carrito

```
1. Usuario hace clic en "Agregar al Carrito"
   ↓
2. Componente ProductDetails llama addToCart()
   ↓
3. CartContext actualiza el estado del carrito
   ↓
4. LocalStorage guarda el carrito
   ↓
5. Componente Navbar re-renderiza (muestra contador actualizado)
   ↓
6. Usuario navega a /cart
   ↓
7. Componente Cart lee del CartContext
   ↓
8. Muestra todos los productos del carrito
```

### Realizar una Compra

```
1. Usuario hace clic en "Proceder al Pago"
   ↓
2. Navega a /checkout
   ↓
3. Llena formulario de dirección
   ↓
4. Hace submit del formulario
   ↓
5. Frontend hace POST /api/orders con:
   - Items del carrito
   - Dirección de envío
   - Token de autenticación
   ↓
6. Middleware protect verifica el token
   ↓
7. orderController crea la orden en MongoDB
   ↓
8. Backend responde con la orden creada
   ↓
9. Frontend limpia el carrito
   ↓
10. Navega a /order/:id para ver detalles
```

---

## 🎓 Recursos para Seguir Aprendiendo

### Documentación Oficial
- **Node.js:** https://nodejs.org/docs
- **Express:** https://expressjs.com
- **React:** https://react.dev
- **MongoDB:** https://docs.mongodb.com
- **Mongoose:** https://mongoosejs.com/docs

### Tutoriales Recomendados
- **Traversy Media** (YouTube) - MERN Stack
- **The Net Ninja** (YouTube) - React & Node.js
- **FreeCodeCamp** - Full Stack Development

### Práctica
1. Modifica el proyecto actual
2. Agrega nuevas funcionalidades
3. Crea tu propio proyecto desde cero

---

¡Espero que esta guía te ayude a entender mejor el stack MERN! 🚀

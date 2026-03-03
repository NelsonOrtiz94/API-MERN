# E-Commerce MERN Stack

Aplicación completa de comercio electrónico desarrollada con el stack MERN (MongoDB, Express, React, Node.js).

## 🚀 Inicio Rápido (5 minutos)

### Opción 1: Con Docker (Más Fácil)
```powershell
# 1. Iniciar MongoDB
docker run -d -p 27017:27017 --name mongodb-ecommerce mongo:latest

# O usando docker-compose
docker-compose up -d

# 2. Backend
cd backend
npm install
npm run data:import
npm run dev

# 3. Frontend (nueva terminal)
cd frontend
npm install
npm start
```

### Opción 2: Sin instalación (MongoDB Atlas - Gratis)
Ver [MONGODB_SIN_INSTALACION.md](MONGODB_SIN_INSTALACION.md) para configurar MongoDB en la nube.

📖 **Guías Completas:**
- [**INICIO_RAPIDO.md**](INICIO_RAPIDO.md) - Comandos copy-paste para empezar en 5 minutos
- [**MONGODB_SIN_INSTALACION.md**](MONGODB_SIN_INSTALACION.md) - Usa Docker o MongoDB Atlas (sin instalar MongoDB)
- [**GUIA_INSTALACION.md**](GUIA_INSTALACION.md) - Guía detallada paso a paso

## 📋 Características

### Backend
- ✅ API RESTful con Express.js
- ✅ Base de datos MongoDB con Mongoose
- ✅ Autenticación JWT
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Manejo de errores centralizado
- ✅ Validación de datos

### Frontend
- ✅ Interfaz moderna con React
- ✅ React Router para navegación
- ✅ Context API para estado global
- ✅ Diseño responsivo
- ✅ Notificaciones con React Toastify
- ✅ Integración completa con la API

### Funcionalidades
- 🛍️ Catálogo de productos con búsqueda
- 🛒 Carrito de compras
- 👤 Registro y autenticación de usuarios
- 📦 Sistema de órdenes
- ⭐ Sistema de reseñas y calificaciones
- 📱 Diseño responsivo
- 💳 Proceso de checkout completo

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js (v14 o superior)
- MongoDB (ver opciones sin instalación abajo ⬇️)
- npm o yarn

> 💡 **¿No tienes MongoDB?** Revisa [MONGODB_SIN_INSTALACION.md](MONGODB_SIN_INSTALACION.md) para usar **Docker** o **MongoDB Atlas** (gratis, sin instalación).

### 1. Clonar o descargar el proyecto

```bash
cd FRONTEND-ECOMERCE-YOTUBE-main
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta backend (o usar el que ya existe):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=tu_secreto_jwt_muy_seguro_123
NODE_ENV=development
```

> **Nota:** Si usas MongoDB Atlas, reemplaza `MONGO_URI` con tu string de conexión.
> Si usas Docker: `docker-compose up -d` o `docker run -d -p 27017:27017 --name mongodb-ecommerce mongo:latest`

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

### 4. Iniciar la Aplicación

#### Opción 1: Iniciar Backend y Frontend por separado

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

#### Opción 2: Script combinado (crear en la raíz del proyecto)

Puedes crear un `package.json` en la raíz con scripts para ejecutar ambos simultáneamente.

### 5. Acceder a la Aplicación

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 📁 Estructura del Proyecto

```
FRONTEND-ECOMERCE-YOTUBE-main/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # Configuración de MongoDB
│   ├── controllers/
│   │   ├── orderController.js    # Controlador de órdenes
│   │   ├── productController.js  # Controlador de productos
│   │   └── userController.js     # Controlador de usuarios
│   ├── middleware/
│   │   ├── authMiddleware.js     # Middleware de autenticación
│   │   └── errorMiddleware.js    # Middleware de errores
│   ├── models/
│   │   ├── Order.js              # Modelo de orden
│   │   ├── Product.js            # Modelo de producto
│   │   └── User.js               # Modelo de usuario
│   ├── routes/
│   │   ├── orderRoutes.js        # Rutas de órdenes
│   │   ├── productRoutes.js      # Rutas de productos
│   │   └── userRoutes.js         # Rutas de usuarios
│   ├── .env                      # Variables de entorno
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Archivo principal del servidor
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Loading.js        # Componente de carga
    │   │   ├── Message.js        # Componente de mensajes
    │   │   ├── Navbar.js         # Barra de navegación
    │   │   └── ProductCard.js    # Tarjeta de producto
    │   ├── context/
    │   │   ├── AuthContext.js    # Context de autenticación
    │   │   └── CartContext.js    # Context del carrito
    │   ├── pages/
    │   │   ├── Cart.js           # Página del carrito
    │   │   ├── Checkout.js       # Página de checkout
    │   │   ├── Home.js           # Página principal
    │   │   ├── Login.js          # Página de login
    │   │   ├── MyOrders.js       # Página de mis órdenes
    │   │   ├── OrderDetails.js   # Detalles de orden
    │   │   ├── ProductDetails.js # Detalles de producto
    │   │   ├── Profile.js        # Perfil de usuario
    │   │   └── Register.js       # Registro de usuario
    │   ├── App.js                # Componente principal
    │   ├── index.css             # Estilos globales
    │   └── index.js              # Punto de entrada
    ├── .gitignore
    └── package.json
```

## 🔧 API Endpoints

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/:id` - Actualizar producto (Admin)
- `DELETE /api/products/:id` - Eliminar producto (Admin)
- `POST /api/products/:id/reviews` - Crear reseña
- `GET /api/products/top` - Obtener productos destacados

### Usuarios
- `POST /api/users/register` - Registrar usuario
- `POST /api/users/login` - Iniciar sesión
- `GET /api/users/profile` - Obtener perfil (Privado)
- `PUT /api/users/profile` - Actualizar perfil (Privado)
- `GET /api/users` - Obtener todos los usuarios (Admin)
- `GET /api/users/:id` - Obtener usuario por ID (Admin)
- `PUT /api/users/:id` - Actualizar usuario (Admin)
- `DELETE /api/users/:id` - Eliminar usuario (Admin)

### Órdenes
- `POST /api/orders` - Crear orden (Privado)
- `GET /api/orders/:id` - Obtener orden por ID (Privado)
- `PUT /api/orders/:id/pay` - Marcar orden como pagada (Privado)
- `PUT /api/orders/:id/deliver` - Marcar orden como enviada (Admin)
- `GET /api/orders/myorders` - Obtener mis órdenes (Privado)
- `GET /api/orders` - Obtener todas las órdenes (Admin)

## 🎯 Primeros Pasos

### 1. Crear Productos de Prueba

Puedes usar MongoDB Compass o la shell de MongoDB para insertar productos de prueba:

```javascript
db.products.insertMany([
  {
    nombre: "iPhone 14 Pro",
    descripcion: "El último iPhone de Apple con chip A16 Bionic",
    precio: 999,
    imagen: "https://via.placeholder.com/300",
    categoria: "Electrónica",
    marca: "Apple",
    stock: 10,
    rating: 4.5,
    numReviews: 12,
    reviews: []
  },
  {
    nombre: "Samsung Galaxy S23",
    descripcion: "Smartphone Android de última generación",
    precio: 899,
    imagen: "https://via.placeholder.com/300",
    categoria: "Electrónica",
    marca: "Samsung",
    stock: 15,
    rating: 4.3,
    numReviews: 8,
    reviews: []
  }
])
```

### 2. Crear Usuario Administrador

Para crear un usuario administrador, primero regístrate normalmente y luego actualiza el campo `isAdmin` en la base de datos:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Manejo de CORS

### Frontend
- **React** - Librería de UI
- **React Router** - Enrutamiento
- **Context API** - Manejo de estado global
- **Axios** - Cliente HTTP
- **React Icons** - Iconos
- **React Toastify** - Notificaciones

## 📝 Próximas Mejoras

- [ ] Panel de administración completo
- [ ] Integración con pasarela de pago real (Stripe/PayPal)
- [ ] Carga de imágenes (Cloudinary)
- [ ] Filtros avanzados de productos
- [ ] Wishlist (lista de deseos)
- [ ] Comparación de productos
- [ ] Chat de soporte
- [ ] Email de confirmación
- [ ] Recuperación de contraseña

## 👤 Autor

Proyecto desarrollado como ejemplo de e-commerce MERN Stack

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia ISC.

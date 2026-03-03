import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

const users = [
  {
    nombre: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    nombre: 'John Doe',
    email: 'john@example.com',
    password: '123456',
  },
  {
    nombre: 'Jane Doe',
    email: 'jane@example.com',
    password: '123456',
  },
];

const products = [
  {
    nombre: 'iPhone 14 Pro',
    descripcion:
      'El iPhone 14 Pro cuenta con el potente chip A16 Bionic, una pantalla Super Retina XDR de 6.1 pulgadas con ProMotion, y un sistema de cámara Pro avanzado.',
    precio: 999.99,
    imagen: 'https://picsum.photos/300/300?random=1',
    categoria: 'Electrónica',
    marca: 'Apple',
    stock: 15,
    rating: 4.8,
    numReviews: 24,
  },
  {
    nombre: 'Samsung Galaxy S23',
    descripcion:
      'El Galaxy S23 presenta un diseño elegante, cámara de alta resolución, procesador Snapdragon 8 Gen 2 y batería de larga duración.',
    precio: 899.99,
    imagen: 'https://picsum.photos/300/300?random=2',
    categoria: 'Electrónica',
    marca: 'Samsung',
    stock: 20,
    rating: 4.6,
    numReviews: 18,
  },
  {
    nombre: 'MacBook Pro 16"',
    descripcion:
      'MacBook Pro con chip M2 Pro, 16GB de RAM, SSD de 512GB, pantalla Retina XDR de 16 pulgadas y hasta 22 horas de batería.',
    precio: 2499.99,
    imagen: 'https://picsum.photos/300/300?random=3',
    categoria: 'Electrónica',
    marca: 'Apple',
    stock: 8,
    rating: 4.9,
    numReviews: 32,
  },
  {
    nombre: 'Sony WH-1000XM5',
    descripcion:
      'Auriculares inalámbricos con cancelación de ruido líder en la industria, calidad de sonido excepcional y hasta 30 horas de batería.',
    precio: 399.99,
    imagen: 'https://picsum.photos/300/300?random=4',
    categoria: 'Electrónica',
    marca: 'Sony',
    stock: 25,
    rating: 4.7,
    numReviews: 45,
  },
  {
    nombre: 'iPad Air 5ta Gen',
    descripcion:
      'iPad Air con chip M1, pantalla Liquid Retina de 10.9 pulgadas, cámara frontal de 12MP con encuadre centrado y compatible con Apple Pencil.',
    precio: 599.99,
    imagen: 'https://picsum.photos/300/300?random=5',
    categoria: 'Electrónica',
    marca: 'Apple',
    stock: 12,
    rating: 4.5,
    numReviews: 28,
  },
  {
    nombre: 'Nike Air Max 270',
    descripcion:
      'Zapatillas deportivas con tecnología Air Max para máxima comodidad, diseño moderno y disponibles en varios colores.',
    precio: 150.0,
    imagen: 'https://picsum.photos/300/300?random=6',
    categoria: 'Ropa',
    marca: 'Nike',
    stock: 50,
    rating: 4.4,
    numReviews: 67,
  },
  {
    nombre: 'Kindle Paperwhite',
    descripcion:
      'E-reader con pantalla antirreflejos de 6.8 pulgadas, luz cálida ajustable, resistente al agua y batería de larga duración.',
    precio: 139.99,
    imagen: 'https://picsum.photos/300/300?random=7',
    categoria: 'Libros',
    marca: 'Amazon',
    stock: 30,
    rating: 4.6,
    numReviews: 89,
  },
  {
    nombre: 'Cafetera Nespresso',
    descripcion:
      'Máquina de café espresso de cápsula, sistema de calentamiento rápido, presión de 19 bares y diseño compacto.',
    precio: 199.99,
    imagen: 'https://picsum.photos/300/300?random=8',
    categoria: 'Hogar',
    marca: 'Nespresso',
    stock: 18,
    rating: 4.5,
    numReviews: 54,
  },
  {
    nombre: 'PlayStation 5',
    descripcion:
      'Consola de videojuegos de última generación con gráficos en 4K, SSD ultrarrápido y tecnología de audio 3D.',
    precio: 499.99,
    imagen: 'https://picsum.photos/300/300?random=9',
    categoria: 'Electrónica',
    marca: 'Sony',
    stock: 5,
    rating: 4.9,
    numReviews: 156,
  },
  {
    nombre: 'Bicicleta de Montaña',
    descripcion:
      'Bicicleta de montaña con cuadro de aluminio, suspensión delantera, 21 velocidades y frenos de disco.',
    precio: 599.99,
    imagen: 'https://picsum.photos/300/300?random=10',
    categoria: 'Deportes',
    marca: 'Trek',
    stock: 10,
    rating: 4.3,
    numReviews: 21,
  },
  {
    nombre: 'Amazon Echo Dot',
    descripcion:
      'Altavoz inteligente con Alexa, control por voz, sonido mejorado y compatible con dispositivos smart home.',
    precio: 49.99,
    imagen: 'https://picsum.photos/300/300?random=11',
    categoria: 'Electrónica',
    marca: 'Amazon',
    stock: 40,
    rating: 4.4,
    numReviews: 234,
  },
  {
    nombre: 'LEGO Star Wars Set',
    descripcion:
      'Set de construcción LEGO de Star Wars con más de 500 piezas, minifiguras incluidas y diseño detallado.',
    precio: 79.99,
    imagen: 'https://picsum.photos/300/300?random=12',
    categoria: 'Juguetes',
    marca: 'LEGO',
    stock: 22,
    rating: 4.8,
    numReviews: 78,
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Limpiar base de datos
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insertar usuarios
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Agregar algunas reseñas a productos
    const sampleProducts = products.map((product, index) => {
      if (index < 3) {
        // Agregar reseñas a los primeros 3 productos
        return {
          ...product,
          reviews: [
            {
              nombre: createdUsers[1].nombre,
              rating: 5,
              comentario: 'Excelente producto, totalmente recomendado!',
              usuario: createdUsers[1]._id,
            },
            {
              nombre: createdUsers[2].nombre,
              rating: 4,
              comentario: 'Muy buena calidad, llegó rápido.',
              usuario: createdUsers[2]._id,
            },
          ],
        };
      }
      return product;
    });

    // Insertar productos
    await Product.insertMany(sampleProducts);

    console.log('✅ Datos importados exitosamente!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('✅ Datos eliminados exitosamente!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// Ejecutar según el argumento
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    nombre: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comentario: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'Por favor ingrese el nombre del producto'],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, 'Por favor ingrese la descripción del producto'],
    },
    precio: {
      type: Number,
      required: [true, 'Por favor ingrese el precio del producto'],
      default: 0,
    },
    imagen: {
      type: String,
      default: '/images/sample.jpg',
    },
    categoria: {
      type: String,
      required: [true, 'Por favor seleccione una categoría'],
      enum: [
        'Electrónica',
        'Ropa',
        'Hogar',
        'Deportes',
        'Libros',
        'Juguetes',
        'Otros',
      ],
    },
    marca: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    destacado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;

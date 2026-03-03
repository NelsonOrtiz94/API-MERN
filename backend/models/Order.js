import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    items: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        nombre: { type: String, required: true },
        cantidad: { type: Number, required: true },
        imagen: { type: String, required: true },
        precio: { type: Number, required: true },
      },
    ],
    direccionEnvio: {
      calle: { type: String, required: true },
      ciudad: { type: String, required: true },
      codigoPostal: { type: String, required: true },
      pais: { type: String, required: true },
    },
    metodoPago: {
      type: String,
      required: true,
      default: 'Tarjeta de crédito',
    },
    resultadoPago: {
      id: String,
      estado: String,
      fechaActualizacion: String,
      emailComprador: String,
    },
    precioItems: {
      type: Number,
      required: true,
      default: 0.0,
    },
    precioEnvio: {
      type: Number,
      required: true,
      default: 0.0,
    },
    precioImpuestos: {
      type: Number,
      required: true,
      default: 0.0,
    },
    precioTotal: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPagado: {
      type: Boolean,
      required: true,
      default: false,
    },
    fechaPago: {
      type: Date,
    },
    isEnviado: {
      type: Boolean,
      required: true,
      default: false,
    },
    fechaEnvio: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;

import Order from '../models/Order.js';

// @desc    Crear nueva orden
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  try {
    const {
      items,
      direccionEnvio,
      metodoPago,
      precioItems,
      precioEnvio,
      precioImpuestos,
      precioTotal,
    } = req.body;

    if (items && items.length === 0) {
      res.status(400).json({ message: 'No hay items en la orden' });
      return;
    }

    const order = new Order({
      usuario: req.user._id,
      items,
      direccionEnvio,
      metodoPago,
      precioItems,
      precioEnvio,
      precioImpuestos,
      precioTotal,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener orden por ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'usuario',
      'nombre email'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Actualizar orden a pagada
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPagado = true;
      order.fechaPago = Date.now();
      order.resultadoPago = {
        id: req.body.id,
        estado: req.body.estado,
        fechaActualizacion: req.body.fechaActualizacion,
        emailComprador: req.body.emailComprador,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Actualizar orden a enviada
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isEnviado = true;
      order.fechaEnvio = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener órdenes del usuario logueado
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ usuario: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener todas las órdenes
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('usuario', 'id nombre')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

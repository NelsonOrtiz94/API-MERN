import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'Por favor ingrese su nombre'],
    },
    email: {
      type: String,
      required: [true, 'Por favor ingrese su email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Por favor ingrese una contraseña'],
      minlength: 6,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    direccion: {
      calle: String,
      ciudad: String,
      codigoPostal: String,
      pais: String,
    },
    telefono: String,
  },
  {
    timestamps: true,
  }
);

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

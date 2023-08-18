const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, "La dirección de correo electrónico no es válida."],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "La contraseña debe tener al menos 6 caracteres."],
    },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePicture: { type: Buffer, required: false },
  },
  { versionKey: false, collection: "users" }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

const mongoose = require("mongoose");
const { isEmail } = require("validator");
// const bycrypt = require("bcryptjs");

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

// userSchema.pre("save", async function (next) {
//   const salt = await bycrypt.genSalt();
//   this.password = await bycrypt.hash(this.password, salt);
//   next();
// });

const User = mongoose.model("User", userSchema);

module.exports = User;

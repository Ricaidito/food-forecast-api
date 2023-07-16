const User = require("../models/user.model");

const createUser = async (req, res) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    lastName: req.body.lastName,
  });

  user
    .save()
    .then(() => res.status(201).json(user))
    .catch(err => res.status(500).json({ error: err }));
};

module.exports = {
  createUser,
};

const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

router.route("/").post((req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ message: "Użytkownik z takim e-mailem już istnieje" });
    const newUser = new User({
      name,
      email,
      password,
    });
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        newUser.password = hash;
        newUser.save()
          .then((user) =>
            jwt.sign(
              { id: user.id },
              process.env.jwtSecret,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                  },
                })
              }
            )


          );
      });
    });
  });
});

module.exports = router;

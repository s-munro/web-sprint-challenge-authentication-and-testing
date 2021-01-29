const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/secrets");

const bcryptjs = require("bcryptjs");

const Users = require("./auth-model");

const { isValid, isUnique } = require("../middleware/credentials-test.js");

router.post("/register", isValid, isUnique, (req, res) => {
  const credentials = req.body;

  const rounds = process.env.BCRYPT_ROUNDS || 8;
  const hash = bcryptjs.hashSync(credentials.password, rounds);
  credentials.password = hash;

  Users.add(credentials)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post("/login", isValid, (req, res) => {
  const { username, password } = req.body;

  Users.findByUsername(username)
    .then(([user]) => {
      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: "welcome", token });
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "internal servor error" });
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role,
  };
  const options = {
    expiresIn: 1000 * 60,
  };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;

const db = require("../../data/dbConfig");

module.exports = {
  isValid,
};

async function isValid(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json("username and password required");
  } else {
    const returnedUser = await db("users").where("username", username).first();
    if (!returnedUser) {
      return next();
    } else {
      return res.status(400).json("username taken");
    }
  }
}

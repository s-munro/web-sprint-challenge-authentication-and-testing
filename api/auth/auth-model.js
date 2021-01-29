const db = require("../../data/dbConfig");

module.exports = {
  add,
  findById,
  findByUsername,
};

async function add(user) {
  const id = await db("users").insert(user);

  return findById(id);
}

async function findById(id) {
  return await db("users").where("id", id).first();
}
async function findByUsername(username) {
  return await db("users").where("username", username);
}

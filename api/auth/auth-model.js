const db = require("../../data/dbConfig");

module.exports = {
  add,
};

async function add(user) {
  const id = await db("users").insert(user);

  return findById(id);
}

async function findById(id) {
  return await db("users").where("id", id).first();
}

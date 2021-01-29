const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

// const User = require("./auth/auth-model");

const samUser = { username: "sam", password: "1234" };

const incompleteUser = { username: "", password: "" };

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db("users").truncate();
});
afterAll(async () => {
  await db.destroy();
});

// Write your tests here
test("sanity", () => {
  expect(true).toBe(true);
});

describe("server", () => {
  describe("[POST] /register", () => {
    it("Denies if credentials aren't supplied", async () => {
      let res = await request(server)
        .post("/api/auth/register")
        .send(incompleteUser);
      expect(res.status).toEqual(400);
    });
    it("sends user back on success", async () => {
      let res = await await request(server)
        .post("/api/auth/register")
        .send(samUser);
      expect(res.body).toMatchObject({ username: "sam" });
    });
  });

  describe("[POST] /login", () => {
    it("denies if user doesn't exist", async () => {
      let res = await request(server).post("/api/auth/login").send(samUser);
      expect(res.status).toEqual(401);
    });
    it("grants places token with string in body if login success", async () => {
      await request(server).post("/api/auth/register").send(samUser);
      let res = await request(server).post("/api/auth/login").send(samUser);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
        })
      );
    });
  });

  describe("[GET] /api/jokes", () => {
    it("doesnt allow without login auth", async () => {
      let res = await request(server).get("/api/jokes/");
      expect(res.status).toEqual(401);
    });
    it("sends jokes array if logged in", async () => {
      await request(server).post("/api/auth/register").send(samUser);
      const loginRes = await request(server)
        .post("/api/auth/login")
        .send(samUser);
      let res = await request(server)
        .get("/api/jokes/")
        .set("Authorization", loginRes.body.token);
      // expect(loginRes.body.token).toEqual(1);
      expect(res.body[0]).toMatchObject({ joke: expect.any(String) });
    });
  });
});

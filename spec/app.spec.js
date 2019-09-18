process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const { expect } = require("chai");
const connection = require("../db/connection");

// const chai = require("chai");
//const chaiSorted = require("chai-sorted");
//chai.use(chaiSorted);

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/topics", () => {
    describe("GET", () => {
      it("status: 200 responds with an array of topics objects containing correct properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(res => {
            expect(res.body.topics).to.be.an("array");
            expect(res.body.topics[0]).to.contain.keys("slug", "description");
          });
      });
      it("status: 404 responds with an error message, when route is not found", () => {
        return request(app)
          .get("/api/toppics")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Route not found");
          });
      });
    });
  });
  describe("/users/:username", () => {
    describe("GET", () => {
      it("status: 200 returns an user object with correct keys", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.have.keys("username", "avatar_url", "name");
          });
      });
      it("status: 404 responds with an error message when user does not exist", () => {
        return request(app)
          .get("/api/users/notexist")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("User not found");
          });
      });
    });
  });
  describe("/articles", () => {
    describe("/:article_id", () => {
      it("PATCH: status 200 returns a new updated object", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 456 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(556);
          });
      });
      it("PATCH: status 404 responds with an error message when article does not exist", () => {
        return request(app)
          .patch("/api/articles/7894")
          .send({ inc_votes: 456 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article not found");
          });
      });
      it("GET: status 200 returns an article with correct keys", () => {
        return require(app).get("/api/articles/1");
      });
    });
  });
});

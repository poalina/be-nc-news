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
      it("PATCH: status 200 responds with an article when no input is given", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(100);
          });
      });
      it("PATCH: status 400 responds with an error message when article Id is invalid", () => {
        return request(app)
          .patch("/api/articles/abd")
          .send({ inc_votes: 456 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input - number is required");
          });
      });
      it("PATCH: status 400 responds with an error message when inc_votes value is not a number", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "abc" })
          .expect(400)
          .then(({ body }) => {
            // console.log(body);
            expect(body.msg).to.equal("Invalid input - number is required");
          });
      });
      it("GET: status 200 returns an article object with correct keys", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.have.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            );
          });
      });
    });
    describe("/:article_id/comments", () => {
      it.only("POST: status 201 returns a comment object with correct keys", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "lurker", body: "Yes, I know what you mean" })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).to.have.keys(
              "comment_id",
              "article_id",
              "author",
              "body",
              "votes",
              "created_at"
            );
          });
      });
    });
  });
});

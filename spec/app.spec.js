process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const { expect } = require("chai");
const connection = require("../db/connection");

const chai = require("chai");
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);

describe("/app", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/api", () => {
    it("GET/ status: 200 and responds with JSON describing all the available endpoints on API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("object");
        });
    });
    it("status: 405 and responds with an error message for invalid HTTP method", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("DELETE/ status: 405 and responds with an error message for invalid HTTP method", () => {
      return request(app)
        .delete("/api/articles")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method not allowed");
        });
    });
  });

  describe("/topics", () => {
    it("GET/ status: 200 responds with an array of topics objects containing correct properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.be.an("array");
          expect(body.topics[0]).to.contain.keys("slug", "description");
        });
    });
    it("GET/ status: 404 responds with an error message, when route is not found", () => {
      return request(app)
        .get("/api/toppics")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Page not found");
        });
    });
  });
  describe("/users/:username", () => {
    it("GET/ status: 200 returns an user object with correct keys", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.have.keys("username", "avatar_url", "name");
        });
    });
    it("GET/ status: 404 responds with an error message when user does not exist", () => {
      return request(app)
        .get("/api/users/notexist")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("User not found");
        });
    });
  });
  describe("/articles", () => {
    describe("/:article_id", () => {
      it("PATCH: status 200 returns a new updated object", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(101);
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
      it("PATCH: status 404 responds with an error message when article does not exist", () => {
        return request(app)
          .patch("/api/articles/7894")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article not found");
          });
      });
      it("PATCH: status 400 responds with an error message when article Id is invalid", () => {
        return request(app)
          .patch("/api/articles/abd")
          .send({ inc_votes: 1 })
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
      it("POST: status 201 returns a comment object with correct keys", () => {
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
      it("POST: status 201 returns a comment object with correct key-value pairs", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "lurker", body: "Yes, I know what you mean" })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment.author).to.equal("lurker");
            expect(comment.article_id).to.equal(1);
            expect(comment.body).to.equal("Yes, I know what you mean");
          });
      });
      it("POST: status 404 responds with an error message when article does not exist", () => {
        return request(app)
          .post("/api/articles/992/comments")
          .send({ username: "lurker", body: "Yes, I know what you mean" })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Data does not exist");
          });
      });
      it("POST: status 400 responds with an error message when article id is invalid", () => {
        return request(app)
          .post("/api/articles/hello/comments")
          .send({ username: "lurker", body: "Yes, I know what you mean" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input - number is required");
          });
      });
      it("POST: status 400 responds with an error message when given comment has wrong keys", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ wrong_key: "lurker", body: "Yes, I know what you mean" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Incorrect input");
          });
      });
      it("GET: status 200 responds with all comments for the given article", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0]).to.contain.keys(
              "comment_id",
              "created_at",
              "body",
              "votes",
              "author"
            );
          });
      });
      it("GET: status 200 responds with an article when the given article does not have comments", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an("array");
          });
      });
      it("GET: status 404 responds with an error message when article does not exist", () => {
        return request(app)
          .get("/api/articles/992/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article not found");
          });
      });
      it("GET: status 400 responds with an error message when article id is invalid", () => {
        return request(app)
          .get("/api/articles/hello/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input - number is required");
          });
      });
      it("GET: status 200 comments are sorted by 'created_at' column (default) ", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=created_at")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET: status 200 comments are sorted by 'votes' (descending by default) ", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy("votes", {
              descending: true
            });
          });
      });
      it("GET: status 200 comments are sorted ascending by default (created_at) ", () => {
        return request(app)
          .get("/api/articles/1/comments?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy("created_at");
          });
      });
      it("GET: status 200 comments are sorted ascending by body ", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy("comment_id");
          });
      });
    });
    describe("?query", () => {
      it("1 GET/ status: 200 and responds with an array of articles objects containing correct properties", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an("array");
            expect(body.articles[0]).to.be.a("object");
            expect(body.articles[0]).to.contain.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      it("2 GET/ status: 404 and responds with an error message, when route is not found", () => {
        return request(app)
          .get("/api/wrongRoute")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Page not found");
          });
      });
      it("3 GET/ status 200 and responds with articles sorted descending (default) by date (default)", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("4 GET/ status 200 and responds with articles sorted descending (default) by 'votes'", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("votes", {
              descending: true
            });
          });
      });
      it("5 GET/ status 200 and responds with articles sorted ascending by 'article_id'", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("article_id");
          });
      });
      it("6 GET/ status 200 and responds with articles filtered by 'author'", () => {
        return request(app)
          .get("/api/articles?author=rogersop")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.lengthOf(3);
          });
      });
      it("7 GET/ status 200 and responds with articles filtered by 'topic'", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            const topic = articles.every(article => article.topic === "mitch");
            expect(articles).to.have.lengthOf(10);
            expect(topic).to.be.true;
          });
      });
      it("8 GET/ status 200 and responds with articles filtered by 'topic' and 'author", () => {
        return request(app)
          .get("/api/articles?topic=mitch&author=rogersop")
          .expect(200)
          .then(({ body: { articles } }) => {
            const topic = articles.every(article => article.topic === "mitch");
            const author = articles.every(
              article => article.author === "rogersop"
            );
            expect(articles).to.have.lengthOf(2);
            expect(topic).to.be.true;
            expect(author).to.be.true;
          });
      });
      it("9 GET/ status: 200 and responds with an empty array when filtered by existing 'topic', but there is no articles ", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
          });
      });
      it("10 GET/ status: 200 and responds with an empty array when filtered by existing 'author', but there is no articles ", () => {
        return request(app)
          .get("/api/articles?topic=paper&author=rogersop")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
          });
      });
      it("11 GET/ status: 404 and responds with an error message, when query (topic) does not match any topic", () => {
        return request(app)
          .get("/api/articles?topic=doesntExist")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Topic not found");
          });
      });
      it("12 GET/ status: 404 and responds with an error message, when query (author) does not match any author", () => {
        return request(app)
          .get("/api/articles?author=doesntExist")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Author not found");
          });
      });
      it("13 GET/ status: 400 and an error message, for an invalid query", () => {
        return request(app)
          .get("/api/articles?order=badRequest")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("14 GET/ status: 400 and an error message, for an invalid query", () => {
        return request(app)
          .get("/api/articles?sort_by=columnDoesntExist")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Incorrect input");
          });
      });
      it("15 GET/ status: 200 and returns 10 articles by default", () => {
        return request(app)
          .get("/api/articles?limit=10")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.lengthOf(10);
          });
      });
    });
  });
  describe("/comments/:comments_id", () => {
    it("DELETE: status 204 removes a comment with the given id", () => {
      return request(app)
        .delete("/api/comments/2")
        .expect(204);
    });
    it("DELETE: status 404 responds with an error message when comment does not exist", () => {
      return request(app)
        .delete("/api/comments/987")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Comment does not exist");
        });
    });
    it("DELETE: status 400 and responds with an error message when comment Id is invalid", () => {
      return request(app)
        .delete("/api/comments/notANumber")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid input - number is required");
        });
    });
    it("PATCH: status 200 and responds with an updated comment for comment with votes: 68", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ inc_votes: 68 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(168);
          expect(body.comment).to.contain.keys(
            "comment_id",
            "author",
            "body",
            "article_id"
          );
        });
    });
    it("PATCH: status 200 and responds with an updated comment for comment with votes: -100", () => {
      return request(app)
        .patch("/api/comments/4")
        .send({ inc_votes: 68 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(-32);
        });
    });
    it("PATCH: status 200 and responds with a not updated comment when no input is given", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({})
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(100);
        });
    });
    it("PATCH: status 404 and responds with an error message when comment does not exist", () => {
      return request(app)
        .patch("/api/comments/39393")
        .send({ inc_votes: 68 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Comment not found");
        });
    });
    it("PATCH: status 400 and responds with an error message when comment ID is invalid", () => {
      return request(app)
        .patch("/api/comments/notValid")
        .send({ inc_votes: 68 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid input - number is required");
        });
    });
    it("PATCH: status 400 and responds with an error message when inc_votes value is not a number", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "not a number" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid input - number is required");
        });
    });
  });
});

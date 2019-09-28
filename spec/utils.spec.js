const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an empty array, when passed an empty array", () => {
    expect(formatDates([])).to.eql([]);
  });
  it("does not mutate an original data ", () => {
    const input = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];
    expect(input).to.eql(expected);
  });
  it("when passed a single object array, returns a new one object array with updated date format", () => {
    const input = [
      {
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        created_at: 280844514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        created_at: new Date(280844514171)
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("when passed a mutliple objects array, returns a new array with updated date format", () => {
    const input = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      },
      {
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171
      },
      {
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        created_at: 280844514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: new Date(1289996514171)
      },
      {
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: new Date(533132514171)
      },
      {
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        created_at: new Date(280844514171)
      }
    ];
    expect(actual).to.eql(expected);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object, when passed an empty array", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("returns a new object, when passed a single object array and does not mutate an original data", () => {
    const input = [{ article_id: 1, title: "A" }];
    const actual = makeRefObj(input);
    const expected = { A: 1 };
    expect(actual).to.eql(expected);
    expect(input).to.eql([{ article_id: 1, title: "A" }]);
  });
  it("returns a new object, when passed a multiple objects array", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "Z" },
      { article_id: 3, title: "K" }
    ];
    const actual = makeRefObj(input);
    const expected = { A: 1, Z: 2, K: 3 };
    expect(actual).to.eql(expected);
  });
});

describe("formatComments", () => {
  it("returns an empty array, when passed an empty array", () => {
    expect(formatComments([])).to.eql([]);
  });
  it("returns a new array with formatted comments, when passed a single object array and does not mutate an original input", () => {
    const input = [
      {
        body: "Lobster pot",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1322138163389
      }
    ];
    const articleRef = { "Living in the shadow of a great man": 13 };
    const actual = formatComments(input, articleRef);
    const expected = [
      {
        body: "Lobster pot",
        article_id: 13,
        author: "icellusedkars",
        votes: 0,
        created_at: new Date(1322138163389)
      }
    ];
    expect(actual).to.eql(expected);
    expect(input).to.eql([
      {
        body: "Lobster pot",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1322138163389
      }
    ]);
  });
  it("when passed a multiple objects array, returns a new array with formatted comments", () => {
    const commentData = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body: "Lobster pot",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1322138163389
      }
    ];
    const articleRef = {
      "They're not exactly dogs, are they?": 8,
      "Living in the shadow of a great man": 13
    };
    const actual = formatComments(commentData, articleRef);
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 8,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body: "Lobster pot",
        article_id: 13,
        author: "icellusedkars",
        votes: 0,
        created_at: new Date(1322138163389)
      }
    ];
    expect(actual).to.eql(expected);
  });
});

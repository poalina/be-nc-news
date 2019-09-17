process.env.NODE_ENV = "test";
const { expect } = require("chai");
const chai = require("chai");
const request = require("supertest");
const connection = require("../db/connection");
const app = require("../app");
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);

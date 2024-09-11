import seedDatabase from "../database/seedDatabase";
import request from "supertest";
import app from "../app";
import { User, Thought } from "../types/types";
import createDatabaseConnection from "../database/createDatabaseConnection";
import { Db, MongoClient } from "mongodb";

let testDb: Db;
let testDbClient: MongoClient;

beforeAll(async () => {
  const { db, client } = await createDatabaseConnection();

  testDb = db;
  testDbClient = client;

  app.set("mongoDb", testDb);
});

beforeEach(async () => {
  await seedDatabase(testDb);
});

afterAll(async () => {
  await testDbClient.close();
});

describe("/api/users", () => {
  test("GET: 200 - will return object containing a list of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users.length).toBe(5);
        users.forEach((user: User) => {
          expect(user).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              firstName: expect.any(String),
              lastName: expect.any(String),
              preferredName: expect.any(String),
              role: expect.any(String),
              userPassword: expect.any(String),
            })
          );
        });
      });
  });
});

describe("/api/thoughts", () => {
  test("GET: 200 - will return object containing an list of thoughts", () => {
    return request(app)
      .get("/api/thoughts")
      .expect(200)
      .then(({ body }) => {
        const thoughts = body.thoughts;
        expect(thoughts.length).toBe(6);
        thoughts.forEach((thought: Thought) => {
          expect(thought).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              thoughtMessage: expect.any(String),
              category: expect.any(String),
              isPriority: expect.any(Boolean),
            })
          );
        });
      });
  });
});

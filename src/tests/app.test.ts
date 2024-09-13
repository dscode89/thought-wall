import seedTestDatabase from "../database/seedDatabase";
import request from "supertest";
import app from "../app";
import { User, Thought } from "../types/types";
import createDatabaseConnection from "../database/createDatabaseConnection";
import { Db, MongoClient, ObjectId } from "mongodb";
import { fetchUsers } from "../models/usersModel";
import { fetchThoughts } from "../models/thoughtsModel";

let testDb: Db;
let testDbClient: MongoClient;

beforeAll(async () => {
  const { db, client } = await createDatabaseConnection();

  testDb = db;
  testDbClient = client;

  app.set("mongoDb", testDb);
});

beforeEach(async () => {
  await seedTestDatabase(testDb);
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
  test("POST: 201 - will return a posted user document", () => {
    return request(app)
      .post("/api/users")
      .expect(201)
      .send({
        firstName: "Ashlyn",
        lastName: "Lovatt",
        preferredName: "Ash",
        role: "ADMIN",
        userPassword: "securepass458",
        email: "no@cheese.com",
      })
      .then(({ body }) => {
        const user = body.user;
        expect(user).toMatchObject({
          firstName: "Ashlyn",
          lastName: "Lovatt",
          preferredName: "Ash",
          role: "ADMIN",
          userPassword: "securepass458",
          email: "no@cheese.com",
        });

        return fetchUsers(testDb);
      })
      .then((users) => {
        expect(users.length).toBe(6);
      });
  });
  test("DELETE:204 - will delete a user document from Users collection", async () => {
    const users = await fetchUsers(testDb);
    const testUserId = users[0]["_id"];

    return request(app)
      .delete("/api/users/" + testUserId)
      .expect(204)
      .then(() => {
        return fetchUsers(testDb);
      })

      .then((users) => {
        expect(users.length).toBe(4);
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
  test("POST: 201 - will return a posted thought document", async () => {
    const users = await fetchUsers(testDb);
    const testUserId = users[0]["_id"];

    return request(app)
      .post("/api/thoughts")
      .expect(201)
      .send({
        _userId: testUserId.toHexString(),
        category: "BILLS",
        isPriority: false,
        thoughtMessage: "I need to pay my billy bills",
      })
      .then(({ body }) => {
        expect(body.thought).toMatchObject({
          _userId: testUserId.toHexString(),
          category: "BILLS",
          isPriority: false,
          thoughtMessage: "I need to pay my billy bills",
        });

        return fetchThoughts(testDb);
      })
      .then((thoughts) => {
        thoughts[6], "<-- in database";
        expect(thoughts.length).toBe(7);
      });
  });
  test("DELETE: 204 - will delete a thought document from Thoughts collection", async () => {
    const thoughts = await fetchThoughts(testDb);
    const testThoughtId = thoughts[0]["_id"];

    return request(app)
      .delete("/api/thoughts/" + testThoughtId)
      .expect(204)
      .then(() => {
        return fetchThoughts(testDb);
      })

      .then((users) => {
        expect(users.length).toBe(5);
      });
  });
  test("DELETE: 204 - will delete all thought documents but a specific user from Thoughts collection", async () => {
    const thoughts = await fetchUsers(testDb);
    const testUserId = thoughts[0]["_id"];

    return request(app)
      .delete("/api/thoughts/users/" + testUserId)
      .expect(204)
      .then(() => {
        return fetchThoughts(testDb);
      })

      .then((users) => {
        expect(users.length).toBe(3);
      });
  });
});

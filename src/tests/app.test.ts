import seedTestDatabase from "../database/seedDatabase";
import request from "supertest";
import app from "../app";
import { User, Thought } from "../types/types";
import createDatabaseConnection from "../database/createDatabaseConnection";
import { Db, MongoClient, ObjectId } from "mongodb";
import { fetchUsers } from "../models/usersModel";
import { fetchThoughts } from "../models/thoughtsModel";
import bcrypt from "bcryptjs";

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
  describe("GET", () => {
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
  describe("POST", () => {
    test("POST: 201 - will return a new posted user document", () => {
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

          expect(
            bcrypt.compareSync("securepass458", user.userPassword)
          ).toBeTruthy();
          expect(user).toMatchObject({
            firstName: "Ashlyn",
            lastName: "Lovatt",
            preferredName: "Ash",
            role: "ADMIN",
            email: "no@cheese.com",
          });

          return fetchUsers(testDb);
        })
        .then((users) => {
          expect(users.length).toBe(6);
        });
    });
  });

  // error handling needed for post request
});

describe("/api/users/:user_id", () => {
  describe("DELETE", () => {
    test("DELETE:204 - will delete a user document from Users collection by the userID", async () => {
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
  describe("PATCH", () => {
    test("PATCH: 200 - will return a user document with an updated firstName property", async () => {
      const users = await fetchUsers(testDb);
      const testUserId = users[0]["_id"].toHexString();

      expect(users[0].firstName).toBe("John");

      return request(app)
        .patch("/api/users/" + testUserId)
        .expect(200)
        .send({
          firstName: "Dave",
        })
        .then(({ body }) => {
          const updatedUser = body.user;
          expect(testUserId).toBe(updatedUser._id);
          expect(updatedUser.firstName).toBe("Dave");
        });
    });
    test("PATCH: 200 - will return a user document with an updated lastName property", async () => {
      const users = await fetchUsers(testDb);
      const testUserId = users[0]["_id"].toHexString();

      expect(users[0].lastName).toBe("Doe");

      return request(app)
        .patch("/api/users/" + testUserId)
        .expect(200)
        .send({
          lastName: "Moran",
        })
        .then(({ body }) => {
          const updatedUser = body.user;
          expect(testUserId).toBe(updatedUser._id);
          expect(updatedUser.lastName).toBe("Moran");
        });
    });
    test("PATCH: 200 - will return a user document with an updated preferredNAme property", async () => {
      const users = await fetchUsers(testDb);
      const testUserId = users[0]["_id"].toHexString();

      expect(users[0].preferredName).toBe("Johnny");

      return request(app)
        .patch("/api/users/" + testUserId)
        .expect(200)
        .send({
          preferredName: "John Boy",
        })
        .then(({ body }) => {
          const updatedUser = body.user;
          expect(testUserId).toBe(updatedUser._id);
          expect(updatedUser.preferredName).toBe("John Boy");
        });
    });
    test("PATCH: 200 - will return a user document with an updated role property", async () => {
      const users = await fetchUsers(testDb);
      const testUserId = users[0]["_id"].toHexString();

      expect(users[0].role).toBe("ADMIN");

      return request(app)
        .patch("/api/users/" + testUserId)
        .expect(200)
        .send({
          role: "USER",
        })
        .then(({ body }) => {
          const updatedUser = body.user;
          expect(testUserId).toBe(updatedUser._id);
          expect(updatedUser.role).toBe("USER");
        });
    });
    test("PATCH: 200 - will return a user document with an updated userPassword property", async () => {
      const users = await fetchUsers(testDb);
      const testUserId = users[0]["_id"].toHexString();

      // expect encrypted password to be what it was originally
      expect(
        bcrypt.compareSync("password123", users[0].userPassword)
      ).toBeTruthy();

      return request(app)
        .patch("/api/users/" + testUserId)
        .expect(200)
        .send({
          userPassword: "newPassword123",
        })
        .then(({ body }) => {
          const updatedUser = body.user;

          // check user id to make sure it's the same user document
          expect(testUserId).toBe(updatedUser._id);
          // expect new encrypted password to be ther new password
          expect(
            bcrypt.compareSync("newPassword123", updatedUser.userPassword)
          ).toBeTruthy();
          // expect the passwords to be different after updating
          expect(users[0].userPassword).not.toBe(updatedUser.password);
        });
    });
    test("PATCH: 200 - will return a user document with an updated email property", async () => {
      const users = await fetchUsers(testDb);
      const testUserId = users[0]["_id"].toHexString();

      expect(users[0].email).toBe("ham@cheese.com");

      return request(app)
        .patch("/api/users/" + testUserId)
        .expect(200)
        .send({
          email: "spam@cheese.com",
        })
        .then(({ body }) => {
          const updatedUser = body.user;
          expect(testUserId).toBe(updatedUser._id);
          expect(updatedUser.email).toBe("spam@cheese.com");
        });
    });
    test("PATCH: 200 - will return a user document with an multiple properties updated", async () => {
      const users = await fetchUsers(testDb);
      const testUserId = users[0]["_id"].toHexString();

      expect(users[0].email).toBe("ham@cheese.com");
      expect(users[0].role).toBe("ADMIN");

      return request(app)
        .patch("/api/users/" + testUserId)
        .expect(200)
        .send({
          role: "USER",
          email: "spam@cheese.com",
        })
        .then(({ body }) => {
          const updatedUser = body.user;
          expect(testUserId).toBe(updatedUser._id);
          expect(updatedUser.email).toBe("spam@cheese.com");
          expect(updatedUser.role).toBe("USER");
        });
    });
  });

  // error handling needed to be thought about
});

describe("/api/thoughts", () => {
  describe("GET", () => {
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

  describe("POST", () => {
    test("POST: 201 - will return a new posted thought document", async () => {
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
    // error handling needed for post request
  });
});

describe("/api/thoughts/:thought_id", () => {
  describe("PATCH", () => {
    test("PATCH: 200 - will return updated thought with amended thoughtMessage", async () => {
      const thoughts = await fetchThoughts(testDb);
      const testThoughtId = thoughts[0]["_id"].toHexString();

      expect(thoughts[0].thoughtMessage).toBe(
        "Need to fix the leaking sink in the kitchen."
      );

      return request(app)
        .patch("/api/thoughts/" + testThoughtId)
        .expect(200)
        .send({
          thoughtMessage: "I have updated this thought msg!",
        })
        .then(({ body }) => {
          const updatedThought = body.thought;
          expect(testThoughtId).toBe(updatedThought._id);
          expect(updatedThought.thoughtMessage).toBe(
            "I have updated this thought msg!"
          );
        });
    });
    test("PATCH: 200 - will return updated thought with isPriority property amended", async () => {
      const thoughts = await fetchThoughts(testDb);
      const testThoughtId = thoughts[0]["_id"].toHexString();

      expect(thoughts[0].isPriority).toBe(true);

      return request(app)
        .patch("/api/thoughts/" + testThoughtId)
        .expect(200)
        .send({
          isPriority: false,
        })
        .then(({ body }) => {
          const updatedThought = body.thought;
          expect(testThoughtId).toBe(updatedThought._id);
          expect(updatedThought.isPriority).toBe(false);
        });
    });
    test("PATCH: 200 - will return updated thought with category amended", async () => {
      const thoughts = await fetchThoughts(testDb);
      const testThoughtId = thoughts[0]["_id"].toHexString();

      expect(thoughts[0].category).toBe("HOME");

      return request(app)
        .patch("/api/thoughts/" + testThoughtId)
        .expect(200)
        .send({
          category: "GENERAL",
        })
        .then(({ body }) => {
          const updatedThought = body.thought;
          expect(testThoughtId).toBe(updatedThought._id);
          expect(updatedThought.category).toBe("GENERAL");
        });
    });
    test("PATCH: 200 - will return updated thought document that has had multiple valid properties amended", async () => {
      const thoughts = await fetchThoughts(testDb);
      const testThoughtId = thoughts[0]["_id"].toHexString();

      expect(thoughts[0].category).toBe("HOME");
      expect(thoughts[0].isPriority).toBe(true);

      return request(app)
        .patch("/api/thoughts/" + testThoughtId)
        .expect(200)
        .send({
          category: "GENERAL",
          isPriority: false,
        })
        .then(({ body }) => {
          const updatedThought = body.thought;

          expect(testThoughtId).toBe(updatedThought._id);
          expect(updatedThought.category).toBe("GENERAL");
          expect(updatedThought.isPriority).toBe(false);
        });
    });

    // error handling needed here - think about possible errors
  });
  describe("DELETE", () => {
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

    // error handling needed to be thought about
  });
});

describe("/api/thoughts/users/:user_id", () => {
  describe("DELETE", () => {
    test("DELETE: 204 - will delete all thought documents by a specific user from Thoughts collection", async () => {
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
});

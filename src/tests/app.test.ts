import seedTestDatabase from "../database/seedDatabase";
import request from "supertest";
import app from "../app";
import { User, Thought } from "../types/types";
import createDatabaseConnection from "../database/createDatabaseConnection";
import { Db, MongoClient } from "mongodb";
import { fetchUsers, removeUser } from "../models/usersModel";
import {
  createThought,
  fetchThoughts,
  fetchThoughtsByUserId,
} from "../models/thoughtsModel";
import bcrypt from "bcryptjs";
import endpointData from "../api.json";

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

describe("/api/home", () => {
  test("will return information about all of the available data on the API via each endpoint", () => {
    return request(app)
      .get("/api/home")
      .expect(200)
      .then(({ body }) => {
        expect(body.apiInfo).toEqual(endpointData);
      });
  });
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
          userPassword: "securePass458!",
          email: "no@cheese.com",
        })
        .then(({ body }) => {
          const user = body.user;

          expect(
            bcrypt.compareSync("securePass458!", user.userPassword)
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
    describe("ERRORS", () => {
      test("POST: 400 - empty request body", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({})
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - extra properties posted on request body", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "Ashlyn",
            lastName: "Lovatt",
            favAnimal: "cat",
            preferredName: "Ash",
            role: "ADMIN",
            userPassword: "securepass458",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - missing firstName property", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            lastName: "Lovatt",
            preferredName: "Ash",
            role: "ADMIN",
            userPassword: "securePass458!",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - missing lastName property", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "Sam",
            preferredName: "Ash",
            role: "ADMIN",
            userPassword: "securePass458!",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - missing preferredName property", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "Ashlyn",
            lastName: "Lovatt",
            role: "ADMIN",
            userPassword: "securePass458!",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - missing role property", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "Ashlyn",
            lastName: "Lovatt",
            preferredName: "Ash",
            userPassword: "securePass458!",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - missing userPassword property", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "Ashlyn",
            lastName: "Lovatt",
            preferredName: "Ash",
            role: "ADMIN",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - missing email property", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "Ashlyn",
            lastName: "Lovatt",
            preferredName: "Ash",
            role: "ADMIN",
            userPassword: "securePass458!",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid value type for firstName property", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: true,
            lastName: "Jeff",
            preferredName: "Ash",
            role: "ADMIND",
            userPassword: "securepass458",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid value type for lastName property", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "Barry",
            lastName: 9,
            preferredName: "Ash",
            role: "ADMIN",
            userPassword: "securepass458",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid value type for preferredName property", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "Sam",
            lastName: "Jeff",
            preferredName: false,
            role: "ADMIN",
            userPassword: "securepass458",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid value type for role property", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "Sam",
            lastName: "Jeff",
            preferredName: "Ash",
            role: 4,
            userPassword: "securepass458",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid value type for userPassword property", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "Sam",
            lastName: "Jeff",
            preferredName: "Ash",
            role: "ADMIN",
            userPassword: 1234,
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid value type for email property", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "Sam",
            lastName: "Jeff",
            preferredName: "Ash",
            role: "ADMIN",
            userPassword: "securePass458!",
            email: true,
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid firstName structure(min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes)", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "bob9",
            lastName: "Lovatt",
            preferredName: "Ash",
            role: "ADMIN",
            userPassword: "securepass458",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid lastName structure(min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes)", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "John",
            lastName: "! smith",
            preferredName: "Ash",
            role: "ADMIN",
            userPassword: "securepass458",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid preferredName structure(min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes)", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "John",
            lastName: "Smith",
            preferredName: "John! smith",
            role: "ADMIN",
            userPassword: "securepass458",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid role strcture(must be a string of eiter 'ADMIN' or 'ROLE'", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "Ashlyn",
            lastName: "Lovatt",
            preferredName: "Ash",
            role: "GHOST",
            userPassword: "securePass458!",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid password structure(must be at least 8 chars in length, contain: at least one lower case, one uppercase, one number, one of the included special chars (!@£$%^&*()))", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "John",
            lastName: "Smith",
            preferredName: "Johnny",
            role: "ADMIN",
            userPassword: "jell!",
            email: "no@cheese.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid email structure", () => {
        return request(app)
          .post("/api/users")
          .expect(400)
          .send({
            firstName: "John",
            lastName: "Smith",
            preferredName: "Steve",
            role: "ADMIN",
            userPassword: "securePassword123!",
            email: "@hell.com",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
    });
  });

  /*
   - Errors:
    - test for valid password(1 lower, 1 upper, 1 number, 1 spec, no spaces and at least 8 chars long)
    - test for valid email
    - test for valid first name(at 1 least char, max 12 chars, no nunbers or special chars)
    - test for valid last name(at 1 least char, max 12 chars, no nunbers or special chars)
    - test for preferredName(at 1 least char, max 12 chars, no numbers or special chars)
  */
});

describe("/api/users/:user_id", () => {
  describe("GET", () => {
    test("GET: 200 - returns a user based on provided user id", async () => {
      const users = await fetchUsers(testDb);
      const testUserId = users[0]["_id"];

      return request(app)
        .get("/api/users/" + testUserId)
        .expect(200)
        .then(({ body }) => {
          const user = body.user;

          expect(
            bcrypt.compareSync("password123", user.userPassword)
          ).toBeTruthy();

          expect(typeof user._id).toBe("string");
          expect(user).toMatchObject({
            firstName: "John",
            lastName: "Doe",
            preferredName: "Johnny",
            role: "ADMIN",
            email: "ham@cheese.com",
          });
        });
    });
    describe("ERRORS", () => {
      test("404 - passed a non-existent userId", async () => {
        const nonExistentId = "66e5af35c085e74eaf5f6487";

        return request(app)
          .get("/api/users/" + nonExistentId)
          .expect(404)
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "404 - Could not find any users relating to provided userId"
            );
          });
      });
      test("400 - user id is not a valid 24 char hex string", async () => {
        const nonExistentId = "66e5af35c085t74eaf5z6487";

        return request(app)
          .get("/api/users/" + nonExistentId)
          .expect(400)
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
    });
  });
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
    test("DELETE:204 - if a user is deleted, any thought documents relating to that user will be deleted as well", async () => {
      const users = await fetchUsers(testDb);
      const testUserId = users[0]["_id"];
      // post a thought
      await createThought(testDb, {
        userId: testUserId,
        thoughtMessage: "here is a thought mate",
        isPriority: false,
        category: "GENERAL",
      });
      // post another thought
      await createThought(testDb, {
        userId: testUserId,
        thoughtMessage: "here is another thought mate",
        isPriority: false,
        category: "GENERAL",
      });
      // fetch current thoughts, should be 5
      const initialRequestedThoughts = await fetchThoughtsByUserId(
        testDb,
        testUserId.toHexString()
      );

      expect(initialRequestedThoughts.length).toBe(5);
      // remove user from the data base
      await removeUser(testDb, testUserId.toHexString());

      try {
        await fetchThoughtsByUserId(testDb, testUserId.toHexString());
      } catch (error) {
        expect(error).toEqual({
          errorMsg:
            "404 - Could not find any users relating to provided userId",
          status: 404,
        });
      }
    });
    describe("ERRORS", () => {
      test("404 - passed a non-existent userId", () => {
        const nonExistentId = "66e5af35c085e74eaf5f6487";

        return request(app)
          .delete("/api/users/" + nonExistentId)
          .expect(404)
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "404 - Could not find any users relating to provided userId"
            );
          });
      });
      test("400 - user id is not a valid 24 char hex string", () => {
        const nonExistentId = "66e5af35c085e74eaf5x6487";

        return request(app)
          .delete("/api/users/" + nonExistentId)
          .expect(400)
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
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
          userPassword: "newPassword123!",
        })
        .then(({ body }) => {
          const updatedUser = body.user;

          // check user id to make sure it's the same user document
          expect(testUserId).toBe(updatedUser._id);
          // expect new encrypted password to be ther new password
          expect(
            bcrypt.compareSync("newPassword123!", updatedUser.userPassword)
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
    describe("ERRORS", () => {
      test("PATCH: 400 - empty request body", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({})
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - attempting to patch user._id", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            _id: "jam",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - this property can not be changed"
            );
          });
      });
      test("PATCH: 404 - passed a valid 24 char hex string but it is a non-existent userId", async () => {
        const nonExistentId = "66e5af35c085e74eaf5f6487";

        return request(app)
          .patch("/api/users/" + nonExistentId)
          .expect(404)
          .send({
            firstName: "Dave",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe("404 - userId could not be found");
          });
      });
      test("PATCH: 400 - miscellaneous properties included on request body", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            favFood: "Egg benni!",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid value type for firstName property", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        expect(users[0].firstName).toBe("John");

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            firstName: true,
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid value type for lastName property", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        expect(users[0].firstName).toBe("John");

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            lastName: true,
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid value type for preferredName property", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        expect(users[0].firstName).toBe("John");

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            preferredName: true,
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid value type for role property", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        expect(users[0].firstName).toBe("John");

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            role: true,
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid value type for userPassword property", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        expect(users[0].firstName).toBe("John");

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            userPassword: true,
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid value type for email property", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        expect(users[0].firstName).toBe("John");

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            email: true,
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid userId structure for parameterized query - must be a valid 24 char hex string", () => {
        const invalidId = "66e5af35c085e74eaf5x6487";

        return request(app)
          .patch("/api/users/" + invalidId)
          .send({
            firstName: "Dave",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid firstName structure(min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes)", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            firstName: "  ",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid lastName structure(min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes)", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            lastName: "  ",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid preferredName structure(min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes)", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            preferredName: "  ",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid role structure - can be either 'ADMIN' or 'USER'", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            role: "GOOFBALL",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid password structure(must be at least 8 chars in length, contain: at least one lower case, one uppercase, one number, one of the included special chars (!@£$%^&*()))", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            userPassword: "invalid",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid email structure", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            email: "invalid",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - empty firstName(min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes)", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            firstName: "",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - empty lastName(min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes)", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            lastName: "",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - empty preferredName(min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes)", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            preferredName: "  ",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - empty role  - can be either 'ADMIN' or 'USER'", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            role: "",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - empty password(must be at least 8 chars in length, contain: at least one lower case, one uppercase, one number, one of the included special chars (!@£$%^&*()))", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            userPassword: "",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - empty email structure", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"].toHexString();

        return request(app)
          .patch("/api/users/" + testUserId)
          .expect(400)
          .send({
            email: "",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
    });
  });
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
          userId: testUserId.toHexString(),
          category: "BILLS",
          isPriority: false,
          thoughtMessage: "I need to pay my billy bills",
        })
        .then(({ body }) => {
          expect(body.thought).toMatchObject({
            userId: testUserId.toHexString(),
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
    describe("ERRORS", () => {
      test("POST: 400 - empty request body", async () => {
        return request(app)
          .post("/api/thoughts")
          .expect(400)
          .send({})
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - missing userId property", async () => {
        return request(app)
          .post("/api/thoughts")
          .expect(400)
          .send({
            category: "BILLS",
            isPriority: true,
            thoughtMessage: "I need to pay my billy bills",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - missing thoughtMessage property", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"];

        return request(app)
          .post("/api/thoughts")
          .expect(400)
          .send({
            userId: testUserId.toHexString(),
            category: "BILLS",
            isPriority: false,
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - missing isPriority property", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"];

        return request(app)
          .post("/api/thoughts")
          .expect(400)
          .send({
            userId: testUserId.toHexString(),
            category: "BILLS",
            thoughtMessage: "I need to pay my billy bills",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - missing category property", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"];
        return request(app)
          .post("/api/thoughts")
          .expect(400)
          .send({
            userId: testUserId.toHexString(),
            isPriority: true,
            thoughtMessage: "I need to pay my billy bills",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid value type for userId property", async () => {
        return request(app)
          .post("/api/thoughts")
          .expect(400)
          .send({
            userId: true,
            category: "BILLS",
            isPriority: false,
            thoughtMessage: "I need to pay my billy bills",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid value type for thoughtMessage property", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"];
        return request(app)
          .post("/api/thoughts")
          .expect(400)
          .send({
            userId: testUserId.toHexString(),
            category: "BILLS",
            isPriority: true,
            thoughtMessage: 99,
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid value type for isPriority property", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"];
        return request(app)
          .post("/api/thoughts")
          .expect(400)
          .send({
            userId: testUserId.toHexString(),
            category: "BILLS",
            isPriority: "hello",
            thoughtMessage: "hello",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid value type for category property", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"];

        return request(app)
          .post("/api/thoughts")
          .expect(400)
          .send({
            userId: testUserId.toHexString(),
            isPriority: true,
            category: false,
            thoughtMessage: "I need to pay my billy bills",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid userId structure - must be 24 char hex string", async () => {
        return request(app)
          .post("/api/thoughts")
          .expect(400)
          .send({
            userId: "notValid",
            isPriority: true,
            category: false,
            thoughtMessage: "I need to pay my billy bills",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid thoughtMessage structure - must be at least 10 chars and contain a lower or uppercase letter", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"];
        return request(app)
          .post("/api/thoughts")
          .expect(400)
          .send({
            userId: testUserId.toHexString(),
            isPriority: true,
            category: "HOME",
            thoughtMessage: "   ",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("POST: 400 - invalid category structure - must be either 'HOME', 'GENERAL', 'BILLS'", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"];
        return request(app)
          .post("/api/thoughts")
          .expect(400)
          .send({
            userId: testUserId.toHexString(),
            isPriority: true,
            category: "CHEESE",
            thoughtMessage: "hello I need a wee",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
    });
  });
});

describe("/api/thoughts/:thought_id", () => {
  describe("GET", () => {
    test("GET: 200 - returns a thought based on provided thought id", async () => {
      const thoughts = await fetchThoughts(testDb);
      const users = await fetchUsers(testDb);
      const testThoughtId = thoughts[0]["_id"].toHexString();

      return request(app)
        .get("/api/thoughts/" + testThoughtId)
        .expect(200)
        .then(({ body }) => {
          const thought = body.thought;
          expect(typeof thought._id).toBe("string");
          expect(thought).toMatchObject({
            userId: users[0]._id.toHexString(),
            thoughtMessage: "Need to fix the leaking sink in the kitchen.",
            category: "HOME",
            isPriority: true,
          });
        });
    });
    describe("ERRORS", () => {
      test("404 - passed a non-existent thoughtId", async () => {
        const nonExistentId = "66e5af35c085e74eaf5f6487";

        return request(app)
          .get("/api/thoughts/" + nonExistentId)
          .expect(404)
          .then(({ body }) => {
            expect(body.errorMsg).toBe("404 - invalid thought id");
          });
      });
      test("400 - thought id is not a valid 24 char hex string", async () => {
        const nonExistentId = "66e5af35c085e74eax5f6487";

        return request(app)
          .get("/api/thoughts/" + nonExistentId)
          .expect(400)
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
    });
  });

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
    describe("ERRORS", () => {
      test("400 - empty request body", async () => {
        const thoughts = await fetchThoughts(testDb);
        const testThoughtId = thoughts[0]["_id"].toHexString();

        return request(app)
          .patch("/api/thoughts/" + testThoughtId)
          .expect(400)
          .send({})
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("400 - miscellaneous properties included on request body", async () => {
        const thoughts = await fetchThoughts(testDb);
        const testThoughtId = thoughts[0]["_id"].toHexString();

        return request(app)
          .patch("/api/thoughts/" + testThoughtId)
          .expect(400)
          .send({
            isInUncomfortableseat: true,
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 404 - passed a non-existent thoughtId", async () => {
        const nonExistentId = "66e5af35c085e74eaf5f6487";

        return request(app)
          .patch("/api/thoughts/" + nonExistentId)
          .expect(404)
          .send({
            thoughtMessage: "oopshjhkjhkhhjk",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe("404 - thoughtId could not be found");
          });
      });
      test("400 - thought id is not a valid 24 char hex string", async () => {
        const nonExistentId = "66e5af35c085e74eax5f6487";

        return request(app)
          .patch("/api/thoughts/" + nonExistentId)
          .expect(400)
          .send({
            thoughtMessage: "oops",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - attempting to patch thought._id", async () => {
        const thoughts = await fetchThoughts(testDb);
        const testThoughtId = thoughts[0]["_id"].toHexString();

        return request(app)
          .patch("/api/thoughts/" + testThoughtId)
          .expect(400)
          .send({
            _id: "jam",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe("400 - cannot change this property");
          });
      });
      test("PATCH: 400 - attempting to patch thought.userId", async () => {
        const thoughts = await fetchThoughts(testDb);
        const testThoughtId = thoughts[0]["_id"].toHexString();

        return request(app)
          .patch("/api/thoughts/" + testThoughtId)
          .expect(400)
          .send({
            userId: "jam",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe("400 - cannot change this property");
          });
      });
      test("PATCH: 400 - invalid value type for thoughtMessage property", async () => {
        const thoughts = await fetchThoughts(testDb);
        const testThoughtId = thoughts[0]["_id"].toHexString();

        return request(app)
          .patch("/api/thoughts/" + testThoughtId)
          .expect(400)
          .send({
            thoughtMessage: 99,
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid value type for isPriority property", async () => {
        const thoughts = await fetchThoughts(testDb);
        const testThoughtId = thoughts[0]["_id"].toHexString();

        return request(app)
          .patch("/api/thoughts/" + testThoughtId)
          .expect(400)
          .send({
            isPriority: 99,
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid value type for category property", async () => {
        const thoughts = await fetchThoughts(testDb);
        const testThoughtId = thoughts[0]["_id"].toHexString();

        return request(app)
          .patch("/api/thoughts/" + testThoughtId)
          .expect(400)
          .send({
            category: 99,
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid thoughtMessage structure - must be at least 10 chars and contain a lower or uppercase letter", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"];
        return request(app)
          .patch("/api/thoughts/" + testUserId)
          .expect(400)
          .send({
            thoughtMessage: "   ",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
      test("PATCH: 400 - invalid category structure - must be either 'HOME', 'GENERAL', 'BILLS'", async () => {
        const users = await fetchUsers(testDb);
        const testUserId = users[0]["_id"];
        return request(app)
          .patch("/api/thoughts/" + testUserId)
          .expect(400)
          .send({
            category: "CHEESE",
          })
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
    });
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
    describe("ERRORS", () => {
      test("404 - passed a non-existent thoughtId", async () => {
        const nonExistentId = "66e5af35c085e74eaf5f6487";

        return request(app)
          .delete("/api/thoughts/" + nonExistentId)
          .expect(404)
          .then(({ body }) => {
            expect(body.errorMsg).toBe("404 - invalid thought id");
          });
      });
      test("400 - thought id is not a valid 24 char hex string", async () => {
        const nonExistentId = "66e5af35c085e74eax5f6487";

        return request(app)
          .delete("/api/thoughts/" + nonExistentId)
          .expect(400)
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
    });
    // error handling needed to be thought about
  });
});

describe("/api/thoughts/users/:user_id", () => {
  describe("GET", () => {
    test("200 - will return all thoughts with a specified userId", async () => {
      const users = await fetchUsers(testDb);
      const testUserId = users[0]["_id"].toHexString();

      return request(app)
        .get("/api/thoughts/users/" + testUserId)
        .expect(200)
        .then(({ body }) => {
          const thoughts = body.thoughts;
          expect(thoughts.length).toBe(3);

          thoughts.forEach((thought: Thought) => {
            expect(thought.userId).toBe(users[0]._id.toHexString());

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
    test("200 - will return an empty array when passed a valid userId but that user has not posted any thoughts", async () => {
      const users = await fetchUsers(testDb);
      const testUserId = users[2]["_id"].toHexString();
      return request(app)
        .get("/api/thoughts/users/" + testUserId)
        .expect(200)
        .then(({ body }) => {
          expect(body.thoughts).toEqual([]);
        });
    });
    describe("ERRORS", () => {
      test("404 - passed a non-existent userId", async () => {
        const nonExistentId = "66e5af35c085e74eaf5f6487";

        return request(app)
          .get("/api/thoughts/users/" + nonExistentId)
          .expect(404)
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "404 - Could not find any users relating to provided userId"
            );
          });
      });
      test("400 - user id is not a valid 24 char hex string", async () => {
        const nonExistentId = "66e5af35c085e74eax5f6487";

        return request(app)
          .get("/api/thoughts/users/" + nonExistentId)
          .expect(400)
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
    });
  });
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
    describe("ERRORS", () => {
      test("404 - passed a valid userId that doesn't correspond with any thoughts", async () => {
        const nonExistentId = "66e5af35c085e74eaf5f6487";

        return request(app)
          .delete("/api/thoughts/users/" + nonExistentId)
          .expect(404)
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "404 - Could not find any users relating to provided userId"
            );
          });
      });
      test("400 - user id is not a valid 24 char hex string", async () => {
        const nonExistentId = "66e5af35c085e74eax5f6487";

        return request(app)
          .delete("/api/thoughts/users/" + nonExistentId)
          .expect(400)
          .then(({ body }) => {
            expect(body.errorMsg).toBe(
              "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint"
            );
          });
      });
    });
  });
});

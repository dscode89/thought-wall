import { Db } from "mongodb";
import thoughts from "./test-data/thoughts";
import users from "./test-data/users";

async function seedTestDatabase(db: Db) {
  await db.collection("Users").drop();
  await db.collection("Thoughts").drop();
  await db.createCollection("Users", {
    validator: {
      $jsonSchema: {
        title: "User Document Validation",
        required: [
          "_id",
          "firstName",
          "lastName",
          "preferredName",
          "role",
          "userPassword",
          "email",
        ],
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId",
            description:
              "This is the generated ObjectId instance for a new inserted user document",
          },
          firstName: {
            bsonType: "string",
            description: "'firstName' must be a string and is required",
          },
          lastName: {
            bsonType: "string",
            description: "'lastName' must be a string and is required",
          },
          preferredName: {
            bsonType: "string",
            description: "'preferredName' must be a string and is required",
          },
          role: {
            bsonType: "string",
            description: "'firstName' must be a string of ADMIN or USER",
          },
          userPassword: {
            bsonType: "string",
            description: "'userPassword' must be a string and is required",
          },
          email: {
            bsonType: "string",
            description: "'email' must be a string and is required",
          },
        },
      },
    },
  });
  await db.createCollection("Thoughts", {
    // why does this ignore the _user validation if it is not provided?
    validator: {
      $jsonSchema: {
        title: "Thought Document Validation",
        required: [
          "_id",
          "_userId",
          "thoughtMessage",
          "category",
          "isPriority",
        ],
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId",
            description:
              "This is the generated ObjectId instance for a new inserted thought document",
          },
          _userId: {
            bsonType: "objectId",
            description:
              "this is the objectId for the user who posted this thought",
          },
          thoughtMessage: {
            bsonType: "string",
            description: "thoughtMessage must be a string and is required",
          },
          category: {
            bsonType: "string",
            description:
              "'category' must be a string and of of the following values: BILLS | HOME | GENERAL",
          },
          isPriority: {
            bsonType: "bool",
            description: "'isPriority' must be a boolean and is required",
          },
        },
      },
    },
  });

  await db.collection("Users").insertMany(users);

  const instertedUsers = await db.collection("Users").find().toArray();

  const firstUserId = instertedUsers[0]["_id"];
  const secondUserId = instertedUsers[1]["_id"];

  thoughts.forEach((thought, i) => {
    if (i % 2 === 0) {
      thought._userId = firstUserId;
    } else {
      thought._userId = secondUserId;
    }
  });
  await db.collection("Thoughts").insertMany(thoughts);
}

export default seedTestDatabase;

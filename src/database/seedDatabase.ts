import { Db } from "mongodb";
import thoughts from "./test-data/thoughts";
import users from "./test-data/users";
import {
  userValidationSchema,
  thoughtValidationSchema,
} from "./schemaValidationIndex";

async function seedTestDatabase(db: Db) {
  await db.collection("Users").drop();
  await db.collection("Thoughts").drop();
  await db.createCollection("Users", {
    validator: userValidationSchema,
  });
  await db.createCollection("Thoughts", {
    // why does this ignore the _user validation if it is not provided?
    validator: thoughtValidationSchema,
  });

  await db.collection("Users").insertMany(users);

  const insertedUsers = await db.collection("Users").find().toArray();

  const firstUserId = insertedUsers[0]["_id"];
  const secondUserId = insertedUsers[1]["_id"];

  thoughts.forEach((thought, i) => {
    if (i % 2 === 0) {
      thought.userId = firstUserId;
    } else {
      thought.userId = secondUserId;
    }
  });

  await db.collection("Thoughts").insertMany(thoughts);
}

export default seedTestDatabase;

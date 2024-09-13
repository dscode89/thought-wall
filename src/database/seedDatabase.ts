import { Db } from "mongodb";
import thoughts from "./test-data/thoughts";
import users from "./test-data/users";

async function seedTestDatabase(db: Db) {
  await db.collection("Users").drop();
  await db.collection("Thoughts").drop();
  await db.createCollection("Users");
  await db.createCollection("Thoughts");

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

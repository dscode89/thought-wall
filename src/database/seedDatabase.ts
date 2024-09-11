import { Db } from "mongodb";
import thoughts from "./test-data/thoughts";
import users from "./test-data/users";

async function seedTestDatabase(db: Db) {
  await db.collection("Users").drop();
  await db.collection("Thoughts").drop();

  await db.createCollection("Users");
  await db.createCollection("Thoughts");

  await db.collection("Users").insertMany(users);
  await db.collection("Thoughts").insertMany(thoughts);
}

export default seedTestDatabase;

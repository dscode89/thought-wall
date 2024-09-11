import { Db } from "mongodb";
import thoughts from "./test-data/thoughts";
import users from "./test-data/users";
import { User, Thought } from "../types/types";

async function seedDatabase(db: Db) {
  await db.collection("Users").drop();
  await db.collection("Thoughts").drop();

  await db.createCollection<User>("Users");
  await db.createCollection<Thought>("Thoughts");

  await db.collection("Users").insertMany(users);
  await db.collection("Thoughts").insertMany(thoughts);
}

export default seedDatabase;

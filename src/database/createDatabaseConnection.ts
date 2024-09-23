import { MongoClient } from "mongodb";
import { config } from "dotenv";
import thoughts from "./test-data/thoughts";
import {
  thoughtValidationSchema,
  userValidationSchema,
} from "./schemaValidationIndex";

config();

export default async function createDatabaseConnection() {
  const dbConnectionString =
    process.env.NODE_ENV === "production"
      ? process.env.CONNECTION_STRING
      : process.env.NODE_ENV
      ? process.env.CONNECTION_STRING_TEST
      : process.env.CONNECTION_STRING;

  const client = await MongoClient.connect(dbConnectionString!);
  const dbName =
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_NAME // if it is - set it to dev
      : process.env.NODE_ENV // if not - it the env variable set?
      ? process.env.DATABASE_NAME_TEST // if so it must be test
      : process.env.DATABASE_NAME; // if not - it's dev database

  const db = client.db(dbName);

  //if are connecting to the dev database
  if (dbName === process.env.DATABASE_NAME) {
    const currentCollections = await db.listCollections().toArray();

    const usersCollection = currentCollections.find(
      (collection) => collection.name === "Users"
    );
    const thoughtsCollection = currentCollections.find(
      (collection) => collection.name === "Thoughts"
    );

    if (!usersCollection) {
      await db.createCollection("Users", {
        validator: {
          userValidationSchema,
        },
      });
    }
    if (!thoughtsCollection) {
      await db.createCollection("Thoughts", {
        validator: {
          thoughtValidationSchema,
        },
      });
    }
  }

  return { db, client };
}

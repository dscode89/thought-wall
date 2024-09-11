import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

export default async function createDatabaseConnection() {
  const dbConnectionString = process.env.NODE_ENV
    ? process.env.CONNECTION_STRING_TEST
    : process.env.CONNECTION_STRING;

  const client = await MongoClient.connect(dbConnectionString!);
  const dbName = process.env.NODE_ENV
    ? process.env.DATABASE_NAME_TEST
    : process.env.DATABASE_NAME;

  const db = client.db(dbName);

  return { db, client };
}

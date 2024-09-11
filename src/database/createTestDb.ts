import { MongoClient } from "mongodb";
import { config } from "dotenv";

config(); // read environment variables

export default async function createLocalTestDatabase() {
  try {
    const client = await MongoClient.connect(
      process.env.CONNECTION_STRING_TEST!
    );
    const db = client.db(process.env.DATABASE_NAME_TEST);

    await db.createCollection("Users");
    await db.createCollection("Thoughts");

    return { db, client };
  } catch (error) {
    console.error(error);
  }
}


// createLocalTestDatabase();

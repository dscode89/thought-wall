import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";

config(); // read environment variables

export default async function createDevCollections() {
  try {
    const client = await MongoClient.connect(process.env.CONNECTION_STRING!, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    const db = client.db(process.env.DATABASE_NAME);

    await db.createCollection("Users");
    await db.createCollection("Thoughts");

    return { db, client };
  } catch (error) {
    console.error(error);
  }
}

createDevCollections();

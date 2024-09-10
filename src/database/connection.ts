import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";

config(); // load environment variables

function createDatabaseConnection() {
  const connectionString = process.env.CONNECTION_STRING;

  const client = new MongoClient(connectionString!, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  client.connect();
  const db = client.db("thought-wall");
  return db;
}

let database: Db = createDatabaseConnection()

export default database;

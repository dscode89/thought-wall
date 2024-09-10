import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";

const ENV: string = process.env.NODE_ENV || "dev";

config({ path: __dirname + `/../../.env.${ENV}` }); // load environment variables

const connectionString = process.env.CONNECTION_STRING;

const client = new MongoClient(connectionString!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

function createDatabaseConnection() {
  client.connect();
  const db = client.db(process.env.DATABASE_NAME);
  return db;
}

let database: Db = createDatabaseConnection();

export default {
  database,
  client,
};

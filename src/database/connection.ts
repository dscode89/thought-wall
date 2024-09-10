import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";

config(); // load environment variables
const connectionString = process.env.CONNECTION_STRING;
//make a client and that will make the connection to the mongo db database
const client = new MongoClient(connectionString!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function testConnection() {
  try {
    // connect the client to the server
    await client.connect();
    //send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "pinged your deployment, you successfully connected to MongoDb!"
    );
  } finally {
    // ensure that the client will close when you finish/error
    await client.close();
  }
}

testConnection().catch(console.dir);

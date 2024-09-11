import dbInfo from "./createTestDb";
import thoughts from "../database/test-data/thoughts";
import users from "../database/test-data/users";

async function seedTestdatabase() {
  const localDatabaseInfo = await dbInfo();
  const localDatabase = localDatabaseInfo?.db;
  //delete all current test documents in collections
  await localDatabase?.collection("Users").deleteMany({});
  await localDatabase?.collection("Thoughts").deleteMany({});

  //insert test documents in collections
  await localDatabase?.collection("Users").insertMany(users);
  await localDatabase?.collection("Thoughts").insertMany(thoughts);
}

export default seedTestdatabase;

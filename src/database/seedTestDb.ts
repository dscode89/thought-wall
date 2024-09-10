import dbInfo from "../database/connection";
import thoughts from "../database/test-data/thoughts";
import users from "../database/test-data/users";

async function seedTestdatabase() {
  //delete all current test documents in collections
  await dbInfo.database.collection("Users").deleteMany({});
  await dbInfo.database.collection("Thoughts").deleteMany({});

  //insert test documents in collections
  await dbInfo.database.collection("Users").insertMany(users);
  await dbInfo.database.collection("Thoughts").insertMany(thoughts);
}

export default seedTestdatabase;

import app from "./src/app";
import createDatabaseConnection from "./src/database/createDatabaseConnection";

createDatabaseConnection()
  .then((mongoDb) => {
    const { db } = mongoDb;
    app.set("mongoDb", db);
  })
  .then(() => {
    app.listen(9090, () => {
      console.log("listening on PORT 9090");
    });
  });

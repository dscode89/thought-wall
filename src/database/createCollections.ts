import db from "./connection";

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  preferredName: string;
  role: "ADMIN" | "USER";
  userPassword: string;
}

interface Thoughts {
  thoughtId: string;
  thoughtMessage: string;
  category: "HOME" | "BILLS" | "GENERAL";
  isPriority: boolean;
  role: string;
}

async function createCollections() {
  try {
    await db.createCollection<User>("Users");
    console.log("Successfully created a Users Collection");

    await db.createCollection<Thoughts>("Thoughts");
    console.log("Successfully created a Thoughts Collection");
  } catch (error) {
    console.error(error);
  }
}

createCollections().then(() => {
  console.log("Successfully Created User and Thoughts collections");
});

import dbInfo from "../database/dbIndex";
import { User } from "../types/types";

export const fetchUsers = async () => {
  const currentDbInfo = await dbInfo();
  // get the Users collection from chosen database
  const usersCollection = currentDbInfo!.db.collection<User>("Users");
  // this will return a cluster object so use toArray() to give you an array of users
  const currentUsers = await usersCollection.find().toArray();

  return currentUsers;
};

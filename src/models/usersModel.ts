import dbInfo from "../database/connection";
import { User } from "../types/types";

export const fetchUsers = async () => {
  // get the Users collection from chosen database
  const usersCollection = dbInfo.database.collection<User>("Users");
  // this will return a cluster object so use toArray() to give you an array of users
  const currentUsers = await usersCollection.find().toArray();

  return currentUsers;
};

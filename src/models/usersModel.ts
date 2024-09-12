import { Db } from "mongodb";
import { User } from "../types/types";

export const fetchUsers = async (db: Db) => {
  // get the Users collection from chosen database
  const usersCollection = db.collection<User>("Users");
  // this will return a cluster object so use toArray() to give you an array of users
  const currentUsers = await usersCollection.find().toArray();

  return currentUsers;
};

export const createUser = async (db: Db, user: User) => {
  // get the Users collection from chosen database
  const usersCollection = db.collection<User>("Users");
  // this will return a cluster object so use toArray() to give you an array of users
  const { insertedId } = await usersCollection.insertOne(user);
  const newUser = await usersCollection.findOne({ _id: insertedId });

  return newUser;
};

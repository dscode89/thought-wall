import { Db, ObjectId } from "mongodb";
import { User, PatchUserObjType } from "../types/types";
import bcrypt from "bcryptjs";

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
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.userPassword, salt);

  const { insertedId } = await usersCollection.insertOne({
    ...user,
    userPassword: hash,
  });
  const newUser = await usersCollection.findOne({ _id: insertedId });

  return newUser;
};

export const removeUser = async (db: Db, id: string) => {
  const usersCollection = db.collection<User>("Users");
  await usersCollection.deleteOne({
    _id: new ObjectId(id),
  });
};

export const amendUserDetails = async (
  db: Db,
  id: string,
  updateDetails: PatchUserObjType
) => {
  if (updateDetails.userPassword) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(updateDetails.userPassword, salt);
    updateDetails.userPassword = hash;
  }
  const usersCollection = db.collection<User>("Users");
  const updatedUser = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updateDetails } },
    { returnDocument: "after" }
  );

  return updatedUser;
};

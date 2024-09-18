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

export const fetchUserByUserId = async (db: Db, id: string) => {
  const usersCollection = db.collection<User>("Users");
  const requestedUser = await usersCollection.findOne({
    _id: new ObjectId(id),
  });

  if (requestedUser === null) {
    return Promise.reject({ status: 404, errorMsg: "404 - invalid user id" });
  }
  return requestedUser;
};

export const createUser = async (db: Db, user: User) => {
  const userRoleWhiteList = ["ADMIN", "USER"];

  if (!userRoleWhiteList.includes(user.role) || !user.userPassword) {
    return Promise.reject({
      status: 400,
      errorMsg:
        "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
    });
  }

  const validFirstName = /^[a-zA-Z'\s]{1,12}$/.test(user.firstName);
  const validLastName = /^[a-zA-Z'\s]{1,12}$/.test(user.lastName);
  const validPreferredName = /^[a-zA-Z'\s]{1,12}$/.test(user.preferredName);
  const validPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@£$%^&\*()])[A-Za-z\d!@£$%^&\*()]{8,}$/.test(
      user.userPassword
    );
  const validEmail = /^[a-zA-Z0-9_\.±]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(
    user.email!
  );

  if (
    !validFirstName ||
    !validLastName ||
    !validPreferredName ||
    !validPassword ||
    !validEmail
  ) {
    return Promise.reject({
      status: 400,
      errorMsg:
        "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
    });
  }

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
  const { deletedCount } = await usersCollection.deleteOne({
    _id: new ObjectId(id),
  });

  if (!deletedCount) {
    return Promise.reject({ status: 404, errorMsg: "404 - invalid user id" });
  }
};

export const amendUserDetails = async (
  db: Db,
  id: string,
  updateDetails: PatchUserObjType
) => {
  if (!Object.keys(updateDetails).length) {
    return Promise.reject({
      status: 400,
      errorMsg:
        "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
    });
  }

  if (updateDetails._id) {
    return Promise.reject({
      status: 400,
      errorMsg: "400 - cannot change this property",
    });
  }

  if (Object.keys(updateDetails).includes("role")) {
    const userRoleWhiteList = ["ADMIN", "USER"];

    if (!userRoleWhiteList.includes(updateDetails.role!)) {
      return Promise.reject({
        status: 400,
        errorMsg:
          "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
      });
    }
  }

  if (Object.keys(updateDetails).includes("userPassword")) {
    const validPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d!@£$%^&*()]{8,}$/.test(
        updateDetails.userPassword!
      );
    if (!validPassword) {
      return Promise.reject({
        status: 400,
        errorMsg:
          "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
      });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(updateDetails.userPassword!, salt);
      updateDetails.userPassword = hash;
    }
  }

  if (Object.keys(updateDetails).includes("email")) {
    const validEmail = /^[a-zA-Z0-9_\.±]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(
      updateDetails.email!
    );

    if (!validEmail) {
      return Promise.reject({
        status: 400,
        errorMsg:
          "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
      });
    }
  }

  // if (updateDetails.userPassword) {
  //   const salt = bcrypt.genSaltSync(10);
  //   const hash = bcrypt.hashSync(updateDetails.userPassword, salt);
  //   updateDetails.userPassword = hash;
  // }
  const usersCollection = db.collection<User>("Users");
  const updatedUser = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updateDetails } },
    { returnDocument: "after" }
  );

  if (updatedUser === null) {
    return Promise.reject({ status: 404, errorMsg: "404 - invalid user id" });
  }
  return updatedUser;
};

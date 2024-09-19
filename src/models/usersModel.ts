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
  const validFirstName = /^(?=.*[a-zA-Z])[a-zA-Z\s']{1,12}$/.test(
    user.firstName
  );
  const validLastName = /^(?=.*[a-zA-Z])[a-zA-Z\s']{1,12}$/.test(user.lastName);
  const validPreferredName = /^(?=.*[a-zA-Z])[a-zA-Z\s']{1,12}$/.test(
    user.preferredName
  );
  const validPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@£$%^&\*()])[A-Za-z\d!@£$%^&\*()]{8,}$/.test(
      user.userPassword
    );
  const validEmail = /^[a-zA-Z0-9_\.±]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(
    user.email!
  );
  const validRole = /^(ADMIN|USER)$/.test(user.role);

  if (
    !validFirstName ||
    !validLastName ||
    !validPreferredName ||
    !validPassword ||
    !validEmail ||
    !validRole
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
      errorMsg: "400 - this property can not be changed",
    });
  }

  let validFirstName = true;
  let validLastName = true;
  let validPreferredName = true;
  let validPassword = true;
  let validEmail = true;
  let validRole = true;

  if (updateDetails.firstName || updateDetails.firstName === "") {
    validFirstName = /^(?=.*[a-zA-Z])[a-zA-Z\s']{1,12}$/.test(
      updateDetails.firstName
    );
  }
  if (updateDetails.lastName || updateDetails.lastName === "") {
    validLastName = /^(?=.*[a-zA-Z])[a-zA-Z\s']{1,12}$/.test(
      updateDetails.lastName
    );
  }
  if (updateDetails.preferredName || updateDetails.preferredName === "") {
    validPreferredName = /^(?=.*[a-zA-Z])[a-zA-Z\s']{1,12}$/.test(
      updateDetails.preferredName
    );
  }
  if (updateDetails.role || updateDetails.role === "") {
    validRole = /^(ADMIN|USER)$/.test(updateDetails.role);
  }
  if (updateDetails.userPassword || updateDetails.userPassword === "") {
    validPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@£$%^&\*()])[A-Za-z\d!@£$%^&\*()]{8,}$/.test(
        updateDetails.userPassword
      );
  }
  if (updateDetails.email || updateDetails.email === "") {
    validEmail = /^[a-zA-Z0-9_\.±]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
      updateDetails.email
    );
  }

  if (
    !validFirstName ||
    !validLastName ||
    !validPreferredName ||
    !validRole ||
    !validPassword ||
    !validEmail
  ) {
    return Promise.reject({
      status: 400,
      errorMsg:
        "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
    });
  }

  if (Object.keys(updateDetails).includes("userPassword")) {
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

  const usersCollection = db.collection<User>("Users");
  const updatedUser = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updateDetails } },
    { returnDocument: "after" }
  );

  if (updatedUser === null) {
    return Promise.reject({
      status: 404,
      errorMsg: "404 - userId could not be found",
    });
  }
  return updatedUser;
};

import { Db, ObjectId } from "mongodb";
import { Thought, PatchThoughtObjType } from "../types/types";
import { fetchUserByUserId } from "./usersModel";

export const fetchThoughts = async (db: Db) => {
  const thoughtsCollection = db.collection<Thought>("Thoughts");
  const currentThoughts = await thoughtsCollection.find().toArray();

  return currentThoughts;
};

export const fetchThoughtById = async (db: Db, id: string) => {
  const thoughtsCollection = db.collection<Thought>("Thoughts");
  const requestedThought = await thoughtsCollection.findOne({
    _id: new ObjectId(id),
  });

  if (requestedThought === null) {
    return Promise.reject({
      status: 404,
      errorMsg: "404 - invalid thought id",
    });
  }
  return requestedThought;
};

export const fetchThoughtsByUserId = async (db: Db, id: string) => {
  const thoughtsCollection = db.collection<Thought>("Thoughts");
  const requestedThoughts = await thoughtsCollection
    .find({ userId: new ObjectId(id) })
    .toArray();

  if (!requestedThoughts.length) {
    await fetchUserByUserId(db, id);
  }
  return requestedThoughts;
};

export const createThought = async (db: Db, thought: Thought) => {
  const validThoughtMessage = /(?=.*[a-zA-Z]).{10,}$/.test(
    thought.thoughtMessage
  );
  const validCategory = /^(BILLS|HOME|GENERAL)/.test(thought.category);

  if (!validThoughtMessage || !validCategory) {
    return Promise.reject({
      status: 400,
      errorMsg:
        "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
    });
  }

  const thoughtsCollection = db.collection<Thought>("Thoughts");
  const { insertedId } = await thoughtsCollection.insertOne(thought);
  const newThought = await thoughtsCollection.findOne({ _id: insertedId });

  return newThought;
};

export const removeThoughtById = async (db: Db, id: string) => {
  const thoughtsCollection = db.collection<Thought>("Thoughts");
  const { deletedCount } = await thoughtsCollection.deleteOne({
    _id: new ObjectId(id),
  });

  if (!deletedCount) {
    return Promise.reject({
      status: 404,
      errorMsg: "404 - invalid thought id",
    });
  }
};

export const removeThoughtsByUserId = async (db: Db, id: string) => {
  const thoughtsCollection = db.collection<Thought>("Thoughts");
  const { deletedCount } = await thoughtsCollection.deleteMany({
    userId: new ObjectId(id),
  });

  if (!deletedCount) {
    try {
      await fetchUserByUserId(db, id);
    } catch (error) {
      if (error) {
        return Promise.reject(error);
      }
    }
  }
};

export const amendThoughtDetails = async (
  db: Db,
  id: string,
  updateDetails: PatchThoughtObjType
) => {
  if (!Object.keys(updateDetails).length) {
    return Promise.reject({
      status: 400,
      errorMsg:
        "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
    });
  }

  let validThoughtMessage = true;
  let validCategory = true;

  if (updateDetails.thoughtMessage || updateDetails.thoughtMessage === "") {
    validThoughtMessage = /(?=.*[a-zA-Z]).{10,}$/.test(
      updateDetails.thoughtMessage
    );
  }

  if (updateDetails.category || updateDetails.category === "") {
    validCategory = /^(BILLS|HOME|GENERAL)/.test(updateDetails.category);
  }

  if (!validThoughtMessage || !validCategory) {
    return Promise.reject({
      status: 400,
      errorMsg:
        "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
    });
  }

  if (updateDetails.userId || updateDetails._id) {
    return Promise.reject({
      status: 400,
      errorMsg: "400 - cannot change this property",
    });
  }

  const thoughtsCollection = db.collection<Thought>("Thoughts");
  const updatedThought = await thoughtsCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updateDetails } },
    { returnDocument: "after" }
  );

  if (updatedThought === null) {
    return Promise.reject({
      status: 404,
      errorMsg: "404 - thoughtId could not be found",
    });
  }
  return updatedThought;
};

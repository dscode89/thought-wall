import { Db, ObjectId } from "mongodb";
import { Thought } from "../types/types";

export const fetchThoughts = async (db: Db) => {
  const thoughtsCollection = db.collection<Thought>("Thoughts");
  const currentThoughts = await thoughtsCollection.find().toArray();

  return currentThoughts;
};

export const createThought = async (db: Db, thought: Thought) => {
  const thoughtsCollection = db.collection<Thought>("Thoughts");
  const { insertedId } = await thoughtsCollection.insertOne(thought);
  const newThought = await thoughtsCollection.findOne({ _id: insertedId });

  return newThought;
};

export const removeThought = async (db: Db, id: string) => {
  const thoughtsCollection = db.collection<Thought>("Thoughts");
  await thoughtsCollection.deleteOne({
    _id: new ObjectId(id),
  });
};

export const removeThoughtsByUserId = async (db: Db, id: string) => {
  const thoughtsCollection = db.collection<Thought>("Thoughts");
  await thoughtsCollection.deleteMany({
    _userId: new ObjectId(id),
  });
};

import { Db } from "mongodb";
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

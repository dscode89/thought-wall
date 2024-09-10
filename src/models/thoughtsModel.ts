import dbInfo from "../database/connection";
import { Thought } from "../types/types";

export const fetchThoughts = async () => {
  // get the Thoughts collection from chosen database
  const thoughtsCollection = dbInfo.database.collection<Thought>("Thoughts");
  // this will return a cluster object so use toArray() to give you an array of thoughts
  const currentThoughts = await thoughtsCollection.find().toArray();

  return currentThoughts;
};

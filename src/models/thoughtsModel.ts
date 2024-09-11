import dbInfo from "../database/dbIndex";
import { Thought } from "../types/types";

export const fetchThoughts = async () => {
  const currentDbInfo = await dbInfo();
  // get the Thoughts collection from chosen database
  const thoughtsCollection = currentDbInfo!.db.collection<Thought>("Thoughts");
  // this will return a cluster object so use toArray() to give you an array of thoughts
  const currentThoughts = await thoughtsCollection.find().toArray();

  return currentThoughts;
};

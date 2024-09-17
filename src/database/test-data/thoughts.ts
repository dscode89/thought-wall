import { generateHexString } from "../utils/utils";
import { ObjectId } from "mongodb";

/*
 - random 24 char hex string is generate for testing purposes
 - this will be updated when seeding the database with test data to reflect two users actually in the database upon insertion. 
 - done for TS purposes.
*/
export default [
  {
    userId: new ObjectId(generateHexString(24)),
    thoughtMessage: "Need to fix the leaking sink in the kitchen.",
    category: "HOME",
    isPriority: true,
  },
  {
    userId: new ObjectId(generateHexString(24)),
    thoughtMessage: "Pay the electricity bill by next Monday.",
    category: "BILLS",
    isPriority: true,
  },
  {
    userId: new ObjectId(generateHexString(24)),
    thoughtMessage: "Buy groceries for the week.",
    category: "GENERAL",
    isPriority: true,
  },
  {
    userId: new ObjectId(generateHexString(24)),
    thoughtMessage: "Schedule the internet service upgrade.",
    category: "BILLS",
    isPriority: true,
  },
  {
    userId: new ObjectId(generateHexString(24)),
    thoughtMessage: "Clean the garage this weekend.",
    category: "HOME",
    isPriority: true,
  },
  {
    userId: new ObjectId(generateHexString(24)),
    thoughtMessage: "Call the bank about mortgage adjustments.",
    category: "GENERAL",
    isPriority: true,
  },
];

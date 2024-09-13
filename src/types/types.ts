import { ObjectId } from "mongodb";

export interface User {
  firstName: string;
  lastName: string;
  preferredName: string;
  role: "ADMIN" | "USER";
  userPassword: string;
  email: string;
}

export interface Thought {
  _userId: ObjectId;
  thoughtMessage: string;
  category: "HOME" | "BILLS" | "GENERAL";
  isPriority: boolean;
}

export interface PatchObjType {
  thoughtMessage?: string;
  isPriority?: boolean;
  category?: "BILLS" | "GENERAL" | "HOME";
}

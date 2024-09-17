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
  userId: ObjectId;
  thoughtMessage: string;
  category: "HOME" | "BILLS" | "GENERAL";
  isPriority: boolean;
}

export interface PatchThoughtObjType {
  thoughtMessage?: string;
  isPriority?: boolean;
  category?: "BILLS" | "GENERAL" | "HOME";
  userId?: ObjectId;
  _id?: ObjectId;
}

export interface PatchUserObjType {
  firstName?: string;
  lastName?: string;
  preferredName?: string;
  role?: "ADMIN" | "USER";
  userPassword?: string;
  email?: string;
  _id: ObjectId;
}

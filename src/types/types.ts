import { NextFunction } from "express";
import { Db } from "mongodb";

export interface User {
  firstName: string;
  lastName: string;
  preferredName: string;
  role: "ADMIN" | "USER";
  userPassword: string;
  email: string;
}

export interface Thought {
  thoughtMessage: string;
  category: "HOME" | "BILLS" | "GENERAL";
  isPriority: boolean;
}

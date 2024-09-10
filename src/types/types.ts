export interface User {
  firstName: string;
  lastName: string;
  preferredName: string;
  role: "ADMIN" | "USER";
  userPassword: string;
  email: string;
}

export interface Thoughts {
  thoughtId: string;
  thoughtMessage: string;
  category: "HOME" | "BILLS" | "GENERAL";
  isPriority: boolean;
}

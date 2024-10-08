import bcrypt from "bcryptjs";

const users = [
  {
    firstName: "John",
    lastName: "Doe",
    preferredName: "Johnny",
    role: "ADMIN",
    userPassword: "password123",
    email: "ham@cheese.com",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    preferredName: "Janey",
    role: "USER",
    userPassword: "securepass456",
    email: "egg@cheese.com",
  },
  {
    firstName: "Michael",
    lastName: "Johnson",
    preferredName: "Mike",
    role: "USER",
    userPassword: "mikepass789",
    email: "spam@cheese.com",
  },
  {
    firstName: "Emily",
    lastName: "Brown",
    preferredName: "Em",
    role: "ADMIN",
    userPassword: "adminpass101",
    email: "glam@cheese.com",
  },
  {
    firstName: "David",
    lastName: "Wilson",
    preferredName: "Dave",
    role: "USER",
    userPassword: "davidsecure987",
    email: "pam@cheese.com",
  },
];

users.forEach((user) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.userPassword, salt);
  user.userPassword = hash;
});

export default users;

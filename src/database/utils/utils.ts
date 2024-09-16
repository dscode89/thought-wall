import { User } from "../../types/types";

type generateHexStringType = (length: number) => string;

export const generateHexString: generateHexStringType = (length = 24) => {
  const hexChars = "0123456789ABCDEF";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += hexChars[Math.floor(Math.random() * hexChars.length)];
  }

  return result;
};

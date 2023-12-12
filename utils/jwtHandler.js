import jwt from "jsonwebtoken";
import { get_env } from "./index.js";

const generateJwtToken = (data, options = {}) => {
  const JWT_SECRET_FOR_AUTH = get_env("JWT_SECRET_FOR_AUTH");
  const token = jwt.sign(data, JWT_SECRET_FOR_AUTH, options);
  return token;
};

const validateJwtToken = (token) => {
  try {
    const JWT_SECRET_FOR_AUTH = get_env("JWT_SECRET_FOR_AUTH");
    var decoded = jwt.verify(token, JWT_SECRET_FOR_AUTH);
    return decoded;
  } catch (err) {
    // err
    console.log("jwt verify error", err, token);
    return null;
  }
};

export { generateJwtToken, validateJwtToken };

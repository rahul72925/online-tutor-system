import bcrypt, { hash } from "bcrypt";

const saltRounds = 10;
const generateHash = async (myPlaintextPassword) => {
  const hash = await bcrypt.hash(myPlaintextPassword, saltRounds);
  return hash;
};

const validateHash = async (myPlaintextPassword, hash) => {
  const isValid = await bcrypt.compare(myPlaintextPassword, hash);
  return isValid;
};

export { validateHash, generateHash };

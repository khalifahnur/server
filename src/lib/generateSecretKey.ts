import { randomBytes } from "crypto";

const generateSecretKey = (): string => {
  return randomBytes(32).toString("hex");
};

export default generateSecretKey;
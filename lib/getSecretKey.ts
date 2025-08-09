import Redis from "ioredis";
import generateSecretKey from "./GenerateSecretKey";

const redis = new Redis();

const getSecretKey = async (userId:string) => {
  const SECRET_KEY_REDIS_KEY = `user:${userId}:jwt_secret`;
  let secretKey = await redis.get(SECRET_KEY_REDIS_KEY);

  if (!secretKey) {
    secretKey = generateSecretKey();
    await redis.set(SECRET_KEY_REDIS_KEY, secretKey);
  }

  return secretKey;
};

export default getSecretKey;

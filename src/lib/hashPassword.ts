import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hashed = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
}

export function verifyPassword(storedPassword: string, suppliedPassword: string): boolean {
    const [salt, hashedPassword] = storedPassword.split(":");
    const hashedBuffer = Buffer.from(hashedPassword, "hex");
    const suppliedBuffer = scryptSync(suppliedPassword, salt, 64);
  
    // Use timingSafeEqual to prevent timing attacks
    return timingSafeEqual(hashedBuffer, suppliedBuffer);
  }
  
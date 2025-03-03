import GenerateSecretKey from './GenerateSecretKey';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env variables initially
console.log("Loading .env variables...");
dotenv.config();

const envPath = path.resolve(process.cwd(), '.env');
let secretKey = process.env.JWT_SECRET_KEY;

console.log(`Initial secretKey: ${secretKey}`);

if (!secretKey) {
  secretKey = GenerateSecretKey();
  console.log("Generated Secret Key:", secretKey);

  // Check if the .env file exists and is accessible
  if (!fs.existsSync(envPath)) {
    // If .env file doesn't exist, create it
    try {
      fs.writeFileSync(envPath, `JWT_SECRET_KEY=${secretKey}\n`);
      console.log(`.env file created with JWT_SECRET_KEY at root: ${envPath}`);
    } catch (error) {
      console.error("Error creating .env file:", error);
    }
  } else {
    // Append to existing .env if key is not already set
    try {
      const envFileContent = fs.readFileSync(envPath, 'utf-8');

      if (!envFileContent.includes('JWT_SECRET_KEY=')) {
        fs.appendFileSync(envPath, `JWT_SECRET_KEY=${secretKey}\n`);
        console.log(`JWT_SECRET_KEY added to existing .env at root: ${envPath}`);
      } else {
        console.log("JWT_SECRET_KEY already exists in .env file.");
      }
    } catch (error) {
      console.error("Error updating .env file:", error);
    }
  }
} else {
  console.log("JWT_SECRET_KEY is already set in environment variables.");
}

// Refresh dotenv to pick up the new secret key (if it was written)
dotenv.config();
console.log("JWT_SECRET_KEY from dotenv:", process.env.JWT_SECRET_KEY);

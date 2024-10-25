import dotenv from "dotenv";
const jwt = require("jsonwebtoken");
dotenv.config();

export async function verifyToken(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { result: null };
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.MY_SECRET_CODE);
    return { result: true, decoded };
  } catch (error) {
    console.log(`Jwt Error: ${error.message}`);
    return { result: false };
  }
}

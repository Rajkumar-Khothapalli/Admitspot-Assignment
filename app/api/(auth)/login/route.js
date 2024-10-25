import { NextResponse } from "next/server";
import { retriveUser } from "@/sqlQueries/userAuth";
import bcrypt from "bcrypt";
import Joi from "joi";
import dotenv from "dotenv";
dotenv.config();
const jwt = require("jsonwebtoken");

//Joi schema for login validation
const loginSchema = Joi.object({
  identifier: Joi.string().min(3).required(), // can be username or email
  password: Joi.string().min(8).required(),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    // Validate login data using Joi
    const { error } = loginSchema.validate({ identifier, password });
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    // Query to check if the user exists
    const retrievedUser = await retriveUser(identifier, identifier);

    if (retrievedUser) {
      // Compare password with the hashed password
      const isPasswordMatched = await bcrypt.compare(
        password,
        retrievedUser.password
      );

      // If password matches, return the JWT token
      if (isPasswordMatched) {
        const payload = {
          username: retrievedUser.username,
          email: retrievedUser.email,
        };
        const jwtToken = jwt.sign(payload, process.env.MY_SECRET_CODE);
        return NextResponse.json({
          message: "Login Success!",
          jwtToken,
          status: 200,
        });
      } else {
        return NextResponse.json({
          message: "Incorrect password!",
          status: 401,
        });
      }
    } else {
      return NextResponse.json({ message: "User not found!", status: 404 });
    }
  } catch (error) {
    console.log(`Login Error: ${error.message}`);
    return NextResponse.json({ message: "Something went wrong!", status: 500 });
  }
}

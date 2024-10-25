import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { retriveUser, createUser } from "@/sqlQueries/userAuth";
import userSchema from "@/joi-validations/data-valiadtion-signup";

export async function POST(req) {
  try {
    const { username, name, email, password, gender } = await req.json();

    //// Validate request data using Joi
    const { error } = userSchema.validate({
      username,
      name,
      email,
      password,
      gender,
    });

    if (error) {
      return NextResponse.json({ message: error.details[0].message });
    }

    //checking for existing user in the database
    const existingUser = await retriveUser(username, email);

    //Determine the appropriate response based on the existingUser result
    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json({ message: "Username already exists!" });
      } else if (existingUser.email === email) {
        return NextResponse.json({ message: "Email already exists!" });
      }
    }

    //Hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user in the database
    const newUserRes = await createUser(
      username,
      name,
      email,
      hashedPassword,
      gender
    );

    return NextResponse.json({
      message: "User created successfully",
      userId: newUserRes.lastID,
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return NextResponse.json({
      error: "An error occurred while creating the user.",
    });
  }
}

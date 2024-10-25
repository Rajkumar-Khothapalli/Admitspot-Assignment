import { NextResponse } from "next/server";
import contactSchema from "@/joi-validations/contact-validation";
import {
  createContact,
  retriveContacsUser,
  retriveContacts,
} from "@/sqlQueries/contact";
import { verifyToken } from "@/middlewares/verify-jwt-token";

export async function POST(req) {
  try {
    //if headers are null
    const verificationResult = await verifyToken(req);
    if (verificationResult.result === null) {
      return NextResponse.json(
        { message: "Authorization token is required!" },
        { status: 401 }
      );
    }

    //If Jwt token veried TRUE
    if (verificationResult.result === true) {
      const { userId, name, email, phoneNumber, address } = await req.json();

      //Validate request data using Joi
      const { error } = contactSchema.validate({
        userId,
        name,
        email,
        phoneNumber,
        address,
      });

      if (error) {
        return NextResponse.json({ message: error.details[0].message });
      }

      //check if user exists in the users table
      const existingUser = await retriveContacsUser(userId);
      console.log(existingUser);
      if (existingUser === undefined) {
        return NextResponse.json(
          { message: "User does not exits!" },
          { status: 404 }
        );
      }

      //check if existing contact in the database
      const existingContact = await retriveContacts(userId);

      //Determine the appropriate response based on the existing Contact result
      if (existingContact) {
        for (const contact of existingContact) {
          if (contact.email === email) {
            return NextResponse.json({
              message: "contact email already exists!",
              status: 409,
            });
          } else if (contact.phone_number === phoneNumber) {
            return NextResponse.json({
              message: "phone number already exists!",
              status: 409,
            });
          }
        }
      }

      const newContact = await createContact(
        userId,
        name,
        email,
        phoneNumber,
        address
      );

      return NextResponse.json({
        message: "Contact created successfully!",
        userId: newContact.insertId,
      });
    } else if (verificationResult.result === false) {
      return NextResponse.json(
        { message: "Invalid or expired token!" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating contacts!",
      },
      { status: 403 }
    );
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return NextResponse.json({
      error: "An error occurred while creating the contact.",
    });
  }
}

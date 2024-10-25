import contactUpdateSchema from "@/joi-validations/contact-update-validation";
import { retriveContactById, updateContact } from "@/sqlQueries/contact";
import { NextResponse } from "next/server";
import { verifyToken } from "@/middlewares/verify-jwt-token";

export async function PUT(req) {
  try {
    //if headers are null
    const verificationResult = await verifyToken(req);
    if (verificationResult.result === null) {
      return NextResponse.json(
        { message: "Authorization token is required!" },
        { status: 401 }
      );
    }

    if (verificationResult.result === true) {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
      const contactId = searchParams.get("contactId");
      const body = await req.json();

      //check if the body is an empty object
      if (Object.keys(body).length === 0) {
        return NextResponse.json(
          { message: "json object body is empty!" },
          { status: 404 }
        );
      }

      const { name, email, phoneNumber, address, timezone, isDeleted } = body;

      //if userId and contactId is undifined return error response
      if (!userId || !contactId) {
        return NextResponse.json(
          { message: "user and contact ID is required!" },
          { status: 400 }
        );
      }

      const existingContact = await retriveContactById(userId, contactId);

      //If the contact is undifined with specific userId and contactId return error
      if (existingContact === undefined) {
        return NextResponse.json(
          { message: "User ID or Contact ID do not exist." },
          { status: 404 }
        );
      }

      //If there are any undifined values we are keeping its default value
      const defaultName = name || existingContact.name;
      const defaultEmail = email || existingContact.email;
      const defaultphoneNumber = phoneNumber || existingContact.phone_number;
      const defaultAddress = address || existingContact.address;
      const defaultTimezone = timezone || existingContact.timezone;
      const defaultDelete = isDeleted || existingContact.is_deleted;

      //Validate Update request data using Joi
      const { error } = contactUpdateSchema.validate({
        defaultName,
        defaultEmail,
        defaultphoneNumber,
        defaultAddress,
        defaultTimezone,
      });

      if (error) {
        return NextResponse.json({ message: error.details[0].message });
      }

      //After data validations we are updating the contact
      const contactUpdated = await updateContact(
        userId,
        contactId,
        defaultName,
        defaultEmail,
        defaultphoneNumber,
        defaultAddress,
        defaultTimezone,
        defaultDelete
      );
      return NextResponse.json({
        success: true,
        message: `contact details updates successfully!`,
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
        message: "Something went wrong while updating contacts!",
      },
      { status: 403 }
    );
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again.",
    });
  }
}

import { deleteContact, retriveContactById } from "@/sqlQueries/contact";
import { NextResponse } from "next/server";
import { verifyToken } from "@/middlewares/verify-jwt-token";

export async function DELETE(req) {
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

      if (!userId || !contactId) {
        return NextResponse.json(
          { message: "user and contact ID is required!" },
          { status: 400 }
        );
      }

      const existingUserAndContact = await retriveContactById(
        userId,
        contactId
      );
      if (existingUserAndContact === undefined) {
        return NextResponse.json(
          { message: "User ID or Contact ID do not exist." },
          { status: 404 }
        );
      }
      await deleteContact(userId, contactId);
      return NextResponse.json({
        succes: true,
        message: "Contact deleted succesfully!",
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
        message: "Something went wrong deleting contact!",
      },
      { status: 403 }
    );
  } catch (error) {
    console.log(`Error : ${error.message}`);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again.",
    });
  }
}

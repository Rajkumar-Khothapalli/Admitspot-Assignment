import { retriveContacts } from "@/sqlQueries/contact";
import { NextResponse } from "next/server";
import { verifyToken } from "@/middlewares/verify-jwt-token";

export async function GET(req) {
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

      if (!userId) {
        return NextResponse.json(
          { message: "user ID is required!" },
          { status: 400 }
        );
      }

      const existingUserContacts = await retriveContacts(userId);
      if (existingUserContacts.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: `no contacts with userId:${userId} does not exists!`,
          },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "contacts fetched successfully!",
        contacts: existingUserContacts,
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
        message: "Something went wrong while fetching contacts!",
      },
      { status: 403 }
    );
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return NextResponse.json({
      success: false,
      message: "Something went wrong!",
    });
  }
}

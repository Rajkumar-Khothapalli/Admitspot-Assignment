import { NextResponse } from "next/server";
import { fetchContactsFilters } from "@/sqlQueries/contacts-filters";
import { verifyToken } from "@/middlewares/verify-jwt-token";

export async function GET(req) {
  try {
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
      const name = searchParams.get("name");
      const email = searchParams.get("email");
      const timezone = searchParams.get("timezone") || "UTC";
      const convertTimezone = searchParams.get("convertTimezone");
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");

      const contacts = await fetchContactsFilters(
        userId,
        name,
        email,
        timezone,
        convertTimezone,
        startDate,
        endDate
      );

      return NextResponse.json({
        message: "Contacts retrieved successfully!",
        contacts,
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
      { status: 500 }
    );
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return NextResponse.json({
      message: "An error occurred while retrieving the contacts.",
      error: error.message,
    });
  }
}

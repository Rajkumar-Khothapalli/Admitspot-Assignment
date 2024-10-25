import connectToDB from "@/database/database";
import { formatInTimeZone } from "date-fns-tz";

const db = await connectToDB();

export async function fetchContactsFilters(
  userId,
  name,
  email,
  timezone,
  convertTimezone,
  startDate,
  endDate
) {
  let filterQuery = `SELECT * FROM contacts WHERE user_id = ?`;
  let filterArray = [userId];

  if (name) {
    filterQuery += ` AND name = ?`;
    filterArray.push(name);
  }

  if (email) {
    filterQuery += ` AND email = ?`;
    filterArray.push(email);
  }

  if (timezone) {
    filterQuery += ` AND timezone = ?`;
    filterArray.push(timezone);
  }

  // Add date range filtering
  if (startDate && endDate) {
    filterQuery += ` AND created_at BETWEEN ? AND ?`;
    filterArray.push(startDate, endDate);
  }

  const filteredContacts = await db.execute(filterQuery, [...filterArray]);

  if (convertTimezone) {
    const contactsWithTimezone = filteredContacts[0].map((contact) => ({
      ...contact,
      created_at_in_user_timezone: formatInTimeZone(
        contact.created_at,
        convertTimezone,
        "yyyy-MM-dd HH:mm:ssXXX"
      ),
      updated_at_in_user_timezone: formatInTimeZone(
        contact.updated_at,
        convertTimezone,
        "yyyy-MM-dd HH:mm:ssXXX"
      ),
    }));

    return contactsWithTimezone;
  }

  return filteredContacts[0];
}

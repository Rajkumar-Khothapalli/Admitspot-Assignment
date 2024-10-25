import connectToDB from "@/database/database";

const db = await connectToDB();

//Create contact with userId -- add-contact-route
export async function createContact(userId, name, email, phoneNumber, address) {
  const [contact] = await db.execute(
    `INSERT INTO contacts (user_id, name, email, phone_number, address) VALUES (?, ?, ?, ?, ?)`,
    [userId, name, email, phoneNumber, address]
  );
  return contact;
}

//Get user in users table -- add-contact-route
export async function retriveContacsUser(userId) {
  const [user] = await db.execute(`SELECT * FROM users WHERE id=?;`, [userId]);
  return user[0];
}

//Get the user contacts by userId -- add-contact-route
export async function retriveContacts(userId) {
  const [contact] = await db.execute(
    `SELECT * FROM contacts WHERE user_id = ?`,
    [userId]
  );
  return contact;
}

//Upadte the contact  -- update-contact-route
export async function updateContact(
  userId,
  contactId,
  defaultName,
  defaultEmail,
  defaultphoneNumber,
  defaultAddress,
  defaultTimezone,
  defaultDelete
) {
  const updatedContact = await db.execute(
    `UPDATE contacts SET name=?, email=?, phone_number=?, address=?, timezone=?, is_deleted=? WHERE user_id =? AND id=?`,
    [
      defaultName,
      defaultEmail,
      defaultphoneNumber,
      defaultAddress,
      defaultTimezone,
      defaultDelete,
      userId,
      contactId,
    ]
  );
  return retriveContacts(userId, contactId);
}

//Get the contact by Id from database
export async function getContact(id) {
  const contact = await db.execute(`SELECT * FROM contacts WHERE id = ?`, [id]);
  return contact;
}

//Get contacts by user and contact id -- delete-contact & --update-contact
export async function retriveContactById(userId, contactId) {
  const [contact] = await db.execute(
    `SELECT * FROM contacts WHERE user_id=? AND id=?`,
    [userId, contactId]
  );
  return contact[0];
}

//Soft Deletes the contact by updating  with userId & contactId -- delete-contact
export async function deleteContact(userId, contactId) {
  const [softDelContact] = await db.execute(
    `UPDATE contacts SET is_deleted = true WHERE user_id=? AND id=?`,
    [userId, contactId]
  );
  return softDelContact[0];
}

//Gets contacts with filters
export async function retrieveContactsWithFilter(
  name,
  email,
  timezone,
  sortBy,
  sortOrder
) {
  let query = `SELECT * FROM contacts WHERE user_id=1`; // Initial query with always true condition

  const queryParams = [];

  // Append filters if provided
  if (name) {
    query += ` AND name = ?`;
    queryParams.push(name);
  }

  if (email) {
    query += ` AND email = ?`;
    queryParams.push(email);
  }

  if (timezone) {
    query += ` AND timezone = ?`;
    queryParams.push(timezone);
  }

  // Append sorting
  query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
  console.log(query);
  console.log(queryParams);

  // Execute query
  const [rows] = await db.execute(query, queryParams);
  return rows;
}

import connectToDB from "@/database/database";

const db = await connectToDB();

//Check the user in database
export async function retriveUser(username, email) {
  const [user] = await db.execute(
    `SELECT * FROM users WHERE username=? OR email=?`,
    [username, email]
  );
  return user[0];
}

//Create new User in the database
export async function createUser(username, name, email, password, gender) {
  const [newUser] = await db.execute(
    `INSERT INTO users (username, name, email, password, gender) VALUES(?, ?, ?, ?, ?)`,
    [username, name, email, password, gender]
  );
  return newUser;
}

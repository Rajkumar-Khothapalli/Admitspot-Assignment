import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
console.log(process.env.MYSQL_USER);

const connectToDB = async () => {
  try {
    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      port: process.env.MYSQL_PORT,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    console.log("SQL database connection successfull!");
    return db;
  } catch (error) {
    console.log(error.message);
  }
};

connectToDB();

export default connectToDB;

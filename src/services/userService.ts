import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db";

const { JWT_SECRET_KEY } = process.env;

// Interface representing the User object
interface User {
  password(password: string);
  user_id: number;
}

// Interface for defining the SET clauses in the update query
interface SetClause {
  field: string;
  value: string | null;
}

export default class UserService {
  // Generates a JWT token for a given user
  static generateToken(user: User): string {
    return jwt.sign({ userId: user.user_id }, JWT_SECRET_KEY as unknown as string, { expiresIn: "1h" });
  }

  // Creates a new user and stores them in the database
  static async createUser(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );
    return newUser.rows[0];
  }

  // Retrieves a user by their email from the database
  static async getUserByEmail(email: string): Promise<User | null> {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return user.rows[0] || null;
  }

  // Retrieves all users from the database
  static async getAllUsers(): Promise<User[]> {
    const allUsers = await pool.query("SELECT * FROM users");
    return allUsers.rows;
  }

  // Retrieves a user by their ID from the database
  static async getUserById(id: number): Promise<User | null> {
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    return user.rows[0] || null;
  }

  // Updates a user's information in the database
  static async updateUser(
    id: number,
    name: string | null,
    email: string | null,
    password: string | null
  ): Promise<string> {
    const setClauses: SetClause[] = [];
    const values: (string | number | null)[] = [];
    let valueIndex = 1; // Start with 1 for the user_id placeholder
  
    // Construct SET clauses based on provided parameters
    if (name) {
      setClauses.push({ field: "name", value: name });
      values.push(name);
    }
    if (email) {
      setClauses.push({ field: "email", value: email });
      values.push(email);
    }
    if (password) {
      setClauses.push({ field: "password", value: password });
      values.push(password);
    }
  
    // Check for valid parameters to update
    if (setClauses.length === 0) {
      throw new Error("No valid parameters provided for update.");
    }
  
    // Construct and execute the update query
    const setClause = setClauses
      .map((clause) => `${clause.field} = $${valueIndex++}`)
      .join(", ");
  
    values.push(id);
  
    const queryString = `UPDATE users SET ${setClause} WHERE user_id = $${valueIndex++}`;
  
    await pool.query(queryString, values);
    return "User was updated!";
  }
  

  // Deletes a user from the database
  static async deleteUser(id: number): Promise<void> {
    await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
  }
}

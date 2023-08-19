import { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userService from "../services/userService";

const { JWT_SECRET_KEY } = process.env;

// Interfaces for request bodies
interface CreateUserRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

interface LoginUserRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

// Validation schemas
const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Handler to create a new user
const createUser = async (req: CreateUserRequest, res: Response) => {
  try {
    const { error } = createUserSchema.validate(req.body, { abortEarly: false });
    console.log('error', error);

    if (error) {
      // Handle validation errors
      if (error.details) {
        const missingFields = error.details.map(detail => detail.context?.key).filter(Boolean);
        return res.status(400).json({ missingFields: missingFields });
      }
      return res.status(400).json({ message: "Validation error occurred." });
    }

    const { name, email, password } = req.body;

    // Check if user with the same email already exists
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // Hash the password and create the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userService.createUser(name, email, hashedPassword);
    res.json(newUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("An error occurred.");
  }
};

// Handler for user login
const loginUser = async (req: LoginUserRequest, res: Response) => {
  try {
    const { error } = loginUserSchema.validate(req.body);

    if (error) {
      // Handle login validation errors
      const missingFields = error.details.map(detail => detail.context?.key).filter(Boolean);
      return res.status(400).json({ missingFields: missingFields });
    }

    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);

    // Check if user exists and password is correct
    if (!user) {
      return res.status(401).json("Invalid credentials.");
    }

    const passwordMatch = bcrypt.compare(password, user.password as unknown as string);
    if (!passwordMatch) {
      return res.status(401).json("Invalid credentials.");
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET_KEY as unknown as string, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json("An error occurred.");
  }
};

// Handler to get all users
const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const allUsers = await userService.getAllUsers();
    res.json(allUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("An error occurred.");
  }
};

// Handler to get a user by ID
const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(+id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json("User not found.");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json("An error occurred.");
  }
};

// Handler to update a user
const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Validate input
    if (!name && !email && !password) {
      return res.status(400).json("No valid parameters provided for update.");
    }

    const updatedUser = await userService.updateUser(+id, name, email, password);
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("An error occurred.");
  }
};

// Handler to delete a user
const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(+id);
    res.json("User was deleted!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("An error occurred.");
  }
};

// Export the handlers
export {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

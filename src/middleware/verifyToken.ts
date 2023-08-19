import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: { [key: string]: any };
    }
  }
}

const { JWT_SECRET_KEY } = process.env;

// Middleware to verify a JWT token
const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    // If no Authorization header is present, deny access
    return next(new Error('Access denied.'));
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1];
  if (!token) {
    // If no token is present, deny access
    return next(new Error('Access denied.'));
  }

  try {
    // Verify the token and extract its payload
    const decoded = jwt.verify(token, JWT_SECRET_KEY as unknown as string) as { [key: string]: any };
    req.user = decoded; // Attach the decoded payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err.message);
    next(new Error('Invalid token.')); // If token verification fails, deny access
  }
};

export default verifyToken;

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Read token from cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find user in DB (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
         // User was deleted but token still exists
         return res.status(401).json({ message: 'User not found' });
      }

      next(); // Proceed to controller
    } catch (error) {
      console.error("Token verification failed:", error.message);
      // Don't crash (500), just say Unauthorized (401)
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // No token provided
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
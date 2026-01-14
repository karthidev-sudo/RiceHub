import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import { z } from 'zod';

// Zod Schema for Validation
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 chars"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = catchAsync(async (req, res, next) => {
  // 1. Validate Input
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400);
    throw new Error(result.error.errors[0].message);
  }

  const { username, email, password } = result.data;

  // 2. Check existence
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // 3. Create User
  const user = await User.create({ username, email, password });

  // 4. Send Response (Set cookie)
  const token = generateToken(user._id);
  
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // HTTPS only in prod
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

// ... existing register code ...

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // 1. Check if email & password exist
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // 2. Check if user exists & password matches
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // 3. Generate Token and Send Cookie
    const token = generateToken(user._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const checkAuth = (req, res) => {
  // If the request passes the 'protect' middleware, req.user is already attached!
  res.json(req.user);
};
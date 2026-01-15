import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper: Generate Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ FATAL ERROR: JWT_SECRET is missing in .env");
    throw new Error("Server Misconfiguration: Missing Secrets");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ==========================================
// 🟢 REGISTER (Restored)
// ==========================================
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create User (Password hashing happens in User.js model)
    const user = await User.create({ username, email, password });

    // 3. Generate Token
    const token = generateToken(user._id);

    // 4. Send Cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 🟢 LOGIN (Debug Version)
// ==========================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Find User
    const user = await User.findOne({ email });

    // 3. Check Password (uses the method we added to User.js)
    if (user && (await user.matchPassword(password))) {
      
      const token = generateToken(user._id);

      // 4. Set Cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // 5. Send User Data
      return res.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          // Extra fields safely
          distro: user.distro || "Linux",
          wm: user.wm || "Tiling",
        },
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("❌ Login Crash:", error);
    // Send actual error to frontend for debugging
    res.status(500).json({ message: "Login Failed: " + error.message });
  }
};

// ==========================================
// 🟢 LOGOUT
// ==========================================
export const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// ==========================================
// 🟢 CHECK AUTH (Crash Proof)
// ==========================================
export const checkAuth = async (req, res) => {
  try {
    // If middleware didn't find the user, send 401
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // If user exists, send their profile
    res.status(200).json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
      distro: req.user.distro || "Linux",
      wm: req.user.wm || "Tiling",
    });
  } catch (error) {
    console.error("❌ CheckAuth Crash:", error);
    res.status(500).json({ message: "CheckAuth Failed" });
  }
};
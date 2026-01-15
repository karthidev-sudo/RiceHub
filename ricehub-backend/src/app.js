import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import riceRoutes from "./routes/riceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import externalRoutes from './routes/externalRoutes.js';

const rootDir = path.resolve("..");

const app = express();

// Middleware
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // <--- Fixes the "eval" error
      "img-src 'self' data: https://res.cloudinary.com https://avatars.githubusercontent.com https://i.ytimg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", 
      "img-src 'self' data: https://res.cloudinary.com", 
      "font-src 'self' https://fonts.gstatic.com", 
      "connect-src 'self' http://localhost:5000", // <--- Allow both Self (Prod) and Localhost (Dev)
    ].join("; ")
  );
  next();
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Allow cookies
  })
);
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/rices", riceRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use('/api/v1/external', externalRoutes);

// Global Error Handler
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: error.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(rootDir, "ricehub-client", "dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(rootDir, "ricehub-client", "dist", "index.html"));
  });
}

export default app;

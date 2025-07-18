// Import necessary modules
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;
const fs = require("fs");
const path = require("path");

// MySQL session store setup
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  clearExpired: true,
  checkExpirationInterval: 1000 * 60 * 5,
  expiration: 1000 * 60 * 60 * 24, // 1 day
});

// Middleware setup
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy
app.set("trust proxy", 1);

// Session middleware
app.use(
  session({
    name: "oscaims_sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

const userRoutes = require("../route/userRoutes");
const seniorCitizenRoutes = require("../route/seniorCitizenRoutes");
const auditRoutes = require("../route/auditRoutes");
const smsRoute = require("../route/smsRoute");
const templateRoutes = require("../route/templateRoutes");
const officialRoutes = require("../route/officialRoutes");
const barangayRoutes = require("../route/barangayRoutes");
const getUserIp = require("../middleware/getUserIp");

app.use(getUserIp);
app.use("/api/officials", officialRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/user", userRoutes);
app.use("/api/senior-citizens", seniorCitizenRoutes);
app.use("/api/sms", smsRoute);
app.use("/api/templates", templateRoutes);
app.use("/api/barangays", barangayRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server!" });
});

// Session test route
app.get("/api/test-session", (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.send(`Session views: ${req.session.views}`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

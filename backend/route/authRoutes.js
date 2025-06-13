const express = require("express");
const router = express.Router();
const userService = require("../service/userService");
const { isAuthenticated } = require("../middleware/authMiddleware"); // Adjust path

router.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userService.getUser(id); // This should return user data from DB

    if (user) {
      res.status(200).json({
        isAuthenticated: true,
        userId: user.id,
        userName: user.username,
        userEmail: user.email,
        userNumber: user.cp_number,
        userRole: user.role,
        lastLogout: user.last_logout,
      });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users." });
  }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const sessionUser = req.session.user;

  if (!sessionUser) {
    return res.status(401).json({ message: "Unauthorized: Not logged in." });
  }

  try {
    const deleted = await userService.deleteUser(
      id,
      sessionUser.email,
      sessionUser.role
    );

    if (deleted) {
      return res.status(200).json({ message: "User deleted successfully." });
    } else {
      return res
        .status(404)
        .json({ message: "User not found or already deleted." });
    }
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    return res.status(500).json({ message: "Server error during deletion." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.login(email, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      cp_number: user.cp_number,
      role: user.role,
      last_logout: user.last_logout,
    };
    req.session.isAuthenticated = true;

    res.json({ message: "Login successful", user: req.session.user });
    console.log("Session after login:", req.session);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Server error during login.",
      error: err.message,
    });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, cp_number, role } = req.body;
    const result = await userService.register(
      username,
      email,
      password,
      cp_number,
      role
    );

    if (result) {
      res.status(201).json({ message: "Registered successfully" });
    } else {
      res
        .status(400)
        .json({ message: "Registration failed. User might already exist." });
    }
  } catch (err) {
    console.error("Registration error:", err);
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error during registration." });
  }
});

router.put("/updateProfile/:id", async (req, res) => {
  const { username, email, contactNumber } = req.body;
  const { id } = req.params;
  try {
    const success = await userService.updateUserProfile(
      id,
      username,
      email,
      contactNumber
    );
    if (success)
      return res.status(200).json({ message: "Profile updated successfully." });
    return res.status(400).json({ message: "Failed to update profile." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { username, email, password, contactNumber, role } = req.body;
  const { id } = req.params;
  try {
    const success = await userService.updateUserInfo(
      id,
      username,
      email,
      password,
      contactNumber,
      role
    );
    if (success)
      return res.status(200).json({ message: "Profile updated successfully." });
    return res.status(400).json({ message: "Failed to update profile." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Change password
router.put("/change-password/:id", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.params;
  try {
    const success = await userService.changePassword(
      id,
      currentPassword,
      newPassword
    );
    if (success)
      return res
        .status(200)
        .json({ message: "Password updated successfully." });
    return res.status(400).json({ message: "Incorrect current password." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// LOGOUT
router.post("/logout", async (req, res) => {
  try {
    if (req.session.user) {
      await userService.logout(req.session.user.id); // Optional: track logout
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error on logout:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("oscaims_sid"); // Use your actual session cookie name
      res.json({ message: "Logged out successfully" });
    });
  } catch (err) {
    console.error("Logout service error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
});

// CHECK SESSION (/me) - requires authentication middleware
router.get("/me", isAuthenticated, (req, res) => {
  const { id, username, email, cp_number, role, last_logout } =
    req.session.user;
  res.status(200).json({
    isAuthenticated: true,
    userId: id,
    userName: username,
    userEmail: email,
    userNumber: cp_number,
    userRole: role,
    lastLogout: last_logout,
  });
});

// CHECK SESSION (/session) - does not require middleware
router.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    // Send 200 but with user null
    res.json({ user: null });
  }
});

module.exports = router;

const Connection = require("../db/Connection");
const { logAudit } = require("./auditService");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

exports.getUser = async (id) => {
  try {
    const user = await Connection(
      "SELECT id, username, email, cp_number, role, last_logout FROM users WHERE id = ?",
      [id]
    );
    return user.length > 0 ? user[0] : null;
  } catch (error) {
    console.error("Error fetching user by ID:", err);
    return null;
  }
};

// LOGIN SERVICE
exports.login = async (email, password) => {
  try {
    const results = await Connection(
      "SELECT id, username, email, password, cp_number, role, last_logout FROM users WHERE email = ?",
      [email]
    );

    if (results.length === 0) return null;

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;

    await logAudit(
      user.email,
      user.role,
      "LOGIN",
      "User",
      `User '${user.username}' logged in.`
    );

    return {
      username: user.username,
      id: user.id,
      email: user.email,
      cp_number: user.cp_number,
      role: user.role,
      last_logout: user.last_logout,
    };
  } catch (error) {
    console.error("Error in login service:", error);
    throw error;
  }
};

// REGISTER SERVICE
exports.register = async (username, email, password, cp_number, role) => {
  try {
    const existingUsers = await Connection(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      const error = new Error("User with this email already exists.");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const query = `
      INSERT INTO users (id, username, email, password, cp_number, role)
      VALUES (NULL, ?, ?, ?, ?, ?)
    `;
    const result = await Connection(query, [
      username,
      email,
      hashedPassword,
      cp_number,
      role,
    ]);

    // ✅ Log registration
    if (result.affectedRows === 1) {
      await logAudit(
        email,
        role,
        "REGISTER",
        "User",
        `New user '${username}' registered.`
      );
    }

    return result.affectedRows === 1;
  } catch (error) {
    console.error("Error in register service:", error);
    throw error;
  }
};

exports.updateUserInfo = async (id, fullName, email, cp_number) => {
  try {
    const [oldData] = await Connection(
      "SELECT username, email, role FROM users WHERE id = ?",
      [id]
    );

    const query = `UPDATE users SET username = ?, email = ?, cp_number = ? WHERE id = ?`;
    const result = await Connection(query, [fullName, email, cp_number, id]);

    if (result.affectedRows === 1) {
      await logAudit(
        email,
        oldData.role,
        "UPDATE",
        "User",
        `Updated profile info from '${oldData.username}' to '${fullName}'.`
      );
    }

    return result.affectedRows === 1;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

exports.changePassword = async (id, currentPassword, newPassword) => {
  try {
    const user = await Connection("SELECT password FROM users WHERE id = ?", [
      id,
    ]);
    if (user.length === 0) return false;

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user[0].password
    );
    if (!passwordMatch) return false;

    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const query = `UPDATE users SET password = ? WHERE id = ?`;
    const result = await Connection(query, [hashedNewPassword, id]);
    return result.affectedRows === 1;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// LOGOUT SERVICE
exports.logout = async (userId) => {
  try {
    const [user] = await Connection(
      "SELECT username, email, role FROM users WHERE id = ?",
      [userId]
    );
    await Connection("UPDATE users SET last_logout = NOW() WHERE id = ?", [
      userId,
    ]);

    // ✅ Log logout
    await logAudit(
      user.email,
      user.role,
      "LOGOUT",
      "User",
      `User '${user.username}' logged out.`
    );

    return true;
  } catch (error) {
    console.error("Error in logout service:", error);
    throw error;
  }
};

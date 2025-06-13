const axios = require("axios");
const Connection = require("../db/Connection");
const { logAudit } = require("./auditService");

exports.sendSMS = async (message, recipients) => {
  try {
    // 🟩 1. Fetch credentials from DB
    const [credentials] = await Connection(
      "SELECT * FROM sms_credentials LIMIT 1"
    );

    if (!credentials) {
      throw new Error("SMS credentials not found in database.");
    }

    const payload = {
      Email: credentials.email,
      Password: credentials.password,
      ApiCode: credentials.api_code,
      Recipients: recipients,
      Message: message,
    };

    // 🟩 2. Send SMS
    const response = await axios.post(
      "https://api.itexmo.com/api/broadcast",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // 🟩 3. Log result in DB
    await Connection(
      `INSERT INTO sms_logs (recipients, message, status, reference_id, credit_used)
       VALUES (?, ?, ?, ?, ?)`,
      [
        JSON.stringify(recipients),
        message,
        data.Error === false ? "Success" : "Failed",
        data.ReferenceId || null,
        data.TotalCreditUsed || 0,
      ]
    );

    if (data && data.Error === false && data.Accepted > 0) {
      return { success: true, response: data };
    } else {
      return {
        success: false,
        response: `iTexMo error: ${JSON.stringify(data)}`,
      };
    }
  } catch (error) {
    // 🟥 Log failed SMS
    await Connection(
      `INSERT INTO sms_logs (recipients, message, status, reference_id, credit_used)
       VALUES (?, ?, ?, ?, ?)`,
      [JSON.stringify(recipients), message, "Request Failed", null, 0]
    );

    return {
      success: false,
      response:
        error.response?.status === 400
          ? "❌ Failed to send broadcast: Insufficient credits or bad request."
          : `Request failed: ${error.message}`,
    };
  }
};

exports.deleteSms = async (id) => {
  try {
    const query = `DELETE FROM sms_logs WHERE id = ?`;
    const result = await Connection(query, [id]);

    if (result.affectedRows > 0) {
      return true;
    } else {
      console.warn("No Message found with ID:", id);
      return false;
    }
  } catch (err) {
    console.error("Error deleting Message:", err);
    return false;
  }
};

// In your smsService.js

exports.getSmsCredentials = async (req, res) => {
  try {
    const [credentials] = await Connection(
      "SELECT email, password, api_code FROM sms_credentials WHERE id = 1"
    );
    if (!credentials) {
      return res.status(404).json({ message: "Credentials not found" });
    }
    res.json(credentials);
  } catch (err) {
    console.error("Error fetching SMS credentials:", err);
    res.status(500).json({ message: "Server error fetching credentials" });
  }
};

// PUT /api/sms-credentials
exports.updateSmsCredentials = async (req, res) => {
  const { email, password, api_code } = req.body;

  try {
    // Get current stored credentials for audit
    const [oldData] = await Connection(
      `SELECT email, password, api_code FROM sms_credentials WHERE id = 1`
    );

    // Perform the update
    await Connection(
      `UPDATE sms_credentials SET email = ?, password = ?, api_code = ? WHERE id = 1`,
      [email, password, api_code]
    );

    // Get user data from request (assuming middleware sets req.user)
    const userEmail = req.user?.email || "Unknown";
    const userRole = req.user?.role || "Admin";

    // Prepare audit log details
    const changes = [];
    if (oldData.email !== email)
      changes.push(`Email changed from '${oldData.email}' to '${email}'`);
    if (oldData.password !== password) changes.push(`Password was updated`);
    if (oldData.api_code !== api_code) changes.push(`API Code changed`);

    if (changes.length > 0) {
      await logAudit(
        userEmail,
        userRole,
        "UPDATE",
        "SMS_CREDENTIALS",
        changes.join("; ")
      );
    }

    res.status(200).json({ message: "SMS credentials updated." });
  } catch (err) {
    console.error("Error updating SMS credentials:", err);
    res.status(500).json({ message: "Failed to update credentials." });
  }
};

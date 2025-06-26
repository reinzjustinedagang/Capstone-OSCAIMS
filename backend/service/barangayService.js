const Connection = require("../db/Connection");
const { logAudit } = require("./auditService");

// Get all barangays
exports.getAllBarangays = async () => {
  return await Connection(
    "SELECT id, barangay_name, created_at FROM barangays"
  );
};

// Get one barangay by ID
exports.getBarangayById = async (id) => {
  const result = await Connection("SELECT * FROM barangays WHERE id = ?", [id]);
  return result[0];
};

// Create a new barangay
exports.createBarangay = async (name, user) => {
  const result = await Connection(
    "INSERT INTO barangays (barangay_name) VALUES (?)",
    [name]
  );

  if (result.affectedRows === 1 && user) {
    await logAudit(
      user.email,
      user.role,
      "CREATE",
      `Created barangay '${name}'.`
    );
  }

  return result;
};

// Update a barangay
exports.updateBarangay = async (id, name, user) => {
  const [oldData] = await Connection(
    "SELECT name FROM barangays WHERE id = ?",
    [id]
  );

  const result = await Connection(
    "UPDATE barangays SET name = ? WHERE id = ?",
    [name, id]
  );

  if (result.affectedRows === 1 && user) {
    const changes =
      oldData.name !== name
        ? `name: '${oldData.name}' → '${name}'`
        : "No changes.";

    await logAudit(
      user.email,
      user.role,
      "UPDATE",
      `Updated barangay ${name}: ${changes}`
    );
  }

  return result;
};

// Delete a barangay
exports.deleteBarangay = async (id, user) => {
  const [barangay] = await Connection(
    "SELECT name FROM barangays WHERE id = ?",
    [id]
  );

  const result = await Connection("DELETE FROM barangays WHERE id = ?", [id]);

  if (result.affectedRows === 1 && user) {
    await logAudit(
      user.email,
      user.role,
      "DELETE",
      `Deleted barangay '${barangay?.name}'`
    );
  }

  return result;
};

// Get total number of barangays
exports.getBarangayCount = async () => {
  const [result] = await Connection("SELECT COUNT(*) AS count FROM barangays");
  return result.count;
};

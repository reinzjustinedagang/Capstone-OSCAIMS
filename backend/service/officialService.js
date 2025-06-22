const Connection = require("../db/Connection");
const { logAudit } = require("./auditService"); // Uncomment if needed and adjust path

// ─── MUNICIPAL OFFICIALS ──────────────────────────────────────────────────────

exports.getMunicipalOfficials = async () => {
  return await Connection(
    `SELECT * FROM municipal_officials ORDER BY type DESC, id ASC`
  );
};

const checkIfTypeExists = async (type, excludeId = null) => {
  let query = `SELECT id FROM municipal_officials WHERE type = ?`;
  const params = [type];
  if (excludeId) {
    query += ` AND id != ?`; // Exclude the current official if updating
    params.push(excludeId);
  }
  // FIX: Removed array destructuring here. 'rows' will now correctly be the array of results.
  const rows = await Connection(query, params);
  return rows.length > 0;
};

exports.addMunicipalOfficial = async (name, position, type, image, user) => {
  try {
    // Check for existing head/vice before adding
    if (type === "head" || type === "vice") {
      const typeAlreadyExists = await checkIfTypeExists(type);
      if (typeAlreadyExists) {
        throw new Error(
          `A municipal official with type '${type}' already exists.`
        );
      }
    }

    const result = await Connection(
      `INSERT INTO municipal_officials (name, position, type, image) VALUES (?, ?, ?, ?)`,
      [name, position, type, image]
    );

    if (result.affectedRows === 1 && user) {
      await logAudit(
        user.email,
        user.role,
        "CREATE",
        `Added municipal official '${name}' as ${position} (${type})`
      );
    }
    return result;
  } catch (error) {
    console.error("Error in addMunicipalOfficial service:", error);
    throw error; // Re-throw to be caught by the route handler
  }
};

exports.updateMunicipalOfficial = async (
  id,
  name,
  position,
  type,
  image, // This 'image' parameter will now be either the new filename OR the existing filename (from frontend)
  user
) => {
  try {
    // FIX: Get all rows and then access the first element
    const oldDataRows = await Connection(
      `SELECT name, position, type, image FROM municipal_officials WHERE id = ?`,
      [id]
    );
    const oldData = oldDataRows[0]; // Get the first (and only) row

    if (!oldData) {
      throw new Error("Municipal official not found for update.");
    }

    // Check for existing head/vice if type is being changed or is head/vice
    if ((type === "head" || type === "vice") && oldData.type !== type) {
      // If the type is being changed TO head or vice, check if another exists
      const typeAlreadyExists = await checkIfTypeExists(type, id); // Exclude current official's ID
      if (typeAlreadyExists) {
        throw new Error(
          `A municipal official with type '${type}' already exists. Cannot change.`
        );
      }
    } else if ((type === "head" || type === "vice") && oldData.type === type) {
      // If type is already head/vice and not changing, ensure no OTHER official of that type exists
      // (This handles cases where existing data might be inconsistent or initial setup)
      const typeAlreadyExists = await checkIfTypeExists(type, id);
      if (typeAlreadyExists) {
        throw new Error(
          `Another municipal official with type '${type}' already exists.`
        );
      }
    }

    const finalImage = image; // Image determined by route

    const result = await Connection(
      `UPDATE municipal_officials SET name = ?, position = ?, type = ?, image = ? WHERE id = ?`,
      [name, position, type, finalImage, id] // Use finalImage
    );

    if (result.affectedRows === 1 && user) {
      const changes = [];
      if (oldData.name !== name)
        changes.push(`name: '${oldData.name}' → '${name}'`);
      if (oldData.position !== position)
        changes.push(`position: '${oldData.position}' → '${position}'`);
      if (oldData.type !== type)
        changes.push(`type: '${oldData.type}' → '${type}'`);
      if (oldData.image !== finalImage)
        changes.push(
          `image: '${oldData.image || "none"}' → '${finalImage || "none"}'`
        );

      if (changes.length > 0) {
        await logAudit(
          user.email,
          user.role,
          "UPDATE",
          `Updated municipal official ${name} (ID: ${id}): ${changes.join(
            ", "
          )}`
        );
      }
    }
    return result;
  } catch (error) {
    console.error("Error in updateMunicipalOfficial service:", error);
    throw error; // Re-throw to be caught by the route handler
  }
};

exports.deleteMunicipalOfficial = async (id, user) => {
  // FIX: Get all rows and then access the first element
  const officialRows = await Connection(
    `SELECT name, image FROM municipal_officials WHERE id = ?`,
    [id]
  );
  const official = officialRows[0]; // Get the first (and only) row

  if (!official) {
    throw new Error("Municipal official not found for deletion.");
  }

  const result = await Connection(
    `DELETE FROM municipal_officials WHERE id = ?`,
    [id]
  );

  if (result.affectedRows === 1 && user) {
    await logAudit(
      user.email,
      user.role,
      "DELETE",
      `Deleted municipal official '${official?.name}'`
    );
    // TODO: Add logic here to delete the physical image file from your storage (e.g., 'uploads' folder)
    if (official.image) {
      const fs = require("fs/promises");
      const path = require("path");
      const imagePath = path.join(__dirname, "../uploads", official.image); // Adjust path
      try {
        await fs.unlink(imagePath);
        console.log(`Deleted image file: ${imagePath}`);
      } catch (err) {
        console.error(`Failed to delete image file ${imagePath}:`, err);
      }
    }
  }

  return result;
};

// ─── BARANGAY OFFICIALS ──────────────────────────────────────────────────────

exports.addBarangayOfficial = async (
  barangay_name,
  president_name,
  position,
  image,
  user
) => {
  const result = await Connection(
    `INSERT INTO barangay_officials (barangay_name, president_name, position, image) VALUES (?, ?, ?, ?)`,
    [barangay_name, president_name, position, image]
  );

  if (result.affectedRows === 1 && user) {
    await logAudit(
      user.email,
      user.role,
      "CREATE",
      `Added barangay official '${barangay_name}'`
    );
  }

  return result;
};

exports.getBarangayOfficials = async () => {
  return await Connection(
    `SELECT * FROM barangay_officials ORDER BY barangay_name ASC`
  );
};

exports.updateBarangayOfficial = async (
  id,
  barangay_name,
  president_name,
  position,
  image, // This 'image' parameter will be either the new filename or the existing filename (from route)
  user
) => {
  // FIX: Get all rows and then access the first element
  const oldDataRows = await Connection(
    `SELECT barangay_name, president_name, image FROM barangay_officials WHERE id = ?`,
    [id]
  );
  const oldData = oldDataRows[0]; // Get the first (and only) row

  if (!oldData) {
    throw new Error("Barangay official not found for update.");
  }

  const finalImage = image; // Image determined by route

  const result = await Connection(
    `UPDATE barangay_officials SET barangay_name = ?, president_name = ?, position = ?, image = ? WHERE id = ?`,
    [barangay_name, president_name, position, finalImage, id]
  );

  // Optional audit logging
  if (result.affectedRows === 1 && user) {
    const changes = [];
    if (oldData.barangay_name !== barangay_name)
      changes.push(
        `barangay_name: '${oldData.barangay_name}' → '${barangay_name}'`
      );
    if (oldData.president_name !== president_name)
      changes.push(
        `president_name: '${oldData.president_name}' → '${president_name}'`
      );
    if (oldData.image !== finalImage)
      changes.push(
        `image: '${oldData.image || "none"}' → '${finalImage || "none"}'`
      );

    await logAudit(
      user.email,
      user.role,
      "UPDATE",
      `Updated barangay official ${president_name}: ${changes.join(", ")}`
    );
  }

  return result;
};

exports.deleteBarangayOfficial = async (id, user) => {
  // FIX: Get all rows and then access the first element
  const barangayRows = await Connection(
    `SELECT barangay_name, image FROM barangay_officials WHERE id = ?`,
    [id]
  );
  const barangay = barangayRows[0]; // Get the first (and only) row

  if (!barangay) {
    throw new Error("Barangay official not found for deletion.");
  }

  const result = await Connection(
    `DELETE FROM barangay_officials WHERE id = ?`,
    [id]
  );

  if (result.affectedRows === 1 && user) {
    await logAudit(
      user.email,
      user.role,
      "DELETE",
      `Deleted barangay official '${barangay?.barangay_name}'`
    );
    // TODO: Add logic here to delete the physical image file from your storage (e.g., 'uploads' folder)
    if (barangay.image) {
      const fs = require("fs/promises");
      const path = require("path");
      const imagePath = path.join(__dirname, "../uploads", barangay.image); // Adjust path
      try {
        await fs.unlink(imagePath);
        console.log(`Deleted image file: ${imagePath}`);
      } catch (err) {
        console.error(`Failed to delete image file ${imagePath}:`, err);
      }
    }
  }

  return result;
};

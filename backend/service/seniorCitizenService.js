const Connection = require("../db/Connection");

/**
 * Senior Citizen Service Layer
 * Provides methods for interacting with the senior_citizens table.
 */

// Fetch all senior citizens
exports.getAllSeniorCitizens = async () => {
  try {
    const results = await Connection(
      "SELECT * FROM senior_citizens ORDER BY date_registered DESC"
    );
    return results;
  } catch (error) {
    console.error("Error fetching all senior citizens:", error);
    throw new Error("Failed to retrieve all senior citizens.");
  }
};

// Fetch senior citizen by ID
exports.getSeniorCitizenById = async (id) => {
  try {
    const result = await Connection(
      `SELECT * FROM senior_citizens WHERE id = ?`,
      [id]
    );
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Error fetching senior citizen with ID ${id}:`, error);
    throw new Error(`Failed to retrieve senior citizen with ID ${id}.`);
  }
};

// Create a new senior citizen
exports.createSeniorCitizen = async (seniorCitizenData) => {
  try {
    const query = `INSERT INTO senior_citizens SET ?`;
    const result = await Connection(query, seniorCitizenData);
    return result.insertId;
  } catch (error) {
    console.error("Error creating senior citizen:", error);
    throw new Error("Failed to create senior citizen.");
  }
};

// Update an existing senior citizen
exports.updateSeniorCitizen = async (id, updatedData) => {
  try {
    const query = `UPDATE senior_citizens SET ? WHERE id = ?`;
    const result = await Connection(query, [updatedData, id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error updating senior citizen with ID ${id}:`, error);
    throw new Error(`Failed to update senior citizen with ID ${id}.`);
  }
};

// Delete a senior citizen
exports.deleteSeniorCitizen = async (id) => {
  try {
    const query = `DELETE FROM senior_citizens WHERE id = ?`;
    const result = await Connection(query, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error deleting senior citizen with ID ${id}:`, error);
    throw new Error(`Failed to delete senior citizen with ID ${id}.`);
  }
};

// Paginated retrieval
exports.getPaginatedSeniorCitizens = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;

    // Get total count of senior citizens
    const [countResult] = await Connection(
      `SELECT COUNT(*) as total FROM senior_citizens`
    );
    const total = countResult.total;

    // Get paginated results ordered by date_registered desc
    const query = `
      SELECT * FROM senior_citizens
      ORDER BY date_registered DESC
      LIMIT ? OFFSET ?
    `;
    const results = await Connection(query, [limit, offset]);

    return {
      total,
      page,
      limit,
      seniorCitizens: results,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  } catch (error) {
    console.error(
      `Error fetching paginated senior citizens (page: ${page}, limit: ${limit}):`,
      error
    );
    throw new Error("Failed to retrieve paginated senior citizens.");
  }
};

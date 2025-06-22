const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // Assuming this path is correct
const officialService = require("../service/officialService"); // Assuming this path is correct
const { isAuthenticated } = require("../middleware/authMiddleware"); // Assuming this path is correct

// ─── MUNICIPAL ROUTES ───────────────────────────────────────────────

// GET all municipal officials
// Removed isAuthenticated middleware to allow public access for viewing
router.get("/municipal", async (req, res) => {
  try {
    const officials = await officialService.getMunicipalOfficials();
    res.json(officials);
  } catch (error) {
    console.error("Error fetching municipal officials:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch municipal officials",
        error: error.message,
      });
  }
});

// POST add municipal official
router.post(
  "/municipal",
  isAuthenticated, // This route remains protected
  upload.single("image"), // Handle image upload
  async (req, res) => {
    const { name, position, type } = req.body;
    const image = req.file ? req.file.filename : null; // Filename from multer if file uploaded
    const user = req.session.user; // Get user from session for audit logging

    try {
      const result = await officialService.addMunicipalOfficial(
        name,
        position,
        type,
        image,
        user
      );
      res
        .status(201)
        .json({ message: "Municipal official added", id: result.insertId });
    } catch (error) {
      console.error("Error adding municipal official:", error);
      // Check for specific error message to send a more appropriate status code
      if (error.message.includes("already exists")) {
        return res.status(409).json({ message: error.message }); // 409 Conflict
      }
      res.status(500).json({
        message: "Failed to add municipal official",
        error: error.message,
      });
    }
  }
);

// PUT update municipal official
router.put(
  "/municipal/:id",
  isAuthenticated, // This route remains protected
  upload.single("image"), // Handle image upload
  async (req, res) => {
    const { name, position, type, existing_image } = req.body; // Capture existing_image from form
    // Determine the image filename to pass to the service: new file or existing file
    const image = req.file ? req.file.filename : existing_image;
    const user = req.session.user; // Get user from session for audit logging

    try {
      await officialService.updateMunicipalOfficial(
        req.params.id, // Official ID from URL params
        name,
        position,
        type,
        image, // This 'image' will be the new filename OR the existing filename
        user
      );
      res.json({ message: "Municipal official updated successfully" });
    } catch (error) {
      console.error("Error updating municipal official:", error);
      // Check for specific error message to send a more appropriate status code
      if (
        error.message.includes("already exists") ||
        error.message.includes("not found")
      ) {
        return res.status(409).json({ message: error.message }); // 409 Conflict or 404 Not Found (from service)
      }
      res.status(500).json({
        message: "Failed to update municipal official",
        error: error.message,
      });
    }
  }
);

// DELETE municipal official
router.delete("/municipal/:id", isAuthenticated, async (req, res) => {
  // This route remains protected
  const user = req.session.user; // For audit logging
  try {
    const result = await officialService.deleteMunicipalOfficial(
      req.params.id,
      user
    );
    if (result.affectedRows === 0) {
      // Check if any row was actually deleted
      return res.status(404).json({
        message: "Municipal official not found or could not be deleted.",
      });
    }
    res
      .status(200)
      .json({ message: "Municipal official deleted successfully." });
  } catch (error) {
    console.error("Error deleting municipal official:", error);
    res.status(500).json({
      message: "Failed to delete municipal official.",
      error: error.message,
    });
  }
});

// ─── BARANGAY ROUTES ───────────────────────────────────────────────

// GET all barangay officials
// Removed isAuthenticated middleware to allow public access for viewing
router.get("/barangay", async (req, res) => {
  try {
    const results = await officialService.getBarangayOfficials();
    res.json(results);
  } catch (error) {
    console.error("Error fetching barangay officials:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch barangay officials",
        error: error.message,
      });
  }
});

// POST add barangay official
router.post(
  "/barangay",
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    const { barangay_name, president_name, position } = req.body;
    const image = req.file ? req.file.filename : null;
    const user = req.session.user;

    try {
      const result = await officialService.addBarangayOfficial(
        barangay_name,
        president_name,
        position,
        image,
        user
      );
      res
        .status(201)
        .json({ message: "Barangay official added", id: result.insertId });
    } catch (error) {
      console.error("Error adding barangay official:", error);
      res
        .status(500)
        .json({
          message: "Failed to add barangay official",
          error: error.message,
        });
    }
  }
);

// PUT update barangay official
router.put(
  "/barangay/:id",
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    const {
      barangay_name,
      president_name,
      position,
      existing_image, // 🔁 sent from frontend if no new image is uploaded
    } = req.body;

    // Determine the image filename to pass to the service: new file or existing file
    const image = req.file ? req.file.filename : existing_image;
    const user = req.session.user;

    try {
      await officialService.updateBarangayOfficial(
        req.params.id,
        barangay_name,
        president_name,
        position,
        image, // This 'image' will be the new filename OR the existing filename
        user
      );
      res.json({ message: "Barangay official updated successfully" });
    } catch (error) {
      console.error("Error updating barangay official:", error);
      res
        .status(500)
        .json({
          message: "Failed to update barangay official",
          error: error.message,
        });
    }
  }
);

// DELETE barangay official
router.delete("/barangay/:id", isAuthenticated, async (req, res) => {
  const user = req.session.user;

  try {
    const result = await officialService.deleteBarangayOfficial(
      req.params.id,
      user
    );
    if (result.affectedRows === 0) {
      // Check if any row was actually deleted
      return res
        .status(404)
        .json({
          message: "Barangay official not found or could not be deleted.",
        });
    }
    res.json({ message: "Barangay official deleted successfully" });
  } catch (error) {
    console.error("Error deleting barangay official:", error);
    res
      .status(500)
      .json({
        message: "Failed to delete barangay official",
        error: error.message,
      });
  }
});

module.exports = router;

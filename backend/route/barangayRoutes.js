const express = require("express");
const router = express.Router();
const barangayService = require("../service/barangayService");

// GET all barangays
router.get("/", async (req, res) => {
  try {
    const barangays = await barangayService.getAllBarangays();
    res.json(barangays);
  } catch (error) {
    console.error("Error fetching barangays:", error);
    res.status(500).json({ message: "Failed to fetch barangays" });
  }
});

// GET one barangay by ID
router.get("/:id", async (req, res) => {
  try {
    const barangay = await barangayService.getBarangayById(req.params.id);
    if (!barangay) {
      return res.status(404).json({ message: "Barangay not found" });
    }
    res.json(barangay);
  } catch (error) {
    console.error("Error fetching barangay:", error);
    res.status(500).json({ message: "Failed to fetch barangay" });
  }
});

// GET barangay count
router.get("/count/all", async (req, res) => {
  try {
    const count = await barangayService.getBarangayCount();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching barangay count:", error);
    res.status(500).json({ message: "Failed to fetch barangay count" });
  }
});

// POST create a new barangay
router.post("/", async (req, res) => {
  const { name } = req.body;
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized: Not logged in" });
  }

  try {
    await barangayService.createBarangay(name, user);
    res.status(201).json({ message: "Barangay created successfully" });
  } catch (error) {
    console.error("Error creating barangay:", error);
    res.status(500).json({ message: "Failed to create barangay" });
  }
});

// PUT update a barangay
router.put("/:id", async (req, res) => {
  const { name } = req.body;
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized: Not logged in" });
  }

  try {
    await barangayService.updateBarangay(req.params.id, name, user);
    res.json({ message: "Barangay updated successfully" });
  } catch (error) {
    console.error("Error updating barangay:", error);
    res.status(500).json({ message: "Failed to update barangay" });
  }
});

// DELETE a barangay
router.delete("/:id", async (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized: Not logged in" });
  }

  try {
    await barangayService.deleteBarangay(req.params.id, user);
    res.json({ message: "Barangay deleted successfully" });
  } catch (error) {
    console.error("Error deleting barangay:", error);
    res.status(500).json({ message: "Failed to delete barangay" });
  }
});

module.exports = router;

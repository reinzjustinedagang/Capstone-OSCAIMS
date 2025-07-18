const express = require("express");
const router = express.Router();
const seniorCitizenService = require("../service/seniorCitizenService");

// GET: Senior citizen by ID
router.get("/get/:id", async (req, res) => {
  try {
    const citizen = await seniorCitizenService.getSeniorCitizenById(
      req.params.id
    );
    if (!citizen) {
      return res.status(404).json({ message: "Senior citizen not found." });
    }
    res.status(200).json(citizen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Create new senior citizen
router.post("/create", async (req, res) => {
  const user = req.session.user;
  const ip = req.userIp;

  if (!user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No user session found." });
  }
  try {
    const insertId = await seniorCitizenService.createSeniorCitizen(
      req.body,
      user,
      ip
    );
    res.status(201).json({ message: "Senior citizen created.", insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: Update senior citizen
router.put("/update/:id", async (req, res) => {
  const user = req.session.user;
  const ip = req.userIp;

  if (!user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No user session found." });
  }
  try {
    const success = await seniorCitizenService.updateSeniorCitizen(
      req.params.id,
      req.body,
      user,
      ip
    );
    if (!success) {
      return res
        .status(404)
        .json({ message: "Senior citizen not found or not updated." });
    }
    res.status(200).json({ message: "Senior citizen updated." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Remove senior citizen
router.delete("/delete/:id", async (req, res) => {
  const user = req.session.user;
  const ip = req.userIp;

  if (!user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No user session found." });
  }
  try {
    const success = await seniorCitizenService.deleteSeniorCitizen(
      req.params.id,
      user,
      ip
    );
    if (!success) {
      return res
        .status(404)
        .json({ message: "Senior citizen not found or not deleted." });
    }
    res.status(200).json({ message: "Senior citizen deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Paginated list (e.g. /page?page=1&limit=10)
router.get("/page", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await seniorCitizenService.getPaginatedSeniorCitizens(
      page,
      limit
    );

    res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch paginated senior citizens:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET senior citizen count
router.get("/count/all", async (req, res) => {
  try {
    const count = await seniorCitizenService.getCitizenCount();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching senior citizen count:", error);
    res.status(500).json({ message: "Failed to fetch senior citizen count" });
  }
});

router.get("/sms-citizens", seniorCitizenService.getSmsRecipients);

module.exports = router;

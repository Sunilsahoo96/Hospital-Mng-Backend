const express = require("express");
const router = express.Router();
const {
  registerPatient,
  allPatient,
} = require("../Controllers/paitentController");

router.post("/registration", registerPatient);
router.get("/allPatient", allPatient);

module.exports = router;

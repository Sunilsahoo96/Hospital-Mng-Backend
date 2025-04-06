const express = require("express");
const router = express.Router();
const {
  registerPatient,
  allPatient,
  UANPatient,
} = require("../Controllers/paitentController");

router.post("/registration", registerPatient);
router.get("/allPatient", allPatient);
router.get("/allPatient/:uan", UANPatient);

module.exports = router;

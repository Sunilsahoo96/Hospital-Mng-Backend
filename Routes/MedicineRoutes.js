const express = require("express");
const router = express.Router();
const {
  addMedicine,
  getMedicine,
} = require("../Controllers/medicineConroller.js");

router.post("/add-medicine", addMedicine);
router.get("/get-medicine", getMedicine);

module.exports = router;

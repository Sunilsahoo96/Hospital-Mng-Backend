const express = require("express");
const router = express.Router();
const {
  addMedicine,
  getMedicine,
  getNamePrice,
  sellMedicine,
} = require("../Controllers/medicineConroller.js");

router.post("/add-medicine", addMedicine);
router.get("/get-medicine", getMedicine);
router.get("/get-medicine-name", getNamePrice);
router.post("/sell-medicine", sellMedicine);

module.exports = router;

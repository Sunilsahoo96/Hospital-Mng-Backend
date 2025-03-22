const express = require("express");
const router = express.Router();
const medicineController = require("../Controllers/addMedicineConroller.js");


router.post("/add-medicine", medicineController.addMedicine);
router.get("/get-medicine",  medicineController.getMedicine);

module.exports = router;



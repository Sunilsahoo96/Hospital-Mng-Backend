const express = require("express");
const router = express.Router();
const medicineController = require("../Controllers/addMedicineConroller.js");
const { verifyToken } = require("../Middlewares/authentication.js");

router.post("/add-medicine", verifyToken, medicineController.addMedicine);
router.get("/get-medicine", verifyToken, medicineController.getMedicine);

module.exports = router;
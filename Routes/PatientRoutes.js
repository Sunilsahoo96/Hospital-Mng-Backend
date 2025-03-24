const express = require('express');
const router = express.Router();
const {registerPatient, allPatient}  = require("../Controllers/paitentController"); 

// Register a new patient
router.post('/registration', registerPatient);
router.get("/allPatient", allPatient);

module.exports = router;

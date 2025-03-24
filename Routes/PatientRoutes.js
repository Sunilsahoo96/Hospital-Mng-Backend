const express = require('express');
const router = express.Router();
const {registerPatient}  = require("../Controllers/paitentController"); 

// Register a new patient
router.post('/registration', registerPatient);

module.exports = router;

const express = require('express');
const router = express.Router();
const Patient = require("../Models/Patient");

// Register new patient
router.post('/registration', async (req, res) => {
  try {
    const { uan, patientName, guardianName, address, mobile, alternateMobile } = req.body;
    
    // Check for existing UAN
    const existingPatient = await Patient.findOne({ uan });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient with this UAN already exists' });
    }

    const newPatient = new Patient({
      uan,
      patientName,
      guardianName,
      address,
      mobile,
      alternateMobile: alternateMobile || undefined
    });

    await newPatient.save();
    
    res.status(201).json({
      message: 'Patient registered successfully',
      data: newPatient
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: error.message || 'Failed to register patient'
    });
  }
});

module.exports = router;
const Patient = require("../Models/Patient");

// Register new patient
const registerPatient = async (req, res, next) => {
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
   return next(error)
  }
};

const allPatient = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
   return next(error)
  }
};

module.exports = {registerPatient, allPatient};

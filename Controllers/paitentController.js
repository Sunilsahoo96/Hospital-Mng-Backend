const Patient = require("../Models/Patient");

// Register new patient
const registerPatient = async (req, res, next) => {
  try {
    const { pun, patientName, guardianName, address, mobile, alternateMobile } = req.body;

    // Check for existing PUN
    const existingPatient = await Patient.findOne({ pun });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient with this PUN already exists' });
    }

    const newPatient = new Patient({
      pun,
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


// Get Patient Details by UAN
const UANPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ pun: req.params.pun });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ patientName: patient.patientName, mobile: patient.mobile });
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient details" });
  }
};

module.exports = {registerPatient, allPatient , UANPatient};

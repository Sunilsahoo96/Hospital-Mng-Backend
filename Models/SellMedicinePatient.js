const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  uan: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  mobile: { type: String, required: true },
});

module.exports = mongoose.model("Patient", PatientSchema);

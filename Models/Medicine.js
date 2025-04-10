const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  MedicineName: { type: String, required: true, unique: true },
  Manufacturer: { type: String, required: true },
  MfgDate: { type: Date, required: true },
  ExpiryDate: { type: Date, required: true },
  BuyingPrice: { type: Number, required: true },
  SellingPrice: { type: Number, required: true },
  MedicinePerStrip: { type: Number, required: true },
  HowManyStrips: { type: Number, required: true, default: 0 } // New Field
}, { timestamps: true });

module.exports = mongoose.model("Medicine", medicineSchema);


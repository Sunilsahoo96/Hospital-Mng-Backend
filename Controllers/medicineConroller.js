const Medicine = require("../Models/Medicine");

// Add new medicine
const addMedicine = async (req, res) => {
  try {
    const { MedicineName, Manufacturer, MfgDate, ExpiryDate, BuyingPrice, SellingPrice, MedicinePerStrip } = req.body;

    // Validate Expiry Date > Mfg Date
    if (new Date(ExpiryDate) <= new Date(MfgDate)) {
      return res.status(400).json({ error: "Expiry date must be after manufacturing date." });
    }

    const newMedicine = new Medicine({ MedicineName, Manufacturer, MfgDate, ExpiryDate, BuyingPrice, SellingPrice, MedicinePerStrip });
    await newMedicine.save();
    
    res.status(201).json({ message: "Medicine added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Get all medicines
const getMedicine = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch medicines", details: error.message });
  }
};

module.exports = {getMedicine, addMedicine}

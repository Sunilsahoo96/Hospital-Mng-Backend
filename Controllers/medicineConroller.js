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
    const { page = 1, limit = 10, search = "", sort = "asc" } = req.query;
    
    // Convert page & limit to integers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Search filter
    const searchFilter = search ? { MedicineName: { $regex: search, $options: "i" } } : {};

    // Sorting
    const sortOrder = sort === "asc" ? 1 : -1;

    const medicines = await Medicine.find(searchFilter)
      .sort({ MedicineName: sortOrder })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Medicine.countDocuments(searchFilter);

    res.json({ medicines, total });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {getMedicine, addMedicine}

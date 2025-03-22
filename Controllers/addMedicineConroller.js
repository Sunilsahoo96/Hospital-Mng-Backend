// const connectDB = require("../Models/db");

// exports.addMedicine = async (req, res) => {
//     try {
//         const db = await connectDB();
//         const medicineDetail = {
//             MedicineName: req.body.MedicineName,
//             Manufacturer: req.body.Manufacturer,
//             MfgDate: req.body.MfgDate,
//             ExpiryDate: req.body.ExpiryDate,
//             BuyingPrice: req.body.BuyingPrice,
//             SellingPrice: req.body.SellingPrice,
//             MedicinePerStrip: req.body.MedicinePerStrip,
//         };

//         await db.collection("MedicineDetails").insertOne(medicineDetail);
//         res.json({ message: "Medicine Details Added" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getMedicine = async (req, res) => {
//     try {
//         const db = await connectDB();
//         const medicines = await db.collection("MedicineDetails").find({}).toArray();
//         res.json(medicines);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };




const Medicine = require("../Models/Medicine");

// Add new medicine
exports.addMedicine = async (req, res) => {
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
exports.getMedicine = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch medicines", details: error.message });
  }
};

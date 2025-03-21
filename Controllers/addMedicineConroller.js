const connectDB = require("../Models/db");

exports.addMedicine = async (req, res) => {
    try {
        const db = await connectDB();
        const medicineDetail = {
            MedicineName: req.body.MedicineName,
            Manufacturer: req.body.Manufacturer,
            MfgDate: req.body.MfgDate,
            ExpiryDate: req.body.ExpiryDate,
            BuyingPrice: req.body.BuyingPrice,
            SellingPrice: req.body.SellingPrice,
            MedicinePerStrip: req.body.MedicinePerStrip,
        };

        await db.collection("MedicineDetails").insertOne(medicineDetail);
        res.json({ message: "Medicine Details Added" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMedicine = async (req, res) => {
    try {
        const db = await connectDB();
        const medicines = await db.collection("MedicineDetails").find({}).toArray();
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
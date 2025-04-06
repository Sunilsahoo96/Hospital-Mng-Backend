const Medicine = require("../Models/Medicine");

// Add new medicine
const addMedicine = async (req, res, next) => {
  try {
    const {
      MedicineName,
      Manufacturer,
      MfgDate,
      ExpiryDate,
      BuyingPrice,
      SellingPrice,
      MedicinePerStrip,
      HowManyStrips,
    } = req.body;

    let existingMedicine = await Medicine.findOne({ MedicineName });

    if (existingMedicine) {
      existingMedicine.HowManyStrips += parseInt(HowManyStrips, 10);
      await existingMedicine.save();
      return res.json({
        message: "Medicine strip count updated successfully!",
      });
    }

    const newMedicine = new Medicine({
      MedicineName,
      Manufacturer,
      MfgDate,
      ExpiryDate,
      BuyingPrice,
      SellingPrice,
      MedicinePerStrip,
      HowManyStrips: parseInt(HowManyStrips, 10),
    });

    await newMedicine.save();
    res.json({ message: "New medicine added successfully!" });
  } catch (error) {
    return next(error);
  }
};

// Get all medicines
const getMedicine = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", sort = "asc" } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const searchFilter = search
      ? { MedicineName: { $regex: search, $options: "i" } }
      : {};
    const sortOrder = sort === "asc" ? 1 : -1;

    const medicines = await Medicine.find(searchFilter)
      .select(
        "MedicineName Manufacturer ExpiryDate SellingPrice MedicinePerStrip HowManyStrips"
      ) 
      .sort({ MedicineName: sortOrder })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Medicine.countDocuments(searchFilter);

    res.json({ medicines, total });
  } catch (error) {
    return next(error);
  }
};


// Get List of Medicines
const getNamePrice = async (req, res) => {
  try {
    const medicines = await Medicine.find({}, { MedicineName: 1, SellingPrice: 1, _id: 0 });
    
    console.log("Fetched Medicines:", medicines); // Debugging
    if (medicines.length === 0) {
      console.log("No medicines found in database!");
    }

    res.json(medicines);
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ message: "Error fetching medicines" });
  }
};





// Sell Medicines (Save sale record)
const sellMedicine = async (req, res) => {
  try {
    const { uan, patientName, mobile, medicines } = req.body;

    if (!uan || !patientName || !mobile || !medicines.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sale = new Sale({ uan, patientName, mobile, medicines });
    await sale.save();

    res.status(201).json({ message: "Medicine sold successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error processing sale" });
  }
};

module.exports = { getMedicine, addMedicine, getNamePrice, sellMedicine };

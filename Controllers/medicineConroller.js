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

module.exports = { getMedicine, addMedicine };

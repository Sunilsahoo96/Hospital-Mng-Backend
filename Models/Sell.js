const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({
  uan: { type: String, required: true },
  patientName: { type: String, required: true },
  mobile: { type: String, required: true },
  medicines: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Sale", SaleSchema);

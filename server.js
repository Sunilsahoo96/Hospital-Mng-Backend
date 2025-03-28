const express = require("express");
const cors = require("cors");
const connectDB = require("./Models/db");
const createError = require('http-errors');
const morgan = require("morgan");
const authRoutes = require("./Routes/AuthRoutes");
const medicineRoutes = require("./Routes/MedicineRoutes");
const patientRoutes   = require("./Routes/PatientRoutes");

const app = express();
 
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/patient", patientRoutes);

app.use(async(req, res, next) =>{
  next(createError.NotFound('This route is not available'));
})

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: {
      "status":err.status || 500,
      "error": err.message || "Internal Server Error"
    },
  });
});


connectDB().then(() => {
  const PORT = process.env.PORT || 8000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Handle server errors
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(` Port ${PORT} is already in use!`);
    } else {
      console.error("Server error:", error);
    }
    process.exit(1);
  });
});
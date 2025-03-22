const express = require("express");
const cors = require("cors");
const connectDB = require("./Models/db");

// Import route files
const authRoutes = require("./Routes/AuthRoutes");
const medicineRoutes = require("./Routes/MedicineRoutes");
const patientRoutes = require("./Routes/PatientRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB().then(() => {
  // Route middlewares
  app.use("/api/auth", authRoutes);
  app.use("/api/medicine", medicineRoutes);
  app.use("/api/patient", patientRoutes);

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });

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
const express = require("express");
const connectDB = require("./Models/db");
const createError = require("http-errors");
const errorHandler = require("./middleware/errorHandler");
const globalMiddleware = require("./middlewares/globalMiddleware.js");

const app = express();
globalMiddleware(app);


app.get("/api/test-cors", (req, res) => {
  res.json({ message: "CORS is working properly!" });
});

app.use("/api/auth", async (req, res, next) => {
  const authRoutes = (await import("./Routes/AuthRoutes.js")).default;
  authRoutes(req, res, next);
});

// const authRoutes = require("./Routes/AuthRoutes");
// app.use("/api/auth", authRoutes);

app.use("/api/medicine", async (req, res, next) => {
  const medicineRoutes = (await import("./Routes/MedicineRoutes.js")).default;
  medicineRoutes(req, res, next);
});

app.use("/api/patient", async (req, res, next) => {
  const patientRoutes = (await import("./Routes/PatientRoutes.js")).default;
  patientRoutes(req, res, next);
});


app.use(async (req, res, next) => {
  next(createError.NotFound("This route is not available"));
});

app.use(errorHandler);

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

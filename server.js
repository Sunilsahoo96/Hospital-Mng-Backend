const express = require("express");
const cors = require("cors");
const connectDB = require("./Models/db");
const createError = require("http-errors");
const morgan = require("morgan");

const app = express();
const corsOptions = {
  origin: "https://hospital-management-system-fzws.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/api/test-cors", (req, res) => {
  res.json({ message: "CORS is working properly!" });
});

// app.use("/api/auth", async (req, res, next) => {
//   const authRoutes = (await import("./Routes/AuthRoutes.js")).default;
//   authRoutes(req, res, next);
// });

const authRoutes = require("./Routes/AuthRoutes");
app.use("/api/auth", authRoutes);

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

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      error: err.message || "Internal Server Error",
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

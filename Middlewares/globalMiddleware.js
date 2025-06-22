// middleware/globalMiddleware.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Define allowed origins
const allowedOrigins = [
  "https://hospital-management-system-fzws.onrender.com",
  "http://localhost:3000"
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Export as a function to apply middleware
const applyGlobalMiddleware = (app) => {
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = applyGlobalMiddleware;

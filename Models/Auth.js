const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Ensures valid email format
      },
      password: { type: String, required: true },
      role: { 
        type: String, 
        enum: ["doctor", "nurse", "reception", "admin", "medicine cashier"], 
        required: true 
      }
    }, 
    { timestamps: true }
  );
  
  // Hash password before saving the user
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  module.exports = mongoose.model("User", userSchema);

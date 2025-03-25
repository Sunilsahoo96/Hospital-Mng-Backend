const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User=require("../Models/Auth")
// const connectDB = require("../Models/db");
require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate email format
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format. Please enter a valid email." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use. Please log in." });
        }

        // Create a new user
        const newUser = new User({ name, email, password, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user in the database and select required fields
        const user = await User.findOne({ email }).select("name email password role");
        
        if (!user) {
            return res.status(404).json({ message: "User not found. Please sign up first." });
        }

        // Compare entered password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect email or password." });
        }

        // Generate JWT token including name and role
        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        // Send response with name
        res.json({
            message: "Login successful",
            token,
            name: user.name, // 👈 Now name is included properly
            role: user.role
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: error.message });
    }
};

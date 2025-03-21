const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("../Models/db");
require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        const db = await connectDB();
        const { name, email, password, role } = req.body;
        
        const existingUser = await db.collection("Users").findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("Users").insertOne({ name, email, password: hashedPassword, role });
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const db = await connectDB();
        const { email, password } = req.body;
        
        const user = await db.collection("Users").findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
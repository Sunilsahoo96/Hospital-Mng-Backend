const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/Auth");
const createError = require("http-errors");

require("dotenv").config();

const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return next(createError.BadRequest("Invalid email format"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError.Conflict(`${email} is already used!`));
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select(
      "name email password role"
    );

    if (!user) {
      return next(createError.NotFound("user not found!"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createError.Unauthorized("Invalid Request"));
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    return next(error);
  }
};
module.exports = { signup, login };

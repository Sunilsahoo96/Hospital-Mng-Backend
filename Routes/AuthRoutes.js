const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const connectionString = 'mongodb://127.0.0.1:27017';
const dbName = 'Hospital-Management-System';
router.post('/login', async (req, res) => {
    let client;
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      // Connect to DB
      client = await MongoClient.connect(connectionString);
      const db = client.db(dbName);
      const usersCollection = db.collection('Users');
  
      // Find user
      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Successful login response
      res.json({
        message: 'Login successful',
        role: user.role,
        token: 'your-jwt-token-here'
      });
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed. Please try again.' });
    } finally {
      if (client) client.close();
    }
  });

router.post('/signup', async (req, res) => {
  let client;
  try {
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    client = await MongoClient.connect(connectionString);
    const db = client.db(dbName);
    const usersCollection = db.collection('Users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date()
    };

    // Insert user
    const result = await usersCollection.insertOne(newUser);
    
    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertedId
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  } finally {
    if (client) client.close();
  }
});

module.exports = router;
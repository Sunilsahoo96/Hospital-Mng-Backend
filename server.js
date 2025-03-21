const mongoClient = require("mongodb").MongoClient;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();



const app = express();
const connectionString = "mongodb://127.0.0.1:27017";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(403).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });
        req.user = decoded;
        next();
    });
};

app.post("/signup", async (req, res) => {
    try {
        const client = await mongoClient.connect(connectionString);
        const database = client.db("Hospital-Management-System");
        const usersCollection = database.collection("Users");

        const { name, email, password, role } = req.body;
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { name, email, password: hashedPassword, role };
        await usersCollection.insertOne(user);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const client = await mongoClient.connect(connectionString);
        const database = client.db("Hospital-Management-System");
        const usersCollection = database.collection("Users");

        const { email, password } = req.body;
        console.log("🔹 Received Email:", email);
        console.log("🔹 Received Password:", password);

        const user = await usersCollection.findOne({ email });
        if (!user) {
            console.log("❌ User not found!");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("🔹 Stored Hashed Password:", user.password);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("🔹 Password Match Result:", isPasswordValid); // Should be true

        if (!isPasswordValid) {
            console.log("❌ Password is incorrect!");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });
        console.log("✅ Login Successful!");
        res.json({ message: "Login successful", token });

    } catch (error) {
        console.error("🔥 Server Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});


app.post("/add-medicine",(req,res)=>{
    mongoClient.connect(connectionString).then(clientObj=>{
        const database = clientObj.db("Hospital-Management-System");

        const MedicineDetail = {
            MedicineName : req.body.MedicineName,
            Manufacturer : req.body.Manufacturer,
            MfgDate : req.body.MfgDate,
            ExpiryDate : req.body.ExpiryDate,
            BuyingPrice : req.body.BuyingPrice,
            SellingPrice : req.body.SellingPrice,
            MedicinePerStrip : req.body.MedicinePerStrip,
        }

        database.collection("MedicineDetails").insertOne(MedicineDetail).then(()=>{
            res.json({message : "Medicine Details Added"});
        })
       
    }).catch(error => res.status(500).json({ error: error.message }));
});


app.get("/get-medicine",(req,res)=>{
    mongoClient.connect(connectionString).then(clientObj=>{
        const database = clientObj.db("Hospital-Management-System");
        database.collection("MedicineDetails").find({}).toArray().then(document=>{
            res.send(document)
           res.json({message: document})
        })
    }).catch(error => res.status(500).json({ error: error.message }));
})


app.listen(4545);
console.log("Server Started at Port 4545")
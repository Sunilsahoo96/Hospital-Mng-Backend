const mongoClient = require("mongodb").MongoClient;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();
const connectionString = "mongodb://127.0.0.1:27017";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
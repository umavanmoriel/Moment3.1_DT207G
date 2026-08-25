const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//Initierar express
const app = express();
const port = process.env.Port || 3000;

app.use(cors());
app.use(express.json());

//Koppla till MongoDB
mongoose.connect("mongodb://localhost:27017/arbetserfarenhet_db").then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to database: " + error);
})

//Arbetserfarenheter Schema
const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
        reguired: true
    },
    position : {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false 
    },
    location: {
        type: String,
        required: false 
    }
})

//Inkluderar Schema i databas
const Experience = mongoose.model("Experience", experienceSchema);


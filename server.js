const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//Initierar express
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//Koppla till MongoDB
mongoose.connect("mongodb://localhost:27017/arbetserfarenhet_db").then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to database: " + error);
})

//Skapar schema för Arbetserfarenheter
const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, "Du måste fylla i fält"]
    },
    position : {
        type: String,
        required: [true, "Du måste fylla i fält"]
    },
    startDate: {
        type: Date,
        required: [true, "Du måste fylla i fält"]
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

//Inkluderar schema för Arbetserfarenheter i databas
const Experience = mongoose.model("Experience", experienceSchema, "experience");


//Routes


app.get("/api", async (req,res) => {
    res.json({message: "Welcome to this API"});
})

// READ - Hämta info om alla arbetserfarenheterr från collection experience
app.get("/experience", async (req,res) => {
    try {
        let result = await Experience.find({});

        return res.json(result);
    } catch (error) {
        return res.status(500).json(error );
    }
})


// CREATE - Lägg till ny erfarenhet
app.post('/experience', async (req, res) => {
    // Hämtar info från body
    const { company, position, startDate, endDate, location } = req.body;

    // Skapar en tom array för att samla alla errors
    let errors = [];

    // Validering - alla fält måste fyllas i (förutom endDate, location)
    if (!company || !position || !startDate) {
        errors.push('Företag, position, startdatum  måste fyllas i');
    }

    // Kontrollerar att företagsnamn inte har specialtecken
    if (/[!@#$%^&*()]/.test(company)) {
        errors.push('Företagsnamn får inte innehålla specialtecken som !@#$%^&*()');
    }

    // Om valideringsfel returnerar errors array
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        // Skapar ny erfarenhet
        const experience = new Experience({
            company,
            position,
            startDate,
            endDate: endDate || null,
            location: location || ''
        });

            await experience.save();
        
        res.status(201).json({ 
            message: 'Ny erfarenhet är sparad',
            data: experience
        });
    } catch (error) {
        // Hanterar valideringsfel från Mongoose
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ errors });
        }
        res.status(500).json({ error: error.message });
    }
});


// UPDATE - Uppdatera en erfarenhet efter Id
app.put('/experience/:id', async (req, res) => {
    const { company, position, startDate, endDate,location } = req.body;
    const id = req.params.id;

    // Skapar en tom array för att samla alla errors
    let errors = [];

    // Validering - alla fält måste fyllas i (förutom endDate, location)
    if (!company || !position || !startDate) {
        errors.push('Företag, position, startdatum och beskrivning måste fyllas i');
    }

    // Kontrollerar att företagsnamn inte har specialtecken
    if (/[!@#$%^&*()]/.test(company)) {
        errors.push('Företagsnamn får inte innehålla specialtecken som !@#$%^&*()');
    }

    // Om valideringsfel returnerar errors array
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const experience = await Experience.findByIdAndUpdate(
            id,
            {
                company,
                position,
                startDate,
                endDate: endDate || null,
                location: location || ''
            },
            { returnDocument: 'after', runValidators: true } 
        );

        if (!experience) {
            return res.status(404).json({ error: 'Erfarenhet hittades inte' });
        }

        res.json({ 
            message: 'Erfarenhet uppdaterad',
            data: experience
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ errors });
        }
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Ta bort en erfarenhet efter Id
app.delete('/experience/:id', async (req, res) => {

    try {
        // Försöker hitta och ta bort erfarenheten med Id då returneras felmeddelande med status 404 - Not Found
        const experience = await Experience.findByIdAndDelete(req.params.id);

        // Om ingen erfarenhet hittades med det Id
        if (!experience) {
            return res.status(404).json({ error: 'Erfarenhet med angivet ID finns inte' });
        }

        //Skickar bekräftelse til användaren om erfarenhet togs bort
        res.json({ message: 'Erfarenhet borttagen' });
    } catch (error) {
        //Om fel uppstår returnerar fel 500 - Internal Server Error
        res.status(500).json({ error: error.message });
    }
});

// Starta servern på angiven port
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
})
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express(); 

app.use(cors({
  origin: "https://noahraffensparger.com",
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, 
});

app.post("/submit", async (req, res) => {  
    const {name, email, message, phone_number } = req.body;

    try {
        await pool.query(
            "INSERT INTO form_submissions (name, email, message, phone_number) VALUES ($1, $2, $3, $4)",
            [name, email, message, phone_number]
        );

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: "New Form Submission on noahraffensparger.com",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nPhone Number: ${phone_number}`,
        });

        res.status(200).json({success: true, message: "success"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong'});
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
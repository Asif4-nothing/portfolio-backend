import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors'; // CORS import kiya

dotenv.config();

const app = express();

// CORS allow karein taaki aapka frontend backend se connect ho sake
app.use(cors()); 
app.use(express.json());

// Frontend files serve karne ke liye (agar same jagah host kar rahe ho)
app.use(express.static('public')); 

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill all fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      // parseInt use kiya taaki '0587' jaisi values crash na karein
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.YOUR_EMAIL, 
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    res.json({ ok: true, message: 'Email sent successfully!' });

  } catch (err) {
    console.error('Email Error:', err);
    res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
});

const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
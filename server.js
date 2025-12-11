import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors'; 

dotenv.config();

const app = express();
app.use(cors()); // CORS enabled
app.use(express.json());
// app.use(express.static('public')); // Agar aap frontend yahaan se serve nahi kar rahe toh isko hata sakte hain

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465, // Fix for connection timeout
      secure: true, 
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

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Fly.io automatically sets PORT environment variable, isliye hum use lenge.
const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

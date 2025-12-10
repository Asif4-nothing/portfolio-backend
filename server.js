import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill all fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Maine hardcode kar diya taaki spelling mistake na ho
      port: 465,              // ✅ FIX: 465 Port use kar rahe hain (Better for Render)
      secure: true,           // ✅ FIX: SSL True kar diya
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

    console.log("Email sent successfully");
    res.json({ ok: true, message: 'Email sent successfully!' });

  } catch (err) {
    console.error('Email Error:', err);
    res.status(500).json({ error: 'Failed to send email. Server connection issue.' });
  }
});

const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

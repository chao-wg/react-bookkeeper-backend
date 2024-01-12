import express from "express";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Create an SMTP client configuration
const config = {
  service: "QQ",
  auth: {
    // sender email address
    user: 'no-reply73@qq.com',
    // Authorization code for sender email address
    pass: 'scitxyzelaveiiaf'
  }
}
// Create a mail sender
const transporter = nodemailer.createTransport(config);

// send validation code
const sendValidationCode = (email) => {
  // Generate a 6-digit random verification code
  const validationCode = Math.floor(100000 + Math.random() * 900000);

  // Set mail options
  const mailOptions = {
    from: 'no-reply73@qq.com',
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is: ${validationCode}`
  };

  // Send mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// TODO
// validateEmailAndCode() function is used to verify email and verification code
function validateEmailAndCode(email, code) {
  // Verification logic
  return true;
}

// POST request handler
router.post('/', (req, res) => {
  const {email, code} = req.body;
  // send validation code
  sendValidationCode(email);
  // Verify email and verification code using validateEmailAndCode()
  if (validateEmailAndCode(email, code)) {
    // Verification passed, generate JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    // Return JWT to the client
    res.json({ token });
  } else {
    // Verification failed
    res.status(401).json({ error: 'Invalid email or code' });
  }
});


export default router;

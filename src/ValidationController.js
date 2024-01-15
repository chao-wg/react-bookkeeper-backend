import express from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {sendValidationCode} from "./EmailSender.js";
import {PrismaClient} from "@prisma/client";
dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

// TODO
// validateEmailAndCode() function is used to verify email and verification code
async function validateEmailAndCode(email, code) {
  // Asynchronous verification logic
  // Example: querying a database to check if the code is valid for the given email
  // const isValid = await database.query('SELECT * FROM verification_codes WHERE email = ? AND code = ?', [email, code]);
  // return isValid;
  return true;
}


// POST request handler
router.post('/', async (req, res) => {
  const {email} = req.body;
  // send validation code
  const generatedCode = sendValidationCode(email,'Your verification code')
  // Verify email and verification code using validateEmailAndCode()
  if (generatedCode) {
    // insert a record in table user_validation:bookkeeper through Prisma
    async function main() {
      const user = await prisma.user_validation.create({
        data: {
          user_email: email,
          validation_code: generatedCode,
        },
      })
      console.log(user)
    }
    main()
      .then(async () => {
        await prisma.$disconnect()
      })
      .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
      })
    const userEnteredCode = req.body.code;
    try {
      const isValid = await validateEmailAndCode(email, userEnteredCode);
      if (isValid) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error('No JWT secret found');
        }
        const token = jwt.sign({email}, secret);
        res.json({token});
      } else {
        res.status(400).json({message: 'Invalid code'});
      }
    } catch (error) {
      res.status(500).json({error: 'An error occurred during verification'});
    }
  } else {
    res.status(500).json({error: 'Failed to send verification code'});
  }
});


export default router;

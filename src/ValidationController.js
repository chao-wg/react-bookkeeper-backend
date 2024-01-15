import express from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {sendValidationCode} from "./EmailSender.js";
import {PrismaClient} from "@prisma/client";
dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

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
    res.set({
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '0',
      'X-Content-Type-Options': 'nosniff',
      'X-Download-Options': 'noopen',
      'X-Permitted-Cross-Domain-Policies': 'none',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Type': 'application/json; charset=utf-8',
      'Vary': 'Accept, Origin',
      'ETag': 'W/"29886053549dadaf0204b8c1f407ae9e"',
      'Cache-Control': 'max-age=0, private, must-revalidate',
      'X-Request-Id': '56303a92-de36-45de-a4cd-1aa06a8e9ff6',
      'X-Runtime': '0.007657',
      'Content-Length': '118'
    });
  } else {
    res.status(500).json({error: 'Failed to send verification code'});
  }
});


export default router;

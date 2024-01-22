import express from "express";
import dotenv from 'dotenv';
import {sendValidationCode} from "./lib/EmailSender.js";
import {PrismaClient} from "@prisma/client";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

// POST request handler
router.post('/', async (req, res) => {
  const {email} = req.body;
  // send validation code
  const generatedCode = sendValidationCode({to: email, subject: 'Your verification code'})
  // If successfully sent, insert a record in table user_validation:bookkeeper through Prisma
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
      'X-Download-Options': 'noopen', //todo: what?
      'X-Permitted-Cross-Domain-Policies': 'none', //todo: what?
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Type': 'application/json; charset=utf-8',
      'Vary': 'Accept, Origin',
      'Cache-Control': 'max-age=0, private, must-revalidate',
    });
  } else {
    res.status(500).json({error: 'Failed to send verification code'});
  }
});


export default router;

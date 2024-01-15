import express from 'express';
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

const router = express.Router();

// validateEmailAndCode() function is used to verify email and verification code
async function validateEmailAndCode(email, code) {
  try {
    // look for the most recent validation_code for the given email through Prisma
    // if the validation_code is the same as the given code, return true
    // otherwise, return false
    const latestCode = await prisma.user_validation.findFirst({
      where: {
        user_email: email,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
    return latestCode.validation_code === code;
  } catch (error) {
    console.log(error)
    throw new Error('An error occurred while validating email and code');
  }
}

router.post('/', async (req, res) => {
  const { email, code } = req.body; // Extract email and code from request body
  try {
    const isValid = await validateEmailAndCode(email, code);
    if (isValid) {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('No JWT secret found');
      }
      const token = jwt.sign({email}, secret);
      res.status(200).json({jwt: token});
    } else {
      res.status(422).json({"errors":{"email":["Email or code is invalid"]}});
    }
  } catch (error) {
    res.status(500).json({error: 'An error occurred during verification'});
  } finally {
    await prisma.$disconnect(); // Disconnect the Prisma client after all database operations are completed
  }
});

export default router;

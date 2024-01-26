import express from "express";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  // extract jwt token from header
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({error: 'Haven\'t logged in yet.(Message from server)'});
  }
  // validate jwt token
  let email;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('No JWT secret found');
    }
    const email = (jwt.verify(token, secret) as { email: string }).email;
  } catch (error) {
    return res.status(401).json({error: 'Validation failed.(Message from server)'});
  }
  // check user info in table: user_info and return it
  try {
    const userInfo = await prisma.user_info.findFirst({
      where: {
        email: email,
      },
    });
    if (userInfo) {
      return res.status(200).json(userInfo);
    } else {
      return res.status(401).json({error: 'User not found.(Message from server)'});
    }
  } catch (error) {
    return res.status(500).json({error: 'An error occurred while fetching user info.(Message from server)'});
  } finally {
    await prisma.$disconnect();
  }

})

export default router;

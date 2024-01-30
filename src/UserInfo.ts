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
  // check user info in table: user_info and return it
  try {
    // validate jwt token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return null;
    }
    const email = (jwt.verify(token, secret) as { email: string }).email;
    const userInfo = await prisma.user_info.findFirst({
      where: {
        email,
      },
    });
    if (userInfo) {
      const responseBody = {
        "resource": {
          ...userInfo
        }
      }
      return res.status(200).json(responseBody);
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

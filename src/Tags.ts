import express from "express";
import {PrismaClient} from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const router = express.Router();

async function getUserByJWT(token: string) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('No JWT secret found');
    }
    const email = (jwt.verify(token, secret) as { email: string }).email;
    return await prisma.user_info.findUnique({
      where: {
        email: email
      }
    });
  } catch (error) {
    throw new Error('No JWT secret found');
  }

}

router.post('/', async (req, res) => {
  const {kind, sign, name} = req.body;
  try {
    // extract jwt token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({error: 'Haven\'t logged in yet.(Message from server)'});
    }
    const user = await getUserByJWT(token);
    if (!user) {
      return res.status(401).json({error: 'User not found.(Message from server)'});
    }
    // form validation is already performed in the frontend
    // insert tag into db
    const tag = await prisma.tags_collection.create(
      {
        data: {
          user_id: user?.id,
          kind: kind,
          sign: sign,
          name: name,
        }
      }
    )
    return res.status(288).json(tag);
  } catch (error) {
    return res.status(401).json({error: 'Validation failed.(Message from server)'});
  } finally {
    await prisma.$disconnect();
  }
})
export default router;

router.get('/', async (req, res) => {
  const {page, kind} = req.query;

  // Convert page to number and handle default case
  const pageNumber = Number(page) || 1;
  const itemsPerPage = 10; // or any number you prefer

  // Calculate the offset for pagination
  const offset = (pageNumber - 1) * itemsPerPage;

  try {
    // get user info
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({error: 'Haven\'t logged in yet.(Message from server)'});
    }
    const user = await getUserByJWT(token);
    if (!user) {
      return res.status(401).json({error: 'User not found.(Message from server)'});
    }
    // push tags stream
    const tagCount = await prisma.tags_collection.count({
      where: {
        user_id: user.id,
        kind: kind as 'expenses' || 'income',
      }
    })
    const tags = await prisma.tags_collection.findMany({
      where: {
        user_id: user.id,
        kind: kind as 'expenses' || 'income',
      },
      skip: offset,
      take: itemsPerPage,
    });
    const body = {
      resources: tags,
      pager: {
        page,
        per_page: itemsPerPage,
        count: tagCount
      }
    }
    return res.status(200).json(body);
  } catch (error) {
    return res.status(500).json({error: 'An error occurred while fetching tags.'});
  } finally {
    await prisma.$disconnect();
  }
});

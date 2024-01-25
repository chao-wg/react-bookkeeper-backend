import express from "express";
import {PrismaClient} from "@prisma/client";
import jwt from "jsonwebtoken";
import {getUserByJWT} from "./Tags.js";

const prisma = new PrismaClient();

const router = express.Router();

router.post('/', async (req, res) => {
  const {amount, kind, happened_at, tag_ids} = req.body;
  try {
    // get user using jwt
    const user = await getUserByJWT(req);
    if (!user) {
      return res.status(401).json({error: 'User not found.(Message from server)'});
    }
    const account = await prisma.accounts.create(
      {
        data: {
          user_id: user?.id,
          amount,
          kind,
          happened_at,
          tag_ids
        }
      }
    )
    const tag = await prisma.tags_collection.findUnique({
      where: {
        id: tag_ids[0]
      }
    })
    const responseBody = {
      "resource": {
        ...account,
        "tags": [tag]
      }
    }
    return res.set(process.env.RES_HEADERS).status(200).json(responseBody);
  } catch (error) {
    return res.status(401).json({error: 'An error occurred while fetching tags.(Message from server)'});
  } finally {
    prisma.$disconnect()
  }
})

export default router;

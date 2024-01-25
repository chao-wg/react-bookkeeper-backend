import express from "express";
import {PrismaClient} from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const router = express.Router();

async function getUserByJWT(req: express.Request) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return null;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return null;
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
    const user = await getUserByJWT(req);
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
    return res.set(process.env.RES_HEADERS).status(200).json(tag);
  } catch (error) {
    return res.status(401).json({error: 'Validation failed.(Message from server)'});
  } finally {
    await prisma.$disconnect();
  }
})

router.get('/', async (req, res) => {
  const {page, kind} = req.query;

  // Convert page to number and handle default case
  const pageNumber = Number(page) || 1;
  const itemsPerPage = 10; // or any number you prefer

  // Calculate the offset for pagination
  const offset = (pageNumber - 1) * itemsPerPage;

  try {
    // get user info
    const user = await getUserByJWT(req);
    if (!user) {
      return res.status(401).json({error: 'User not found.(Message from server)'});
    }
    // push tags stream
    const tagsCount = await prisma.tags_collection.count({
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
    const responseBody = {
      resources: tags,
      pager: {
        page,
        per_page: itemsPerPage,
        count: tagsCount
      }
    }
    return res.set(process.env.RES_HEADERS).status(200).json(responseBody);
  } catch (error) {
    return res.status(500).json({error: 'An error occurred while fetching tags.(Message from server)'});
  } finally {
    await prisma.$disconnect();
  }
});

router.get('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    // get user info
    const user = await getUserByJWT(req);
    if (!user) {
      return res.status(401).json({error: 'User not found.(Message from server)'});
    }

    // fetch the tag with the provided id
    const tag = await prisma.tags_collection.findFirst({
      where: {
        user_id: user.id,
        id: Number(id),
      },
    });

    if (!tag) {
      return res.status(404).json({error: 'Tag not found.(Message from server)'});
    }

    return res.set(process.env.RES_HEADERS).status(200).json(tag);
  } catch (error) {
    return res.status(500).json({error: 'An error occurred while fetching the tag.(Message from server)'});
  } finally {
    await prisma.$disconnect();
  }
});

router.patch('/:id', async (req, res) => {
  const {id} = req.params;
  const {sign, name} = req.body;

  try {
    // get user info
    const user = await getUserByJWT(req);
    if (!user) {
      return res.status(401).json({error: 'User not found.(Message from server)'});
    }
    // update the tag
    const updatedTag = await prisma.tags_collection.update({
      where: {id: Number(id)},
      data: {sign, name, updated_at: new Date()},
    });
    return res.set(process.env.RES_HEADERS).status(200).json(updatedTag);
  } catch (error) {
    return res.status(500).json({error: 'An error occurred while updating the tag.(Message from server)'});
  } finally {
    await prisma.$disconnect();
  }
});

router.delete('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    // get user info
    const user = await getUserByJWT(req);
    if (!user) {
      return res.status(401).json({error: 'User not found.(Message from server)'});
    }
    // delete the tag
    await prisma.tags_collection.delete({
      where: {id: Number(id)},
    });
    return res.set(process.env.RES_HEADERS).status(200).json({message: 'Tag deleted successfully.'});
  } catch (error) {
    return res.status(500).json({error: 'An error occurred while deleting the tag.(Message from server)'});
  } finally {
    await prisma.$disconnect();
  }
})

export default router;

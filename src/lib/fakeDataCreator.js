import {PrismaClient} from "@prisma/client";
import {faker} from '@faker-js/faker'

const prisma = new PrismaClient();

function getRandomKind() {
  return Math.random() < 0.5 ? 'income' : 'expenses';
}

async function generateRandomRecords() {
  for (let i = 0; i < 10; i++) {
    const name = faker.lorem.word();
    const sign = faker.internet.emoji()
    const kind = getRandomKind();

    await prisma.tags_collection.create({
      data: {
        user_id: 2,
        name: name,
        sign: sign,
        kind: kind,
      },
    });
  }
}

generateRandomRecords().catch(e => {
  console.error(e);
  process.exit(1);
});

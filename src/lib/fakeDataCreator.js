import {PrismaClient} from "@prisma/client";
import {faker} from "@faker-js/faker";

const prisma = new PrismaClient();

async function createRandomAccounts() {
  for (let i = 0; i < 15; i++) {

    await prisma.accounts.create({
      data: {
        user_id: 2,
        amount: faker.number.int({min: 1, max: 999999}), // Random amount
        note: faker.lorem.slug({min: 2, max: 9}), // Random note
        tag_id: faker.number.int({min: 131, max: 144}), // Random tag id
        happened_at: new Date(), // Current date
        kind: 'income',
      },
    });
  }

  await prisma.$disconnect();
}

createRandomAccounts().catch(e => {
  console.error(e);
  process.exit(1);
});

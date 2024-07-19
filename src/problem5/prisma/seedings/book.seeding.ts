import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

async function main() {
  const client = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
  await client.book.createMany({
    data: Array.from({ length: 50 }, () => {
      return {
        title: faker.lorem.words({ min: 3, max: 6 }),
        author: faker.person.fullName(),
        description: faker.lorem.paragraph({ min: 2, max: 3 }),
        publishYear: faker.helpers.fromRegExp(/20[0-9]{2}/),
      };
    }),
  });
  process.exit(0);
}

main();

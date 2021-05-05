import { connect, disconnect, getConnection, getRepository } from './database';

class Book {
  title!: string;
  pages!: number;
}

const client = getConnection();

const run = async () => {
  try {
    await connect();
    const repo = getRepository<Book>(client, 'library', 'Books');

    const result = await repo.create({ title: 'Diary', pages: 20 });
    console.log(result);
  } finally {
    await disconnect();
  }
};

run().then(() => process.exit(0));

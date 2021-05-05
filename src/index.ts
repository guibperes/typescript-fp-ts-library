import { MongoClient } from 'mongodb';
import { getRepository } from './base';

class Book {
  title!: string;
  pages!: number;
}

const client = new MongoClient('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();
    const repo = getRepository<Book>(client, 'library', 'Books');

    const result = await repo.create({ title: 'Diary', pages: 20 });
    console.log(result);
  } finally {
    await client.close();
  }
};

run().then(() => process.exit(0));

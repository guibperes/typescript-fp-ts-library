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

    const result = await repo.deleteById('60929a2bc2374a96f333fa0a');
    console.log(result);

    // const result = await repo.create({ title: 'Diary', pages: 20 });
    // console.log(result);

    // const update = await repo.updateById(result.id, {
    //   title: 'Diary',
    //   pages: 30,
    // });
    // console.log(update);
  } finally {
    await disconnect();
  }
};

run().then(() => process.exit(0));

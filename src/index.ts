import { pipe } from 'fp-ts/function';

import './config/alias';
import { connect, disconnect } from './database';
import { bookService } from './modules/book/service';
import { getController } from './modules/book/controller';
import { book } from './modules/book/entity';

const run = async () => {
  try {
    await connect();

    const controller = getController(bookService, book);

    const resultTask = pipe(
      controller.create({
        title: 'Diary',
        pages: 200,
        some: 'think',
      }),
    );

    await resultTask()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  } finally {
    await disconnect();
  }
};

run().then(() => process.exit(0));

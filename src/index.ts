import { pipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';

import './config/alias';
import { connect, disconnect } from './database';
import { bookService } from './modules/book/service';
import { getController } from './modules/book/controller';
import { book } from './modules/book/entity';

const run = async () => {
  try {
    await connect();

    const controller = getController(bookService, book);

    pipe(
      await controller.create({ title: 'Diary', pages: 200 })(),
      fold(
        error => console.log(error),
        result => console.log(result),
      ),
    );
  } finally {
    await disconnect();
  }
};

run().then(() => process.exit(0));

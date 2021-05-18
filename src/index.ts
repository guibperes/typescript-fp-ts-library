import { pipe } from 'fp-ts/function';
import { fromOption, fold } from 'fp-ts/Either';

import './config/alias';
import { connect, disconnect } from './database';
// import { bookService } from './modules/book/service';
import { bookRepository } from './modules/book/repository';

const run = async () => {
  try {
    await connect();

    pipe(
      await bookRepository.create({ title: 'Diary', pages: 500 }),
      fromOption(() => ({ error: 'deu ruim' })),
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

import { pipe } from 'fp-ts/function';
import { fold, fromOption } from 'fp-ts/Either';

import './config/alias';
import { connect, disconnect } from './database';
import { bookRepository } from './modules/book/repository';
import { bookService } from './modules/book/service';

const run = async () => {
  try {
    await connect();

    pipe(
      await bookService.updateById('60929aa5afae2741b29d87e9', {
        title: 'My Diary',
        pages: 100,
      }),
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

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
      await bookRepository.deleteById('60929aba7831de961a96cabb'),
      fromOption(() => ({ error: 'Deu ruim' })),
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

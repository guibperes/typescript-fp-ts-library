import { pipe } from 'fp-ts/function';
import { fold, fromOption } from 'fp-ts/Either';

import './config/alias';
import { connect, disconnect } from './database';
// import { bookService } from './modules/book/service';
import { bookRepository } from './modules/book/repository';

const run = async () => {
  try {
    await connect();

    // const result = await bookRepository.updateById('60a3e06661f74c548e0adcbe', {
    //   title: 'My Diary',
    //   pages: 200,
    // });
    pipe(
      await bookRepository.updateById('60929aa5afae2741b29d87e9', {
        title: 'My Diary',
        pages: 100,
      }),
      fromOption(() => ({ error: 'Deu Ruim' })),
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

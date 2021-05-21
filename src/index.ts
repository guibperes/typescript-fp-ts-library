import { pipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';

import './config/alias';
import { connect, disconnect } from './database';
import { bookController } from './modules/book/controller';

const run = async () => {
  try {
    await connect();

    pipe(
      // await bookController.create({ title: 'Diary', pages: 200 })(),
      // await bookController.updateById('60929c69cedc8f5e9f4b64aa', {
      //   title: 'Diary',
      //   pages: 50,
      // })(),
      // await bookController.deleteById('60929c69cedc8f5e9f4b64aa')(),
      await bookController.findById('60a7fec0353caf9d7f0d9a93')(),
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

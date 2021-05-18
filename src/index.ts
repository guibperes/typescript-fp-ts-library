import { pipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import './config/alias';
import { connect, disconnect } from './database';
import { bookService } from './modules/book/service';
import { getController } from './modules/book/controller';

const run = async () => {
  try {
    await connect();

    const controller = getController(bookService);
    const result = await controller.create({
      title: 'Diary',
      pages: 200,
      some: 'think',
    });
    console.log(result);
    // pipe(
    //   await bookService.findById('60929c547f9f710db4ff3d5f'),
    //   fold(
    //     error => console.log(error),
    //     result => console.log(result),
    //   ),
    // );
  } finally {
    await disconnect();
  }
};

run().then(() => process.exit(0));

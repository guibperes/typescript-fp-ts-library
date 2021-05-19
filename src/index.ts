import { getOrElse } from 'fp-ts/TaskEither';
import './config/alias';
import { connect, disconnect } from './database';
import { bookService } from './modules/book/service';
import { getController } from './modules/book/controller';
import { book } from './modules/book/entity';

const run = async () => {
  try {
    await connect();

    const controller = getController(bookService, book);

    const createTaskEither = controller.create({ title: 'Diary', pages: 200 });
    const result = getOrElse(error => error as any)(createTaskEither);

    console.log(await result());
  } finally {
    await disconnect();
  }
};

run().then(() => process.exit(0));

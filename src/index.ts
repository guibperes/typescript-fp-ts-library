import './config/alias';
import { connect, disconnect } from './database';
import { bookService } from './modules/book/service';

const run = async () => {
  try {
    await connect();

    const result = await bookService.findById('60929aa5afae2741b29d87e9');

    console.log(result);
  } finally {
    await disconnect();
  }
};

run().then(() => process.exit(0));

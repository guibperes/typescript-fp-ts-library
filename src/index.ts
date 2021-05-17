import './config/alias';
import { connect, disconnect } from './database';
import { bookRepository } from './modules/book/repository';

const run = async () => {
  try {
    await connect();

    const result = await bookRepository.findById('60929aa5afae2741b29d87e9');
    console.log(result);
    console.log(Object.fromEntries(Object.entries(result)));
  } finally {
    await disconnect();
  }
};

run().then(() => process.exit(0));

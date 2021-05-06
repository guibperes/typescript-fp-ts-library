import { MongoClient } from 'mongodb';
import { logger } from '../libs';

const client = new MongoClient('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const getConnection = () => client;

export const connect = async () => {
  try {
    await client.connect();
    logger.info('Database connected');
  } catch (error) {
    logger.error('Cannot connect on database');
    logger.error(error);

    process.exit(1);
  }
};

export const disconnect = async () => {
  try {
    await client.close();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error('Cannot disconnect on database');
    logger.error(error);

    process.exit(1);
  }
};

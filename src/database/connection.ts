import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const getConnection = () => client;

export const connect = async () => {
  try {
    await client.connect();
    console.log('Database connected');
  } catch (error) {
    console.log('Cannot connect on database');
    console.error(error);

    process.exit(1);
  }
};

export const disconnect = async () => {
  try {
    await client.close();
    console.log('Database disconnected');
  } catch (error) {
    console.log('Cannot disconnect on database');
    console.error(error);

    process.exit(1);
  }
};

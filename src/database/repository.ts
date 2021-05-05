import { MongoClient } from 'mongodb';

export type Id = {
  id: string;
};

export interface Repository<E> {
  create: (entity: E) => Promise<Id>;
}

const create = (
  client: MongoClient,
  database: string,
  entityName: string,
) => async <E>(entity: E): Promise<Id> => {
  const collectionName = entityName.toLowerCase();
  const collection = client.db(database).collection(collectionName);

  const result = await collection.insertOne(entity);
  return { id: result.insertedId };
};

export const getRepository = <E>(
  client: MongoClient,
  database: string,
  entityName: string,
): Repository<E> => ({ create: create(client, database, entityName) });

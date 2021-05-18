import { MongoClient, ObjectId, Collection } from 'mongodb';
import { pipe } from 'fp-ts/function';
import { Option, none, some } from 'fp-ts/Option';

export type Id = {
  id: string;
};

export interface Repository<E> {
  create: (entity: E) => Promise<Option<Id>>;
  updateById: (id: string, entity: E) => Promise<E>;
  deleteById: (id: string) => Promise<boolean>;
  findById: (id: string) => Promise<E>;
  getCollection: () => Collection<E>;
}

const getCollection = <E>(
  client: MongoClient,
  database: string,
  entityName: string,
): Collection<E> =>
  client.db(database.toLowerCase()).collection<E>(entityName.toLowerCase());

const objectEntriesMap = <E>(array: [string, E][]) =>
  array.map(([key, value]) => (key === '_id' ? ['id', value] : [key, value]));

const resolveId = <E>(entity: E): E =>
  pipe(entity, Object.entries, objectEntriesMap, Object.fromEntries);

const create = (
  client: MongoClient,
  database: string,
  entityName: string,
) => async <E>(entity: E): Promise<Option<Id>> => {
  const collection = getCollection(client, database, entityName);

  const result = await collection.insertOne(entity);
  return result.insertedId
    ? some({ id: result.insertedId.toHexString() })
    : none;
};

const updateById = (
  client: MongoClient,
  database: string,
  entityName: string,
) => async <E>(id: string, entity: E): Promise<E> => {
  const collection = getCollection(client, database, entityName);

  const result = await collection.findOneAndUpdate(
    { _id: id },
    { $set: entity },
    { returnOriginal: false },
  );
  return resolveId(result.value as E);
};

const deleteById = (
  client: MongoClient,
  database: string,
  entityName: string,
) => async (id: string): Promise<boolean> => {
  const collection = getCollection(client, database, entityName);

  const result = await collection.findOneAndDelete({
    _id: ObjectId.createFromHexString(id),
  });

  return Boolean(result.value);
};

const findById = (
  client: MongoClient,
  database: string,
  entityName: string,
) => async <E>(id: string): Promise<E> => {
  const collection = getCollection(client, database, entityName);

  const result = await collection.findOne({
    _id: ObjectId.createFromHexString(id),
  });

  return resolveId(result as E);
};

export const getRepository = <E>(
  client: MongoClient,
  database: string,
  entityName: string,
): Repository<E> => ({
  create: create(client, database, entityName),
  updateById: updateById(client, database, entityName),
  deleteById: deleteById(client, database, entityName),
  findById: findById(client, database, entityName),
  getCollection: () => getCollection(client, database, entityName),
});

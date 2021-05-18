import { MongoClient, ObjectId, Collection } from 'mongodb';
import { pipe } from 'fp-ts/function';
import { Option, none, some } from 'fp-ts/Option';

export type Id = {
  id: string;
};

export interface Repository<E> {
  create: (entity: E) => Promise<Option<Id>>;
  updateById: (id: string, entity: E) => Promise<Option<E>>;
  deleteById: (id: string) => Promise<Option<boolean>>;
  findById: (id: string) => Promise<Option<E>>;
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
) => async <E>(id: string, entity: E): Promise<Option<E>> => {
  const collection = getCollection(client, database, entityName);

  const result = await collection.findOneAndUpdate(
    { _id: ObjectId.createFromHexString(id) },
    { $set: entity },
    { returnOriginal: false },
  );
  return result.value ? some(resolveId(result.value as E)) : none;
};

const deleteById = (
  client: MongoClient,
  database: string,
  entityName: string,
) => async (id: string): Promise<Option<boolean>> => {
  const collection = getCollection(client, database, entityName);

  const result = await collection.findOneAndDelete({
    _id: ObjectId.createFromHexString(id),
  });
  return result.value ? some(Boolean(result.value)) : none;
};

const findById = (
  client: MongoClient,
  database: string,
  entityName: string,
) => async <E>(id: string): Promise<Option<E>> => {
  const collection = getCollection(client, database, entityName);

  const result = await collection.findOne({
    _id: ObjectId.createFromHexString(id),
  });
  return result ? some(resolveId(result as E)) : none;
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

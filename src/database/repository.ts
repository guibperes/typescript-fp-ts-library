import { MongoClient, ObjectId, Collection } from 'mongodb';
import { pipe } from 'fp-ts/function';
import { TaskEither, tryCatch, chain, right, left } from 'fp-ts/TaskEither';

import { ServiceError } from '@/base';

export type Id = {
  id: string;
};

export interface Repository<E> {
  create: (entity: E) => TaskEither<ServiceError, Id>;
  updateById: (id: string, entity: E) => TaskEither<ServiceError, E>;
  deleteById: (id: string) => TaskEither<ServiceError, boolean>;
  findById: (id: string) => TaskEither<ServiceError, E>;
  getCollection: () => Collection<E>;
}

const getCollection = <E>(
  client: MongoClient,
  database: string,
  entityName: string,
): Collection<E> =>
  client.db(database.toLowerCase()).collection<E>(entityName.toLowerCase());

const objectEntriesMap = (array: [string, any][]) =>
  array.map(([key, value]) => (key === '_id' ? ['id', value] : [key, value]));

const resolveId = <E>(entity: E): E =>
  pipe(entity, Object.entries, objectEntriesMap, Object.fromEntries);

const create = (client: MongoClient, database: string, entityName: string) => <
  E
>(
  entity: E,
): TaskEither<ServiceError, Id> => {
  const collection = getCollection(client, database, entityName);

  return pipe(
    tryCatch(
      () => collection.insertOne(entity),
      (): ServiceError => ({ error: 'Cannot insert entity on database' }),
    ),
    chain(result =>
      result.insertedId
        ? right({ id: result.insertedId.toHexString() })
        : left({ error: 'Cannot insert entity on database' }),
    ),
  );
};

const updateById = (
  client: MongoClient,
  database: string,
  entityName: string,
) => <E>(id: string, entity: E): TaskEither<ServiceError, E> => {
  const collection = getCollection(client, database, entityName);

  return pipe(
    tryCatch(
      () =>
        collection.findOneAndUpdate(
          { _id: ObjectId.createFromHexString(id) },
          { $set: entity },
          { returnOriginal: false },
        ),
      (): ServiceError => ({ error: 'Cannot update entity with provided id' }),
    ),
    chain(result =>
      result.value
        ? right(resolveId(result.value as E))
        : left({ error: 'Cannot update entity with provided id' }),
    ),
  );
};

const deleteById = (
  client: MongoClient,
  database: string,
  entityName: string,
) => (id: string): TaskEither<ServiceError, boolean> => {
  const collection = getCollection(client, database, entityName);

  return pipe(
    tryCatch(
      () =>
        collection.findOneAndDelete({ _id: ObjectId.createFromHexString(id) }),
      (): ServiceError => ({ error: 'Cannot delete entity with provided id' }),
    ),
    chain(result =>
      result.value
        ? right(Boolean(result.value))
        : left({ error: 'Cannot delete entity with provided id' }),
    ),
  );
};

const findById = (
  client: MongoClient,
  database: string,
  entityName: string,
) => <E>(id: string): TaskEither<ServiceError, E> => {
  const collection = getCollection(client, database, entityName);

  return pipe(
    tryCatch(
      () => collection.findOne({ _id: ObjectId.createFromHexString(id) }),
      (): ServiceError => ({ error: 'Cannot find entity with provided id' }),
    ),
    chain(result =>
      result
        ? right(resolveId(result as E))
        : left({ error: 'Cannot find entity with provided id' }),
    ),
  );
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

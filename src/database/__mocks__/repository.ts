/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectId, Collection } from 'mongodb';
import { TaskEither, right, left } from 'fp-ts/TaskEither';

import { ServiceError } from '@/base';
import { Repository, Id } from '../repository';

export const getObjectIdFromDate = (date = Date.now()) =>
  ObjectId.createFromTime(date).toHexString();

export const getRepositoryMock = <E>(): Repository<E> => ({
  create: (entity: E): TaskEither<ServiceError, Id> =>
    right({ id: getObjectIdFromDate() }),

  updateById: (id: string, entity: E): TaskEither<ServiceError, E> =>
    right({ id, ...entity }),

  deleteById: (id: string): TaskEither<ServiceError, boolean> => right(true),

  findById: (id: string): TaskEither<ServiceError, E> => right({ id } as any),

  getCollection: () => ({} as Collection),
});

export const getRepositoryErrorMock = <E>(): Repository<E> => ({
  create: (entity: E): TaskEither<ServiceError, Id> =>
    left({ error: 'Mocked error on function create' }),

  updateById: (id: string, entity: E): TaskEither<ServiceError, E> =>
    left({ error: 'Mocked error on function updateById' }),

  deleteById: (id: string): TaskEither<ServiceError, boolean> =>
    left({ error: 'Mocked error on function deleteById' }),

  findById: (id: string): TaskEither<ServiceError, E> =>
    left({ error: 'Mocked error on function findById' }),

  getCollection: () => ({} as Collection),
});

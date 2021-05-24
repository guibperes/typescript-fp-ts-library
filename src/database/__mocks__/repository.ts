/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectId, Collection } from 'mongodb';
import { TaskEither, right, left } from 'fp-ts/TaskEither';

import { ServiceError } from '@/base';
import { Repository, Id } from '../repository';

export const getRepositoryMock = <E>(): Repository<E> => ({
  create: (entity: E): TaskEither<ServiceError, Id> =>
    right({ id: ObjectId.createFromTime(Date.now()).toHexString() }),

  updateById: (id: string, entity: E): TaskEither<ServiceError, E> =>
    right({ id, ...entity }),

  deleteById: (id: string): TaskEither<ServiceError, boolean> => right(true),

  findById: (id: string): TaskEither<ServiceError, E> => right({} as E),

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

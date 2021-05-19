import { TaskEither } from 'fp-ts/TaskEither';

import { Id, Repository } from '@/database';
import { ServiceError } from './error';

export interface Service<E> {
  create: (entity: E) => TaskEither<ServiceError, Id>;
  updateById: (id: string, entity: E) => TaskEither<ServiceError, E>;
  deleteById: (id: string) => TaskEither<ServiceError, boolean>;
  findById: (id: string) => TaskEither<ServiceError, E>;
}

const create = <E>(repository: Repository<E>) => (
  entity: E,
): TaskEither<ServiceError, Id> => repository.create(entity);

const updateById = <E>(repository: Repository<E>) => (
  id: string,
  entity: E,
): TaskEither<ServiceError, E> => repository.updateById(id, entity);

const deleteById = <E>(repository: Repository<E>) => (
  id: string,
): TaskEither<ServiceError, boolean> => repository.deleteById(id);

const findById = <E>(repository: Repository<E>) => (
  id: string,
): TaskEither<ServiceError, E> => repository.findById(id);

export const getService = <E>(repository: Repository<E>): Service<E> => ({
  create: create(repository),
  updateById: updateById(repository),
  deleteById: deleteById(repository),
  findById: findById(repository),
});

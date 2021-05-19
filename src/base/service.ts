import { pipe } from 'fp-ts/function';
import { Either, fromOption } from 'fp-ts/Either';
import { TaskEither } from 'fp-ts/TaskEither';

import { Id, Repository } from '@/database';
import { ServiceError } from './error';

export interface Service<E> {
  create: (entity: E) => TaskEither<ServiceError, Id>;
  updateById: (id: string, entity: E) => Promise<Either<ServiceError, E>>;
  deleteById: (id: string) => Promise<Either<ServiceError, boolean>>;
  findById: (id: string) => Promise<Either<ServiceError, E>>;
}

const create = <E>(repository: Repository<E>) => (
  entity: E,
): TaskEither<ServiceError, Id> => repository.create(entity);

const updateById = <E>(repository: Repository<E>) => async (
  id: string,
  entity: E,
): Promise<Either<ServiceError, E>> =>
  pipe(
    await repository.updateById(id, entity),
    fromOption(() => ({ error: 'Cannot update entity with provided id' })),
  );

const deleteById = <E>(repository: Repository<E>) => async (
  id: string,
): Promise<Either<ServiceError, boolean>> =>
  pipe(
    await repository.deleteById(id),
    fromOption(() => ({ error: 'Cannot delete entity with provided id' })),
  );

const findById = <E>(repository: Repository<E>) => async (
  id: string,
): Promise<Either<ServiceError, E>> =>
  pipe(
    await repository.findById(id),
    fromOption(() => ({ error: 'Cannot find entity with provided id' })),
  );

export const getService = <E>(repository: Repository<E>): Service<E> => ({
  create: create(repository),
  updateById: updateById(repository),
  deleteById: deleteById(repository),
  findById: findById(repository),
});

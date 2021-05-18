import { pipe } from 'fp-ts/function';
import { Either, fromOption } from 'fp-ts/Either';
import { Id, Repository } from '@/database';

export type ServiceError = {
  error: string;
};

export interface Service<E> {
  create: (entity: E) => Promise<Either<ServiceError, Id>>;
  updateById: (id: string, entity: E) => Promise<E>;
  deleteById: (id: string) => Promise<boolean>;
  findById: (id: string) => Promise<E>;
}

const create = <E>(repository: Repository<E>) => async (
  entity: E,
): Promise<Either<ServiceError, Id>> =>
  pipe(
    await repository.create(entity),
    fromOption(() => ({ error: 'Cannot insert entity on database' })),
  );

const updateById = <E>(repository: Repository<E>) => async (
  id: string,
  entity: E,
): Promise<E> => repository.updateById(id, entity);

const deleteById = <E>(repository: Repository<E>) => async (id: string) =>
  repository.deleteById(id);

const findById = <E>(repository: Repository<E>) => async (id: string) =>
  repository.findById(id);

export const getService = <E>(repository: Repository<E>): Service<E> => ({
  create: create(repository),
  updateById: updateById(repository),
  deleteById: deleteById(repository),
  findById: findById(repository),
});

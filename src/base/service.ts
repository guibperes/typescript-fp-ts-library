import { Id, Repository } from '@/database';

export interface Service<E> {
  create: (entity: E) => Promise<Id>;
  updateById: (id: string, entity: E) => Promise<E>;
  deleteById: (id: string) => Promise<boolean>;
  findById: (id: string) => Promise<E>;
}

const create = <E>(repository: Repository<E>) => async (
  entity: E,
): Promise<Id> => repository.create(entity);

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

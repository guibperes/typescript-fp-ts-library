import { pipe } from 'fp-ts/function';
import { Either } from 'fp-ts/Either';
import { Id } from '@/database';
import { ServiceError } from './service';

export interface Controller<E> {
  create: (body: object) => Promise<Either<ServiceError, Id>>;
  updateById: (id: string, body: object) => Promise<Either<ServiceError, E>>;
  deleteById: (id: string) => Promise<Either<ServiceError, boolean>>;
  findById: (id: string) => Promise<Either<ServiceError, E>>;
}

const filterBodyMap = (body: object) => (array: [string, any][]) =>
  array.map(([key]) => [key, body[key]]);

export const filterBody = <E>(props: E) => (body: object): E =>
  pipe(props, Object.entries, filterBodyMap(body), Object.fromEntries);

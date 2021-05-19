import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { Id } from '@/database';
import { ServiceError } from './error';

export interface Controller<E> {
  create: (body: object) => TaskEither<ServiceError, Id>;
  updateById: (id: string, body: object) => TaskEither<ServiceError, E>;
  deleteById: (id: string) => TaskEither<ServiceError, boolean>;
  findById: (id: string) => TaskEither<ServiceError, E>;
}

const filterBodyMap = (body: object) => (array: [string, any][]) =>
  array.map(([key]) => [key, body[key]]);

export const filterBody = <E>(props: E) => (body: object): E =>
  pipe(props, Object.entries, filterBodyMap(body), Object.fromEntries);

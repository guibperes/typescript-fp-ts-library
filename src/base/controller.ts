import { pipe } from 'fp-ts/function';
import { TaskEither, fromEither, map, mapLeft, chain } from 'fp-ts/TaskEither';
import { TypeC, Props } from 'io-ts';

import { Id, validateObjectId } from '@/database';
import { ServiceError } from './error';
import { Service } from './service';

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

export const decoderToUnknown = (content: unknown) => content;

const create = <E, T>(service: Service<E>, bookType: TypeC<T & Props>) => (
  body: object,
): TaskEither<ServiceError, Id> =>
  pipe(
    body,
    filterBody(bookType.props),
    bookType.decode,
    fromEither,
    mapLeft((errors): ServiceError => ({ error: errors.toString() })),
    map(bookValidationType => decoderToUnknown(bookValidationType)),
    chain(bookData => service.create(bookData as E)),
  );

const updateById = <E, T extends Props>(
  service: Service<E>,
  bookType: TypeC<T>,
) => (id: string, body: object): TaskEither<ServiceError, E> =>
  pipe(
    body,
    filterBody(bookType.props),
    bookType.decode,
    fromEither,
    mapLeft((errors): ServiceError => ({ error: errors.toString() })),
    chain(bookData => validateObjectId(id, bookData)),
    chain(validated => service.updateById(validated.id, validated.body as E)),
  );

const deleteById = <E>(service: Service<E>) => (
  id: string,
): TaskEither<ServiceError, boolean> =>
  pipe(
    id,
    validateObjectId,
    chain(validated => service.deleteById(validated.id)),
  );

const findById = <E>(service: Service<E>) => (id: string) =>
  pipe(
    id,
    validateObjectId,
    chain(validated => service.findById(validated.id)),
  );

export const getController = <E, T extends Props>(
  service: Service<E>,
  bookType: TypeC<T>,
): Controller<E> => ({
  create: create(service, bookType),
  updateById: updateById(service, bookType),
  deleteById: deleteById(service),
  findById: findById(service),
});

import { pipe } from 'fp-ts/function';
import {
  TaskEither,
  fromEither,
  mapLeft,
  chain,
  right,
  left,
} from 'fp-ts/TaskEither';

import { Controller, Service, ServiceError, filterBody } from '@/base';
import { Id, validateObjectId } from '@/database';
import { Book, book } from './entity';

const create = (service: Service<Book>, bookType: typeof book) => (
  body: object,
): TaskEither<ServiceError, Id> =>
  pipe(
    body,
    filterBody(bookType.props),
    bookType.decode,
    fromEither,
    mapLeft((errors): ServiceError => ({ error: errors.toString() })),
    chain(bookData => service.create(bookData)),
  );

const updateById = (service: Service<Book>, bookType: typeof book) => (
  id: string,
  body: object,
): TaskEither<ServiceError, Book> =>
  pipe(
    body,
    filterBody(bookType.props),
    bookType.decode,
    fromEither,
    mapLeft((errors): ServiceError => ({ error: errors.toString() })),
    chain(bookData =>
      validateObjectId(id)
        ? right(bookData)
        : left({ error: 'Invalid Id parameter' }),
    ),
    chain(bookData => service.updateById(id, bookData)),
  );

const deleteById = (service: Service<Book>) => (
  id: string,
): TaskEither<ServiceError, boolean> =>
  pipe(
    id,
    validateObjectId,
    isValidId =>
      isValidId
        ? right(id)
        : left({ error: 'Invalid Id parameter' } as ServiceError),
    chain(idData => service.deleteById(idData)),
  );

const findById = (service: Service<Book>) => (id: string) =>
  pipe(
    id,
    validateObjectId,
    isValidId =>
      isValidId
        ? right(id)
        : left({ error: 'Invalid Id parameter' } as ServiceError),
    chain(idData => service.findById(idData)),
  );

export const getController = (
  service: Service<Book>,
  bookType: typeof book,
): Controller<Book> => ({
  create: create(service, bookType),
  updateById: updateById(service, bookType),
  deleteById: deleteById(service),
  findById: findById(service),
});

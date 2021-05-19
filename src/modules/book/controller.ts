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

export const getController = (
  service: Service<Book>,
  bookType: typeof book,
): Controller<Book> => ({
  create: create(service, bookType),
  updateById: updateById(service, bookType),
});

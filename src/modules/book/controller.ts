import { pipe } from 'fp-ts/function';
import { TaskEither, fromEither, mapLeft, chain } from 'fp-ts/TaskEither';

import { Controller, Service, ServiceError, filterBody } from '@/base';
import { Id } from '@/database';
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

export const getController = (
  service: Service<Book>,
  bookType: typeof book,
): Controller<Book> => ({
  create: create(service, bookType),
});

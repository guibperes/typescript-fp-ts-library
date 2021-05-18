import { pipe } from 'fp-ts/function';
import { Either } from 'fp-ts/Either';
import { Controller, Service, ServiceError, filterBody } from '@/base';
import { Id } from '@/database';
import { Book, book } from './entity';

const create = (service: Service<Book>) => async (
  body: object,
): Promise<Either<ServiceError, Id>> =>
  pipe(body, filterBody(book.props), book.decode);

export const getController = (service: Service<Book>): Controller<Book> => ({
  create: create(service),
});

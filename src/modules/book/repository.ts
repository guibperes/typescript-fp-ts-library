import { getConnection, getRepository } from '@/database';
import { Book } from './entity';

export const bookRepository = getRepository<Book>(
  getConnection(),
  'library',
  'Books',
);

import { getConnection, getRepository } from '@/database';

type Book = {
  title: string;
  pages: number;
};

export const bookRepository = getRepository<Book>(
  getConnection(),
  'library',
  'Books',
);

import { getService } from '@/base';
import { Book } from './entity';
import { bookRepository } from './repository';

export const bookService = getService<Book>(bookRepository);

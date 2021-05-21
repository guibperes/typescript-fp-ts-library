import { getController } from '@/base';
import { book } from './entity';
import { bookService } from './service';

export const bookController = getController(bookService, book);

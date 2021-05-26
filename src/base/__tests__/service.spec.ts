import { getOrElse } from 'fp-ts/Either';

import {
  getRepositoryMock,
  getRepositoryErrorMock,
} from '@/database/__mocks__';
import { Id } from '@/database';
import { getService } from '../service';

type BookTest = {
  title: string;
  pages: number;
};

const repository = getRepositoryMock<BookTest>();
const errorRepository = getRepositoryErrorMock<BookTest>();

const service = getService(repository);
const errorService = getService(errorRepository);

describe('Service tests', () => {
  it('should send entity info to repository and return a ObjectId', async () => {
    const resultEither = await service.create({
      title: 'Some book',
      pages: 100,
    })();

    const result = getOrElse(error => error)(resultEither) as Id;

    expect(resultEither).toBeDefined();
    expect(resultEither['_tag']).toBe('Right');
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(result.id.length).toBeGreaterThan(0);
  });
});

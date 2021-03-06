import { getOrElse } from 'fp-ts/Either';

import {
  getRepositoryMock,
  getRepositoryErrorMock,
  getObjectIdFromDate,
} from '@/database/__mocks__';
import { Id } from '@/database';
import { getService } from '../service';
import { ServiceError } from '../error';

type BookTest = {
  id?: string;
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

  it('should send id and entity to repository and return updated entity', async () => {
    const id = getObjectIdFromDate();
    const resultEither = await service.updateById(id, {
      title: 'Some book',
      pages: 100,
    })();

    const result = getOrElse(error => error)(resultEither) as BookTest;

    expect(resultEither).toBeDefined();
    expect(resultEither['_tag']).toBe('Right');
    expect(result).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(result.title).toBe('Some book');
    expect(result.pages).toBe(100);
  });

  it('should send id to repository and delete from database and return true', async () => {
    const id = getObjectIdFromDate();
    const resultEither = await service.deleteById(id)();
    const result = getOrElse(error => error)(resultEither) as boolean;

    expect(resultEither).toBeDefined();
    expect(resultEither['_tag']).toBe('Right');
    expect(result).toBeDefined();
    expect(typeof result).toBe('boolean');
    expect(result).toBeTruthy();
  });

  it('should send id to repositoty and return from database a valid entity', async () => {
    const id = getObjectIdFromDate();
    const resultEither = await service.findById(id)();
    const result = getOrElse(error => error)(resultEither) as BookTest;

    expect(resultEither).toBeDefined();
    expect(resultEither['_tag']).toBe('Right');
    expect(result).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(result.id).toStrictEqual(id);
  });

  it('should send entity to repository and return service error', async () => {
    const resultEither = await errorService.create({
      title: 'Some book',
      pages: 100,
    })();

    const result = getOrElse(error => error)(resultEither) as ServiceError;

    expect(resultEither).toBeDefined();
    expect(resultEither['_tag']).toBe('Left');
    expect(result).toBeDefined();
    expect(result.error).toBeDefined();
    expect(typeof result.error).toBe('string');
  });

  it('should send id and entity to repository and return service error', async () => {
    const id = getObjectIdFromDate();
    const resultEither = await errorService.updateById(id, {
      title: 'Some book',
      pages: 100,
    })();

    const result = getOrElse(error => error)(resultEither) as ServiceError;

    expect(resultEither).toBeDefined();
    expect(resultEither['_tag']).toBe('Left');
    expect(result).toBeDefined();
    expect(result.error).toBeDefined();
    expect(typeof result.error).toBe('string');
  });

  it('should send id to repository and return service error', async () => {
    const id = getObjectIdFromDate();
    const resultEither = await errorService.deleteById(id)();
    const result = getOrElse(error => error)(resultEither) as ServiceError;

    expect(resultEither).toBeDefined();
    expect(resultEither['_tag']).toBe('Left');
    expect(result).toBeDefined();
    expect(result.error).toBeDefined();
    expect(typeof result.error).toBe('string');
  });

  it('should send id to repository and return service error', async () => {
    const id = getObjectIdFromDate();
    const resultEither = await errorService.findById(id)();
    const result = getOrElse(error => error)(resultEither) as ServiceError;

    expect(resultEither).toBeDefined();
    expect(resultEither['_tag']).toBe('Left');
    expect(result).toBeDefined();
    expect(result.error).toBeDefined();
    expect(typeof result.error).toBe('string');
  });
});

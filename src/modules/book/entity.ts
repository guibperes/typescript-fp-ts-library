import * as T from 'io-ts';

export const book = T.type({ title: T.string, pages: T.number });
export type Book = T.TypeOf<typeof book>;

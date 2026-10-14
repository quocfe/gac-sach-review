import { expect, it } from 'vitest';
import { books, bySlug, searchBooks } from '@/lib/catalog';
it('excludes the removed work from catalog, search and detail', () => {
  expect(books.some(b => b.slug === 'noi-buon-chien-tranh')).toBe(false);
  expect(bySlug('noi-buon-chien-tranh')).toBeUndefined();
  expect(searchBooks('Nỗi Buồn Chiến Tranh')).toEqual([]);
  expect(bySlug('dune')?.id).toBe('w5');
});

import { describe, expect, it } from 'vitest';
import { normalizeSearch, isValidIsbn, ratingAfterUpsert, transitionReview } from './domain';

describe('catalog domain', () => {
  it('normalizes Vietnamese search accents and ISBN punctuation', () => {
    expect(normalizeSearch('Đắc Nhân Tâm')).toBe('dac nhan tam');
    expect(isValidIsbn('978-0-06-112008-4')).toBe(true);
    expect(isValidIsbn('abc')).toBe(false);
  });
  it('replaces a user rating instead of duplicating it', () => {
    expect(ratingAfterUpsert([{ userId: 'u1', workId: 'w1', value: 3 }], { userId: 'u1', workId: 'w1', value: 5 })).toEqual([{ userId: 'u1', workId: 'w1', value: 5 }]);
  });
});

describe('review moderation lifecycle', () => {
  it('sends every submitted review to pending and published edits back to pending', () => {
    expect(transitionReview('draft', 'submit')).toBe('pending');
    expect(transitionReview('published', 'edit')).toBe('pending');
  });
  it('only permits moderator outcomes from pending', () => {
    expect(transitionReview('pending', 'publish')).toBe('published');
    expect(() => transitionReview('draft', 'publish')).toThrow();
  });
});

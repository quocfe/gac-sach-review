import { describe, expect, it } from 'vitest';
import { BookshelfService, RatingService, ReviewService } from '@/lib/services';

describe('domain invariants', () => {
  it('upserts one rating per user and work and recalculates aggregate', () => {
    const ratings = new RatingService();
    ratings.upsert('member', 'work-1', 3);
    const result = ratings.upsert('member', 'work-1', 5);
    expect(result.count).toBe(1);
    expect(result.average).toBe(5);
  });
  it('keeps one bookshelf entry per user/work and progress only while reading', () => {
    const shelves = new BookshelfService();
    shelves.save('member', 'work-1', 'want_to_read', 20);
    expect(shelves.get('member', 'work-1')).toMatchObject({ status: 'want_to_read', progress: undefined });
    shelves.save('member', 'work-1', 'reading', 62);
    expect(shelves.get('member', 'work-1')).toMatchObject({ status: 'reading', progress: 62 });
  });
  it('sends every submission and published edit to pending', () => {
    const reviews = new ReviewService();
    const review = reviews.submit({ userId: 'member', workId: 'work-1', title: 'Hay', body: 'Nội dung' });
    expect(review.status).toBe('pending');
    reviews.moderate('moderator', review.id, 'published', 'Đã kiểm tra');
    expect(reviews.edit('member', review.id, { body: 'Đã sửa' }).status).toBe('pending');
    expect(() => reviews.edit('other', review.id, { body: 'x' })).toThrow(/owner/);
  });
  it('allows only moderator moderation and records audit', () => {
    const reviews = new ReviewService(); const review = reviews.submit({ userId: 'member', workId: 'work-1', title: 'Hay', body: 'Nội dung' });
    expect(() => reviews.moderate('member', review.id, 'published', 'x')).toThrow(/moderator/);
    reviews.moderate('moderator', review.id, 'published', 'OK');
    expect(reviews.audit()).toHaveLength(1);
  });
});

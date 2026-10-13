import { describe, expect, it } from 'vitest';
import { ContentReportService, sanitizeReviewHtml, SlidingWindowRateLimiter } from '@/lib/operations';

describe('phase 5 moderation operations', () => {
  it('prevents a duplicate report by the same user for same review and reason', () => {
    const reports = new ContentReportService();
    reports.create({ reporterId: 'member', reviewId: 'r1', reason: 'spoiler' });
    expect(() => reports.create({ reporterId: 'member', reviewId: 'r1', reason: 'spoiler' })).toThrow(/duplicate/i);
    expect(reports.create({ reporterId: 'member', reviewId: 'r1', reason: 'harassment' }).id).toBeTruthy();
  });
  it('removes script content and event handlers from review markup', () => {
    expect(sanitizeReviewHtml('<p onclick="alert(1)">Đọc</p><script>alert(1)</script>')).toBe('<p>Đọc</p>');
  });
  it('enforces a request limit within a window', () => {
    const limiter = new SlidingWindowRateLimiter(2, 60_000);
    expect(limiter.allow('member').allowed).toBe(true);
    expect(limiter.allow('member').allowed).toBe(true);
    expect(limiter.allow('member').allowed).toBe(false);
  });
});

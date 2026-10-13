import { describe, expect, it } from 'vitest';
import { AffiliateOffer, isAffiliateOfferActive, validateCoverUpload } from '@/lib/release';

describe('phase 6 release safety', () => {
  it('does not activate affiliate offer outside its valid period', () => {
    const offer: AffiliateOffer = { partner: 'Book Partner', territory: 'VN', editionId: 'e1', url: 'https://partner.example/book', disclosure: 'Liên kết đối tác', startsAt: '2030-01-01', endsAt: '2030-12-31', active: false };
    expect(isAffiliateOfferActive(offer, new Date('2029-12-31'))).toBe(false);
    expect(isAffiliateOfferActive({ ...offer, active: true }, new Date('2030-06-01'))).toBe(true);
  });
  it('accepts only safe image MIME types and sizes for cover uploads', () => {
    expect(validateCoverUpload({ type: 'image/webp', size: 3_000_000 })).toEqual({ valid: true });
    expect(validateCoverUpload({ type: 'image/svg+xml', size: 100 })).toMatchObject({ valid: false });
    expect(validateCoverUpload({ type: 'image/jpeg', size: 8_000_001 })).toMatchObject({ valid: false });
  });
});

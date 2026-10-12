export type ReviewStatus = 'draft' | 'pending' | 'published' | 'hidden' | 'rejected';
export type ReviewAction = 'submit' | 'edit' | 'publish' | 'hide' | 'reject';
export type Rating = { userId: string; workId: string; value: number };
export const normalizeSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
export const isValidIsbn = (value: string) => /^(?:\d[- ]?){10,13}[\dX]$/i.test(value.replace(/[- ]/g, ''));
export const ratingAfterUpsert = (ratings: Rating[], next: Rating) => [...ratings.filter(r => !(r.userId === next.userId && r.workId === next.workId)), next];
export function transitionReview(status: ReviewStatus, action: ReviewAction): ReviewStatus {
  const allowed: Record<ReviewStatus, Partial<Record<ReviewAction, ReviewStatus>>> = {
    draft: { submit: 'pending' }, pending: { publish: 'published', hide: 'hidden', reject: 'rejected' },
    published: { edit: 'pending', hide: 'hidden' }, hidden: {}, rejected: {},
  };
  const next = allowed[status][action]; if (!next) throw new Error(`Cannot ${action} a ${status} review`); return next;
}

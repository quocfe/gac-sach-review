export type ReportReason = 'spoiler' | 'harassment' | 'hate' | 'spam' | 'copyright' | 'other';
export type ContentReport = { id: string; reporterId: string; reviewId: string; reason: ReportReason; note?: string; createdAt: string };

export class ContentReportService {
  private reports: ContentReport[] = [];
  create(input: Omit<ContentReport, 'id' | 'createdAt'>) {
    if (this.reports.some(r => r.reporterId === input.reporterId && r.reviewId === input.reviewId && r.reason === input.reason)) throw new Error('duplicate report');
    const report = { ...input, id: `report-${this.reports.length + 1}`, createdAt: new Date().toISOString() };
    this.reports.push(report); return report;
  }
  list() { return [...this.reports]; }
}

export class SlidingWindowRateLimiter {
  private hits = new Map<string, number[]>();
  constructor(private readonly limit: number, private readonly windowMs: number) {}
  allow(key: string, now = Date.now()) {
    const current = (this.hits.get(key) ?? []).filter(hit => now - hit < this.windowMs);
    if (current.length >= this.limit) { this.hits.set(key, current); return { allowed: false, retryAfterMs: this.windowMs - (now - current[0]) }; }
    current.push(now); this.hits.set(key, current); return { allowed: true, retryAfterMs: 0 };
  }
}

export function sanitizeReviewHtml(value: string) {
  return value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '').replace(/javascript:/gi, '');
}

export function requestId() { return crypto.randomUUID(); }

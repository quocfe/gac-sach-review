import { NextResponse } from 'next/server';
import { ContentReportService, requestId, SlidingWindowRateLimiter } from '@/lib/operations';
const reports = new ContentReportService(); const limiter = new SlidingWindowRateLimiter(5, 60_000);
export async function POST(request: Request) {
  const requestIdValue = requestId(); const body = await request.json().catch(() => null);
  const reporterId = body?.reporterId ?? 'demo-member'; const gate = limiter.allow(`report:${reporterId}`);
  if (!gate.allowed) return NextResponse.json({ error: 'too many reports', requestId: requestIdValue }, { status: 429, headers: { 'Retry-After': String(Math.ceil(gate.retryAfterMs / 1000)) } });
  if (!body?.reviewId || !['spoiler','harassment','hate','spam','copyright','other'].includes(body.reason)) return NextResponse.json({ error: 'invalid report', requestId: requestIdValue }, { status: 400 });
  try { return NextResponse.json({ report: reports.create({ reporterId, reviewId: body.reviewId, reason: body.reason, note: typeof body.note === 'string' ? body.note.slice(0, 500) : undefined }), requestId: requestIdValue }, { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'report failed', requestId: requestIdValue }, { status: 409 }); }
}
export async function GET() { return NextResponse.json({ reports: reports.list(), requestId: requestId() }); }

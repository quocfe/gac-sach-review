import { NextResponse } from 'next/server'; import { requestId } from '@/lib/operations';
const startedAt = new Date().toISOString();
export async function GET() { return NextResponse.json({ status: 'ok', startedAt, uptimeSeconds: Math.floor(process.uptime()), requestId: requestId() }); }
